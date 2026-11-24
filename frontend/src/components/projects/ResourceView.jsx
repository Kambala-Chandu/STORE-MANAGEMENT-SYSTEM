import React from 'react';
import { Users, Briefcase, Award } from 'lucide-react';
import { Badge } from '../ui';

export const ResourceView = ({ resources = [] }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Resource Allocation & Team Capacity</h3>
        <p className="text-xs text-slate-400">Engineering Workload, Active Engagements and Weekly Availability</p>
      </div>

      <div className="bg-[#0B1329] border border-white/10 rounded-xl overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-white/10">
            <tr>
              <th className="p-3.5">Team Member</th>
              <th className="p-3.5">Primary Role</th>
              <th className="p-3.5">Skills & Competencies</th>
              <th className="p-3.5">Allocated Projects</th>
              <th className="p-3.5 text-center">Utilization</th>
              <th className="p-3.5 text-right">Available Hrs/Wk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {resources.map((res) => (
              <tr key={res.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                      {res.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-white">{res.name}</span>
                  </div>
                </td>
                <td className="p-3.5 text-slate-300">{res.role}</td>
                <td className="p-3.5">
                  <div className="flex gap-1 flex-wrap">
                    {res.skills?.map((s, i) => (
                      <span key={i} className="text-[10px] bg-white/5 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3.5">
                  <div className="flex gap-1 flex-wrap">
                    {res.projects?.map((p, i) => (
                      <span key={i} className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 bg-[#050A16] h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full ${
                          res.allocation_pct > 85 ? 'bg-rose-500' : res.allocation_pct > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${res.allocation_pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-white">{res.allocation_pct}%</span>
                  </div>
                </td>
                <td className="p-3.5 text-right font-mono font-semibold text-emerald-400">
                  {res.available_hrs} hrs
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
