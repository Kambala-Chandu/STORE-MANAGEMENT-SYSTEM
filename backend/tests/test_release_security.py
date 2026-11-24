"""Isolated release-boundary security tests. No MySQL connection is permitted."""

import unittest
from unittest.mock import patch

from test_config import TEST_ENVIRONMENT, apply_test_environment

apply_test_environment()

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


MYSQL_GUARD = "pymysql.connections.Connection.connect"
MYSQL_ERROR = "Release security tests must never connect to MySQL"

with patch(MYSQL_GUARD, side_effect=AssertionError(MYSQL_ERROR)):
    from app.bootstrap_admin import bootstrap_first_admin
    from app.core.config import Settings, settings
    from app.core.security import verify_password
    from app.db.base import Base
    from app.db.database import get_db
    from app.models.user import User
    from app.schemas.user import UserCreate
    from app.services.auth_service import auth_service
    import main as main_module
    from main import app


class ProductionConfigurationTests(unittest.TestCase):
    def _production(self, **overrides):
        values = {
            **TEST_ENVIRONMENT,
            "ENVIRONMENT": "production",
            "DEBUG": "False",
            "SECRET_KEY": "release-only-secret-with-at-least-32-characters",
            "DB_HOST": "database.internal",
            "DB_NAME": "store",
            "DB_USER": "store_app",
            "DB_PASSWORD": "private-database-password",
            "DB_SSL_ENABLED": "True",
            "CORS_ORIGINS": "https://store.example.com",
        }
        values.update(overrides)
        return Settings(values)

    def test_safe_production_configuration_is_accepted(self):
        configured = self._production()
        self.assertFalse(configured.DEBUG)
        self.assertEqual(configured.CORS_ORIGINS, ["https://store.example.com"])

    def test_missing_placeholder_credentials_and_wildcard_cors_are_rejected(self):
        for override in (
            {"SECRET_KEY": ""},
            {"SECRET_KEY": "placeholder"},
            {"DB_PASSWORD": ""},
            {"DB_PASSWORD": "placeholder"},
            {"DB_SSL_ENABLED": "False"},
            {"DEBUG": "True"},
            {"CORS_ORIGINS": "*"},
        ):
            with self.subTest(override=next(iter(override))):
                with self.assertRaises(ValueError):
                    self._production(**override)

    def test_required_configuration_is_enforced_outside_production(self):
        for name in ("SECRET_KEY", "DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"):
            with self.subTest(name=name):
                values = {**TEST_ENVIRONMENT, name: ""}
                with self.assertRaises(ValueError):
                    Settings(values)


