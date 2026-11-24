from fastapi import APIRouter

router = APIRouter(prefix="/multi-company", tags=["Multi-Company"])

@router.get("/companies")
async def get_companies():
    return [
        {"id": 1, "name": "StoreHub Retail LLC", "country": "US", "currency": "USD", "fiscal_year": "Jan-Dec", "status": "Active", "revenue_ytd": 15000000, "branches_count": 5},
        {"id": 2, "name": "StoreHub Distribution Ltd", "country": "UK", "currency": "GBP", "fiscal_year": "Apr-Mar", "status": "Active", "revenue_ytd": 8000000, "branches_count": 3},
        {"id": 3, "name": "StoreHub International FZE", "country": "AE", "currency": "AED", "fiscal_year": "Jan-Dec", "status": "Active", "revenue_ytd": 5400000, "branches_count": 3}
    ]

@router.post("/companies")
async def create_company(company: dict):
    return {"status": "success", "data": company}

@router.get("/branches")
async def get_branches():
    return [
        {"id": 1, "company_id": 1, "name": "NY Flagship", "city": "New York", "revenue": 5000000, "employees": 45, "status": "Active"},
        {"id": 2, "company_id": 1, "name": "LA Downtown", "city": "Los Angeles", "revenue": 3000000, "employees": 30, "status": "Active"},
        {"id": 3, "company_id": 2, "name": "London Hub", "city": "London", "revenue": 4000000, "employees": 35, "status": "Active"}
    ]

@router.get("/intercompany-transactions")
async def get_intercompany_transactions():
    return [
        {"id": 1, "from_company": "StoreHub Distribution Ltd", "to_company": "StoreHub Retail LLC", "type": "Product Transfer", "amount": 150000, "currency": "USD", "date": "2024-05-10", "status": "Completed"},
        {"id": 2, "from_company": "StoreHub Retail LLC", "to_company": "StoreHub International FZE", "type": "Service Fee", "amount": 25000, "currency": "USD", "date": "2024-06-15", "status": "Pending"}
    ]

@router.get("/consolidated-financials")
async def get_consolidated_financials():
    return {
        "income_statement": [
            {"item": "Revenue", "amount": 28400000},
            {"item": "Cost of Goods Sold", "amount": 14200000},
            {"item": "Gross Profit", "amount": 14200000},
            {"item": "Operating Expenses", "amount": 8000000},
            {"item": "Net Income", "amount": 6200000}
        ],
        "balance_sheet": [
            {"item": "Total Assets", "amount": 45000000},
            {"item": "Total Liabilities", "amount": 20000000},
            {"item": "Total Equity", "amount": 25000000}
        ]
    }

@router.get("/kpis")
async def get_kpis():
    return {
        "total_companies": 3,
        "total_branches": 11,
        "intercompany_volume": 4200000,
        "group_revenue": 28400000,
        "consolidation_status": "Complete"
    }
