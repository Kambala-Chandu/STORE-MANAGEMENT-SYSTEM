import apiClient from '../api/client';

const STORAGE_EMPLOYEES_KEY = 'storehub_hcm_employees';
const STORAGE_DEPARTMENTS_KEY = 'storehub_hcm_departments';
const STORAGE_ATTENDANCE_KEY = 'storehub_hcm_attendance';
const STORAGE_LEAVES_KEY = 'storehub_hcm_leaves';
const STORAGE_PAYROLL_KEY = 'storehub_hcm_payroll';
const STORAGE_JOBS_KEY = 'storehub_hcm_jobs';
const STORAGE_PERFORMANCE_KEY = 'storehub_hcm_performance';
const STORAGE_DOCS_KEY = 'storehub_hcm_docs';

const SEED_EMPLOYEES = [
  {
    id: 'emp-001',
    employee_code: 'SH-1001',
    first_name: 'Marcus',
    last_name: 'Chen',
    email: 'marcus.chen@storehub.enterprise',
    phone: '+1 (555) 234-5678',
    department: 'Supply Chain & Logistics',
    designation: 'Director of Logistics & SCM',
    employment_type: 'Full-Time',
    employment_status: 'Active',
    branch: 'Central Logistics Hub',
    join_date: '2021-03-15',
    reporting_manager: 'Sarah Jenkins',
    salary: 115000.00,
    avatar_url: '',
    emergency_contact: 'Linda Chen (+1 555-882-9912)',
    address: '452 Industrial Parkway, Newark, NJ',
    leave_balance: { annual: 14, sick: 8, casual: 4 },
    kpis: { score: 4.8, goals_completed: 12, total_goals: 12 }
  },
  {
    id: 'emp-002',
    employee_code: 'SH-1002',
    first_name: 'Elena',
    last_name: 'Rostova',
    email: 'elena.rostova@storehub.enterprise',
    phone: '+1 (555) 345-6789',
    department: 'Retail Operations',
    designation: 'Flagship Store General Manager',
    employment_type: 'Full-Time',
    employment_status: 'Active',
    branch: 'Main Flagship Store',
    join_date: '2022-01-10',
    reporting_manager: 'Sarah Jenkins',
    salary: 92000.00,
    avatar_url: '',
    emergency_contact: 'Alexei Rostov (+1 555-441-2938)',
    address: '782 Broadway Blvd, New York, NY',
    leave_balance: { annual: 10, sick: 7, casual: 3 },
    kpis: { score: 4.9, goals_completed: 15, total_goals: 15 }
  },
  {
    id: 'emp-003',
    employee_code: 'SH-1003',
    first_name: 'David',
    last_name: 'Miller',
    email: 'david.miller@storehub.enterprise',
    phone: '+1 (555) 456-7890',
    department: 'Warehouse Operations',
    designation: 'Chief Inventory Controller',
    employment_type: 'Full-Time',
    employment_status: 'Active',
    branch: 'Central Logistics Hub',
    join_date: '2022-08-01',
    reporting_manager: 'Marcus Chen',
    salary: 78000.00,
    avatar_url: '',
    emergency_contact: 'Karen Miller (+1 555-192-8823)',
    address: '12 Terminal Road, Edison, NJ',
    leave_balance: { annual: 8, sick: 10, casual: 2 },
    kpis: { score: 4.4, goals_completed: 10, total_goals: 11 }
  },
  {
    id: 'emp-004',
    employee_code: 'SH-1004',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    email: 'sarah.jenkins@storehub.enterprise',
    phone: '+1 (555) 567-8901',
    department: 'Executive Leadership',
    designation: 'Chief Operating Officer (COO)',
    employment_type: 'Full-Time',
    employment_status: 'Active',
    branch: 'HQ Corporate',
    join_date: '2019-06-01',
    reporting_manager: 'Board of Directors',
    salary: 185000.00,
    avatar_url: '',
    emergency_contact: 'Robert Jenkins (+1 555-901-4433)',
    address: '100 Park Avenue, New York, NY',
    leave_balance: { annual: 18, sick: 12, casual: 5 },
    kpis: { score: 4.9, goals_completed: 18, total_goals: 18 }
  },
  {
    id: 'emp-005',
    employee_code: 'SH-1005',
    first_name: 'Amina',
    last_name: 'Diallo',
    email: 'amina.diallo@storehub.enterprise',
    phone: '+1 (555) 678-9012',
    department: 'Finance & Accounting',
    designation: 'Senior Financial Controller',
    employment_type: 'Full-Time',
    employment_status: 'Active',
    branch: 'HQ Corporate',
    join_date: '2023-02-14',
    reporting_manager: 'Sarah Jenkins',
    salary: 105000.00,
    avatar_url: '',
    emergency_contact: 'Oumar Diallo (+1 555-321-9900)',
    address: '55 Wall Street, New York, NY',
    leave_balance: { annual: 12, sick: 6, casual: 4 },
    kpis: { score: 4.7, goals_completed: 14, total_goals: 15 }
  },
  {
    id: 'emp-006',
    employee_code: 'SH-1006',
    first_name: 'Lucas',
    last_name: 'Vance',
    email: 'lucas.vance@storehub.enterprise',
    phone: '+1 (555) 789-0123',
    department: 'Retail Operations',
    designation: 'Senior POS Cashier & Team Lead',
    employment_type: 'Full-Time',
    employment_status: 'Active',
    branch: 'Main Flagship Store',
    join_date: '2023-06-15',
    reporting_manager: 'Elena Rostova',
    salary: 48000.00,
    avatar_url: '',
    emergency_contact: 'Emma Vance (+1 555-667-1122)',
    address: '33 5th Ave, Brooklyn, NY',
    leave_balance: { annual: 6, sick: 8, casual: 1 },
    kpis: { score: 4.5, goals_completed: 9, total_goals: 10 }
  },
  {
    id: 'emp-007',
    employee_code: 'SH-1007',
    first_name: 'Chloe',
    last_name: 'Dubois',
    email: 'chloe.dubois@storehub.enterprise',
    phone: '+1 (555) 890-1234',
    department: 'Human Resources',
    designation: 'Lead People Operations Partner',
    employment_type: 'Full-Time',
    employment_status: 'Active',
    branch: 'HQ Corporate',
    join_date: '2022-11-01',
    reporting_manager: 'Sarah Jenkins',
    salary: 86000.00,
    avatar_url: '',
    emergency_contact: 'Pierre Dubois (+1 555-883-0099)',
    address: '220 West End Ave, New York, NY',
    leave_balance: { annual: 11, sick: 9, casual: 4 },
    kpis: { score: 4.8, goals_completed: 11, total_goals: 11 }
  }
];

