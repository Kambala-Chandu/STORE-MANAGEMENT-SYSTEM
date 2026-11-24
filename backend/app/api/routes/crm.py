"""
Enterprise CRM, Customer Experience & Sales Automation API Routes (Phase 4.6)
Provides endpoints for:
- /crm/customers-360 (Customer 360 profile, purchase history, LTV, timeline)
- /crm/leads (Lead capture, lead scoring, assignment rules, pipeline)
- /crm/opportunities (Sales stages, forecast probability, expected revenue)
- /crm/contacts (Companies, key decision makers, account notes)
- /crm/activities (Calls, meetings, tasks, follow-ups)
- /crm/tickets (Support tickets, SLA timers, priority queues, escalations)
- /crm/campaigns (Marketing campaigns, customer segments, ROI tracking)
- /crm/loyalty (Reward points, membership tiers, coupons, redemptions)
- /crm/analytics (Funnel conversion, lead sources, retention, churn)
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from pydantic import BaseModel, Field

from app.core.security import get_current_active_user, require_roles
from app.models.user import User

# Routers
customers_360_router = APIRouter(prefix="/crm/customers-360", tags=["CRM Customer 360"])
leads_router = APIRouter(prefix="/crm/leads", tags=["CRM Lead Management"])
opportunities_router = APIRouter(prefix="/crm/opportunities", tags=["CRM Opportunities"])
contacts_router = APIRouter(prefix="/crm/contacts", tags=["CRM Contacts & Accounts"])
activities_router = APIRouter(prefix="/crm/activities", tags=["CRM Sales Activities"])
tickets_router = APIRouter(prefix="/crm/tickets", tags=["CRM Customer Support"])
campaigns_router = APIRouter(prefix="/crm/campaigns", tags=["CRM Marketing Campaigns"])
loyalty_router = APIRouter(prefix="/crm/loyalty", tags=["CRM Loyalty Program"])
crm_analytics_router = APIRouter(prefix="/crm/analytics", tags=["CRM Analytics"])

# ============================================================================
# INITIAL SEED DATA
# ============================================================================

INITIAL_CUSTOMERS_360 = [
    {
        "id": "cust-360-1",
        "customer_code": "CUST-8001",
        "name": "Acme Logistics Global",
        "type": "B2B Commercial",
        "email": "procurement@acmelogistics.com",
        "phone": "+1 (555) 349-8800",
        "tier": "Platinum Enterprise",
        "status": "Active VIP",
        "lifetime_value": 148500.00,
        "total_orders": 42,
        "loyalty_points": 14850,
        "credit_limit": 50000.00,
        "assigned_rep": "Sarah Jenkins",
        "last_order_date": "2026-10-02",
        "recent_purchases": [
            {"order_id": "ORD-2026-9912", "date": "2026-10-02", "amount": 14500.00, "items": "Conveyor Sortation Scanner Terminals"},
            {"order_id": "ORD-2026-8819", "date": "2026-08-15", "amount": 8900.00, "items": "Thermal Barcode Labels & Ribbons"}
        ],
        "timeline": [
            {"date": "2026-10-02", "type": "Order Placed", "summary": "B2B bulk purchase $14,500.00 processed via ACH"},
            {"date": "2026-09-28", "type": "Account Review", "summary": "Quarterly enterprise contract renewal call with VP Logistics"}
        ]
    },
    {
        "id": "cust-360-2",
        "customer_code": "CUST-8002",
        "name": "Summit Hardware Network",
        "type": "Retail Chain Wholesale",
        "email": "purchasing@summithardware.com",
        "phone": "+1 (555) 712-4411",
        "tier": "Gold Wholesale",
        "status": "Active",
        "lifetime_value": 84200.00,
        "total_orders": 28,
        "loyalty_points": 8420,
        "credit_limit": 25000.00,
        "assigned_rep": "Lucas Vance",
        "last_order_date": "2026-09-22",
        "recent_purchases": [
            {"order_id": "ORD-2026-9193", "date": "2026-09-22", "amount": 3420.00, "items": "Receipt Printers & Dual Cash Drawers"}
        ],
        "timeline": [
            {"date": "2026-09-22", "type": "Order Placed", "summary": "Store POS equipment renewal $3,420.00 shipped"}
        ]
    },
    {
        "id": "cust-360-3",
        "customer_code": "CUST-8003",
        "name": "Apex Distribution Group",
        "type": "B2B Enterprise",
        "email": "finance@apexgroup.com",
        "phone": "+1 (555) 890-3321",
        "tier": "Diamond Strategic",
        "status": "High Touch Account",
        "lifetime_value": 210000.00,
        "total_orders": 65,
        "loyalty_points": 21000,
        "credit_limit": 60000.00,
        "assigned_rep": "Elena Rostova",
        "last_order_date": "2026-09-18",
        "recent_purchases": [
            {"order_id": "ORD-2026-8901", "date": "2026-09-18", "amount": 12400.00, "items": "Sortation Automated Scanners"}
        ],
        "timeline": [
            {"date": "2026-09-30", "type": "Support Escalation", "summary": "Firmware upgrade consultation for scanner gateways"}
        ]
    }
]

INITIAL_LEADS = [
    {
        "id": "lead-101",
        "name": "Jonathan Vance",
        "company": "Metro Retail Partners LLC",
        "title": "VP Store Operations",
        "email": "jvance@metroretail.com",
        "phone": "+1 (555) 412-9901",
        "source": "In-Store POS Demo",
        "status": "Qualified",
        "score": 92,
        "assigned_to": "Elena Rostova",
        "estimated_value": 45000.00,
        "created_date": "2026-09-25",
        "notes": "Looking to upgrade 15 store registers to StoreHub Enterprise POS."
    },
    {
        "id": "lead-102",
        "name": "Claire Beaumont",
        "company": "Horizon Freightways International",
        "title": "Director of Material Logistics",
        "email": "c.beaumont@horizonfreight.com",
        "phone": "+1 (555) 623-1188",
        "source": "Website Demo Request",
        "status": "Contacted",
        "score": 84,
        "assigned_to": "Marcus Chen",
        "estimated_value": 68000.00,
        "created_date": "2026-10-01",
        "notes": "Warehouse inventory tracking & barcode scanner hardware inquiry."
    },
    {
        "id": "lead-103",
        "name": "Raymond Ortiz",
        "company": "Beacon Regional Marts",
        "title": "Chief Information Officer",
        "email": "rortiz@beaconmarts.com",
        "phone": "+1 (555) 734-2299",
        "source": "National Retail Trade Expo",
        "status": "New Inbound",
        "score": 78,
        "assigned_to": "Sarah Jenkins",
        "estimated_value": 110000.00,
        "created_date": "2026-10-04",
        "notes": "Met at NRF trade show; interested in full ERP + POS replacement."
    }
]

INITIAL_OPPORTUNITIES = [
    {
        "id": "opp-201",
        "title": "Metro Retail 15-Store POS Rollout",
        "account": "Metro Retail Partners LLC",
        "stage": "Proposal Sent",
        "amount": 45000.00,
        "probability": 75,
        "expected_revenue": 33750.00,
        "close_date": "2026-11-15",
        "assigned_rep": "Elena Rostova",
        "type": "New Business",
        "next_step": "Executive proposal review meeting on Oct 14"
    },
    {
        "id": "opp-202",
        "title": "Horizon Freight Warehouse Scanners",
        "account": "Horizon Freightways International",
        "stage": "Negotiation",
        "amount": 68000.00,
        "probability": 85,
        "expected_revenue": 57800.00,
        "close_date": "2026-10-28",
        "assigned_rep": "Marcus Chen",
        "type": "New Business",
        "next_step": "Procurement contract legal review"
    },
    {
        "id": "opp-203",
        "title": "Beacon Regional Marts ERP Migration",
        "account": "Beacon Regional Marts",
        "stage": "Qualification",
        "amount": 110000.00,
        "probability": 40,
        "expected_revenue": 44000.00,
        "close_date": "2026-12-10",
        "assigned_rep": "Sarah Jenkins",
        "type": "Enterprise Expansion",
        "next_step": "Technical architectural walkthrough"
    },
    {
        "id": "opp-204",
        "title": "Acme Logistics Q4 Hardware Expansion",
        "account": "Acme Logistics Global",
        "stage": "Closed Won",
        "amount": 35000.00,
        "probability": 100,
        "expected_revenue": 35000.00,
        "close_date": "2026-10-02",
        "assigned_rep": "Sarah Jenkins",
        "type": "Account Expansion",
        "next_step": "Order fulfilled and in production"
    }
]

INITIAL_TICKETS = [
    {
        "id": "tkt-501",
        "ticket_number": "TKT-2026-1089",
        "customer": "Summit Hardware Network",
        "contact": "Arthur Pendelton",
        "subject": "POS Cash Drawer Kick Signal Intermittent Delay",
        "category": "Hardware Peripheral",
        "priority": "High",
        "status": "In Progress",
        "assigned_agent": "Lucas Vance",
        "created_at": "2026-10-05 08:30",
        "sla_target_hours": 4,
        "sla_remaining_minutes": 110,
        "sla_breached": False
    },
    {
        "id": "tkt-502",
        "ticket_number": "TKT-2026-1085",
        "customer": "Apex Distribution Group",
        "contact": "Linda Sterling",
        "subject": "Firmware Version 4.2 Scanner Calibration Inconsistency",
        "category": "Software & Firmware",
        "priority": "Urgent",
        "status": "Escalated",
        "assigned_agent": "Marcus Chen",
        "created_at": "2026-10-04 16:45",
        "sla_target_hours": 2,
        "sla_remaining_minutes": 25,
        "sla_breached": False
    },
    {
        "id": "tkt-503",
        "ticket_number": "TKT-2026-1078",
        "customer": "Acme Logistics Global",
        "contact": "Gregory House",
        "subject": "Invoice PDF Reconciliation Discrepancy",
        "category": "Billing & Invoicing",
        "priority": "Medium",
        "status": "Resolved",
        "assigned_agent": "Amina Diallo",
        "created_at": "2026-10-03 11:20",
        "sla_target_hours": 8,
        "sla_remaining_minutes": 0,
        "sla_breached": False
    }
]

INITIAL_CAMPAIGNS = [
    {
        "id": "camp-301",
        "name": "Q4 Commercial Hardware Refresh Promo",
        "channel": "Email & Direct Outreach",
        "segment": "Tier-1 B2B Wholesalers",
        "status": "Active",
        "budget": 5000.00,
        "spent": 3850.00,
        "revenue_generated": 52400.00,
        "roi": "1,261%",
        "recipients": 1250,
        "open_rate": "42.8%",
        "click_rate": "18.4%"
    },
    {
        "id": "camp-302",
        "name": "Retail Store VIP Double Points Weekend",
        "channel": "SMS & App Push",
        "segment": "Active Gold & Platinum Retail Shoppers",
        "status": "Active",
        "budget": 2500.00,
        "spent": 1900.00,
        "revenue_generated": 28900.00,
        "roi": "1,421%",
        "recipients": 4800,
        "open_rate": "89.2%",
        "click_rate": "31.5%"
    },
    {
        "id": "camp-303",
        "name": "Inbound POS Software Switcher Campaign",
        "channel": "Search & LinkedIn Ads",
        "segment": "SMB Multi-Store Owners",
        "status": "Completed",
        "budget": 8000.00,
        "spent": 8000.00,
        "revenue_generated": 84000.00,
        "roi": "950%",
        "recipients": 15000,
        "open_rate": "24.1%",
        "click_rate": "6.8%"
    }
]

INITIAL_LOYALTY = {
    "total_members": 3450,
    "points_issued_total": 485000,
    "points_redeemed_total": 312000,
    "outstanding_liability": 17300.00,
    "tiers": [
        {"name": "Bronze Entry", "min_spend": 0, "multiplier": "1.0x", "members": 2100},
        {"name": "Silver Preferred", "min_spend": 1000, "multiplier": "1.25x", "members": 850},
        {"name": "Gold VIP", "min_spend": 5000, "multiplier": "1.5x", "members": 380},
        {"name": "Platinum Enterprise", "min_spend": 20000, "multiplier": "2.0x", "members": 120}
    ],
    "active_coupons": [
        {"code": "VIPFALL20", "discount": "20% Off Peripherals", "expires": "2026-11-30", "uses": 142},
        {"code": "BULKSHIPFREE", "discount": "Free Freight on Orders > $2,000", "expires": "2026-12-31", "uses": 89}
    ]
}

# ============================================================================
# ENDPOINTS
# ============================================================================

# 1. CUSTOMERS 360
@customers_360_router.get("/", response_model=List[Dict[str, Any]])
def get_customers_360(
    search: Optional[str] = None,
    tier: Optional[str] = None,
    current_user: User = Depends(require_roles(["Admin", "Manager", "Cashier"]))
):
    results = INITIAL_CUSTOMERS_360
    if tier and tier != "ALL":
        results = [c for c in results if tier.lower() in c["tier"].lower()]
    if search:
        s = search.lower()
        results = [
            c for c in results
            if s in c["name"].lower()
            or s in c["customer_code"].lower()
            or s in c["email"].lower()
        ]
    return results

@customers_360_router.get("/{id}", response_model=Dict[str, Any])
def get_customer_360_by_id(
    id: str,
    current_user: User = Depends(require_roles(["Admin", "Manager", "Cashier"]))
):
    cust = next((c for c in INITIAL_CUSTOMERS_360 if c["id"] == id or c["customer_code"] == id), None)
    if not cust:
        raise HTTPException(status_code=404, detail="Customer record not found")
    return cust

# 2. LEADS
@leads_router.get("/", response_model=List[Dict[str, Any]])
def get_leads(
    status: Optional[str] = None,
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    results = INITIAL_LEADS
    if status and status != "ALL":
        results = [l for l in results if l["status"].lower() == status.lower()]
    return results

@leads_router.post("/", response_model=Dict[str, Any])
def create_lead(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    lead = {
        "id": f"lead-{len(INITIAL_LEADS) + 101}",
        "name": payload.get("name", "New Lead"),
        "company": payload.get("company", ""),
        "title": payload.get("title", "Prospect"),
        "email": payload.get("email", ""),
        "phone": payload.get("phone", ""),
        "source": payload.get("source", "Web Inbound"),
        "status": payload.get("status", "New Inbound"),
        "score": int(payload.get("score", 75)),
        "assigned_to": payload.get("assigned_to", current_user.username),
        "estimated_value": float(payload.get("estimated_value", 25000.00)),
        "created_date": str(date.today()),
        "notes": payload.get("notes", "")
    }
    INITIAL_LEADS.insert(0, lead)
    return lead

# 3. OPPORTUNITIES
@opportunities_router.get("/", response_model=List[Dict[str, Any]])
def get_opportunities(
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    return INITIAL_OPPORTUNITIES

@opportunities_router.post("/", response_model=Dict[str, Any])
def create_opportunity(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    amount = float(payload.get("amount", 20000.00))
    prob = int(payload.get("probability", 50))
    opp = {
        "id": f"opp-{len(INITIAL_OPPORTUNITIES) + 201}",
        "title": payload.get("title", "Commercial Hardware Deal"),
        "account": payload.get("account", "Prospective Account"),
        "stage": payload.get("stage", "Qualification"),
        "amount": amount,
        "probability": prob,
        "expected_revenue": (amount * prob) / 100.0,
        "close_date": payload.get("close_date", str(date.today())),
        "assigned_rep": payload.get("assigned_rep", current_user.username),
        "type": payload.get("type", "New Business"),
        "next_step": payload.get("next_step", "Follow up scheduled")
    }
    INITIAL_OPPORTUNITIES.insert(0, opp)
    return opp

# 4. SUPPORT TICKETS
@tickets_router.get("/", response_model=List[Dict[str, Any]])
def get_support_tickets(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    current_user: User = Depends(require_roles(["Admin", "Manager", "Cashier"]))
):
    results = INITIAL_TICKETS
    if status and status != "ALL":
        results = [t for t in results if t["status"].lower() == status.lower()]
    if priority and priority != "ALL":
        results = [t for t in results if t["priority"].lower() == priority.lower()]
    return results

@tickets_router.post("/", response_model=Dict[str, Any])
def create_support_ticket(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(require_roles(["Admin", "Manager", "Cashier"]))
):
    tkt = {
        "id": f"tkt-{len(INITIAL_TICKETS) + 501}",
        "ticket_number": f"TKT-2026-{len(INITIAL_TICKETS) + 1090}",
        "customer": payload.get("customer", "Store Customer"),
        "contact": payload.get("contact", current_user.username),
        "subject": payload.get("subject", "Customer Inquiry"),
        "category": payload.get("category", "General Assistance"),
        "priority": payload.get("priority", "Medium"),
        "status": "In Progress",
        "assigned_agent": payload.get("assigned_agent", current_user.username),
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "sla_target_hours": 4,
        "sla_remaining_minutes": 240,
        "sla_breached": False
    }
    INITIAL_TICKETS.insert(0, tkt)
    return tkt

# 5. CAMPAIGNS
@campaigns_router.get("/", response_model=List[Dict[str, Any]])
def get_campaigns(
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    return INITIAL_CAMPAIGNS

# 6. LOYALTY PROGRAM
@loyalty_router.get("/", response_model=Dict[str, Any])
def get_loyalty_summary(
    current_user: User = Depends(require_roles(["Admin", "Manager", "Cashier"]))
):
    return INITIAL_LOYALTY

# 7. CRM ANALYTICS
@crm_analytics_router.get("/summary", response_model=Dict[str, Any])
def get_crm_analytics(
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    return {
        "pipeline_total_value": 258000.00,
        "pipeline_expected_revenue": 170550.00,
        "conversion_rate_percent": 34.2,
        "customer_retention_rate": 96.2,
        "churn_rate_percent": 3.8,
        "average_deal_size": 48500.00,
        "sla_compliance_rate": 98.4,
        "active_loyalty_members": 3450,
        "nps_score": 76
    }


# Aggregate Router for main.py integration
router = APIRouter()
router.include_router(customers_360_router)
router.include_router(leads_router)
router.include_router(opportunities_router)
router.include_router(contacts_router)
router.include_router(activities_router)
router.include_router(tickets_router)
router.include_router(campaigns_router)
router.include_router(loyalty_router)
router.include_router(crm_analytics_router)
