from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.supplier import Supplier
from app.models.product import Product
from app.schemas.supplier import SupplierCreate, SupplierUpdate


class SupplierService:
    @staticmethod
    def get_all(db: Session, search: Optional[str] = None, active_only: bool = False) -> List[Supplier]:
        query = db.query(Supplier)
        if search:
            s = f"%{search}%"
            query = query.filter(
                (Supplier.name.ilike(s)) |
                (Supplier.contact_name.ilike(s)) |
                (Supplier.phone.ilike(s)) |
                (Supplier.email.ilike(s))
            )
        if active_only:
            query = query.filter(Supplier.is_active == True)
        return query.order_by(Supplier.name.asc()).all()

    @staticmethod
    def get_by_id(db: Session, supplier_id: int) -> Supplier:
        supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
        if not supplier:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")
        return supplier

    @staticmethod
    def create(db: Session, supp_in: SupplierCreate) -> Supplier:
        db_supp = Supplier(
            name=supp_in.name.strip(),
            contact_name=supp_in.contact_name.strip() if supp_in.contact_name else None,
            email=supp_in.email.strip() if supp_in.email else None,
            phone=supp_in.phone.strip() if supp_in.phone else None,
            address=supp_in.address.strip() if supp_in.address else None,
            city=supp_in.city.strip() if supp_in.city else None,
            is_active=supp_in.is_active if supp_in.is_active is not None else True
        )
        db.add(db_supp)
        db.commit()
        db.refresh(db_supp)
        return db_supp

    @staticmethod
    def update(db: Session, supplier_id: int, supp_update: SupplierUpdate) -> Supplier:
        supp = SupplierService.get_by_id(db, supplier_id)
        if supp_update.name is not None:
            supp.name = supp_update.name.strip()
        if supp_update.contact_name is not None:
            supp.contact_name = supp_update.contact_name.strip() if supp_update.contact_name else None
        if supp_update.email is not None:
            supp.email = supp_update.email.strip() if supp_update.email else None
        if supp_update.phone is not None:
            supp.phone = supp_update.phone.strip() if supp_update.phone else None
        if supp_update.address is not None:
            supp.address = supp_update.address.strip() if supp_update.address else None
        if supp_update.city is not None:
            supp.city = supp_update.city.strip() if supp_update.city else None
        if supp_update.is_active is not None:
            supp.is_active = supp_update.is_active

        db.commit()
        db.refresh(supp)
        return supp

    @staticmethod
    def delete(db: Session, supplier_id: int) -> bool:
        supp = SupplierService.get_by_id(db, supplier_id)
        # Check if products exist for supplier
        product_count = db.query(Product).filter(Product.supplier_id == supplier_id).count()
        if product_count > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete supplier: {product_count} products are linked to this supplier."
            )
        db.delete(supp)
        db.commit()
        return True


supplier_service = SupplierService()
