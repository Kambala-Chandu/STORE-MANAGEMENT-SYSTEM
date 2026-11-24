"""
Enterprise Finance, Accounting & General Ledger API Routes (Phase 4.4)
Provides endpoints for:
- /accounts (Chart of Accounts)
- /journal (Journal Entries)
- /general-ledger (General Ledger & Trial Balance)
- /payables (Accounts Payable & Vendor Bills)
- /receivables (Accounts Receivable & Customer Aging)
- /budgets (Department Budgets & Variances)
- /taxes (Tax Filings & Liabilities)
- /financial-reports (Balance Sheet, P&L, Cash Flow)
- /invoices (Enterprise Customer & Vendor Invoices)
- /cash (Cash & Bank Management & Reconciliations)
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from pydantic import BaseModel, Field

from app.core.security import get_current_active_user, require_roles
from app.models.user import User

# Routers
accounts_router = APIRouter(prefix="/accounts", tags=["Chart of Accounts"])
journal_router = APIRouter(prefix="/journal", tags=["Journal Entries"])
general_ledger_router = APIRouter(prefix="/general-ledger", tags=["General Ledger"])
payables_router = APIRouter(prefix="/payables", tags=["Accounts Payable"])
receivables_router = APIRouter(prefix="/receivables", tags=["Accounts Receivable"])
budgets_router = APIRouter(prefix="/budgets", tags=["Budget Planning"])
taxes_router = APIRouter(prefix="/taxes", tags=["Tax Management"])
financial_reports_router = APIRouter(prefix="/financial-reports", tags=["Financial Statements"])
invoices_router = APIRouter(prefix="/invoices", tags=["Enterprise Invoices"])
cash_router = APIRouter(prefix="/cash", tags=["Cash Management"])

# Pre-seeded Chart of Accounts
INITIAL_ACCOUNTS = [
    {"id": "acc-1010", "code": "1010", "name": "Cash on Hand (Vault)", "category": "Assets", "sub_category": "Cash", "type": "Debit", "balance": 48250.00, "status": "Active"},
    {"id": "acc-1020", "code": "1020", "name": "Operating Checking Account (JPMorgan)", "category": "Assets", "sub_category": "Bank", "type": "Debit", "balance": 420800.00, "status": "Active"},
    {"id": "acc-1030", "code": "1030", "name": "Payroll Reserve Account (Wells Fargo)", "category": "Assets", "sub_category": "Bank", "type": "Debit", "balance": 173750.00, "status": "Active"},
    {"id": "acc-1100", "code": "1100", "name": "Accounts Receivable (Trade)", "category": "Assets", "sub_category": "Current Assets", "type": "Debit", "balance": 318400.00, "status": "Active"},
    {"id": "acc-1200", "code": "1200", "name": "Merchandise Inventory Ledger", "category": "Assets", "sub_category": "Inventory", "type": "Debit", "balance": 1120450.00, "status": "Active"},
    {"id": "acc-1500", "code": "1500", "name": "Warehouse Fixtures & POS Equipment", "category": "Assets", "sub_category": "Fixed Assets", "type": "Debit", "balance": 345000.00, "status": "Active"},
    {"id": "acc-1590", "code": "1590", "name": "Accumulated Depreciation", "category": "Assets", "sub_category": "Fixed Assets", "type": "Credit", "balance": -68000.00, "status": "Active"},
    {"id": "acc-2010", "code": "2010", "name": "Accounts Payable (Trade Vendors)", "category": "Liabilities", "sub_category": "Current Liabilities", "type": "Credit", "balance": 242500.00, "status": "Active"},
    {"id": "acc-2050", "code": "2050", "name": "Accrued Payroll & Bonuses", "category": "Liabilities", "sub_category": "Current Liabilities", "type": "Credit", "balance": 64200.00, "status": "Active"},
    {"id": "acc-2100", "code": "2100", "name": "Sales Tax & VAT Payable", "category": "Liabilities", "sub_category": "Current Liabilities", "type": "Credit", "balance": 38400.00, "status": "Active"},
    {"id": "acc-2500", "code": "2500", "name": "Long-Term Commercial Bank Note", "category": "Liabilities", "sub_category": "Long Term Liabilities", "type": "Credit", "balance": 500000.00, "status": "Active"},
    {"id": "acc-3010", "code": "3010", "name": "Common Stock Capital", "category": "Equity", "sub_category": "Equity", "type": "Credit", "balance": 500000.00, "status": "Active"},
    {"id": "acc-3050", "code": "3050", "name": "Retained Earnings", "category": "Equity", "sub_category": "Equity", "type": "Credit", "balance": 574550.00, "status": "Active"},
    {"id": "acc-4010", "code": "4010", "name": "Retail POS Sales Revenue", "category": "Revenue", "sub_category": "Revenue", "type": "Credit", "balance": 1420800.00, "status": "Active"},
    {"id": "acc-4020", "code": "4020", "name": "Wholesale Commercial B2B Sales", "category": "Revenue", "sub_category": "Revenue", "type": "Credit", "balance": 1030000.00, "status": "Active"},
    {"id": "acc-5010", "code": "5010", "name": "Cost of Goods Sold (COGS)", "category": "Expenses", "sub_category": "Expenses", "type": "Debit", "balance": 1568520.00, "status": "Active"},
    {"id": "acc-6010", "code": "6010", "name": "Warehouse Logistics & Freight", "category": "Expenses", "sub_category": "Expenses", "type": "Debit", "balance": 164200.00, "status": "Active"},
    {"id": "acc-6020", "code": "6020", "name": "Retail Operations & Store Salaries", "category": "Expenses", "sub_category": "Expenses", "type": "Debit", "balance": 118400.00, "status": "Active"},
    {"id": "acc-6030", "code": "6030", "name": "Technology, Cloud ERP & IT", "category": "Expenses", "sub_category": "Expenses", "type": "Debit", "balance": 58200.00, "status": "Active"}
]

# Pre-seeded Journal Entries
INITIAL_JOURNALS = [
    {
        "id": "je-2026-081",
        "entry_number": "JE-2026-081",
        "date": "2026-10-04",
        "reference": "PO-2026-0889",
        "description": "Stock delivery receipt and inventory capitalization from TechSupply Corp",
        "status": "Posted",
        "created_by": "Marcus Chen",
        "total_debit": 2100.00,
        "total_credit": 2100.00,
        "lines": [
            {"account_code": "1200", "account_name": "Merchandise Inventory Ledger", "debit": 2100.00, "credit": 0.0, "cost_center": "Warehouse Central"},
            {"account_code": "2010", "account_name": "Accounts Payable (Trade Vendors)", "debit": 0.0, "credit": 2100.00, "cost_center": "Supply Chain"}
        ]
    },
    {
        "id": "je-2026-082",
        "entry_number": "JE-2026-082",
        "date": "2026-10-05",
        "reference": "POS-BATCH-1005",
        "description": "Daily register collections and revenue recognition",
        "status": "Posted",
        "created_by": "Elena Rostova",
        "total_debit": 18450.00,
        "total_credit": 18450.00,
        "lines": [
            {"account_code": "1020", "account_name": "Operating Checking Account (JPMorgan)", "debit": 14200.00, "credit": 0.0, "cost_center": "Retail Operations"},
            {"account_code": "1010", "account_name": "Cash on Hand (Vault)", "debit": 4250.00, "credit": 0.0, "cost_center": "Retail Operations"},
            {"account_code": "4010", "account_name": "Retail POS Sales Revenue", "debit": 0.0, "credit": 17200.00, "cost_center": "Retail Operations"},
            {"account_code": "2100", "account_name": "Sales Tax & VAT Payable", "debit": 0.0, "credit": 1250.00, "cost_center": "Compliance"}
        ]
    },
    {
        "id": "je-2026-083",
        "entry_number": "JE-2026-083",
        "date": "2026-10-05",
        "reference": "ADJ-2026-034",
        "description": "Cycle count discrepancy adjustment and shrinkage write-off",
        "status": "Draft",
        "created_by": "David Miller",
        "total_debit": 1420.00,
        "total_credit": 1420.00,
        "lines": [
            {"account_code": "5010", "account_name": "Cost of Goods Sold (COGS)", "debit": 1420.00, "credit": 0.0, "cost_center": "Warehouse Central"},
            {"account_code": "1200", "account_name": "Merchandise Inventory Ledger", "debit": 0.0, "credit": 1420.00, "cost_center": "Warehouse Central"}
        ]
    }
]

# 1. Accounts Endpoints
@accounts_router.get("/", response_model=List[Dict[str, Any]])
def list_accounts(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return INITIAL_ACCOUNTS

@accounts_router.post("/", response_model=Dict[str, Any])
def create_account(account: Dict[str, Any] = Body(...), current_user: User = Depends(require_roles(["Admin"]))):
    account["id"] = f"acc-{account.get('code', int(datetime.utcnow().timestamp()))}"
    account["status"] = "Active"
    INITIAL_ACCOUNTS.append(account)
    return account

# 2. Journal Endpoints
@journal_router.get("/", response_model=List[Dict[str, Any]])
def list_journal_entries(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return INITIAL_JOURNALS

@journal_router.post("/", response_model=Dict[str, Any])
def create_journal_entry(entry: Dict[str, Any] = Body(...), current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    entry_id = f"je-{int(datetime.utcnow().timestamp())}"
    entry["id"] = entry_id
    entry["entry_number"] = f"JE-{datetime.utcnow().year}-{len(INITIAL_JOURNALS)+1:03d}"
    INITIAL_JOURNALS.insert(0, entry)
    return entry

@journal_router.post("/{entry_id}/post")
def post_journal_entry(entry_id: str, current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    for j in INITIAL_JOURNALS:
        if j["id"] == entry_id:
            j["status"] = "Posted"
            return {"success": True, "entry": j}
    raise HTTPException(status_code=404, detail="Journal entry not found")

@journal_router.post("/{entry_id}/reverse")
def reverse_journal_entry(entry_id: str, current_user: User = Depends(require_roles(["Admin"]))):
    for j in INITIAL_JOURNALS:
        if j["id"] == entry_id:
            reversed_lines = []
            for line in j["lines"]:
                reversed_lines.append({
                    "account_code": line["account_code"],
                    "account_name": line["account_name"],
                    "debit": line.get("credit", 0.0),
                    "credit": line.get("debit", 0.0),
                    "cost_center": line.get("cost_center", "General")
                })
            rev_entry = {
                "id": f"je-rev-{int(datetime.utcnow().timestamp())}",
                "entry_number": f"{j['entry_number']}-REV",
                "date": datetime.utcnow().strftime("%Y-%m-%d"),
                "reference": f"Reversal of {j['entry_number']}",
                "description": f"Automated reversal of {j['description']}",
                "status": "Posted",
                "created_by": current_user.username,
                "total_debit": j["total_credit"],
                "total_credit": j["total_debit"],
                "lines": reversed_lines
            }
            INITIAL_JOURNALS.insert(0, rev_entry)
            return {"success": True, "reversed_entry": rev_entry}
    raise HTTPException(status_code=404, detail="Entry not found")

# 3. General Ledger & Trial Balance
@general_ledger_router.get("/trial-balance")
def get_trial_balance(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    tb_rows = []
    tot_debit = 0.0
    tot_credit = 0.0
    for acc in INITIAL_ACCOUNTS:
        debit_val = acc["balance"] if acc["type"] == "Debit" and acc["balance"] >= 0 else 0.0
        credit_val = acc["balance"] if acc["type"] == "Credit" and acc["balance"] >= 0 else 0.0
        tot_debit += debit_val
        tot_credit += credit_val
        tb_rows.append({
            "code": acc["code"],
            "name": acc["name"],
            "category": acc["category"],
            "debit": debit_val,
            "credit": credit_val
        })
    return {
        "as_of_date": datetime.utcnow().strftime("%Y-%m-%d"),
        "accounts": tb_rows,
        "total_debit": tot_debit,
        "total_credit": tot_credit,
        "is_balanced": abs(tot_debit - tot_credit) < 0.01
    }

# 4. Accounts Payable
@payables_router.get("/")
def get_accounts_payable(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return [
        {"id": "bill-101", "vendor": "TechSupply International", "bill_number": "V-9921", "amount": 8450.00, "due_date": "2026-10-18", "aging": "0-30 days", "status": "Pending", "approval_status": "Approved"},
        {"id": "bill-102", "vendor": "Industrial Thermal Label Co", "bill_number": "V-8842", "amount": 4200.00, "due_date": "2026-10-10", "aging": "0-30 days", "status": "Pending", "approval_status": "Approved"},
        {"id": "bill-103", "vendor": "Precision Printhead Systems", "bill_number": "V-7612", "amount": 3100.00, "due_date": "2026-09-25", "aging": "31-60 days", "status": "Overdue", "approval_status": "Approved"},
        {"id": "bill-104", "vendor": "FastLine Freight Distribution", "bill_number": "V-6110", "amount": 1650.00, "due_date": "2026-09-02", "aging": "61-90 days", "status": "Overdue", "approval_status": "In Review"}
    ]

# 5. Accounts Receivable
@receivables_router.get("/")
def get_accounts_receivable(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return [
        {"id": "rec-201", "customer": "Acme Logistics Global", "invoice_number": "INV-2026-0891", "amount": 14500.00, "due_date": "2026-10-25", "aging": "0-30 days", "status": "Current", "credit_limit": 50000.00, "outstanding": 14500.00},
        {"id": "rec-202", "customer": "Summit Hardware Network", "invoice_number": "INV-2026-0840", "amount": 8920.00, "due_date": "2026-10-12", "aging": "0-30 days", "status": "Current", "credit_limit": 25000.00, "outstanding": 8920.00},
        {"id": "rec-203", "customer": "Apex Distribution Group", "invoice_number": "INV-2026-0792", "amount": 12400.00, "due_date": "2026-09-20", "aging": "31-60 days", "status": "Overdue", "credit_limit": 30000.00, "outstanding": 12400.00}
    ]

# 6. Budgets
@budgets_router.get("/")
def get_budgets(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return [
        {"department": "Supply Chain & Logistics", "allocated": 480000.00, "actual": 420800.00, "variance": 59200.00, "utilization_percent": 87.6, "status": "On Track"},
        {"department": "Retail POS Operations", "allocated": 320000.00, "actual": 298400.00, "variance": 21600.00, "utilization_percent": 93.2, "status": "On Track"},
        {"department": "Technology & Infrastructure", "allocated": 180000.00, "actual": 164200.00, "variance": 15800.00, "utilization_percent": 91.2, "status": "On Track"},
        {"department": "Executive & General Admin", "allocated": 150000.00, "actual": 148500.00, "variance": 1500.00, "utilization_percent": 99.0, "status": "Warning"}
    ]

# 7. Taxes
@taxes_router.get("/summary")
def get_tax_summary(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return {
        "jurisdiction": "State & Federal Consolidated",
        "tax_collected_sales": 74500.00,
        "tax_paid_purchases": 36100.00,
        "net_tax_liability": 38400.00,
        "gst_vat_rate": "8.25%",
        "filing_due_date": "2026-10-31",
        "status": "Accrued"
    }

# 8. Financial Reports (Balance Sheet, P&L, Cash Flow)
@financial_reports_router.get("/balance-sheet")
def get_balance_sheet(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return {
        "as_of": datetime.utcnow().strftime("%Y-%m-%d"),
        "total_assets": 2341500.00,
        "current_assets": 2064500.00,
        "fixed_assets": 277000.00,
        "total_liabilities": 845100.00,
        "current_liabilities": 345100.00,
        "long_term_liabilities": 500000.00,
        "total_equity": 1496400.00,
        "is_balanced": True
    }

# 9. Invoices
@invoices_router.get("/")
def get_invoices(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return [
        {"id": "inv-101", "type": "Customer", "invoice_number": "INV-2026-09191", "partner": "Acme Logistics Corp", "amount": 2850.00, "date": "2026-09-19", "status": "Paid"},
        {"id": "inv-102", "type": "Customer", "invoice_number": "INV-2026-09193", "partner": "Summit Hardware Supply", "amount": 3420.00, "date": "2026-09-19", "status": "Paid"},
        {"id": "inv-103", "type": "Vendor", "invoice_number": "BILL-2026-0889", "partner": "TechSupply International", "amount": 2100.00, "date": "2026-10-04", "status": "Approved"}
    ]

# 10. Cash Management
@cash_router.get("/accounts")
def get_cash_accounts(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return [
        {"id": "bank-1", "name": "Operating Checking (JPMorgan Chase)", "account_number": "****4892", "balance": 420800.00, "unreconciled": 2450.00, "last_reconciled": "2026-10-01"},
        {"id": "bank-2", "name": "Payroll Reserve (Wells Fargo)", "account_number": "****1024", "balance": 173750.00, "unreconciled": 0.00, "last_reconciled": "2026-10-01"},
        {"id": "cash-1", "name": "Store Safe & POS Cash Vault", "account_number": "VAULT-01", "balance": 48250.00, "unreconciled": 150.00, "last_reconciled": "2026-10-04"}
    ]


# Aggregate Router for main.py integration
router = APIRouter()
router.include_router(accounts_router)
router.include_router(journal_router)
router.include_router(general_ledger_router)
router.include_router(payables_router)
router.include_router(receivables_router)
router.include_router(budgets_router)
router.include_router(taxes_router)
router.include_router(financial_reports_router)
router.include_router(invoices_router)
router.include_router(cash_router)
