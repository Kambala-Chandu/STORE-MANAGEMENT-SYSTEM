# Store Management & POS System

A full-stack **Store Management & Point of Sale (POS) System** built with **FastAPI**, **SQLAlchemy**, **MySQL**, and **React 18 (Vite + Tailwind CSS)**. The core workflows are suitable for a local demonstration; this repository is not presented as production-ready.

---

## Features & Modules

- **Authentication & Role-Based Access Control (RBAC)**:
  - Secure password hashing with direct `bcrypt`.
  - JWT Bearer tokens with role claims (`Admin`, `Manager`, `Cashier`).
  - Protected API routes and role-guarded frontend views.
- **Point of Sale (POS) Billing**:
  - High-speed cashier checkout interface.
  - Live product search, category filtering, and barcode/SKU scanning.
  - Real-time cart calculations (Subtotal, Discount, Tax, Grand Total).
  - Customer assignment with loyalty reward points accrual.
  - Multi-payment support (Cash, Card, UPI, Credit).
  - Instant printable invoice receipts.
- **Inventory & Stock Management**:
  - Real-time stock decrement on sales checkout.
  - Low stock warning badges and filters.
  - Stock movement audit logs (IN, OUT, ADJUSTMENT, SALE, PURCHASE, DAMAGE, RESTOCK, WASTAGE).
  - Manual stock adjustments with reasons and notes.
- **Product & Category Catalog**:
  - Comprehensive Product CRUD (Name, SKU, Barcode, Pricing, Cost, Reorder Level, Unit).
  - Automatic SKU generator.
  - Category management with active product counts.
- **Suppliers & Purchase Orders (Inward Stock)**:
  - Vendor directory with contact details.
  - Create an `Ordered` purchase for later receiving or receive it immediately.
  - Received purchases update stock, cost, and inventory movements atomically and only once.
- **Customer Management**:
  - Customer registry with purchase history and loyalty points tracking.
- **Analytics Dashboard**:
  - KPI summary cards for completed sales, orders, products, low-stock alerts, and customers.
  - 7-day revenue trend interactive chart (Chart.js).
  - Top 5 selling products by volume and revenue.
- **Financial & Business Reports**:
  - Date-range filtered Net Sales reports with daily breakdown.
  - Profit & Loss statement using discount-adjusted, tax-exclusive revenue and COGS.
  - Inventory Asset Valuation (Total Units, Cost Asset Value, Retail Value, Potential Profit).
- **User Administration**:
  - Admin management panel to create users, assign roles, and toggle account activation.
- **Release scope**:
  - The version-1 application mounts only the tested core APIs by default.
  - Prototype AI, finance, HR, CRM, workflow, manufacturing, and other enterprise modules remain source-only and are not operational release features.
  - Admin-only JSON export excludes password hashes and environment secrets. JSON restore and invoice email delivery are unavailable in version 1.

---

## Demo data and accounts

Demo seeding is disabled by default (`SEED_DEMO_DATA=False`). Normal startup does not create accounts or sample business data. If seeding is explicitly enabled in a disposable local environment, existing users are preserved rather than overwritten. Never enable demo seeding against a database containing real accounts or business records.

Public registration is also disabled by default (`ENABLE_PUBLIC_REGISTRATION=False`). When deliberately enabled, it accepts only name, username, email, and password and always creates an active Cashier. Admin-managed user creation remains available to signed-in Admins.

---

## Architecture

