from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.inventory import InventoryMovement
from app.models.product import Product
from app.schemas.inventory import StockAdjustmentCreate, InventoryMovementOut


class InventoryService:
    @staticmethod
    def record_movement(
        db: Session,
        product_id: int,
        movement_type: str,
        quantity: int,
        unit_cost: Optional[float] = None,
        reference_id: Optional[str] = None,
        reference_type: Optional[str] = None,
        notes: Optional[str] = None,
        user_id: Optional[int] = None
    ) -> InventoryMovement:
        movement = InventoryMovement(
            product_id=product_id,
            movement_type=movement_type,
            quantity=quantity,
            unit_cost=unit_cost,
            reference_id=reference_id,
            reference_type=reference_type,
            notes=notes,
            user_id=user_id
        )
        db.add(movement)
        return movement

    @staticmethod
    def adjust_stock(
        db: Session,
        adjustment_in: StockAdjustmentCreate,
        user_id: Optional[int] = None
    ) -> InventoryMovementOut:
        try:
            product = db.query(Product).filter(
                Product.id == adjustment_in.product_id
            ).with_for_update().first()
            if not product:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

            new_quantity = product.quantity + adjustment_in.quantity_change
            if new_quantity < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot reduce stock by {-adjustment_in.quantity_change}. Current stock is only {product.quantity}."
                )

            product.quantity = new_quantity

            movement = InventoryMovement(
            product_id=product.id,
            movement_type=adjustment_in.adjustment_type.upper(),
            quantity=adjustment_in.quantity_change,
            unit_cost=product.cost_price,
            reference_id=f"ADJ-{adjustment_in.adjustment_type.upper()}",
            reference_type="MANUAL",
            notes=adjustment_in.notes,
            user_id=user_id
            )
            db.add(movement)
            db.commit()
            db.refresh(movement)

            return InventoryMovementOut(
            id=movement.id,
            product_id=movement.product_id,
            product_name=product.name,
            product_sku=product.sku,
            movement_type=movement.movement_type,
            quantity=movement.quantity,
            unit_cost=movement.unit_cost,
            reference_id=movement.reference_id,
            reference_type=movement.reference_type,
            notes=movement.notes,
            user_id=movement.user_id,
            user_name=movement.user_rel.full_name if movement.user_rel else None,
            created_at=movement.created_at
            )
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def get_movements(
        db: Session,
        product_id: Optional[int] = None,
        movement_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[InventoryMovementOut]:
        query = db.query(InventoryMovement)
        if product_id:
            query = query.filter(InventoryMovement.product_id == product_id)
        if movement_type:
            query = query.filter(InventoryMovement.movement_type == movement_type.upper())

        movements = query.order_by(InventoryMovement.created_at.desc()).offset(skip).limit(limit).all()
        out = []
        for m in movements:
            out.append(
                InventoryMovementOut(
                    id=m.id,
                    product_id=m.product_id,
                    product_name=m.product_rel.name if m.product_rel else "",
                    product_sku=m.product_rel.sku if m.product_rel else "",
                    movement_type=m.movement_type,
                    quantity=m.quantity,
                    unit_cost=m.unit_cost,
                    reference_id=m.reference_id,
                    reference_type=m.reference_type,
                    notes=m.notes,
                    user_id=m.user_id,
                    user_name=m.user_rel.full_name if m.user_rel else None,
                    created_at=m.created_at
                )
            )
        return out


inventory_service = InventoryService()
