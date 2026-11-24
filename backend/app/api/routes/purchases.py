from typing import List
from fastapi import APIRouter, Depends, Header, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.purchase import PurchaseCreate, PurchaseOut
from app.services.purchase_service import purchase_service
from app.core.security import get_current_active_user, require_roles
from app.models.user import User

router = APIRouter(
    prefix="/purchases",
    tags=["Purchases"]
)


@router.get("/", response_model=List[PurchaseOut])
def get_purchases(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return purchase_service.get_all(db, skip=skip, limit=limit)


@router.post("/", response_model=PurchaseOut, status_code=status.HTTP_201_CREATED)
def create_purchase(
    purchase_in: PurchaseCreate,
    idempotency_key: str | None = Header(
        default=None,
        alias="Idempotency-Key",
        min_length=1,
        max_length=128,
        description=(
            "Optional client-generated retry key. Requests without this header "
            "are not protected from duplicate creation."
        ),
    ),
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return purchase_service.create_purchase(
        db, purchase_in, user_id=current_user.id, idempotency_key=idempotency_key
    )


@router.post("/{purchase_id}/receive", response_model=PurchaseOut)
def receive_purchase(
    purchase_id: int,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return purchase_service.receive_purchase(db, purchase_id, user_id=current_user.id)


@router.get("/{purchase_id}", response_model=PurchaseOut)
def get_purchase(
    purchase_id: int,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return purchase_service.get_by_id(db, purchase_id)
