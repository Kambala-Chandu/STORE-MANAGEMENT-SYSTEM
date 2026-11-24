from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryOut
from app.services.category_service import category_service
from app.core.security import get_current_active_user, require_roles
from app.models.user import User

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


@router.get("/", response_model=List[CategoryOut])
def get_categories(
    search: Optional[str] = None,
    active_only: bool = False,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return category_service.get_all(db, search=search, active_only=active_only)


@router.post("/", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(
    cat_in: CategoryCreate,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    cat = category_service.create(db, cat_in)
    return CategoryOut(
        id=cat.id,
        name=cat.name,
        description=cat.description,
        is_active=cat.is_active,
        product_count=0,
        created_at=cat.created_at,
        updated_at=cat.updated_at
    )


@router.get("/{category_id}", response_model=CategoryOut)
def get_category(
    category_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    cat = category_service.get_by_id(db, category_id)
    return CategoryOut(
        id=cat.id,
        name=cat.name,
        description=cat.description,
        is_active=cat.is_active,
        product_count=0,
        created_at=cat.created_at,
        updated_at=cat.updated_at
    )


@router.put("/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: int,
    cat_update: CategoryUpdate,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    cat = category_service.update(db, category_id, cat_update)
    return CategoryOut(
        id=cat.id,
        name=cat.name,
        description=cat.description,
        is_active=cat.is_active,
        product_count=0,
        created_at=cat.created_at,
        updated_at=cat.updated_at
    )


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    category_service.delete(db, category_id)
    return {"message": "Category deleted successfully"}
