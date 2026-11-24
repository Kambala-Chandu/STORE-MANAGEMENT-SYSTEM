import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Building,
  DollarSign,
  TrendingUp,
  PieChart,
  User,
  ArrowRight,
  Edit2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function CostCenterView({ costCenters = [] }) {
  const { addToast } = useToast();
  const [centers, setCenters] = useState(
    costCenters.length > 0
      ? costCenters
      : [
          { id: 'cc-1', code: 'CC-100', name: 'Retail Store Operations', manager: 'Elena Rostova', budget: 320000, spend: 298400, type: 'Department', branch: 'Main Flagship' },
          { id: 'cc-2', code: 'CC-200', name: 'Central Logistics Hub', manager: 'David Miller', budget: 480000, spend: 420800, type: 'Warehouse', branch: 'East Distribution' },
          { id: 'cc-3', code: 'CC-300', name: 'IT Infrastructure & Cloud ERP', manager: 'Marcus Chen', budget: 180000, spend: 164200, type: 'Cost Center', branch: 'HQ' },
          { id: 'cc-4', code: 'CC-400', name: 'Commercial B2B Sales Unit', manager: 'Sarah Jenkins', budget: 250000, spend: 198000, type: 'Profit Center', branch: 'HQ Commercial' }
        ]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  const [newCenter, setNewCenter] = useState({
    code: '',
    name: '',
    manager: '',
    budget: '',
    type: 'Department',
    branch: 'HQ'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCenter.code || !newCenter.name || !newCenter.budget) {
      addToast({ title: 'Validation Error', message: 'All marked fields are required.', type: 'danger' });
      return;
    }
    const created = {
      id: `cc-${Date.now()}`,
      code: newCenter.code.toUpperCase(),
      name: newCenter.name,
      manager: newCenter.manager || 'Unassigned',
      budget: parseFloat(newCenter.budget),
      spend: 0,
      type: newCenter.type,
      branch: newCenter.branch
    };
    setCenters([...centers, created]);
    setIsModalOpen(false);
    setNewCenter({ code: '', name: '', manager: '', budget: '', type: 'Department', branch: 'HQ' });
    addToast({
      title: 'Cost Center Registered',
      message: `${created.code} (${created.name}) created with $${created.budget.toLocaleString()} allocation.`,
      type: 'success'
    });
  };

  const filtered = filterType === 'ALL' ? centers : centers.filter(c => c.type === filterType);

  const totalBudget = centers.reduce((sum, c) => sum + c.budget, 0);
  const totalSpend = centers.reduce((sum, c) => sum + c.spend, 0);

  return (
    <div className="space-y-4">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Total Corporate Allocation</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            ${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">{centers.length} active allocation cost units</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Cumulative Absorbed Spend</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
            ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {((totalSpend / (totalBudget || 1)) * 100).toFixed(1)}% portfolio utilization
          </p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Unexpended Balance</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-400 font-mono">
            ${(totalBudget - totalSpend).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">Remaining fiscal cushion</p>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-lg p-1 bg-[#050A16] border border-white/10">
          {['ALL', 'Department', 'Warehouse', 'Cost Center', 'Profit Center'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filterType === t ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {t === 'ALL' ? 'All Units' : t}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs shadow-md shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Cost / Profit Center
        </Button>
      </div>

      {/* Cost Center Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const util = ((item.spend / (item.budget || 1)) * 100);
          const remaining = item.budget - item.spend;
          const isWarning = util > 90;

          return (
            <div key={item.id} className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4 hover:border-primary/40 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                      {item.code}
                    </span>
                    <Badge variant={item.type === 'Profit Center' ? 'success' : 'outline'} className="text-[10px]">
                      {item.type}
                    </Badge>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1.5">{item.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3 h-3" /> {item.branch} • <User className="w-3 h-3 ml-1" /> {item.manager}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block uppercase">Allocation</span>
                  <span className="text-lg font-extrabold text-white font-mono">
                    ${item.budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">
                    Spend: <strong className="text-white font-mono">${item.spend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                  </span>
                  <span className={`font-bold font-mono ${isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {util.toFixed(1)}% Used
                  </span>
                </div>
                <div className="w-full bg-[#050A16] h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      util > 95 ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(util, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Remaining Cushion: <strong className="text-emerald-400 font-mono">${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    addToast({
                      title: 'Cost Center Ledger Opened',
                      message: `Drilling into line-item ledger expenditures for ${item.code}.`,
                      type: 'info'
                    });
                  }}
                  className="text-xs text-primary hover:text-white"
                >
                  View Ledger <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Center Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Cost / Profit Center"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. CC-500"
                value={newCenter.code}
                onChange={(e) => setNewCenter({ ...newCenter, code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Unit Classification</label>
              <select
                value={newCenter.type}
                onChange={(e) => setNewCenter({ ...newCenter, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Department">Department</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Cost Center">Cost Center</option>
                <option value="Profit Center">Profit Center</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Center Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Customer Success & Service"
              value={newCenter.name}
              onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Assigned Manager</label>
              <input
                type="text"
                placeholder="e.g. Elena Rostova"
                value={newCenter.manager}
                onChange={(e) => setNewCenter({ ...newCenter, manager: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Operating Branch</label>
              <input
                type="text"
                placeholder="e.g. HQ Central"
                value={newCenter.branch}
                onChange={(e) => setNewCenter({ ...newCenter, branch: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Annual Budget Allocation ($) *</label>
            <input
              type="number"
              step="1000"
              required
              placeholder="100000"
              value={newCenter.budget}
              onChange={(e) => setNewCenter({ ...newCenter, budget: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-xs border-white/10 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="text-xs"
            >
              Save Cost Center
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
