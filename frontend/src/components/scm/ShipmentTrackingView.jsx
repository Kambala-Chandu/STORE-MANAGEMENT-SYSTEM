import React from 'react';
export const ShipmentTrackingView = ({ data }) => (
    <div className="bg-[#0B1329] p-4 border border-white/10 rounded-lg text-white">
        <h3 className="mb-4">Shipments</h3>
        <table className="w-full text-left"><thead><tr><th>Carrier</th><th>Tracking</th><th>Status</th><th>ETA</th></tr></thead>
        <tbody>{data?.map((r,i) => <tr key={i}><td>{r.carrier}</td><td>{r.tracking}</td><td>{r.status}</td><td>{r.eta}</td></tr>)}</tbody></table>
    </div>
);
