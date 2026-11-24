from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    username = Column(String(100), nullable=True)
    action = Column(String(100), nullable=False, index=True)  # INVOICE_CREATED, INVOICE_DELETED, PRODUCT_UPDATED, STOCK_UPDATED, USER_LOGIN, etc.
    entity_type = Column(String(50), nullable=True)  # Sale, Product, User, Backup
    entity_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user_rel = relationship("User", backref="audit_logs", lazy="joined")
