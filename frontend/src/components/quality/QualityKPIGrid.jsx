import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const QualityKPIGrid = ({ kpis = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
      {kpis.map((kpi, idx) => {
        const isUp = kpi.trendDir === 'up';
        const isDown = kpi.trendDir === 'down';
        const isPositive = (isUp && kpi.color === 'emerald') || (isDown && kpi.color === 'emerald');

        return (
          <div
            key={idx}
            className="bg-[#0B1329] border border-white/10 rounded-xl p-3.5 shadow-lg flex flex-col justify-between hover:border-white/20 transition-all"
          >
            <div className="text-[11px] text-slate-400 font-medium truncate mb-1">
              {kpi.label}
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-xl font-bold font-mono text-white tracking-tight">
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className="text-xs text-slate-400 font-medium">{kpi.unit}</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] pt-1">
              {isUp ? (
                <TrendingUp className={`w-3 h-3 ${isPositive ? 'text-emerald-400' : 'text-blue-400'}`} />
              ) : isDown ? (
                <TrendingDown className={`w-3 h-3 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`} />
              ) : (
                <Minus className="w-3 h-3 text-slate-400" />
              )}
              <span className={isPositive ? 'text-emerald-400 font-medium' : 'text-slate-400 font-medium'}>
                {kpi.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
