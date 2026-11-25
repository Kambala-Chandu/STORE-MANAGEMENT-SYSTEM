"""Read-only diagnostics for a partially migrated hosted MySQL database.

Run from the backend directory with:
    python -m app.db.diagnose_hosted_database
"""

import getpass
import os
from pathlib import Path
import secrets


# Disable dotenv before importing application modules. Prompted values exist
# only in this process and no project .env file is read or changed.
os.environ["PYTHON_DOTENV_DISABLED"] = "1"

from app.db.migrate_new_database import _is_local_host, _prompt_required
from app.db.safe_errors import sanitized_database_error


def main() -> int:
    print("Read-only hosted MySQL migration diagnostic")
    host = _prompt_required("Database host")
    if _is_local_host(host):
        print("Diagnostic refused: local database hosts are not allowed.")
        return 2

    port = input("Database port [3306]: ").strip() or "3306"
    database = _prompt_required("Database name")
    username = _prompt_required("Database user")
    password = getpass.getpass("Database password: ")
    ca_input = input(
        "CA bundle path [leave empty to use Certifi's trusted CA store]: "
    ).strip()

    if not password:
        print("Diagnostic refused: database password is required.")
        return 2

    ca_path = ""
    if ca_input:
        candidate = Path(ca_input).expanduser().resolve()
        if not candidate.is_file():
            print("Diagnostic refused: the CA bundle file was not found.")
            return 2
        ca_path = str(candidate)

    print("\nRead-only target:")
    print(f"  Host: {host}")
    print(f"  Database: {database}")

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
        from sqlalchemy import inspect, text
        from app.db.database import create_database_engine
        from migrations.schema import BASELINE_METADATA

        engine = create_database_engine()
        with engine.connect() as connection:
            inspector = inspect(connection)
            tables = sorted(inspector.get_table_names())
            views = sorted(inspector.get_view_names())
            revisions = []
            if "alembic_version" in tables:
                revisions = list(
                    connection.execute(
                        text("SELECT version_num FROM alembic_version")
                    ).scalars()
                )
            server_settings = connection.execute(text(
                "SELECT @@version AS version, "
                "@@version_comment AS version_comment, "
                "@@sql_mode AS sql_mode, "
                "@@lower_case_table_names AS lower_case_table_names, "
                "@@default_storage_engine AS default_storage_engine, "
                "@@character_set_server AS character_set_server, "
                "@@collation_server AS collation_server"
            )).mappings().one()

            expected_tables = {table.name: table for table in BASELINE_METADATA.tables.values()}
            actual_application_tables = set(tables) - {"alembic_version"}
            missing_tables = sorted(set(expected_tables) - actual_application_tables)
            unexpected_tables = sorted(actual_application_tables - set(expected_tables))
            schema_differences = []
            for table_name in sorted(set(expected_tables) & actual_application_tables):
                expected = expected_tables[table_name]
                actual_columns = {column["name"] for column in inspector.get_columns(table_name)}
                expected_columns = {column.name for column in expected.columns}
                actual_index_details = inspector.get_indexes(table_name)
                actual_indexes = {
                    (tuple(index["column_names"]), bool(index.get("unique", False)))
                    for index in actual_index_details
                }
                expected_indexes = {
                    (tuple(column.name for column in index.columns), bool(index.unique))
                    for index in expected.indexes
                }
                actual_fks = {
                    (
                        tuple(fk["constrained_columns"]),
                        fk["referred_table"],
                        tuple(fk["referred_columns"]),
                        (fk.get("options") or {}).get("ondelete"),
                    )
                    for fk in inspector.get_foreign_keys(table_name)
                }
                expected_fks = {
                    (
                        tuple(element.parent.name for element in fk.elements),
                        next(iter(fk.elements)).column.table.name,
                        tuple(element.column.name for element in fk.elements),
                        fk.ondelete,
                    )
                    for fk in expected.foreign_key_constraints
                }
                if actual_columns != expected_columns:
                    schema_differences.append(
                        (table_name, "columns", sorted(expected_columns - actual_columns),
                         sorted(actual_columns - expected_columns))
                    )
                if actual_indexes != expected_indexes:
                    schema_differences.append(
                        (table_name, "index definitions (columns, unique)",
                         sorted(map(str, expected_indexes - actual_indexes)),
                         sorted(map(str, actual_indexes - expected_indexes)))
                    )
                if actual_fks != expected_fks:
                    schema_differences.append(
                        (table_name, "foreign keys", sorted(map(str, expected_fks - actual_fks)),
                         sorted(map(str, actual_fks - expected_fks)))
                    )

            dependency_details = {}
            for table_name in ("products", "users", "sale_items"):
                if table_name in actual_application_tables:
                    dependency_details[table_name] = {
                        "columns": [
                            f"{column['name']} {column['type']} nullable={column['nullable']}"
                            for column in inspector.get_columns(table_name)
                        ],
                        "indexes": [
                            {
                                "name": index["name"],
                                "columns": index["column_names"],
                                "unique": bool(index.get("unique", False)),
                            }
                            for index in inspector.get_indexes(table_name)
                        ],
                        "foreign_keys": [
                            str(fk) for fk in inspector.get_foreign_keys(table_name)
                        ],
                        "options": inspector.get_table_options(table_name),
                    }
    except Exception as exc:
        error_type, error_code, reason = sanitized_database_error(
            exc, (password, username)
        )
        print("\nDiagnostic query failed; no schema changes were attempted.")
        print(f"  Exception type: {error_type}")
        print(f"  Database error code: {error_code}")
        print(f"  Reason: {reason}")
        return 1
    finally:
        if engine is not None:
            engine.dispose()

    print(f"\nTables found: {len(tables)}")
    if tables:
        for table in tables:
            print(f"  - {table}")
    else:
        print("  (none)")

    print(f"Views found: {len(views)}")
    if views:
        for view in views:
            print(f"  - {view}")
    else:
        print("  (none)")

    if "alembic_version" not in tables:
        print("Alembic revision table: not present")
    elif not revisions:
        print("Alembic revision: table present but no revision row found")
    else:
        print("Alembic revision(s):")
        for revision in revisions:
            print(f"  - {revision}")

    print("\nBaseline comparison:")
    print(f"  Missing expected tables: {missing_tables or '(none)'}")
    print(f"  Unexpected application tables: {unexpected_tables or '(none)'}")
    if schema_differences:
        for table_name, category, missing, extra in schema_differences:
            print(f"  {table_name} {category}: missing={missing}, extra={extra}")
    else:
        print("  Existing baseline tables match expected column/index/foreign-key names.")

    print("\nRelevant dependency and last-created-table details:")
    for table_name, details in dependency_details.items():
        print(f"  {table_name}:")
        print(f"    options: {details['options']}")
        print(f"    columns: {details['columns']}")
        print(f"    indexes: {details['indexes']}")
        print(f"    foreign keys: {details['foreign_keys']}")

    print("\nRelevant MySQL server settings:")
    for name, value in server_settings.items():
        print(f"  {name}: {value}")

    print("\nDiagnostic completed. No schema or data changes were attempted.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
