import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  AlertTriangle,
  ShieldAlert,
  Zap,
  CheckCircle,
  TrendingDown,
  Building,
  ArrowUpRight
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function SLAMonitoringWidget({ slaAlerts = [], onSelectAlert }) {
  const departmentVelocity = [
    { department: 'Store Shift Managers', avgTime: '1.2h', target: '2.0h', status: 'Optimal', compliance: 98 },
    { department: 'Supply Chain & Procurement', avgTime: '4.8h', target: '24.0h', status: 'Optimal', compliance: 96 },
    { department: 'Finance & Controller', avgTime: '18.4h', target: '48.0h', status: 'Optimal', compliance: 94 },
    { department: 'Executive Board', avgTime: '34.2h', target: '72.0h', status: 'Optimal', compliance: 91 },
    { department: 'Warehouse Supervisors', avgTime: '14.6h', target: '12.0h', status: 'At Risk', compliance: 82 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* SLA Health & Urgent Breaches */}
      <div className="lg:col-span-6 rounded-xl border border-white/10 bg-[#0B1329] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">SLA Breach & Escalation Watch</h3>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 font-mono">
            {slaAlerts.length} Actionable Alert(s)
          </span>
        </div>

        <div className="space-y-3">
          {slaAlerts.length > 0 ? (
            slaAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onSelectAlert && onSelectAlert(alert)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                  alert.isOverdue
                    ? 'border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/30'
                    : 'border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg mt-0.5 ${
                      alert.isOverdue ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{alert.ref}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          alert.isOverdue ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {alert.isOverdue ? 'OVERDUE BREACH' : 'APPROACHING BREACH'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 block mt-0.5">{alert.workflow}</span>
                    <span className="text-[11px] text-slate-400">Initiator: {alert.requester}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Deadline</span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      alert.isOverdue ? 'text-rose-400' : 'text-amber-300'
                    }`}
                  >
                    {new Date(alert.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
              <span>All active approval workflows are currently within designated SLA targets.</span>
            </div>
          )}
        </div>
      </div>

      {/* Department Turnaround Velocity */}
      <div className="lg:col-span-6 rounded-xl border border-white/10 bg-[#0B1329] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-primary-soft" />
            <h3 className="text-sm font-semibold text-white">Department Turnaround Velocity</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Last 30 Days</span>
        </div>

        <div className="space-y-3.5">
          {departmentVelocity.map((dep, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-white">{dep.department}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-400">Avg: {dep.avgTime}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-400">Target: {dep.target}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      dep.status === 'Optimal'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {dep.compliance}% on-time
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    dep.status === 'Optimal' ? 'bg-primary' : 'bg-rose-500'
                  }`}
                  style={{ width: `${dep.compliance}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
