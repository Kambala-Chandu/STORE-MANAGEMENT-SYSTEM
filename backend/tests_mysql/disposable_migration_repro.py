"""Disposable MySQL 8.4 migration reproduction; never uses an existing service."""

from datetime import datetime, timedelta, timezone
import ipaddress
import os
from pathlib import Path
import secrets
import socket
import subprocess
import tempfile
import time

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID
import pymysql

# Prevent any future application imports in this harness from loading a project
# .env file. The reproduction supplies only generated, disposable settings.
os.environ["PYTHON_DOTENV_DISABLED"] = "1"

from app.db.safe_errors import sanitized_database_error


MYSQLD = Path(r"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe")
BASEDIR = MYSQLD.parents[1]


def _free_port() -> int:
    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        return listener.getsockname()[1]


def _write_pem(path: Path, data: bytes) -> None:
    path.write_bytes(data)


def _certificates(root: Path) -> tuple[Path, Path, Path]:
    now = datetime.now(timezone.utc)
    ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "SMS disposable test CA")])
    ca_cert = (
        x509.CertificateBuilder()
        .subject_name(ca_name).issuer_name(ca_name).public_key(ca_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - timedelta(minutes=1)).not_valid_after(now + timedelta(days=1))
        .add_extension(x509.BasicConstraints(ca=True, path_length=0), critical=True)
        .add_extension(x509.SubjectKeyIdentifier.from_public_key(ca_key.public_key()), critical=False)
        .add_extension(x509.KeyUsage(
            digital_signature=True, content_commitment=False, key_encipherment=False,
            data_encipherment=False, key_agreement=False, key_cert_sign=True,
            crl_sign=True, encipher_only=None, decipher_only=None,
        ), critical=True)
        .sign(ca_key, hashes.SHA256())
    )
    server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    server_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "localhost")])
    server_cert = (
        x509.CertificateBuilder()
        .subject_name(server_name).issuer_name(ca_name).public_key(server_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - timedelta(minutes=1)).not_valid_after(now + timedelta(days=1))
        .add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName("localhost"), x509.IPAddress(ipaddress.ip_address("127.0.0.1"))
            ]), critical=False,
        )
        .add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]), critical=False)
        .add_extension(x509.SubjectKeyIdentifier.from_public_key(server_key.public_key()), critical=False)
        .add_extension(x509.AuthorityKeyIdentifier.from_issuer_public_key(ca_key.public_key()), critical=False)
        .add_extension(x509.KeyUsage(
            digital_signature=True, content_commitment=False, key_encipherment=True,
            data_encipherment=False, key_agreement=False, key_cert_sign=False,
            crl_sign=False, encipher_only=None, decipher_only=None,
        ), critical=True)
        .sign(ca_key, hashes.SHA256())
    )
    ca_path, cert_path, key_path = root / "test-ca.pem", root / "server-cert.pem", root / "server-key.pem"
    _write_pem(ca_path, ca_cert.public_bytes(serialization.Encoding.PEM))
    _write_pem(cert_path, server_cert.public_bytes(serialization.Encoding.PEM))
    _write_pem(key_path, server_key.private_bytes(
        serialization.Encoding.PEM, serialization.PrivateFormat.TraditionalOpenSSL,
        serialization.NoEncryption(),
    ))
    return ca_path, cert_path, key_path


