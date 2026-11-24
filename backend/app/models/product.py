from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    barcode = Column(String(100), unique=True, nullable=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(String(255), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True)
    cost_price = Column(Float, default=0.0, nullable=False)
    selling_price = Column(Float, nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    reorder_level = Column(Integer, default=10, nullable=False)
    unit = Column(String(20), default="pcs", nullable=False)  # pcs, kg, box, liter, etc.
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    category_rel = relationship("Category", back_populates="products")
    supplier_rel = relationship("Supplier", back_populates="products")
    movements = relationship("InventoryMovement", back_populates="product_rel")
    sale_items = relationship("SaleItem", back_populates="product_rel")
    purchase_items = relationship("PurchaseItem", back_populates="product_rel")

    # Backward compatibility property getters
    @property
    def price(self) -> float:
        return self.selling_price

    @price.setter
    def price(self, val: float):
        self.selling_price = val

    @property
    def category(self) -> str:
        return self.category_rel.name if self.category_rel else ""

    @property
    def supplier(self) -> str:
        return self.supplier_rel.name if self.supplier_rel else ""
