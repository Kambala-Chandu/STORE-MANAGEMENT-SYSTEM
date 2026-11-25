"""Guarded first-Admin bootstrap for an already migrated hosted database.

Run from the backend directory with:
    python -m app.db.bootstrap_hosted_admin
"""

import getpass
import os
from pathlib import Path
import secrets


# Disable dotenv before importing application modules. All connection values
# are entered locally and exist only for this process.
os.environ["PYTHON_DOTENV_DISABLED"] = "1"

from app.db.migrate_new_database import _is_local_host, _prompt_required
from app.db.safe_errors import sanitized_database_error


def main() -> int:
    print("Guarded first-Admin bootstrap for a migrated hosted database")
    host = _prompt_required("Database host")
    if _is_local_host(host):
        print("Bootstrap refused: local database hosts are not allowed.")
        return 2

    port = input("Database port [3306]: ").strip() or "3306"
    database = _prompt_required("Database name")
    database_user = _prompt_required("Database user")
    database_password = getpass.getpass("Database password: ")
    ca_input = input(
        "CA bundle path [leave empty to use Certifi's trusted CA store]: "
    ).strip()

    if not database_password:
        print("Bootstrap refused: database password is required.")
        return 2

    ca_path = ""
    if ca_input:
        candidate = Path(ca_input).expanduser().resolve()
        if not candidate.is_file():
            print("Bootstrap refused: the CA bundle file was not found.")
            return 2
        ca_path = str(candidate)

    os.environ.update({
        "ENVIRONMENT": "production",
        "DEBUG": "False",
        "SEED_DEMO_DATA": "False",
        "ENABLE_PUBLIC_REGISTRATION": "False",
        "ENABLE_PROTOTYPE_ROUTERS": "False",
        "DB_HOST": host,
        "DB_PORT": port,
        "DB_NAME": database,
        "DB_USER": database_user,
        "DB_PASSWORD": database_password,
        "DB_SSL_ENABLED": "True",
        "DB_SSL_CA": ca_path,
        "SECRET_KEY": secrets.token_urlsafe(48),
        "CORS_ORIGINS": "http://127.0.0.1",
    })

    print("\nTarget hosted database:")
    print(f"  Host: {host}")
    print(f"  Database: {database}")
    print("Verifying the current Alembic revision...")

    engine = None
    try:
        from alembic.config import Config
        from alembic.script import ScriptDirectory
        from sqlalchemy import text
        from app.db.database import SessionLocal, engine

        backend_dir = Path(__file__).resolve().parents[2]
        alembic_config = Config(str(backend_dir / "alembic.ini"))
        alembic_config.set_main_option(
            "script_location", str(backend_dir / "migrations")
        )
        expected_head = ScriptDirectory.from_config(alembic_config).get_current_head()
        with engine.connect() as connection:
            revisions = list(
                connection.execute(
                    text("SELECT version_num FROM alembic_version")
                ).scalars()
            )
    except Exception as exc:
        kind, code, reason = sanitized_database_error(
            exc, (database_password, database_user)
        )
        print("Revision verification failed; no account was created.")
        print(f"  Exception type: {kind}")
        print(f"  Database error code: {code}")
        print(f"  Reason: {reason}")
        if engine is not None:
            engine.dispose()
        return 1

    if revisions != [expected_head]:
        print("Bootstrap refused: the database is not at the single expected Alembic head.")
        print(f"  Expected revision: {expected_head}")
        print(f"  Recorded revision count: {len(revisions)}")
        engine.dispose()
        return 2

    print(f"Migration verification passed: {expected_head}")
    confirmation = input(
        f"Type CREATE ADMIN to continue for {host} / {database}: "
    ).strip()
    if confirmation != "CREATE ADMIN":
        print("Bootstrap cancelled. No account was created.")
        engine.dispose()
        return 2

    full_name = _prompt_required("Admin full name")
    username = _prompt_required("Admin username")
    email = _prompt_required("Admin email")
    admin_password = getpass.getpass("Admin password: ")
    if not admin_password:
        print("Bootstrap refused: Admin password is required.")
        engine.dispose()
        return 2
    if admin_password != getpass.getpass("Confirm Admin password: "):
        print("Bootstrap refused: Admin passwords do not match.")
        engine.dispose()
        return 2

    try:
        from fastapi import HTTPException
        from pydantic import ValidationError
        from app.bootstrap_admin import bootstrap_first_admin

        with SessionLocal() as session:
            admin = bootstrap_first_admin(
                session,
                full_name=full_name,
                username=username,
                email=email,
                password=admin_password,
            )
    except RuntimeError:
        print("Bootstrap refused: an Admin account already exists.")
        return 2
    except ValidationError:
        print("Bootstrap refused: Admin profile or password validation failed.")
        return 2
    except HTTPException as exc:
        print(f"Bootstrap refused: {exc.detail}")
        return 2
    except Exception as exc:
        kind, code, reason = sanitized_database_error(
            exc,
            (
                database_password,
                database_user,
                admin_password,
                full_name,
                username,
                email,
            ),
        )
        print("Admin creation failed.")
        print(f"  Exception type: {kind}")
        print(f"  Database error code: {code}")
        print(f"  Reason: {reason}")
        return 1
    finally:
        engine.dispose()

    print(f"First Admin created successfully for username: {admin.username}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
