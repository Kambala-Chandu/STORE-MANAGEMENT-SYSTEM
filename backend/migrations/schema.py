"""Frozen version-1 baseline schema used by the initial Alembic revision."""

import sqlalchemy as sa


BASELINE_METADATA = sa.MetaData()

users = sa.Table(
    "users", BASELINE_METADATA,
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("full_name", sa.String(100), nullable=False),
    sa.Column("username", sa.String(50), nullable=False),
    sa.Column("email", sa.String(100), nullable=False),
    sa.Column("password", sa.String(255), nullable=False),
    sa.Column("role", sa.String(20), nullable=False),
    sa.Column("is_active", sa.Boolean(), nullable=False),
    sa.Column("created_at", sa.DateTime()),
    sa.Column("updated_at", sa.DateTime()),
)
sa.Index("ix_users_id", users.c.id)
sa.Index("ix_users_username", users.c.username, unique=True)
sa.Index("ix_users_email", users.c.email, unique=True)

categories = sa.Table(
    "categories", BASELINE_METADATA,
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("name", sa.String(100), nullable=False),
    sa.Column("description", sa.String(255)),
    sa.Column("is_active", sa.Boolean(), nullable=False),
    sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
)
sa.Index("ix_categories_id", categories.c.id)
sa.Index("ix_categories_name", categories.c.name, unique=True)

suppliers = sa.Table(
    "suppliers", BASELINE_METADATA,
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("name", sa.String(100), nullable=False),
    sa.Column("contact_name", sa.String(100)),
    sa.Column("email", sa.String(100)),
    sa.Column("phone", sa.String(30)),
    sa.Column("address", sa.String(255)),
    sa.Column("city", sa.String(100)),
    sa.Column("is_active", sa.Boolean(), nullable=False),
    sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
)
sa.Index("ix_suppliers_id", suppliers.c.id)
sa.Index("ix_suppliers_name", suppliers.c.name)

customers = sa.Table(
    "customers", BASELINE_METADATA,
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("name", sa.String(100), nullable=False),
    sa.Column("email", sa.String(100)),
    sa.Column("phone", sa.String(30)),
    sa.Column("address", sa.String(255)),
    sa.Column("loyalty_points", sa.Integer(), nullable=False),
    sa.Column("is_active", sa.Boolean(), nullable=False),
    sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
)
sa.Index("ix_customers_id", customers.c.id)
sa.Index("ix_customers_name", customers.c.name)
sa.Index("ix_customers_email", customers.c.email)
sa.Index("ix_customers_phone", customers.c.phone)

products = sa.Table(
    "products", BASELINE_METADATA,
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("sku", sa.String(50), nullable=False),
    sa.Column("barcode", sa.String(100)),
    sa.Column("name", sa.String(100), nullable=False),
    sa.Column("description", sa.String(255)),
    sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id", ondelete="SET NULL")),
    sa.Column("supplier_id", sa.Integer(), sa.ForeignKey("suppliers.id", ondelete="SET NULL")),
    sa.Column("cost_price", sa.Float(), nullable=False),
    sa.Column("selling_price", sa.Float(), nullable=False),
    sa.Column("quantity", sa.Integer(), nullable=False),
    sa.Column("reorder_level", sa.Integer(), nullable=False),
    sa.Column("unit", sa.String(20), nullable=False),
    sa.Column("is_active", sa.Boolean(), nullable=False),
    sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
)
sa.Index("ix_products_id", products.c.id)
sa.Index("ix_products_sku", products.c.sku, unique=True)
sa.Index("ix_products_barcode", products.c.barcode, unique=True)
sa.Index("ix_products_name", products.c.name)

purchases = sa.Table(
    "purchases", BASELINE_METADATA,
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("purchase_number", sa.String(50), nullable=False),
    sa.Column("supplier_id", sa.Integer(), sa.ForeignKey("suppliers.id", ondelete="SET NULL")),
    sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
    sa.Column("subtotal", sa.Float(), nullable=False),
    sa.Column("tax_amount", sa.Float(), nullable=False),
    sa.Column("total_amount", sa.Float(), nullable=False),
    sa.Column("status", sa.String(30), nullable=False),
    sa.Column("invoice_date", sa.DateTime(timezone=True)),
    sa.Column("notes", sa.Text()),
    sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
)
sa.Index("ix_purchases_id", purchases.c.id)
sa.Index("ix_purchases_purchase_number", purchases.c.purchase_number, unique=True)

