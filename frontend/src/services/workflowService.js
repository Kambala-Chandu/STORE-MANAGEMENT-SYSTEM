import apiClient from '../api/client';

// Initial pre-seeded enterprise workflows definitions
const SEED_WORKFLOWS = [
  {
    id: 'wf-1',
    name: 'Purchase Order Approval',
    type: 'purchase_approval',
    description: 'Multi-tier authorization hierarchy for procurement orders exceeding $1,000.',
    trigger: 'Purchase Order Created',
    conditions: [{ field: 'total_amount', operator: '>=', value: 1000 }],
    approval_levels: [
      { level: 1, role: 'Manager', label: 'Department Manager Review', sla_hours: 24 },
      { level: 2, role: 'Finance', label: 'Finance Director Sign-off', sla_hours: 48 },
      { level: 3, role: 'Director', label: 'Executive Board Authorization', sla_hours: 72 }
    ],
    auto_actions: ['Reserve Budget Allocation', 'Notify Vendor on Final Approval'],
    notifications: ['Email', 'In-App', 'Activity Center'],
    status: 'Active',
    nodes: [
      { id: 'node-1', type: 'Start', label: 'PO Submission', config: { event: 'po_created' } },
      { id: 'node-2', type: 'Condition', label: 'Amount >= $1,000', config: { field: 'amount', operator: '>=', val: 1000 } },
      { id: 'node-3', type: 'Approval', label: 'Tier 1: Manager Sign-off', config: { approver: 'Store Manager', sla: '24h' } },
      { id: 'node-4', type: 'Approval', label: 'Tier 2: Finance Director', config: { approver: 'Finance Head', sla: '48h' } },
      { id: 'node-5', type: 'Notification', label: 'Notify Purchasing Dept', config: { channel: 'Email' } },
      { id: 'node-6', type: 'API Action', label: 'Dispatch PO to Supplier', config: { endpoint: '/api/v1/purchases/dispatch' } },
      { id: 'node-7', type: 'End', label: 'PO Dispatched', config: {} }
    ],
    created_at: '2026-10-01T08:00:00Z',
    executions_count: 48,
    success_rate: 96.2
  },
  {
    id: 'wf-2',
    name: 'Sales Discount Approval',
    type: 'sales_discount_approval',
    description: 'Requires supervisor override when discount applied at POS register exceeds 15%.',
    trigger: 'Discount Applied > 15%',
    conditions: [{ field: 'discount_percent', operator: '>', value: 15 }],
    approval_levels: [
      { level: 1, role: 'Manager', label: 'Store Shift Manager Approval', sla_hours: 2 }
    ],
    auto_actions: ['Log Discount Exception in Audit Trail'],
    notifications: ['In-App Flash', 'Activity Center'],
    status: 'Active',
    nodes: [
      { id: 'node-1', type: 'Start', label: 'POS Item Scanned', config: {} },
      { id: 'node-2', type: 'Condition', label: 'Discount > 15%', config: { field: 'discount', operator: '>', val: 15 } },
      { id: 'node-3', type: 'Approval', label: 'Manager PIN Override', config: { approver: 'Shift Supervisor', sla: '2h' } },
      { id: 'node-4', type: 'Decision', label: 'Approved or Override?', config: {} },
      { id: 'node-5', type: 'Notification', label: 'Audit Alert Dispatched', config: { channel: 'In-App' } },
      { id: 'node-6', type: 'End', label: 'Cart Total Updated', config: {} }
    ],
    created_at: '2026-10-01T08:30:00Z',
    executions_count: 112,
    success_rate: 98.4
  },
  {
    id: 'wf-3',
    name: 'Inventory Adjustment Approval',
    type: 'inventory_adjustment_approval',
    description: 'Mandatory sign-off for negative inventory write-offs or discrepancies over $250.',
    trigger: 'Stock Adjustment Discrepancy > $250',
    conditions: [{ field: 'adjustment_value', operator: '>=', value: 250 }],
    approval_levels: [
      { level: 1, role: 'Manager', label: 'Warehouse Supervisor Review', sla_hours: 12 },
      { level: 2, role: 'Finance', label: 'Inventory Controller Confirmation', sla_hours: 24 }
    ],
    auto_actions: ['Post Ledger Revaluation Entry', 'Adjust Stock Balance'],
    notifications: ['In-App', 'Activity Center'],
    status: 'Active',
    nodes: [
      { id: 'node-1', type: 'Start', label: 'Cycle Count Variance Logged', config: {} },
      { id: 'node-2', type: 'Condition', label: 'Variance Value >= $250', config: { field: 'value', operator: '>=', val: 250 } },
      { id: 'node-3', type: 'Approval', label: 'Tier 1: Warehouse Manager', config: { approver: 'Warehouse Lead', sla: '12h' } },
      { id: 'node-4', type: 'Approval', label: 'Tier 2: Inventory Controller', config: { approver: 'Finance Controller', sla: '24h' } },
      { id: 'node-5', type: 'API Action', label: 'Post GL Journal Adjustments', config: { endpoint: '/api/v1/inventory/reconcile' } },
      { id: 'node-6', type: 'End', label: 'Ledger Rebalanced', config: {} }
    ],
    created_at: '2026-10-01T09:00:00Z',
    executions_count: 31,
    success_rate: 91.8
  },
  {
    id: 'wf-4',
    name: 'Customer Credit Approval',
    type: 'customer_credit_approval',
    description: 'Risk assessment & executive credit line authorization for wholesale accounts.',
    trigger: 'Credit Limit Increase Requested > $5,000',
    conditions: [{ field: 'credit_limit', operator: '>=', value: 5000 }],
    approval_levels: [
      { level: 1, role: 'Finance', label: 'Credit Risk Analyst Evaluation', sla_hours: 24 },
      { level: 2, role: 'Director', label: 'Chief Financial Officer Sign-off', sla_hours: 48 }
    ],
    auto_actions: ['Unlock Credit Limit in Customer Ledger', 'Notify Account Manager'],
    notifications: ['Email', 'In-App', 'Activity Center'],
    status: 'Active',
    nodes: [
      { id: 'node-1', type: 'Start', label: 'Credit Line Request', config: {} },
      { id: 'node-2', type: 'Condition', label: 'Credit > $5,000', config: { field: 'credit_limit', operator: '>=', val: 5000 } },
      { id: 'node-3', type: 'Approval', label: 'Risk Analyst Assessment', config: { approver: 'Risk Analyst', sla: '24h' } },
      { id: 'node-4', type: 'Approval', label: 'CFO Final Approval', config: { approver: 'CFO', sla: '48h' } },
      { id: 'node-5', type: 'Notification', label: 'Notify Wholesale Client', config: { channel: 'Email' } },
      { id: 'node-6', type: 'End', label: 'Credit Line Active', config: {} }
    ],
    created_at: '2026-10-01T09:30:00Z',
    executions_count: 14,
    success_rate: 92.5
  },
  {
    id: 'wf-5',
    name: 'Supplier Onboarding Approval',
    type: 'supplier_approval',
    description: 'Vendor compliance verification, tax document checks, and commercial terms agreement.',
    trigger: 'New Supplier Registration Submitted',
    conditions: [{ field: 'vendor_tier', operator: 'in', value: ['Tier 1', 'Tier 2'] }],
    approval_levels: [
      { level: 1, role: 'Manager', label: 'Procurement Lead Verification', sla_hours: 24 },
      { level: 2, role: 'Admin', label: 'Legal & Tax Compliance Audit', sla_hours: 48 }
    ],
    auto_actions: ['Activate Supplier in Procurement Directory'],
    notifications: ['Email', 'In-App'],
    status: 'Active',
    nodes: [
      { id: 'node-1', type: 'Start', label: 'Vendor Submission', config: {} },
      { id: 'node-2', type: 'Approval', label: 'Procurement Verification', config: { approver: 'Procurement Lead', sla: '24h' } },
      { id: 'node-3', type: 'Approval', label: 'Legal/Tax Compliance Audit', config: { approver: 'Admin Lead', sla: '48h' } },
      { id: 'node-4', type: 'Notification', label: 'Send Welcome Packet', config: { channel: 'Email' } },
      { id: 'node-5', type: 'End', label: 'Supplier Activated', config: {} }
    ],
    created_at: '2026-10-01T10:00:00Z',
    executions_count: 9,
    success_rate: 100.0
  },
  {
    id: 'wf-6',
    name: 'User Creation & Role Authorization',
    type: 'user_creation_approval',
    description: 'Secures administrative role elevation and newly created employee user accounts.',
    trigger: 'User Account Created with Admin/Manager Role',
    conditions: [{ field: 'role', operator: 'in', value: ['Admin', 'Manager'] }],
    approval_levels: [
      { level: 1, role: 'Admin', label: 'Security Officer Authorization', sla_hours: 8 }
    ],
    auto_actions: ['Activate User Credentials', 'Log Security Audit Log'],
    notifications: ['Email', 'Activity Center'],
    status: 'Active',
    nodes: [
      { id: 'node-1', type: 'Start', label: 'New User Registered', config: {} },
      { id: 'node-2', type: 'Condition', label: 'Role in [Admin, Manager]', config: {} },
      { id: 'node-3', type: 'Approval', label: 'Security Officer Sign-off', config: { approver: 'Security Admin', sla: '8h' } },
      { id: 'node-4', type: 'API Action', label: 'Enable 2FA & Issue Credentials', config: {} },
      { id: 'node-5', type: 'End', label: 'User Account Provisioned', config: {} }
    ],
    created_at: '2026-10-01T10:30:00Z',
    executions_count: 6,
    success_rate: 100.0
  },
  {
    id: 'wf-7',
    name: 'Product Price Change Approval',
    type: 'product_price_change_approval',
    description: 'Governs retail price revisions and catalog markdowns exceeding 10%.',
    trigger: 'Price Revision Delta > 10%',
    conditions: [{ field: 'delta_percent', operator: '>', value: 10 }],
    approval_levels: [
      { level: 1, role: 'Manager', label: 'Category Commercial Manager Sign-off', sla_hours: 12 }
    ],
    auto_actions: ['Update Catalog Price Matrix', 'Sync Electronic Shelf Labels'],
    notifications: ['In-App', 'Activity Center'],
    status: 'Active',
    nodes: [
      { id: 'node-1', type: 'Start', label: 'Price Modification Drafted', config: {} },
      { id: 'node-2', type: 'Condition', label: 'Delta > 10%', config: {} },
      { id: 'node-3', type: 'Approval', label: 'Commercial Manager Review', config: { approver: 'Category Lead', sla: '12h' } },
      { id: 'node-4', type: 'Notification', label: 'Broadcast Shelf Tag Update', config: {} },
      { id: 'node-5', type: 'End', label: 'Price Active in POS & Web', config: {} }
    ],
    created_at: '2026-10-01T11:00:00Z',
    executions_count: 28,
    success_rate: 96.4
  },
  {
    id: 'wf-8',
    name: 'Stock Transfer Approval',
    type: 'stock_transfer_approval',
    description: 'Inter-warehouse inventory relocation authorization for high-volume movements.',
    trigger: 'Inter-branch Movement Requested',
    conditions: [{ field: 'units', operator: '>=', value: 100 }],
    approval_levels: [
      { level: 1, role: 'Manager', label: 'Source Warehouse Lead Release', sla_hours: 8 },
      { level: 2, role: 'Manager', label: 'Destination Warehouse Receipt Sign-off', sla_hours: 24 }
    ],
    auto_actions: ['Issue Transfer Manifest Bill of Lading', 'Transit Ledger Tracking'],
    notifications: ['In-App', 'Activity Center'],
    status: 'Active',
    nodes: [
      { id: 'node-1', type: 'Start', label: 'Transfer Request Created', config: {} },
      { id: 'node-2', type: 'Condition', label: 'Units >= 100', config: {} },
      { id: 'node-3', type: 'Approval', label: 'Source Warehouse Release', config: { approver: 'Source Lead', sla: '8h' } },
      { id: 'node-4', type: 'Approval', label: 'Destination Receipt Verification', config: { approver: 'Dest Lead', sla: '24h' } },
      { id: 'node-5', type: 'API Action', label: 'Update In-Transit Balances', config: {} },
      { id: 'node-6', type: 'End', label: 'Transfer Finalized', config: {} }
    ],
    created_at: '2026-10-01T11:30:00Z',
    executions_count: 19,
    success_rate: 94.7
  }
];

