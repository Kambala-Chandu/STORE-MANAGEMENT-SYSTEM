import React from 'react';
export const InventoryOptimizationView = ({ data }) => (
    <div className="bg-[#0B1329] p-4 border border-white/10 rounded-lg text-white">
        <h3 className="mb-4">Inventory Optimization</h3>
        <table className="w-full text-left"><thead><tr><th>Item</th><th>Stock</th><th>Reorder Pt</th><th>Suggested Qty</th><th>Supplier</th><th>Lead Days</th></tr></thead>
        <tbody>{data?.map((r,i) => <tr key={i}><td>{r.item}</td><td>{r.current_stock}</td><td>{r.reorder_point}</td><td>{r.suggested_qty}</td><td>{r.supplier}</td><td>{r.lead_days}</td></tr>)}</tbody></table>
    </div>
);