```
Store-Management-System/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/         # Modular REST routers (auth, users, products, categories, suppliers, customers, inventory, purchases, sales, dashboard, reports)
│   │   ├── core/               # App configuration & direct-bcrypt JWT security
│   │   ├── db/                 # Database engine, session, and seed script
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic v2 schemas
│   │   ├── services/           # Business logic layer (atomic checkout, inventory logs, analytics)
│   │   └── utils/              # Invoice generator & helpers
│   ├── main.py                 # FastAPI application with CORS & lifespan seeder
│   └── requirements.txt        # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios client with JWT interceptor
│   │   ├── components/         # Layout (Navbar, Sidebar, AppLayout) and ProtectedRoute
│   │   ├── context/            # AuthContext with role helpers
│   │   ├── pages/              # React views (Login, Dashboard, POS, SalesHistory, Products, Categories, Suppliers, Customers, Inventory, Purchases, Reports, Users)
│   │   ├── App.jsx             # React Router with role guards
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## How to Run

### 1. Backend Setup (FastAPI & MySQL)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Activate your virtual environment:
   ```powershell
   .\venv\Scripts\activate
   ```
3. Install the documented dependencies when setting up a new environment:
   ```powershell
   python -m pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env`, replace every database placeholder, set a unique `SECRET_KEY` of at least 32 characters, and list explicit frontend URLs in `CORS_ORIGINS`. Do not commit `.env`. The backend intentionally has no database-password or JWT-secret fallback and refuses to start when required values are missing, weak, or still placeholders.
   - Set `ENVIRONMENT=production` only with a private JWT secret, non-fallback database credentials, `DEBUG=False`, and explicit CORS origins. Startup rejects unsafe production values and wildcard CORS.
   - Keep `ENABLE_PROTOTYPE_ROUTERS=False` for the version-1 release.
5. Create the configured empty MySQL database, ensure the configured user can access it, and apply the schema explicitly:
   ```powershell
   python -m alembic upgrade head
   ```
   Production startup never creates or alters tables. Local development startup retains automatic table creation for existing test and demonstration workflows, but migrations remain the authoritative release schema.
6. Create the first Admin once, using the interactive command below. It hides password entry and refuses to run when any Admin already exists:
   ```powershell
   python -m app.bootstrap_admin --full-name "Store Administrator" --username store_admin --email admin@example.com
   ```
7. Start the FastAPI backend server:
   ```bash
   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
8. Interactive OpenAPI documentation is available at:
   - **http://127.0.0.1:8000/docs**

Non-sensitive health endpoints are available at `/health/live` and `/health/ready`. Readiness returns only `ready` or a generic database-unavailable error; the old public `/database` probe is not exposed.

### Adopting an existing database

Do not run `alembic stamp` blindly. Stamping records a migration version without applying or validating its schema.

1. Take and verify a database-native backup outside this application.
2. Point the backend configuration at the intended database without placing credentials in `alembic.ini`.
3. Run the read-only compatibility check:
   ```powershell
   python -m app.verify_migration_baseline
   ```
4. Only if it reports an exact version-1 baseline match, record the baseline and apply later migrations:
   ```powershell
   python -m alembic stamp 0001_v1_schema_baseline
   python -m alembic upgrade head
   python -m alembic check
   ```
5. If verification reports any difference, stop. Reconcile the schema and data in a reviewed migration instead of stamping it.

For a fresh empty database, skip stamping and run only `python -m alembic upgrade head`.

### Zero-cost public demonstration deployment

This is a demonstration configuration, not a production-readiness claim. Render Free can sleep, has an ephemeral local filesystem, and provides no free interactive shell or pre-deploy job. Enzonic Free can also sleep and has limited backup retention.

#### Backend — Render Free Web Service

- Repository branch: `main`
- Root directory: `backend`
- Runtime: Python 3
- Python version: read from `backend/.python-version` (`3.13.14`)
- Build command: `pip install -r requirements.txt`
- Start command: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/health/live`
- Plan: Free; do not add a payment method for this demonstration

Configure these Render environment variables in its secret/environment settings, never in Git:

```text
ENVIRONMENT=production
DEBUG=False
SEED_DEMO_DATA=False
ENABLE_PUBLIC_REGISTRATION=False
ENABLE_PROTOTYPE_ROUTERS=False
DB_HOST=<Enzonic MySQL hostname>
DB_PORT=3306
DB_NAME=<hosted database name>
DB_USER=<hosted database user>
DB_PASSWORD=<hosted database password>
DB_SSL_ENABLED=True
DB_SSL_CA=<optional provider CA-bundle path; otherwise leave empty>
SECRET_KEY=<private random value of at least 32 characters>
CORS_ORIGINS=https://<Cloudflare Pages project>.pages.dev
```

TLS never uses an insecure verification mode. When `DB_SSL_CA` is empty, the application uses Certifi's trusted CA bundle. If Enzonic supplies a private/provider CA file, make that file available as a Render secret file and set `DB_SSL_CA` to its absolute path. The application, Alembic, readiness check, and first-Admin command all use the same verified connection factory. Production configuration refuses to start with database TLS disabled.

#### Frontend — Cloudflare Pages

- Repository branch: `main`
- Root directory: `frontend`
- Framework preset: Vite
- Build command: `npm ci && npm run build`
- Build output directory: `dist`
- Build environment variable: `VITE_API_BASE_URL=https://<Render service>.onrender.com/api/v1`

