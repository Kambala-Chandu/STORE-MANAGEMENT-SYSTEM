import apiClient from '../api/client';

const STORAGE_ACCOUNTS_KEY = 'storehub_fin_accounts';
const STORAGE_JOURNALS_KEY = 'storehub_fin_journals';
const STORAGE_BILLS_KEY = 'storehub_fin_bills';
const STORAGE_INVOICES_KEY = 'storehub_fin_invoices';
const STORAGE_BUDGETS_KEY = 'storehub_fin_budgets';
const STORAGE_CASH_KEY = 'storehub_fin_cash';
const STORAGE_EXPENSES_KEY = 'storehub_fin_expenses';
const STORAGE_COST_CENTERS_KEY = 'storehub_fin_cost_centers';

// Initial pre-seeded accounts
const SEED_ACCOUNTS = [
  { id: 'acc-1010', code: '1010', name: 'Cash on Hand (Vault)', category: 'Assets', subCategory: 'Cash', type: 'Debit', balance: 48250.00, status: 'Active' },
  { id: 'acc-1020', code: '1020', name: 'Operating Checking (JPMorgan)', category: 'Assets', subCategory: 'Bank', type: 'Debit', balance: 420800.00, status: 'Active' },
  { id: 'acc-1030', code: '1030', name: 'Payroll Reserve (Wells Fargo)', category: 'Assets', subCategory: 'Bank', type: 'Debit', balance: 173750.00, status: 'Active' },
  { id: 'acc-1100', code: '1100', name: 'Accounts Receivable (Trade)', category: 'Assets', subCategory: 'Current Assets', type: 'Debit', balance: 318400.00, status: 'Active' },
  { id: 'acc-1200', code: '1200', name: 'Merchandise Inventory Ledger', category: 'Assets', subCategory: 'Inventory', type: 'Debit', balance: 1120450.00, status: 'Active' },
  { id: 'acc-1500', code: '1500', name: 'Warehouse Fixtures & POS Equipment', category: 'Assets', subCategory: 'Fixed Assets', type: 'Debit', balance: 345000.00, status: 'Active' },
  { id: 'acc-1590', code: '1590', name: 'Accumulated Depreciation', category: 'Assets', subCategory: 'Fixed Assets', type: 'Credit', balance: -68000.00, status: 'Active' },
  { id: 'acc-2010', code: '2010', name: 'Accounts Payable (Trade Vendors)', category: 'Liabilities', subCategory: 'Current Liabilities', type: 'Credit', balance: 242500.00, status: 'Active' },
  { id: 'acc-2050', code: '2050', name: 'Accrued Payroll & Bonuses', category: 'Liabilities', subCategory: 'Current Liabilities', type: 'Credit', balance: 64200.00, status: 'Active' },
  { id: 'acc-2100', code: '2100', name: 'Sales Tax & VAT Payable', category: 'Liabilities', subCategory: 'Current Liabilities', type: 'Credit', balance: 38400.00, status: 'Active' },
  { id: 'acc-2500', code: '2500', name: 'Long-Term Commercial Bank Note', category: 'Liabilities', subCategory: 'Long Term Liabilities', type: 'Credit', balance: 500000.00, status: 'Active' },
  { id: 'acc-3010', code: '3010', name: 'Common Stock Capital', category: 'Equity', subCategory: 'Equity', type: 'Credit', balance: 500000.00, status: 'Active' },
  { id: 'acc-3050', code: '3050', name: 'Retained Earnings', category: 'Equity', subCategory: 'Equity', type: 'Credit', balance: 574550.00, status: 'Active' },
  { id: 'acc-4010', code: '4010', name: 'Retail POS Sales Revenue', category: 'Revenue', subCategory: 'Revenue', type: 'Credit', balance: 1420800.00, status: 'Active' },
  { id: 'acc-4020', code: '4020', name: 'Wholesale Commercial B2B Sales', category: 'Revenue', subCategory: 'Revenue', type: 'Credit', balance: 1030000.00, status: 'Active' },
  { id: 'acc-5010', code: '5010', name: 'Cost of Goods Sold (COGS)', category: 'Expenses', subCategory: 'Expenses', type: 'Debit', balance: 1568520.00, status: 'Active' },
  { id: 'acc-6010', code: '6010', name: 'Warehouse Logistics & Freight', category: 'Expenses', subCategory: 'Expenses', type: 'Debit', balance: 164200.00, status: 'Active' },
  { id: 'acc-6020', code: '6020', name: 'Retail Operations & Store Salaries', category: 'Expenses', subCategory: 'Expenses', type: 'Debit', balance: 118400.00, status: 'Active' },
  { id: 'acc-6030', code: '6030', name: 'Technology, Cloud ERP & IT', category: 'Expenses', subCategory: 'Expenses', type: 'Debit', balance: 58200.00, status: 'Active' }
];

