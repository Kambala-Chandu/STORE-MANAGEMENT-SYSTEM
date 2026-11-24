"""Test-only ASGI app for localhost browser demonstrations.

This module refuses to start without an explicit disposable SQLite path and
blocks PyMySQL connections before importing the real application.
"""

from contextlib import asynccontextmanager
import os
from pathlib import Path
from unittest.mock import patch

from test_config import apply_test_environment

apply_test_environment()

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


database_path = os.environ.get("STORE_BROWSER_TEST_DB")
if not database_path:
    raise RuntimeError("STORE_BROWSER_TEST_DB is required for the isolated browser app")

resolved_path = Path(database_path).resolve()
if resolved_path.suffix.lower() not in {".db", ".sqlite", ".sqlite3"}:
    raise RuntimeError("Browser test database must be an explicit SQLite file")

mysql_guard = patch(
    "pymysql.connections.Connection.connect",
    side_effect=AssertionError("Browser tests must never connect to MySQL"),
)
mysql_guard.start()

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.database import get_db
from app.models.user import User
from main import app


engine = create_engine(
    f"sqlite:///{resolved_path.as_posix()}",
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


with SessionLocal() as db:
    if db.query(User).count() == 0:
        accounts = (
            ("Browser Admin", "browser_admin", "browser-admin@example.test", "Admin", "BrowserAdmin!2026"),
            ("Browser Manager", "browser_manager", "browser-manager@example.test", "Manager", "BrowserManager!2026"),
            ("Browser Cashier", "browser_cashier", "browser-cashier@example.test", "Cashier", "BrowserCashier!2026"),
        )
        db.add_all([
            User(
                full_name=full_name,
                username=username,
                email=email,
                password=get_password_hash(password),
                role=role,
                is_active=True,
            )
            for full_name, username, email, role, password in accounts
        ])
        db.commit()


@asynccontextmanager
async def isolated_lifespan(application):
    yield


app.router.lifespan_context = isolated_lifespan
app.dependency_overrides[get_db] = override_get_db

