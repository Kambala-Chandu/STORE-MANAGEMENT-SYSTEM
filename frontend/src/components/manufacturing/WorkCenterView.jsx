import React from 'react';
import { Badge } from '../ui/Badge';

export const WorkCenterView = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((wc, idx) => (
        <div key={wc.id || idx} className="bg-[#0B1329] border border-white/10 rounded-xl p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-white font-medium">{wc.name}</h3>
              <p className="text-xs text-slate-400">{wc.type}</p>
            </div>
            <Badge variant={wc.status === 'Active' ? 'success' : wc.status === 'Maintenance' ? 'warning' : 'destructive'}>
              {wc.status}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Utilization</span>
                <span className="text-white">{wc.utilization_pct}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${wc.utilization_pct > 90 ? 'bg-red-500' : wc.utilization_pct < 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                  style={{ width: `${wc.utilization_pct}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
              <div className="text-center">
                <p className="text-slate-400 text-xs">Capacity</p>
                <p className="text-white">{wc.capacity_hours}h</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-xs">Machines</p>
                <p className="text-white">{wc.machine_count}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
