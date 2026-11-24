import apiClient from '../api/client';

const STORAGE_CUST360_KEY = 'storehub_crm_customers_360';
const STORAGE_LEADS_KEY = 'storehub_crm_leads';
const STORAGE_OPPS_KEY = 'storehub_crm_opportunities';
const STORAGE_CONTACTS_KEY = 'storehub_crm_contacts';
const STORAGE_ACTIVITIES_KEY = 'storehub_crm_activities';
const STORAGE_TICKETS_KEY = 'storehub_crm_tickets';
const STORAGE_CAMPAIGNS_KEY = 'storehub_crm_campaigns';
const STORAGE_LOYALTY_KEY = 'storehub_crm_loyalty';

const SEED_CUSTOMERS_360 = [
  {
    id: 'cust-360-1',
    customer_code: 'CUST-8001',
    name: 'Acme Logistics Global',
    type: 'B2B Commercial',
    industry: 'Freight & Transportation',
    email: 'procurement@acmelogistics.com',
    phone: '+1 (555) 349-8800',
    tier: 'Platinum Enterprise',
    status: 'Active VIP',
    lifetime_value: 148500.00,
    total_orders: 42,
    loyalty_points: 14850,
    credit_limit: 50000.00,
    assigned_rep: 'Sarah Jenkins',
    last_order_date: '2026-10-02',
    address: '400 Harbor Blvd, Jersey City, NJ',
    recent_purchases: [
      { order_id: 'ORD-2026-9912', date: '2026-10-02', amount: 14500.00, items: 'Conveyor Sortation Scanner Terminals' },
      { order_id: 'ORD-2026-8819', date: '2026-08-15', amount: 8900.00, items: 'Thermal Barcode Labels & Ribbons' },
      { order_id: 'ORD-2026-7241', date: '2026-06-10', amount: 21400.00, items: 'Rugged Handheld Android Terminals' }
    ],
    timeline: [
      { date: '2026-10-02', type: 'Order Placed', summary: 'B2B bulk purchase $14,500.00 processed via ACH' },
      { date: '2026-09-28', type: 'Account Review', summary: 'Quarterly enterprise contract renewal call with VP Logistics' },
      { date: '2026-09-15', type: 'Support Ticket', summary: 'Firmware calibration inquiry resolved by Lead Support' }
    ]
  },
  {
    id: 'cust-360-2',
    customer_code: 'CUST-8002',
    name: 'Summit Hardware Network',
    type: 'Retail Chain Wholesale',
    industry: 'Home Improvement & Retail',
    email: 'purchasing@summithardware.com',
    phone: '+1 (555) 712-4411',
    tier: 'Gold Wholesale',
    status: 'Active',
    lifetime_value: 84200.00,
    total_orders: 28,
    loyalty_points: 8420,
    credit_limit: 25000.00,
    assigned_rep: 'Lucas Vance',
    last_order_date: '2026-09-22',
    address: '150 Industrial Road, Allentown, PA',
    recent_purchases: [
      { order_id: 'ORD-2026-9193', date: '2026-09-22', amount: 3420.00, items: 'Receipt Printers & Dual Cash Drawers' },
      { order_id: 'ORD-2026-8410', date: '2026-07-19', amount: 7200.00, items: 'Omnidirectional Countertop Scanners' }
    ],
    timeline: [
      { date: '2026-09-22', type: 'Order Placed', summary: 'Store POS equipment renewal $3,420.00 shipped' },
      { date: '2026-09-10', type: 'Sales Call', summary: 'Quarterly store opening pipeline discussion' }
    ]
  },
  {
    id: 'cust-360-3',
    customer_code: 'CUST-8003',
    name: 'Apex Distribution Group',
    type: 'B2B Enterprise',
    industry: 'Warehousing & 3PL Logistics',
    email: 'finance@apexgroup.com',
    phone: '+1 (555) 890-3321',
    tier: 'Diamond Strategic',
    status: 'High Touch Account',
    lifetime_value: 210000.00,
    total_orders: 65,
    loyalty_points: 21000,
    credit_limit: 60000.00,
    assigned_rep: 'Elena Rostova',
    last_order_date: '2026-09-18',
    address: '88 Logistics Parkway, Columbus, OH',
    recent_purchases: [
      { order_id: 'ORD-2026-8901', date: '2026-09-18', amount: 12400.00, items: 'Sortation Automated Scanners' },
      { order_id: 'ORD-2026-7811', date: '2026-05-24', amount: 31200.00, items: 'Core Warehouse Network Gateway Hubs' }
    ],
    timeline: [
      { date: '2026-09-30', type: 'Support Escalation', summary: 'Firmware upgrade consultation for scanner gateways' },
      { date: '2026-09-18', type: 'Order Placed', summary: 'Direct shipment delivered to Central Columbus Hub' }
    ]
  }
];

