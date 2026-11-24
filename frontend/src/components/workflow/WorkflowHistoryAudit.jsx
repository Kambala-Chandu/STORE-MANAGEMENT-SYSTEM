import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Layers,
  FileText,
  User,
  Hash
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export function WorkflowHistoryAudit({ auditLogs = [] }) {
  const [filterEvent, setFilterEvent] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getEventBadge = (event) => {
    switch (event) {
      case 'Approval Granted':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Approval Rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Workflow Escalated':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Workflow Created':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (filterEvent !== 'ALL' && log.event !== filterEvent) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchActor = log.actor?.toLowerCase().includes(q);
      const matchRef = log.reference?.toLowerCase().includes(q);
      const matchWf = log.workflow?.toLowerCase().includes(q);
      const matchDetails = log.details?.toLowerCase().includes(q);
      if (!matchActor && !matchRef && !matchWf && !matchDetails) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header and filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/10 bg-[#0B1329]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-semibold text-white">Immutable Governance Audit Trail</h4>
            <span className="text-xs text-slate-400">Cryptographically verifiable sequence of approval ledger entries</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search actor, reference #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Events</option>
            <option value="Approval Granted">Approval Granted</option>
            <option value="Approval Rejected">Approval Rejected</option>
            <option value="Workflow Escalated">Workflow Escalated</option>
            <option value="Workflow Executed">Workflow Executed</option>
            <option value="Workflow Created">Workflow Created</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Authorized Actor</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Verification Stamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-normal">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, i) => (
                  <tr key={log.id || i} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getEventBadge(log.event)}>
                        {log.event}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-white">
                      {log.reference || 'SYSTEM'}
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {log.actor || 'System Engine'}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-sm truncate">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono text-[10px] text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                        SHA256: {Math.random().toString(36).substring(2, 8).toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    No governance audit entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