// Pre-seeded Journal Entries
const SEED_JOURNALS = [
  {
    id: 'je-2026-081',
    entry_number: 'JE-2026-081',
    date: '2026-10-04',
    reference: 'PO-2026-0889',
    description: 'Stock delivery receipt and inventory capitalization from TechSupply Corp',
    status: 'Posted',
    created_by: 'Marcus Chen',
    total_debit: 2100.00,
    total_credit: 2100.00,
    lines: [
      { account_code: '1200', account_name: 'Merchandise Inventory Ledger', debit: 2100.00, credit: 0.0, cost_center: 'Warehouse Central' },
      { account_code: '2010', account_name: 'Accounts Payable (Trade Vendors)', debit: 0.0, credit: 2100.00, cost_center: 'Supply Chain' }
    ]
  },
  {
    id: 'je-2026-082',
    entry_number: 'JE-2026-082',
    date: '2026-10-05',
    reference: 'POS-BATCH-1005',
    description: 'Daily register collections and revenue recognition',
    status: 'Posted',
    created_by: 'Elena Rostova',
    total_debit: 18450.00,
    total_credit: 18450.00,
    lines: [
      { account_code: '1020', account_name: 'Operating Checking (JPMorgan)', debit: 14200.00, credit: 0.0, cost_center: 'Retail Operations' },
      { account_code: '1010', account_name: 'Cash on Hand (Vault)', debit: 4250.00, credit: 0.0, cost_center: 'Retail Operations' },
      { account_code: '4010', account_name: 'Retail POS Sales Revenue', debit: 0.0, credit: 17200.00, cost_center: 'Retail Operations' },
      { account_code: '2100', account_name: 'Sales Tax & VAT Payable', debit: 0.0, credit: 1250.00, cost_center: 'Compliance' }
    ]
  },
  {
    id: 'je-2026-083',
    entry_number: 'JE-2026-083',
    date: '2026-10-05',
    reference: 'ADJ-2026-034',
    description: 'Cycle count discrepancy adjustment and shrinkage write-off',
    status: 'Draft',
    created_by: 'David Miller',
    total_debit: 1420.00,
    total_credit: 1420.00,
    lines: [
      { account_code: '5010', account_name: 'Cost of Goods Sold (COGS)', debit: 1420.00, credit: 0.0, cost_center: 'Warehouse Central' },
      { account_code: '1200', account_name: 'Merchandise Inventory Ledger', debit: 0.0, credit: 1420.00, cost_center: 'Warehouse Central' }
    ]
  }
];

