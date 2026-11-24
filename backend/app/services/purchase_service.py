import hashlib
import json
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models.purchase import Purchase, PurchaseItem
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.inventory import InventoryMovement
from app.schemas.purchase import PurchaseCreate, PurchaseOut, PurchaseItemOut
from app.utils.helpers import generate_purchase_number


class PurchaseService:
    IDEMPOTENCY_OPERATION = "purchase_create"

    @staticmethod
    def _request_hash(p_in: PurchaseCreate) -> str:
        canonical = json.dumps(
            p_in.model_dump(mode="json"), sort_keys=True, separators=(",", ":")
        )
        return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

    @staticmethod
    def _idempotent_purchase(
        db: Session, user_id: Optional[int], key: str
    ) -> Optional[Purchase]:
        return db.query(Purchase).filter(
            Purchase.user_id == user_id,
            Purchase.idempotency_operation == PurchaseService.IDEMPOTENCY_OPERATION,
            Purchase.idempotency_key == key,
        ).first()

    @staticmethod
    def _replay_or_conflict(purchase: Purchase, request_hash: str) -> PurchaseOut:
        if purchase.idempotency_request_hash != request_hash:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Idempotency key was already used with different purchase data",
            )
        return PurchaseService.map_to_out(purchase)

    @staticmethod
    def _get_products(db: Session, product_ids: List[int], lock: bool = False) -> dict:
        unique_ids = sorted(set(product_ids))
        query = db.query(Product).filter(Product.id.in_(unique_ids)).order_by(Product.id)
        if lock:
            query = query.with_for_update()

        products = {product.id: product for product in query.all()}
        for product_id in product_ids:
            if product_id not in products:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product ID {product_id} not found"
                )
        return products

    @staticmethod
    def _apply_receipt(
        db: Session,
        purchase: Purchase,
        items: List[PurchaseItem],
        products: dict,
        user_id: Optional[int]
    ) -> None:
        for item in items:
            product = products[item.product_id]
            product.quantity += item.quantity
            product.cost_price = item.unit_cost

            db.add(InventoryMovement(
                product_id=product.id,
                movement_type="PURCHASE",
                quantity=item.quantity,
                unit_cost=item.unit_cost,
                reference_id=purchase.purchase_number,
                reference_type="PURCHASE",
                notes=f"Inward stock via Purchase Order {purchase.purchase_number}",
                user_id=user_id
            ))

    @staticmethod
    def map_to_out(p: Purchase) -> PurchaseOut:
        items_out = []
        for it in p.items:
            items_out.append(
                PurchaseItemOut(
                    id=it.id,
                    product_id=it.product_id,
                    product_name=it.product_rel.name if it.product_rel else "",
                    product_sku=it.product_rel.sku if it.product_rel else "",
                    quantity=it.quantity,
                    unit_cost=it.unit_cost,
                    subtotal=it.subtotal
                )
            )
        return PurchaseOut(
            id=p.id,
            purchase_number=p.purchase_number,
            supplier_id=p.supplier_id,
            supplier_name=p.supplier_rel.name if p.supplier_rel else "",
            user_id=p.user_id,
            user_name=p.user_rel.full_name if p.user_rel else "",
            subtotal=p.subtotal,
            tax_amount=p.tax_amount,
            total_amount=p.total_amount,
            status=p.status,
            notes=p.notes,
            created_at=p.created_at,
            items=items_out
        )

    @staticmethod
    def create_purchase(
        db: Session,
        p_in: PurchaseCreate,
        user_id: Optional[int] = None,
        idempotency_key: Optional[str] = None,
    ) -> PurchaseOut:
        request_hash = PurchaseService._request_hash(p_in) if idempotency_key else None
        try:
            if idempotency_key:
                existing = PurchaseService._idempotent_purchase(
                    db, user_id, idempotency_key
                )
                if existing:
                    result = PurchaseService._replay_or_conflict(existing, request_hash)
                    db.rollback()
                    return result

            if p_in.supplier_id:
                supplier = db.query(Supplier).filter(Supplier.id == p_in.supplier_id).first()
                if not supplier:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")

            product_ids = [item.product_id for item in p_in.items]
            products = PurchaseService._get_products(
                db,
                product_ids,
                lock=(p_in.status == "Received")
            )

            db_purchase = Purchase(
                purchase_number=generate_purchase_number(),
                supplier_id=p_in.supplier_id,
                user_id=user_id,
                status=p_in.status,
                tax_amount=p_in.tax_amount,
                notes=p_in.notes,
                idempotency_key=idempotency_key,
                idempotency_operation=(
                    PurchaseService.IDEMPOTENCY_OPERATION if idempotency_key else None
                ),
                idempotency_request_hash=request_hash,
                invoice_date=datetime.now(timezone.utc)
            )
            db.add(db_purchase)
            db.flush()

            subtotal = 0.0
            purchase_items = []
            for item_in in p_in.items:
                item_subtotal = item_in.quantity * item_in.unit_cost
                subtotal += item_subtotal

                purchase_item = PurchaseItem(
                    purchase_id=db_purchase.id,
                    product_id=item_in.product_id,
                    quantity=item_in.quantity,
                    unit_cost=item_in.unit_cost,
                    subtotal=item_subtotal
                )
                db.add(purchase_item)
                purchase_items.append(purchase_item)

            db_purchase.subtotal = subtotal
            db_purchase.total_amount = subtotal + p_in.tax_amount

            if p_in.status == "Received":
                PurchaseService._apply_receipt(
                    db, db_purchase, purchase_items, products, user_id
                )

            db.flush()
            db.refresh(db_purchase)
            result = PurchaseService.map_to_out(db_purchase)
            db.commit()
            return result
        except IntegrityError:
            db.rollback()
            if idempotency_key:
                winner = PurchaseService._idempotent_purchase(db, user_id, idempotency_key)
                if winner:
                    try:
                        return PurchaseService._replay_or_conflict(winner, request_hash)
                    finally:
                        db.rollback()
            raise
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def receive_purchase(
        db: Session,
        purchase_id: int,
        user_id: Optional[int] = None
    ) -> PurchaseOut:
        try:
            purchase = db.query(Purchase).filter(
                Purchase.id == purchase_id
            ).with_for_update().first()
            if not purchase:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Purchase order not found"
                )
            if purchase.status == "Received":
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Purchase order has already been received"
                )
            if purchase.status == "Cancelled":
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Cancelled purchase orders cannot be received"
                )
            if purchase.status != "Ordered":
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Purchase order status '{purchase.status}' cannot be received"
                )

            legacy_movement = db.query(InventoryMovement.id).filter(
                InventoryMovement.reference_type == "PURCHASE",
                InventoryMovement.reference_id == purchase.purchase_number
            ).first()
            if legacy_movement:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        "Existing purchase inventory movements were found. "
                        "Manual review is required before receiving this purchase order."
                    )
                )

            items = list(purchase.items)
            products = PurchaseService._get_products(
                db,
                [item.product_id for item in items],
                lock=True
            )
            PurchaseService._apply_receipt(
                db, purchase, items, products, user_id
            )
            purchase.status = "Received"
            purchase.invoice_date = datetime.now(timezone.utc)

            db.flush()
            db.refresh(purchase)
            result = PurchaseService.map_to_out(purchase)
            db.commit()
            return result
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[PurchaseOut]:
        purchases = db.query(Purchase).order_by(Purchase.created_at.desc()).offset(skip).limit(limit).all()
        return [PurchaseService.map_to_out(p) for p in purchases]

    @staticmethod
    def get_by_id(db: Session, purchase_id: int) -> PurchaseOut:
        purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
        if not purchase:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Purchase order not found")
        return PurchaseService.map_to_out(purchase)


purchase_service = PurchaseService()
