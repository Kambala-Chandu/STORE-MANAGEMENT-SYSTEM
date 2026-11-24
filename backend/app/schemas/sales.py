from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_price: Optional[float] = Field(None, ge=0)  # if None, product current selling_price is used


class SaleCreate(BaseModel):
    customer_id: Optional[int] = None
    items: List[SaleItemCreate] = Field(..., min_length=1)
    discount: Optional[float] = Field(0.0, ge=0)
    tax_rate: Optional[float] = Field(0.0, ge=0, le=100)
    payment_method: Optional[str] = "Cash"
    notes: Optional[str] = None


class SaleItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True


class SaleOut(BaseModel):
    id: int
    invoice_number: str
    customer_id: Optional[int] = None
    customer_name: Optional[str] = "Walk-in Customer"
    customer_phone: Optional[str] = ""
    user_id: Optional[int] = None
    cashier_name: Optional[str] = ""
    subtotal: float
    discount: float
    tax_rate: float
    tax_amount: float
    total_amount: float
    payment_method: str
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    items: List[SaleItemOut] = []

    class Config:
        from_attributes = True


class SaleReceiptOut(BaseModel):
    store_name: str
    store_contact: str
    invoice_number: str
    date: datetime
    cashier: str
    customer_name: str
    customer_phone: Optional[str] = None
    items: List[SaleItemOut]
    subtotal: float
    discount: float
    tax_rate: float
    tax_amount: float
    total_amount: float
    payment_method: str
