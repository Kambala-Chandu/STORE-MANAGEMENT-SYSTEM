// Phase 4.12 Enterprise Project Management Service

const STORAGE_KEY_PROJECTS = 'storehub_projects_list';
const STORAGE_KEY_TIMESHEETS = 'storehub_projects_timesheets';

const INITIAL_PROJECTS = [
  { id: 'proj-01', name: 'Automated Micro-Fulfillment Center', code: 'PRJ-MFC-01', manager: 'Sarah Jenkins', status: 'Active', progress_pct: 68, budget: 350000, spent: 238000, start_date: '2026-03-01', end_date: '2026-11-30', priority: 'High', department: 'Logistics' },
  { id: 'proj-02', name: 'ERP SCM Omnichannel Rollout', code: 'PRJ-ERP-02', manager: 'Marcus Vance', status: 'Active', progress_pct: 82, budget: 180000, spent: 147600, start_date: '2026-01-15', end_date: '2026-10-31', priority: 'Critical', department: 'IT Systems' },
  { id: 'proj-03', name: 'Cleanroom Production Line Upgrade', code: 'PRJ-PRD-03', manager: 'David Miller', status: 'Planning', progress_pct: 25, budget: 520000, spent: 110000, start_date: '2026-08-01', end_date: '2027-04-15', priority: 'High', department: 'Manufacturing' },
  { id: 'proj-04', name: 'ISO 27001 Security Hardening', code: 'PRJ-SEC-04', manager: 'Elena Rostova', status: 'Active', progress_pct: 90, budget: 95000, spent: 86000, start_date: '2026-04-01', end_date: '2026-10-15', priority: 'Medium', department: 'Cybersecurity' },
  { id: 'proj-05', name: 'IoT Predictive Maintenance Fleet', code: 'PRJ-IOT-05', manager: 'Sarah Jenkins', status: 'Active', progress_pct: 54, budget: 210000, spent: 113400, start_date: '2026-05-10', end_date: '2026-12-20', priority: 'High', department: 'Operations' },
  { id: 'proj-06', name: 'Regional Distribution Hub Edison', code: 'PRJ-WMS-06', manager: 'Marcus Vance', status: 'Completed', progress_pct: 100, budget: 420000, spent: 405000, start_date: '2025-11-01', end_date: '2026-09-01', priority: 'Medium', department: 'Supply Chain' }
];

const INITIAL_TASKS = [
  { id: 'task-01', project_id: 'proj-01', title: 'Install optical sorting conveyor belt', assignee: 'Alex Rivera', priority: 'High', status: 'In Progress', due_date: '2026-10-18' },
  { id: 'task-02', project_id: 'proj-01', title: 'Calibrate RFID dock scanners', assignee: 'Priya Sharma', priority: 'Medium', status: 'To Do', due_date: '2026-10-25' },
  { id: 'task-03', project_id: 'proj-01', title: 'PLC safety emergency stop verification', assignee: 'David Miller', priority: 'Critical', status: 'Review', due_date: '2026-10-12' },
  { id: 'task-04', project_id: 'proj-01', title: 'Warehouse management API bridge testing', assignee: 'Sarah Jenkins', priority: 'High', status: 'Done', due_date: '2026-10-02' },
  { id: 'task-05', project_id: 'proj-02', title: 'Implement multi-currency ledger rounding', assignee: 'Elena Rostova', priority: 'Medium', status: 'In Progress', due_date: '2026-10-15' },
  { id: 'task-06', project_id: 'proj-02', title: 'Execute end-to-end POS batch offline sync test', assignee: 'Marcus Vance', priority: 'Critical', status: 'Review', due_date: '2026-10-11' }
];

const INITIAL_RESOURCES = [
  { id: 'res-01', name: 'Sarah Jenkins', role: 'Principal Architect', skills: ['System Architecture', 'SCM', 'FastAPI'], allocation_pct: 85, projects: ['PRJ-MFC-01', 'PRJ-IOT-05'], available_hrs: 6 },
  { id: 'res-02', name: 'Marcus Vance', role: 'DevOps & Infrastructure Lead', skills: ['Cloud', 'K8s', 'WMS'], allocation_pct: 90, projects: ['PRJ-ERP-02', 'PRJ-WMS-06'], available_hrs: 4 },
  { id: 'res-03', name: 'David Miller', role: 'Automation & Hardware Engineer', skills: ['PLC', 'Robotics', 'Sensors'], allocation_pct: 75, projects: ['PRJ-MFC-01', 'PRJ-PRD-03'], available_hrs: 10 },
  { id: 'res-04', name: 'Elena Rostova', role: 'Financial Systems Specialist', skills: ['General Ledger', 'Tax Engine', 'SOX'], allocation_pct: 80, projects: ['PRJ-ERP-02', 'PRJ-SEC-04'], available_hrs: 8 }
];

