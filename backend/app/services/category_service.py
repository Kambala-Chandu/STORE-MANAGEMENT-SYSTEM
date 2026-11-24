from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryOut


class CategoryService:
    @staticmethod
    def get_all(db: Session, search: Optional[str] = None, active_only: bool = False) -> List[CategoryOut]:
        query = db.query(
            Category,
            func.count(Product.id).label("product_count")
        ).outerjoin(Product, (Product.category_id == Category.id) & (Product.is_active == True)).group_by(Category.id)

        if search:
            query = query.filter(Category.name.ilike(f"%{search}%"))
        if active_only:
            query = query.filter(Category.is_active == True)

        results = query.order_by(Category.name.asc()).all()
        out = []
        for cat, count in results:
            cat_dict = {
                "id": cat.id,
                "name": cat.name,
                "description": cat.description,
                "is_active": cat.is_active,
                "product_count": count,
                "created_at": cat.created_at,
                "updated_at": cat.updated_at
            }
            out.append(CategoryOut(**cat_dict))
        return out

    @staticmethod
    def get_by_id(db: Session, category_id: int) -> Category:
        cat = db.query(Category).filter(Category.id == category_id).first()
        if not cat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        return cat

    @staticmethod
    def create(db: Session, cat_in: CategoryCreate) -> Category:
        existing = db.query(Category).filter(Category.name.ilike(cat_in.name)).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category with this name already exists")
        db_cat = Category(
            name=cat_in.name.strip(),
            description=cat_in.description.strip() if cat_in.description else None,
            is_active=cat_in.is_active if cat_in.is_active is not None else True
        )
        db.add(db_cat)
        db.commit()
        db.refresh(db_cat)
        return db_cat

    @staticmethod
    def update(db: Session, category_id: int, cat_update: CategoryUpdate) -> Category:
        cat = CategoryService.get_by_id(db, category_id)
        if cat_update.name is not None:
            existing = db.query(Category).filter(
                Category.name.ilike(cat_update.name.strip()),
                Category.id != category_id
            ).first()
            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category name already exists")
            cat.name = cat_update.name.strip()
        if cat_update.description is not None:
            cat.description = cat_update.description.strip() if cat_update.description else None
        if cat_update.is_active is not None:
            cat.is_active = cat_update.is_active

        db.commit()
        db.refresh(cat)
        return cat

    @staticmethod
    def delete(db: Session, category_id: int) -> bool:
        cat = CategoryService.get_by_id(db, category_id)
        # Check if products exist under category
        product_count = db.query(Product).filter(Product.category_id == category_id).count()
        if product_count > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete category: {product_count} products are linked to it. Reassign or delete products first."
            )
        db.delete(cat)
        db.commit()
        return True


category_service = CategoryService()
