import logging
from datetime import datetime, date
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import require_roles
from app.models.user import User
from app.models.category import Category
from app.models.supplier import Supplier
from app.models.customer import Customer
from app.models.product import Product
from app.models.sales import Sale, SaleItem
from app.models.purchase import Purchase, PurchaseItem
from app.models.inventory import InventoryMovement
from app.models.audit_log import AuditLog
from app.services.audit_service import audit_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/backup",
    tags=["Data Export"]
)


def row_to_dict(instance):
    """
    Converts a SQLAlchemy model instance to a JSON-serializable dictionary
    by inspecting table columns directly. Handles datetimes, decimals, and nulls.
    """
    if instance is None:
        return None
    d = {}
    for col in instance.__table__.columns:
        val = getattr(instance, col.name)
        if isinstance(val, (datetime, date)):
            d[col.name] = val.isoformat()
        elif isinstance(val, Decimal):
            d[col.name] = float(val)
        else:
            d[col.name] = val
    return d


@router.get("/export")
def export_database(
    current_user: User = Depends(require_roles(["Admin"])),
    db: Session = Depends(get_db)
):
    try:
        categories = [row_to_dict(c) for c in db.query(Category).all()]
        suppliers = [row_to_dict(s) for s in db.query(Supplier).all()]
        customers = [row_to_dict(cu) for cu in db.query(Customer).all()]
        products = [row_to_dict(p) for p in db.query(Product).all()]
        sales = [row_to_dict(s) for s in db.query(Sale).all()]
        sale_items = [row_to_dict(si) for si in db.query(SaleItem).all()]
        purchases = [row_to_dict(pu) for pu in db.query(Purchase).all()]
        purchase_items = [row_to_dict(pi) for pi in db.query(PurchaseItem).all()]
        inventory_movements = [row_to_dict(im) for im in db.query(InventoryMovement).all()]
        audit_logs = [row_to_dict(al) for al in db.query(AuditLog).all()]
        users = [
            {
                "id": u.id,
                "full_name": u.full_name,
                "username": u.username,
                "email": u.email,
                "role": u.role,
                "is_active": u.is_active,
                "created_at": u.created_at.isoformat() if u.created_at else None
            }
            for u in db.query(User).all()
        ]

        backup_payload = {
            "version": "1.0",
            "exported_at": datetime.utcnow().isoformat(),
            "exported_by": current_user.username,
            "data": {
                "categories": categories,
                "suppliers": suppliers,
                "customers": customers,
                "products": products,
                "sales": sales,
                "sale_items": sale_items,
                "purchases": purchases,
                "purchase_items": purchase_items,
                "inventory_movements": inventory_movements,
                "users": users,
                "audit_logs": audit_logs
            }
        }

        audit_service.log_action(
            db,
            action="DATA_EXPORTED",
            user=current_user,
            entity_type="Backup",
            details="Version 1 store data exported successfully as JSON"
        )

        filename = f"StoreHub_Data_Export_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
        return JSONResponse(
            content=backup_payload,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "application/json; charset=utf-8"
            }
        )
    except Exception as e:
        logger.exception("Database backup export failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data export failed"
        )


@router.post("/restore", include_in_schema=False)
def restore_unavailable(
    current_user: User = Depends(require_roles(["Admin"])),
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Backup restore is not available in version 1",
    )
