import React, { useState } from 'react';
import {
  Users,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

export function AccountsReceivableDashboard({ receivables = [] }) {
  const { addToast } = useToast();
  const [items, setItems] = useState(receivables);
  const [search, setSearch] = useState('');

  const totalOutstanding = items.reduce((sum, r) => sum + (r.outstanding || 0), 0);

  const handleRecordReceipt = (id) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, outstanding: 0, status: 'Settled' } : r)));
    addToast({
      type: 'success',
      title: 'Customer Receipt Processed',
      message: 'Payment collection logged into Accounts Receivable ledger.'
    });
  };

  const filtered = items.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.customer?.toLowerCase().includes(q) || r.invoice_number?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329]">
          <span className="text-xs text-slate-400 block mb-1">Total AR Outstanding</span>
          <span className="text-xl font-bold font-mono text-white">
            ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329]">
          <span className="text-xs text-slate-400 block mb-1">DSO (Days Sales Outstanding)</span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            28.4 Days
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329]">
          <span className="text-xs text-slate-400 block mb-1">Credit Limit Utilization</span>
          <span className="text-xl font-bold font-mono text-primary-soft">
            35.2% Overall
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329]">
          <span className="text-xs text-slate-400 block mb-1">Collection Efficiency Index</span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            96.8%
          </span>
        </div>
      </div>

      {/* AR Aging Schedule */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Accounts Receivable Aging Schedule
        </span>
        <div className="grid grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] text-emerald-400 block">Current (0-30 Days)</span>
            <span className="text-sm font-bold text-white">$245,000.00</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <span className="text-[10px] text-blue-400 block">31-60 Days</span>
            <span className="text-sm font-bold text-white">$48,000.00</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] text-amber-400 block">61-90 Days</span>
            <span className="text-sm font-bold text-white">$18,000.00</span>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <span className="text-[10px] text-rose-400 block">90+ Days (Collections)</span>
            <span className="text-sm font-bold text-rose-400">$7,400.00</span>
          </div>
        </div>
      </div>

      {/* Customer Invoices & Credit Limits */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Trade Receivables & Customer Credit Lines ({filtered.length})
          </h4>
          <input
            type="text"
            placeholder="Search account or invoice #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary font-mono w-56"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Customer Account</th>
                <th className="py-2.5 px-3">Billed ($)</th>
                <th className="py-2.5 px-3">Outstanding ($)</th>
                <th className="py-2.5 px-3">Credit Limit</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Collections</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-3 font-bold text-white">{r.invoice_number}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-200">{r.customer}</td>
                  <td className="py-2.5 px-3 text-slate-300">${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">
                    ${r.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    ${r.credit_limit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{r.due_date}</td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge
                      variant="outline"
                      className={
                        r.status === 'Settled'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]'
                          : r.status === 'Overdue'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]'
                      }
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans">
                    {r.outstanding > 0 ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRecordReceipt(r.id)}
                        className="h-6 text-[10px] px-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Log Receipt
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Collected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
