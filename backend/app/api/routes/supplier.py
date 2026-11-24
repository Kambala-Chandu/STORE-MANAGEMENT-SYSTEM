from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.supplier import SupplierCreate, SupplierUpdate, SupplierOut
from app.services.supplier_service import supplier_service
from app.core.security import get_current_active_user, require_roles
from app.models.user import User

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"]
)


@router.get("/", response_model=List[SupplierOut])
def get_suppliers(
    search: Optional[str] = None,
    active_only: bool = False,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return supplier_service.get_all(db, search=search, active_only=active_only)


@router.post("/", response_model=SupplierOut, status_code=status.HTTP_201_CREATED)
def create_supplier(
    supp_in: SupplierCreate,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return supplier_service.create(db, supp_in)


@router.get("/{supplier_id}", response_model=SupplierOut)
def get_supplier(
    supplier_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return supplier_service.get_by_id(db, supplier_id)


@router.put("/{supplier_id}", response_model=SupplierOut)
def update_supplier(
    supplier_id: int,
    supp_update: SupplierUpdate,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return supplier_service.update(db, supplier_id, supp_update)


@router.delete("/{supplier_id}")
def delete_supplier(
    supplier_id: int,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    supplier_service.delete(db, supplier_id)
    return {"message": "Supplier deleted successfully"}
