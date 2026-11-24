from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class PurchaseItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_cost: float = Field(..., ge=0)


class PurchaseCreate(BaseModel):
    supplier_id: Optional[int] = None
    items: List[PurchaseItemCreate] = Field(..., min_length=1)
    tax_amount: float = Field(0.0, ge=0)
    status: Literal["Ordered", "Received", "Cancelled"] = "Received"
    notes: Optional[str] = None


class PurchaseItemOut(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = ""
    product_sku: Optional[str] = ""
    quantity: int
    unit_cost: float
    subtotal: float

    class Config:
        from_attributes = True


class PurchaseOut(BaseModel):
    id: int
    purchase_number: str
    supplier_id: Optional[int] = None
    supplier_name: Optional[str] = ""
    user_id: Optional[int] = None
    user_name: Optional[str] = ""
    subtotal: float
    tax_amount: float
    total_amount: float
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    items: List[PurchaseItemOut] = []

    class Config:
        from_attributes = True