sales = sa.Table(
    "sales", BASELINE_METADATA,
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("invoice_number", sa.String(50), nullable=False),
    sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id", ondelete="SET NULL")),
    sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
    sa.Column("subtotal", sa.Float(), nullable=False),
    sa.Column("discount", sa.Float(), nullable=False),
    sa.Column("tax_rate", sa.Float(), nullable=False),
    sa.Column("tax_amount", sa.Float(), nullable=False),
    sa.Column("total_amount", sa.Float(), nullable=False),
    sa.Column("payment_method", sa.String(30), nullable=False),
    sa.Column("status", sa.String(30), nullable=False),
    sa.Column("notes", sa.Text()),
    sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
)
sa.Index("ix_sales_id", sales.c.id)
sa.Index("ix_sales_invoice_number", sales.c.invoice_number, unique=True)

purchase_items = sa.Table(
    "purchase_items", BASELINE_METADATA,
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("purchase_id", sa.Integer(), sa.ForeignKey("purchases.id", ondelete="CASCADE"), nullable=False),
    sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="RESTRICT"), nullable=False),
    sa.Column("quantity", sa.Integer(), nullable=False),
    sa.Column("unit_cost", sa.Float(), nullable=False),
    sa.Column("subtotal", sa.Float(), nullable=False),
)
sa.Index("ix_purchase_items_id", purchase_items.c.id)
sa.Index("ix_purchase_items_purchase_id", purchase_items.c.purchase_id)
sa.Index("ix_purchase_items_product_id", purchase_items.c.product_id)

sale_items = sa.Table(
    "sale_items", BASELINE_METADATA,
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("sale_id", sa.Integer(), sa.ForeignKey("sales.id", ondelete="CASCADE"), nullable=False),
    sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="RESTRICT"), nullable=False),
    sa.Column("product_name", sa.String(100), nullable=False),
    sa.Column("quantity", sa.Integer(), nullable=False),
    sa.Column("unit_price", sa.Float(), nullable=False),
    sa.Column("cost_price", sa.Float(), nullable=False),
    sa.Column("subtotal", sa.Float(), nullable=False),
)
sa.Index("ix_sale_items_id", sale_items.c.id)
sa.Index("ix_sale_items_sale_id", sale_items.c.sale_id)
sa.Index("ix_sale_items_product_id", sale_items.c.product_id)

inventory_movements = sa.Table(
    "inventory_movements", BASELINE_METADATA,
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
    sa.Column("movement_type", sa.String(30), nullable=False),
    sa.Column("quantity", sa.Integer(), nullable=False),
    sa.Column("unit_cost", sa.Float()),
    sa.Column("reference_id", sa.String(100)),
    sa.Column("reference_type", sa.String(50)),
    sa.Column("notes", sa.Text()),
    sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
    sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
)
sa.Index("ix_inventory_movements_id", inventory_movements.c.id)
sa.Index("ix_inventory_movements_product_id", inventory_movements.c.product_id)

audit_logs = sa.Table(
    "audit_logs", BASELINE_METADATA,
    sa.Column("id", sa.Integer(), primary_key=True),
    sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL")),
    sa.Column("username", sa.String(100)),
    sa.Column("action", sa.String(100), nullable=False),
    sa.Column("entity_type", sa.String(50)),
    sa.Column("entity_id", sa.String(100)),
    sa.Column("details", sa.Text()),
    sa.Column("ip_address", sa.String(50)),
    sa.Column("created_at", sa.DateTime()),
)
sa.Index("ix_audit_logs_id", audit_logs.c.id)
sa.Index("ix_audit_logs_action", audit_logs.c.action)
sa.Index("ix_audit_logs_created_at", audit_logs.c.created_at)
