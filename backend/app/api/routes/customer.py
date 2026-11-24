from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerOut
from app.services.customer_service import customer_service
from app.core.security import get_current_active_user, require_roles
from app.models.user import User

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.get("/", response_model=List[CustomerOut])
def get_customers(
    search: Optional[str] = None,
    active_only: bool = False,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return customer_service.get_all(db, search=search, active_only=active_only, skip=skip, limit=limit)


@router.post("/", response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
def create_customer(
    cust_in: CustomerCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return customer_service.create(db, cust_in)


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(
    customer_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return customer_service.get_by_id(db, customer_id)


@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: int,
    cust_update: CustomerUpdate,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return customer_service.update(db, customer_id, cust_update)


@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    customer_service.delete(db, customer_id)
    return {"message": "Customer deleted successfully"}