def main() -> int:
    if not MYSQLD.is_file():
        print("BLOCKED: separate MySQL 8.4 binary not found")
        return 2
    port = _free_port()
    password = secrets.token_urlsafe(24)
    process = None
    with tempfile.TemporaryDirectory(prefix="sms-mysql84-repro-") as temporary:
        root = Path(temporary)
        data = root / "data"
        data.mkdir()
        init = subprocess.run([
            str(MYSQLD), "--no-defaults", "--initialize-insecure",
            f"--basedir={BASEDIR}", f"--datadir={data}",
        ], capture_output=True, text=True, timeout=120)
        if init.returncode:
            print("BLOCKED: disposable MySQL initialization failed")
            return 2
        ca_path, cert_path, key_path = _certificates(root)
        process = subprocess.Popen([
            str(MYSQLD), "--no-defaults", f"--basedir={BASEDIR}", f"--datadir={data}",
            "--bind-address=127.0.0.1", f"--port={port}", "--mysqlx=OFF",
            "--require-secure-transport=ON", f"--ssl-ca={ca_path}",
            f"--ssl-cert={cert_path}", f"--ssl-key={key_path}",
            f"--pid-file={root / 'mysql.pid'}", f"--log-error={root / 'mysql-error.log'}",
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        root_connection = None
        try:
            for _ in range(120):
                try:
                    root_connection = pymysql.connect(
                        host="localhost", port=port, user="root", password="",
                        ssl_ca=str(ca_path), ssl_verify_cert=True, ssl_verify_identity=True,
                        autocommit=True,
                    )
                    break
                except pymysql.MySQLError:
                    if process.poll() is not None:
                        print("BLOCKED: disposable MySQL exited during startup")
                        return 2
                    time.sleep(0.25)
            if root_connection is None:
                print("BLOCKED: disposable MySQL did not become ready")
                return 2
            with root_connection.cursor() as cursor:
                cursor.execute("CREATE DATABASE sms_migration_repro")
                cursor.execute("CREATE USER 'sms_repro'@'%%' IDENTIFIED BY %s", (password,))
                cursor.execute("GRANT ALL ON sms_migration_repro.* TO 'sms_repro'@'%'")

            os.environ.update({
                "PYTHON_DOTENV_DISABLED": "1", "ENVIRONMENT": "production", "DEBUG": "False",
                "SEED_DEMO_DATA": "False", "ENABLE_PUBLIC_REGISTRATION": "False",
                "ENABLE_PROTOTYPE_ROUTERS": "False", "DB_HOST": "localhost",
                "DB_PORT": str(port), "DB_NAME": "sms_migration_repro", "DB_USER": "sms_repro",
                "DB_PASSWORD": password, "DB_SSL_ENABLED": "True", "DB_SSL_CA": str(ca_path),
                "SECRET_KEY": secrets.token_urlsafe(48), "CORS_ORIGINS": "http://127.0.0.1",
            })
            try:
                from alembic import command
                from alembic.config import Config
                config = Config(str(Path(__file__).resolve().parents[1] / "alembic.ini"))
                command.upgrade(config, "head")
            except Exception as exc:
                kind, code, reason = sanitized_database_error(exc, (password, "sms_repro"))
                print(f"FAIL: {kind}; code={code}; reason={reason}")
                return 1

            connection = pymysql.connect(
                host="localhost", port=port, user="sms_repro", password=password,
                database="sms_migration_repro", ssl_ca=str(ca_path),
                ssl_verify_cert=True, ssl_verify_identity=True,
            )
            with connection, connection.cursor() as cursor:
                cursor.execute("SELECT VERSION(), @@sql_mode, @@default_storage_engine, @@collation_server")
                version, sql_mode, engine, collation = cursor.fetchone()
                cursor.execute("SELECT version_num FROM alembic_version")
                revision = cursor.fetchone()[0]
                cursor.execute("SHOW TABLES LIKE 'inventory_movements'")
                inventory_exists = cursor.fetchone() is not None
                cursor.execute("SHOW INDEX FROM sale_items")
                sale_indexes = sorted({(row[2], row[4], not bool(row[1])) for row in cursor.fetchall()})
            print(f"PASS: MySQL={version}; revision={revision}; inventory={inventory_exists}")
            print(f"SETTINGS: engine={engine}; collation={collation}; sql_mode={sql_mode}")
            print(f"SALE_INDEXES: {sale_indexes}")
            return 0
        finally:
            if root_connection is not None:
                try:
                    with root_connection.cursor() as cursor:
                        cursor.execute("SHUTDOWN")
                except Exception:
                    pass
                root_connection.close()
            if process is not None:
                try:
                    process.wait(timeout=15)
                except subprocess.TimeoutExpired:
                    process.terminate()
                    process.wait(timeout=10)


if __name__ == "__main__":
    raise SystemExit(main())
