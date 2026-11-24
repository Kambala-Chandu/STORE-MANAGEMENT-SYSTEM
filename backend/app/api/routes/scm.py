from fastapi import APIRouter

router = APIRouter(prefix="/scm", tags=["SCM"])

@router.get("/demand-forecast")
def get_demand_forecast():
    return [{"month": f"2023-{i:02d}", "forecast": 100+i*10, "actual": 95+i*11} for i in range(1,13)]

@router.get("/supply-plan")
def get_supply_plan():
    return [{"supplier": "Sup A", "category": "Cat A", "planned_qty": 1000, "confirmed_qty": 900, "eta": "2023-11-01"}] * 10

@router.get("/shipment-tracking")
def get_shipment_tracking():
    return [{"tracking_id": f"TRK-{i:04d}", "carrier": "DHL", "status": "In Transit", "eta": "2023-10-31"} for i in range(20)]

@router.get("/supplier-risk")
def get_supplier_risk():
    return [{"supplier": f"Supplier {i}", "risk_level": "Low", "factors": ["Financial"], "mitigation": "Monitored"} for i in range(10)]

@router.get("/inventory-optimization")
def get_inventory_optimization():
    return [{"item": f"Item {i}", "stock": 100, "reorder_point": 50, "suggested_qty": 200, "supplier": f"Sup {i}", "lead_days": 10} for i in range(15)]

@router.get("/kpis")
def get_kpis():
    return [
        {"title": "Forecast Accuracy", "value": "91.2%"},
        {"title": "OTIF", "value": "94.7%"},
        {"title": "Supply Chain Cost/Unit", "value": "$2.84"},
        {"title": "Supplier Lead Time", "value": "8.3 days avg"},
        {"title": "Inventory Turnover", "value": "12.4x"},
        {"title": "Perfect Order Rate", "value": "97.1%"},
        {"title": "Order Fulfillment Cycle", "value": "3.5 Days"},
        {"title": "Warehousing Cost", "value": "$1.2M"},
        {"title": "Backorder Rate", "value": "2.1%"},
        {"title": "Supplier OTD", "value": "95.5%"},
        {"title": "Return Rate", "value": "1.8%"},
        {"title": "Procurement ROI", "value": "22%"}
    ]

@router.get("/analytics")
def get_analytics():
    return {"accuracy_trend": [], "cost_trend": [], "otif_trend": []}
