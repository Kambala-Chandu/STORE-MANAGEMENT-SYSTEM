from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import PublicUserCreate, UserCreate, UserLogin, PasswordChange, Token, UserOut
from app.core.security import verify_password, get_password_hash, create_access_token


class AuthService:
    @staticmethod
    def authenticate_user(db: Session, credentials: UserLogin) -> User:
        user = db.query(User).filter(
            (User.username == credentials.username) | (User.email == credentials.username)
        ).first()

        if not user or not verify_password(credentials.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive. Please contact your administrator."
            )

        return user

    @staticmethod
    def create_token_for_user(user: User) -> Token:
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role, "id": user.id}
        )
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserOut.model_validate(user)
        )

    @staticmethod
    def register_public_user(db: Session, user_data: PublicUserCreate) -> User:
        internal_user = UserCreate(
            full_name=user_data.full_name,
            username=user_data.username,
            email=user_data.email,
            password=user_data.password,
            role="Cashier",
            is_active=True,
        )
        return AuthService.register_user(db, internal_user)

    @staticmethod
    def register_user(db: Session, user_data: UserCreate) -> User:
        if db.query(User).filter(User.username == user_data.username).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        if db.query(User).filter(User.email == user_data.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            full_name=user_data.full_name,
            username=user_data.username,
            email=user_data.email,
            password=hashed_password,
            role=user_data.role or "Staff",
            is_active=user_data.is_active if user_data.is_active is not None else True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def change_password(db: Session, user: User, data: PasswordChange) -> bool:
        if not verify_password(data.current_password, user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password does not match"
            )

        user.password = get_password_hash(data.new_password)
        db.commit()
        return True


auth_service = AuthService()
