from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class Purchase(Base):
    __tablename__ = "purchases"
    __table_args__ = (
        UniqueConstraint(
            "user_id", "idempotency_operation", "idempotency_key",
            name="uq_purchase_idempotency_user_operation_key",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    purchase_number = Column(String(50), unique=True, nullable=False, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    subtotal = Column(Float, default=0.0, nullable=False)
    tax_amount = Column(Float, default=0.0, nullable=False)
    total_amount = Column(Float, default=0.0, nullable=False)
    status = Column(String(30), default="Received", nullable=False)  # Received, Ordered, Cancelled
    invoice_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    idempotency_key = Column(String(128), nullable=True)
    idempotency_operation = Column(String(50), nullable=True)
    idempotency_request_hash = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    supplier_rel = relationship("Supplier", back_populates="purchases")
    user_rel = relationship("User")
    items = relationship("PurchaseItem", back_populates="purchase_rel", cascade="all, delete-orphan")


class PurchaseItem(Base):
    __tablename__ = "purchase_items"

    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    unit_cost = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    purchase_rel = relationship("Purchase", back_populates="items")
    product_rel = relationship("Product", back_populates="purchase_items")
