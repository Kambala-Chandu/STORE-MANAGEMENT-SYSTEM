r"""Registration/permission integration tests using only an in-memory SQLite DB.

Run from backend: .\venv\Scripts\python.exe -B -m unittest discover -s tests
    -p test_registration_permissions.py -v
"""

import unittest
from unittest.mock import patch

from test_config import apply_test_environment

apply_test_environment()

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


MYSQL_GUARD = "pymysql.connections.Connection.connect"
MYSQL_ERROR = "Registration tests must never connect to MySQL"

# Guard imports too: database.py constructs an engine, but must not connect.
with patch(MYSQL_GUARD, side_effect=AssertionError(MYSQL_ERROR)):
    from app.core.security import verify_password
    from app.core.config import settings
    from app.db.database import get_db
    from app.models.user import User
    from app.schemas.user import UserCreate
    from app.services.auth_service import auth_service
    from main import app


class RegistrationPermissionsTests(unittest.TestCase):
    prefixes = ("/api/v1", "")

    def setUp(self):
        previous_registration = settings.ENABLE_PUBLIC_REGISTRATION
        settings.ENABLE_PUBLIC_REGISTRATION = True
        self.addCleanup(setattr, settings, "ENABLE_PUBLIC_REGISTRATION", previous_registration)
        mysql_guard = patch(MYSQL_GUARD, side_effect=AssertionError(MYSQL_ERROR))
        mysql_guard.start()
        self.addCleanup(mysql_guard.stop)
        seed_guard = patch(
            "main.seed_database",
            side_effect=AssertionError("Tests must not invoke application seeding"),
        )
        seed_mock = seed_guard.start()
        self.addCleanup(seed_guard.stop)
        self.addCleanup(seed_mock.assert_not_called)

        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.addCleanup(self.engine.dispose)
        User.__table__.create(self.engine)
        self.sessions = sessionmaker(bind=self.engine)

        def override_get_db():
            with self.sessions() as db:
                yield db

        previous_overrides = app.dependency_overrides.copy()
        self.addCleanup(self._restore_overrides, previous_overrides)
        app.dependency_overrides[get_db] = override_get_db
        # Do not use `with TestClient(...)`: that runs main.py's lifespan,
        # which creates database tables and invokes the demo seeder.
        self.client = TestClient(app)
        self.addCleanup(self.client.close)

    @staticmethod
    def _restore_overrides(previous_overrides):
        app.dependency_overrides.clear()
        app.dependency_overrides.update(previous_overrides)

    @staticmethod
    def _payload(username="new_cashier"):
        return {
            "full_name": "Test Cashier",
            "username": username,
            "email": f"{username}@example.com",
            "password": "Registration123!",
        }

    def _create_existing(self, username, role="Cashier"):
        payload = self._payload(username)
        with self.sessions() as db:
            auth_service.register_user(
                db, UserCreate(**payload, role=role, is_active=True)
            )
        return payload

    def _snapshot(self):
        with self.sessions() as db:
            return [
                tuple(getattr(user, column.name) for column in User.__table__.columns)
                for user in db.query(User).order_by(User.id).all()
            ]

    def _login(self, payload, prefix="/api/v1"):
        response = self.client.post(
            f"{prefix}/auth/login",
            json={"username": payload["username"], "password": payload["password"]},
        )
        self.assertEqual(response.status_code, 200, response.text)
        token = response.json()
        self.assertEqual(token["token_type"], "bearer")
        self.assertNotIn("password", token["user"])
        return {"Authorization": f"Bearer {token['access_token']}"}

    def test_public_registration_persists_active_cashier_and_allows_login(self):
        for index, prefix in enumerate(self.prefixes):
            with self.subTest(prefix=prefix):
                payload = self._payload(f"new_cashier_{index}")
                response = self.client.post(f"{prefix}/auth/register", json=payload)
                self.assertEqual(response.status_code, 201, response.text)
                body = response.json()
                self.assertEqual(
                    set(body),
                    {"id", "full_name", "username", "email", "role", "is_active",
                     "created_at", "updated_at"},
                )
                self.assertEqual(body["role"], "Cashier")
                self.assertIs(body["is_active"], True)
                for field in ("full_name", "username", "email"):
                    self.assertEqual(body[field], payload[field])
                with self.sessions() as db:
                    user = db.query(User).filter_by(username=payload["username"]).one()
                    self.assertEqual(user.id, body["id"])
                    self.assertEqual(user.role, "Cashier")
                    self.assertIs(user.is_active, True)
                    self.assertNotEqual(user.password, payload["password"])
                    self.assertTrue(verify_password(payload["password"], user.password))
                    self.assertNotIn(user.password, response.text)
                self.assertNotIn(payload["password"], response.text)
                headers = self._login(payload, prefix)
                me = self.client.get(f"{prefix}/auth/me", headers=headers)
                self.assertEqual(me.status_code, 200, me.text)
                self.assertEqual(me.json(), body)

    def test_public_registration_rejects_privileged_and_unknown_fields(self):
        self._create_existing("existing_user")
        before = self._snapshot()
        forbidden_fields = (
            {"role": "Admin"},
            {"role": "Manager"},
            {"role": "Cashier"},
            {"is_active": True},
            {"is_active": False},
            {"unknown_field": "unexpected"},
            {"role": "Admin", "is_active": False, "unknown_field": "unexpected"},
        )
        for prefix in self.prefixes:
            for extra in forbidden_fields:
                with self.subTest(prefix=prefix, extra=extra):
                    response = self.client.post(
                        f"{prefix}/auth/register", json={**self._payload(), **extra}
                    )
                    self.assertEqual(response.status_code, 422, response.text)
                    errors = response.json()["detail"]
                    self.assertEqual({tuple(error["loc"]) for error in errors},
                                     {("body", field) for field in extra})
                    self.assertTrue(all(error["type"] == "extra_forbidden"
                                        for error in errors))
                    self.assertEqual(self._snapshot(), before)

    def test_public_registration_preserves_field_validation(self):
        self._create_existing("existing_user")
        before = self._snapshot()
        invalid_fields = (
            ("full_name", "A"), ("full_name", "A" * 101),
            ("username", "ab"), ("username", "a" * 51),
            ("email", "invalid-email"),
            ("password", "short"), ("password", "x" * 101),
        )
        cases = [(field, {**self._payload(), field: value})
                 for field, value in invalid_fields]
        for field in self._payload():
            payload = self._payload()
            del payload[field]
            cases.append((field, payload))
        for prefix in self.prefixes:
            for field, payload in cases:
                with self.subTest(prefix=prefix, field=field, payload=payload):
                    response = self.client.post(f"{prefix}/auth/register", json=payload)
                    self.assertEqual(response.status_code, 422, response.text)
                    self.assertIn(["body", field],
                                  [error["loc"] for error in response.json()["detail"]])
                    self.assertEqual(self._snapshot(), before)

    def test_public_registration_accepts_minimum_field_lengths(self):
        for index, prefix in enumerate(self.prefixes):
            with self.subTest(prefix=prefix):
                payload = {**self._payload(f"u{index:02d}"),
                           "full_name": "Ab", "password": "abc123"}
                response = self.client.post(f"{prefix}/auth/register", json=payload)
                self.assertEqual(response.status_code, 201, response.text)
                self.assertEqual(response.json()["role"], "Cashier")

    def test_duplicate_username_and_email_keep_existing_errors(self):
        existing = self._create_existing("existing_user")
        before = self._snapshot()
        cases = (
            ({**self._payload(), "username": existing["username"]},
             "Username already registered"),
            ({**self._payload(), "email": existing["email"]},
             "Email already registered"),
        )
        for prefix in self.prefixes:
            for payload, detail in cases:
                with self.subTest(prefix=prefix, detail=detail):
                    response = self.client.post(f"{prefix}/auth/register", json=payload)
                    self.assertEqual(response.status_code, 400, response.text)
                    self.assertEqual(response.json(), {"detail": detail})
                    self.assertEqual(self._snapshot(), before)

    def test_admin_can_create_every_role_with_either_activation_status(self):
        admin = self._create_existing("test_admin", role="Admin")
        headers = self._login(admin)
        for index, prefix in enumerate(self.prefixes):
            for role in ("Admin", "Manager", "Cashier"):
                for active in (True, False):
                    with self.subTest(prefix=prefix, role=role, active=active):
                        payload = {**self._payload(f"{role.lower()}_{index}_{active}"),
                                   "role": role, "is_active": active}
                        response = self.client.post(
                            f"{prefix}/users/", json=payload, headers=headers
                        )
                        self.assertEqual(response.status_code, 201, response.text)
                        self.assertEqual(response.json()["role"], role)
                        self.assertIs(response.json()["is_active"], active)
                        self.assertNotIn("password", response.json())
                        with self.sessions() as db:
                            user = db.query(User).filter_by(
                                username=payload["username"]
                            ).one()
                            self.assertEqual(user.role, role)
                            self.assertIs(user.is_active, active)

    def test_anonymous_callers_cannot_use_admin_creation(self):
        before = self._snapshot()
        for prefix in self.prefixes:
            with self.subTest(prefix=prefix):
                response = self.client.post(
                    f"{prefix}/users/", json={**self._payload(), "role": "Admin"}
                )
                self.assertEqual(response.status_code, 401, response.text)
                self.assertEqual(self._snapshot(), before)

    def test_non_admin_users_cannot_use_admin_creation(self):
        for role in ("Manager", "Cashier"):
            existing = self._create_existing(f"test_{role.lower()}", role=role)
            headers = self._login(existing)
            before = self._snapshot()
            for prefix in self.prefixes:
                with self.subTest(prefix=prefix, role=role):
                    response = self.client.post(
                        f"{prefix}/users/",
                        json={**self._payload(), "role": "Admin"}, headers=headers,
                    )
                    self.assertEqual(response.status_code, 403, response.text)
                    self.assertEqual(self._snapshot(), before)


if __name__ == "__main__":
    unittest.main()