const SEED_LEADS = [
  {
    id: 'lead-101',
    name: 'Jonathan Vance',
    company: 'Metro Retail Partners LLC',
    title: 'VP Store Operations',
    email: 'jvance@metroretail.com',
    phone: '+1 (555) 412-9901',
    source: 'In-Store POS Demo',
    status: 'Qualified',
    score: 92,
    assigned_to: 'Elena Rostova',
    estimated_value: 45000.00,
    created_date: '2026-09-25',
    notes: 'Looking to upgrade 15 store registers to StoreHub Enterprise POS.'
  },
  {
    id: 'lead-102',
    name: 'Claire Beaumont',
    company: 'Horizon Freightways International',
    title: 'Director of Material Logistics',
    email: 'c.beaumont@horizonfreight.com',
    phone: '+1 (555) 623-1188',
    source: 'Website Demo Request',
    status: 'Contacted',
    score: 84,
    assigned_to: 'Marcus Chen',
    estimated_value: 68000.00,
    created_date: '2026-10-01',
    notes: 'Warehouse inventory tracking & barcode scanner hardware inquiry.'
  },
  {
    id: 'lead-103',
    name: 'Raymond Ortiz',
    company: 'Beacon Regional Marts',
    title: 'Chief Information Officer',
    email: 'rortiz@beaconmarts.com',
    phone: '+1 (555) 734-2299',
    source: 'National Retail Trade Expo',
    status: 'New Inbound',
    score: 78,
    assigned_to: 'Sarah Jenkins',
    estimated_value: 110000.00,
    created_date: '2026-10-04',
    notes: 'Met at NRF trade show; interested in full ERP + POS replacement.'
  },
  {
    id: 'lead-104',
    name: 'Sonia Patel',
    company: 'OmniFresh Grocery Chain',
    title: 'Head of Retail Procurement',
    email: 'spatel@omnifresh.com',
    phone: '+1 (555) 881-2200',
    source: 'Partner Referral',
    status: 'New Inbound',
    score: 88,
    assigned_to: 'Lucas Vance',
    estimated_value: 38000.00,
    created_date: '2026-10-05',
    notes: 'Requires dual thermal printers and touch touchscreen registers.'
  }
];

const SEED_OPPORTUNITIES = [
  {
    id: 'opp-201',
    title: 'Metro Retail 15-Store POS Rollout',
    account: 'Metro Retail Partners LLC',
    stage: 'Proposal Sent',
    amount: 45000.00,
    probability: 75,
    expected_revenue: 33750.00,
    close_date: '2026-11-15',
    assigned_rep: 'Elena Rostova',
    type: 'New Business',
    next_step: 'Executive proposal review meeting on Oct 14'
  },
  {
    id: 'opp-202',
    title: 'Horizon Freight Warehouse Scanners',
    account: 'Horizon Freightways International',
    stage: 'Negotiation',
    amount: 68000.00,
    probability: 85,
    expected_revenue: 57800.00,
    close_date: '2026-10-28',
    assigned_rep: 'Marcus Chen',
    type: 'New Business',
    next_step: 'Procurement contract legal review'
  },
  {
    id: 'opp-203',
    title: 'Beacon Regional Marts ERP Migration',
    account: 'Beacon Regional Marts',
    stage: 'Qualification',
    amount: 110000.00,
    probability: 40,
    expected_revenue: 44000.00,
    close_date: '2026-12-10',
    assigned_rep: 'Sarah Jenkins',
    type: 'Enterprise Expansion',
    next_step: 'Technical architectural walkthrough'
  },
  {
    id: 'opp-204',
    title: 'Acme Logistics Q4 Hardware Expansion',
    account: 'Acme Logistics Global',
    stage: 'Closed Won',
    amount: 35000.00,
    probability: 100,
    expected_revenue: 35000.00,
    close_date: '2026-10-02',
    assigned_rep: 'Sarah Jenkins',
    type: 'Account Expansion',
    next_step: 'Order fulfilled and in production'
  }
];