const SEED_DEPARTMENTS = [
  {
    id: 'dept-1',
    code: 'RET-OPS',
    name: 'Retail Operations',
    head: 'Elena Rostova',
    head_count: 28,
    budget: 320000.00,
    branch: 'Main Flagship Store',
    teams: ['POS Cashiers', 'Floor Merchandisers', 'Customer Service Desk']
  },
  {
    id: 'dept-2',
    code: 'SCM-LOG',
    name: 'Supply Chain & Logistics',
    head: 'Marcus Chen',
    head_count: 34,
    budget: 480000.00,
    branch: 'Central Logistics Hub',
    teams: ['Inbound Freight', 'Order Fulfillment', 'Fleet Dispatch']
  },
  {
    id: 'dept-3',
    code: 'WH-INV',
    name: 'Warehouse Operations',
    head: 'David Miller',
    head_count: 19,
    budget: 240000.00,
    branch: 'Central Logistics Hub',
    teams: ['Forklift Operators', 'Cycle Count Specialists', 'QA Inspection']
  },
  {
    id: 'dept-4',
    code: 'FIN-ACC',
    name: 'Finance & Accounting',
    head: 'Amina Diallo',
    head_count: 8,
    budget: 180000.00,
    branch: 'HQ Corporate',
    teams: ['General Ledger', 'Accounts Payable', 'Audit & Tax Compliance']
  },
  {
    id: 'dept-5',
    code: 'HR-PEOPLE',
    name: 'Human Resources',
    head: 'Chloe Dubois',
    head_count: 6,
    budget: 140000.00,
    branch: 'HQ Corporate',
    teams: ['Talent Acquisition', 'Payroll & Benefits', 'Employee Relations']
  }
];

