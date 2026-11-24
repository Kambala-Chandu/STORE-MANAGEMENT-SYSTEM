from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


class CustomerService:
    @staticmethod
    def get_all(
        db: Session,
        search: Optional[str] = None,
        active_only: bool = False,
        skip: int = 0,
        limit: int = 100
    ) -> List[Customer]:
        query = db.query(Customer)
        if search:
            s = f"%{search}%"
            query = query.filter(
                (Customer.name.ilike(s)) |
                (Customer.phone.ilike(s)) |
                (Customer.email.ilike(s))
            )
        if active_only:
            query = query.filter(Customer.is_active == True)
        return query.order_by(Customer.name.asc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_id(db: Session, customer_id: int) -> Customer:
        cust = db.query(Customer).filter(Customer.id == customer_id).first()
        if not cust:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        return cust

    @staticmethod
    def create(db: Session, cust_in: CustomerCreate) -> Customer:
        db_cust = Customer(
            name=cust_in.name.strip(),
            email=cust_in.email.strip() if cust_in.email else None,
            phone=cust_in.phone.strip() if cust_in.phone else None,
            address=cust_in.address.strip() if cust_in.address else None,
            loyalty_points=cust_in.loyalty_points or 0,
            is_active=cust_in.is_active if cust_in.is_active is not None else True
        )
        db.add(db_cust)
        db.commit()
        db.refresh(db_cust)
        return db_cust

    @staticmethod
    def update(db: Session, customer_id: int, cust_update: CustomerUpdate) -> Customer:
        cust = CustomerService.get_by_id(db, customer_id)
        if cust_update.name is not None:
            cust.name = cust_update.name.strip()
        if cust_update.email is not None:
            cust.email = cust_update.email.strip() if cust_update.email else None
        if cust_update.phone is not None:
            cust.phone = cust_update.phone.strip() if cust_update.phone else None
        if cust_update.address is not None:
            cust.address = cust_update.address.strip() if cust_update.address else None
        if cust_update.loyalty_points is not None:
            cust.loyalty_points = cust_update.loyalty_points
        if cust_update.is_active is not None:
            cust.is_active = cust_update.is_active

        db.commit()
        db.refresh(cust)
        return cust

    @staticmethod
    def delete(db: Session, customer_id: int) -> bool:
        cust = CustomerService.get_by_id(db, customer_id)
        db.delete(cust)
        db.commit()
        return True


customer_service = CustomerService()
