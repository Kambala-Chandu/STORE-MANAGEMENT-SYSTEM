import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Tag,
  Filter
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export function ChartOfAccountsView({ accounts = [], onCreateAccount }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New account form
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Assets');
  const [newSubCategory, setNewSubCategory] = useState('Current Assets');
  const [newType, setNewType] = useState('Debit');
  const [newBalance, setNewBalance] = useState('0.00');

  const filtered = accounts.filter((a) => {
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.code?.toLowerCase().includes(q) || a.name?.toLowerCase().includes(q) || a.subCategory?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreate = () => {
    if (!newCode.trim() || !newName.trim()) return;
    onCreateAccount({
      code: newCode.trim(),
      name: newName.trim(),
      category: newCategory,
      subCategory: newSubCategory,
      type: newType,
      balance: parseFloat(newBalance) || 0
    });
    setNewCode('');
    setNewName('');
    setNewBalance('0.00');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/10 bg-[#0B1329]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="text-xs h-8 gap-1 bg-primary hover:bg-primary-hover shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Account
          </Button>
        </div>
      </div>

      {/* Accounts Ledger Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Account Code</th>
                <th className="py-3 px-4">Account Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Sub-Classification</th>
                <th className="py-3 px-4">Normal Balance</th>
                <th className="py-3 px-4 text-right">Current Ledger Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((acc) => (
                <tr key={acc.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {acc.code}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">
                    {acc.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-semibold text-slate-300">
                      {acc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {acc.subCategory}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {acc.type}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                    ${Number(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                      {acc.status || 'Active'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register General Ledger Account"
        size="md"
      >
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Account Code</label>
              <input
                type="text"
                placeholder="e.g. 1040"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Normal Balance Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
              >
                <option value="Debit">Debit (Assets, Expenses)</option>
                <option value="Credit">Credit (Liabilities, Equity, Revenue)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Account Name / Title</label>
            <input
              type="text"
              placeholder="e.g. Petty Cash Regional Branch"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Primary Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
              >
                <option value="Assets">Assets</option>
                <option value="Liabilities">Liabilities</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expenses">Expenses</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Sub-Classification</label>
              <input
                type="text"
                placeholder="e.g. Current Assets, Bank"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Initial Opening Balance ($)</label>
            <input
              type="number"
              step="0.01"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-primary"
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
              disabled={!newCode.trim() || !newName.trim()}
              className="text-xs bg-primary hover:bg-primary-hover"
            >
              Register Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
