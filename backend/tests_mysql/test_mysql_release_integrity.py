"""Release integrity tests for an explicitly disposable MySQL database.

Set SMS_MYSQL_TEST_CONFIG to a JSON file containing host, port, database,
user, and password. Safety checks reject non-loopback hosts, port 3306, and
database names outside the sms_test_* namespace.
"""

import json
import os
import threading
import unittest

from test_config import apply_test_environment

apply_test_environment()
from concurrent.futures import ThreadPoolExecutor
from itertools import count
from pathlib import Path
from unittest.mock import patch
from urllib.parse import quote_plus

from alembic import command
from alembic.config import Config
from fastapi import HTTPException
from sqlalchemy import MetaData, create_engine
from sqlalchemy.orm import sessionmaker

from app.core.security import get_password_hash
from app.db.base import Base
from app.models.inventory import InventoryMovement
from app.models.product import Product
from app.models.purchase import Purchase, PurchaseItem
from app.models.sales import Sale
from app.models.supplier import Supplier
from app.models.user import User
import app.models  # noqa: F401
from app.schemas.inventory import StockAdjustmentCreate
from app.schemas.purchase import PurchaseCreate
from app.schemas.sales import SaleCreate
from app.services.inventory_service import inventory_service
from app.services.purchase_service import PurchaseService, purchase_service
from app.services.sales_service import sales_service
from app.verify_migration_baseline import verify_baseline_compatibility
from migrations.schema import BASELINE_METADATA, purchases as baseline_purchases


CONFIG_PATH = os.getenv("SMS_MYSQL_TEST_CONFIG")
BACKEND_DIR = Path(__file__).resolve().parents[1]


