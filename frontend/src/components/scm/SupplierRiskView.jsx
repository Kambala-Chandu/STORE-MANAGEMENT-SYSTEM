import React from 'react';
export const SupplierRiskView = ({ data }) => (
    <div className="bg-[#0B1329] p-4 border border-white/10 rounded-lg text-white">
        <h3 className="mb-4">Supplier Risk</h3>
        <div className="grid grid-cols-3 gap-4">{data?.map((r,i) => <div key={i} className="border border-white/10 p-2"><h4>{r.supplier}</h4><p>{r.risk}</p></div>)}</div>
    </div>
);
