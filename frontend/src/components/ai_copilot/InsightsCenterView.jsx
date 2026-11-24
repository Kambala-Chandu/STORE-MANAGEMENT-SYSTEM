import React from 'react';

export const InsightsCenterView = ({ insights }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {insights.map(ins => (
      <div key={ins.id} className="p-4 bg-[#0B1329] border border-white/10 rounded">
        <div className="flex justify-between items-center mb-2">
          <span className={`px-2 py-1 text-xs rounded ${ins.type==='Anomaly'?'bg-red-500/20 text-red-500':ins.type==='Opportunity'?'bg-green-500/20 text-green-500':ins.type==='Risk'?'bg-amber-500/20 text-amber-500':'bg-blue-500/20 text-blue-500'}`}>{ins.type}</span>
          <span className="text-xs text-slate-400">Conf: {ins.confidence_pct}%</span>
        </div>
        <p className="text-white font-medium mb-1">{ins.description}</p>
        <p className="text-slate-400 text-sm mb-4">Impact: {ins.impact}</p>
        <button className="w-full py-2 bg-white/5 text-primary rounded hover:bg-white/10">{ins.recommended_action}</button>
      </div>
    ))}
  </div>
);
