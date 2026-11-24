from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.audit_log import AuditLogOut
from app.services.audit_service import audit_service
from app.core.security import require_roles
from app.models.user import User

router = APIRouter(
    prefix="/audit",
    tags=["Audit Logs"]
)

@router.get("/", response_model=List[AuditLogOut])
def get_audit_logs(
    action: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(require_roles(["Admin", "Manager"])),
    db: Session = Depends(get_db)
):
    return audit_service.get_logs(db, action=action, search=search, skip=skip, limit=limit)
