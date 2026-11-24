import React from 'react';
import { Badge } from '../ui';

export const ShippingView = ({ data }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Outbound Shipments</h3>
            
            <div className="bg-[#0B1329] border border-white/10 rounded-lg overflow-x-auto shadow-2xl">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-white/5 text-white">
                        <tr>
                            <th className="p-4">Order Ref</th>
                            <th className="p-4">Carrier</th>
                            <th className="p-4">Tracking Number</th>
                            <th className="p-4">Destination</th>
                            <th className="p-4">Weight</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="p-4 text-white font-medium">{item.order_ref}</td>
                                <td className="p-4">{item.carrier}</td>
                                <td className="p-4">{item.tracking}</td>
                                <td className="p-4">{item.destination}</td>
                                <td className="p-4">{item.weight}</td>
                                <td className="p-4"><Badge>{item.status}</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
