// Phase 4.11 Enterprise Quality Management Service

const STORAGE_KEY_LOTS = 'storehub_qms_lots';
const STORAGE_KEY_CAPA = 'storehub_qms_capa';

const INITIAL_LOTS = [
  { id: 'lot-01', lot_number: 'LOT-2026-081', product: 'Precision Sensor Module v2', batch: 'BAT-901', inspection_type: 'Incoming', inspector: 'Marcus Vance', status: 'Passed', pass_qty: 498, fail_qty: 2, defect_codes: ['D-04'] },
  { id: 'lot-02', lot_number: 'LOT-2026-082', product: 'Industrial Stepper Motor 48V', batch: 'BAT-902', inspection_type: 'In-Process', inspector: 'Elena Rostova', status: 'Passed', pass_qty: 250, fail_qty: 0, defect_codes: [] },
  { id: 'lot-03', lot_number: 'LOT-2026-083', product: 'Hydraulic Seal Ring Kit', batch: 'BAT-903', inspection_type: 'Final', inspector: 'Marcus Vance', status: 'Failed', pass_qty: 310, fail_qty: 40, defect_codes: ['D-01', 'D-02'] },
  { id: 'lot-04', lot_number: 'LOT-2026-084', product: 'Aluminum Chassis Frame A1', batch: 'BAT-904', inspection_type: 'Incoming', inspector: 'Sarah Jenkins', status: 'Passed', pass_qty: 120, fail_qty: 0, defect_codes: [] },
  { id: 'lot-05', lot_number: 'LOT-2026-085', product: 'Main Control PCB Board', batch: 'BAT-905', inspection_type: 'In-Process', inspector: 'David Miller', status: 'Under Review', pass_qty: 85, fail_qty: 5, defect_codes: ['D-05'] },
  { id: 'lot-06', lot_number: 'LOT-2026-086', product: 'Optical Transceiver 10G', batch: 'BAT-906', inspection_type: 'Final', inspector: 'Elena Rostova', status: 'Passed', pass_qty: 600, fail_qty: 1, defect_codes: ['D-03'] },
  { id: 'lot-07', lot_number: 'LOT-2026-087', product: 'Lithium Battery Pack 24V', batch: 'BAT-907', inspection_type: 'Incoming', inspector: 'Marcus Vance', status: 'Passed', pass_qty: 150, fail_qty: 0, defect_codes: [] },
  { id: 'lot-08', lot_number: 'LOT-2026-088', product: 'Braided Copper Wiring Harness', batch: 'BAT-908', inspection_type: 'In-Process', inspector: 'Sarah Jenkins', status: 'Passed', pass_qty: 420, fail_qty: 3, defect_codes: ['D-04'] },
  { id: 'lot-09', lot_number: 'LOT-2026-089', product: 'Pneumatic Actuator Cylinder', batch: 'BAT-909', inspection_type: 'Final', inspector: 'David Miller', status: 'Passed', pass_qty: 95, fail_qty: 0, defect_codes: [] },
  { id: 'lot-10', lot_number: 'LOT-2026-090', product: 'Thermal Heat Sink Compound', batch: 'BAT-910', inspection_type: 'Incoming', inspector: 'Elena Rostova', status: 'Passed', pass_qty: 1000, fail_qty: 0, defect_codes: [] }
];

const INITIAL_CAPA = [
  { id: 'capa-01', ca_number: 'CAPA-2026-012', defect_description: 'Dimensional variance on hydraulic seals', root_cause: 'Mold tooling wear beyond tolerance', owner: 'Marcus Vance', target_date: '2026-10-18', status: 'In Progress', severity: 'High' },
  { id: 'capa-02', ca_number: 'CAPA-2026-013', defect_description: 'Solder bridge defects on PCB subassembly', root_cause: 'Wave solder flux viscosity drift', owner: 'David Miller', target_date: '2026-10-22', status: 'Open', severity: 'Critical' },
  { id: 'capa-03', ca_number: 'CAPA-2026-014', defect_description: 'Packaging seal failure in cold chain', root_cause: 'Adhesive curing temp below threshold', owner: 'Sarah Jenkins', target_date: '2026-09-28', status: 'Closed', severity: 'Medium' },
  { id: 'capa-04', ca_number: 'CAPA-2026-015', defect_description: 'Connector pin oxidation in batch 88', root_cause: 'Plating bath chemical depletion', owner: 'Elena Rostova', target_date: '2026-10-30', status: 'In Progress', severity: 'High' }
];

