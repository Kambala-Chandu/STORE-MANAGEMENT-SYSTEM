import React from 'react';
import * as LucideIcons from 'lucide-react';

export const ManufacturingKPIGrid = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
      {kpis.map((kpi, idx) => {
        const IconComponent = LucideIcons[kpi.icon] || LucideIcons.Activity;
        return (
          <div key={idx} className="bg-[#0B1329] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg bg-white/5 ${kpi.color}`}>
                <IconComponent size={18} />
              </div>
              <div className={`text-xs flex items-center gap-1 ${kpi.trendDir === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.trendDir === 'up' ? <LucideIcons.ArrowUpRight size={14} /> : <LucideIcons.ArrowDownRight size={14} />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1 truncate">{kpi.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-xl font-semibold">{kpi.value}</span>
                <span className="text-slate-500 text-xs">{kpi.unit}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
