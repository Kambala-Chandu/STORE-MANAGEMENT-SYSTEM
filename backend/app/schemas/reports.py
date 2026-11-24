from typing import List
from pydantic import BaseModel


class SalesReportItem(BaseModel):
    date: str
    orders_count: int
    gross_sales: float
    discounts: float
    net_sales: float
    tax_collected: float


class SalesReportOut(BaseModel):
    total_orders: int
    total_gross_sales: float
    total_discounts: float
    total_net_sales: float
    total_tax: float
    breakdown: List[SalesReportItem]


class ProfitLossOut(BaseModel):
    total_revenue: float
    total_cogs: float
    gross_profit: float
    profit_margin_percent: float


class InventoryValuationOut(BaseModel):
    total_items_count: int
    total_units: int
    total_cost_value: float
    total_retail_value: float
    potential_profit: float
