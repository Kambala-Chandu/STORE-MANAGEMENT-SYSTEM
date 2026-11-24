"""Alembic migration tests using disposable SQLite database files only."""

import tempfile
import unittest
from pathlib import Path

from test_config import apply_test_environment

apply_test_environment()

from alembic import command
from alembic.config import Config
from sqlalchemy import MetaData, Table, create_engine, inspect, select
from sqlalchemy.exc import IntegrityError

from app.db.base import Base
import app.models  # noqa: F401
from app.verify_migration_baseline import verify_baseline_compatibility
from migrations.schema import BASELINE_METADATA, purchases


BACKEND_DIR = Path(__file__).resolve().parents[1]


class MigrationTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        self.db_path = Path(self.temp_dir.name) / "migration.sqlite3"
        self.url = f"sqlite:///{self.db_path.as_posix()}"
        self.config = Config(str(BACKEND_DIR / "alembic.ini"))
        self.config.set_main_option("script_location", str(BACKEND_DIR / "migrations"))
        self.config.set_main_option("sqlalchemy.url", self.url)

    def test_fresh_upgrade_creates_current_schema(self):
        command.upgrade(self.config, "head")
        # The migration head must describe the same schema as current models.
        command.check(self.config)
        engine = create_engine(self.url)
        self.addCleanup(engine.dispose)
        inspector = inspect(engine)
        self.assertTrue(set(Base.metadata.tables).issubset(inspector.get_table_names()))
        purchase_columns = {column["name"] for column in inspector.get_columns("purchases")}
        self.assertTrue({
            "idempotency_key", "idempotency_operation", "idempotency_request_hash"
        }.issubset(purchase_columns))
        unique_columns = {
            tuple(constraint["column_names"])
            for constraint in inspector.get_unique_constraints("purchases")
        }
        self.assertIn(
            ("user_id", "idempotency_operation", "idempotency_key"), unique_columns
        )

    def test_verified_existing_baseline_can_be_stamped_and_upgraded(self):
        engine = create_engine(self.url)
        self.addCleanup(engine.dispose)
        BASELINE_METADATA.create_all(engine)
        with engine.begin() as connection:
            connection.execute(purchases.insert().values(
                purchase_number="HISTORICAL-PO-1", subtotal=10.0, tax_amount=0.0,
                total_amount=10.0, status="Ordered",
            ))
            verify_baseline_compatibility(connection)

        command.stamp(self.config, "0001_v1_schema_baseline")
        command.upgrade(self.config, "head")
        with engine.connect() as connection:
            row = connection.execute(
                select(purchases.c.purchase_number).where(
                    purchases.c.purchase_number == "HISTORICAL-PO-1"
                )
            ).scalar_one()
            self.assertEqual(row, "HISTORICAL-PO-1")
            version = connection.exec_driver_sql(
                "SELECT version_num FROM alembic_version"
            ).scalar_one()
            self.assertEqual(version, "0002_purchase_idempotency")

    def test_schema_verifier_refuses_an_incompatible_existing_database(self):
        engine = create_engine(self.url)
        self.addCleanup(engine.dispose)
        BASELINE_METADATA.create_all(engine)
        with engine.begin() as connection:
            connection.exec_driver_sql("ALTER TABLE purchases ADD COLUMN unexpected TEXT")
            with self.assertRaisesRegex(RuntimeError, "do not stamp"):
                verify_baseline_compatibility(connection)

    def test_database_constraint_enforces_scoped_idempotency_uniqueness(self):
        command.upgrade(self.config, "head")
        engine = create_engine(self.url)
        self.addCleanup(engine.dispose)
        metadata = MetaData()
        migrated_users = Table("users", metadata, autoload_with=engine)
        migrated_purchases = Table("purchases", metadata, autoload_with=engine)
        with engine.begin() as connection:
            user_id = connection.execute(migrated_users.insert().values(
                full_name="Constraint Admin", username="constraint_admin",
                email="constraint@example.com", password="hash", role="Admin",
                is_active=True,
            )).inserted_primary_key[0]
            values = {
                "purchase_number": "CONSTRAINT-PO-1", "user_id": user_id,
                "subtotal": 1.0, "tax_amount": 0.0, "total_amount": 1.0,
                "status": "Ordered", "idempotency_key": "shared-key",
                "idempotency_operation": "purchase_create",
                "idempotency_request_hash": "a" * 64,
            }
            connection.execute(migrated_purchases.insert().values(**values))
        with self.assertRaises(IntegrityError):
            with engine.begin() as connection:
                connection.execute(migrated_purchases.insert().values(
                    **{**values, "purchase_number": "CONSTRAINT-PO-2"}
                ))


if __name__ == "__main__":
    unittest.main()
