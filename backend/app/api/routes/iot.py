from fastapi import APIRouter

router = APIRouter(prefix="/iot", tags=["IoT"])

@router.get("/devices")
def get_devices():
    return [{"device_id": f"DEV-{i:04d}", "name": f"Sensor {i}"} for i in range(1, 31)]

@router.get("/sensors/readings")
def get_sensor_readings():
    return [{"timestamp": "2023-10-01T12:00:00Z", "temperature": 22, "humidity": 45}]

@router.get("/alerts")
def get_alerts():
    return [{"alert_id": "ALT-1", "device": "DEV-0001", "severity": "Critical", "message": "Temp high", "timestamp": "2023-10-01T12:00:00Z", "acknowledged": False}]

@router.put("/alerts/{id}/acknowledge")
def acknowledge_alert(id: str):
    return {"status": "acknowledged", "alert_id": id}

@router.get("/device-health")
def get_device_health():
    return {"online": 95, "offline": 3, "warning": 2}

@router.get("/kpis")
def get_kpis():
    return {
        "Connected Devices": "247",
        "Online Rate": "98.4%",
        "Active Alerts": "7",
        "Avg Response Time": "42ms",
        "Data Points/Hour": "18.4K",
        "Sensor Accuracy": "99.7%"
    }

@router.get("/analytics")
def get_analytics():
    return {"uptime_trend": [], "alert_frequency": [], "data_throughput": []}