const SEED_CONTACTS = [
  {
    id: 'con-1',
    name: 'Arthur Pendelton',
    title: 'Director of Store Systems',
    company: 'Summit Hardware Network',
    email: 'a.pendelton@summithardware.com',
    phone: '+1 (555) 712-4412',
    role: 'Decision Maker',
    influence: 'High'
  },
  {
    id: 'con-2',
    name: 'Gregory House',
    title: 'VP Operations & Supply',
    company: 'Acme Logistics Global',
    email: 'ghouse@acmelogistics.com',
    phone: '+1 (555) 349-8805',
    role: 'Executive Sponsor',
    influence: 'High'
  },
  {
    id: 'con-3',
    name: 'Linda Sterling',
    title: 'Chief Logistics Engineer',
    company: 'Apex Distribution Group',
    email: 'lsterling@apexgroup.com',
    phone: '+1 (555) 890-3329',
    role: 'Technical Evaluator',
    influence: 'Medium'
  }
];

const SEED_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'Meeting',
    title: 'Q4 Contract Renewal Review',
    counterparty: 'Acme Logistics Global',
    owner: 'Sarah Jenkins',
    due_date: '2026-10-08 14:00',
    status: 'Scheduled',
    notes: 'Virtual conference to finalize multi-year SLA support terms.'
  },
  {
    id: 'act-2',
    type: 'Call',
    title: 'Discovery Follow-up on POS Terminal Specs',
    counterparty: 'Metro Retail Partners LLC',
    owner: 'Elena Rostova',
    due_date: '2026-10-06 10:30',
    status: 'Pending',
    notes: 'Confirming barcode scanner optic resolution and Bluetooth cradle requirements.'
  },
  {
    id: 'act-3',
    type: 'Task',
    title: 'Dispatch Custom Quote & Pricing Sheet',
    counterparty: 'Horizon Freightways International',
    owner: 'Marcus Chen',
    due_date: '2026-10-07 17:00',
    status: 'In Progress',
    notes: 'Generate discounted tier quotation for 40 units.'
  }
];

const SEED_TICKETS = [
  {
    id: 'tkt-501',
    ticket_number: 'TKT-2026-1089',
    customer: 'Summit Hardware Network',
    contact: 'Arthur Pendelton',
    subject: 'POS Cash Drawer Kick Signal Intermittent Delay',
    category: 'Hardware Peripheral',
    priority: 'High',
    status: 'In Progress',
    assigned_agent: 'Lucas Vance',
    created_at: '2026-10-05 08:30',
    sla_target_hours: 4,
    sla_remaining_minutes: 110,
    sla_breached: false
  },
  {
    id: 'tkt-502',
    ticket_number: 'TKT-2026-1085',
    customer: 'Apex Distribution Group',
    contact: 'Linda Sterling',
    subject: 'Firmware Version 4.2 Scanner Calibration Inconsistency',
    category: 'Software & Firmware',
    priority: 'Urgent',
    status: 'Escalated',
    assigned_agent: 'Marcus Chen',
    created_at: '2026-10-04 16:45',
    sla_target_hours: 2,
    sla_remaining_minutes: 25,
    sla_breached: false
  },
  {
    id: 'tkt-503',
    ticket_number: 'TKT-2026-1078',
    customer: 'Acme Logistics Global',
    contact: 'Gregory House',
    subject: 'Invoice PDF Reconciliation Discrepancy',
    category: 'Billing & Invoicing',
    priority: 'Medium',
    status: 'Resolved',
    assigned_agent: 'Amina Diallo',
    created_at: '2026-10-03 11:20',
    sla_target_hours: 8,
    sla_remaining_minutes: 0,
    sla_breached: false
  }
];

