r"""Demo-seeding tests with mocked startup and an isolated in-memory database.

Run from backend:
    .\venv\Scripts\python.exe -B -m unittest discover -s tests -p test_demo_seeding.py -v
"""

import asyncio
from contextlib import redirect_stdout
import importlib.util
import io
import os
from pathlib import Path
import unittest
from unittest.mock import patch

from test_config import TEST_ENVIRONMENT, apply_test_environment

apply_test_environment()

from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


MYSQL_GUARD = "pymysql.connections.Connection.connect"
MYSQL_ERROR = "Demo-seeding tests must never connect to MySQL"

# Do not read the local .env or permit a database connection during imports.
with patch("dotenv.load_dotenv", return_value=False), patch(
    MYSQL_GUARD, side_effect=AssertionError(MYSQL_ERROR)
):
    from app.core.security import get_password_hash, verify_password
    from app.db.base import Base
    from app.db import seed
    from app.models.inventory import InventoryMovement
    from app.models.sales import Sale
    from app.models.user import User
    import main


class NoMySQLTestCase(unittest.TestCase):
    def setUp(self):
        mysql_guard = patch(MYSQL_GUARD, side_effect=AssertionError(MYSQL_ERROR))
        mysql_guard.start()
        self.addCleanup(mysql_guard.stop)


class DemoSeedConfigurationTests(NoMySQLTestCase):
    @staticmethod
    def _load_settings(environment):
        config_path = Path(__file__).resolve().parents[1] / "app/core/config.py"
        spec = importlib.util.spec_from_file_location("isolated_test_config", config_path)
        module = importlib.util.module_from_spec(spec)
        # A fresh module with explicit isolated settings proves the seeding
        # default independently of cached settings and developer .env values.
        with patch.dict(os.environ, {**TEST_ENVIRONMENT, **environment}, clear=True), patch(
            "dotenv.load_dotenv", return_value=False
        ):
            spec.loader.exec_module(module)
        return module.settings

    def test_demo_seeding_defaults_to_disabled(self):
        self.assertIs(self._load_settings({}).SEED_DEMO_DATA, False)

    def test_demo_seeding_requires_an_explicit_true_setting(self):
        for value, expected in (("True", True), ("False", False), ("", False),
                                ("unexpected", False)):
            with self.subTest(value=value):
                settings = self._load_settings({"SEED_DEMO_DATA": value})
                self.assertIs(settings.SEED_DEMO_DATA, expected)

    def test_startup_always_initializes_tables_but_seeds_only_when_enabled(self):
        async def enter_lifespan():
            async with main.lifespan(main.app):
                pass

        for enabled in (False, True):
            with self.subTest(enabled=enabled):
                calls = []
                with patch.object(main.settings, "SEED_DEMO_DATA", enabled), patch.object(
                    main.Base.metadata, "create_all",
                    side_effect=lambda **kwargs: calls.append("tables"),
                ) as create_tables, patch.object(
                    main, "seed_database", side_effect=lambda: calls.append("seed")
                ) as seed_database:
                    asyncio.run(enter_lifespan())
                    create_tables.assert_called_once_with(bind=main.engine)
                    if enabled:
                        seed_database.assert_called_once_with()
                        self.assertEqual(calls, ["tables", "seed"])
                    else:
                        seed_database.assert_not_called()
                        self.assertEqual(calls, ["tables"])

    def test_disabled_seeder_returns_before_database_work(self):
        with patch.object(seed.settings, "SEED_DEMO_DATA", False), patch.object(
            seed.Base.metadata, "create_all"
        ) as create_tables, patch.object(
            seed, "SessionLocal"
        ) as session_factory, patch.object(
            seed, "get_password_hash"
        ) as hash_password, redirect_stdout(io.StringIO()):
            seed.seed_database()

        create_tables.assert_not_called()
        session_factory.assert_not_called()
        hash_password.assert_not_called()


