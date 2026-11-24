import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.db.base import Base
from app.db.database import engine
import app.models
from app.db.seed import seed_database

from app.api.routes import (
    auth,
    users,
    category,
    supplier,
    customer,
    product,
    inventory,
    purchases,
    sales,
    dashboard,
    reports,
    audit,
    backup,
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Local development retains convenient initialization. Production schema
    # changes are explicit and must be applied with `alembic upgrade head`.
    if not settings.is_production:
        Base.metadata.create_all(bind=engine)
    # Demo credentials and sample data require an explicit opt-in.
    if settings.SEED_DEMO_DATA:
        try:
            seed_database()
        except Exception:
            logger.exception("Demo seeding failed")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_v1_routers = [
    auth.router,
    users.router,
    category.router,
    supplier.router,
    customer.router,
    product.router,
    inventory.router,
    purchases.router,
    sales.router,
    dashboard.router,
    reports.router,
    audit.router,
    backup.router,
]

if settings.ENABLE_PROTOTYPE_ROUTERS:
    from app.api.routes import (
        workflow, finance, hr, crm, manufacturing, warehouse, scm, assets,
        quality, projects, documents, vendor_portal, iot, ai_copilot,
        multi_company, localization, grc, mobile,
    )
    api_v1_routers.extend([
        workflow.router, finance.router, hr.router, crm.router,
        manufacturing.router, warehouse.router, scm.router, assets.router,
        quality.router, projects.router, documents.router, vendor_portal.router,
        iot.router, ai_copilot.router, multi_company.router,
        localization.router, grc.router, mobile.router,
    ])

for r in api_v1_routers:
    app.include_router(r, prefix=settings.API_V1_STR)
    # Also mount at root for backward compatibility with existing tests
    app.include_router(r)


@app.get("/")
def home():
    return {
        "application": settings.APP_NAME,
        "status": "ok"
    }


@app.get("/health/live", tags=["Health"])
def liveness():
    return {"status": "ok"}


@app.get("/health/ready", tags=["Health"])
def readiness():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable",
        )
    return {"status": "ready"}
