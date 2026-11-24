from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut
from app.services.product_service import product_service
from app.core.security import get_current_active_user, require_roles
from app.models.user import User

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.get("/", response_model=List[ProductOut])
def get_products(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    supplier_id: Optional[int] = None,
    low_stock_only: bool = False,
    active_only: bool = False,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    products, _ = product_service.get_all(
        db,
        search=search,
        category_id=category_id,
        supplier_id=supplier_id,
        low_stock_only=low_stock_only,
        active_only=active_only,
        skip=skip,
        limit=limit
    )
    return products


@router.get("/lookup/{identifier}", response_model=ProductOut)
def lookup_product(
    identifier: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    prod = product_service.get_by_sku_or_barcode(db, identifier)
    return product_service.map_to_out(prod)


@router.get("/low-stock", response_model=List[ProductOut])
def get_low_stock_products(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    products, _ = product_service.get_all(db, low_stock_only=True, skip=skip, limit=limit)
    return products


@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    prod_in: ProductCreate,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return product_service.create(db, prod_in, user_id=current_user.id)


@router.get("/{product_id}", response_model=ProductOut)
def get_product(
    product_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    prod = product_service.get_by_id(db, product_id)
    return product_service.map_to_out(prod)


@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    prod_update: ProductUpdate,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return product_service.update(db, product_id, prod_update, user_id=current_user.id)


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    product_service.delete(db, product_id)
    return {"message": "Product deleted successfully"}
