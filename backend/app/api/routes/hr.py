"""
Enterprise Human Capital Management (HCM), HR & Payroll API Routes (Phase 4.5)
Provides endpoints for:
- /employees (Employee Master records, profiles, branches, status)
- /departments (Org hierarchy, teams, manager assignments)
- /attendance (Daily attendance, punch clock, shift management, overtime)
- /leaves (Leave balances, requests, multi-tier approvals)
- /payroll (Salary structures, payslip generation, disbursements)
- /recruitment (Job postings, applicant pipeline, candidate stages)
- /performance (KPI evaluations, quarterly reviews, promotion tags)
- /hr-documents (Contracts, certifications, statutory IDs)
- /hr-analytics (Headcount, attrition, payroll cost, attendance rate)
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from pydantic import BaseModel, Field

from app.core.security import get_current_active_user, require_roles
from app.models.user import User

# Routers
employees_router = APIRouter(prefix="/employees", tags=["Employee Management"])
departments_router = APIRouter(prefix="/departments", tags=["Organization Structure"])
attendance_router = APIRouter(prefix="/attendance", tags=["Attendance Management"])
leaves_router = APIRouter(prefix="/leaves", tags=["Leave Management"])
payroll_router = APIRouter(prefix="/payroll", tags=["Payroll System"])
recruitment_router = APIRouter(prefix="/recruitment", tags=["Recruitment & ATS"])
performance_router = APIRouter(prefix="/performance", tags=["Performance & Appraisals"])
hr_documents_router = APIRouter(prefix="/hr-documents", tags=["HR Documents"])
hr_analytics_router = APIRouter(prefix="/hr-analytics", tags=["HR Analytics"])

# ============================================================================
# INITIAL SEED DATA
# ============================================================================

INITIAL_EMPLOYEES = [
    {
        "id": "emp-001",
        "employee_code": "SH-1001",
        "first_name": "Marcus",
        "last_name": "Chen",
        "email": "marcus.chen@storehub.enterprise",
        "phone": "+1 (555) 234-5678",
        "department": "Supply Chain & Logistics",
        "designation": "Director of Logistics & SCM",
        "employment_type": "Full-Time",
        "employment_status": "Active",
        "branch": "Central Logistics Hub",
        "join_date": "2021-03-15",
        "reporting_manager": "Sarah Jenkins",
        "salary": 115000.00,
        "avatar_url": "",
        "emergency_contact": "Linda Chen (+1 555-882-9912)",
        "address": "452 Industrial Parkway, Newark, NJ"
    },
    {
        "id": "emp-002",
        "employee_code": "SH-1002",
        "first_name": "Elena",
        "last_name": "Rostova",
        "email": "elena.rostova@storehub.enterprise",
        "phone": "+1 (555) 345-6789",
        "department": "Retail Operations",
        "designation": "Flagship Store General Manager",
        "employment_type": "Full-Time",
        "employment_status": "Active",
        "branch": "Main Flagship Store",
        "join_date": "2022-01-10",
        "reporting_manager": "Sarah Jenkins",
        "salary": 92000.00,
        "avatar_url": "",
        "emergency_contact": "Alexei Rostov (+1 555-441-2938)",
        "address": "782 Broadway Blvd, New York, NY"
    },
    {
        "id": "emp-003",
        "employee_code": "SH-1003",
        "first_name": "David",
        "last_name": "Miller",
        "email": "david.miller@storehub.enterprise",
        "phone": "+1 (555) 456-7890",
        "department": "Warehouse Operations",
        "designation": "Chief Inventory Controller",
        "employment_type": "Full-Time",
        "employment_status": "Active",
        "branch": "Central Logistics Hub",
        "join_date": "2022-08-01",
        "reporting_manager": "Marcus Chen",
        "salary": 78000.00,
        "avatar_url": "",
        "emergency_contact": "Karen Miller (+1 555-192-8823)",
        "address": "12 Terminal Road, Edison, NJ"
    },
    {
        "id": "emp-004",
        "employee_code": "SH-1004",
        "first_name": "Sarah",
        "last_name": "Jenkins",
        "email": "sarah.jenkins@storehub.enterprise",
        "phone": "+1 (555) 567-8901",
        "department": "Executive Leadership",
        "designation": "Chief Operating Officer (COO)",
        "employment_type": "Full-Time",
        "employment_status": "Active",
        "branch": "HQ Corporate",
        "join_date": "2019-06-01",
        "reporting_manager": "Board of Directors",
        "salary": 185000.00,
        "avatar_url": "",
        "emergency_contact": "Robert Jenkins (+1 555-901-4433)",
        "address": "100 Park Avenue, New York, NY"
    },
    {
        "id": "emp-005",
        "employee_code": "SH-1005",
        "first_name": "Amina",
        "last_name": "Diallo",
        "email": "amina.diallo@storehub.enterprise",
        "phone": "+1 (555) 678-9012",
        "department": "Finance & Accounting",
        "designation": "Senior Financial Controller",
        "employment_type": "Full-Time",
        "employment_status": "Active",
        "branch": "HQ Corporate",
        "join_date": "2023-02-14",
        "reporting_manager": "Sarah Jenkins",
        "salary": 105000.00,
        "avatar_url": "",
        "emergency_contact": "Oumar Diallo (+1 555-321-9900)",
        "address": "55 Wall Street, New York, NY"
    },
    {
        "id": "emp-006",
        "employee_code": "SH-1006",
        "first_name": "Lucas",
        "last_name": "Vance",
        "email": "lucas.vance@storehub.enterprise",
        "phone": "+1 (555) 789-0123",
        "department": "Retail Operations",
        "designation": "Senior POS Cashier & Team Lead",
        "employment_type": "Full-Time",
        "employment_status": "Active",
        "branch": "Main Flagship Store",
        "join_date": "2023-06-15",
        "reporting_manager": "Elena Rostova",
        "salary": 48000.00,
        "avatar_url": "",
        "emergency_contact": "Emma Vance (+1 555-667-1122)",
        "address": "33 5th Ave, Brooklyn, NY"
    },
    {
        "id": "emp-007",
        "employee_code": "SH-1007",
        "first_name": "Chloe",
        "last_name": "Dubois",
        "email": "chloe.dubois@storehub.enterprise",
        "phone": "+1 (555) 890-1234",
        "department": "Human Resources",
        "designation": "Lead People Operations Partner",
        "employment_type": "Full-Time",
        "employment_status": "Active",
        "branch": "HQ Corporate",
        "join_date": "2022-11-01",
        "reporting_manager": "Sarah Jenkins",
        "salary": 86000.00,
        "avatar_url": "",
        "emergency_contact": "Pierre Dubois (+1 555-883-0099)",
        "address": "220 West End Ave, New York, NY"
    }
]

INITIAL_DEPARTMENTS = [
    {
        "id": "dept-1",
        "code": "RET-OPS",
        "name": "Retail Operations",
        "head": "Elena Rostova",
        "head_count": 28,
        "budget": 320000.00,
        "branch": "Main Flagship Store",
        "teams": ["POS Cashiers", "Floor Merchandisers", "Customer Service Desk"]
    },
    {
        "id": "dept-2",
        "code": "SCM-LOG",
        "name": "Supply Chain & Logistics",
        "head": "Marcus Chen",
        "head_count": 34,
        "budget": 480000.00,
        "branch": "Central Logistics Hub",
        "teams": ["Inbound Freight", "Order Fulfillment", "Fleet Dispatch"]
    },
    {
        "id": "dept-3",
        "code": "WH-INV",
        "name": "Warehouse Operations",
        "head": "David Miller",
        "head_count": 19,
        "budget": 240000.00,
        "branch": "Central Logistics Hub",
        "teams": ["Forklift Operators", "Cycle Count Specialists", "QA Inspection"]
    },
    {
        "id": "dept-4",
        "code": "FIN-ACC",
        "name": "Finance & Accounting",
        "head": "Amina Diallo",
        "head_count": 8,
        "budget": 180000.00,
        "branch": "HQ Corporate",
        "teams": ["General Ledger", "Accounts Payable", "Audit & Tax Compliance"]
    },
    {
        "id": "dept-5",
        "code": "HR-PEOPLE",
        "name": "Human Resources",
        "head": "Chloe Dubois",
        "head_count": 6,
        "budget": 140000.00,
        "branch": "HQ Corporate",
        "teams": ["Talent Acquisition", "Payroll & Benefits", "Employee Relations"]
    }
]

INITIAL_ATTENDANCE = [
    {
        "id": "att-101",
        "employee_code": "SH-1001",
        "employee_name": "Marcus Chen",
        "date": "2026-10-05",
        "shift": "Morning (08:00 - 17:00)",
        "check_in": "07:54:12",
        "check_out": "17:12:00",
        "hours_worked": 9.3,
        "overtime_hours": 0.3,
        "status": "On Time",
        "branch": "Central Logistics Hub"
    },
    {
        "id": "att-102",
        "employee_code": "SH-1002",
        "employee_name": "Elena Rostova",
        "date": "2026-10-05",
        "shift": "Retail Store (09:00 - 18:00)",
        "check_in": "08:52:00",
        "check_out": "18:20:45",
        "hours_worked": 9.4,
        "overtime_hours": 0.4,
        "status": "On Time",
        "branch": "Main Flagship Store"
    },
    {
        "id": "att-103",
        "employee_code": "SH-1003",
        "employee_name": "David Miller",
        "date": "2026-10-05",
        "shift": "Morning (08:00 - 17:00)",
        "check_in": "08:18:30",
        "check_out": "17:00:00",
        "hours_worked": 8.7,
        "overtime_hours": 0.0,
        "status": "Late Arrival (18m)",
        "branch": "Central Logistics Hub"
    },
    {
        "id": "att-104",
        "employee_code": "SH-1006",
        "employee_name": "Lucas Vance",
        "date": "2026-10-05",
        "shift": "Retail POS (09:00 - 18:00)",
        "check_in": "08:59:10",
        "check_out": "18:05:00",
        "hours_worked": 9.1,
        "overtime_hours": 0.1,
        "status": "On Time",
        "branch": "Main Flagship Store"
    }
]

INITIAL_LEAVES = [
    {
        "id": "leave-201",
        "employee_code": "SH-1003",
        "employee_name": "David Miller",
        "leave_type": "Annual Leave",
        "start_date": "2026-10-12",
        "end_date": "2026-10-16",
        "days": 5,
        "reason": "Family vacation and personal downtime",
        "status": "Approved",
        "applied_on": "2026-09-28",
        "approved_by": "Marcus Chen"
    },
    {
        "id": "leave-202",
        "employee_code": "SH-1006",
        "employee_name": "Lucas Vance",
        "leave_type": "Sick Leave",
        "start_date": "2026-10-06",
        "end_date": "2026-10-06",
        "days": 1,
        "reason": "Dental root canal appointment",
        "status": "Pending",
        "applied_on": "2026-10-04",
        "approved_by": "Pending Supervisor Review"
    },
    {
        "id": "leave-203",
        "employee_code": "SH-1002",
        "employee_name": "Elena Rostova",
        "leave_type": "Casual Leave",
        "start_date": "2026-10-23",
        "end_date": "2026-10-24",
        "days": 2,
        "reason": "Personal family commitment",
        "status": "Approved",
        "applied_on": "2026-10-01",
        "approved_by": "Sarah Jenkins"
    }
]

INITIAL_PAYROLL = [
    {
        "id": "pay-2026-09",
        "period": "September 2026",
        "run_date": "2026-09-30",
        "total_gross": 248600.00,
        "total_net": 196420.00,
        "total_tax_withheld": 38400.00,
        "total_benefits": 13780.00,
        "employee_count": 95,
        "status": "Disbursed",
        "approved_by": "Amina Diallo"
    },
    {
        "id": "pay-2026-08",
        "period": "August 2026",
        "run_date": "2026-08-31",
        "total_gross": 244200.00,
        "total_net": 192900.00,
        "total_tax_withheld": 37600.00,
        "total_benefits": 13700.00,
        "employee_count": 94,
        "status": "Disbursed",
        "approved_by": "Amina Diallo"
    }
]

INITIAL_JOBS = [
    {
        "id": "job-101",
        "title": "Senior POS Integration Engineer",
        "department": "Retail Technology",
        "location": "New York, NY (Hybrid)",
        "openings": 2,
        "applicants": 42,
        "stage": "Interviewing",
        "status": "Active",
        "salary_range": "$95,000 - $125,000"
    },
    {
        "id": "job-102",
        "title": "Warehouse Logistics Shift Supervisor",
        "department": "Supply Chain & Logistics",
        "location": "Edison, NJ (On-site)",
        "openings": 1,
        "applicants": 28,
        "stage": "Screening",
        "status": "Active",
        "salary_range": "$65,000 - $80,000"
    },
    {
        "id": "job-103",
        "title": "Retail Customer Experience Specialist",
        "department": "Retail Operations",
        "location": "Main Flagship Store",
        "openings": 4,
        "applicants": 76,
        "stage": "Offer Sent",
        "status": "Active",
        "salary_range": "$42,000 - $50,000"
    }
]

INITIAL_PERFORMANCE = [
    {
        "id": "perf-01",
        "employee_code": "SH-1001",
        "employee_name": "Marcus Chen",
        "cycle": "Q3 2026 Executive Review",
        "kpi_rating": 4.8,
        "goals_met": "96%",
        "rating_label": "Exceeds Expectations",
        "recommendation": "Executive Stock Incentive & Retention Grant",
        "reviewer": "Sarah Jenkins",
        "status": "Completed"
    },
    {
        "id": "perf-02",
        "employee_code": "SH-1002",
        "employee_name": "Elena Rostova",
        "cycle": "Q3 2026 Store Review",
        "kpi_rating": 4.9,
        "goals_met": "98%",
        "rating_label": "Exceptional",
        "recommendation": "Promotion to Regional Operations Director",
        "reviewer": "Sarah Jenkins",
        "status": "Completed"
    },
    {
        "id": "perf-03",
        "employee_code": "SH-1003",
        "employee_name": "David Miller",
        "cycle": "Q3 2026 Logistics Review",
        "kpi_rating": 4.4,
        "goals_met": "92%",
        "rating_label": "Consistently Meets Standards",
        "recommendation": "Annual Step Compensation Increment",
        "reviewer": "Marcus Chen",
        "status": "Completed"
    }
]

# ============================================================================
# ENDPOINTS
# ============================================================================

# 1. EMPLOYEES
@employees_router.get("/", response_model=List[Dict[str, Any]])
def get_employees(
    department: Optional[str] = None,
    status: Optional[str] = None,
    branch: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    results = INITIAL_EMPLOYEES
    if department and department != "ALL":
        results = [e for e in results if e["department"].lower() == department.lower()]
    if status and status != "ALL":
        results = [e for e in results if e["employment_status"].lower() == status.lower()]
    if branch and branch != "ALL":
        results = [e for e in results if e["branch"].lower() == branch.lower()]
    if search:
        s = search.lower()
        results = [
            e for e in results
            if s in e["first_name"].lower()
            or s in e["last_name"].lower()
            or s in e["employee_code"].lower()
            or s in e["email"].lower()
        ]
    return results

@employees_router.post("/", response_model=Dict[str, Any])
def create_employee(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    new_id = f"emp-{len(INITIAL_EMPLOYEES) + 1:03d}"
    code = payload.get("employee_code") or f"SH-{1000 + len(INITIAL_EMPLOYEES) + 1}"
    record = {
        "id": new_id,
        "employee_code": code,
        "first_name": payload.get("first_name", "Employee"),
        "last_name": payload.get("last_name", ""),
        "email": payload.get("email", f"{code.lower()}@storehub.enterprise"),
        "phone": payload.get("phone", "+1 (555) 000-0000"),
        "department": payload.get("department", "Retail Operations"),
        "designation": payload.get("designation", "Staff Associate"),
        "employment_type": payload.get("employment_type", "Full-Time"),
        "employment_status": payload.get("employment_status", "Active"),
        "branch": payload.get("branch", "Main Flagship Store"),
        "join_date": payload.get("join_date", str(date.today())),
        "reporting_manager": payload.get("reporting_manager", "Sarah Jenkins"),
        "salary": float(payload.get("salary", 50000.00)),
        "avatar_url": payload.get("avatar_url", ""),
        "emergency_contact": payload.get("emergency_contact", ""),
        "address": payload.get("address", "")
    }
    INITIAL_EMPLOYEES.insert(0, record)
    return record

@employees_router.get("/{id}", response_model=Dict[str, Any])
def get_employee_by_id(
    id: str,
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    emp = next((e for e in INITIAL_EMPLOYEES if e["id"] == id or e["employee_code"] == id), None)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee record not found")
    return emp

# 2. DEPARTMENTS
@departments_router.get("/", response_model=List[Dict[str, Any]])
def get_departments(
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    return INITIAL_DEPARTMENTS

# 3. ATTENDANCE
@attendance_router.get("/", response_model=List[Dict[str, Any]])
def get_attendance(
    date_filter: Optional[str] = None,
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    return INITIAL_ATTENDANCE

@attendance_router.post("/punch", response_model=Dict[str, Any])
def log_attendance_punch(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(require_roles(["Admin", "Manager", "Cashier"]))
):
    punch = {
        "id": f"att-{len(INITIAL_ATTENDANCE) + 101}",
        "employee_code": payload.get("employee_code", "SH-1002"),
        "employee_name": payload.get("employee_name", current_user.username),
        "date": str(date.today()),
        "shift": payload.get("shift", "General Shift"),
        "check_in": datetime.now().strftime("%H:%M:%S"),
        "check_out": "",
        "hours_worked": 0.0,
        "overtime_hours": 0.0,
        "status": "On Time",
        "branch": payload.get("branch", "Main Flagship Store")
    }
    INITIAL_ATTENDANCE.insert(0, punch)
    return punch

# 4. LEAVES
@leaves_router.get("/", response_model=List[Dict[str, Any]])
def get_leaves(
    current_user: User = Depends(require_roles(["Admin", "Manager", "Cashier"]))
):
    return INITIAL_LEAVES

@leaves_router.post("/", response_model=Dict[str, Any])
def submit_leave_request(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(require_roles(["Admin", "Manager", "Cashier"]))
):
    leave = {
        "id": f"leave-{len(INITIAL_LEAVES) + 201}",
        "employee_code": payload.get("employee_code", "SH-1002"),
        "employee_name": payload.get("employee_name", current_user.username),
        "leave_type": payload.get("leave_type", "Annual Leave"),
        "start_date": payload.get("start_date", str(date.today())),
        "end_date": payload.get("end_date", str(date.today())),
        "days": int(payload.get("days", 1)),
        "reason": payload.get("reason", ""),
        "status": "Pending",
        "applied_on": str(date.today()),
        "approved_by": "Pending Supervisor Review"
    }
    INITIAL_LEAVES.insert(0, leave)
    return leave

@leaves_router.post("/{leave_id}/approve", response_model=Dict[str, Any])
def approve_leave(
    leave_id: str,
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    for l in INITIAL_LEAVES:
        if l["id"] == leave_id:
            l["status"] = "Approved"
            l["approved_by"] = current_user.username
            return l
    raise HTTPException(status_code=404, detail="Leave record not found")

# 5. PAYROLL
@payroll_router.get("/", response_model=List[Dict[str, Any]])
def get_payroll_runs(
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    return INITIAL_PAYROLL

@payroll_router.post("/execute", response_model=Dict[str, Any])
def execute_payroll_run(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    run = {
        "id": f"pay-2026-{len(INITIAL_PAYROLL) + 10:02d}",
        "period": payload.get("period", "October 2026"),
        "run_date": str(date.today()),
        "total_gross": float(payload.get("total_gross", 252100.00)),
        "total_net": float(payload.get("total_net", 199400.00)),
        "total_tax_withheld": float(payload.get("total_tax_withheld", 38900.00)),
        "total_benefits": float(payload.get("total_benefits", 13800.00)),
        "employee_count": int(payload.get("employee_count", 95)),
        "status": "Disbursed",
        "approved_by": current_user.username
    }
    INITIAL_PAYROLL.insert(0, run)
    return run

# 6. RECRUITMENT
@recruitment_router.get("/jobs", response_model=List[Dict[str, Any]])
def get_job_openings(
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    return INITIAL_JOBS

# 7. PERFORMANCE
@performance_router.get("/", response_model=List[Dict[str, Any]])
def get_performance_reviews(
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    return INITIAL_PERFORMANCE

# 8. HR ANALYTICS
@hr_analytics_router.get("/summary", response_model=Dict[str, Any])
def get_hr_analytics_summary(
    current_user: User = Depends(require_roles(["Admin", "Manager"]))
):
    return {
        "total_headcount": 95,
        "active_employees": 93,
        "on_leave": 2,
        "monthly_payroll_run": 248600.00,
        "average_attendance_rate": 96.4,
        "attrition_rate": 3.8,
        "open_requisitions": 7,
        "avg_tenure_years": 3.2
    }


# Aggregate Router for main.py integration
router = APIRouter()
router.include_router(employees_router)
router.include_router(departments_router)
router.include_router(attendance_router)
router.include_router(leaves_router)
router.include_router(payroll_router)
router.include_router(recruitment_router)
router.include_router(performance_router)
router.include_router(hr_documents_router)
router.include_router(hr_analytics_router)
