from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.models.sales import Sale, SaleItem
from app.models.product import Product
from app.models.customer import Customer
from app.models.supplier import Supplier
from app.schemas.dashboard import DashboardDataOut, SalesChartPoint, TopProductOut


class DashboardService:
    @staticmethod
    def get_stats(db: Session) -> DashboardDataOut:
        now = datetime.now(timezone.utc)
        today_start = datetime(now.year, now.month, now.day)

        # Today's Sales
        today_sales_query = db.query(
            func.coalesce(func.sum(Sale.total_amount), 0.0),
            func.count(Sale.id)
        ).filter(Sale.created_at >= today_start, Sale.status == "Completed").first()
        today_sales = float(today_sales_query[0]) if today_sales_query else 0.0
        today_orders = int(today_sales_query[1]) if today_sales_query else 0

        # Lifetime Sales
        all_sales_query = db.query(
            func.coalesce(func.sum(Sale.total_amount), 0.0),
            func.count(Sale.id)
        ).filter(Sale.status == "Completed").first()
        total_revenue = float(all_sales_query[0]) if all_sales_query else 0.0
        total_orders = int(all_sales_query[1]) if all_sales_query else 0

        # Counts
        total_products = db.query(Product).filter(Product.is_active == True).count()
        low_stock_count = db.query(Product).filter(Product.quantity <= Product.reorder_level, Product.is_active == True).count()
        total_customers = db.query(Customer).filter(Customer.is_active == True).count()
        total_suppliers = db.query(Supplier).filter(Supplier.is_active == True).count()

        # Last 7 Days Trend
        seven_days_ago = today_start - timedelta(days=6)
        sales_by_day = db.query(
            func.date(Sale.created_at).label("sale_date"),
            func.coalesce(func.sum(Sale.total_amount), 0.0).label("revenue"),
            func.count(Sale.id).label("orders")
        ).filter(
            Sale.created_at >= seven_days_ago,
            Sale.status == "Completed"
        ).group_by(func.date(Sale.created_at)).all()

        date_map = {str(r.sale_date): (float(r.revenue), int(r.orders)) for r in sales_by_day}
        sales_trend = []
        for i in range(7):
            day = (seven_days_ago + timedelta(days=i)).strftime("%Y-%m-%d")
            rev, ords = date_map.get(day, (0.0, 0))
            sales_trend.append(SalesChartPoint(date=day, revenue=rev, orders=ords))

        # Top 5 Selling Products
        top_items = db.query(
            SaleItem.product_id,
            SaleItem.product_name,
            func.sum(SaleItem.quantity).label("units_sold"),
            func.sum(SaleItem.subtotal).label("revenue")
        ).join(Sale, Sale.id == SaleItem.sale_id).filter(
            Sale.status == "Completed"
        ).group_by(SaleItem.product_id, SaleItem.product_name).order_by(desc("units_sold")).limit(5).all()

        top_products = []
        for r in top_items:
            prod = db.query(Product).filter(Product.id == r.product_id).first()
            sku = prod.sku if prod else f"PRD-{r.product_id}"
            top_products.append(
                TopProductOut(
                    id=r.product_id,
                    name=r.product_name,
                    sku=sku,
                    units_sold=int(r.units_sold),
                    revenue=float(r.revenue)
                )
            )

        return DashboardDataOut(
            today_sales=today_sales,
            today_orders=today_orders,
            total_revenue=total_revenue,
            total_orders=total_orders,
            total_products=total_products,
            low_stock_count=low_stock_count,
            total_customers=total_customers,
            total_suppliers=total_suppliers,
            sales_trend=sales_trend,
            top_products=top_products
        )


dashboard_service = DashboardService()