// Helper to access storage
function getStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
  } catch (e) {
    console.warn(`Storage read error on ${key}:`, e);
  }
  return fallback;
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Storage write error on ${key}:`, e);
  }
}

export const financeService = {
  // 1. CHART OF ACCOUNTS
  async getAccounts() {
    try {
      const res = await apiClient.get('/accounts/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_ACCOUNTS_KEY, res.data);
        return res.data;
      }
    } catch {
      // Fallback
    }
    return getStorage(STORAGE_ACCOUNTS_KEY, SEED_ACCOUNTS);
  },

  async createAccount(accData) {
    const newAcc = {
      ...accData,
      id: `acc-${accData.code || Date.now()}`,
      status: 'Active',
      balance: Number(accData.balance || 0)
    };
    try {
      await apiClient.post('/accounts/', newAcc);
    } catch {}
    const list = getStorage(STORAGE_ACCOUNTS_KEY, SEED_ACCOUNTS);
    const updated = [newAcc, ...list];
    setStorage(STORAGE_ACCOUNTS_KEY, updated);
    return newAcc;
  },

  async updateAccount(id, payload) {
    const list = getStorage(STORAGE_ACCOUNTS_KEY, SEED_ACCOUNTS);
    const updated = list.map(a => a.id === id ? { ...a, ...payload } : a);
    setStorage(STORAGE_ACCOUNTS_KEY, updated);
    return updated.find(a => a.id === id);
  },

  // 2. JOURNAL ENTRIES
  async getJournalEntries() {
    try {
      const res = await apiClient.get('/journal/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_JOURNALS_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_JOURNALS_KEY, SEED_JOURNALS);
  },

  async createJournalEntry(entry) {
    const newEntry = {
      ...entry,
      id: `je-${Date.now()}`,
      entry_number: entry.entry_number || `JE-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: entry.date || new Date().toISOString().slice(0, 10),
      status: entry.status || 'Draft'
    };
    try {
      await apiClient.post('/journal/', newEntry);
    } catch {}
    const list = getStorage(STORAGE_JOURNALS_KEY, SEED_JOURNALS);
    const updated = [newEntry, ...list];
    setStorage(STORAGE_JOURNALS_KEY, updated);
    return newEntry;
  },

  async postJournalEntry(id) {
    try {
      await apiClient.post(`/journal/${id}/post`);
    } catch {}
    const list = getStorage(STORAGE_JOURNALS_KEY, SEED_JOURNALS);
    const updated = list.map(j => j.id === id ? { ...j, status: 'Posted' } : j);
    setStorage(STORAGE_JOURNALS_KEY, updated);
    return updated.find(j => j.id === id);
  },

  async reverseJournalEntry(id, user = 'Admin') {
    try {
      const res = await apiClient.post(`/journal/${id}/reverse`);
      if (res.data?.reversed_entry) return res.data.reversed_entry;
    } catch {}
    const list = getStorage(STORAGE_JOURNALS_KEY, SEED_JOURNALS);
    const target = list.find(j => j.id === id);
    if (!target) return null;
    const revLines = target.lines.map(l => ({
      account_code: l.account_code,
      account_name: l.account_name,
      debit: l.credit || 0,
      credit: l.debit || 0,
      cost_center: l.cost_center
    }));
    const revEntry = {
      id: `je-rev-${Date.now()}`,
      entry_number: `${target.entry_number}-REV`,
      date: new Date().toISOString().slice(0, 10),
      reference: `Reversal of ${target.entry_number}`,
      description: `Automated reversal of ${target.description}`,
      status: 'Posted',
      created_by: user,
      total_debit: target.total_credit,
      total_credit: target.total_debit,
      lines: revLines
    };
    const updated = [revEntry, ...list];
    setStorage(STORAGE_JOURNALS_KEY, updated);
    return revEntry;
  },

  // 3. TRIAL BALANCE & GENERAL LEDGER
  async getTrialBalance() {
    try {
      const res = await apiClient.get('/general-ledger/trial-balance');
      if (res.data) return res.data;
    } catch {}
    const accounts = await this.getAccounts();
    let totalDebit = 0;
    let totalCredit = 0;
    const rows = accounts.map(a => {
      const isDebit = a.type === 'Debit';
      const debitVal = isDebit && a.balance >= 0 ? a.balance : 0;
      const creditVal = !isDebit && a.balance >= 0 ? a.balance : 0;
      totalDebit += debitVal;
      totalCredit += creditVal;
      return {
        code: a.code,
        name: a.name,
        category: a.category,
        subCategory: a.subCategory,
        debit: debitVal,
        credit: creditVal
      };
    });
    return {
      as_of_date: new Date().toISOString().slice(0, 10),
      accounts: rows,
      total_debit: totalDebit,
      total_credit: totalCredit,
      is_balanced: Math.abs(totalDebit - totalCredit) < 0.01
    };
  },

  // 4. ACCOUNTS PAYABLE
  async getAccountsPayable() {
    try {
      const res = await apiClient.get('/payables/');
      if (res.data) return res.data;
    } catch {}
    return [
      { id: 'bill-101', vendor: 'TechSupply International', bill_number: 'V-9921', amount: 8450.00, due_date: '2026-10-18', aging: '0-30 days', status: 'Pending', approval_status: 'Approved' },
      { id: 'bill-102', vendor: 'Industrial Thermal Label Co', bill_number: 'V-8842', amount: 4200.00, due_date: '2026-10-10', aging: '0-30 days', status: 'Pending', approval_status: 'Approved' },
      { id: 'bill-103', vendor: 'Precision Printhead Systems', bill_number: 'V-7612', amount: 3100.00, due_date: '2026-09-25', aging: '31-60 days', status: 'Overdue', approval_status: 'Approved' },
      { id: 'bill-104', vendor: 'FastLine Freight Distribution', bill_number: 'V-6110', amount: 1650.00, due_date: '2026-09-02', aging: '61-90 days', status: 'Overdue', approval_status: 'In Review' }
    ];
  },

  // 5. ACCOUNTS RECEIVABLE
  async getAccountsReceivable() {
    try {
      const res = await apiClient.get('/receivables/');
      if (res.data) return res.data;
    } catch {}
    return [
      { id: 'rec-201', customer: 'Acme Logistics Global', invoice_number: 'INV-2026-0891', amount: 14500.00, due_date: '2026-10-25', aging: '0-30 days', status: 'Current', credit_limit: 50000.00, outstanding: 14500.00 },
      { id: 'rec-202', customer: 'Summit Hardware Network', invoice_number: 'INV-2026-0840', amount: 8920.00, due_date: '2026-10-12', aging: '0-30 days', status: 'Current', credit_limit: 25000.00, outstanding: 8920.00 },
      { id: 'rec-203', customer: 'Apex Distribution Group', invoice_number: 'INV-2026-0792', amount: 12400.00, due_date: '2026-09-20', aging: '31-60 days', status: 'Overdue', credit_limit: 30000.00, outstanding: 12400.00 }
    ];
  },

  // 6. CASH & BANK MANAGEMENT
  async getCashAccounts() {
    try {
      const res = await apiClient.get('/cash/accounts');
      if (res.data) return res.data;
    } catch {}
    return [
      { id: 'bank-1', name: 'Operating Checking (JPMorgan Chase)', account_number: '****4892', balance: 420800.00, unreconciled: 2450.00, last_reconciled: '2026-10-01' },
      { id: 'bank-2', name: 'Payroll Reserve (Wells Fargo)', account_number: '****1024', balance: 173750.00, unreconciled: 0.00, last_reconciled: '2026-10-01' },
      { id: 'cash-1', name: 'Store Safe & POS Cash Vault', account_number: 'VAULT-01', balance: 48250.00, unreconciled: 150.00, last_reconciled: '2026-10-04' }
    ];
  },

  // 7. BUDGET PLANNING
  async getBudgets() {
    try {
      const res = await apiClient.get('/budgets/');
      if (res.data) return res.data;
    } catch {}
    return [
      { id: 'b-1', department: 'Supply Chain & Logistics', allocated: 480000.00, actual: 420800.00, variance: 59200.00, utilization_percent: 87.6, status: 'On Track' },
      { id: 'b-2', department: 'Retail POS Operations', allocated: 320000.00, actual: 298400.00, variance: 21600.00, utilization_percent: 93.2, status: 'On Track' },
      { id: 'b-3', department: 'Technology & Infrastructure', allocated: 180000.00, actual: 164200.00, variance: 15800.00, utilization_percent: 91.2, status: 'On Track' },
      { id: 'b-4', department: 'Executive & General Admin', allocated: 150000.00, actual: 148500.00, variance: 1500.00, utilization_percent: 99.0, status: 'Warning' }
    ];
  },

  // 8. FINANCIAL STATEMENTS
  async getFinancialStatements() {
    try {
      const res = await apiClient.get('/financial-reports/balance-sheet');
      if (res.data) return res.data;
    } catch {}
    return {
      as_of: new Date().toISOString().slice(0, 10),
      total_assets: 2341500.00,
      current_assets: 2064500.00,
      fixed_assets: 277000.00,
      total_liabilities: 845100.00,
      current_liabilities: 345100.00,
      long_term_liabilities: 500000.00,
      total_equity: 1496400.00,
      is_balanced: true
    };
  },

  // 9. TAXES
  async getTaxes() {
    try {
      const res = await apiClient.get('/taxes/summary');
      if (res.data) return res.data;
    } catch {}
    return {
      jurisdiction: 'State & Federal Consolidated',
      tax_collected_sales: 74500.00,
      tax_paid_purchases: 36100.00,
      net_tax_liability: 38400.00,
      gst_vat_rate: '8.25%',
      filing_due_date: '2026-10-31',
      status: 'Accrued'
    };
  },

  // 10. INVOICES
  async getInvoices() {
    try {
      const res = await apiClient.get('/invoices/');
      if (res.data) return res.data;
    } catch {}
    return [
      { id: 'inv-101', type: 'Customer', invoice_number: 'INV-2026-09191', partner: 'Acme Logistics Corp', amount: 2850.00, date: '2026-09-19', status: 'Paid', due_date: '2026-10-19' },
      { id: 'inv-102', type: 'Customer', invoice_number: 'INV-2026-09193', partner: 'Summit Hardware Supply', amount: 3420.00, date: '2026-09-19', status: 'Paid', due_date: '2026-10-19' },
      { id: 'inv-103', type: 'Vendor', invoice_number: 'BILL-2026-0889', partner: 'TechSupply International', amount: 2100.00, date: '2026-10-04', status: 'Approved', due_date: '2026-11-04' }
    ];
  },

  // 11. EXPENSES
  getExpenses() {
    return [
      { id: 'exp-1', claim_number: 'EXP-2026-104', employee: 'Elena Rostova', department: 'Retail Operations', category: 'POS Store Supplies', amount: 480.00, date: '2026-10-03', status: 'Approved', receipt: 'receipt_pos_supplies.pdf' },
      { id: 'exp-2', claim_number: 'EXP-2026-105', employee: 'Marcus Chen', department: 'Supply Chain', category: 'Logistics Courier', amount: 320.00, date: '2026-10-04', status: 'Approved', receipt: 'dhl_courier_slip.pdf' },
      { id: 'exp-3', claim_number: 'EXP-2026-106', employee: 'David Miller', department: 'Warehouse Operations', category: 'Equipment Maintenance', amount: 850.00, date: '2026-10-05', status: 'Pending', receipt: 'forklift_service.pdf' }
    ];
  },

  // 12. COST CENTERS
  getCostCenters() {
    return [
      { id: 'cc-1', code: 'CC-100', name: 'Retail Store Operations', manager: 'Elena Rostova', budget: 320000, spend: 298400, type: 'Department' },
      { id: 'cc-2', code: 'CC-200', name: 'Central Logistics Hub', manager: 'David Miller', budget: 480000, spend: 420800, type: 'Warehouse' },
      { id: 'cc-3', code: 'CC-300', name: 'IT Infrastructure & Cloud ERP', manager: 'Marcus Chen', budget: 180000, spend: 164200, type: 'Cost Center' },
      { id: 'cc-4', code: 'CC-400', name: 'Commercial B2B Sales Unit', manager: 'Sarah Jenkins', budget: 250000, spend: 198000, type: 'Profit Center' }
    ];
  },

  // 14. 12 FINANCE EXECUTIVE KPIS
  get12FinanceKPIs(filters = {}) {
    return {
      revenue: { title: 'Gross Revenue', value: '$2,450,800.00', delta: '+14.2%', tone: 'primary', subtitle: 'Billed sales total' },
      expenses: { title: 'Operating Expenses', value: '$485,120.00', delta: '-4.2% under', tone: 'warning', subtitle: 'OPEX spend' },
      netProfit: { title: 'Net Profit', value: '$882,280.00', delta: '+18.6%', tone: 'success', subtitle: 'EBITDA net' },
      grossProfit: { title: 'Gross Profit', value: '$1,245,600.00', delta: '+12.4%', tone: 'info', subtitle: '36.0% margin' },
      cash: { title: 'Cash on Hand', value: '$48,250.00', delta: '+1.5%', tone: 'neutral', subtitle: 'Store vault safe' },
      bankBalance: { title: 'Bank Balances', value: '$594,550.00', delta: '+8.4%', tone: 'primary', subtitle: 'JPMorgan & Wells' },
      receivables: { title: 'Accounts Receivable', value: '$318,400.00', delta: '94% current', tone: 'info', subtitle: 'Trade AR balance' },
      payables: { title: 'Accounts Payable', value: '$242,500.00', delta: '100% scheduled', tone: 'warning', subtitle: 'Trade AP balance' },
      operatingMargin: { title: 'Operating Margin', value: '36.0%', delta: '+1.4% pts', tone: 'success', subtitle: 'Healthy retention' },
      budgetUtilization: { title: 'Budget Utilization', value: '89.4%', delta: 'Under budget', tone: 'primary', subtitle: 'Fiscal control' },
      outstandingInvoices: { title: 'Outstanding Invoices', value: '$35,820.00', delta: '3 overdue', tone: 'danger', subtitle: 'Collections watch' },
      workingCapital: { title: 'Net Working Capital', value: '$1,719,400.00', delta: '2.44x ratio', tone: 'success', subtitle: 'Strong liquidity' }
    };
  },

  // 13. FINANCIAL ANALYTICS (Recharts)
  getFinancialAnalytics() {
    return {
      revenueTrend: [
        { month: 'Jan', revenue: 165000, expenses: 38000, profit: 59400 },
        { month: 'Feb', revenue: 172000, expenses: 39500, profit: 61920 },
        { month: 'Mar', revenue: 183400, expenses: 41000, profit: 66024 },
        { month: 'Apr', revenue: 194000, expenses: 42500, profit: 69840 },
        { month: 'May', revenue: 201200, expenses: 43800, profit: 72432 },
        { month: 'Jun', revenue: 203000, expenses: 44200, profit: 73080 },
        { month: 'Jul', revenue: 218400, expenses: 46500, profit: 78624 },
        { month: 'Aug', revenue: 228900, expenses: 48200, profit: 82404 },
        { month: 'Sep', revenue: 234800, expenses: 49500, profit: 84528 }
      ],
      cashFlowTrend: [
        { month: 'May', operating: 68000, investing: -12000, financing: -5000, net: 51000 },
        { month: 'Jun', operating: 72000, investing: -8000, financing: -5000, net: 59000 },
        { month: 'Jul', operating: 79000, investing: -15000, financing: -5000, net: 59000 },
        { month: 'Aug', operating: 84000, investing: -10000, financing: -5000, net: 69000 },
        { month: 'Sep', operating: 88000, investing: -14000, financing: -5000, net: 69000 }
      ],
      receivableAging: [
        { range: 'Current (0-30d)', amount: 245000, color: '#10B981' },
        { range: '31-60 Days', amount: 48000, color: '#3B82F6' },
        { range: '61-90 Days', amount: 18000, color: '#F59E0B' },
        { range: '90+ Days', amount: 7400, color: '#F43F5E' }
      ],
      payableAging: [
        { range: '0-30 Days', amount: 195000, color: '#10B981' },
        { range: '31-60 Days', amount: 35000, color: '#3B82F6' },
        { range: '61-90 Days', amount: 10500, color: '#F59E0B' },
        { range: '90+ Days', amount: 2000, color: '#F43F5E' }
      ],
      departmentSpending: [
        { dept: 'Logistics', spend: 420800, budget: 480000 },
        { dept: 'Retail POS', spend: 298400, budget: 320000 },
        { dept: 'Technology', spend: 164200, budget: 180000 },
        { dept: 'Admin/HR', spend: 148500, budget: 150000 }
      ]
    };
  }
};
