import ssl

import certifi
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus

from app.core.config import settings
from app.db.base import Base

DATABASE_URL = (
    f"mysql+pymysql://{settings.DB_USER}:"
    f"{quote_plus(settings.DB_PASSWORD)}@"
    f"{settings.DB_HOST}:"
    f"{settings.DB_PORT}/"
    f"{settings.DB_NAME}"
)

def mysql_tls_connect_args(config=settings) -> dict:
    """Build verified MySQL TLS options without permitting insecure modes."""
    if not config.DB_SSL_ENABLED:
        return {}

    context = ssl.create_default_context(cafile=config.DB_SSL_CA or certifi.where())
    context.verify_mode = ssl.CERT_REQUIRED
    context.check_hostname = True
    return {"ssl": context}


def create_database_engine(url=DATABASE_URL, config=settings, **kwargs):
    """Create an engine shared by the app, migrations, and administration CLI."""
    options = {
        "echo": config.DEBUG,
        "pool_pre_ping": True,
        "pool_recycle": 3600,
        **kwargs,
    }
    if url.startswith("mysql+"):
        options["connect_args"] = mysql_tls_connect_args(config)
    return create_engine(url, **options)


engine = create_database_engine()

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