const SEED_ATTENDANCE = [
  {
    id: 'att-101',
    employee_code: 'SH-1001',
    employee_name: 'Marcus Chen',
    date: '2026-10-05',
    shift: 'Morning Shift (08:00 - 17:00)',
    check_in: '07:54:12',
    check_out: '17:12:00',
    hours_worked: 9.3,
    overtime_hours: 0.3,
    status: 'On Time',
    branch: 'Central Logistics Hub'
  },
  {
    id: 'att-102',
    employee_code: 'SH-1002',
    employee_name: 'Elena Rostova',
    date: '2026-10-05',
    shift: 'Retail Store (09:00 - 18:00)',
    check_in: '08:52:00',
    check_out: '18:20:45',
    hours_worked: 9.4,
    overtime_hours: 0.4,
    status: 'On Time',
    branch: 'Main Flagship Store'
  },
  {
    id: 'att-103',
    employee_code: 'SH-1003',
    employee_name: 'David Miller',
    date: '2026-10-05',
    shift: 'Morning Shift (08:00 - 17:00)',
    check_in: '08:18:30',
    check_out: '17:00:00',
    hours_worked: 8.7,
    overtime_hours: 0.0,
    status: 'Late Arrival (18m)',
    branch: 'Central Logistics Hub'
  },
  {
    id: 'att-104',
    employee_code: 'SH-1006',
    employee_name: 'Lucas Vance',
    date: '2026-10-05',
    shift: 'Retail POS (09:00 - 18:00)',
    check_in: '08:59:10',
    check_out: '18:05:00',
    hours_worked: 9.1,
    overtime_hours: 0.1,
    status: 'On Time',
    branch: 'Main Flagship Store'
  }
];

const SEED_LEAVES = [
  {
    id: 'leave-201',
    employee_code: 'SH-1003',
    employee_name: 'David Miller',
    leave_type: 'Annual Leave',
    start_date: '2026-10-12',
    end_date: '2026-10-16',
    days: 5,
    reason: 'Family vacation and personal downtime',
    status: 'Approved',
    applied_on: '2026-09-28',
    approved_by: 'Marcus Chen'
  },
  {
    id: 'leave-202',
    employee_code: 'SH-1006',
    employee_name: 'Lucas Vance',
    leave_type: 'Sick Leave',
    start_date: '2026-10-06',
    end_date: '2026-10-06',
    days: 1,
    reason: 'Dental root canal appointment',
    status: 'Pending',
    applied_on: '2026-10-04',
    approved_by: 'Pending Supervisor Review'
  },
  {
    id: 'leave-203',
    employee_code: 'SH-1002',
    employee_name: 'Elena Rostova',
    leave_type: 'Casual Leave',
    start_date: '2026-10-23',
    end_date: '2026-10-24',
    days: 2,
    reason: 'Personal family commitment',
    status: 'Approved',
    applied_on: '2026-10-01',
    approved_by: 'Sarah Jenkins'
  }
];

const SEED_PAYROLL = [
  {
    id: 'pay-2026-09',
    period: 'September 2026',
    run_date: '2026-09-30',
    total_gross: 248600.00,
    total_net: 196420.00,
    total_tax_withheld: 38400.00,
    total_benefits: 13780.00,
    employee_count: 95,
    status: 'Disbursed',
    approved_by: 'Amina Diallo'
  },
  {
    id: 'pay-2026-08',
    period: 'August 2026',
    run_date: '2026-08-31',
    total_gross: 244200.00,
    total_net: 192900.00,
    total_tax_withheld: 37600.00,
    total_benefits: 13700.00,
    employee_count: 94,
    status: 'Disbursed',
    approved_by: 'Amina Diallo'
  }
];

const SEED_JOBS = [
  {
    id: 'job-101',
    title: 'Senior POS Integration Engineer',
    department: 'Retail Technology',
    location: 'New York, NY (Hybrid)',
    openings: 2,
    applicants: 42,
    stage: 'Interviewing',
    status: 'Active',
    salary_range: '$95,000 - $125,000',
    posted_date: '2026-09-15'
  },
  {
    id: 'job-102',
    title: 'Warehouse Logistics Shift Supervisor',
    department: 'Supply Chain & Logistics',
    location: 'Edison, NJ (On-site)',
    openings: 1,
    applicants: 28,
    stage: 'Screening',
    status: 'Active',
    salary_range: '$65,000 - $80,000',
    posted_date: '2026-09-20'
  },
  {
    id: 'job-103',
    title: 'Retail Customer Experience Specialist',
    department: 'Retail Operations',
    location: 'Main Flagship Store',
    openings: 4,
    applicants: 76,
    stage: 'Offer Sent',
    status: 'Active',
    salary_range: '$42,000 - $50,000',
    posted_date: '2026-09-25'
  }
];

