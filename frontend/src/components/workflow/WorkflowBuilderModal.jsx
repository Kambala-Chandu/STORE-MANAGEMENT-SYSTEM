import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Plus,
  Trash2,
  GitBranch,
  Shield,
  Bell,
  Zap,
  CheckCircle2,
  Sliders,
  Eye
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { VisualWorkflowDesigner } from './VisualWorkflowDesigner';

const WORKFLOW_TEMPLATES = [
  {
    type: 'purchase_approval',
    name: 'Purchase Order Approval',
    trigger: 'Purchase Order Created >= $1,000',
    description: 'Multi-tier authorization hierarchy for procurement orders exceeding $1,000.',
    tiers: [
      { level: 1, role: 'Manager', label: 'Department Manager Review', sla_hours: 24 },
      { level: 2, role: 'Finance', label: 'Finance Director Sign-off', sla_hours: 48 },
      { level: 3, role: 'Director', label: 'Executive Board Authorization', sla_hours: 72 }
    ],
    nodes: [
      { id: 'n-1', type: 'Start', label: 'PO Submission', config: { event: 'po_created' } },
      { id: 'n-2', type: 'Condition', label: 'Amount >= $1,000', config: { field: 'amount', operator: '>=', val: 1000 } },
      { id: 'n-3', type: 'Approval', label: 'Tier 1: Manager Sign-off', config: { approver: 'Store Manager', sla: '24h' } },
      { id: 'n-4', type: 'Approval', label: 'Tier 2: Finance Director', config: { approver: 'Finance Head', sla: '48h' } },
      { id: 'n-5', type: 'Notification', label: 'Notify Purchasing Dept', config: { channel: 'Email' } },
      { id: 'n-6', type: 'API Action', label: 'Dispatch PO to Supplier', config: { endpoint: '/api/v1/purchases/dispatch' } },
      { id: 'n-7', type: 'End', label: 'PO Dispatched', config: {} }
    ]
  },
  {
    type: 'sales_discount_approval',
    name: 'Sales Discount Approval',
    trigger: 'POS Cart Discount > 15%',
    description: 'Requires supervisor override when discount applied at POS register exceeds 15%.',
    tiers: [
      { level: 1, role: 'Manager', label: 'Store Shift Manager Approval', sla_hours: 2 }
    ],
    nodes: [
      { id: 'n-1', type: 'Start', label: 'POS Item Scanned', config: {} },
      { id: 'n-2', type: 'Condition', label: 'Discount > 15%', config: { field: 'discount', operator: '>', val: 15 } },
      { id: 'n-3', type: 'Approval', label: 'Manager PIN Override', config: { approver: 'Shift Supervisor', sla: '2h' } },
      { id: 'n-4', type: 'Decision', label: 'Approved or Override?', config: {} },
      { id: 'n-5', type: 'End', label: 'Cart Total Updated', config: {} }
    ]
  },
  {
    type: 'inventory_adjustment_approval',
    name: 'Inventory Adjustment Approval',
    trigger: 'Stock Discrepancy > $250',
    description: 'Mandatory sign-off for negative inventory write-offs or discrepancies over $250.',
    tiers: [
      { level: 1, role: 'Manager', label: 'Warehouse Supervisor Review', sla_hours: 12 },
      { level: 2, role: 'Finance', label: 'Inventory Controller Confirmation', sla_hours: 24 }
    ],
    nodes: [
      { id: 'n-1', type: 'Start', label: 'Cycle Count Variance Logged', config: {} },
      { id: 'n-2', type: 'Approval', label: 'Warehouse Manager Review', config: { approver: 'Warehouse Lead', sla: '12h' } },
      { id: 'n-3', type: 'Approval', label: 'Inventory Controller Sign-off', config: { approver: 'Finance', sla: '24h' } },
      { id: 'n-4', type: 'End', label: 'Ledger Rebalanced', config: {} }
    ]
  },
  {
    type: 'customer_credit_approval',
    name: 'Customer Credit Approval',
    trigger: 'Credit Limit Increase > $5,000',
    description: 'Risk assessment & executive credit line authorization for wholesale accounts.',
    tiers: [
      { level: 1, role: 'Finance', label: 'Credit Risk Analyst Evaluation', sla_hours: 24 },
      { level: 2, role: 'Director', label: 'Chief Financial Officer Sign-off', sla_hours: 48 }
    ],
    nodes: [
      { id: 'n-1', type: 'Start', label: 'Credit Line Request', config: {} },
      { id: 'n-2', type: 'Approval', label: 'Risk Analyst Assessment', config: { approver: 'Risk Analyst', sla: '24h' } },
      { id: 'n-3', type: 'Approval', label: 'CFO Final Approval', config: { approver: 'CFO', sla: '48h' } },
      { id: 'n-4', type: 'End', label: 'Credit Line Active', config: {} }
    ]
  },
  {
    type: 'supplier_approval',
    name: 'Supplier Onboarding Approval',
    trigger: 'New Supplier Registration Submitted',
    description: 'Vendor compliance verification, tax document checks, and commercial terms agreement.',
    tiers: [
      { level: 1, role: 'Manager', label: 'Procurement Lead Verification', sla_hours: 24 },
      { level: 2, role: 'Admin', label: 'Legal & Tax Compliance Audit', sla_hours: 48 }
    ],
    nodes: [
      { id: 'n-1', type: 'Start', label: 'Vendor Submission', config: {} },
      { id: 'n-2', type: 'Approval', label: 'Procurement Verification', config: { approver: 'Procurement Lead', sla: '24h' } },
      { id: 'n-3', type: 'Approval', label: 'Legal/Tax Compliance Audit', config: { approver: 'Admin Lead', sla: '48h' } },
      { id: 'n-4', type: 'End', label: 'Supplier Activated', config: {} }
    ]
  },
  {
    type: 'user_creation_approval',
    name: 'User Creation & Role Authorization',
    trigger: 'User Account Created with Admin/Manager Role',
    description: 'Secures administrative role elevation and newly created employee user accounts.',
    tiers: [
      { level: 1, role: 'Admin', label: 'Security Officer Authorization', sla_hours: 8 }
    ],
    nodes: [
      { id: 'n-1', type: 'Start', label: 'New User Registered', config: {} },
      { id: 'n-2', type: 'Approval', label: 'Security Officer Sign-off', config: { approver: 'Security Admin', sla: '8h' } },
      { id: 'n-3', type: 'End', label: 'User Account Provisioned', config: {} }
    ]
  },
  {
    type: 'product_price_change_approval',
    name: 'Product Price Change Approval',
    trigger: 'Price Revision Delta > 10%',
    description: 'Governs retail price revisions and catalog markdowns exceeding 10%.',
    tiers: [
      { level: 1, role: 'Manager', label: 'Category Commercial Manager Sign-off', sla_hours: 12 }
    ],
    nodes: [
      { id: 'n-1', type: 'Start', label: 'Price Modification Drafted', config: {} },
      { id: 'n-2', type: 'Approval', label: 'Commercial Manager Review', config: { approver: 'Category Lead', sla: '12h' } },
      { id: 'n-3', type: 'End', label: 'Price Active in POS', config: {} }
    ]
  },
  {
    type: 'stock_transfer_approval',
    name: 'Stock Transfer Approval',
    trigger: 'Inter-branch Movement Requested >= 100 units',
    description: 'Inter-warehouse inventory relocation authorization for high-volume movements.',
    tiers: [
      { level: 1, role: 'Manager', label: 'Source Warehouse Lead Release', sla_hours: 8 },
      { level: 2, role: 'Manager', label: 'Destination Warehouse Receipt Sign-off', sla_hours: 24 }
    ],
    nodes: [
      { id: 'n-1', type: 'Start', label: 'Transfer Request Created', config: {} },
      { id: 'n-2', type: 'Approval', label: 'Source Warehouse Release', config: { approver: 'Source Lead', sla: '8h' } },
      { id: 'n-3', type: 'Approval', label: 'Destination Receipt Verification', config: { approver: 'Dest Lead', sla: '24h' } },
      { id: 'n-4', type: 'End', label: 'Transfer Finalized', config: {} }
    ]
  }
];

