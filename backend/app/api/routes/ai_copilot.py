from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter(prefix="/ai-copilot", tags=["AI Copilot"])

class ChatMessage(BaseModel):
    message: str

@router.post("/chat")
def chat(chat_message: ChatMessage):
    time.sleep(0.8)
    msg = chat_message.message.lower()
    if "inventory" in msg or "stock" in msg:
        response = "Inventory levels are optimal. 3 items at risk of stockout."
    elif "sales" in msg or "revenue" in msg:
        response = "Sales are up 12% this week. Revenue forecast looks strong."
    elif "hr" in msg or "employee" in msg or "payroll" in msg:
        response = "No payroll anomalies detected. 2 employees approaching overtime limit."
    elif "supplier" in msg or "vendor" in msg:
        response = "Supplier deliveries are 95% on-time this month."
    elif "finance" in msg or "budget" in msg:
        response = "Budget utilization is at 45% for Q3. No immediate concerns."
    else:
        response = "I am your enterprise AI copilot. How can I assist you with StoreHub ERP today?"
    
    return {"response": response, "confidence": 98.5, "sources": ["ERP Database"], "suggestions": ["Show details", "Generate report"]}

@router.get("/insights")
def get_insights():
    return [{"type": "Anomaly", "description": "Sales spike in region A", "impact": "High", "recommended_action": "Review stock", "confidence_pct": 92}]

@router.get("/recommendations")
def get_recommendations():
    return [{"module": "Inventory", "priority": "High", "description": "Reorder SKU-123", "potential_impact": "Prevent stockout"}]

@router.get("/anomalies")
def get_anomalies():
    return [{"module": "Sales", "description": "Unusual transaction volume", "detected_at": "2023-10-01T12:00:00Z", "severity": "High", "status": "New"}]

@router.get("/forecasts")
def get_forecasts():
    return {"revenue": [], "inventory": [], "demand": []}

@router.get("/kpis")
def get_kpis():
    return {
        "Insights Generated": "1,847",
        "Anomalies Detected": "23",
        "Forecast Accuracy": "91.4%",
        "Recommendations Accepted": "78.3%",
        "Cost Savings Identified": "$124K",
        "Risk Items Flagged": "7"
    }
