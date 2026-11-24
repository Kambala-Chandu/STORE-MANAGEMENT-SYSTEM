from fastapi import APIRouter

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.get("/register")
def get_register():
    return [{"asset_id": f"AST-{i:04d}", "name": f"Asset {i}", "category": "Machinery", "location": "Plant 1", "purchase_cost": 5000, "current_value": 4000, "status": "Active"} for i in range(25)]

@router.post("/register")
def create_register(data: dict):
    return {"status": "created"}

@router.get("/maintenance-orders")
def get_orders():
    return [{"order_id": f"MO-{i}", "type": "Preventive", "asset": f"Asset {i}", "technician": "John Doe", "status": "Pending"} for i in range(20)]

@router.post("/maintenance-orders")
def create_order(data: dict):
    return {"status": "created"}

@router.get("/calendar")
def get_calendar():
    return []

@router.get("/depreciation")
def get_depreciation():
    return []

@router.get("/kpis")
def get_kpis():
    return [
        {"title": "Asset Utilization", "value": "84.2%"},
        {"title": "MTBF", "value": "1,840 hrs"},
        {"title": "MTTR", "value": "3.2 hrs"},
        {"title": "Preventive Compliance", "value": "97.3%"},
        {"title": "Asset OEE", "value": "79.8%"},
        {"title": "Warranty Coverage", "value": "68.4%"},
        {"title": "Maint Cost/Value", "value": "1.2%"},
        {"title": "Downtime Rate", "value": "2.5%"},
        {"title": "Schedule Adherence", "value": "91%"},
        {"title": "Calibration Pass", "value": "98%"},
        {"title": "Spare Parts Turn", "value": "4.2x"},
        {"title": "Scrap Rate", "value": "0.4%"}
    ]

@router.get("/analytics")
def get_analytics():
    return {}
