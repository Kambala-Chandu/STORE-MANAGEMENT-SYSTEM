from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.inventory import StockAdjustmentCreate, InventoryMovementOut
from app.services.inventory_service import inventory_service
from app.core.security import get_current_active_user, require_roles
from app.models.user import User

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


@router.get("/movements", response_model=List[InventoryMovementOut])
def get_movements(
    product_id: Optional[int] = None,
    movement_type: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return inventory_service.get_movements(
        db,
        product_id=product_id,
        movement_type=movement_type,
        skip=skip,
        limit=limit
    )


@router.post("/adjust", response_model=InventoryMovementOut, status_code=status.HTTP_201_CREATED)
def adjust_stock(
    adjustment_in: StockAdjustmentCreate,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return inventory_service.adjust_stock(db, adjustment_in, user_id=current_user.id)
