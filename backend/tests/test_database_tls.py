"""Verified database TLS configuration tests; no network connection is made."""

import ssl
import unittest
from unittest.mock import patch

from test_config import TEST_ENVIRONMENT, apply_test_environment

apply_test_environment()

from app.core.config import Settings
from app.db.database import create_database_engine, mysql_tls_connect_args


class DatabaseTlsTests(unittest.TestCase):
    @staticmethod
    def _settings(**overrides):
        values = {**TEST_ENVIRONMENT, "DB_SSL_ENABLED": "True", **overrides}
        return Settings(values)

    def test_tls_uses_required_certificate_and_hostname_verification(self):
        context = mysql_tls_connect_args(self._settings())["ssl"]
        self.assertEqual(context.verify_mode, ssl.CERT_REQUIRED)
        self.assertTrue(context.check_hostname)

    def test_custom_ca_is_loaded_without_disabling_verification(self):
        configured = self._settings(DB_SSL_CA="provider-ca.pem")
        with patch("app.db.database.ssl.create_default_context") as create_context:
            context = create_context.return_value
            mysql_tls_connect_args(configured)
        create_context.assert_called_once_with(cafile="provider-ca.pem")
        self.assertEqual(context.verify_mode, ssl.CERT_REQUIRED)
        self.assertTrue(context.check_hostname)

    def test_shared_engine_factory_applies_tls_only_to_mysql(self):
        configured = self._settings()
        with patch("app.db.database.create_engine") as create_engine:
            create_database_engine("mysql+pymysql://example.invalid/store", configured)
            mysql_options = create_engine.call_args.kwargs
            create_database_engine("sqlite://", configured)
            sqlite_options = create_engine.call_args.kwargs
        self.assertIn("ssl", mysql_options["connect_args"])
        self.assertNotIn("connect_args", sqlite_options)


if __name__ == "__main__":
    unittest.main()