class ReleaseSecurityApiTests(unittest.TestCase):
    def setUp(self):
        mysql_guard = patch(MYSQL_GUARD, side_effect=AssertionError(MYSQL_ERROR))
        mysql_guard.start()
        self.addCleanup(mysql_guard.stop)

        self.engine = create_engine(
            "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
        )
        self.addCleanup(self.engine.dispose)
        Base.metadata.create_all(self.engine)
        self.sessions = sessionmaker(bind=self.engine)

        def override_get_db():
            with self.sessions() as db:
                yield db

        previous = app.dependency_overrides.copy()
        app.dependency_overrides[get_db] = override_get_db
        self.addCleanup(self._restore_overrides, previous)
        self.client = TestClient(app)
        self.addCleanup(self.client.close)

        with self.sessions() as db:
            auth_service.register_user(db, UserCreate(
                full_name="Release Admin", username="release_admin",
                email="release-admin@example.com", password="ReleaseAdmin123!",
                role="Admin", is_active=True,
            ))
        response = self.client.post("/api/v1/auth/login", json={
            "username": "release_admin", "password": "ReleaseAdmin123!"
        })
        self.headers = {"Authorization": f"Bearer {response.json()['access_token']}"}

    @staticmethod
    def _restore_overrides(previous):
        app.dependency_overrides.clear()
        app.dependency_overrides.update(previous)

    def test_registration_defaults_disabled_and_can_be_explicitly_enabled(self):
        payload = {
            "full_name": "Optional Cashier", "username": "optional_cashier",
            "email": "optional@example.com", "password": "Optional123!",
        }
        previous = settings.ENABLE_PUBLIC_REGISTRATION
        self.addCleanup(setattr, settings, "ENABLE_PUBLIC_REGISTRATION", previous)
        settings.ENABLE_PUBLIC_REGISTRATION = False
        for prefix in ("/api/v1", ""):
            self.assertEqual(self.client.post(f"{prefix}/auth/register", json=payload).status_code, 404)

        settings.ENABLE_PUBLIC_REGISTRATION = True
        response = self.client.post("/api/v1/auth/register", json=payload)
        self.assertEqual(response.status_code, 201, response.text)
        self.assertEqual(response.json()["role"], "Cashier")

    def test_invoice_verification_requires_authentication_on_both_aliases(self):
        for prefix in ("/api/v1", ""):
            unauthenticated = self.client.get(f"{prefix}/sales/verify/INV-MISSING")
            self.assertEqual(unauthenticated.status_code, 401)
            authenticated = self.client.get(
                f"{prefix}/sales/verify/INV-MISSING", headers=self.headers
            )
            self.assertEqual(authenticated.status_code, 404)

    def test_prototypes_and_old_database_probe_are_unavailable(self):
        for path in ("/api/v1/ai-copilot/insights", "/api/v1/projects/", "/database"):
            self.assertEqual(self.client.get(path).status_code, 404, path)

    def test_health_responses_are_non_sensitive(self):
        self.assertEqual(self.client.get("/health/live").json(), {"status": "ok"})
        with patch.object(
            main_module.engine, "connect", side_effect=RuntimeError("private database detail")
        ):
            response = self.client.get("/health/ready")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json(), {"detail": "Database unavailable"})
        self.assertNotIn("private database detail", response.text)

    def test_production_startup_does_not_create_tables(self):
        previous_environment = settings.ENVIRONMENT
        settings.ENVIRONMENT = "production"
        self.addCleanup(setattr, settings, "ENVIRONMENT", previous_environment)
        with patch.object(main_module.Base.metadata, "create_all") as create_all:
            with TestClient(app) as client:
                self.assertEqual(client.get("/health/live").status_code, 200)
        create_all.assert_not_called()

    def test_restore_is_admin_only_and_unavailable(self):
        self.assertEqual(self.client.post("/api/v1/backup/restore").status_code, 401)
        response = self.client.post("/api/v1/backup/restore", headers=self.headers)
        self.assertEqual(response.status_code, 501, response.text)
        self.assertEqual(response.json()["detail"], "Backup restore is not available in version 1")

    def test_export_omits_password_hashes(self):
        response = self.client.get("/api/v1/backup/export", headers=self.headers)
        self.assertEqual(response.status_code, 200, response.text)
        user = response.json()["data"]["users"][0]
        self.assertNotIn("password", user)
        self.assertNotIn("password_hash", user)


class FirstAdminBootstrapTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://", poolclass=StaticPool)
        self.addCleanup(self.engine.dispose)
        User.__table__.create(self.engine)
        self.sessions = sessionmaker(bind=self.engine)

    def test_bootstrap_hashes_password_and_refuses_second_admin(self):
        with self.sessions() as db:
            admin = bootstrap_first_admin(
                db, full_name="First Admin", username="first_admin",
                email="first-admin@example.com", password="FirstAdmin123!",
            )
            self.assertEqual(admin.role, "Admin")
            self.assertTrue(admin.is_active)
            self.assertNotEqual(admin.password, "FirstAdmin123!")
            self.assertTrue(verify_password("FirstAdmin123!", admin.password))
            with self.assertRaisesRegex(RuntimeError, "already exists"):
                bootstrap_first_admin(
                    db, full_name="Second Admin", username="second_admin",
                    email="second-admin@example.com", password="SecondAdmin123!",
                )


if __name__ == "__main__":
    unittest.main()
