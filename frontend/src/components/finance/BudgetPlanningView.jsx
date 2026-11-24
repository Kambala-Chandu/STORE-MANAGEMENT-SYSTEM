import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Layers,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function BudgetPlanningView({ budgets = [] }) {
  const { addToast } = useToast();
  const [budgetList, setBudgetList] = useState(budgets);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [allocation, setAllocation] = useState('200000');

  const totalAllocated = budgetList.reduce((s, b) => s + (b.allocated || 0), 0);
  const totalActual = budgetList.reduce((s, b) => s + (b.actual || 0), 0);
  const totalVariance = totalAllocated - totalActual;

  const handleCreate = () => {
    if (!deptName.trim()) return;
    const newB = {
      id: `b-${Date.now()}`,
      department: deptName.trim(),
      allocated: parseFloat(allocation) || 0,
      actual: 0,
      variance: parseFloat(allocation) || 0,
      utilization_percent: 0.0,
      status: 'On Track'
    };
    setBudgetList([newB, ...budgetList]);
    addToast({
      type: 'success',
      title: 'Budget Approved',
      message: `Department budget for ${deptName} authorized for fiscal year.`
    });
    setDeptName('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329]">
          <span className="text-xs text-slate-400 block mb-1">Total Fiscal Budget Allocated</span>
          <span className="text-xl font-bold font-mono text-white">
            ${totalAllocated.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329]">
          <span className="text-xs text-slate-400 block mb-1">Total Actual Spend YTD</span>
          <span className="text-xl font-bold font-mono text-slate-200">
            ${totalActual.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329]">
          <span className="text-xs text-slate-400 block mb-1">Favorable Net Budget Variance</span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            +${totalVariance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Department Budget Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Departmental Budget Allocations vs Actual Spend
          </h4>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="text-xs h-7 gap-1 bg-primary hover:bg-primary-hover"
          >
            <Plus className="w-3.5 h-3.5" /> Allocate Budget
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Operating Department</th>
                <th className="py-2.5 px-3 text-right">Allocated Plan ($)</th>
                <th className="py-2.5 px-3 text-right">Actual Incurred ($)</th>
                <th className="py-2.5 px-3 text-right">Remaining Variance ($)</th>
                <th className="py-2.5 px-3">Utilization Rate</th>
                <th className="py-2.5 px-3 text-center">Fiscal Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {budgetList.map((b) => (
                <tr key={b.id || b.department} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">{b.department}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">
                    ${b.allocated.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-3 text-right text-white font-semibold">
                    ${b.actual.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-400">
                    +${b.variance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            b.utilization_percent > 95 ? 'bg-amber-400' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(b.utilization_percent, 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-300">{b.utilization_percent}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <Badge
                      variant="outline"
                      className={
                        b.status === 'Warning'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]'
                      }
                    >
                      {b.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Budget Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Authorize Departmental Fiscal Budget"
        size="md"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Operating Department / Cost Center</label>
            <input
              type="text"
              placeholder="e.g. Marketing & Commercial Growth"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Annual Authorized Allocation ($)</label>
            <input
              type="number"
              step="1000"
              value={allocation}
              onChange={(e) => setAllocation(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <Button variant="ghost" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreate}
              disabled={!deptName.trim()}
              className="text-xs bg-primary hover:bg-primary-hover"
            >
              Approve Budget
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