export const qualityService = {
  getInspectionLots: async () => {
    const saved = localStorage.getItem(STORAGE_KEY_LOTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    localStorage.setItem(STORAGE_KEY_LOTS, JSON.stringify(INITIAL_LOTS));
    return INITIAL_LOTS;
  },

  getQualityPlans: async () => [
    { id: 'plan-1', name: 'Incoming Electronics Inspection Protocol', product: 'Sensors & PCBs', sampling_method: 'ISO 2859-1 Level II', acceptance_criteria: 'AQL 0.65 Normal', status: 'Active', last_updated: '2026-09-15' },
    { id: 'plan-2', name: 'Hydraulic Seal Quality Standard', product: 'Seals & Actuators', sampling_method: '100% Critical Dimension', acceptance_criteria: 'Zero Defect Tolerance', status: 'Active', last_updated: '2026-08-20' },
    { id: 'plan-3', name: 'Assembly Line In-Process Verification', product: 'Stepper Motors', sampling_method: 'Statistical Process Control (SPC)', acceptance_criteria: 'Cpk >= 1.67', status: 'Active', last_updated: '2026-10-01' },
    { id: 'plan-4', name: 'Packaging & Terminal Integrity Plan', product: 'All Finished Goods', sampling_method: 'Random Batch (5 per 100)', acceptance_criteria: 'Drop & Pressure Seal', status: 'Active', last_updated: '2026-07-11' }
  ],

  getCAPAs: async () => {
    const saved = localStorage.getItem(STORAGE_KEY_CAPA);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    localStorage.setItem(STORAGE_KEY_CAPA, JSON.stringify(INITIAL_CAPA));
    return INITIAL_CAPA;
  },

  getAudits: async () => [
    { id: 'audit-1', type: 'ISO 9001:2015 Recertification', scope: 'Manufacturing & Warehouse', auditor: 'TÜV Rheinland (Dr. Aris)', date: '2026-09-22', score: 98.4, findings_count: 2, status: 'Passed' },
    { id: 'audit-2', type: 'Supplier Quality Audit (Tier 1)', scope: 'Acme Metal Foundry', auditor: 'Sarah Jenkins', date: '2026-09-30', score: 94.2, findings_count: 4, status: 'Passed' },
    { id: 'audit-3', type: 'Internal Cleanliness & ESD Audit', scope: 'Cleanroom Production Line B', auditor: 'Marcus Vance', date: '2026-10-02', score: 100.0, findings_count: 0, status: 'Passed' },
    { id: 'audit-4', type: 'Hazmat & Chemical Storage Audit', scope: 'Chemical Storage Bay 4', auditor: 'David Miller', date: '2026-08-14', score: 96.0, findings_count: 1, status: 'Passed' }
  ],

  getDefects: async () => [
    { code: 'D-01', category: 'Dimensional', description: 'Outer diameter exceeds 0.05mm tolerance', occurrences: 42, line: 'Line 2 - Machining', cost_impact: 3840 },
    { code: 'D-02', category: 'Surface Finish', description: 'Micro-scratches on polished interface', occurrences: 28, line: 'Line 1 - Extrusion', cost_impact: 1920 },
    { code: 'D-03', category: 'Electrical', description: 'Voltage drop out of specification', occurrences: 14, line: 'Line 4 - Electronic Assembly', cost_impact: 5400 },
    { code: 'D-04', category: 'Packaging', description: 'Tamper seal misaligned or loose', occurrences: 19, line: 'Line 5 - Packaging', cost_impact: 650 },
    { code: 'D-05', category: 'Solder Quality', description: 'Cold solder joint detected via AOI', occurrences: 9, line: 'Line 4 - SMT Line', cost_impact: 2150 }
  ],

  get12QualityKPIs: async () => [
    { label: 'First Pass Yield (FPY)', value: '96.8', unit: '%', trend: '+1.2%', trendDir: 'up', color: 'emerald' },
    { label: 'Defect Rate', value: '1.2', unit: 'PPM', trend: '-0.4 PPM', trendDir: 'down', color: 'blue' },
    { label: 'Customer Complaints', value: '3', unit: '/mo', trend: '-2', trendDir: 'down', color: 'purple' },
    { label: 'CAPA Close Rate', value: '94.1', unit: '%', trend: '+4.5%', trendDir: 'up', color: 'emerald' },
    { label: 'Supplier Quality', value: '98.3', unit: '%', trend: '+0.8%', trendDir: 'up', color: 'blue' },
    { label: 'Audit Compliance', value: '100', unit: '%', trend: '0%', trendDir: 'neutral', color: 'emerald' },
    { label: 'Cost of Quality (CoQ)', value: '$12.4K', unit: '', trend: '-8.3%', trendDir: 'down', color: 'emerald' },
    { label: 'Inspection Velocity', value: '42', unit: 'lots/day', trend: '+5', trendDir: 'up', color: 'blue' },
    { label: 'Scrap Material Rate', value: '0.84', unit: '%', trend: '-0.12%', trendDir: 'down', color: 'emerald' },
    { label: 'Mean Time to Detect (MTTD)', value: '14', unit: 'mins', trend: '-3 mins', trendDir: 'down', color: 'purple' },
    { label: 'Cpk Process Capability', value: '1.74', unit: '', trend: '+0.08', trendDir: 'up', color: 'blue' },
    { label: 'Calibration Compliance', value: '99.6', unit: '%', trend: '+0.2%', trendDir: 'up', color: 'emerald' }
  ],

  getQualityAnalytics: async () => ({
    yieldTrend: [
      { month: 'Jan', yield_rate: 94.2, target: 95.0 },
      { month: 'Feb', yield_rate: 94.8, target: 95.0 },
      { month: 'Mar', yield_rate: 95.1, target: 95.0 },
      { month: 'Apr', yield_rate: 95.5, target: 95.5 },
      { month: 'May', yield_rate: 95.9, target: 95.5 },
      { month: 'Jun', yield_rate: 96.2, target: 96.0 },
      { month: 'Jul', yield_rate: 96.0, target: 96.0 },
      { month: 'Aug', yield_rate: 96.4, target: 96.0 },
      { month: 'Sep', yield_rate: 96.6, target: 96.5 },
      { month: 'Oct', yield_rate: 96.8, target: 96.5 }
    ],
    defectPareto: [
      { category: 'Dimensional', count: 42, percentage: 37.5 },
      { category: 'Surface Finish', count: 28, percentage: 25.0 },
      { category: 'Packaging', count: 19, percentage: 17.0 },
      { category: 'Electrical', count: 14, percentage: 12.5 },
      { category: 'Solder Quality', count: 9, percentage: 8.0 }
    ],
    capaClosureTrend: [
      { month: 'May', opened: 8, closed: 7 },
      { month: 'Jun', opened: 6, closed: 6 },
      { month: 'Jul', opened: 9, closed: 8 },
      { month: 'Aug', opened: 5, closed: 7 },
      { month: 'Sep', opened: 4, closed: 5 },
      { month: 'Oct', opened: 4, closed: 4 }
    ]
  }),

  createCapa: async (data) => {
    const saved = localStorage.getItem(STORAGE_KEY_CAPA);
    const list = saved ? JSON.parse(saved) : INITIAL_CAPA;
    const newRecord = {
      id: `capa-${Date.now()}`,
      ca_number: `CAPA-2026-${String(list.length + 16).padStart(3, '0')}`,
      status: 'Open',
      ...data
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY_CAPA, JSON.stringify(list));
    return newRecord;
  },

  createInspectionLot: async (data) => {
    const saved = localStorage.getItem(STORAGE_KEY_LOTS);
    const list = saved ? JSON.parse(saved) : INITIAL_LOTS;
    const newRecord = {
      id: `lot-${Date.now()}`,
      lot_number: `LOT-2026-${String(list.length + 91).padStart(3, '0')}`,
      status: 'Under Review',
      pass_qty: 0,
      fail_qty: 0,
      defect_codes: [],
      ...data
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY_LOTS, JSON.stringify(list));
    return newRecord;
  }
};
