"""Add purchase-creation idempotency metadata."""

from alembic import op
import sqlalchemy as sa


revision = "0002_purchase_idempotency"
down_revision = "0001_v1_schema_baseline"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("purchases") as batch_op:
        batch_op.add_column(sa.Column("idempotency_key", sa.String(128), nullable=True))
        batch_op.add_column(sa.Column("idempotency_operation", sa.String(50), nullable=True))
        batch_op.add_column(sa.Column("idempotency_request_hash", sa.String(64), nullable=True))
        batch_op.create_unique_constraint(
            "uq_purchase_idempotency_user_operation_key",
            ["user_id", "idempotency_operation", "idempotency_key"],
        )


def downgrade() -> None:
    with op.batch_alter_table("purchases") as batch_op:
        batch_op.drop_constraint(
            "uq_purchase_idempotency_user_operation_key", type_="unique"
        )
        batch_op.drop_column("idempotency_request_hash")
        batch_op.drop_column("idempotency_operation")
        batch_op.drop_column("idempotency_key")