// Initial pre-seeded approvals
const SEED_APPROVALS = [
  {
    id: 'appr-101',
    workflow_id: 'wf-1',
    workflow_name: 'Purchase Order Approval',
    workflow_type: 'purchase_approval',
    item_ref: 'PO-2026-0892',
    requester: 'Sarah Jenkins',
    requester_role: 'Procurement Specialist',
    requester_avatar: 'SJ',
    department: 'Supply Chain',
    amount: 8450.00,
    current_level: 2,
    total_levels: 3,
    level_label: 'Finance Director Sign-off',
    status: 'Pending',
    priority: 'High',
    sla_deadline: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    sla_status: 'On Track',
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    summary: 'Procurement of 150 units of Wireless Barcode Scanners and accessories from TechSupply Corp.',
    comments: [
      { author: 'Marcus Chen', role: 'Department Manager', decision: 'Approved', text: 'Pricing verified against contract #CN-881. Approved.', time: new Date(Date.now() - 4 * 3600 * 1000).toISOString() }
    ],
    history: [
      { event: 'Submitted', actor: 'Sarah Jenkins', time: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), note: 'PO Created with 150 items' },
      { event: 'Level 1 Approved', actor: 'Marcus Chen', time: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), note: 'Forwarded to Finance Director' }
    ],
    attachments: [
      { name: 'techsupply_quotation_v2.pdf', size: '2.4 MB', type: 'application/pdf' },
      { name: 'inventory_runrate_analysis.xlsx', size: '480 KB', type: 'application/vnd.ms-excel' }
    ]
  },
  {
    id: 'appr-102',
    workflow_id: 'wf-2',
    workflow_name: 'Sales Discount Approval',
    workflow_type: 'sales_discount_approval',
    item_ref: 'INV-DRAFT-441',
    requester: 'Elena Rostova',
    requester_role: 'Senior Cashier',
    requester_avatar: 'ER',
    department: 'Retail POS',
    amount: 1250.00,
    current_level: 1,
    total_levels: 1,
    level_label: 'Store Shift Manager Approval',
    status: 'Pending',
    priority: 'Urgent',
    sla_deadline: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    sla_status: 'Warning',
    created_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    summary: 'POS register requested 20% promotional discount on bulk commercial enterprise transaction.',
    comments: [
      { author: 'Elena Rostova', role: 'Cashier', decision: 'Requested', text: 'VIP customer purchasing display model with cosmetic defect. Requesting 20% discount approval.', time: new Date(Date.now() - 75 * 60 * 1000).toISOString() }
    ],
    history: [
      { event: 'Discount Requested', actor: 'Elena Rostova', time: new Date(Date.now() - 75 * 60 * 1000).toISOString(), note: 'POS Terminal 01 Triggered 20% Discount Override' }
    ],
    attachments: [
      { name: 'damaged_box_photo.jpg', size: '1.2 MB', type: 'image/jpeg' }
    ]
  },
  {
    id: 'appr-103',
    workflow_id: 'wf-3',
    workflow_name: 'Inventory Adjustment Approval',
    workflow_type: 'inventory_adjustment_approval',
    item_ref: 'ADJ-2026-034',
    requester: 'David Miller',
    requester_role: 'Warehouse Controller',
    requester_avatar: 'DM',
    department: 'Warehouse Operations',
    amount: 1420.00,
    current_level: 1,
    total_levels: 2,
    level_label: 'Warehouse Supervisor Review',
    status: 'Overdue',
    priority: 'High',
    sla_deadline: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    sla_status: 'Overdue',
    created_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    summary: 'Damaged merchandise write-down from water pipe leak in Bay C. 12 units damaged beyond repair.',
    comments: [],
    history: [
      { event: 'Submitted', actor: 'David Miller', time: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), note: 'Physical cycle discrepancy recorded' },
      { event: 'SLA Escalation Alert', actor: 'System Engine', time: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), note: 'SLA Deadline exceeded. Automated reminder dispatched.' }
    ],
    attachments: [
      { name: 'incident_inspection_report.pdf', size: '3.1 MB', type: 'application/pdf' }
    ]
  },
  {
    id: 'appr-104',
    workflow_id: 'wf-4',
    workflow_name: 'Customer Credit Approval',
    workflow_type: 'customer_credit_approval',
    item_ref: 'CUST-CR-904',
    requester: 'Marcus Chen',
    requester_role: 'B2B Sales Lead',
    requester_avatar: 'MC',
    department: 'Enterprise Sales',
    amount: 15000.00,
    current_level: 2,
    total_levels: 2,
    level_label: 'Chief Financial Officer Sign-off',
    status: 'Pending',
    priority: 'Medium',
    sla_deadline: new Date(Date.now() + 32 * 3600 * 1000).toISOString(),
    sla_status: 'On Track',
    created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    summary: 'Wholesale partner "Global Retail Logistics" requesting credit limit upgrade from $20,000 to $35,000.',
    comments: [
      { author: 'Rachel Adams', role: 'Credit Risk Analyst', decision: 'Approved', text: 'Dun & Bradstreet rating is 1A. Repayment history over last 24 months is 100% on schedule.', time: new Date(Date.now() - 4 * 3600 * 1000).toISOString() }
    ],
    history: [
      { event: 'Submitted', actor: 'Marcus Chen', time: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), note: 'Application filed with credit docs' },
      { event: 'Tier 1 Approved', actor: 'Rachel Adams', time: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), note: 'Passed credit check without caveats' }
    ],
    attachments: [
      { name: 'credit_bureau_report.pdf', size: '1.8 MB', type: 'application/pdf' },
      { name: 'signed_guarantee_agreement.pdf', size: '2.1 MB', type: 'application/pdf' }
    ]
  },
  {
    id: 'appr-105',
    workflow_id: 'wf-1',
    workflow_name: 'Purchase Order Approval',
    workflow_type: 'purchase_approval',
    item_ref: 'PO-2026-0889',
    requester: 'Sarah Jenkins',
    requester_role: 'Procurement Specialist',
    requester_avatar: 'SJ',
    department: 'Supply Chain',
    amount: 2100.00,
    current_level: 3,
    total_levels: 3,
    level_label: 'Completed',
    status: 'Approved',
    priority: 'Low',
    sla_deadline: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    sla_status: 'On Track',
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    summary: 'Replacement packaging supplies and thermal printing labels for regional distribution hub.',
    comments: [
      { author: 'Marcus Chen', role: 'Department Manager', decision: 'Approved', text: 'Routine supplies order. Approved.', time: new Date(Date.now() - 30 * 3600 * 1000).toISOString() },
      { author: 'Rachel Adams', role: 'Finance Director', decision: 'Approved', text: 'Allocated to Q4 packaging budget.', time: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
      { author: 'Arthur Vance', role: 'Executive Board', decision: 'Approved', text: 'Final sign-off complete. Dispatch order.', time: new Date(Date.now() - 18 * 3600 * 1000).toISOString() }
    ],
    history: [
      { event: 'Submitted', actor: 'Sarah Jenkins', time: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), note: 'PO Created' },
      { event: 'Level 1 Approved', actor: 'Marcus Chen', time: new Date(Date.now() - 30 * 3600 * 1000).toISOString(), note: 'Tier 1 cleared' },
      { event: 'Level 2 Approved', actor: 'Rachel Adams', time: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), note: 'Tier 2 cleared' },
      { event: 'Final Approval', actor: 'Arthur Vance', time: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), note: 'Order issued to supplier' }
    ],
    attachments: [
      { name: 'po_packing_manifest.pdf', size: '1.1 MB', type: 'application/pdf' }
    ]
  },
  {
    id: 'appr-106',
    workflow_id: 'wf-7',
    workflow_name: 'Product Price Change Approval',
    workflow_type: 'product_price_change_approval',
    item_ref: 'PRIC-2026-118',
    requester: 'Alex Thompson',
    requester_role: 'Inventory Lead',
    requester_avatar: 'AT',
    department: 'Merchandising',
    amount: 540.00,
    current_level: 1,
    total_levels: 1,
    level_label: 'Category Commercial Manager Sign-off',
    status: 'Rejected',
    priority: 'Medium',
    sla_deadline: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    sla_status: 'On Track',
    created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    summary: '25% price reduction on slow-moving seasonal merchandise.',
    comments: [
      { author: 'Marcus Chen', role: 'Commercial Director', decision: 'Rejected', text: 'Discount margin too steep before holiday weekend. Re-draft at maximum 12% markdown.', time: new Date(Date.now() - 9 * 3600 * 1000).toISOString() }
    ],
    history: [
      { event: 'Submitted', actor: 'Alex Thompson', time: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), note: 'Price markdown drafted' },
      { event: 'Rejected', actor: 'Marcus Chen', time: new Date(Date.now() - 9 * 3600 * 1000).toISOString(), note: 'Declined due to margin floor' }
    ],
    attachments: [
      { name: 'margin_impact_simulation.xlsx', size: '320 KB', type: 'application/vnd.ms-excel' }
    ]
  }
];