const SEED_CAMPAIGNS = [
  {
    id: 'camp-301',
    name: 'Q4 Commercial Hardware Refresh Promo',
    channel: 'Email & Direct Outreach',
    segment: 'Tier-1 B2B Wholesalers',
    status: 'Active',
    budget: 5000.00,
    spent: 3850.00,
    revenue_generated: 52400.00,
    roi: '1,261%',
    recipients: 1250,
    open_rate: '42.8%',
    click_rate: '18.4%'
  },
  {
    id: 'camp-302',
    name: 'Retail Store VIP Double Points Weekend',
    channel: 'SMS & App Push',
    segment: 'Active Gold & Platinum Retail Shoppers',
    status: 'Active',
    budget: 2500.00,
    spent: 1900.00,
    revenue_generated: 28900.00,
    roi: '1,421%',
    recipients: 4800,
    open_rate: '89.2%',
    click_rate: '31.5%'
  },
  {
    id: 'camp-303',
    name: 'Inbound POS Software Switcher Campaign',
    channel: 'Search & LinkedIn Ads',
    segment: 'SMB Multi-Store Owners',
    status: 'Completed',
    budget: 8000.00,
    spent: 8000.00,
    revenue_generated: 84000.00,
    roi: '950%',
    recipients: 15000,
    open_rate: '24.1%',
    click_rate: '6.8%'
  }
];

const SEED_LOYALTY = {
  total_members: 3450,
  points_issued_total: 485000,
  points_redeemed_total: 312000,
  outstanding_liability: 17300.00,
  tiers: [
    { name: 'Bronze Entry', min_spend: 0, multiplier: '1.0x', members: 2100, color: 'text-amber-600' },
    { name: 'Silver Preferred', min_spend: 1000, multiplier: '1.25x', members: 850, color: 'text-slate-300' },
    { name: 'Gold VIP', min_spend: 5000, multiplier: '1.5x', members: 380, color: 'text-amber-400' },
    { name: 'Platinum Enterprise', min_spend: 20000, multiplier: '2.0x', members: 120, color: 'text-cyan-400' }
  ],
  active_coupons: [
    { code: 'VIPFALL20', discount: '20% Off Peripherals', expires: '2026-11-30', uses: 142 },
    { code: 'BULKSHIPFREE', discount: 'Free Freight on Orders > $2,000', expires: '2026-12-31', uses: 89 }
  ]
};

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

