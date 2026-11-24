import React from 'react';
import { Badge, Button } from '../ui';

export const CycleCountView = ({ data }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Cycle Count Schedule</h3>
            
            <div className="bg-[#0B1329] border border-white/10 rounded-lg overflow-x-auto shadow-2xl">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-white/5 text-white">
                        <tr>
                            <th className="p-4">Zone</th>
                            <th className="p-4">Bin Range</th>
                            <th className="p-4">Last Counted</th>
                            <th className="p-4">Variance %</th>
                            <th className="p-4">Next Due</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="p-4 text-white font-medium">{item.zone}</td>
                                <td className="p-4">{item.bin_range}</td>
                                <td className="p-4">{item.last_counted}</td>
                                <td className="p-4">{item.variance_pct}%</td>
                                <td className="p-4">{item.next_due}</td>
                                <td className="p-4"><Badge>{item.status}</Badge></td>
                                <td className="p-4">
                                    <Button className="bg-white/5 text-primary hover:text-white px-3 py-1 rounded">Start Count</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
