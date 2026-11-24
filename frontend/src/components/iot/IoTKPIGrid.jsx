import React from 'react';

export const IoTKPIGrid = ({ kpis }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
    {kpis.map((kpi, i) => (
      <div key={i} className="bg-[#0B1329] border border-white/10 p-4 rounded">
        <p className="text-slate-400 text-xs">{kpi.label}</p>
        <p className="text-white text-xl font-bold">{kpi.value}</p>
        <p className="text-xs text-green-400">{kpi.trend}</p>
      </div>
    ))}
  </div>
);
