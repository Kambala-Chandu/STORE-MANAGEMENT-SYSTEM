import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  GitBranch,
  CheckCircle,
  HelpCircle,
  Bell,
  Zap,
  Flag,
  Plus,
  Trash2,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  Settings,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const NODE_TYPES = {
  Start: {
    icon: Play,
    color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    desc: 'Triggers on domain event'
  },
  Condition: {
    icon: GitBranch,
    color: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    desc: 'Evaluates logic expression'
  },
  Approval: {
    icon: CheckCircle,
    color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    desc: 'Human authorization gate'
  },
  Decision: {
    icon: HelpCircle,
    color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    desc: 'Branching condition fork'
  },
  Notification: {
    icon: Bell,
    color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    desc: 'Dispatches multi-channel alerts'
  },
  'API Action': {
    icon: Zap,
    color: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    desc: 'Automated REST / GL execution'
  },
  End: {
    icon: Flag,
    color: 'border-slate-500/40 bg-slate-900/40 text-slate-300',
    badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    desc: 'Workflow termination state'
  }
};

export function VisualWorkflowDesigner({ nodes = [], onChange, readOnly = false }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [insertIndex, setInsertIndex] = useState(null);

  const activeNodes = nodes.length > 0 ? nodes : [
    { id: 'n-start', type: 'Start', label: 'Workflow Initiated', config: { trigger: 'System Event' } },
    { id: 'n-appr', type: 'Approval', label: 'Tier 1 Manager Sign-off', config: { approver: 'Manager', sla: '24h' } },
    { id: 'n-end', type: 'End', label: 'Completed State', config: {} }
  ];

  const handleMoveNode = (index, direction) => {
    if (readOnly || !onChange) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= activeNodes.length) return;
    const updated = [...activeNodes];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
  };

  const handleDeleteNode = (index) => {
    if (readOnly || !onChange || activeNodes.length <= 2) return;
    const updated = activeNodes.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleAddNode = (type) => {
    if (readOnly || !onChange) return;
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      label: `New ${type} Step`,
      config: type === 'Approval' ? { approver: 'Department Lead', sla: '24h' } : {}
    };

    const updated = [...activeNodes];
    if (insertIndex !== null && insertIndex < updated.length) {
      updated.splice(insertIndex + 1, 0, newNode);
    } else {
      // Insert before End node if possible
      const endIdx = updated.findIndex((n) => n.type === 'End');
      if (endIdx > 0) {
        updated.splice(endIdx, 0, newNode);
      } else {
        updated.push(newNode);
      }
    }
    onChange(updated);
    setShowAddMenu(false);
    setInsertIndex(null);
  };

  const selectedNode = activeNodes.find((n) => n.id === selectedNodeId);

  const handleConfigChange = (key, value) => {
    if (readOnly || !onChange || !selectedNode) return;
    const updated = activeNodes.map((n) => {
      if (n.id === selectedNode.id) {
        return {
          ...n,
          config: {
            ...n.config,
            [key]: value
          }
        };
      }
      return n;
    });
    onChange(updated);
  };

  const handleLabelChange = (newLabel) => {
    if (readOnly || !onChange || !selectedNode) return;
    const updated = activeNodes.map((n) => (n.id === selectedNode.id ? { ...n, label: newLabel } : n));
    onChange(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
      {/* Visual Canvas */}
      <div className="lg:col-span-8 flex flex-col items-center justify-start py-6 px-4 rounded-xl border border-white/10 bg-[#070D1E]/80 backdrop-blur-md relative overflow-y-auto max-h-[640px]">
        {/* Background Dot Grid */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="w-full max-w-xl flex flex-col items-center space-y-3 z-10">
          <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-primary-soft" />
              Interactive Execution Pipeline ({activeNodes.length} Nodes)
            </span>
            {!readOnly && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 gap-1"
                onClick={() => {
                  setInsertIndex(activeNodes.length - 2 >= 0 ? activeNodes.length - 2 : 0);
                  setShowAddMenu(true);
                }}
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </Button>
            )}
          </div>

          <AnimatePresence>
            {activeNodes.map((node, index) => {
              const meta = NODE_TYPES[node.type] || NODE_TYPES.Condition;
              const Icon = meta.icon;
              const isSelected = selectedNodeId === node.id;
              const isFirst = index === 0;
              const isLast = index === activeNodes.length - 1;

              return (
                <React.Fragment key={node.id}>
                  {/* Connector Line & Quick Insert */}
                  {!isFirst && (
                    <div className="flex flex-col items-center py-1 group/connector relative">
                      <div className="w-0.5 h-6 bg-gradient-to-b from-primary/60 to-primary/20" />
                      <div className="w-3 h-3 rounded-full border border-primary/40 bg-[#070D1E] flex items-center justify-center -my-1 text-[8px] text-primary/70">
                        <ArrowDown className="w-2.5 h-2.5" />
                      </div>
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => {
                            setInsertIndex(index - 1);
                            setShowAddMenu(true);
                          }}
                          className="absolute opacity-0 group-hover/connector:opacity-100 transition-opacity bg-primary hover:bg-primary-hover text-white rounded-full p-1 shadow-lg shadow-primary/30 -top-1"
                          title="Insert node here"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Node Card */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full group cursor-pointer transition-all duration-200 rounded-xl border p-4 backdrop-blur-md relative ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30 bg-[#0D1733] shadow-lg shadow-primary/10'
                        : `${meta.color} hover:border-white/30 hover:bg-[#0B1530]`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-lg border flex items-center justify-center ${meta.badge}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Step {index + 1}: {node.type}
                            </span>
                            {node.config?.sla && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                                SLA: {node.config.sla}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-white mt-0.5">{node.label}</h4>
                        </div>
                      </div>

                      {/* Controls */}
                      {!readOnly && (
                        <div
                          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!isFirst && (
                            <button
                              type="button"
                              onClick={() => handleMoveNode(index, -1)}
                              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                              title="Move up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {!isLast && (
                            <button
                              type="button"
                              onClick={() => handleMoveNode(index, 1)}
                              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                              title="Move down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {!isFirst && !isLast && (
                            <button
                              type="button"
                              onClick={() => handleDeleteNode(index)}
                              className="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400"
                              title="Delete node"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Summary Details */}
                    {Object.keys(node.config || {}).length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-2 text-xs text-slate-300">
                        {Object.entries(node.config).map(([k, v]) => (
                          <span
                            key={k}
                            className="bg-black/30 border border-white/5 px-2 py-0.5 rounded text-[11px] text-slate-300"
                          >
                            <strong className="text-slate-400 font-normal capitalize">{k}:</strong> {String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Node Configuration Inspector */}
      <div className="lg:col-span-4 rounded-xl border border-white/10 bg-[#0B1329] p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Settings className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-white">Node Inspector</h3>
          </div>

          {selectedNode ? (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Node Type</label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={NODE_TYPES[selectedNode.type]?.badge}>
                    {selectedNode.type}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {NODE_TYPES[selectedNode.type]?.desc}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Step Label</label>
                <input
                  type="text"
                  value={selectedNode.label}
                  disabled={readOnly}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary disabled:opacity-50"
                />
              </div>

              {selectedNode.type === 'Approval' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Approver Role / Group</label>
                    <select
                      value={selectedNode.config?.approver || 'Manager'}
                      disabled={readOnly}
                      onChange={(e) => handleConfigChange('approver', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="Manager">Department Manager</option>
                      <option value="Finance">Finance Lead</option>
                      <option value="Director">Executive Director</option>
                      <option value="Admin">Security Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">SLA Target</label>
                    <select
                      value={selectedNode.config?.sla || '24h'}
                      disabled={readOnly}
                      onChange={(e) => handleConfigChange('sla', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="2h">2 Hours (Emergency / POS)</option>
                      <option value="8h">8 Hours (Same Day Shift)</option>
                      <option value="24h">24 Hours (1 Business Day)</option>
                      <option value="48h">48 Hours (2 Business Days)</option>
                      <option value="72h">72 Hours (Executive Board)</option>
                    </select>
                  </div>
                </>
              )}

              {selectedNode.type === 'Condition' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Logic Condition</label>
                    <input
                      type="text"
                      placeholder="e.g. amount >= 1000"
                      value={selectedNode.config?.condition || ''}
                      disabled={readOnly}
                      onChange={(e) => handleConfigChange('condition', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </>
              )}

              {selectedNode.type === 'Notification' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Dispatch Channel</label>
                  <select
                    value={selectedNode.config?.channel || 'Email'}
                    disabled={readOnly}
                    onChange={(e) => handleConfigChange('channel', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Email">Email Notification</option>
                    <option value="In-App">In-App Banner Alert</option>
                    <option value="Activity Center">Activity Center Log</option>
                    <option value="All">All Multi-Channels</option>
                  </select>
                </div>
              )}

              {selectedNode.type === 'API Action' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Target Endpoint</label>
                  <input
                    type="text"
                    placeholder="/api/v1/resource/action"
                    value={selectedNode.config?.endpoint || ''}
                    disabled={readOnly}
                    onChange={(e) => handleConfigChange('endpoint', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-primary"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
              <Info className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm">Click on any workflow node on the canvas to inspect and configure its execution rules.</p>
            </div>
          )}
        </div>

        {/* Available Node Types palette */}
        {!readOnly && (
          <div className="pt-4 border-t border-white/10 mt-6">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Insert Step Node
            </span>
            <div className="grid grid-cols-2 gap-2">
              {['Condition', 'Approval', 'Decision', 'Notification', 'API Action'].map((type) => {
                const meta = NODE_TYPES[type];
                const Icon = meta.icon;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleAddNode(type)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-primary/40 transition text-left text-xs text-slate-300 hover:text-white"
                  >
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate">{type}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