Do not add a `_redirects` file for the current static Pages deployment. Cloudflare Pages automatically treats a deployment with `index.html` and no top-level `404.html` as a single-page application, serving the root document for unmatched navigation paths.

#### Initialize a NEW empty hosted database

Render Free does not provide free shell access or pre-deploy commands. From a trusted local checkout of the same release, create a temporary local environment containing only the new hosted database configuration listed above. Do not point these commands at an existing database and do not place credentials on the command line or in Git.

1. Confirm the target database is the newly created, empty Enzonic database.
2. In Windows CMD, enter the release backend and run the guarded interactive migration helper. It disables dotenv loading, rejects local hosts, checks that the hosted database has no tables or views, displays only the target host/database, and requires an explicit confirmation before applying `upgrade head`:
   ```cmd
   cd /d E:\Store-Management-System-release\backend
   python -m app.db.migrate_new_database
   ```
3. Create the first Admin with the guarded hosted wrapper. It verifies that the database is at Alembic head, displays the target, asks for confirmation, and then delegates to the existing first-Admin bootstrap logic:
   ```cmd
   cd /d E:\Store-Management-System-release\backend
   python -m app.db.bootstrap_hosted_admin
   ```
   The **database password** is the Enzonic credential used only to connect to MySQL. The separately prompted **Admin password** is the application login password for the new Store Management System Admin. They serve different purposes and should be distinct private values. Neither is written to `.env` or printed by the helper.
4. Deploy the backend, verify `/health/live` and `/health/ready`, then deploy the frontend and test authentication and role-protected workflows.

#### File persistence limitations

- Core products, purchases, sales, invoices, inventory movements, users, and audit logs persist in MySQL.
- Invoice PDFs, report CSVs, barcode files, and JSON exports are generated in the browser and downloaded to the user's device; the backend does not retain them.
- Prototype document/image upload controls and enterprise modules are excluded from the deployed application by default. Their current upload services are simulated or browser-local and do not persist uploaded files to Render or MySQL.
- Several excluded prototype modules use browser `localStorage`. That data is device/browser-specific, is not shared between users, and is not a server-side backup.
- Render Free's local filesystem is ephemeral. No feature should rely on files written there surviving a restart, redeploy, or sleep cycle.

### Purchase retry protection

Purchase creation accepts an optional `Idempotency-Key` request header. The key is scoped to the authenticated user and the purchase-create operation:

- An identical retry returns the original purchase and does not repeat stock or inventory movements.
- Reusing a key with different request data returns HTTP 409.
- A database uniqueness constraint resolves races between requests; an application lookup alone is not treated as sufficient.
- Requests that omit the header remain backward compatible but are explicitly **not protected** from duplicate creation.
- The purchase UI generates one key per new form and retains it after a failed or uncertain submission. It rotates the key only after success or when a new purchase form is opened.
- Historical purchases retain null idempotency fields and are preserved by the migration.

---