// Initial automation rules
const SEED_RULES = [
  {
    id: 'rule-1',
    name: 'Large Purchase Finance Escalation',
    condition_summary: 'IF Purchase Amount > $5,000',
    logic: { if: { field: 'amount', operator: '>', value: 5000 } },
    actions: ['Route directly to Finance Director', 'Send Urgent Slack Alert'],
    status: 'Active',
    triggers_count: 84
  },
  {
    id: 'rule-2',
    name: 'Depleted Stock Auto-Procurement',
    condition_summary: 'IF Inventory Quantity < Reorder Level',
    logic: { if: { field: 'quantity', operator: '<', value: 'reorder_level' } },
    actions: ['Generate Draft Purchase Order', 'Notify Procurement Lead'],
    status: 'Active',
    triggers_count: 142
  },
  {
    id: 'rule-3',
    name: 'Customer Credit Overdraft Freeze',
    condition_summary: 'IF Customer Credit Balance > Authorized Limit',
    logic: { if: { field: 'credit_balance', operator: '>', value: 'credit_limit' } },
    actions: ['Block POS Transaction', 'Notify Wholesale Account Manager'],
    status: 'Active',
    triggers_count: 16
  },
  {
    id: 'rule-4',
    name: 'Supplier Reliability Guard',
    condition_summary: 'IF Supplier Rating < 3 Stars OR Lead Time > 10 Days',
    logic: { or: [{ field: 'rating', operator: '<', value: 3 }, { field: 'lead_time', operator: '>', value: 10 }] },
    actions: ['Require Manual Approval on All POs', 'Flag Vendor as High Risk'],
    status: 'Active',
    triggers_count: 38
  },
  {
    id: 'rule-5',
    name: 'POS High-Discount Safety Lock',
    condition_summary: 'IF Line Item Discount > 15%',
    logic: { if: { field: 'discount_percent', operator: '>', value: 15 } },
    actions: ['Prompt Manager Override PIN', 'Record Exception in Security Ledger'],
    status: 'Active',
    triggers_count: 195
  }
];

