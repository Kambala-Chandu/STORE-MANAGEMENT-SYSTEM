import React, { useState } from 'react';
import {
  Truck,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  Search,
  DollarSign
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

export function AccountsPayableDashboard({ payables = [] }) {
  const { addToast } = useToast();
  const [bills, setBills] = useState(payables);
  const [search, setSearch] = useState('');

  const totalOutstanding = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
  const overdueCount = bills.filter((b) => b.status === 'Overdue').length;

  const handleQuickPay = (billId) => {
    setBills((prev) => prev.map((b) => (b.id === billId ? { ...b, status: 'Paid' } : b)));
    addToast({
      type: 'success',
      title: 'Disbursement Executed',
      message: `Vendor bill payment cleared via automated ACH transfer.`
    });
  };

  const filtered = bills.filter((b) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return b.vendor?.toLowerCase().includes(q) || b.bill_number?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329]">
          <span className="text-xs text-slate-400 block mb-1">Total AP Outstanding</span>
          <span className="text-xl font-bold font-mono text-white">
            ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329]">
          <span className="text-xs text-slate-400 block mb-1">Overdue Invoices</span>
          <span className="text-xl font-bold font-mono text-rose-400">
            {overdueCount} Flagged
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329]">
          <span className="text-xs text-slate-400 block mb-1">Average Payment Terms</span>
          <span className="text-xl font-bold font-mono text-slate-200">
            Net 30 Days
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329]">
          <span className="text-xs text-slate-400 block mb-1">Approval Compliance</span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            100% Verified
          </span>
        </div>
      </div>

      {/* Aging Distribution Bins */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Accounts Payable Aging Schedule
        </span>
        <div className="grid grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] text-emerald-400 block">Current (0-30 Days)</span>
            <span className="text-sm font-bold text-white">$195,000.00</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <span className="text-[10px] text-blue-400 block">31-60 Days</span>
            <span className="text-sm font-bold text-white">$35,000.00</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] text-amber-400 block">61-90 Days</span>
            <span className="text-sm font-bold text-white">$10,500.00</span>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <span className="text-[10px] text-rose-400 block">90+ Days</span>
            <span className="text-sm font-bold text-rose-400">$2,000.00</span>
          </div>
        </div>
      </div>

      {/* Vendor Bills Ledger */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Vendor Bills & Scheduled Disbursements ({filtered.length})
          </h4>
          <input
            type="text"
            placeholder="Search vendor or bill #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary font-mono w-56"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Bill Number</th>
                <th className="py-2.5 px-3">Contracted Vendor</th>
                <th className="py-2.5 px-3">Amount ($)</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Aging Bracket</th>
                <th className="py-2.5 px-3">Approval Gate</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-3 font-bold text-white">{b.bill_number}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-200">{b.vendor}</td>
                  <td className="py-2.5 px-3 font-bold text-white">${b.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-2.5 px-3 text-slate-400">{b.due_date}</td>
                  <td className="py-2.5 px-3 text-slate-300">{b.aging}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] text-emerald-400 font-sans font-semibold">
                      {b.approval_status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge
                      variant="outline"
                      className={
                        b.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]'
                          : b.status === 'Overdue'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]'
                      }
                    >
                      {b.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans">
                    {b.status !== 'Paid' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleQuickPay(b.id)}
                        className="h-6 text-[10px] px-2 bg-primary hover:bg-primary-hover"
                      >
                        Disburse
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-500">Settled</span>
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
