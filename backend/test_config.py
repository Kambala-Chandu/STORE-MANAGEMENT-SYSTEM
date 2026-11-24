"""Explicit non-production configuration for isolated automated tests."""

import os


TEST_ENVIRONMENT = {
    "PYTHON_DOTENV_DISABLED": "1",
    "ENVIRONMENT": "test",
    "DEBUG": "False",
    "DB_HOST": "127.0.0.1",
    "DB_PORT": "43306",
    "DB_NAME": "isolated_unit_tests",
    "DB_USER": "isolated_test_user",
    "DB_PASSWORD": "isolated-test-database-password",
    "DB_SSL_ENABLED": "False",
    "DB_SSL_CA": "",
    "SECRET_KEY": "isolated-test-jwt-secret-with-at-least-32-characters",
    "CORS_ORIGINS": "http://127.0.0.1:5173",
    "SEED_DEMO_DATA": "False",
    "ENABLE_PUBLIC_REGISTRATION": "False",
    "ENABLE_PROTOTYPE_ROUTERS": "False",
}


def apply_test_environment() -> None:
    for name, value in TEST_ENVIRONMENT.items():
        os.environ.setdefault(name, value)
