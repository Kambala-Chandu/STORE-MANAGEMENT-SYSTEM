"""Guarded Alembic migration command for a new, empty hosted MySQL database.

Run from the backend directory with:
    python -m app.db.migrate_new_database
"""

import getpass
import ipaddress
import os
from pathlib import Path
import secrets
import socket


# Disable dotenv before importing any application module. All connection values
# are entered interactively and live only for this process.
os.environ["PYTHON_DOTENV_DISABLED"] = "1"


def _prompt_required(label: str) -> str:
    while True:
        value = input(f"{label}: ").strip()
        if value:
            return value
        print(f"{label} is required.")


def _is_local_host(host: str) -> bool:
    normalized = host.strip().lower().strip("[]").rstrip(".")
    local_names = {
        "localhost",
        "127.0.0.1",
        "::1",
        "0.0.0.0",
        "host.docker.internal",
        "gateway.docker.internal",
        socket.gethostname().lower(),
        socket.getfqdn().lower(),
    }
    if (
        normalized in local_names
        or normalized.startswith("127.")
        or normalized.endswith(".localhost")
    ):
        return True

    addresses = {normalized}
    try:
        addresses.update(
            address[4][0] for address in socket.getaddrinfo(normalized, None)
        )
    except socket.gaierror:
        pass

    for address in addresses:
        try:
            parsed = ipaddress.ip_address(address)
        except ValueError:
            continue
        if (
            parsed.is_loopback
            or parsed.is_private
            or parsed.is_link_local
            or parsed.is_unspecified
        ):
            return True
    return False


def main() -> int:
    print("Guarded migration for a NEW empty hosted MySQL database")
    host = _prompt_required("Database host")
    if _is_local_host(host):
        print("Migration refused: local database hosts are not allowed by this helper.")
        return 2

    port = input("Database port [3306]: ").strip() or "3306"
    database = _prompt_required("Database name")
    username = _prompt_required("Database user")
    password = getpass.getpass("Database password: ")
    ca_input = input(
        "CA bundle path [leave empty to use Certifi's trusted CA store]: "
    ).strip()

    if not password:
        print("Migration refused: database password is required.")
        return 2

    ca_path = ""
    if ca_input:
        candidate = Path(ca_input).expanduser().resolve()
        if not candidate.is_file():
            print("Migration refused: the CA bundle file was not found.")
            return 2
        ca_path = str(candidate)

    print("\nTarget hosted database:")
    print(f"  Host: {host}")
    print(f"  Database: {database}")
    print("Checking that the target contains no tables...")

    os.environ.update({
        "ENVIRONMENT": "production",
        "DEBUG": "False",
        "SEED_DEMO_DATA": "False",
        "ENABLE_PUBLIC_REGISTRATION": "False",
        "ENABLE_PROTOTYPE_ROUTERS": "False",
        "DB_HOST": host,
        "DB_PORT": port,
        "DB_NAME": database,
        "DB_USER": username,
        "DB_PASSWORD": password,
        "DB_SSL_ENABLED": "True",
        "DB_SSL_CA": ca_path,
        "SECRET_KEY": secrets.token_urlsafe(48),
        "CORS_ORIGINS": "http://127.0.0.1",
    })

    engine = None
    try:
        from sqlalchemy import inspect
        from app.db.database import create_database_engine

        engine = create_database_engine()
        with engine.connect() as connection:
            inspector = inspect(connection)
            tables = inspector.get_table_names()
            views = inspector.get_view_names()
    except Exception:
        print("Pre-migration check failed. No migrations were attempted.")
        return 1
    finally:
        if engine is not None:
            engine.dispose()

    if tables or views:
        print(
            "Migration refused: the target already contains "
            f"{len(tables)} table(s) and {len(views)} view(s)."
        )
        print("Review the target manually; this helper only accepts an empty database.")
        return 2

    print("Empty-database check passed.")
    confirmation = input(
        f"Type MIGRATE to apply Alembic migrations to {host} / {database}: "
    ).strip()
    if confirmation != "MIGRATE":
        print("Migration cancelled. No schema changes were made.")
        return 2

    try:
        from alembic import command
        from alembic.config import Config

        backend_dir = Path(__file__).resolve().parents[2]
        alembic_config = Config(str(backend_dir / "alembic.ini"))
        alembic_config.set_main_option(
            "script_location", str(backend_dir / "migrations")
        )
        command.upgrade(alembic_config, "head")
    except Exception as exc:
        from app.db.safe_errors import sanitized_database_error

        error_type, error_code, reason = sanitized_database_error(
            exc, (password, username)
        )
        print("Migration failed.")
        print(f"  Exception type: {error_type}")
        print(f"  Database error code: {error_code}")
        print(f"  Reason: {reason}")
        return 1

    print("Migration completed successfully at Alembic head.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
