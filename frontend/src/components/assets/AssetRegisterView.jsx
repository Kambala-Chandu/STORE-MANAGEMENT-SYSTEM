import React from 'react';
export const AssetRegisterView = ({ data }) => (
    <div className="bg-[#0B1329] p-4 border border-white/10 rounded-lg text-white">
        <h3 className="mb-4">Asset Register</h3>
        <table className="w-full text-left"><thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Location</th><th>Value</th><th>Status</th></tr></thead>
        <tbody>{data?.map((r,i) => <tr key={i}><td>{r.asset_id}</td><td>{r.name}</td><td>{r.category}</td><td>{r.location}</td><td>{r.current_value}</td><td>{r.status}</td></tr>)}</tbody></table>
    </div>
);
