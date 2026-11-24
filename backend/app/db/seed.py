import sys
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.db.database import SessionLocal, engine
from app.db.base import Base
import app.models
from app.models.user import User
from app.models.category import Category
from app.models.supplier import Supplier
from app.models.customer import Customer
from app.models.product import Product
from app.models.inventory import InventoryMovement
from app.models.sales import Sale, SaleItem
from app.models.purchase import Purchase, PurchaseItem
from app.core.config import settings
from app.core.security import get_password_hash


def seed_database():
    if not settings.SEED_DEMO_DATA:
        print("Demo seeding is disabled. Set SEED_DEMO_DATA=True to enable it.")
        return

    print("Creating all tables in MySQL...")
    Base.metadata.create_all(bind=engine)
    print("Tables verified.")

    db: Session = SessionLocal()
    try:
        # 1. Seed Users
        users_data = [
            {
                "full_name": "System Administrator",
                "username": "admin",
                "email": "admin@store.com",
                "password": get_password_hash("Admin@123"),
                "role": "Admin",
                "is_active": True
            },
            {
                "full_name": "Store Manager",
                "username": "manager",
                "email": "manager@store.com",
                "password": get_password_hash("Manager@123"),
                "role": "Manager",
                "is_active": True
            },
            {
                "full_name": "Lead Cashier",
                "username": "cashier",
                "email": "cashier@store.com",
                "password": get_password_hash("Cashier@123"),
                "role": "Cashier",
                "is_active": True
            }
        ]

        created_demo_users = {}
        admin_user = None

        for u in users_data:
            conflict = db.query(User).filter(
                (User.username == u["username"]) | (User.email == u["email"])
            ).first()
            if conflict:
                print(f"Skipped user: {u['username']} (username or email already exists)")
                continue

            new_user = User(**u)
            db.add(new_user)
            db.flush()
            created_demo_users[u["username"]] = new_user

            if u["role"] == "Admin":
                admin_user = new_user

            print(f"Created user: {u['username']} ({u['role']})")

        # 2. Seed Categories
        categories_data = [
            {"name": "Electronics", "description": "Computers, gadgets, and electronic accessories"},
            {"name": "Groceries", "description": "Daily food staples, snacks, and fresh packaged items"},
            {"name": "Beverages", "description": "Soft drinks, juices, coffee, and packaged teas"},
            {"name": "Personal Care", "description": "Hygiene, soaps, shampoos, and cosmetic goods"},
            {"name": "Stationery", "description": "Office supplies, notebooks, pens, and paper products"}
        ]

        cat_map = {}
        for c in categories_data:
            cat = db.query(Category).filter(Category.name == c["name"]).first()
            if not cat:
                cat = Category(**c)
                db.add(cat)
                db.flush()
                print(f"Created category: {c['name']}")
            cat_map[c["name"]] = cat.id

        # 3. Seed Suppliers
        suppliers_data = [
            {"name": "Global Tech Distributors", "contact_name": "Alex Mercer", "email": "sales@globaltech.com", "phone": "+1-800-555-0101", "city": "New York"},
            {"name": "Fresh Farms Wholesale", "contact_name": "Sarah Jenkins", "email": "orders@freshfarms.com", "phone": "+1-800-555-0102", "city": "Chicago"},
            {"name": "Prime Beverage Corp", "contact_name": "David Ross", "email": "supply@primebev.com", "phone": "+1-800-555-0103", "city": "Atlanta"},
            {"name": "Apex Office Supplies", "contact_name": "Elena Rostova", "email": "info@apexoffice.com", "phone": "+1-800-555-0104", "city": "Seattle"}
        ]

        supp_map = {}
        for s in suppliers_data:
            supp = db.query(Supplier).filter(Supplier.name == s["name"]).first()
            if not supp:
                supp = Supplier(**s)
                db.add(supp)
                db.flush()
                print(f"Created supplier: {s['name']}")
            supp_map[s["name"]] = supp.id

        # 4. Seed Customers
        customers_data = [
            {"name": "John Doe", "email": "john.doe@gmail.com", "phone": "+1-555-0145", "address": "123 Oak Street", "loyalty_points": 120},
            {"name": "Alice Smith", "email": "alice.smith@yahoo.com", "phone": "+1-555-0146", "address": "456 Maple Ave", "loyalty_points": 85},
            {"name": "Robert Brown", "email": "rbrown@outlook.com", "phone": "+1-555-0147", "address": "789 Pine Road", "loyalty_points": 45},
            {"name": "Emily Davis", "email": "emily.davis@gmail.com", "phone": "+1-555-0148", "address": "321 Cedar Blvd", "loyalty_points": 210}
        ]

        cust_map = {}
        for cust_in in customers_data:
            cust = db.query(Customer).filter(Customer.phone == cust_in["phone"]).first()
            if not cust:
                cust = Customer(**cust_in)
                db.add(cust)
                db.flush()
                print(f"Created customer: {cust_in['name']}")
            cust_map[cust_in["name"]] = cust.id

        # 5. Seed Products
        products_data = [
            {
                "sku": "ELE-1001",
                "barcode": "890123450001",
                "name": "Wireless Ergonomic Mouse",
                "description": "2.4GHz USB wireless optical mouse with silent click",
                "category_id": cat_map.get("Electronics"),
                "supplier_id": supp_map.get("Global Tech Distributors"),
                "cost_price": 12.50,
                "selling_price": 24.99,
                "quantity": 45,
                "reorder_level": 10,
                "unit": "pcs"
            },
            {
                "sku": "ELE-1002",
                "barcode": "890123450002",
                "name": "Mechanical Gaming Keyboard",
                "description": "RGB Backlit blue-switch mechanical gaming keyboard",
                "category_id": cat_map.get("Electronics"),
                "supplier_id": supp_map.get("Global Tech Distributors"),
                "cost_price": 32.00,
                "selling_price": 59.99,
                "quantity": 28,
                "reorder_level": 8,
                "unit": "pcs"
            },
            {
                "sku": "ELE-1003",
                "barcode": "890123450003",
                "name": "USB-C Fast Charging Cable 2M",
                "description": "60W nylon braided fast charging and sync cable",
                "category_id": cat_map.get("Electronics"),
                "supplier_id": supp_map.get("Global Tech Distributors"),
                "cost_price": 3.20,
                "selling_price": 9.99,
                "quantity": 85,
                "reorder_level": 15,
                "unit": "pcs"
            },
            {
                "sku": "GRO-2001",
                "barcode": "890123450004",
                "name": "Organic Almonds 500g",
                "description": "Raw unpasteurized premium California almonds",
                "category_id": cat_map.get("Groceries"),
                "supplier_id": supp_map.get("Fresh Farms Wholesale"),
                "cost_price": 6.50,
                "selling_price": 11.99,
                "quantity": 60,
                "reorder_level": 12,
                "unit": "pack"
            },
            {
                "sku": "GRO-2002",
                "barcode": "890123450005",
                "name": "Extra Virgin Olive Oil 1L",
                "description": "Cold pressed Mediterranean pure olive oil",
                "category_id": cat_map.get("Groceries"),
                "supplier_id": supp_map.get("Fresh Farms Wholesale"),
                "cost_price": 9.00,
                "selling_price": 16.50,
                "quantity": 4,  # LOW STOCK
                "reorder_level": 10,
                "unit": "bottle"
            },
            {
                "sku": "BEV-3001",
                "barcode": "890123450006",
                "name": "Sparkling Mineral Water 500ml",
                "description": "Natural sparkling spring water, zero calories",
                "category_id": cat_map.get("Beverages"),
                "supplier_id": supp_map.get("Prime Beverage Corp"),
                "cost_price": 0.65,
                "selling_price": 1.99,
                "quantity": 120,
                "reorder_level": 25,
                "unit": "bottle"
            },
            {
                "sku": "BEV-3002",
                "barcode": "890123450007",
                "name": "Artisan Colombian Coffee Beans 1kg",
                "description": "Medium dark roast single-origin whole bean coffee",
                "category_id": cat_map.get("Beverages"),
                "supplier_id": supp_map.get("Prime Beverage Corp"),
                "cost_price": 11.50,
                "selling_price": 22.00,
                "quantity": 5,  # LOW STOCK
                "reorder_level": 10,
                "unit": "bag"
            },
            {
                "sku": "STA-4001",
                "barcode": "890123450008",
                "name": "Executive Hardcover Notebook A5",
                "description": "192 numbered pages 100gsm acid-free paper",
                "category_id": cat_map.get("Stationery"),
                "supplier_id": supp_map.get("Apex Office Supplies"),
                "cost_price": 4.00,
                "selling_price": 8.50,
                "quantity": 50,
                "reorder_level": 10,
                "unit": "pcs"
            }
        ]

        prod_map = {}
        for p in products_data:
            prod = db.query(Product).filter(Product.sku == p["sku"]).first()
            if not prod:
                prod = Product(**p)
                db.add(prod)
                db.flush()
                # Log initial movement
                mov = InventoryMovement(
                    product_id=prod.id,
                    movement_type="IN",
                    quantity=prod.quantity,
                    unit_cost=prod.cost_price,
                    reference_id="SEED_INITIAL",
                    reference_type="MANUAL",
                    notes="Initial system seed stock",
                    user_id=admin_user.id if admin_user else None
                )
                db.add(mov)
                print(f"Created product: {p['name']} ({p['sku']}) - Stock: {p['quantity']}")
            prod_map[p["sku"]] = prod

        # 6. Seed Sample Historical Sales for Analytics
        existing_sales = db.query(Sale).count()
        if existing_sales == 0 and len(prod_map) > 0:
            print("Seeding sample sales data for dashboard charts...")
            now = datetime.now(timezone.utc)
            cashier_user = created_demo_users.get("cashier") or admin_user
            john = db.query(Customer).filter(Customer.name == "John Doe").first()
            alice = db.query(Customer).filter(Customer.name == "Alice Smith").first()

            p_mouse = prod_map.get("ELE-1001")
            p_cable = prod_map.get("ELE-1003")
            p_water = prod_map.get("BEV-3001")
            p_coffee = prod_map.get("BEV-3002")

            sample_sales = [
                (now - timedelta(days=5), john, [(p_mouse, 2), (p_cable, 1)], "Card", 0.0, 5.0),
                (now - timedelta(days=4), alice, [(p_coffee, 1), (p_water, 4)], "Cash", 2.0, 5.0),
                (now - timedelta(days=3), None, [(p_cable, 3)], "UPI", 0.0, 0.0),
                (now - timedelta(days=2), john, [(p_mouse, 1), (p_coffee, 1)], "Card", 0.0, 5.0),
                (now - timedelta(days=1), alice, [(p_water, 6), (p_cable, 2)], "Cash", 0.0, 5.0),
                (now, None, [(p_mouse, 1), (p_cable, 1), (p_water, 2)], "UPI", 0.0, 5.0),
            ]

            for idx, (s_date, s_cust, items, p_method, disc, tax_pct) in enumerate(sample_sales, start=1):
                inv_num = f"INV-{s_date.strftime('%Y%m%d')}-000{idx}"
                subtotal = 0.0
                sale_items = []
                for prd, qty in items:
                    if prd:
                        item_sub = prd.selling_price * qty
                        subtotal += item_sub
                        sale_items.append(
                            SaleItem(
                                product_id=prd.id,
                                product_name=prd.name,
                                quantity=qty,
                                unit_price=prd.selling_price,
                                cost_price=prd.cost_price,
                                subtotal=item_sub
                            )
                        )
                tax_amt = round((subtotal - disc) * (tax_pct / 100.0), 2)
                total = round((subtotal - disc) + tax_amt, 2)

                db_sale = Sale(
                    invoice_number=inv_num,
                    customer_id=s_cust.id if s_cust else None,
                    user_id=cashier_user.id if cashier_user else None,
                    subtotal=subtotal,
                    discount=disc,
                    tax_rate=tax_pct,
                    tax_amount=tax_amt,
                    total_amount=total,
                    payment_method=p_method,
                    status="Completed",
                    notes="Sample seeded transaction",
                    created_at=s_date
                )
                db.add(db_sale)
                db.flush()

                for si in sale_items:
                    si.sale_id = db_sale.id
                    db.add(si)

        db.commit()
        print("\n=== DATABASE SEEDED SUCCESSFULLY ===")
        print("Demo Credentials:")
        print("  - Admin:   admin   / Admin@123")
        print("  - Manager: manager / Manager@123")
        print("  - Cashier: cashier / Cashier@123")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
