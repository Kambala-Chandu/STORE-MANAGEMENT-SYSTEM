import React from 'react';
export const SupplyPlanView = ({ data }) => (
    <div className="bg-[#0B1329] p-4 border border-white/10 rounded-lg text-white">
        <h3 className="mb-4">Supply Plan</h3>
        <table className="w-full text-left"><thead><tr><th>Supplier</th><th>Category</th><th>Planned</th><th>Confirmed</th><th>ETA</th></tr></thead>
        <tbody>{data?.map((r,i) => <tr key={i}><td>{r.supplier}</td><td>{r.category}</td><td>{r.planned_qty}</td><td>{r.confirmed_qty}</td><td>{r.eta}</td></tr>)}</tbody></table>
    </div>
);
