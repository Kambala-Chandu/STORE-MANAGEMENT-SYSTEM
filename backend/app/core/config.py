from pathlib import Path
import os
from typing import Mapping, Optional

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


def _as_bool(value: str) -> bool:
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _looks_like_placeholder(value: str) -> bool:
    normalized = value.strip().lower()
    return (
        not normalized
        or normalized in {"password", "secret", "changeme"}
        or normalized.startswith(("your_", "change_", "example_", "placeholder"))
    )


class Settings:
    def __init__(self, environ: Optional[Mapping[str, str]] = None):
        env = os.environ if environ is None else environ
        get = env.get

        self.APP_NAME = get("APP_NAME", "Store Management System API")
        self.APP_VERSION = get("APP_VERSION", "1.0.0")
        self.ENVIRONMENT = get("ENVIRONMENT", "development").strip().lower()
        self.DEBUG = _as_bool(get("DEBUG", "False"))
        self.SEED_DEMO_DATA = _as_bool(get("SEED_DEMO_DATA", "False"))
        self.ENABLE_PUBLIC_REGISTRATION = _as_bool(get("ENABLE_PUBLIC_REGISTRATION", "False"))
        self.ENABLE_PROTOTYPE_ROUTERS = _as_bool(get("ENABLE_PROTOTYPE_ROUTERS", "False"))

        self.HOST = get("HOST", "127.0.0.1")
        self.PORT = int(get("PORT", "8000"))
        self.DB_HOST = get("DB_HOST", "").strip()
        self.DB_PORT = int(get("DB_PORT", "3306"))
        self.DB_NAME = get("DB_NAME", "").strip()
        self.DB_USER = get("DB_USER", "").strip()
        self.DB_PASSWORD = get("DB_PASSWORD", "")
        self.DB_SSL_ENABLED = _as_bool(get("DB_SSL_ENABLED", "False"))
        self.DB_SSL_CA = get("DB_SSL_CA", "").strip()

        self.SECRET_KEY = get("SECRET_KEY", "")
        self.ALGORITHM = get("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES = int(get("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
        self.API_V1_STR = "/api/v1"
        origins = get("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
        self.CORS_ORIGINS = [origin.strip() for origin in origins.split(",") if origin.strip()]
        self._validate()

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    def _validate(self) -> None:
        errors = []
        if _looks_like_placeholder(self.SECRET_KEY) or len(self.SECRET_KEY) < 32:
            errors.append("SECRET_KEY is required and must be a private value of at least 32 characters")
        for name, value in (
            ("DB_HOST", self.DB_HOST),
            ("DB_NAME", self.DB_NAME),
            ("DB_USER", self.DB_USER),
        ):
            if not value:
                errors.append(f"{name} is required")
        if _looks_like_placeholder(self.DB_PASSWORD) or len(self.DB_PASSWORD) < 8:
            errors.append("DB_PASSWORD is required and must not be a placeholder or weak value")
        if self.is_production and not self.DB_SSL_ENABLED:
            errors.append("DB_SSL_ENABLED must be enabled in production")
        if "*" in self.CORS_ORIGINS:
            errors.append("CORS_ORIGINS cannot contain '*' when credentials are enabled")
        if not self.CORS_ORIGINS:
            errors.append("CORS_ORIGINS must contain at least one explicit frontend origin")
        if self.is_production and self.DEBUG:
            errors.append("DEBUG must be disabled in production")
        if errors:
            raise ValueError("Invalid application configuration: " + "; ".join(errors))


settings = Settings()
