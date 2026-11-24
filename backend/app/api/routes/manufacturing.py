from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/manufacturing", tags=["Manufacturing"])

@router.get("/bom")
async def get_boms():
    return [
        {"id": "BOM-1001", "name": "Premium Leather Sofa", "version": "v1.2", "components_count": 45, "yield_pct": 98.5, "standard_cost": 450.00},
        {"id": "BOM-1002", "name": "Oak Dining Table", "version": "v2.0", "components_count": 12, "yield_pct": 95.0, "standard_cost": 210.50}
    ]

@router.post("/bom")
async def create_bom(bom: Dict[str, Any]):
    return {"status": "success", "message": "BOM created", "data": bom}

@router.get("/production-orders")
async def get_production_orders():
    return [
        {"order_number": "PO-2023-001", "product": "Premium Leather Sofa", "planned_qty": 50, "actual_qty": 20, "status": "In Progress", "work_center": "Assembly Line A", "start_date": "2023-10-01", "end_date": "2023-10-15", "priority": "High"},
    ]

@router.post("/production-orders")
async def create_production_order(order: Dict[str, Any]):
    return {"status": "success", "message": "Production order created", "data": order}

@router.get("/work-centers")
async def get_work_centers():
    return [
        {"name": "Assembly Line A", "type": "Assembly", "capacity_hours": 160, "utilization_pct": 85.5, "status": "Active"},
    ]

@router.get("/capacity-plan")
async def get_capacity_plan():
    return [
        {"week": "W41", "capacity": 1000, "actual_load": 850},
        {"week": "W42", "capacity": 1000, "actual_load": 950},
    ]

@router.get("/mrp-run")
async def get_mrp_run():
    return [
        {"item": "Leather Hide (Black)", "required_qty": 500, "on_hand": 200, "to_order": 300, "lead_days": 14},
    ]

@router.get("/analytics")
async def get_analytics():
    return {
        "production_trend": [{"month": "Jan", "volume": 3200}],
        "oee_trend": [{"month": "Jan", "oee": 85.2}],
        "scrap_trend": [{"product": "Sofa", "rate": 2.1}]
    }

@router.get("/kpis")
async def get_kpis():
    return [
        {"label": "OEE", "value": "87.4", "unit": "%", "trend": "+1.2%", "trendDir": "up"},
        {"label": "Production Volume", "value": "4,280", "unit": "units", "trend": "+5.4%", "trendDir": "up"},
        {"label": "Scrap Rate", "value": "2.1", "unit": "%", "trend": "-0.3%", "trendDir": "down"},
        {"label": "Machine Utilization", "value": "91.3", "unit": "%", "trend": "+2.1%", "trendDir": "up"},
        {"label": "On-Time Delivery", "value": "96.8", "unit": "%", "trend": "+1.1%", "trendDir": "up"},
        {"label": "Yield", "value": "98.5", "unit": "%", "trend": "+0.5%", "trendDir": "up"},
        {"label": "Maintenance Costs", "value": "12.4", "unit": "k", "trend": "-2.1%", "trendDir": "down"},
        {"label": "Labor Efficiency", "value": "94.2", "unit": "%", "trend": "+1.4%", "trendDir": "up"},
        {"label": "Inventory Turnover", "value": "8.5", "unit": "x", "trend": "+0.2%", "trendDir": "up"},
        {"label": "Defect Rate", "value": "1.2", "unit": "%", "trend": "-0.1%", "trendDir": "down"},
        {"label": "Cycle Time", "value": "42", "unit": "mins", "trend": "-3 mins", "trendDir": "down"},
        {"label": "First Pass Yield", "value": "95.5", "unit": "%", "trend": "+0.8%", "trendDir": "up"},
    ]