const SEED_PERFORMANCE = [
  {
    id: 'perf-01',
    employee_code: 'SH-1001',
    employee_name: 'Marcus Chen',
    cycle: 'Q3 2026 Executive Review',
    kpi_rating: 4.8,
    goals_met: '96%',
    rating_label: 'Exceeds Expectations',
    recommendation: 'Executive Stock Incentive & Retention Grant',
    reviewer: 'Sarah Jenkins',
    status: 'Completed'
  },
  {
    id: 'perf-02',
    employee_code: 'SH-1002',
    employee_name: 'Elena Rostova',
    cycle: 'Q3 2026 Store Review',
    kpi_rating: 4.9,
    goals_met: '98%',
    rating_label: 'Exceptional',
    recommendation: 'Promotion to Regional Operations Director',
    reviewer: 'Sarah Jenkins',
    status: 'Completed'
  },
  {
    id: 'perf-03',
    employee_code: 'SH-1003',
    employee_name: 'David Miller',
    cycle: 'Q3 2026 Logistics Review',
    kpi_rating: 4.4,
    goals_met: '92%',
    rating_label: 'Consistently Meets Standards',
    recommendation: 'Annual Step Compensation Increment',
    reviewer: 'Marcus Chen',
    status: 'Completed'
  }
];

const SEED_DOCS = [
  {
    id: 'doc-01',
    title: 'StoreHub Global Code of Conduct & Ethics',
    category: 'Corporate Policy',
    version: 'v4.2',
    date: '2026-01-01',
    file_size: '2.4 MB',
    file_type: 'PDF',
    status: 'Mandatory Acknowledged'
  },
  {
    id: 'doc-02',
    title: 'POS Operator & Cash Management Standard',
    category: 'SOP Manual',
    version: 'v2.1',
    date: '2026-03-10',
    file_size: '1.8 MB',
    file_type: 'PDF',
    status: 'Active Operational'
  },
  {
    id: 'doc-03',
    title: 'Warehouse Safety & OSHA Material Handling Protocols',
    category: 'Safety & Compliance',
    version: 'v3.0',
    date: '2026-05-15',
    file_size: '3.1 MB',
    file_type: 'PDF',
    status: 'Compliance Certified'
  }
];

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

