from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.models.user import User

class AuditService:
    @staticmethod
    def log_action(
        db: Session,
        action: str,
        user: Optional[User] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        details: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> AuditLog:
        user_id = user.id if user else None
        username = user.username if user else "System"
        log = AuditLog(
            user_id=user_id,
            username=username,
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id) if entity_id else None,
            details=details,
            ip_address=ip_address
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    @staticmethod
    def get_logs(
        db: Session,
        action: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[AuditLog]:
        query = db.query(AuditLog)
        if action:
            query = query.filter(AuditLog.action == action)
        if search:
            query = query.filter(
                (AuditLog.username.ilike(f"%{search}%")) |
                (AuditLog.details.ilike(f"%{search}%")) |
                (AuditLog.entity_id.ilike(f"%{search}%"))
            )
        return query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()

audit_service = AuditService()
