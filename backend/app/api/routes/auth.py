from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserLogin, PublicUserCreate, UserOut, Token, PasswordChange
from app.services.auth_service import auth_service
from app.core.security import get_current_active_user
from app.core.config import settings

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.get("/")
def auth_test():
    return {
        "message": "Authentication API Working"
    }


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, credentials)
    return auth_service.create_token_for_user(user)


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_data: PublicUserCreate, db: Session = Depends(get_db)):
    if not settings.ENABLE_PUBLIC_REGISTRATION:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return auth_service.register_public_user(db, user_data)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.post("/change-password")
def change_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    auth_service.change_password(db, current_user, data)
    return {"message": "Password changed successfully"}