class DemoSeedDatabaseTests(NoMySQLTestCase):
    def setUp(self):
        super().setUp()
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.addCleanup(self.engine.dispose)
        Base.metadata.create_all(bind=self.engine)
        self.sessions = sessionmaker(bind=self.engine)
        for name, replacement in (("engine", self.engine), ("SessionLocal", self.sessions)):
            override = patch.object(seed, name, replacement)
            override.start()
            self.addCleanup(override.stop)
        seed_enabled = patch.object(seed.settings, "SEED_DEMO_DATA", True)
        seed_enabled.start()
        self.addCleanup(seed_enabled.stop)

    @staticmethod
    def _run_seed():
        # Keep demo credentials and sample-data progress out of test output.
        with redirect_stdout(io.StringIO()):
            seed.seed_database()

    def _snapshot(self):
        with self.engine.connect() as connection:
            return {
                table.name: [tuple(row) for row in connection.execute(
                    select(table).order_by(*table.primary_key.columns)
                )]
                for table in Base.metadata.sorted_tables
            }

    def test_explicit_seed_creates_demo_users_with_hashed_passwords(self):
        self._run_seed()
        with self.sessions() as db:
            users = db.query(User).order_by(User.username).all()
            self.assertEqual([user.username for user in users], ["admin", "cashier", "manager"])
            for user in users:
                with self.subTest(username=user.username):
                    self.assertEqual(user.role, user.username.capitalize())
                    self.assertIs(user.is_active, True)
                    self.assertEqual(user.email, f"{user.username}@store.com")
                    password = f"{user.role}@123"
                    self.assertNotEqual(user.password, password)
                    self.assertTrue(verify_password(password, user.password))

        expected_counts = {
            "users": 3, "categories": 5, "suppliers": 4, "customers": 4,
            "products": 8, "inventory_movements": 8, "sales": 6, "sale_items": 12,
        }
        snapshot = self._snapshot()
        for table, expected in expected_counts.items():
            with self.subTest(table=table):
                self.assertEqual(len(snapshot[table]), expected)

    def test_existing_usernames_preserve_all_account_values(self):
        password_hash = get_password_hash("ExistingOwnerPassword123!")
        with self.sessions() as db:
            for username, role in (("admin", "Cashier"), ("manager", "Cashier"),
                                   ("cashier", "Manager")):
                db.add(User(
                    full_name=f"Existing {username} owner", username=username,
                    email=f"{username}.owner@example.com", password=password_hash,
                    role=role, is_active=False,
                ))
            db.commit()
        before = self._snapshot()["users"]
        self._run_seed()
        self.assertEqual(self._snapshot()["users"], before)
        with self.sessions() as db:
            self.assertEqual(db.query(InventoryMovement).filter(
                InventoryMovement.user_id.is_not(None)
            ).count(), 0)
            self.assertEqual(db.query(Sale).filter(Sale.user_id.is_not(None)).count(), 0)

    def test_existing_emails_do_not_create_or_change_accounts(self):
        password_hash = get_password_hash("ExistingOwnerPassword123!")
        with self.sessions() as db:
            for username in ("admin", "manager", "cashier"):
                db.add(User(
                    full_name=f"Email owner for {username}", username=f"owner_{username}",
                    email=f"{username}@store.com", password=password_hash,
                    role="Cashier", is_active=False,
                ))
            db.commit()
        before = self._snapshot()["users"]
        self._run_seed()
        self.assertEqual(self._snapshot()["users"], before)
        with self.sessions() as db:
            self.assertEqual(db.query(User).filter(
                User.username.in_(("admin", "manager", "cashier"))
            ).count(), 0)

    def test_repeated_seed_preserves_every_table_without_duplicates(self):
        self._run_seed()
        before = self._snapshot()
        self._run_seed()
        self.assertEqual(self._snapshot(), before)


if __name__ == "__main__":
    unittest.main()
