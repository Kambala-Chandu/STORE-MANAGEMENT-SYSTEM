from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.sales import Sale, SaleItem
from app.models.product import Product
from app.models.customer import Customer
from app.models.inventory import InventoryMovement
from app.schemas.sales import SaleCreate, SaleOut, SaleItemOut, SaleReceiptOut
from app.utils.helpers import generate_invoice_number
from app.core.config import settings
from app.services.audit_service import audit_service


class SalesService:
    @staticmethod
    def map_to_out(s: Sale) -> SaleOut:
        items_out = []
        for it in s.items:
            items_out.append(
                SaleItemOut(
                    id=it.id,
                    product_id=it.product_id,
                    product_name=it.product_name,
                    quantity=it.quantity,
                    unit_price=it.unit_price,
                    subtotal=it.subtotal
                )
            )
        return SaleOut(
            id=s.id,
            invoice_number=s.invoice_number,
            customer_id=s.customer_id,
            customer_name=s.customer_rel.name if s.customer_rel else "Walk-in Customer",
            customer_phone=s.customer_rel.phone if s.customer_rel else "",
            user_id=s.user_id,
            cashier_name=s.cashier_rel.full_name if s.cashier_rel else "",
            subtotal=s.subtotal,
            discount=s.discount,
            tax_rate=s.tax_rate,
            tax_amount=s.tax_amount,
            total_amount=s.total_amount,
            payment_method=s.payment_method,
            status=s.status,
            notes=s.notes,
            created_at=s.created_at,
            items=items_out
        )

    @staticmethod
    def checkout_sale(db: Session, sale_in: SaleCreate, user_id: Optional[int] = None) -> SaleOut:
        try:
            customer = None
            if sale_in.customer_id:
                customer = db.query(Customer).filter(
                    Customer.id == sale_in.customer_id
                ).with_for_update().first()
                if not customer:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

            product_ids = sorted({item.product_id for item in sale_in.items})
            locked_products = db.query(Product).filter(
                Product.id.in_(product_ids)
            ).order_by(Product.id).with_for_update().all()
            products_by_id = {product.id: product for product in locked_products}

            invoice_number = generate_invoice_number()
            subtotal = 0.0
            db_sale = Sale(
                invoice_number=invoice_number,
                customer_id=sale_in.customer_id,
                user_id=user_id,
                payment_method=sale_in.payment_method or "Cash",
                status="Completed",
                notes=sale_in.notes
            )
            db.add(db_sale)
            db.flush()

            for item_in in sale_in.items:
                product = products_by_id.get(item_in.product_id)
                if not product:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product ID {item_in.product_id} not found")
                if not product.is_active:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Product '{product.name}' is inactive")
                if product.quantity < item_in.quantity:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Insufficient stock for '{product.name}'. In stock: {product.quantity}, Requested: {item_in.quantity}"
                    )

                unit_price = item_in.unit_price if item_in.unit_price is not None else product.selling_price
                item_subtotal = item_in.quantity * unit_price
                subtotal += item_subtotal
                db.add(SaleItem(
                    sale_id=db_sale.id,
                    product_id=product.id,
                    product_name=product.name,
                    quantity=item_in.quantity,
                    unit_price=unit_price,
                    cost_price=product.cost_price,
                    subtotal=item_subtotal
                ))
                product.quantity -= item_in.quantity
                db.add(InventoryMovement(
                    product_id=product.id,
                    movement_type="SALE",
                    quantity=-item_in.quantity,
                    unit_cost=product.cost_price,
                    reference_id=invoice_number,
                    reference_type="SALE",
                    notes=f"Sold via Invoice {invoice_number}",
                    user_id=user_id
                ))

            discount = sale_in.discount or 0.0
            if discount > subtotal:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Discount cannot exceed the sale subtotal"
                )
            tax_rate = sale_in.tax_rate or 0.0
            taxable_amount = subtotal - discount
            tax_amount = round(taxable_amount * (tax_rate / 100.0), 2)
            total_amount = round(taxable_amount + tax_amount, 2)
            db_sale.subtotal = subtotal
            db_sale.discount = discount
            db_sale.tax_rate = tax_rate
            db_sale.tax_amount = tax_amount
            db_sale.total_amount = total_amount

            if customer:
                customer.loyalty_points += int(total_amount // 10)

            db.commit()
            db.refresh(db_sale)
        except Exception:
            db.rollback()
            raise

        # Audit log
        try:
            audit_service.log_action(
                db,
                action="INVOICE_CREATED",
                entity_type="Sale",
                entity_id=db_sale.invoice_number,
                details=f"Invoice created for ${total_amount} ({db_sale.payment_method})"
            )
        except Exception:
            pass

        return SalesService.map_to_out(db_sale)

    @staticmethod
    def get_all(
        db: Session,
        customer_id: Optional[int] = None,
        payment_method: Optional[str] = None,
        search: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        min_amount: Optional[float] = None,
        max_amount: Optional[float] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[SaleOut]:
        query = db.query(Sale)
        if customer_id:
            query = query.filter(Sale.customer_id == customer_id)
        if payment_method and payment_method.upper() != "ALL":
            query = query.filter(Sale.payment_method.ilike(payment_method))
        if search:
            query = query.filter(
                (Sale.invoice_number.ilike(f"%{search}%")) |
                (Sale.customer_rel.has(Customer.name.ilike(f"%{search}%")))
            )
        if start_date:
            query = query.filter(Sale.created_at >= f"{start_date} 00:00:00")
        if end_date:
            query = query.filter(Sale.created_at <= f"{end_date} 23:59:59")
        if min_amount is not None:
            query = query.filter(Sale.total_amount >= min_amount)
        if max_amount is not None:
            query = query.filter(Sale.total_amount <= max_amount)

        sales = query.order_by(Sale.created_at.desc()).offset(skip).limit(limit).all()
        return [SalesService.map_to_out(s) for s in sales]

    @staticmethod
    def get_by_id(db: Session, sale_id: int) -> SaleOut:
        sale = db.query(Sale).filter(Sale.id == sale_id).first()
        if not sale:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sale invoice not found")
        return SalesService.map_to_out(sale)

    @staticmethod
    def get_by_invoice_number(db: Session, invoice_number: str) -> SaleOut:
        clean_inv = invoice_number.strip()
        sale = db.query(Sale).filter(Sale.invoice_number.ilike(clean_inv)).first()
        if not sale:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invoice '{clean_inv}' not found")
        return SalesService.map_to_out(sale)

    @staticmethod
    def delete_sale(db: Session, sale_id: int, user: Optional[object] = None) -> dict:
        try:
            sale = db.query(Sale).filter(Sale.id == sale_id).with_for_update().first()
            if not sale:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sale invoice not found")
            if sale.status == "Voided":
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Sale is already voided")

            inv_num = sale.invoice_number
            product_ids = sorted({item.product_id for item in sale.items})
            locked_products = db.query(Product).filter(
                Product.id.in_(product_ids)
            ).order_by(Product.id).with_for_update().all()
            products_by_id = {product.id: product for product in locked_products}

            for item in sale.items:
                product = products_by_id.get(item.product_id)
                if product:
                    product.quantity += item.quantity
                    db.add(InventoryMovement(
                        product_id=product.id,
                        movement_type="VOID_RESTOCK",
                        quantity=item.quantity,
                        unit_cost=product.cost_price,
                        reference_id=inv_num,
                        reference_type="SALE_VOID",
                        notes=f"Stock restored after voiding invoice {inv_num}",
                        user_id=getattr(user, "id", None)
                    ))

            if sale.customer_rel:
                points_deducted = int(sale.total_amount // 10)
                sale.customer_rel.loyalty_points = max(0, sale.customer_rel.loyalty_points - points_deducted)

            sale.status = "Voided"
            db.commit()
        except Exception:
            db.rollback()
            raise

        # Audit log
        try:
            audit_service.log_action(
                db,
                action="INVOICE_DELETED",
                user=user,
                entity_type="Sale",
                entity_id=inv_num,
                details=f"Invoice {inv_num} deleted and inventory stock restored"
            )
        except Exception:
            pass

        return {"message": f"Invoice {inv_num} voided successfully and inventory restocked"}

    @staticmethod
    def send_email_invoice(db: Session, sale_id: int, email: str, user: Optional[object] = None) -> dict:
        SalesService.get_by_id(db, sale_id)
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Invoice email delivery is not configured. Download or print the invoice instead."
        )

    @staticmethod
    def get_receipt(db: Session, sale_id: int) -> SaleReceiptOut:
        sale_out = SalesService.get_by_id(db, sale_id)
        return SaleReceiptOut(
            store_name=settings.APP_NAME,
            store_contact="support@storemanagement.com | +1 (555) 019-2834",
            invoice_number=sale_out.invoice_number,
            date=sale_out.created_at,
            cashier=sale_out.cashier_name or "Store Staff",
            customer_name=sale_out.customer_name or "Walk-in Customer",
            customer_phone=sale_out.customer_phone,
            items=sale_out.items,
            subtotal=sale_out.subtotal,
            discount=sale_out.discount,
            tax_rate=sale_out.tax_rate,
            tax_amount=sale_out.tax_amount,
            total_amount=sale_out.total_amount,
            payment_method=sale_out.payment_method
        )

sales_service = SalesService()
