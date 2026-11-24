"""Interactive, one-time first-Admin provisioning command.

Run from the backend directory with: python -m app.bootstrap_admin
"""

import argparse
from getpass import getpass

from pydantic import ValidationError
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.auth_service import auth_service


def bootstrap_first_admin(
    db: Session, *, full_name: str, username: str, email: str, password: str
) -> User:
    existing_admin = db.query(User).filter(func.lower(User.role) == "admin").first()
    if existing_admin:
        raise RuntimeError("Bootstrap refused: an Admin account already exists")

    user_data = UserCreate(
        full_name=full_name,
        username=username,
        email=email,
        password=password,
        role="Admin",
        is_active=True,
    )
    return auth_service.register_user(db, user_data)


def main() -> int:
    parser = argparse.ArgumentParser(description="Create the first Admin account")
    parser.add_argument("--full-name", required=True)
    parser.add_argument("--username", required=True)
    parser.add_argument("--email", required=True)
    args = parser.parse_args()

    password = getpass("Password: ")
    if password != getpass("Confirm password: "):
        print("Bootstrap failed: passwords do not match")
        return 1

    try:
        with SessionLocal() as db:
            admin = bootstrap_first_admin(
                db,
                full_name=args.full_name,
                username=args.username,
                email=args.email,
                password=password,
            )
        print(f"Admin account created for username: {admin.username}")
        return 0
    except (RuntimeError, ValidationError, ValueError) as exc:
        print(f"Bootstrap failed: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
