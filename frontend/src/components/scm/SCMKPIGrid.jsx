import React from 'react';
export const SCMKPIGrid = ({ kpis }) => (
    <div className="grid grid-cols-4 gap-4 text-white">
        {kpis?.map((k,i) => <div key={i} className="bg-[#0B1329] p-4 border border-white/10 rounded-lg"><h4>{k.title}</h4><div className="text-2xl">{k.value}</div></div>)}
    </div>
);
