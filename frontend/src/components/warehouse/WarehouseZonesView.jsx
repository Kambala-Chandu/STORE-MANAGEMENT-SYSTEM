import React from 'react';
import { Badge } from '../ui';

export const WarehouseZonesView = ({ data }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map(zone => (
                <div key={zone.id} className="bg-[#0B1329] border border-white/10 p-6 rounded-xl shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="text-lg font-bold text-white">{zone.name}</h4>
                            <div className="text-sm text-slate-400 mt-1">{zone.bins} Bins</div>
                        </div>
                        <Badge>{zone.status}</Badge>
                    </div>
                    
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Utilization</span>
                            <span>{zone.utilization}%</span>
                        </div>
                        <div className="w-full bg-[#050A16] h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${zone.utilization > 80 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${zone.utilization}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Temp:</span>
                        <span className={`${zone.temp.includes('-') ? 'text-blue-400 font-bold' : 'text-white'}`}>{zone.temp}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