export const crmService = {
  // 1. CUSTOMER 360
  async getCustomers360(params = {}) {
    try {
      const res = await apiClient.get('/crm/customers-360/', { params });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_CUST360_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_CUST360_KEY, SEED_CUSTOMERS_360);
  },

  async getCustomer360(id) {
    const list = await this.getCustomers360();
    return list.find(c => c.id === id || c.customer_code === id);
  },

  // 2. LEADS
  async getLeads(params = {}) {
    try {
      const res = await apiClient.get('/crm/leads/', { params });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_LEADS_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_LEADS_KEY, SEED_LEADS);
  },

  async createLead(payload) {
    const lead = {
      ...payload,
      id: `lead-${Date.now()}`,
      created_date: new Date().toISOString().slice(0, 10),
      score: payload.score || 80
    };
    try {
      await apiClient.post('/crm/leads/', lead);
    } catch {}
    const list = getStorage(STORAGE_LEADS_KEY, SEED_LEADS);
    const updated = [lead, ...list];
    setStorage(STORAGE_LEADS_KEY, updated);
    return lead;
  },

  // 3. OPPORTUNITIES
  async getOpportunities() {
    try {
      const res = await apiClient.get('/crm/opportunities/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_OPPS_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_OPPS_KEY, SEED_OPPORTUNITIES);
  },

  async createOpportunity(payload) {
    const opp = {
      ...payload,
      id: `opp-${Date.now()}`,
      expected_revenue: (Number(payload.amount || 0) * Number(payload.probability || 50)) / 100
    };
    try {
      await apiClient.post('/crm/opportunities/', opp);
    } catch {}
    const list = getStorage(STORAGE_OPPS_KEY, SEED_OPPORTUNITIES);
    const updated = [opp, ...list];
    setStorage(STORAGE_OPPS_KEY, updated);
    return opp;
  },

  async updateOpportunityStage(id, stage) {
    const list = getStorage(STORAGE_OPPS_KEY, SEED_OPPORTUNITIES);
    const updated = list.map(o => o.id === id ? { ...o, stage } : o);
    setStorage(STORAGE_OPPS_KEY, updated);
    return updated.find(o => o.id === id);
  },

  // 4. CONTACTS
  getContacts() {
    return getStorage(STORAGE_CONTACTS_KEY, SEED_CONTACTS);
  },

  // 5. ACTIVITIES
  getActivities() {
    return getStorage(STORAGE_ACTIVITIES_KEY, SEED_ACTIVITIES);
  },

  logActivity(payload) {
    const act = {
      ...payload,
      id: `act-${Date.now()}`
    };
    const list = getStorage(STORAGE_ACTIVITIES_KEY, SEED_ACTIVITIES);
    const updated = [act, ...list];
    setStorage(STORAGE_ACTIVITIES_KEY, updated);
    return act;
  },

  // 6. SUPPORT TICKETS
  async getSupportTickets(params = {}) {
    try {
      const res = await apiClient.get('/crm/tickets/', { params });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_TICKETS_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_TICKETS_KEY, SEED_TICKETS);
  },

  async createSupportTicket(payload) {
    const tkt = {
      ...payload,
      id: `tkt-${Date.now()}`,
      ticket_number: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'In Progress',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sla_target_hours: 4,
      sla_remaining_minutes: 240,
      sla_breached: false
    };
    try {
      await apiClient.post('/crm/tickets/', tkt);
    } catch {}
    const list = getStorage(STORAGE_TICKETS_KEY, SEED_TICKETS);
    const updated = [tkt, ...list];
    setStorage(STORAGE_TICKETS_KEY, updated);
    return tkt;
  },

  resolveSupportTicket(id) {
    const list = getStorage(STORAGE_TICKETS_KEY, SEED_TICKETS);
    const updated = list.map(t => t.id === id ? { ...t, status: 'Resolved' } : t);
    setStorage(STORAGE_TICKETS_KEY, updated);
    return updated.find(t => t.id === id);
  },

  // 7. CAMPAIGNS
  async getCampaigns() {
    try {
      const res = await apiClient.get('/crm/campaigns/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_CAMPAIGNS_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_CAMPAIGNS_KEY, SEED_CAMPAIGNS);
  },

  createCampaign(payload) {
    const camp = {
      ...payload,
      id: `camp-${Date.now()}`,
      spent: 0,
      revenue_generated: 0,
      roi: '0%',
      open_rate: '0%',
      click_rate: '0%'
    };
    const list = getStorage(STORAGE_CAMPAIGNS_KEY, SEED_CAMPAIGNS);
    const updated = [camp, ...list];
    setStorage(STORAGE_CAMPAIGNS_KEY, updated);
    return camp;
  },

  // 8. LOYALTY
  async getLoyaltySummary() {
    try {
      const res = await apiClient.get('/crm/loyalty/');
      if (res.data) {
        setStorage(STORAGE_LOYALTY_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_LOYALTY_KEY, SEED_LOYALTY);
  },

  // 9. COMMUNICATIONS
  getCommunications(customerId) {
    return [
      { id: 'comm-1', type: 'Email', subject: 'Re: Enterprise Tier-1 Volume Pricing', date: '2026-10-04 11:20', sender: 'Sarah Jenkins', recipient: 'Arthur Pendelton', body: 'Attached the revised pricing structure reflecting the 15-terminal volume discount.' },
      { id: 'comm-2', type: 'SMS', subject: 'Shipment Dispatch Alert', date: '2026-10-02 09:15', sender: 'StoreHub Automated', recipient: '+1 (555) 349-8800', body: 'Order #ORD-2026-9912 is out for freight delivery via FastLine Freight.' },
      { id: 'comm-3', type: 'Internal Note', subject: 'Credit Limit Review Recommendation', date: '2026-09-28 16:30', sender: 'Amina Diallo', recipient: 'Internal Team', body: 'Customer payment history flawless for 12 months. Recommend increasing credit line from $50k to $75k.' }
    ];
  },

  // 10. 12 CRM EXECUTIVE KPIS
  get12CRMKPIs() {
    return {
      activeLeads: { title: 'Qualified Leads', value: '48 Leads', delta: '+14% MoM', tone: 'primary', subtitle: 'Active outbound pipeline' },
      openOpportunities: { title: 'Pipeline Deals', value: '26 Deals', delta: '78% high probability', tone: 'info', subtitle: 'Weighted pipeline' },
      conversionRate: { title: 'Lead Conversion', value: '34.2%', delta: '+2.8% pts', tone: 'success', subtitle: 'Lead-to-deal ratio' },
      activeCustomers: { title: 'Active Accounts', value: '1,240 Accounts', delta: '+8 new B2B', tone: 'primary', subtitle: 'B2B & Wholesale' },
      lifetimeValue: { title: 'Avg Customer LTV', value: '$84,500.00', delta: '+12.5% YoY', tone: 'success', subtitle: 'Retention expansion' },
      pipelineRevenue: { title: 'Weighted Forecast', value: '$170,550.00', delta: 'Q4 Expected', tone: 'info', subtitle: 'Probability-weighted' },
      averageDealSize: { title: 'Average Deal Size', value: '$48,500.00', delta: '+6.4% YoY', tone: 'primary', subtitle: 'Enterprise average' },
      customerChurn: { title: 'Gross Churn Rate', value: '3.8%', delta: '-1.1% reduction', tone: 'success', subtitle: 'Industry benchmark: 6.5%' },
      netPromoterScore: { title: 'Net Promoter Score', value: '76 NPS', delta: 'World-class (>70)', tone: 'success', subtitle: 'Verified CSAT surveys' },
      slaCompliance: { title: 'SLA Resolution Rate', value: '98.4%', delta: 'Under 4h average', tone: 'success', subtitle: 'Support desk tickets' },
      marketingROI: { title: 'Marketing ROI', value: '1,260%', delta: 'Q3 Attributed', tone: 'success', subtitle: 'Omnichannel campaigns' },
      retentionRate: { title: 'Account Retention', value: '96.2%', delta: 'Net revenue retention', tone: 'primary', subtitle: 'Annualized renewals' }
    };
  },

  // 11. CRM ANALYTICS DATA (Recharts)
  getCRMAnalytics() {
    return {
      salesFunnel: [
        { stage: 'Prospecting / Inbound', count: 140, value: 840000 },
        { stage: 'Qualified Leads', count: 85, value: 510000 },
        { stage: 'Proposal / Demo', count: 48, value: 288000 },
        { stage: 'Negotiation', count: 26, value: 170550 },
        { stage: 'Closed Won', count: 18, value: 124000 }
      ],
      leadSources: [
        { name: 'In-Store POS Referrals', value: 38 },
        { name: 'Website Demo Requests', value: 28 },
        { name: 'National Retail Trade Shows', value: 20 },
        { name: 'Partner Ecosystem', value: 14 }
      ],
      monthlyRevenueForecast: [
        { month: 'Jul', actual: 98000, forecast: 95000 },
        { month: 'Aug', actual: 112000, forecast: 108000 },
        { month: 'Sep', actual: 124000, forecast: 120000 },
        { month: 'Oct', actual: 65000, forecast: 135000 },
        { month: 'Nov', actual: 0, forecast: 148000 },
        { month: 'Dec', actual: 0, forecast: 160000 }
      ],
      churnAndRetention: [
        { month: 'May', retention: 95.8, churn: 4.2 },
        { month: 'Jun', retention: 96.1, churn: 3.9 },
        { month: 'Jul', retention: 96.0, churn: 4.0 },
        { month: 'Aug', retention: 96.4, churn: 3.6 },
        { month: 'Sep', retention: 96.2, churn: 3.8 }
      ]
    };
  }
};