@unittest.skipUnless(CONFIG_PATH, "requires an explicitly disposable MySQL config")
class MySQLReleaseIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        config = json.loads(Path(CONFIG_PATH).read_text(encoding="utf-8-sig"))
        if config["host"] not in {"127.0.0.1", "localhost"}:
            raise RuntimeError("MySQL integration tests require a loopback host")
        if int(config["port"]) == 3306:
            raise RuntimeError("MySQL integration tests refuse the standard MySQL port")
        if not config["database"].startswith("sms_test_"):
            raise RuntimeError("MySQL integration tests require an sms_test_* database")

        cls.url = (
            f"mysql+pymysql://{quote_plus(config['user'])}:"
            f"{quote_plus(config['password'])}@{config['host']}:"
            f"{int(config['port'])}/{config['database']}"
        )
        cls.engine = create_engine(cls.url, pool_pre_ping=True)
        cls.sessions = sessionmaker(bind=cls.engine, autoflush=False, expire_on_commit=False)
        cls.alembic = Config(str(BACKEND_DIR / "alembic.ini"))
        cls.alembic.set_main_option("script_location", str(BACKEND_DIR / "migrations"))
        cls.alembic.set_main_option("sqlalchemy.url", cls.url.replace("%", "%%"))

    @classmethod
    def tearDownClass(cls):
        cls._drop_everything()
        cls.engine.dispose()

    @classmethod
    def _drop_everything(cls):
        with cls.engine.begin() as connection:
            connection.exec_driver_sql("SET FOREIGN_KEY_CHECKS=0")
            metadata = MetaData()
            metadata.reflect(connection)
            metadata.drop_all(connection)
            connection.exec_driver_sql("SET FOREIGN_KEY_CHECKS=1")

    def setUp(self):
        self._drop_everything()
        command.upgrade(self.alembic, "head")
        with self.sessions() as db:
            self.user = User(
                full_name="MySQL Admin", username="mysql_admin",
                email="mysql-admin@example.test", password=get_password_hash("MySQLTest123!"),
                role="Admin", is_active=True,
            )
            self.supplier = Supplier(name="MySQL Test Supplier")
            self.product = Product(
                sku="MYSQL-PRODUCT", name="MySQL Product", quantity=10,
                cost_price=2.0, selling_price=5.0, is_active=True,
            )
            db.add_all([self.user, self.supplier, self.product])
            db.commit()
            self.user_id = self.user.id
            self.supplier_id = self.supplier.id
            self.product_id = self.product.id

    def _purchase_payload(self, *, quantity=3, status="Received"):
        return PurchaseCreate(
            supplier_id=self.supplier_id, status=status, tax_amount=1.0,
            items=[{"product_id": self.product_id, "quantity": quantity, "unit_cost": 4.0}],
        )

    @staticmethod
    def _number_generator(prefix):
        sequence = count(1)
        lock = threading.Lock()

        def generate():
            with lock:
                return f"{prefix}-{next(sequence):06d}"
        return generate

    def test_fresh_migrations_match_models(self):
        command.check(self.alembic)
        with self.engine.connect() as connection:
            version = connection.exec_driver_sql(
                "SELECT version_num FROM alembic_version"
            ).scalar_one()
        self.assertEqual(version, "0002_purchase_idempotency")

    def test_existing_baseline_adoption_preserves_historical_purchase(self):
        self._drop_everything()
        BASELINE_METADATA.create_all(self.engine)
        with self.engine.begin() as connection:
            connection.execute(baseline_purchases.insert().values(
                purchase_number="MYSQL-HISTORICAL-1", subtotal=12.0,
                tax_amount=0.0, total_amount=12.0, status="Ordered",
            ))
            verify_baseline_compatibility(connection)
        command.stamp(self.alembic, "0001_v1_schema_baseline")
        command.upgrade(self.alembic, "head")
        command.check(self.alembic)
        with self.engine.connect() as connection:
            value = connection.exec_driver_sql(
                "SELECT purchase_number FROM purchases WHERE purchase_number=%s",
                ("MYSQL-HISTORICAL-1",),
            ).scalar_one()
        self.assertEqual(value, "MYSQL-HISTORICAL-1")

    def test_concurrent_identical_purchase_creates_one_stock_effect(self):
        key = "mysql-concurrent-identical"
        payload = self._purchase_payload()
        barrier = threading.Barrier(2)
        local = threading.local()
        original_lookup = PurchaseService._idempotent_purchase

        def synchronized_lookup(db, user_id, supplied_key):
            result = original_lookup(db, user_id, supplied_key)
            if not getattr(local, "initial_lookup_done", False):
                local.initial_lookup_done = True
                barrier.wait(timeout=10)
            return result

        def create():
            with self.sessions() as db:
                return purchase_service.create_purchase(
                    db, payload, self.user_id, idempotency_key=key
                )

        with patch.object(
            PurchaseService, "_idempotent_purchase", side_effect=synchronized_lookup
        ), patch(
            "app.services.purchase_service.generate_purchase_number",
            side_effect=self._number_generator("MYSQL-PO"),
        ):
            with ThreadPoolExecutor(max_workers=2) as executor:
                results = list(executor.map(lambda _: create(), range(2)))

        self.assertEqual(results[0].id, results[1].id)
        with self.sessions() as db:
            self.assertEqual(db.query(Purchase).count(), 1)
            self.assertEqual(db.query(PurchaseItem).count(), 1)
            self.assertEqual(db.query(InventoryMovement).filter_by(
                reference_type="PURCHASE"
            ).count(), 1)
            self.assertEqual(db.get(Product, self.product_id).quantity, 13)

    def test_same_key_different_data_returns_409(self):
        with self.sessions() as db, patch(
            "app.services.purchase_service.generate_purchase_number",
            side_effect=self._number_generator("MYSQL-CONFLICT"),
        ):
            purchase_service.create_purchase(
                db, self._purchase_payload(status="Ordered"), self.user_id,
                idempotency_key="mysql-conflict",
            )
        with self.sessions() as db:
            with self.assertRaises(HTTPException) as error:
                purchase_service.create_purchase(
                    db, self._purchase_payload(quantity=4, status="Ordered"),
                    self.user_id, idempotency_key="mysql-conflict",
                )
        self.assertEqual(error.exception.status_code, 409)

    def test_concurrent_checkout_cannot_oversell(self):
        with self.sessions() as db:
            db.get(Product, self.product_id).quantity = 5
            db.commit()
        barrier = threading.Barrier(2)

        def checkout():
            barrier.wait(timeout=10)
            try:
                with self.sessions() as db:
                    result = sales_service.checkout_sale(
                        db,
                        SaleCreate(items=[{"product_id": self.product_id, "quantity": 4}]),
                        self.user_id,
                    )
                return ("ok", result.id)
            except HTTPException as exc:
                return ("error", exc.status_code)

        with patch(
            "app.services.sales_service.generate_invoice_number",
            side_effect=self._number_generator("MYSQL-INV"),
        ):
            with ThreadPoolExecutor(max_workers=2) as executor:
                results = list(executor.map(lambda _: checkout(), range(2)))

        self.assertCountEqual(results, [("ok", results[0][1] if results[0][0] == "ok" else results[1][1]), ("error", 400)])
        with self.sessions() as db:
            self.assertEqual(db.get(Product, self.product_id).quantity, 1)
            self.assertEqual(db.query(Sale).count(), 1)

    def test_concurrent_receiving_applies_stock_once(self):
        with self.sessions() as db, patch(
            "app.services.purchase_service.generate_purchase_number",
            return_value="MYSQL-ORDERED-1",
        ):
            ordered = purchase_service.create_purchase(
                db, self._purchase_payload(status="Ordered"), self.user_id
            )
        barrier = threading.Barrier(2)

        def receive():
            barrier.wait(timeout=10)
            try:
                with self.sessions() as db:
                    result = purchase_service.receive_purchase(db, ordered.id, self.user_id)
                return ("ok", result.id)
            except HTTPException as exc:
                return ("error", exc.status_code)

        with ThreadPoolExecutor(max_workers=2) as executor:
            results = list(executor.map(lambda _: receive(), range(2)))
        self.assertEqual(sorted(status for status, _ in results), ["error", "ok"])
        self.assertIn(("error", 409), results)
        with self.sessions() as db:
            self.assertEqual(db.get(Product, self.product_id).quantity, 13)
            self.assertEqual(db.query(InventoryMovement).filter_by(
                reference_type="PURCHASE"
            ).count(), 1)

    def test_adjustment_and_void_preserve_stock_and_movements(self):
        with self.sessions() as db, patch(
            "app.services.sales_service.generate_invoice_number",
            return_value="MYSQL-VOID-1",
        ):
            sale = sales_service.checkout_sale(
                db, SaleCreate(items=[{"product_id": self.product_id, "quantity": 2}]),
                self.user_id,
            )
        with self.sessions() as db:
            inventory_service.adjust_stock(
                db,
                StockAdjustmentCreate(
                    product_id=self.product_id, adjustment_type="RESTOCK",
                    quantity_change=3, notes="MySQL integration adjustment",
                ),
                self.user_id,
            )
        with self.sessions() as db:
            admin = db.get(User, self.user_id)
            sales_service.delete_sale(db, sale.id, user=admin)
        with self.sessions() as db:
            self.assertEqual(db.get(Product, self.product_id).quantity, 13)
            self.assertEqual(db.get(Sale, sale.id).status, "Voided")
            movements = db.query(InventoryMovement).filter_by(
                product_id=self.product_id
            ).all()
            self.assertCountEqual(
                [(movement.movement_type, movement.quantity) for movement in movements],
                [("SALE", -2), ("RESTOCK", 3), ("VOID_RESTOCK", 2)],
            )

    def test_commit_failure_rolls_back_purchase_stock_and_movements(self):
        with self.sessions() as db, patch(
            "app.services.purchase_service.generate_purchase_number",
            return_value="MYSQL-ROLLBACK-1",
        ), patch.object(db, "commit", side_effect=RuntimeError("forced commit failure")):
            with self.assertRaisesRegex(RuntimeError, "forced commit failure"):
                purchase_service.create_purchase(
                    db, self._purchase_payload(), self.user_id,
                    idempotency_key="mysql-rollback",
                )
            self.assertFalse(db.in_transaction())
        with self.sessions() as db:
            self.assertEqual(db.query(Purchase).count(), 0)
            self.assertEqual(db.query(PurchaseItem).count(), 0)
            self.assertEqual(db.query(InventoryMovement).count(), 0)
            self.assertEqual(db.get(Product, self.product_id).quantity, 10)


if __name__ == "__main__":
    unittest.main()
