from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    movement_type = Column(String(30), nullable=False)  # IN, OUT, ADJUSTMENT, SALE, PURCHASE, RETURN, DAMAGE
    quantity = Column(Integer, nullable=False)  # positive for addition, negative for reduction
    unit_cost = Column(Float, nullable=True)
    reference_id = Column(String(100), nullable=True)  # Invoice #, PO #, Adjustment ID
    reference_type = Column(String(50), nullable=True)  # SALE, PURCHASE, MANUAL
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    product_rel = relationship("Product", back_populates="movements")
    user_rel = relationship("User")
