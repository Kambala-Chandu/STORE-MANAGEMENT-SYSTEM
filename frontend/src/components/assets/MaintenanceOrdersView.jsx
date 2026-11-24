import React from 'react';
export const MaintenanceOrdersView = ({ data }) => (
    <div className="bg-[#0B1329] p-4 border border-white/10 rounded-lg text-white">
        <h3 className="mb-4">Maintenance Orders</h3>
        <table className="w-full text-left"><thead><tr><th>ID</th><th>Type</th><th>Asset</th><th>Status</th></tr></thead>
        <tbody>{data?.map((r,i) => <tr key={i}><td>{r.id}</td><td>{r.type}</td><td>{r.asset}</td><td>{r.status}</td></tr>)}</tbody></table>
    </div>
);
