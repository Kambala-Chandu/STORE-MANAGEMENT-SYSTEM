from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/mobile", tags=["Mobile"])

@router.get("/sync/status")
def get_sync_status():
    return {"message": "status"}

@router.post("/sync/push")
def push_sync(data: Dict[str, Any]):
    return {"message": "pushed"}

@router.get("/sync/pull")
def pull_sync(timestamp: str = None):
    return {"message": "pulled"}

@router.get("/push-config")
def get_push_config():
    return {"message": "push-config"}

@router.get("/kpis")
def get_kpis():
    return {"message": "kpis"}