export const hrService = {
  // 1. EMPLOYEES
  async getEmployees(params = {}) {
    try {
      const res = await apiClient.get('/employees/', { params });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_EMPLOYEES_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_EMPLOYEES_KEY, SEED_EMPLOYEES);
  },

  async createEmployee(payload) {
    const newEmp = {
      ...payload,
      id: `emp-${Date.now()}`,
      employee_code: payload.employee_code || `SH-${Math.floor(1000 + Math.random() * 9000)}`,
      employment_status: payload.employment_status || 'Active',
      leave_balance: { annual: 15, sick: 10, casual: 5 },
      kpis: { score: 5.0, goals_completed: 0, total_goals: 5 }
    };
    try {
      await apiClient.post('/employees/', newEmp);
    } catch {}
    const list = getStorage(STORAGE_EMPLOYEES_KEY, SEED_EMPLOYEES);
    const updated = [newEmp, ...list];
    setStorage(STORAGE_EMPLOYEES_KEY, updated);
    return newEmp;
  },

  async updateEmployee(id, payload) {
    const list = getStorage(STORAGE_EMPLOYEES_KEY, SEED_EMPLOYEES);
    const updated = list.map(e => e.id === id ? { ...e, ...payload } : e);
    setStorage(STORAGE_EMPLOYEES_KEY, updated);
    return updated.find(e => e.id === id);
  },

  // 2. DEPARTMENTS
  async getDepartments() {
    try {
      const res = await apiClient.get('/departments/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_DEPARTMENTS_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_DEPARTMENTS_KEY, SEED_DEPARTMENTS);
  },

  // 3. ATTENDANCE
  async getAttendance() {
    try {
      const res = await apiClient.get('/attendance/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_ATTENDANCE_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_ATTENDANCE_KEY, SEED_ATTENDANCE);
  },

  async punchAttendance(data) {
    const punch = {
      id: `att-${Date.now()}`,
      employee_code: data.employee_code || 'SH-1002',
      employee_name: data.employee_name || 'Staff Associate',
      date: new Date().toISOString().slice(0, 10),
      shift: data.shift || 'General Shift (09:00 - 18:00)',
      check_in: new Date().toLocaleTimeString(),
      check_out: '',
      hours_worked: 0.0,
      overtime_hours: 0.0,
      status: 'On Time',
      branch: data.branch || 'Main Flagship Store'
    };
    try {
      await apiClient.post('/attendance/punch', punch);
    } catch {}
    const list = getStorage(STORAGE_ATTENDANCE_KEY, SEED_ATTENDANCE);
    const updated = [punch, ...list];
    setStorage(STORAGE_ATTENDANCE_KEY, updated);
    return punch;
  },

  // 4. LEAVES
  async getLeaves() {
    try {
      const res = await apiClient.get('/leaves/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_LEAVES_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_LEAVES_KEY, SEED_LEAVES);
  },

  async applyLeave(data) {
    const leave = {
      ...data,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      applied_on: new Date().toISOString().slice(0, 10),
      approved_by: 'Pending Review'
    };
    try {
      await apiClient.post('/leaves/', leave);
    } catch {}
    const list = getStorage(STORAGE_LEAVES_KEY, SEED_LEAVES);
    const updated = [leave, ...list];
    setStorage(STORAGE_LEAVES_KEY, updated);
    return leave;
  },

  async updateLeaveStatus(id, status, approver = 'Sarah Jenkins') {
    const list = getStorage(STORAGE_LEAVES_KEY, SEED_LEAVES);
    const updated = list.map(l => l.id === id ? { ...l, status, approved_by: approver } : l);
    setStorage(STORAGE_LEAVES_KEY, updated);
    return updated.find(l => l.id === id);
  },

  // 5. PAYROLL
  async getPayrollRuns() {
    try {
      const res = await apiClient.get('/payroll/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_PAYROLL_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_PAYROLL_KEY, SEED_PAYROLL);
  },

  async executePayrollRun(payload) {
    const run = {
      ...payload,
      id: `pay-${Date.now()}`,
      run_date: new Date().toISOString().slice(0, 10),
      status: 'Disbursed'
    };
    try {
      await apiClient.post('/payroll/execute', run);
    } catch {}
    const list = getStorage(STORAGE_PAYROLL_KEY, SEED_PAYROLL);
    const updated = [run, ...list];
    setStorage(STORAGE_PAYROLL_KEY, updated);
    return run;
  },

  // 6. RECRUITMENT
  async getJobOpenings() {
    try {
      const res = await apiClient.get('/recruitment/jobs');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_JOBS_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_JOBS_KEY, SEED_JOBS);
  },

  async createJobOpening(data) {
    const job = {
      ...data,
      id: `job-${Date.now()}`,
      applicants: 0,
      stage: 'Screening',
      status: 'Active',
      posted_date: new Date().toISOString().slice(0, 10)
    };
    const list = getStorage(STORAGE_JOBS_KEY, SEED_JOBS);
    const updated = [job, ...list];
    setStorage(STORAGE_JOBS_KEY, updated);
    return job;
  },

  // 7. PERFORMANCE
  async getPerformanceReviews() {
    try {
      const res = await apiClient.get('/performance/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorage(STORAGE_PERFORMANCE_KEY, res.data);
        return res.data;
      }
    } catch {}
    return getStorage(STORAGE_PERFORMANCE_KEY, SEED_PERFORMANCE);
  },

  // 8. DOCUMENTS
  getDocuments() {
    return getStorage(STORAGE_DOCS_KEY, SEED_DOCS);
  },

  uploadDocument(data) {
    const doc = {
      ...data,
      id: `doc-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      file_size: '1.2 MB',
      file_type: 'PDF',
      status: 'Active Verified'
    };
    const list = getStorage(STORAGE_DOCS_KEY, SEED_DOCS);
    const updated = [doc, ...list];
    setStorage(STORAGE_DOCS_KEY, updated);
    return doc;
  },

  // 9. HR NOTIFICATIONS & LIFE EVENTS
  getLifeEvents() {
    return [
      { id: 'ev-1', type: 'birthday', title: "Elena Rostova's Birthday", date: 'Today, Oct 05', department: 'Retail Operations', icon: 'cake' },
      { id: 'ev-2', type: 'anniversary', title: "Marcus Chen's 5th Work Anniversary", date: 'Oct 12, 2026', department: 'Supply Chain', icon: 'award' },
      { id: 'ev-3', type: 'approval', title: "Lucas Vance's Sick Leave Awaiting Approval", date: 'Pending (1 Day)', department: 'Retail Operations', icon: 'clock' },
      { id: 'ev-4', type: 'payroll', title: 'September 2026 Direct Deposits Disbursed', date: 'Sept 30, 2026', department: 'Finance & HR', icon: 'check' }
    ];
  },

  // 10. 12 HR EXECUTIVE KPIS
  get12HRKPIs() {
    return {
      headcount: { title: 'Total Headcount', value: '95 Staff', delta: '+6 this quarter', tone: 'primary', subtitle: 'Global enterprise roster' },
      activeEmployees: { title: 'Active On Duty', value: '93 Active', delta: '97.8% active', tone: 'success', subtitle: '2 on authorized leave' },
      attendanceRate: { title: 'Average Attendance', value: '96.4%', delta: '+1.2% pts', tone: 'success', subtitle: 'Target: >95.0%' },
      payrollCost: { title: 'Monthly Payroll', value: '$248,600.00', delta: 'On budget', tone: 'primary', subtitle: 'September disbursement' },
      openPositions: { title: 'Open Requisitions', value: '7 Roles', delta: '146 applicants', tone: 'info', subtitle: 'Active ATS pipeline' },
      attritionRate: { title: 'Annualized Attrition', value: '3.8%', delta: '-0.9% reduction', tone: 'success', subtitle: 'Industry benchmark: 8.5%' },
      avgTenure: { title: 'Average Tenure', value: '3.2 Years', delta: '+0.4y growth', tone: 'info', subtitle: 'Strong talent retention' },
      leaveUtilization: { title: 'Leave Utilization', value: '62.4%', delta: 'Healthy balance', tone: 'neutral', subtitle: 'Accrual tracking' },
      performanceIndex: { title: 'High Performers', value: '88.5%', delta: 'Rated >= 4.0/5.0', tone: 'success', subtitle: 'Q3 review aggregate' },
      diversityRatio: { title: 'Gender Diversity', value: '48% / 52%', delta: 'Equitable parity', tone: 'primary', subtitle: 'F / M distribution' },
      trainingHours: { title: 'Training / Staff', value: '24.5 Hrs', delta: '+3.5 hrs YTD', tone: 'info', subtitle: 'Compliance & Safety' },
      employeeCSAT: { title: 'Pulse Engagement', value: '89 / 100', delta: '+4 pts increase', tone: 'success', subtitle: 'Quarterly pulse survey' }
    };
  },

  // 11. HR ANALYTICS DATA (Recharts)
  getHRAnalytics() {
    return {
      departmentHeadcount: [
        { name: 'Supply Chain & SCM', count: 34 },
        { name: 'Retail Store Operations', count: 28 },
        { name: 'Warehouse Logistics', count: 19 },
        { name: 'Finance & Compliance', count: 8 },
        { name: 'People & Admin', count: 6 }
      ],
      attendanceTrend: [
        { month: 'May', rate: 95.2, overtime: 142 },
        { month: 'Jun', rate: 96.1, overtime: 168 },
        { month: 'Jul', rate: 94.8, overtime: 185 },
        { month: 'Aug', rate: 96.8, overtime: 154 },
        { month: 'Sep', rate: 96.4, overtime: 160 }
      ],
      hiringTrend: [
        { month: 'May', hired: 4, exited: 1 },
        { month: 'Jun', hired: 6, exited: 2 },
        { month: 'Jul', hired: 3, exited: 1 },
        { month: 'Aug', hired: 5, exited: 1 },
        { month: 'Sep', hired: 4, exited: 0 }
      ],
      payrollDistribution: [
        { dept: 'Supply Chain', cost: 112000 },
        { dept: 'Retail Operations', cost: 68500 },
        { dept: 'Warehouse Inv', cost: 38200 },
        { dept: 'Finance & HR', cost: 29900 }
      ],
      performanceCurve: [
        { rating: '5.0 Exceptional', percentage: 22 },
        { rating: '4.0 - 4.9 Exceeds', percentage: 56 },
        { rating: '3.0 - 3.9 Meets', percentage: 18 },
        { rating: '< 3.0 Needs Improvement', percentage: 4 }
      ]
    };
  }
};