### 2. Frontend Setup (React & Vite)

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Copy `.env.example` to `.env` and change `VITE_API_BASE_URL` only if the backend is not at the documented local address.
3. Install the locked dependencies for a reproducible setup:
   ```bash
   npm ci
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   - **http://localhost:5173**

---

## Verification commands

Backend tests use isolated SQLite databases and guard against accidental MySQL connections:

```powershell
cd backend
.\venv\Scripts\python.exe -B -m unittest discover -s tests -p "test_*.py"
```

Frontend production build:

```powershell
cd frontend
npm run build
```

Latest release-batch verification (2026-11-22):

- Combined backend suite: `Ran 60 tests in 35.044s` — `OK`.
- Fresh migration/model comparison: `No new upgrade operations detected`.
- Frontend production build: 2,404 modules transformed, completed in 20.02 seconds in an isolated copy created from `package-lock.json`.
- Isolated MySQL 8.4.9 integration suite: `Ran 8 tests in 26.936s` — `OK`. This used the server-default transaction isolation, a separately initialized temporary server, nonstandard loopback port, generated credentials, and disposable database; it did not connect to the normal MySQL service.

### Opt-in disposable MySQL integration tests

The reproducible integration suite is in `backend/tests_mysql`. It never reads the normal `.env`. It requires `SMS_MYSQL_TEST_CONFIG` to identify an explicitly disposable server:

```json
{
  "host": "127.0.0.1",
  "port": 43306,
  "database": "sms_test_generated_name",
  "user": "generated_test_user",
  "password": "generated_test_password"
}
```

The suite refuses non-loopback hosts, port 3306, and database names not beginning with `sms_test_`. It drops and recreates tables inside that disposable database, so never point it at a real database.

```powershell
cd backend
$env:SMS_MYSQL_TEST_CONFIG="C:\path\to\disposable-config.json"
python -B -m unittest tests_mysql.test_mysql_release_integrity -v
```

Coverage includes fresh migrations and model comparison, verified baseline adoption with historical data, concurrent keyed purchase creation, conflicting idempotency payloads, oversell prevention, one-time concurrent receiving, adjustments, sale voiding, and transaction rollback.

The backend tests cover fresh migrations, verified existing-schema adoption, historical data preservation, database idempotency constraints, keyed purchase retries and conflicts, production configuration rejection, opt-in public registration, first-Admin bootstrap, protected invoice verification, unavailable prototypes/restore, Admin account creation, conflict-safe demo seeding, purchase receiving, sales/inventory transactions, void behavior, permissions, reports, and server-side product search/pagination.

### Isolated browser demonstration

The browser checkpoint uses `backend/tests/browser_app.py` and `frontend/tests/browser_demo.cjs`. It requires an explicit disposable SQLite file, blocks PyMySQL connections, disables normal startup/demo seeding, and generates test-only Admin, Manager, and Cashier accounts. Playwright may be installed in a separate temporary tooling directory; it is intentionally not a project dependency.

The latest local checkpoint exercised role permissions, product creation and search, Ordered purchase receiving, POS checkout and totals, inventory adjustment movements, Admin sale voiding, report exclusion/date filtering, catalog pagination, invoice preview, and a 390px mobile viewport. All checkpoints passed with no application console errors or failed API responses. Google Fonts requests were unavailable in the isolated browser environment; local fallback fonts rendered without blocking layout.

This SQLite browser demonstration does **not** verify MySQL row locks, MySQL transaction isolation, or production concurrency.

---

## Known limitations

- Passing SQLite tests does not prove MySQL row-lock behavior under real concurrent checkout or receiving traffic.
- Unkeyed purchase-creation requests can still create duplicates; callers outside the provided UI must supply `Idempotency-Key` themselves.
- MySQL 8.4.9 was verified in one isolated local run for the documented migration and concurrent stock scenarios. Hosted-MySQL behavior, other MySQL versions/configurations, prolonged load, failure recovery, and exhaustive deadlock testing remain unverified.
- Received purchases cannot be cancelled. A stock-return/reversal workflow is not implemented.
- Invoice verification requires an authenticated active store user. Public QR verification is not part of version 1.
- Invoice email delivery and JSON restore are disabled; use print/PDF and a separately verified database-native backup process.
- Browser tokens remain in local storage; cookie-based sessions, rate limiting, token revocation, and broader operational hardening remain release follow-up work.
- The isolated Chromium workflow covers the listed core demonstration paths, but broader cross-browser, accessibility, printing, and deployment verification remains outstanding.
- Demo seeding is for disposable local data only and remains disabled by default.
- Operational monitoring, database backup/restore validation, performance testing, and a production deployment review remain necessary before production use.
