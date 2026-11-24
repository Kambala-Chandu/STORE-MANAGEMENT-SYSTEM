import React from 'react';
export const GRCKPIGrid = ({ kpis }) => (
    <div className="grid grid-cols-4 gap-4 p-4">
        {kpis?.map(k => <div key={k.id} className="bg-[#0B1329] p-4 rounded border border-white/10 text-white">
            <div className="text-slate-400 text-xs">{k.label}</div>
            <div className="text-xl">{k.value}</div>
        </div>)}
    </div>
);
