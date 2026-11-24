import React from 'react';
import { Calendar } from 'lucide-react';

export const GanttView = ({ projects = [] }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Project Schedule & Gantt Timeline</h3>
        <p className="text-xs text-slate-400">Quarterly Milestones, Critical Path and Execution Windows</p>
      </div>

      <div className="bg-[#0B1329] border border-white/10 rounded-xl overflow-x-auto shadow-2xl p-5">
        {/* Header with months */}
        <div className="min-w-[700px]">
          <div className="grid grid-cols-12 gap-1 pb-3 border-b border-white/10 text-center text-xs font-semibold text-slate-400">
            <div className="col-span-3 text-left pl-2">Project & Department</div>
            {months.slice(2, 11).map((m, i) => (
              <div key={i} className="col-span-1">{m} 2026</div>
            ))}
          </div>

          {/* Project Timeline Bars */}
          <div className="divide-y divide-white/5 mt-2">
            {projects.map((proj, idx) => {
              // Simple bar offset based on index for clean visualization
              const startOffset = Math.min(6, (idx * 1.2) + 0.5);
              const barWidth = Math.max(2, 6 - (idx * 0.4));

              return (
                <div key={proj.id} className="grid grid-cols-12 gap-1 py-3.5 items-center hover:bg-white/[0.02]">
                  <div className="col-span-3 pl-2">
                    <div className="text-xs font-semibold text-white truncate">{proj.name}</div>
                    <div className="text-[10px] text-slate-400">{proj.department} &bull; {proj.progress_pct}%</div>
                  </div>
                  <div className="col-span-9 relative h-6 flex items-center bg-[#050A16]/50 rounded border border-white/5">
                    <div
                      className="absolute h-4 rounded-md bg-gradient-to-r from-blue-600 to-primary flex items-center px-2 shadow-md shadow-primary/20 text-[10px] font-mono text-white font-semibold whitespace-nowrap"
                      style={{
                        left: `${(startOffset / 9) * 100}%`,
                        width: `${(barWidth / 9) * 100}%`
                      }}
                    >
                      {proj.progress_pct}% Complete
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
