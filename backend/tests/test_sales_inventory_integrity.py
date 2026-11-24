r"""Sales and inventory integrity tests using isolated in-memory SQLite."""

from itertools import count
import unittest

from test_config import apply_test_environment

apply_test_environment()
from unittest.mock import patch

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


MYSQL_GUARD = "pymysql.connections.Connection.connect"

with patch("dotenv.load_dotenv", return_value=False), patch(
    MYSQL_GUARD, side_effect=AssertionError("Tests must never connect to MySQL")
):
    from app.core.security import get_password_hash
    from app.db.base import Base
    from app.db.database import get_db
    from app.models.inventory import InventoryMovement
    from app.models.customer import Customer
    from app.models.product import Product
    from app.models.sales import Sale, SaleItem
    from app.models.user import User
    from main import app


class SalesInventoryIntegrityTests(unittest.TestCase):
    password = "SalesIntegrityPassword123!"

    def setUp(self):
        mysql_guard = patch(MYSQL_GUARD, side_effect=AssertionError("Tests must never connect to MySQL"))
        mysql_guard.start()
        self.addCleanup(mysql_guard.stop)
        self.engine = create_engine(
            "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
        )
        self.addCleanup(self.engine.dispose)

        @event.listens_for(self.engine, "connect")
        def enable_foreign_keys(connection, connection_record):
            connection.execute("PRAGMA foreign_keys=ON")

        Base.metadata.create_all(bind=self.engine)
        self.sessions = sessionmaker(bind=self.engine, autoflush=False)
        with self.sessions() as db:
            admin = User(full_name="Test Admin", username="admin", email="admin@example.com",
                         password=get_password_hash(self.password), role="Admin", is_active=True)
            manager = User(full_name="Test Manager", username="manager", email="manager@example.com",
                           password=get_password_hash(self.password), role="Manager", is_active=True)
            cashier = User(full_name="Test Cashier", username="cashier", email="cashier@example.com",
                           password=get_password_hash(self.password), role="Cashier", is_active=True)
            products = [
                Product(sku="SALE-ONE", name="Sale One", quantity=10, cost_price=2, selling_price=5),
                Product(sku="SALE-TWO", name="Sale Two", quantity=3, cost_price=4, selling_price=8),
            ]
            db.add_all([admin, manager, cashier, *products])
            db.commit()
            self.product_ids = [product.id for product in products]

        def override_get_db():
            with self.sessions() as db:
                yield db

        previous = app.dependency_overrides.copy()
        self.addCleanup(lambda: (app.dependency_overrides.clear(), app.dependency_overrides.update(previous)))
        app.dependency_overrides[get_db] = override_get_db
        self.client = TestClient(app)
        self.addCleanup(self.client.close)
        sequence = count(1)
        invoice_patch = patch("app.services.sales_service.generate_invoice_number",
                              side_effect=lambda: f"TEST-SALE-{next(sequence):04d}")
        invoice_patch.start()
        self.addCleanup(invoice_patch.stop)
        login = self.client.post("/api/v1/auth/login", json={
            "username": "admin", "password": self.password,
        })
        self.assertEqual(login.status_code, 200, login.text)
        self.headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    def _checkout(self, items, **overrides):
        payload = {"items": items, "discount": 0, "tax_rate": 0, "payment_method": "Cash"}
        payload.update(overrides)
        return self.client.post("/api/v1/sales/checkout", json=payload, headers=self.headers)

    def test_checkout_updates_stock_and_movement_atomically(self):
        response = self._checkout([{"product_id": self.product_ids[0], "quantity": 2}])
        self.assertEqual(response.status_code, 201, response.text)
        with self.sessions() as db:
            self.assertEqual(db.get(Product, self.product_ids[0]).quantity, 8)
            movement = db.query(InventoryMovement).filter_by(reference_type="SALE").one()
            self.assertEqual((movement.quantity, movement.user_id), (-2, 1))

    def test_invalid_values_and_excess_discount_are_rejected_without_records(self):
        bad_items = [
            {"product_id": self.product_ids[0], "quantity": 0},
            {"product_id": self.product_ids[0], "quantity": 1, "unit_price": -1},
        ]
        for item in bad_items:
            with self.subTest(item=item):
                response = self._checkout([item])
                self.assertEqual(response.status_code, 422, response.text)
        response = self._checkout([{"product_id": self.product_ids[0], "quantity": 1}], discount=6)
        self.assertEqual(response.status_code, 422, response.text)
        with self.sessions() as db:
            self.assertEqual(db.query(Sale).count(), 0)
            self.assertEqual(db.query(SaleItem).count(), 0)
            self.assertEqual(db.query(InventoryMovement).count(), 0)
            self.assertEqual(db.get(Product, self.product_ids[0]).quantity, 10)

    def test_later_item_failure_rolls_back_entire_checkout(self):
        response = self._checkout([
            {"product_id": self.product_ids[0], "quantity": 2},
            {"product_id": self.product_ids[1], "quantity": 4},
        ])
        self.assertEqual(response.status_code, 400, response.text)
        with self.sessions() as db:
            self.assertEqual([db.get(Product, pid).quantity for pid in self.product_ids], [10, 3])
            self.assertEqual(db.query(Sale).count(), 0)
            self.assertEqual(db.query(InventoryMovement).count(), 0)

    def test_manual_adjustment_validates_and_records_delta(self):
        zero = self.client.post("/api/v1/inventory/adjust", json={
            "product_id": self.product_ids[0], "adjustment_type": "CORRECTION", "quantity_change": 0,
        }, headers=self.headers)
        self.assertEqual(zero.status_code, 422, zero.text)
        result = self.client.post("/api/v1/inventory/adjust", json={
            "product_id": self.product_ids[0], "adjustment_type": "DAMAGE", "quantity_change": -3,
        }, headers=self.headers)
        self.assertEqual(result.status_code, 201, result.text)
        with self.sessions() as db:
            self.assertEqual(db.get(Product, self.product_ids[0]).quantity, 7)
            self.assertEqual(db.query(InventoryMovement).one().quantity, -3)

    def test_product_quantity_edit_records_movement_and_invalid_create_is_rejected(self):
        invalid = self.client.post("/api/v1/products/", json={
            "name": "Invalid Product", "selling_price": 1, "cost_price": -1, "quantity": -1,
        }, headers=self.headers)
        self.assertEqual(invalid.status_code, 422, invalid.text)
        updated = self.client.put(f"/api/v1/products/{self.product_ids[0]}", json={
            "quantity": 14,
        }, headers=self.headers)
        self.assertEqual(updated.status_code, 200, updated.text)
        with self.sessions() as db:
            movement = db.query(InventoryMovement).filter_by(reference_type="PRODUCT_EDIT").one()
            self.assertEqual((movement.quantity, movement.user_id), (4, 1))

    def test_product_server_search_and_pagination_reach_records_beyond_500(self):
        with self.sessions() as db:
            db.add_all([
                Product(
                    sku=f"BULK-{index:04d}", name=f"Bulk Product {index:04d}",
                    quantity=1, cost_price=1, selling_price=2, is_active=True,
                )
                for index in range(505)
            ])
            db.commit()

        page = self.client.get(
            "/api/v1/products/?skip=500&limit=25&active_only=true", headers=self.headers
        )
        self.assertEqual(page.status_code, 200, page.text)
        self.assertGreater(len(page.json()), 0)
        searched = self.client.get(
            "/api/v1/products/?search=BULK-0504&limit=25&active_only=true", headers=self.headers
        )
        self.assertEqual(searched.status_code, 200, searched.text)
        self.assertEqual([product["sku"] for product in searched.json()], ["BULK-0504"])

    def test_void_preserves_sale_and_can_only_restock_once(self):
        sale = self._checkout([{"product_id": self.product_ids[0], "quantity": 2}]).json()
        first = self.client.delete(f"/api/v1/sales/{sale['id']}", headers=self.headers)
        self.assertEqual(first.status_code, 200, first.text)
        second = self.client.delete(f"/api/v1/sales/{sale['id']}", headers=self.headers)
        self.assertEqual(second.status_code, 409, second.text)
        with self.sessions() as db:
            stored = db.get(Sale, sale["id"])
            self.assertIsNotNone(stored)
            self.assertEqual(stored.status, "Voided")
            self.assertEqual(db.get(Product, self.product_ids[0]).quantity, 10)
            self.assertEqual(db.query(InventoryMovement).filter_by(
                reference_type="SALE_VOID"
            ).count(), 1)

    def test_void_authorization_customer_points_and_analytics_are_consistent(self):
        with self.sessions() as db:
            customer = Customer(name="Void Customer", loyalty_points=0, is_active=True)
            db.add(customer)
            db.commit()
            customer_id = customer.id

        sale = self._checkout(
            [{"product_id": self.product_ids[0], "quantity": 2}], customer_id=customer_id
        ).json()
        cashier_login = self.client.post("/api/v1/auth/login", json={
            "username": "cashier", "password": self.password,
        })
        cashier_headers = {"Authorization": f"Bearer {cashier_login.json()['access_token']}"}
        forbidden = self.client.delete(f"/api/v1/sales/{sale['id']}", headers=cashier_headers)
        self.assertEqual(forbidden.status_code, 403, forbidden.text)

        before = self.client.get("/api/v1/dashboard/stats", headers=self.headers).json()
        self.assertEqual(before["total_orders"], 1)
        self.assertEqual(before["total_revenue"], 10)
        voided = self.client.delete(f"/api/v1/sales/{sale['id']}", headers=self.headers)
        self.assertEqual(voided.status_code, 200, voided.text)

        stored = self.client.get(f"/api/v1/sales/{sale['id']}", headers=self.headers)
        self.assertEqual(stored.status_code, 200, stored.text)
        self.assertEqual(stored.json()["status"], "Voided")
        after = self.client.get("/api/v1/dashboard/stats", headers=self.headers).json()
        report = self.client.get("/api/v1/reports/sales", headers=self.headers).json()
        self.assertEqual((after["total_orders"], after["total_revenue"]), (0, 0))
        self.assertEqual((report["total_orders"], report["total_net_sales"]), (0, 0))
        with self.sessions() as db:
            self.assertEqual(db.get(Customer, customer_id).loyalty_points, 0)
            self.assertEqual(db.get(Product, self.product_ids[0]).quantity, 10)

    def test_unconfigured_email_delivery_never_reports_false_success(self):
        sale = self._checkout([{"product_id": self.product_ids[0], "quantity": 1}]).json()
        response = self.client.post(
            f"/api/v1/sales/{sale['id']}/email",
            json={"email": "customer@example.com"},
            headers=self.headers,
        )
        self.assertEqual(response.status_code, 501, response.text)
        self.assertIn("not configured", response.json()["detail"])

    def test_manager_reports_use_discounted_tax_exclusive_revenue(self):
        result = self._checkout(
            [{"product_id": self.product_ids[0], "quantity": 2}], discount=2, tax_rate=10
        )
        self.assertEqual(result.status_code, 201, result.text)
        login = self.client.post("/api/v1/auth/login", json={
            "username": "manager", "password": self.password,
        })
        manager_headers = {"Authorization": f"Bearer {login.json()['access_token']}"}
        sales = self.client.get("/api/v1/reports/sales", headers=manager_headers)
        profit = self.client.get("/api/v1/reports/profit-loss", headers=manager_headers)
        inventory = self.client.get("/api/v1/reports/inventory", headers=manager_headers)
        self.assertEqual((sales.status_code, profit.status_code, inventory.status_code), (200, 200, 200))
        self.assertEqual(sales.json()["total_gross_sales"], 10)
        self.assertEqual(sales.json()["total_net_sales"], 8)
        self.assertEqual(sales.json()["total_tax"], 0.8)
        self.assertEqual(profit.json()["total_revenue"], 8)
        self.assertEqual(profit.json()["total_cogs"], 4)
        self.assertEqual(profit.json()["gross_profit"], 4)
        invalid = self.client.get(
            "/api/v1/reports/sales?start_date=2026-12-31&end_date=2026-01-01",
            headers=manager_headers,
        )
        self.assertEqual(invalid.status_code, 422, invalid.text)


if __name__ == "__main__":
    unittest.main()