export function WorkflowBuilderModal({ isOpen, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('setup'); // 'setup' | 'designer'
  const [selectedTemplateType, setSelectedTemplateType] = useState('purchase_approval');

  const [name, setName] = useState('Purchase Order Approval');
  const [description, setDescription] = useState(
    'Multi-tier authorization hierarchy for procurement orders exceeding $1,000.'
  );
  const [trigger, setTrigger] = useState('Purchase Order Created >= $1,000');
  const [approvalLevels, setApprovalLevels] = useState([
    { level: 1, role: 'Manager', label: 'Department Manager Review', sla_hours: 24 },
    { level: 2, role: 'Finance', label: 'Finance Director Sign-off', sla_hours: 48 },
    { level: 3, role: 'Director', label: 'Executive Board Authorization', sla_hours: 72 }
  ]);
  const [nodes, setNodes] = useState(WORKFLOW_TEMPLATES[0].nodes);

  const handleSelectTemplate = (type) => {
    const tmpl = WORKFLOW_TEMPLATES.find((t) => t.type === type);
    if (!tmpl) return;
    setSelectedTemplateType(type);
    setName(tmpl.name);
    setDescription(tmpl.description);
    setTrigger(tmpl.trigger);
    setApprovalLevels(tmpl.tiers);
    setNodes(tmpl.nodes);
  };

  const handleAddLevel = () => {
    const nextLevelNum = approvalLevels.length + 1;
    setApprovalLevels([
      ...approvalLevels,
      {
        level: nextLevelNum,
        role: 'Finance',
        label: `Tier ${nextLevelNum} Review`,
        sla_hours: 24
      }
    ]);
  };

  const handleRemoveLevel = (index) => {
    if (approvalLevels.length <= 1) return;
    setApprovalLevels(approvalLevels.filter((_, i) => i !== index));
  };

  const handleUpdateLevel = (index, key, val) => {
    const updated = [...approvalLevels];
    updated[index] = { ...updated[index], [key]: val };
    setApprovalLevels(updated);
  };

  const handleSaveWorkflow = () => {
    onSave({
      name,
      type: selectedTemplateType,
      description,
      trigger,
      approval_levels: approvalLevels,
      nodes,
      notifications: ['Email', 'In-App', 'Activity Center'],
      auto_actions: ['Log Compliance Audit Trail']
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enterprise Workflow Builder & Designer"
      size="2xl"
    >
      <div className="space-y-5">
        {/* Navigation tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('setup')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                activeTab === 'setup'
                  ? 'bg-primary text-white'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              1. Definition & Hierarchy Setup
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('designer')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'designer'
                  ? 'bg-primary text-white'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> 2. Visual Pipeline Designer ({nodes.length} Nodes)
            </button>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Template: {WORKFLOW_TEMPLATES.find((t) => t.type === selectedTemplateType)?.name}
          </span>
        </div>

        {activeTab === 'setup' ? (
          <div className="space-y-5">
            {/* Template Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Select Pre-Configured Enterprise Pattern
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WORKFLOW_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.type}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl.type)}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      selectedTemplateType === tmpl.type
                        ? 'border-primary bg-primary/10 text-white'
                        : 'border-white/5 bg-white/[0.02] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-medium block truncate">{tmpl.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5 font-mono">
                      {tmpl.tiers.length} Tier(s)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Workflow Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Trigger Event</label>
                <input
                  type="text"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Description / Policy Purpose</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Multi-Level Approval Hierarchy Editor */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Approval Hierarchy Tiers ({approvalLevels.length} Levels)
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddLevel}
                  className="text-xs h-7 gap-1 text-primary-soft hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Tier
                </Button>
              </div>

              <div className="space-y-2">
                {approvalLevels.map((lvl, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-mono font-bold text-primary-soft shrink-0">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={lvl.label}
                      onChange={(e) => handleUpdateLevel(idx, 'label', e.target.value)}
                      placeholder="Step Label"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                    />

                    <select
                      value={lvl.role}
                      onChange={(e) => handleUpdateLevel(idx, 'role', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                    >
                      <option value="Manager">Manager</option>
                      <option value="Finance">Finance</option>
                      <option value="Director">Director</option>
                      <option value="Admin">Security Admin</option>
                    </select>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">SLA:</span>
                      <input
                        type="number"
                        min="1"
                        max="168"
                        value={lvl.sla_hours}
                        onChange={(e) => handleUpdateLevel(idx, 'sla_hours', Number(e.target.value))}
                        className="w-16 px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white text-center font-mono focus:outline-none focus:border-primary"
                      />
                      <span className="text-[11px] text-slate-400">hrs</span>
                    </div>

                    <button
                      type="button"
                      disabled={approvalLevels.length <= 1}
                      onClick={() => handleRemoveLevel(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 disabled:opacity-30 transition"
                      title="Remove tier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <VisualWorkflowDesigner nodes={nodes} onChange={setNodes} />
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveWorkflow}
            className="text-xs bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20"
          >
            Deploy & Activate Workflow
          </Button>
        </div>
      </div>
    </Modal>
  );
}
