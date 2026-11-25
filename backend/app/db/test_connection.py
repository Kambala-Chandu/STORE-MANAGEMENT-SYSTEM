"""Interactive, read-only verified-TLS MySQL connectivity check.

Run from the backend directory with:
    python -m app.db.test_connection
"""

import getpass
import os
from pathlib import Path
import secrets


# This must be set before importing application configuration. The command uses
# only values entered in this process and never reads the project's .env file.
os.environ["PYTHON_DOTENV_DISABLED"] = "1"


def _prompt_required(label: str) -> str:
    while True:
        value = input(f"{label}: ").strip()
        if value:
            return value
        print(f"{label} is required.")


def main() -> int:
    print("Verified-TLS MySQL connectivity check (SELECT 1 only)")
    host = _prompt_required("Database host")
    port = input("Database port [3306]: ").strip() or "3306"
    database = _prompt_required("Database name")
    username = _prompt_required("Database user")
    password = getpass.getpass("Database password: ")
    ca_input = input(
        "CA bundle path [leave empty to use Certifi's trusted CA store]: "
    ).strip()

    if not password:
        print("Connection test refused: database password is required.")
        return 2

    ca_path = ""
    if ca_input:
        candidate = Path(ca_input).expanduser().resolve()
        if not candidate.is_file():
            print("Connection test refused: the CA bundle file was not found.")
            return 2
        ca_path = str(candidate)

    # Values exist only in this child process. The temporary secret satisfies
    # application validation but is never persisted or used to issue tokens.
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
        from sqlalchemy import text
        from app.db.database import create_database_engine

        engine = create_database_engine()
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1")).scalar_one()
        if result != 1:
            print("Connection test failed: the server returned an unexpected result.")
            return 1
    except Exception:
        # Driver exceptions can contain hostnames, usernames, certificate paths,
        # or other connection details, so never print them here.
        print("Connection test failed. No database changes were attempted.")
        return 1
    finally:
        if engine is not None:
            engine.dispose()

    print("Connection successful: verified TLS and SELECT 1 completed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
