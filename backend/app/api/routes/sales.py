from typing import List, Optional
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.sales import SaleCreate, SaleOut, SaleReceiptOut
from app.services.sales_service import sales_service
from app.core.security import get_current_active_user, require_roles
from app.models.user import User

router = APIRouter(
    prefix="/sales",
    tags=["Sales POS"]
)

class EmailInvoiceRequest(BaseModel):
    email: EmailStr

@router.get("/", response_model=List[SaleOut])
def get_sales(
    customer_id: Optional[int] = None,
    payment_method: Optional[str] = None,
    search: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return sales_service.get_all(
        db,
        customer_id=customer_id,
        payment_method=payment_method,
        search=search,
        start_date=start_date,
        end_date=end_date,
        min_amount=min_amount,
        max_amount=max_amount,
        skip=skip,
        limit=limit
    )

@router.post("/checkout", response_model=SaleOut, status_code=status.HTTP_201_CREATED)
def checkout_sale(
    sale_in: SaleCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return sales_service.checkout_sale(db, sale_in, user_id=current_user.id)

@router.get("/invoice/{invoice_number}", response_model=SaleOut)
def get_sale_by_invoice(
    invoice_number: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return sales_service.get_by_invoice_number(db, invoice_number)

@router.get("/verify/{invoice_number}", response_model=SaleOut)
def verify_sale_public(
    invoice_number: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Verify an invoice for an authenticated, active store user."""
    return sales_service.get_by_invoice_number(db, invoice_number)

@router.get("/{sale_id}", response_model=SaleOut)
def get_sale(
    sale_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return sales_service.get_by_id(db, sale_id)

@router.get("/{sale_id}/receipt", response_model=SaleReceiptOut)
def get_sale_receipt(
    sale_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return sales_service.get_receipt(db, sale_id)

@router.post("/{sale_id}/email")
def email_invoice(
    sale_id: int,
    req: EmailInvoiceRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return sales_service.send_email_invoice(db, sale_id, req.email, user=current_user)

@router.delete("/{sale_id}")
def delete_sale(
    sale_id: int,
    current_user: User = Depends(require_roles(["Admin"])),
    db: Session = Depends(get_db)
):
    return sales_service.delete_sale(db, sale_id, user=current_user)
