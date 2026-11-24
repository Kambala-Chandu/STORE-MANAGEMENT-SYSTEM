"""Version-1 schema baseline."""

from alembic import op

from migrations.schema import BASELINE_METADATA

revision = "0001_v1_schema_baseline"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    BASELINE_METADATA.create_all(bind=op.get_bind(), checkfirst=False)


def downgrade() -> None:
    BASELINE_METADATA.drop_all(bind=op.get_bind(), checkfirst=True)
