from fastapi import APIRouter

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("/folders")
def get_folders(): return {"data": ["HR", "Finance", "Legal", "Contracts", "Quality", "Operations", "IT"]}

@router.get("/documents")
def get_documents(): return {"data": []}

@router.post("/documents")
def create_document(): return {"status": "success"}

@router.get("/{id}/versions")
def get_versions(id: str): return {"data": []}

@router.get("/search")
def search(): return {"data": []}

@router.get("/kpis")
def get_kpis():
    return {
        "total_documents": 14832,
        "storage_used": "847 GB",
        "pending_approvals": 23,
        "ocr_processed_today": 156,
        "avg_retrieval_time": "1.2s",
        "compliance_score": "98.4%"
    }

@router.get("/analytics")
def get_analytics(): return {"data": []}
