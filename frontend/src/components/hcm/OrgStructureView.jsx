import React from 'react';
import {
  Building2,
  Users,
  DollarSign,
  Briefcase,
  ChevronDown,
  User,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function OrgStructureView({ departments = [], employees = [] }) {
  const leadership = [
    {
      role: 'Chief Operating Officer (COO)',
      name: 'Sarah Jenkins',
      reports: 'Board of Directors',
      supervises: 'All Department Directors',
      location: 'HQ Corporate',
      teamSize: 95
    }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Tier Card */}
      <div className="p-5 rounded-xl border border-primary/30 bg-gradient-to-r from-[#0B1329] via-[#050A16] to-[#0B1329] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black text-xl shadow-lg shadow-primary/10">
              SJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  Tier-1 Executive
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: SH-1004</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5">Sarah Jenkins</h3>
              <p className="text-xs text-slate-300 font-medium">Chief Operating Officer (COO) • Corporate Executive Committee</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="text-right">
              <span className="text-slate-400 block text-[11px] uppercase">Enterprise Organization</span>
              <span className="text-lg font-bold text-white font-mono">95 Total Staff</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px] uppercase">Operating Division</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">5 Departments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hierarchy Connector Label */}
      <div className="flex items-center justify-center">
        <div className="px-3 py-1 rounded-full border border-white/10 bg-[#0B1329] text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
          <ChevronDown className="w-3.5 h-3.5 text-primary" />
          Direct Departmental Reports & Division Heads
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4 hover:border-primary/40 transition group"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/15 text-primary font-bold">
                  {dept.code}
                </span>
                <h4 className="text-base font-bold text-white mt-1.5 group-hover:text-primary transition">
                  {dept.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  {dept.branch}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Headcount</span>
                <span className="text-base font-extrabold text-white font-mono">{dept.head_count}</span>
              </div>
            </div>

            {/* Department Head */}
            <div className="p-3 rounded-lg bg-[#050A16] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                  {dept.head?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Department Head</span>
                  <span className="font-bold text-white text-xs">{dept.head}</span>
                </div>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                Authorized
              </Badge>
            </div>

            {/* Functional Teams */}
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Operational Units & Teams
              </span>
              <div className="flex flex-wrap gap-1.5">
                {dept.teams?.map((team, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-md text-[11px] bg-white/[0.04] border border-white/5 text-slate-300"
                  >
                    {team}
                  </span>
                ))}
              </div>
            </div>

            {/* Fiscal Allocation Footer */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Annual Payroll Budget: <strong className="text-white font-mono">${(dept.budget || 250000).toLocaleString()}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
