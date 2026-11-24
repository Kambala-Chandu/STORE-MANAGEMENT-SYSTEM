export const multiCompanyService = {
  getCompanies: async () => {
    return [
      { id: 1, name: "StoreHub Retail LLC", country: "US", currency: "USD", fiscal_year: "Jan-Dec", status: "Active", revenue_ytd: 15000000, branches_count: 5 },
      { id: 2, name: "StoreHub Distribution Ltd", country: "UK", currency: "GBP", fiscal_year: "Apr-Mar", status: "Active", revenue_ytd: 8000000, branches_count: 3 },
      { id: 3, name: "StoreHub International FZE", country: "AE", currency: "AED", fiscal_year: "Jan-Dec", status: "Active", revenue_ytd: 5400000, branches_count: 3 }
    ];
  },
  getIntercompanyTransactions: async () => {
    return [
      { id: 1, from_company: "StoreHub Distribution Ltd", to_company: "StoreHub Retail LLC", type: "Product Transfer", amount: 150000, currency: "USD", date: "2024-05-10", status: "Completed" },
      { id: 2, from_company: "StoreHub Retail LLC", to_company: "StoreHub International FZE", type: "Service Fee", amount: 25000, currency: "USD", date: "2024-06-15", status: "Pending" }
    ];
  },
  getConsolidatedFinancials: async () => {
    return {
      income_statement: [
        { item: "Revenue", amount: 28400000 },
        { item: "Cost of Goods Sold", amount: 14200000 },
        { item: "Gross Profit", amount: 14200000 },
        { item: "Operating Expenses", amount: 8000000 },
        { item: "Net Income", amount: 6200000 }
      ],
      balance_sheet: [
        { item: "Total Assets", amount: 45000000 },
        { item: "Total Liabilities", amount: 20000000 },
        { item: "Total Equity", amount: 25000000 }
      ]
    };
  },
  getBranchPerformance: async () => {
    return [
      { id: 1, name: "NY Flagship", company: "StoreHub Retail LLC", city: "New York", revenue: 5000000, employees: 45, status: "Active" },
      { id: 2, name: "London Hub", company: "StoreHub Distribution Ltd", city: "London", revenue: 4000000, employees: 35, status: "Active" }
    ];
  },
  get12MultiCompanyKPIs: async () => {
    return [
      { label: "Total Companies", value: "3", trend: "+1", trendUp: true },
      { label: "Total Branches", value: "11", trend: "+2", trendUp: true },
      { label: "Intercompany Vol", value: "$4.2M", trend: "+5%", trendUp: true },
      { label: "Group Revenue", value: "$28.4M", trend: "+12%", trendUp: true },
      { label: "Consolidation Status", value: "Complete", trend: "0", trendUp: true },
      { label: "Avg Rev / Company", value: "$9.4M", trend: "+3%", trendUp: true },
      { label: "New Branches", value: "2", trend: "+1", trendUp: true },
      { label: "Cross-Border Tax", value: "$1.2M", trend: "-2%", trendUp: false },
      { label: "Transfer Pricing Apps", value: "8", trend: "+1", trendUp: true },
      { label: "Eliminations", value: "$3.5M", trend: "+4%", trendUp: true },
      { label: "Net Assets", value: "$25M", trend: "+8%", trendUp: true },
      { label: "Global Employees", value: "340", trend: "+15", trendUp: true }
    ];
  },
  getMultiCompanyAnalytics: async () => {
    return {
      revenueByCompany: [
        { name: "Retail LLC", revenue: 15 },
        { name: "Distribution Ltd", revenue: 8 },
        { name: "Intl FZE", revenue: 5.4 }
      ],
      branchPerformance: [
        { name: "Jan", ny: 400, london: 300 },
        { name: "Feb", ny: 450, london: 320 }
      ],
      intercompanyTrend: [
        { name: "Q1", volume: 1.2 },
        { name: "Q2", volume: 1.5 },
        { name: "Q3", volume: 1.0 },
        { name: "Q4", volume: 1.8 }
      ]
    };
  },
  switchActiveCompany: (companyId) => {
    localStorage.setItem("activeCompany", companyId);
  }
};
