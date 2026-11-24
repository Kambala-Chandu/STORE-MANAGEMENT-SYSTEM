r"""Purchase inventory integration tests using only in-memory SQLite.

Run from backend:
    .\venv\Scripts\python.exe -B -m unittest discover -s tests -p test_purchase_inventory.py -v
"""

from itertools import count
import unittest

from test_config import apply_test_environment

apply_test_environment()
from unittest.mock import patch

from fastapi import HTTPException
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


MYSQL_GUARD = "pymysql.connections.Connection.connect"
MYSQL_ERROR = "Purchase tests must never connect to MySQL"

with patch("dotenv.load_dotenv", return_value=False), patch(
    MYSQL_GUARD, side_effect=AssertionError(MYSQL_ERROR)
):
    from app.core.security import get_password_hash
    from app.db.base import Base
    from app.db.database import get_db
    from app.models.inventory import InventoryMovement
    from app.models.product import Product
    from app.models.supplier import Supplier
    from app.models.user import User
    from app.schemas.purchase import PurchaseCreate
    from app.services.purchase_service import purchase_service
    from main import app


class PurchaseInventoryTests(unittest.TestCase):
    prefixes = ("/api/v1", "")
    password = "PurchaseTestPassword123!"

    @classmethod
    def setUpClass(cls):
        cls.password_hash = get_password_hash(cls.password)

    def setUp(self):
        mysql_guard = patch(MYSQL_GUARD, side_effect=AssertionError(MYSQL_ERROR))
        mysql_guard.start()
        self.addCleanup(mysql_guard.stop)
        for guard in (
            patch("main.seed_database", side_effect=AssertionError("No demo seeding in purchase tests")),
            patch.object(app.router, "lifespan_context",
                         side_effect=AssertionError("No application startup in purchase tests")),
        ):
            guarded_call = guard.start()
            self.addCleanup(guard.stop)
            self.addCleanup(guarded_call.assert_not_called)

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
            users = [User(
                full_name=f"Test {username}", username=username,
                email=f"{username}@example.com", password=self.password_hash,
                role=role, is_active=True,
            ) for username, role in (
                ("admin", "Admin"), ("manager", "Manager"),
                ("cashier", "Cashier"), ("inactive_admin", "Admin"),
            )]
            supplier = Supplier(name="Test Supplier")
            products = [
                Product(sku="TEST-ONE", name="Test Product One", quantity=10,
                        cost_price=2.5, selling_price=5.0),
                Product(sku="TEST-TWO", name="Test Product Two", quantity=20,
                        cost_price=6.0, selling_price=12.0),
            ]
            db.add_all([*users, supplier, *products])
            db.commit()
            self.user_ids = {user.username: user.id for user in users}
            self.supplier_id = supplier.id
            self.product_ids = [product.id for product in products]

        def override_get_db():
            with self.sessions() as db:
                yield db

        previous_overrides = app.dependency_overrides.copy()
        self.addCleanup(self._restore_overrides, previous_overrides)
        app.dependency_overrides[get_db] = override_get_db
        # Deliberately avoid the context manager, which would run startup.
        self.client = TestClient(app)
        self.addCleanup(self.client.close)
        self.auth_headers = {}
        # Eliminate random purchase-number collisions from unrelated tests.
        sequence = count(1)
        numbers = patch("app.services.purchase_service.generate_purchase_number",
                        side_effect=lambda: f"TEST-PO-{next(sequence):04d}")
        numbers.start()
        self.addCleanup(numbers.stop)

    @staticmethod
    def _restore_overrides(previous_overrides):
        app.dependency_overrides.clear()
        app.dependency_overrides.update(previous_overrides)

    def _headers(self, username="admin"):
        if username not in self.auth_headers:
            response = self.client.post("/api/v1/auth/login", json={
                "username": username, "password": self.password,
            })
            self.assertEqual(response.status_code, 200, response.text)
            self.auth_headers[username] = {
                "Authorization": f"Bearer {response.json()['access_token']}"
            }
        return self.auth_headers[username]

    def _payload(self, status="Received"):
        return {
            "supplier_id": self.supplier_id, "status": status, "tax_amount": 2.0,
            "items": [
                {"product_id": self.product_ids[0], "quantity": 3, "unit_cost": 4.0},
                {"product_id": self.product_ids[1], "quantity": 2, "unit_cost": 7.0},
            ],
        }

    def _create(self, prefix="/api/v1", status="Ordered", username="admin"):
        response = self.client.post(f"{prefix}/purchases/", json=self._payload(status),
                                    headers=self._headers(username))
        self.assertEqual(response.status_code, 201, response.text)
        return response.json()

    def _create_with_key(self, key, payload=None, username="admin", prefix="/api/v1"):
        headers = {**self._headers(username), "Idempotency-Key": key}
        return self.client.post(
            f"{prefix}/purchases/", json=payload or self._payload(), headers=headers
        )

    def _snapshot(self):
        with self.engine.connect() as connection:
            return {table.name: [tuple(row) for row in connection.execute(
                select(table).order_by(*table.primary_key.columns)
            )] for table in Base.metadata.sorted_tables}

    def _stock(self):
        with self.sessions() as db:
            return {product.id: (product.quantity, product.cost_price)
                    for product in db.query(Product).all()}

    def _assert_receipt(self, purchase, before_stock, username="admin"):
        self.assertEqual(purchase["status"], "Received")
        expected = self._payload()["items"]
        for item in expected:
            self.assertEqual(self._stock()[item["product_id"]], (
                before_stock[item["product_id"]][0] + item["quantity"], item["unit_cost"]
            ))
        with self.sessions() as db:
            movements = db.query(InventoryMovement).filter_by(
                reference_id=purchase["purchase_number"]
            ).all()
            self.assertCountEqual(
                [(m.product_id, m.quantity, m.unit_cost, m.movement_type,
                  m.reference_type, m.user_id) for m in movements],
                [(item["product_id"], item["quantity"], item["unit_cost"],
                  "PURCHASE", "PURCHASE", self.user_ids[username]) for item in expected],
            )

    def test_creation_status_controls_stock_cost_and_movements(self):
        for prefix in self.prefixes:
            for status in ("Ordered", "Received", "Cancelled"):
                with self.subTest(prefix=prefix, status=status):
                    before = self._snapshot()
                    stock = self._stock()
                    purchase = self._create(prefix, status)
                    self.assertEqual(purchase["status"], status)
                    self.assertEqual(purchase["subtotal"], 26.0)
                    self.assertEqual(purchase["tax_amount"], 2.0)
                    self.assertEqual(purchase["total_amount"], 28.0)
                    self.assertEqual(len(purchase["items"]), 2)
                    after = self._snapshot()
                    self.assertEqual(len(after["purchases"]), len(before["purchases"]) + 1)
                    self.assertEqual(len(after["purchase_items"]), len(before["purchase_items"]) + 2)
                    if status == "Received":
                        self._assert_receipt(purchase, stock)
                    else:
                        self.assertEqual(after["products"], before["products"])
                        self.assertEqual(after["inventory_movements"], before["inventory_movements"])

    def test_omitted_status_still_defaults_to_received(self):
        for prefix in self.prefixes:
            with self.subTest(prefix=prefix):
                payload = self._payload()
                del payload["status"]
                stock = self._stock()
                response = self.client.post(f"{prefix}/purchases/", json=payload,
                                            headers=self._headers())
                self.assertEqual(response.status_code, 201, response.text)
                self._assert_receipt(response.json(), stock)

    def test_identical_keyed_retry_returns_original_without_reapplying_stock(self):
        for prefix in self.prefixes:
            with self.subTest(prefix=prefix):
                key = f"identical-retry-{prefix or 'root'}"
                first = self._create_with_key(key, prefix=prefix)
                self.assertEqual(first.status_code, 201, first.text)
                after_first = self._snapshot()
                repeated = self._create_with_key(key, prefix=prefix)
                self.assertEqual(repeated.status_code, 201, repeated.text)
                self.assertEqual(repeated.json()["id"], first.json()["id"])
                self.assertEqual(repeated.json()["purchase_number"], first.json()["purchase_number"])
                self.assertEqual(self._snapshot(), after_first)

    def test_reusing_key_with_different_payload_returns_409_without_writes(self):
        key = "conflicting-purchase-payload"
        first = self._create_with_key(key)
        self.assertEqual(first.status_code, 201, first.text)
        before_conflict = self._snapshot()
        changed = self._payload()
        changed["items"][0]["quantity"] += 1
        response = self._create_with_key(key, payload=changed)
        self.assertEqual(response.status_code, 409, response.text)
        self.assertEqual(self._snapshot(), before_conflict)

    def test_key_is_scoped_to_user_and_omitted_requests_remain_unprotected(self):
        key = "same-key-different-users"
        admin = self._create_with_key(key, payload=self._payload("Ordered"), username="admin")
        manager = self._create_with_key(key, payload=self._payload("Ordered"), username="manager")
        self.assertEqual(admin.status_code, 201, admin.text)
        self.assertEqual(manager.status_code, 201, manager.text)
        self.assertNotEqual(admin.json()["id"], manager.json()["id"])

        unkeyed_one = self.client.post(
            "/api/v1/purchases/", json=self._payload("Ordered"), headers=self._headers()
        )
        unkeyed_two = self.client.post(
            "/api/v1/purchases/", json=self._payload("Ordered"), headers=self._headers()
        )
        self.assertEqual(unkeyed_one.status_code, 201, unkeyed_one.text)
        self.assertEqual(unkeyed_two.status_code, 201, unkeyed_two.text)
        self.assertNotEqual(unkeyed_one.json()["id"], unkeyed_two.json()["id"])

    def test_failed_keyed_request_rolls_back_and_key_can_be_retried(self):
        key = "retry-after-complete-rollback"
        invalid = self._payload()
        invalid["items"][1]["product_id"] = 999999
        before = self._snapshot()
        failed = self._create_with_key(key, payload=invalid)
        self.assertEqual(failed.status_code, 404, failed.text)
        self.assertEqual(self._snapshot(), before)

        successful = self._create_with_key(key)
        self.assertEqual(successful.status_code, 201, successful.text)

    def test_invalid_status_and_negative_tax_are_rejected_without_writes(self):
        before = self._snapshot()
        for prefix in self.prefixes:
            for changes in ({"status": "Unknown"}, {"status": "received"},
                            {"status": ""}, {"status": None}, {"tax_amount": -1.0}):
                with self.subTest(prefix=prefix, changes=changes):
                    response = self.client.post(f"{prefix}/purchases/",
                        json={**self._payload(), **changes}, headers=self._headers())
                    self.assertEqual(response.status_code, 422, response.text)
                    self.assertEqual(self._snapshot(), before)

    def test_ordered_purchase_is_received_once_and_repeat_is_rejected(self):
        for prefix in self.prefixes:
            with self.subTest(prefix=prefix):
                purchase = self._create(prefix)
                stock = self._stock()
                url = f"{prefix}/purchases/{purchase['id']}/receive"
                response = self.client.post(url, headers=self._headers())
                self.assertEqual(response.status_code, 200, response.text)
                self._assert_receipt(response.json(), stock)
                before_repeat = self._snapshot()
                repeated = self.client.post(url, headers=self._headers())
                self.assertEqual(repeated.status_code, 409, repeated.text)
                self.assertEqual(self._snapshot(), before_repeat)

    def test_cancelled_and_received_purchases_cannot_be_received(self):
        for prefix in self.prefixes:
            for status in ("Cancelled", "Received"):
                with self.subTest(prefix=prefix, status=status):
                    purchase = self._create(prefix, status)
                    before = self._snapshot()
                    response = self.client.post(
                        f"{prefix}/purchases/{purchase['id']}/receive", headers=self._headers()
                    )
                    self.assertEqual(response.status_code, 409, response.text)
                    self.assertEqual(self._snapshot(), before)

    def test_legacy_ordered_purchase_requires_review_without_stock_changes(self):
        for prefix in self.prefixes:
            with self.subTest(prefix=prefix):
                purchase = self._create(prefix)
                # Reproduce an old Ordered purchase whose stock was already credited.
                with self.sessions() as db:
                    for item in self._payload()["items"]:
                        product = db.get(Product, item["product_id"])
                        product.quantity += item["quantity"]
                        product.cost_price = item["unit_cost"]
                        db.add(InventoryMovement(
                            product_id=product.id, movement_type="PURCHASE",
                            quantity=item["quantity"], unit_cost=item["unit_cost"],
                            reference_id=purchase["purchase_number"], reference_type="PURCHASE",
                            user_id=self.user_ids["admin"], notes="Legacy purchase movement",
                        ))
                    db.commit()
                before = self._snapshot()
                response = self.client.post(
                    f"{prefix}/purchases/{purchase['id']}/receive", headers=self._headers()
                )
                self.assertEqual(response.status_code, 409, response.text)
                self.assertIn("review", response.json()["detail"].lower())
                self.assertEqual(self._snapshot(), before)

    def test_invalid_later_product_rolls_back_the_entire_http_request(self):
        before = self._snapshot()
        for prefix in self.prefixes:
            with self.subTest(prefix=prefix):
                payload = self._payload()
                payload["items"][1]["product_id"] = 999999
                response = self.client.post(f"{prefix}/purchases/", json=payload,
                                            headers=self._headers())
                self.assertEqual(response.status_code, 404, response.text)
                self.assertEqual(self._snapshot(), before)

    def test_invalid_later_product_leaves_reused_service_session_clean(self):
        payload = self._payload()
        payload["items"][1]["product_id"] = 999999
        before = self._snapshot()
        with self.sessions() as db:
            with self.assertRaises(HTTPException) as error:
                purchase_service.create_purchase(db, PurchaseCreate(**payload),
                                                 user_id=self.user_ids["admin"])
            self.assertEqual(error.exception.status_code, 404)
            self.assertFalse(db.in_transaction())
            db.commit()
        self.assertEqual(self._snapshot(), before)

    def test_commit_failure_rolls_back_create_and_receive_in_reused_sessions(self):
        for operation in ("create", "receive"):
            with self.subTest(operation=operation):
                purchase = self._create() if operation == "receive" else None
                before = self._snapshot()
                with self.sessions() as db:
                    with patch.object(db, "commit", side_effect=RuntimeError("Test commit failure")):
                        with self.assertRaisesRegex(RuntimeError, "Test commit failure"):
                            if operation == "create":
                                purchase_service.create_purchase(
                                    db, PurchaseCreate(**self._payload()), self.user_ids["admin"]
                                )
                            else:
                                purchase_service.receive_purchase(
                                    db, purchase["id"], self.user_ids["admin"]
                                )
                    self.assertFalse(db.in_transaction())
                    db.commit()
                self.assertEqual(self._snapshot(), before)

    def test_admin_and_manager_can_create_and_receive(self):
        for prefix in self.prefixes:
            for username in ("admin", "manager"):
                with self.subTest(prefix=prefix, username=username):
                    purchase = self._create(prefix, username=username)
                    stock = self._stock()
                    response = self.client.post(
                        f"{prefix}/purchases/{purchase['id']}/receive",
                        headers=self._headers(username),
                    )
                    self.assertEqual(response.status_code, 200, response.text)
                    self._assert_receipt(response.json(), stock, username)

    def test_anonymous_cashier_and_inactive_users_cannot_create_or_receive(self):
        purchase = self._create()
        inactive_headers = self._headers("inactive_admin")
        with self.sessions() as db:
            db.get(User, self.user_ids["inactive_admin"]).is_active = False
            db.commit()
        before = self._snapshot()
        for prefix in self.prefixes:
            for name, headers, expected_status in (
                ("anonymous", {}, 401), ("cashier", self._headers("cashier"), 403),
                ("inactive", inactive_headers, 403),
            ):
                with self.subTest(prefix=prefix, caller=name):
                    created = self.client.post(f"{prefix}/purchases/",
                                               json=self._payload(), headers=headers)
                    self.assertEqual(created.status_code, expected_status, created.text)
                    received = self.client.post(
                        f"{prefix}/purchases/{purchase['id']}/receive", headers=headers
                    )
                    self.assertEqual(received.status_code, expected_status, received.text)
                    self.assertEqual(self._snapshot(), before)

    def test_missing_purchase_receive_returns_404_without_writes(self):
        before = self._snapshot()
        for prefix in self.prefixes:
            with self.subTest(prefix=prefix):
                response = self.client.post(f"{prefix}/purchases/999999/receive",
                                            headers=self._headers())
                self.assertEqual(response.status_code, 404, response.text)
                self.assertEqual(self._snapshot(), before)


if __name__ == "__main__":
    unittest.main()
