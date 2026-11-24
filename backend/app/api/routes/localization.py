from fastapi import APIRouter

router = APIRouter(prefix="/localization", tags=["Localization"])

@router.get("/languages")
async def get_languages():
    return [
        {"code": "en-US", "name": "English (US)", "native_name": "English", "direction": "LTR", "status": "Active", "translated_pct": 100},
        {"code": "es-ES", "name": "Spanish", "native_name": "Español", "direction": "LTR", "status": "Active", "translated_pct": 95},
        {"code": "ar-AE", "name": "Arabic", "native_name": "العربية", "direction": "RTL", "status": "Active", "translated_pct": 88}
    ]

@router.get("/currencies")
async def get_currencies():
    return [
        {"code": "USD", "name": "US Dollar", "symbol": "$", "rate_to_usd": 1.0, "flag": "🇺🇸"},
        {"code": "EUR", "name": "Euro", "symbol": "€", "rate_to_usd": 0.92, "flag": "🇪🇺"},
        {"code": "GBP", "name": "British Pound", "symbol": "£", "rate_to_usd": 0.79, "flag": "🇬🇧"}
    ]

@router.get("/exchange-rates")
async def get_exchange_rates():
    return [
        {"date": "2024-01-01", "EUR": 0.91, "GBP": 0.78, "JPY": 140.5},
        {"date": "2024-01-02", "EUR": 0.92, "GBP": 0.79, "JPY": 141.2}
    ]

@router.get("/country-configs")
async def get_country_configs():
    return [
        {"id": 1, "country": "United States", "flag": "🇺🇸", "date_format": "MM/DD/YYYY", "number_format": "1,234.56", "currency": "USD", "primary_language": "en-US", "tax_system_name": "Sales Tax"},
        {"id": 2, "country": "United Kingdom", "flag": "🇬🇧", "date_format": "DD/MM/YYYY", "number_format": "1,234.56", "currency": "GBP", "primary_language": "en-GB", "tax_system_name": "VAT"}
    ]

@router.get("/taxes")
async def get_taxes():
    return [
        {"id": 1, "country": "US", "region": "NY", "tax_name": "NY State Sales Tax", "rate": 4.0, "applies_to": "All", "effective_date": "2020-01-01", "status": "Active"},
        {"id": 2, "country": "UK", "region": "All", "tax_name": "Standard VAT", "rate": 20.0, "applies_to": "All", "effective_date": "2011-01-04", "status": "Active"}
    ]

@router.get("/kpis")
async def get_kpis():
    return {
        "active_languages": 8,
        "supported_currencies": 23,
        "countries_configured": 15,
        "translation_completion": 87
    }