// Seed audit logs
const SEED_AUDIT_LOGS = [
  {
    id: 'log-1',
    event: 'Approval Granted',
    workflow: 'Purchase Order Approval',
    reference: 'PO-2026-0889',
    actor: 'Arthur Vance (Director)',
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    details: 'Final Level 3 approval granted for $2,100.00 purchase order.',
    status: 'Success'
  },
  {
    id: 'log-2',
    event: 'Approval Rejected',
    workflow: 'Product Price Change Approval',
    reference: 'PRIC-2026-118',
    actor: 'Marcus Chen (Manager)',
    timestamp: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    details: 'Price reduction of 25% rejected. Margin floor violation.',
    status: 'Rejected'
  },
  {
    id: 'log-3',
    event: 'Workflow Escalated',
    workflow: 'Inventory Adjustment Approval',
    reference: 'ADJ-2026-034',
    actor: 'System SLA Engine',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    details: 'SLA exceeded 24 hours. Automated escalation notification sent to Store Director.',
    status: 'Escalated'
  },
  {
    id: 'log-4',
    event: 'Approval Granted',
    workflow: 'Purchase Order Approval',
    reference: 'PO-2026-0892',
    actor: 'Marcus Chen (Manager)',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    details: 'Level 1 Manager approval granted for $8,450.00.',
    status: 'Success'
  },
  {
    id: 'log-5',
    event: 'Workflow Executed',
    workflow: 'Sales Discount Approval',
    reference: 'INV-DRAFT-441',
    actor: 'Elena Rostova (Cashier)',
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    details: 'Workflow triggered for 20% discount on order item.',
    status: 'Pending'
  }
];

