from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.reports import SalesReportOut, ProfitLossOut, InventoryValuationOut
from app.services.report_service import report_service
from app.core.security import require_roles
from app.models.user import User

router = APIRouter(
    prefix="/reports",
    tags=["Reports & Analytics"]
)


@router.get("/sales", response_model=SalesReportOut)
def get_sales_report(
    start_date: Optional[date] = Query(None, description="YYYY-MM-DD"),
    end_date: Optional[date] = Query(None, description="YYYY-MM-DD"),
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return report_service.get_sales_report(db, start_date=start_date, end_date=end_date)


@router.get("/profit-loss", response_model=ProfitLossOut)
def get_profit_loss(
    start_date: Optional[date] = Query(None, description="YYYY-MM-DD"),
    end_date: Optional[date] = Query(None, description="YYYY-MM-DD"),
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return report_service.get_profit_loss(db, start_date=start_date, end_date=end_date)


@router.get("/inventory", response_model=InventoryValuationOut)
def get_inventory_valuation(
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return report_service.get_inventory_valuation(db)
