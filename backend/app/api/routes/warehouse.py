from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/warehouse", tags=["Warehouse"])

class ReceiptCreate(BaseModel):
    po_number: str
    supplier: str
    expected_items: int
    dock_door: str

class PickCreate(BaseModel):
    order_ref: str
    priority: str
    items_to_pick: int

@router.get("/zones")
def get_zones():
    return [
        {"id": 1, "name": "Receiving", "bins": 10, "utilization": 45, "temp": "Ambient", "status": "Active"},
        {"id": 2, "name": "Bulk Storage A", "bins": 100, "utilization": 82, "temp": "Ambient", "status": "Active"},
        {"id": 3, "name": "Bulk Storage B", "bins": 100, "utilization": 95, "temp": "Ambient", "status": "Active"},
        {"id": 4, "name": "Cold Chain", "bins": 40, "utilization": 60, "temp": "-18°C", "status": "Active"},
        {"id": 5, "name": "Hazmat", "bins": 20, "utilization": 25, "temp": "Ambient", "status": "Active"},
        {"id": 6, "name": "Picking", "bins": 80, "utilization": 75, "temp": "Ambient", "status": "Active"},
        {"id": 7, "name": "Packing", "bins": 15, "utilization": 50, "temp": "Ambient", "status": "Active"},
        {"id": 8, "name": "Dispatch", "bins": 15, "utilization": 30, "temp": "Ambient", "status": "Active"}
    ]

@router.get("/bins")
def get_bins():
    return [{"bin_id": f"A{i}-R{i}-L{i}", "zone": "Bulk Storage A", "aisle": f"A{i}", "row": f"R{i}", "level": f"L{i}", "item_stored": f"ITEM-{i*10}", "capacity_pct": 50+i, "status": "Occupied"} for i in range(1, 21)]

@router.get("/receipts")
def get_receipts():
    return [{"id": i, "PO_number": f"PO-{1000+i}", "supplier": f"Supplier {i}", "expected_items": 100*i, "status": "Scheduled", "dock_door": f"D-{i}", "ETA": f"2026-10-{10+i}"} for i in range(1, 11)]

@router.post("/receipts")
def create_receipt(receipt: ReceiptCreate):
    return {"status": "success", "data": receipt.dict()}

@router.get("/picks")
def get_picks():
    return [{"id": i, "order_ref": f"ORD-{2000+i}", "items_to_pick": 10*i, "picker_name": f"Picker {i}", "priority": "High" if i%3==0 else "Normal", "status": "Pending", "wave_batch": f"W-{i}"} for i in range(1, 16)]

@router.post("/picks")
def create_pick(pick: PickCreate):
    return {"status": "success", "data": pick.dict()}

@router.get("/shipments")
def get_shipments():
    return [{"id": i, "tracking": f"TRK-{3000+i}", "carrier": "FedEx", "destination": "NY", "status": "In Transit"} for i in range(1, 11)]

@router.get("/cycle-count")
def get_cycle_count():
    return [{"id": i, "zone": "Bulk Storage A", "bin_range": f"A{i}-R{i}", "last_counted": "2026-10-01", "variance_pct": i*0.1, "status": "Pending"} for i in range(1, 6)]

@router.get("/kpis")
def get_kpis():
    return [
        {"title": "Warehouse Utilization", "value": "87.3%", "trend": "+1.2%", "trendUp": True},
        {"title": "Orders Picked Today", "value": "342", "trend": "+5%", "trendUp": True},
        {"title": "Receiving Accuracy", "value": "99.1%", "trend": "+0.1%", "trendUp": True},
        {"title": "Put-away Time", "value": "18 min", "trend": "-2 min", "trendUp": True},
        {"title": "Order Fulfillment Rate", "value": "98.7%", "trend": "+0.5%", "trendUp": True},
        {"title": "Cycle Count Accuracy", "value": "99.4%", "trend": "+0.2%", "trendUp": True},
        {"title": "Dock Door Utilization", "value": "65%", "trend": "+3%", "trendUp": True},
        {"title": "Picking Accuracy", "value": "99.8%", "trend": "+0.1%", "trendUp": True},
        {"title": "Inventory Turn", "value": "12.4", "trend": "+0.4", "trendUp": True},
        {"title": "Backorder Rate", "value": "1.2%", "trend": "-0.3%", "trendUp": True},
        {"title": "Return Rate", "value": "2.1%", "trend": "-0.5%", "trendUp": True},
        {"title": "Cost per Order", "value": "$3.45", "trend": "-$0.10", "trendUp": True}
    ]

@router.get("/analytics")
def get_analytics():
    return {
        "throughput": [{"day": f"Day {i}", "inbound": 100+i*10, "outbound": 90+i*8} for i in range(1, 8)],
        "utilization": [{"zone": "Bulk A", "used": 82}, {"zone": "Bulk B", "used": 95}, {"zone": "Cold", "used": 60}],
        "picking_accuracy": [{"day": f"Day {i}", "accuracy": 99.0+i*0.1} for i in range(1, 8)]
    }
