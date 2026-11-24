import random
import string
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from app.models.product import Product
from app.models.inventory import InventoryMovement
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut


class ProductService:
    @staticmethod
    def generate_sku(name: str) -> str:
        prefix = "".join(c for c in name[:3].upper() if c.isalnum()) or "PRD"
        suffix = "".join(random.choices(string.digits, k=6))
        return f"{prefix}-{suffix}"

    @staticmethod
    def map_to_out(p: Product) -> ProductOut:
        return ProductOut(
            id=p.id,
            sku=p.sku,
            barcode=p.barcode,
            name=p.name,
            description=p.description,
            category_id=p.category_id,
            category_name=p.category_rel.name if p.category_rel else "",
            supplier_id=p.supplier_id,
            supplier_name=p.supplier_rel.name if p.supplier_rel else "",
            cost_price=p.cost_price,
            selling_price=p.selling_price,
            price=p.selling_price,
            quantity=p.quantity,
            reorder_level=p.reorder_level,
            unit=p.unit,
            is_active=p.is_active,
            is_low_stock=p.quantity <= p.reorder_level,
            created_at=p.created_at,
            updated_at=p.updated_at
        )

    @staticmethod
    def get_all(
        db: Session,
        search: Optional[str] = None,
        category_id: Optional[int] = None,
        supplier_id: Optional[int] = None,
        low_stock_only: bool = False,
        active_only: bool = False,
        skip: int = 0,
        limit: int = 100
    ) -> Tuple[List[ProductOut], int]:
        query = db.query(Product)
        if search:
            s = f"%{search}%"
            query = query.filter(
                or_(
                    Product.name.ilike(s),
                    Product.sku.ilike(s),
                    Product.barcode.ilike(s),
                    Product.description.ilike(s)
                )
            )
        if category_id:
            query = query.filter(Product.category_id == category_id)
        if supplier_id:
            query = query.filter(Product.supplier_id == supplier_id)
        if active_only:
            query = query.filter(Product.is_active == True)
        if low_stock_only:
            query = query.filter(Product.quantity <= Product.reorder_level)

        total = query.count()
        products = query.order_by(Product.name.asc()).offset(skip).limit(limit).all()
        return [ProductService.map_to_out(p) for p in products], total

    @staticmethod
    def get_by_id(db: Session, product_id: int) -> Product:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return product

    @staticmethod
    def get_by_sku_or_barcode(db: Session, identifier: str) -> Product:
        product = db.query(Product).filter(
            or_(Product.sku == identifier, Product.barcode == identifier)
        ).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product with barcode/SKU '{identifier}' not found")
        return product

    @staticmethod
    def create(db: Session, p_in: ProductCreate, user_id: Optional[int] = None) -> ProductOut:
        try:
            sku = p_in.sku.strip() if p_in.sku and p_in.sku.strip() else ProductService.generate_sku(p_in.name)
            if db.query(Product).filter(Product.sku == sku).first():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"SKU '{sku}' already exists")

            if p_in.barcode and p_in.barcode.strip():
                if db.query(Product).filter(Product.barcode == p_in.barcode.strip()).first():
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Barcode '{p_in.barcode}' already exists")

            db_prod = Product(
            sku=sku,
            barcode=p_in.barcode.strip() if p_in.barcode else None,
            name=p_in.name.strip(),
            description=p_in.description.strip() if p_in.description else None,
            category_id=p_in.category_id,
            supplier_id=p_in.supplier_id,
            cost_price=p_in.cost_price or 0.0,
            selling_price=p_in.selling_price,
            quantity=p_in.quantity or 0,
            reorder_level=p_in.reorder_level if p_in.reorder_level is not None else 10,
            unit=p_in.unit or "pcs",
            is_active=p_in.is_active if p_in.is_active is not None else True
            )
            db.add(db_prod)
            db.flush()

        # Log initial inventory if quantity > 0
            if db_prod.quantity > 0:
                movement = InventoryMovement(
                product_id=db_prod.id,
                movement_type="IN",
                quantity=db_prod.quantity,
                unit_cost=db_prod.cost_price,
                reference_id="INITIAL_STOCK",
                reference_type="MANUAL",
                notes="Initial stock upon product creation",
                user_id=user_id
                )
                db.add(movement)

            db.commit()
            db.refresh(db_prod)
            return ProductService.map_to_out(db_prod)
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def update(
        db: Session,
        product_id: int,
        p_update: ProductUpdate,
        user_id: Optional[int] = None
    ) -> ProductOut:
        try:
            prod = db.query(Product).filter(Product.id == product_id).with_for_update().first()
            if not prod:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
            previous_quantity = prod.quantity

            if p_update.name is not None:
                prod.name = p_update.name.strip()
            if p_update.sku is not None and p_update.sku.strip():
                existing = db.query(Product).filter(Product.sku == p_update.sku.strip(), Product.id != product_id).first()
                if existing:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="SKU already in use")
                prod.sku = p_update.sku.strip()
            if p_update.barcode is not None:
                if p_update.barcode.strip():
                    existing = db.query(Product).filter(Product.barcode == p_update.barcode.strip(), Product.id != product_id).first()
                    if existing:
                        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Barcode already in use")
                    prod.barcode = p_update.barcode.strip()
                else:
                    prod.barcode = None
            if p_update.description is not None:
                prod.description = p_update.description.strip() if p_update.description else None
            if p_update.category_id is not None:
                prod.category_id = p_update.category_id
            if p_update.supplier_id is not None:
                prod.supplier_id = p_update.supplier_id
            if p_update.cost_price is not None:
                prod.cost_price = p_update.cost_price
            if p_update.selling_price is not None:
                prod.selling_price = p_update.selling_price
            if p_update.quantity is not None:
                prod.quantity = p_update.quantity
            if p_update.reorder_level is not None:
                prod.reorder_level = p_update.reorder_level
            if p_update.unit is not None:
                prod.unit = p_update.unit
            if p_update.is_active is not None:
                prod.is_active = p_update.is_active

            quantity_change = prod.quantity - previous_quantity
            if quantity_change:
                db.add(InventoryMovement(
                    product_id=prod.id,
                    movement_type="CORRECTION",
                    quantity=quantity_change,
                    unit_cost=prod.cost_price,
                    reference_id=f"PRODUCT-{prod.id}",
                    reference_type="PRODUCT_EDIT",
                    notes="Stock changed through product edit",
                    user_id=user_id
                ))

            db.commit()
            db.refresh(prod)
            return ProductService.map_to_out(prod)
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def delete(db: Session, product_id: int) -> bool:
        prod = ProductService.get_by_id(db, product_id)
        db.delete(prod)
        db.commit()
        return True


product_service = ProductService()
