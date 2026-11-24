"""
Enterprise Workflow Automation & Approval Engine Routes (Phase 4.2)
Provides endpoints for:
- /workflows
- /workflow-executions
- /approvals
- /automation-rules
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel, Field

from app.core.security import get_current_active_user, require_roles
from app.models.user import User

# In-memory backing store for demo/enterprise workflows (persists across runtime)
INITIAL_WORKFLOWS = [
    {
        "id": "wf-1",
        "name": "Purchase Order Approval",
        "description": "Multi-tier authorization hierarchy for procurement orders exceeding $1,000.",
        "trigger": "Purchase Order Created",
        "conditions": [{"field": "total_amount", "operator": ">=", "value": 1000}],
        "approval_levels": [
            {"level": 1, "role": "Manager", "label": "Department Manager Review", "sla_hours": 24},
            {"level": 2, "role": "Finance", "label": "Finance Director Sign-off", "sla_hours": 48},
            {"level": 3, "role": "Director", "label": "Executive Board Authorization", "sla_hours": 72}
        ],
        "auto_actions": ["Reserve Budget Allocation", "Notify Vendor on Final Approval"],
        "notifications": ["Email", "In-App", "Activity Center"],
        "status": "Active",
        "nodes": [
            {"id": "node-1", "type": "Start", "label": "PO Submission", "config": {"event": "po_created"}},
            {"id": "node-2", "type": "Condition", "label": "Amount > $1000", "config": {"field": "amount", "operator": ">", "val": 1000}},
            {"id": "node-3", "type": "Approval", "label": "Tier 1: Manager Sign-off", "config": {"approver": "Store Manager", "sla": "24h"}},
            {"id": "node-4", "type": "Approval", "label": "Tier 2: Finance Director", "config": {"approver": "Finance Head", "sla": "48h"}},
            {"id": "node-5", "type": "Notification", "label": "Notify Purchasing Dept", "config": {"channel": "Email"}},
            {"id": "node-6", "type": "API Action", "label": "Dispatch PO to Supplier", "config": {"endpoint": "/api/v1/purchases/dispatch"}},
            {"id": "node-7", "type": "End", "label": "PO Dispatched", "config": {}}
        ],
        "created_at": "2026-10-01T08:00:00Z",
        "executions_count": 48,
        "success_rate": 96.2
    },
    {
        "id": "wf-2",
        "name": "Sales Discount Approval",
        "description": "Requires supervisor override when discount applied at POS register exceeds 15%.",
        "trigger": "Discount Applied > 15%",
        "conditions": [{"field": "discount_percent", "operator": ">", "value": 15}],
        "approval_levels": [
            {"level": 1, "role": "Manager", "label": "Store Shift Manager Approval", "sla_hours": 2}
        ],
        "auto_actions": ["Log Discount Exception in Audit Trail"],
        "notifications": ["In-App Flash", "Activity Center"],
        "status": "Active",
        "nodes": [
            {"id": "node-1", "type": "Start", "label": "POS Item Scanned", "config": {}},
            {"id": "node-2", "type": "Condition", "label": "Discount > 15%", "config": {}},
            {"id": "node-3", "type": "Approval", "label": "Manager PIN Override", "config": {}},
            {"id": "node-4", "type": "Decision", "label": "Discount Authorized?", "config": {}},
            {"id": "node-5", "type": "End", "label": "Complete Sale", "config": {}}
        ],
        "created_at": "2026-10-01T08:30:00Z",
        "executions_count": 124,
        "success_rate": 98.4
    },
    {
        "id": "wf-3",
        "name": "Inventory Adjustment Approval",
        "description": "Audits physical write-downs, shrinkage variances, and manual inventory adjustments.",
        "trigger": "Manual Stock Adjustment",
        "conditions": [{"field": "quantity_delta", "operator": "!=", "value": 0}],
        "approval_levels": [
            {"level": 1, "role": "Manager", "label": "Warehouse Supervisor Review", "sla_hours": 12},
            {"level": 2, "role": "Finance", "label": "Inventory Controller Sign-off", "sla_hours": 24}
        ],
        "auto_actions": ["Update Physical Stock Ledger", "Generate Shrinkage Audit Record"],
        "notifications": ["Email", "In-App"],
        "status": "Active",
        "created_at": "2026-10-01T09:00:00Z",
        "executions_count": 32,
        "success_rate": 93.8
    },
    {
        "id": "wf-4",
        "name": "Customer Credit Approval",
        "description": "Evaluates commercial credit limits and extended invoicing terms for corporate clients.",
        "trigger": "Customer Credit Limit Request",
        "conditions": [{"field": "credit_requested", "operator": ">=", "value": 5000}],
        "approval_levels": [
            {"level": 1, "role": "Finance", "label": "Credit Risk Assessment", "sla_hours": 24},
            {"level": 2, "role": "Director", "label": "Chief Financial Officer Sign-off", "sla_hours": 48}
        ],
        "auto_actions": ["Update Customer Invoicing Limits"],
        "notifications": ["Email", "Activity Center"],
        "status": "Active",
        "created_at": "2026-10-01T09:30:00Z",
        "executions_count": 14,
        "success_rate": 92.5
    },
    {
        "id": "wf-5",
        "name": "Supplier Approval & Onboarding",
        "description": "Validates vendor credentials, tax documentation, and procurement reliability ratings.",
        "trigger": "New Supplier Registered",
        "conditions": [{"field": "status", "operator": "==", "value": "Pending"}],
        "approval_levels": [
            {"level": 1, "role": "Manager", "label": "Procurement Lead Verification", "sla_hours": 24},
            {"level": 2, "role": "Admin", "label": "Legal & Tax Compliance Audit", "sla_hours": 48}
        ],
        "auto_actions": ["Activate Supplier in Procurement Directory"],
        "notifications": ["Email", "In-App"],
        "status": "Active",
        "created_at": "2026-10-01T10:00:00Z",
        "executions_count": 9,
        "success_rate": 100.0
    },
    {
        "id": "wf-6",
        "name": "User Creation & Role Authorization",
        "description": "Secures administrative role elevation and newly created employee user accounts.",
        "trigger": "User Account Created with Admin/Manager Role",
        "conditions": [{"field": "role", "operator": "in", "value": ["Admin", "Manager"]}],
        "approval_levels": [
            {"level": 1, "role": "Admin", "label": "Security Officer Authorization", "sla_hours": 8}
        ],
        "auto_actions": ["Activate User Credentials", "Log Security Audit Log"],
        "notifications": ["Email", "Activity Center"],
        "status": "Active",
        "created_at": "2026-10-01T10:30:00Z",
        "executions_count": 6,
        "success_rate": 100.0
    },
    {
        "id": "wf-7",
        "name": "Product Price Change Approval",
        "description": "Governs retail price revisions and catalog markdowns exceeding 10%.",
        "trigger": "Product Selling Price Modified",
        "conditions": [{"field": "price_change_percent", "operator": ">=", "value": 10}],
        "approval_levels": [
            {"level": 1, "role": "Manager", "label": "Merchandising Manager Review", "sla_hours": 12}
        ],
        "auto_actions": ["Update Catalog Barcode Price Labels"],
        "notifications": ["In-App", "Activity Center"],
        "status": "Active",
        "created_at": "2026-10-01T11:00:00Z",
        "executions_count": 27,
        "success_rate": 96.0
    },
    {
        "id": "wf-8",
        "name": "Stock Transfer Approval",
        "description": "Authorizes inter-warehouse transfers and regional inventory reallocations.",
        "trigger": "Inter-Store Stock Transfer Initiated",
        "conditions": [{"field": "quantity", "operator": ">=", "value": 50}],
        "approval_levels": [
            {"level": 1, "role": "Manager", "label": "Origin Warehouse Dispatch Review", "sla_hours": 12},
            {"level": 2, "role": "Manager", "label": "Destination Warehouse Inbound Confirmation", "sla_hours": 24}
        ],
        "auto_actions": ["Generate Transfer Manifest Bill of Lading"],
        "notifications": ["Email", "In-App"],
        "status": "Active",
        "created_at": "2026-10-01T11:30:00Z",
        "executions_count": 18,
        "success_rate": 94.4
    }
]

INITIAL_APPROVALS = [
    {
        "id": "appr-101",
        "workflow_id": "wf-1",
        "workflow_name": "Purchase Order Approval",
        "item_ref": "PO-2026-0892",
        "requester": "Sarah Jenkins (Purchasing Lead)",
        "amount": 4850.00,
        "current_level": 2,
        "total_levels": 3,
        "level_label": "Finance Director Sign-off",
        "status": "Pending",
        "sla_deadline": "2026-10-06T14:00:00Z",
        "sla_status": "On Track",
        "created_at": "2026-10-05T08:30:00Z",
        "comments": [
            {"author": "Marcus Chen (Shift Manager)", "role": "Manager", "decision": "Approved", "text": "Stock burn rate justifies full consignment volume.", "time": "2026-10-05T09:15:00Z"}
        ],
        "history": [
            {"event": "Submitted", "actor": "Sarah Jenkins", "time": "2026-10-05T08:30:00Z"},
            {"event": "Level 1 Approved", "actor": "Marcus Chen", "time": "2026-10-05T09:15:00Z"}
        ],
        "attachments": ["supplier_invoice_estimate.pdf", "inventory_depletion_curve.xlsx"]
    },
    {
        "id": "appr-102",
        "workflow_id": "wf-2",
        "workflow_name": "Sales Discount Approval",
        "item_ref": "INV-DRAFT-441",
        "requester": "Elena Rostova (Cashier)",
        "amount": 320.00,
        "current_level": 1,
        "total_levels": 1,
        "level_label": "Store Shift Manager Approval",
        "status": "Pending",
        "sla_deadline": "2026-10-05T13:00:00Z",
        "sla_status": "Urgent",
        "created_at": "2026-10-05T10:45:00Z",
        "comments": [],
        "history": [
            {"event": "Submitted", "actor": "Elena Rostova", "time": "2026-10-05T10:45:00Z"}
        ],
        "attachments": []
    },
    {
        "id": "appr-103",
        "workflow_id": "wf-3",
        "workflow_name": "Inventory Adjustment Approval",
        "item_ref": "ADJ-2026-034",
        "requester": "David Miller (Warehouse Spec)",
        "amount": 890.00,
        "current_level": 1,
        "total_levels": 2,
        "level_label": "Warehouse Supervisor Review",
        "status": "Pending",
        "sla_deadline": "2026-10-05T11:00:00Z",
        "sla_status": "Overdue",
        "created_at": "2026-10-04T16:00:00Z",
        "comments": [],
        "history": [
            {"event": "Submitted", "actor": "David Miller", "time": "2026-10-04T16:00:00Z"}
        ],
        "attachments": ["damaged_packaging_photo.jpg"]
    },
    {
        "id": "appr-104",
        "workflow_id": "wf-4",
        "workflow_name": "Customer Credit Approval",
        "item_ref": "CUST-CR-904",
        "requester": "Marcus Chen (Sales Specialist)",
        "amount": 15000.00,
        "current_level": 2,
        "total_levels": 2,
        "level_label": "CFO Sign-off",
        "status": "Pending",
        "sla_deadline": "2026-10-07T10:00:00Z",
        "sla_status": "On Track",
        "created_at": "2026-10-05T09:00:00Z",
        "comments": [
            {"author": "Rachel Adams", "role": "Finance", "decision": "Approved", "text": "Commercial bank rating is A+. Low default probability.", "time": "2026-10-05T11:00:00Z"}
        ],
        "history": [
            {"event": "Submitted", "actor": "Marcus Chen", "time": "2026-10-05T09:00:00Z"},
            {"event": "Level 1 Approved", "actor": "Rachel Adams", "time": "2026-10-05T11:00:00Z"}
        ],
        "attachments": ["credit_bureau_report.pdf"]
    },
    {
        "id": "appr-105",
        "workflow_id": "wf-1",
        "workflow_name": "Purchase Order Approval",
        "item_ref": "PO-2026-0889",
        "requester": "Sarah Jenkins",
        "amount": 2100.00,
        "current_level": 3,
        "total_levels": 3,
        "level_label": "Completed",
        "status": "Approved",
        "sla_deadline": "2026-10-05T18:00:00Z",
        "sla_status": "On Track",
        "created_at": "2026-10-04T10:00:00Z",
        "comments": [
            {"author": "Marcus Chen", "role": "Manager", "decision": "Approved", "text": "Approved.", "time": "2026-10-04T12:00:00Z"},
            {"author": "Rachel Adams", "role": "Finance", "decision": "Approved", "text": "Budget approved.", "time": "2026-10-04T15:30:00Z"},
            {"author": "Arthur Vance", "role": "Director", "decision": "Approved", "text": "Final approval granted.", "time": "2026-10-05T08:00:00Z"}
        ],
        "history": [
            {"event": "Submitted", "actor": "Sarah Jenkins", "time": "2026-10-04T10:00:00Z"},
            {"event": "Final Approval", "actor": "Arthur Vance", "time": "2026-10-05T08:00:00Z"}
        ],
        "attachments": ["po_manifest.pdf"]
    }
]

INITIAL_AUTOMATION_RULES = [
    {
        "id": "rule-1",
        "name": "Large Purchase Finance Routing",
        "condition_summary": "IF Purchase Amount > $5000",
        "logic": {"if": {"field": "amount", "operator": ">", "value": 5000}},
        "actions": ["Route to Finance Director", "Send Slack Alert"],
        "status": "Active",
        "triggers_count": 84
    },
    {
        "id": "rule-2",
        "name": "Auto Reorder on Depleted Stock",
        "condition_summary": "IF Inventory Quantity < Reorder Level",
        "logic": {"if": {"field": "quantity", "operator": "<", "value": "reorder_level"}},
        "actions": ["Generate Draft Purchase Order", "Notify Procurement Lead"],
        "status": "Active",
        "triggers_count": 142
    },
    {
        "id": "rule-3",
        "name": "Customer Credit Overdraft Freeze",
        "condition_summary": "IF Customer Credit Balance > Authorized Limit",
        "logic": {"if": {"field": "credit_balance", "operator": ">", "value": "credit_limit"}},
        "actions": ["Block POS Transaction", "Notify Account Manager"],
        "status": "Active",
        "triggers_count": 16
    },
    {
        "id": "rule-4",
        "name": "Supplier Reliability Guard",
        "condition_summary": "IF Supplier Rating < 3 Stars OR Lead Time > 10 Days",
        "logic": {"or": [{"field": "rating", "operator": "<", "value": 3}, {"field": "lead_time", "operator": ">", "value": 10}]},
        "actions": ["Require Manual Approval on POs", "Flag Vendor Under Review"],
        "status": "Active",
        "triggers_count": 9
    }
]

# Workflows Router
workflows_router = APIRouter(prefix="/workflows", tags=["Workflows"])

@workflows_router.get("/", response_model=List[Dict[str, Any]])
def list_workflows(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return INITIAL_WORKFLOWS

@workflows_router.post("/", response_model=Dict[str, Any])
def create_workflow(payload: Dict[str, Any] = Body(...), current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    new_id = f"wf-{len(INITIAL_WORKFLOWS) + 1}"
    payload["id"] = new_id
    payload["created_at"] = datetime.now(timezone.utc).isoformat()
    payload["executions_count"] = 0
    payload["success_rate"] = 100.0
    INITIAL_WORKFLOWS.append(payload)
    return payload

@workflows_router.put("/{workflow_id}", response_model=Dict[str, Any])
def update_workflow(workflow_id: str, payload: Dict[str, Any] = Body(...), current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    for idx, wf in enumerate(INITIAL_WORKFLOWS):
        if wf["id"] == workflow_id:
            INITIAL_WORKFLOWS[idx] = {**wf, **payload}
            return INITIAL_WORKFLOWS[idx]
    raise HTTPException(status_code=404, detail="Workflow definition not found")

@workflows_router.delete("/{workflow_id}")
def delete_workflow(workflow_id: str, current_user: User = Depends(require_roles(["Admin"]))):
    global INITIAL_WORKFLOWS
    INITIAL_WORKFLOWS = [w for w in INITIAL_WORKFLOWS if w["id"] != workflow_id]
    return {"message": "Workflow deleted successfully"}


# Approvals Router
approvals_router = APIRouter(prefix="/approvals", tags=["Approvals"])

@approvals_router.get("/", response_model=List[Dict[str, Any]])
def list_approvals(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return INITIAL_APPROVALS

class ApprovalActionPayload(BaseModel):
    action: str = Field(..., description="approve | reject | request_changes | delegate | escalate")
    comment: Optional[str] = None
    delegate_to: Optional[str] = None

@approvals_router.post("/{approval_id}/action", response_model=Dict[str, Any])
def take_approval_action(
    approval_id: str,
    payload: ApprovalActionPayload,
    current_user: User = Depends(get_current_active_user)
):
    for idx, app in enumerate(INITIAL_APPROVALS):
        if app["id"] == approval_id:
            now_iso = datetime.now(timezone.utc).isoformat()
            actor_name = current_user.full_name or current_user.username

            if payload.action == "approve":
                if app["current_level"] >= app["total_levels"]:
                    app["status"] = "Approved"
                    app["level_label"] = "Completed"
                else:
                    app["current_level"] += 1
                    app["level_label"] = f"Level {app['current_level']} Review"
                
                app["comments"].append({
                    "author": actor_name,
                    "role": current_user.role,
                    "decision": "Approved",
                    "text": payload.comment or "Approved.",
                    "time": now_iso
                })
                app["history"].append({"event": f"Level {app['current_level']} Approved", "actor": actor_name, "time": now_iso})

            elif payload.action == "reject":
                app["status"] = "Rejected"
                app["comments"].append({
                    "author": actor_name,
                    "role": current_user.role,
                    "decision": "Rejected",
                    "text": payload.comment or "Rejected.",
                    "time": now_iso
                })
                app["history"].append({"event": "Rejected", "actor": actor_name, "time": now_iso})

            elif payload.action == "request_changes":
                app["status"] = "Changes Requested"
                app["comments"].append({
                    "author": actor_name,
                    "role": current_user.role,
                    "decision": "Changes Requested",
                    "text": payload.comment or "Please revise.",
                    "time": now_iso
                })
                app["history"].append({"event": "Changes Requested", "actor": actor_name, "time": now_iso})

            elif payload.action == "escalate":
                app["sla_status"] = "Urgent"
                app["comments"].append({
                    "author": actor_name,
                    "role": current_user.role,
                    "decision": "Escalated",
                    "text": payload.comment or "Escalated to superior authority.",
                    "time": now_iso
                })
                app["history"].append({"event": "Escalated", "actor": actor_name, "time": now_iso})

            INITIAL_APPROVALS[idx] = app
            return app

    raise HTTPException(status_code=404, detail="Approval request not found")


# Automation Rules Router
automation_rules_router = APIRouter(prefix="/automation-rules", tags=["Automation Rules"])

@automation_rules_router.get("/", response_model=List[Dict[str, Any]])
def list_automation_rules(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return INITIAL_AUTOMATION_RULES

@automation_rules_router.post("/", response_model=Dict[str, Any])
def create_automation_rule(payload: Dict[str, Any] = Body(...), current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    new_id = f"rule-{len(INITIAL_AUTOMATION_RULES) + 1}"
    payload["id"] = new_id
    payload["triggers_count"] = 0
    payload["status"] = payload.get("status", "Active")
    INITIAL_AUTOMATION_RULES.append(payload)
    return payload


# Workflow Executions Router
workflow_executions_router = APIRouter(prefix="/workflow-executions", tags=["Workflow Executions"])

@workflow_executions_router.get("/", response_model=List[Dict[str, Any]])
def list_workflow_executions(current_user: User = Depends(require_roles(["Admin", "Manager"]))):
    return [
        {
            "id": "exec-101",
            "workflow_name": "Purchase Order Approval",
            "reference": "PO-2026-0892",
            "triggered_by": "Sarah Jenkins",
            "started_at": "2026-10-05T08:30:00Z",
            "status": "In Progress",
            "duration": "4h 15m",
            "steps_completed": "2 of 3"
        },
        {
            "id": "exec-102",
            "workflow_name": "Sales Discount Approval",
            "reference": "INV-DRAFT-441",
            "triggered_by": "Elena Rostova",
            "started_at": "2026-10-05T10:45:00Z",
            "status": "In Progress",
            "duration": "1h 10m",
            "steps_completed": "1 of 1"
        },
        {
            "id": "exec-103",
            "workflow_name": "Inventory Adjustment Approval",
            "reference": "ADJ-2026-034",
            "triggered_by": "David Miller",
            "started_at": "2026-10-04T16:00:00Z",
            "status": "Overdue",
            "duration": "21h 30m",
            "steps_completed": "1 of 2"
        },
        {
            "id": "exec-104",
            "workflow_name": "Purchase Order Approval",
            "reference": "PO-2026-0889",
            "triggered_by": "Sarah Jenkins",
            "started_at": "2026-10-04T10:00:00Z",
            "status": "Completed",
            "duration": "22h",
            "steps_completed": "3 of 3"
        }
    ]


# Aggregate Router for main.py integration
router = APIRouter()
router.include_router(workflows_router)
router.include_router(approvals_router)
router.include_router(automation_rules_router)
router.include_router(workflow_executions_router)
