import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Plus,
  Play,
  ToggleLeft,
  ToggleRight,
  Trash2,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function AutomationRulesBuilder({ rules = [], onToggleRule, onCreateRule }) {
  const { addToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [targetField, setTargetField] = useState('amount');
  const [operator, setOperator] = useState('>');
  const [thresholdValue, setThresholdValue] = useState('5000');
  const [chosenAction, setChosenAction] = useState('Route to Finance Director');

  const [testingRuleId, setTestingRuleId] = useState(null);

  const handleTestRule = (rule) => {
    setTestingRuleId(rule.id);
    setTimeout(() => {
      setTestingRuleId(null);
      addToast({
        type: 'success',
        title: 'Rule Test Passed',
        message: `Condition "${rule.condition_summary}" evaluated TRUE. Action "${rule.actions[0]}" triggered simulated dispatch.`
      });
    }, 800);
  };

  const handleSaveNewRule = () => {
    if (!ruleName.trim()) return;

    onCreateRule({
      name: ruleName,
      condition_summary: `IF ${targetField} ${operator} ${thresholdValue}`,
      logic: { if: { field: targetField, operator: operator, value: Number(thresholdValue) || thresholdValue } },
      actions: [chosenAction]
    });

    setIsAddModalOpen(false);
    setRuleName('');
    setThresholdValue('5000');
  };

  return (
    <div className="space-y-6">
      {/* Header & New Rule Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Automation Engine & Guardrail Rules
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Event-driven triggers that enforce compliance, automate PO creation, and route authorizations instantly.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5 text-xs h-9 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5" /> Create Automation Rule
        </Button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => {
          const isActive = rule.status === 'Active';

          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-5 transition-all relative ${
                isActive
                  ? 'border-white/10 bg-[#0B1329] hover:border-primary/40'
                  : 'border-white/5 bg-white/[0.01] opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-lg border ${
                      isActive
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{rule.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Fired {rule.triggers_count || 0} times
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleRule(rule.id)}
                    className="text-slate-400 hover:text-white transition"
                    title={isActive ? 'Pause Rule' : 'Activate Rule'}
                  >
                    {isActive ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Condition & Action Logic Visual */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-slate-300">
                  <span className="text-primary-soft font-bold">CONDITION:</span> {rule.condition_summary}
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-slate-300 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">ACTION:</span>
                  <div className="flex flex-wrap gap-1">
                    {rule.actions?.map((act, i) => (
                      <span
                        key={i}
                        className="bg-white/5 px-2 py-0.5 rounded text-[11px] border border-white/5 text-white"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer action test */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }
                >
                  {rule.status}
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTestRule(rule)}
                  disabled={testingRuleId === rule.id}
                  className="h-7 text-[11px] gap-1 text-slate-300 hover:text-white"
                >
                  <Play className="w-3 h-3 text-amber-400" />
                  {testingRuleId === rule.id ? 'Simulating...' : 'Test Trigger'}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Rule Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Enterprise Automation Rule"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Rule Description / Name</label>
            <input
              type="text"
              placeholder="e.g., Block Sale if Customer Over Credit Limit"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Field</label>
              <select
                value={targetField}
                onChange={(e) => setTargetField(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
              >
                <option value="amount">PO Amount ($)</option>
                <option value="discount_percent">Discount Percentage (%)</option>
                <option value="quantity">Inventory Stock Level</option>
                <option value="credit_balance">Customer Credit Balance</option>
                <option value="rating">Supplier Rating</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Operator</label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary font-mono"
              >
                <option value=">">Greater than (&gt;)</option>
                <option value=">=">Greater or Equal (&gt;=)</option>
                <option value="<">Less than (&lt;)</option>
                <option value="<=">Less or Equal (&lt;=)</option>
                <option value="==">Equals (==)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Threshold Value</label>
              <input
                type="text"
                placeholder="5000"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Automated Action (THEN)</label>
            <select
              value={chosenAction}
              onChange={(e) => setChosenAction(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
            >
              <option value="Route to Finance Director">Route to Finance Director for Approval</option>
              <option value="Generate Draft Purchase Order">Auto-Generate Draft Purchase Order</option>
              <option value="Block POS Transaction">Block POS Transaction with Supervisor PIN</option>
              <option value="Require Manual Approval on POs">Require Manual Procurement Sign-off</option>
              <option value="Dispatch Urgent Notification">Dispatch High-Priority SMS & In-App Notice</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!ruleName.trim()}
              onClick={handleSaveNewRule}
              className="bg-primary hover:bg-primary-hover"
            >
              Activate Automation Rule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