const INITIAL_TIMESHEETS = [
  { id: 'ts-01', date: '2026-10-05', project: 'Automated Micro-Fulfillment', task: 'Optical sorting calibration', hours: 7.5, engineer: 'Alex Rivera', status: 'Approved' },
  { id: 'ts-02', date: '2026-10-05', project: 'ERP SCM Omnichannel', task: 'Payment gateway reconciliation', hours: 8.0, engineer: 'Elena Rostova', status: 'Submitted' },
  { id: 'ts-03', date: '2026-10-04', project: 'Cleanroom Production Upgrade', task: 'HEPA filtration airflow modeling', hours: 6.5, engineer: 'David Miller', status: 'Approved' },
  { id: 'ts-04', date: '2026-10-04', project: 'IoT Predictive Maintenance', task: 'Vibration telemetry parser rewrite', hours: 8.0, engineer: 'Sarah Jenkins', status: 'Approved' }
];

export const projectService = {
  getProjects: async () => {
    const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  },

  getTasks: async (projectId) => {
    if (!projectId) return INITIAL_TASKS;
    return INITIAL_TASKS.filter((t) => t.project_id === projectId);
  },

  getResources: async () => INITIAL_RESOURCES,

  getTimesheets: async () => {
    const saved = localStorage.getItem(STORAGE_KEY_TIMESHEETS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem(STORAGE_KEY_TIMESHEETS, JSON.stringify(INITIAL_TIMESHEETS));
    return INITIAL_TIMESHEETS;
  },

  get12ProjectKPIs: async () => [
    { label: 'Active Projects', value: '14', unit: '', trend: '+2', trendDir: 'up', color: 'blue' },
    { label: 'On Schedule Rate', value: '78.5', unit: '%', trend: '+4.2%', trendDir: 'up', color: 'emerald' },
    { label: 'Budget Variance', value: '-3.2', unit: '%', trend: 'Under', trendDir: 'down', color: 'emerald' },
    { label: 'Resource Utilization', value: '86.4', unit: '%', trend: '+1.5%', trendDir: 'up', color: 'blue' },
    { label: 'Milestone Hit Rate', value: '91.3', unit: '%', trend: '+2.8%', trendDir: 'up', color: 'emerald' },
    { label: 'Avg Project Duration', value: '47', unit: 'days', trend: '-5 days', trendDir: 'down', color: 'emerald' },
    { label: 'Total Capital Invested', value: '$1.78M', unit: '', trend: 'Approved', trendDir: 'neutral', color: 'purple' },
    { label: 'Logged Hours YTD', value: '14.2K', unit: 'hrs', trend: 'On Track', trendDir: 'neutral', color: 'blue' },
    { label: 'Open Critical Tasks', value: '6', unit: '', trend: '-3', trendDir: 'down', color: 'emerald' },
    { label: 'Average ROI', value: '284', unit: '%', trend: '+18%', trendDir: 'up', color: 'emerald' },
    { label: 'Customer CSAT', value: '4.8', unit: '/5.0', trend: '+0.1', trendDir: 'up', color: 'emerald' },
    { label: 'Risk Mitigation Rate', value: '95.0', unit: '%', trend: 'Stable', trendDir: 'neutral', color: 'blue' }
  ],

  getProjectAnalytics: async () => ({
    velocityTrend: [
      { month: 'May', planned: 24, completed: 22 },
      { month: 'Jun', planned: 30, completed: 29 },
      { month: 'Jul', planned: 35, completed: 33 },
      { month: 'Aug', planned: 28, completed: 29 },
      { month: 'Sep', planned: 34, completed: 35 },
      { month: 'Oct', planned: 38, completed: 36 }
    ],
    budgetDistribution: [
      { department: 'Logistics', budget: 450, spent: 320 },
      { department: 'Manufacturing', budget: 620, spent: 480 },
      { department: 'IT Systems', budget: 380, spent: 340 },
      { department: 'Cybersecurity', budget: 150, spent: 130 },
      { department: 'Operations', budget: 280, spent: 210 }
    ],
    resourceUtilization: [
      { name: 'Sarah J.', utilization: 85 },
      { name: 'Marcus V.', utilization: 90 },
      { name: 'David M.', utilization: 75 },
      { name: 'Elena R.', utilization: 80 },
      { name: 'Alex R.', utilization: 92 },
      { name: 'Priya S.', utilization: 78 }
    ]
  }),

  createProject: async (data) => {
    const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
    const list = saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    const newProj = {
      id: `proj-${Date.now()}`,
      code: `PRJ-NEW-${String(list.length + 10).padStart(2, '0')}`,
      progress_pct: 0,
      spent: 0,
      status: 'Planning',
      ...data
    };
    list.unshift(newProj);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(list));
    return newProj;
  },

  createTimesheet: async (data) => {
    const saved = localStorage.getItem(STORAGE_KEY_TIMESHEETS);
    const list = saved ? JSON.parse(saved) : INITIAL_TIMESHEETS;
    const newEntry = {
      id: `ts-${Date.now()}`,
      status: 'Submitted',
      ...data
    };
    list.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY_TIMESHEETS, JSON.stringify(list));
    return newEntry;
  }
};