// Helper to get from local storage or fallback to seed
function getStorageItem(key, fallback) {
  try {
    const stored = localStorage.getItem(`storehub_workflow_${key}`);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  return fallback;
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(`storehub_workflow_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write error:', e);
  }
}

export const workflowService = {
  // WORKFLOW DEFINITIONS
  async getWorkflows() {
    try {
      const res = await apiClient.get('/workflows/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorageItem('definitions', res.data);
        return res.data;
      }
    } catch {
      // Fallback
    }
    return getStorageItem('definitions', SEED_WORKFLOWS);
  },

  async createWorkflow(payload) {
    const newWorkflow = {
      ...payload,
      id: `wf-${Date.now()}`,
      created_at: new Date().toISOString(),
      executions_count: 0,
      success_rate: 100.0,
      status: payload.status || 'Active'
    };

    try {
      await apiClient.post('/workflows/', newWorkflow);
    } catch {
      // Offline fallback
    }

    const current = getStorageItem('definitions', SEED_WORKFLOWS);
    const updated = [newWorkflow, ...current];
    setStorageItem('definitions', updated);
    
    // Log audit
    this.recordAuditLog({
      event: 'Workflow Created',
      workflow: newWorkflow.name,
      reference: newWorkflow.id,
      actor: 'System Admin',
      details: `New workflow "${newWorkflow.name}" registered with ${newWorkflow.approval_levels?.length || 1} approval tier(s).`,
      status: 'Success'
    });

    return newWorkflow;
  },

  async updateWorkflow(id, payload) {
    try {
      await apiClient.put(`/workflows/${id}`, payload);
    } catch {
      // Offline fallback
    }
    const current = getStorageItem('definitions', SEED_WORKFLOWS);
    const updated = current.map(w => w.id === id ? { ...w, ...payload } : w);
    setStorageItem('definitions', updated);
    return updated.find(w => w.id === id);
  },

  async deleteWorkflow(id) {
    try {
      await apiClient.delete(`/workflows/${id}`);
    } catch {
      // Offline fallback
    }
    const current = getStorageItem('definitions', SEED_WORKFLOWS);
    const updated = current.filter(w => w.id !== id);
    setStorageItem('definitions', updated);
    return { success: true };
  },

  // APPROVALS
  async getApprovals() {
    try {
      const res = await apiClient.get('/approvals/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorageItem('approvals', res.data);
        return res.data;
      }
    } catch {
      // Fallback
    }
    return getStorageItem('approvals', SEED_APPROVALS);
  },

  async submitApprovalAction(approvalId, { action, comment = '', delegate_to = '', actor = 'Admin User', role = 'Manager' }) {
    try {
      await apiClient.post(`/approvals/${approvalId}/action`, { action, comment, delegate_to });
    } catch {
      // Offline fallback
    }

    const approvals = getStorageItem('approvals', SEED_APPROVALS);
    const target = approvals.find(a => a.id === approvalId);
    if (!target) return null;

    const now = new Date().toISOString();
    let updatedStatus = target.status;
    let nextLevel = target.current_level;
    let eventName = 'Action Submitted';

    if (action === 'approve') {
      if (target.current_level >= target.total_levels) {
        updatedStatus = 'Approved';
        eventName = 'Final Approval Granted';
      } else {
        nextLevel = target.current_level + 1;
        eventName = `Level ${target.current_level} Approved`;
      }
    } else if (action === 'reject') {
      updatedStatus = 'Rejected';
      eventName = 'Approval Rejected';
    } else if (action === 'request_changes') {
      updatedStatus = 'Changes Requested';
      eventName = 'Changes Requested';
    } else if (action === 'delegate') {
      eventName = `Delegated to ${delegate_to || 'Senior Approver'}`;
    } else if (action === 'escalate') {
      updatedStatus = 'Escalated';
      eventName = 'Manually Escalated to Executive';
    }

    const newComment = comment ? {
      author: actor,
      role: role,
      decision: action.charAt(0).toUpperCase() + action.slice(1),
      text: comment,
      time: now
    } : null;

    const newHistory = {
      event: eventName,
      actor: actor,
      time: now,
      note: comment || `Action "${action}" recorded`
    };

    const updatedApproval = {
      ...target,
      status: updatedStatus,
      current_level: nextLevel,
      comments: newComment ? [...target.comments, newComment] : target.comments,
      history: [...target.history, newHistory]
    };

    const updatedList = approvals.map(a => a.id === approvalId ? updatedApproval : a);
    setStorageItem('approvals', updatedList);

    // Record in audit log
    this.recordAuditLog({
      event: eventName,
      workflow: target.workflow_name,
      reference: target.item_ref,
      actor: `${actor} (${role})`,
      details: comment || `Action "${action}" processed on ${target.item_ref}.`,
      status: updatedStatus === 'Rejected' ? 'Rejected' : (updatedStatus === 'Escalated' ? 'Escalated' : 'Success')
    });

    return updatedApproval;
  },

  // AUTOMATION RULES
  async getAutomationRules() {
    try {
      const res = await apiClient.get('/automation-rules/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStorageItem('rules', res.data);
        return res.data;
      }
    } catch {
      // Fallback
    }
    return getStorageItem('rules', SEED_RULES);
  },

  async createAutomationRule(ruleData) {
    const newRule = {
      ...ruleData,
      id: `rule-${Date.now()}`,
      status: 'Active',
      triggers_count: 0
    };
    try {
      await apiClient.post('/automation-rules/', newRule);
    } catch {
      // Offline fallback
    }
    const current = getStorageItem('rules', SEED_RULES);
    const updated = [newRule, ...current];
    setStorageItem('rules', updated);
    return newRule;
  },

  async toggleAutomationRule(ruleId) {
    const rules = getStorageItem('rules', SEED_RULES);
    const updated = rules.map(r => {
      if (r.id === ruleId) {
        return { ...r, status: r.status === 'Active' ? 'Paused' : 'Active' };
      }
      return r;
    });
    setStorageItem('rules', updated);
    return updated.find(r => r.id === ruleId);
  },

  // AUDIT LOGS
  getAuditLogs() {
    return getStorageItem('audit_logs', SEED_AUDIT_LOGS);
  },

  recordAuditLog(entry) {
    const current = getStorageItem('audit_logs', SEED_AUDIT_LOGS);
    const newEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    const updated = [newEntry, ...current].slice(0, 100);
    setStorageItem('audit_logs', updated);
    return newEntry;
  }
};
