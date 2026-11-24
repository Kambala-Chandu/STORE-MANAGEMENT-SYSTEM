from datetime import date
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.sales import Sale, SaleItem
from app.models.product import Product
from app.schemas.reports import SalesReportOut, SalesReportItem, ProfitLossOut, InventoryValuationOut


class ReportService:
    @staticmethod
    def get_sales_report(
        db: Session,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> SalesReportOut:
        if start_date and end_date and start_date > end_date:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="start_date must be on or before end_date"
            )
        query = db.query(Sale).filter(Sale.status == "Completed")
        if start_date:
            query = query.filter(func.date(Sale.created_at) >= start_date)
        if end_date:
            query = query.filter(func.date(Sale.created_at) <= end_date)

        sales = query.order_by(Sale.created_at.asc()).all()

        total_orders = len(sales)
        total_gross = sum(s.subtotal for s in sales)
        total_disc = sum(s.discount for s in sales)
        total_net = sum(s.subtotal - s.discount for s in sales)
        total_tx = sum(s.tax_amount for s in sales)

        # Group by day
        day_map = {}
        for s in sales:
            day_str = s.created_at.strftime("%Y-%m-%d")
            if day_str not in day_map:
                day_map[day_str] = {
                    "orders": 0,
                    "gross": 0.0,
                    "discount": 0.0,
                    "net": 0.0,
                    "tax": 0.0
                }
            day_map[day_str]["orders"] += 1
            day_map[day_str]["gross"] += s.subtotal
            day_map[day_str]["discount"] += s.discount
            day_map[day_str]["net"] += s.subtotal - s.discount
            day_map[day_str]["tax"] += s.tax_amount

        breakdown = []
        for d, vals in sorted(day_map.items()):
            breakdown.append(
                SalesReportItem(
                    date=d,
                    orders_count=vals["orders"],
                    gross_sales=round(vals["gross"], 2),
                    discounts=round(vals["discount"], 2),
                    net_sales=round(vals["net"], 2),
                    tax_collected=round(vals["tax"], 2)
                )
            )

        return SalesReportOut(
            total_orders=total_orders,
            total_gross_sales=round(total_gross, 2),
            total_discounts=round(total_disc, 2),
            total_net_sales=round(total_net, 2),
            total_tax=round(total_tx, 2),
            breakdown=breakdown
        )

    @staticmethod
    def get_profit_loss(
        db: Session,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> ProfitLossOut:
        if start_date and end_date and start_date > end_date:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="start_date must be on or before end_date"
            )
        query = db.query(SaleItem).join(Sale, Sale.id == SaleItem.sale_id).filter(Sale.status == "Completed")
        if start_date:
            query = query.filter(func.date(Sale.created_at) >= start_date)
        if end_date:
            query = query.filter(func.date(Sale.created_at) <= end_date)

        items = query.all()
        sales = db.query(Sale).filter(Sale.status == "Completed")
        if start_date:
            sales = sales.filter(func.date(Sale.created_at) >= start_date)
        if end_date:
            sales = sales.filter(func.date(Sale.created_at) <= end_date)
        total_revenue = sum(s.subtotal - s.discount for s in sales.all())
        total_cogs = sum(it.quantity * it.cost_price for it in items)
        gross_profit = total_revenue - total_cogs
        margin = (gross_profit / total_revenue * 100.0) if total_revenue > 0 else 0.0

        return ProfitLossOut(
            total_revenue=round(total_revenue, 2),
            total_cogs=round(total_cogs, 2),
            gross_profit=round(gross_profit, 2),
            profit_margin_percent=round(margin, 2)
        )

    @staticmethod
    def get_inventory_valuation(db: Session) -> InventoryValuationOut:
        products = db.query(Product).filter(Product.is_active == True).all()
        total_items = len(products)
        total_units = sum(p.quantity for p in products)
        total_cost = sum(p.quantity * p.cost_price for p in products)
        total_retail = sum(p.quantity * p.selling_price for p in products)
        profit = total_retail - total_cost

        return InventoryValuationOut(
            total_items_count=total_items,
            total_units=total_units,
            total_cost_value=round(total_cost, 2),
            total_retail_value=round(total_retail, 2),
            potential_profit=round(profit, 2)
        )


report_service = ReportService()
