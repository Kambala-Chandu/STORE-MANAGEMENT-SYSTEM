from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field, field_validator


class StockAdjustmentCreate(BaseModel):
    product_id: int
    adjustment_type: Literal["DAMAGE", "CORRECTION", "RESTOCK", "WASTAGE", "RETURN"]
    quantity_change: int = Field(..., description="Positive to increase stock, negative to decrease stock")
    notes: Optional[str] = None

    @field_validator("quantity_change")
    @classmethod
    def quantity_change_must_not_be_zero(cls, value: int) -> int:
        if value == 0:
            raise ValueError("quantity_change must not be zero")
        return value


class InventoryMovementOut(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    product_sku: Optional[str] = None
    movement_type: str
    quantity: int
    unit_cost: Optional[float] = None
    reference_id: Optional[str] = None
    reference_type: Optional[str] = None
    notes: Optional[str] = None
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
