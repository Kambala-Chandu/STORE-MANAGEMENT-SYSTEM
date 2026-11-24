"""Verify an existing database before adopting the v1 Alembic baseline.

This command is read-only. Run it before `alembic stamp 0001_v1_schema_baseline`.
"""

from alembic.autogenerate import compare_metadata
from alembic.migration import MigrationContext
from sqlalchemy.engine import Connection

from app.db.database import engine
from migrations.schema import BASELINE_METADATA


def baseline_differences(connection: Connection) -> list:
    context = MigrationContext.configure(
        connection,
        # MySQL reflects CURRENT_TIMESTAMP differently from SQLAlchemy's
        # equivalent func.now() expression, so textual default comparison
        # would reject a compatible schema.
        opts={"compare_type": True, "compare_server_default": False},
    )
    return compare_metadata(context, BASELINE_METADATA)


def verify_baseline_compatibility(connection: Connection) -> None:
    differences = baseline_differences(connection)
    if differences:
        summaries = sorted({str(change[0]) for change in differences})
        raise RuntimeError(
            "Existing database does not match the v1 baseline; do not stamp it. "
            "Detected schema change types: " + ", ".join(summaries)
        )


def main() -> int:
    try:
        with engine.connect() as connection:
            verify_baseline_compatibility(connection)
    except Exception as exc:
        print(f"Baseline verification failed: {exc}")
        return 1
    print("Existing database matches the v1 baseline and may be stamped at revision 0001.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
