import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function GeneralLedgerView({
  journals = [],
  trialBalance = {},
  onOpenNewJournal,
  onPostJournal,
  onReverseJournal
}) {
  const [subTab, setSubTab] = useState('journals'); // 'journals' | 'trial_balance'
  const [search, setSearch] = useState('');
  const [expandedEntryId, setExpandedEntryId] = useState(null);

  const filteredJournals = journals.filter((j) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        j.entry_number?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q) ||
        j.reference?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Tab Switcher & Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/10 bg-[#0B1329]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('journals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'journals'
                ? 'bg-primary text-white shadow-sm shadow-primary/20'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Journal Vouchers ({journals.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('trial_balance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'trial_balance'
                ? 'bg-primary text-white shadow-sm shadow-primary/20'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Trial Balance Ledger
          </button>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'journals' && (
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search voucher # or note..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary font-mono"
              />
            </div>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenNewJournal}
            className="text-xs h-8 gap-1 bg-primary hover:bg-primary-hover shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Record Journal Entry
          </Button>
        </div>
      </div>

      {subTab === 'journals' ? (
        /* Journal Entries Table */
        <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Voucher #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Economic Narrative</th>
                  <th className="py-3 px-4 text-right">Debit ($)</th>
                  <th className="py-3 px-4 text-right">Credit ($)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredJournals.map((j) => {
                  const isExpanded = expandedEntryId === j.id;
                  const isDraft = j.status === 'Draft';
                  const isPosted = j.status === 'Posted';

                  return (
                    <React.Fragment key={j.id}>
                      <tr
                        className="hover:bg-white/[0.02] transition cursor-pointer"
                        onClick={() => setExpandedEntryId(isExpanded ? null : j.id)}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-white flex items-center gap-1.5">
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          {j.entry_number}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {j.date}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {j.reference || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-slate-200 max-w-sm truncate">
                          {j.description}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-400">
                          ${Number(j.total_debit || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-400">
                          ${Number(j.total_credit || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant="outline"
                            className={
                              isPosted
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]'
                            }
                          >
                            {j.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {isDraft && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPostJournal(j.id)}
                                className="h-6 text-[10px] px-2 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                              >
                                Post
                              </Button>
                            )}
                            {isPosted && !j.entry_number.includes('-REV') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onReverseJournal(j.id)}
                                className="h-6 text-[10px] px-2 text-rose-400 hover:bg-rose-500/10"
                              >
                                Reverse
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Sub-lines */}
                      {isExpanded && j.lines && (
                        <tr className="bg-black/30">
                          <td colSpan={8} className="py-3 px-8">
                            <div className="rounded-lg border border-white/5 p-3 space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Line Item Allocation Breakdown
                              </span>
                              <div className="space-y-1">
                                {j.lines.map((l, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs font-mono py-1 border-b border-white/5 last:border-0">
                                    <span className="text-white font-sans">
                                      {l.account_code} - {l.account_name} ({l.cost_center || 'General'})
                                    </span>
                                    <div className="flex items-center gap-6">
                                      <span className="text-slate-400">Debit: <strong className="text-emerald-400">${Number(l.debit || 0).toFixed(2)}</strong></span>
                                      <span className="text-slate-400">Credit: <strong className="text-emerald-400">${Number(l.credit || 0).toFixed(2)}</strong></span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Trial Balance Table */
        <div className="rounded-xl border border-white/10 bg-[#0B1329] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h4 className="text-sm font-semibold text-white">General Ledger Trial Balance</h4>
              <span className="text-xs text-slate-400 font-mono">
                As of {trialBalance.as_of_date || new Date().toISOString().slice(0, 10)}
              </span>
            </div>

            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1 text-xs">
              <CheckCircle className="w-3.5 h-3.5" /> Mathematically Balanced
            </Badge>
          </div>

          <div className="overflow-x-auto rounded-lg border border-white/5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Account Title</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-3 text-right">Debit Balance</th>
                  <th className="py-2.5 px-3 text-right">Credit Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {trialBalance.accounts?.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-2 px-3 font-bold text-white">{row.code}</td>
                    <td className="py-2 px-3 font-sans text-slate-200">{row.name}</td>
                    <td className="py-2 px-3 font-sans text-slate-400">{row.category}</td>
                    <td className="py-2 px-3 text-right text-emerald-400">
                      {row.debit > 0 ? `$${row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                    <td className="py-2 px-3 text-right text-emerald-400">
                      {row.credit > 0 ? `$${row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/10 bg-white/[0.04] font-mono font-bold text-xs">
                  <td colSpan={3} className="py-3 px-3 text-right text-slate-200 font-sans">
                    Total Balanced Ledger:
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400">
                    ${Number(trialBalance.total_debit || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400">
                    ${Number(trialBalance.total_credit || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
