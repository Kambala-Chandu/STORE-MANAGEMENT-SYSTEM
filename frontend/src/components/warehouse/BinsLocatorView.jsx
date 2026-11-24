import React, { useState } from 'react';
import { Badge } from '../ui';

export const BinsLocatorView = ({ data }) => {
    const [zoneFilter, setZoneFilter] = useState('All');
    const filtered = zoneFilter === 'All' ? data : data.filter(d => d.zone === zoneFilter);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Bin Locator</h3>
                <select value={zoneFilter} onChange={e=>setZoneFilter(e.target.value)} className="bg-[#050A16] border border-white/10 p-2 rounded text-white">
                    <option value="All">All Zones</option>
                    <option value="Bulk Storage A">Bulk Storage A</option>
                    <option value="Bulk Storage B">Bulk Storage B</option>
                    <option value="Cold Chain">Cold Chain</option>
                </select>
            </div>
            
            <div className="bg-[#0B1329] border border-white/10 rounded-lg overflow-x-auto shadow-2xl">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-white/5 text-white">
                        <tr>
                            <th className="p-4">Bin ID</th>
                            <th className="p-4">Location (Aisle/Row/Lvl)</th>
                            <th className="p-4">Item Stored</th>
                            <th className="p-4">Capacity</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item, idx) => (
                            <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                                <td className="p-4 text-white font-medium">{item.bin_id}</td>
                                <td className="p-4">{item.aisle} / {item.row} / {item.level}</td>
                                <td className="p-4">{item.item_stored}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-[#050A16] h-2 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full" style={{width: `${item.capacity_pct}%`}}></div>
                                        </div>
                                        <span>{item.capacity_pct}%</span>
                                    </div>
                                </td>
                                <td className="p-4"><Badge>{item.status}</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
