from typing import List, Optional
from pydantic import BaseModel


class SalesChartPoint(BaseModel):
    date: str
    revenue: float
    orders: int


class TopProductOut(BaseModel):
    id: int
    name: str
    sku: str
    units_sold: int
    revenue: float


class DashboardDataOut(BaseModel):
    today_sales: float
    today_orders: int
    total_revenue: float
    total_orders: int
    total_products: int
    low_stock_count: int
    total_customers: int
    total_suppliers: int
    sales_trend: List[SalesChartPoint]
    top_products: List[TopProductOut]
