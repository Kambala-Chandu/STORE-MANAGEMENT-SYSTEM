import React from 'react';
import { Badge } from '../ui/Badge';

export const ShopFloorDashboard = ({ activeOrders, workCenters }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0B1329] border border-white/10 rounded-xl p-5">
          <h4 className="text-slate-400 text-sm mb-1">Active Shift</h4>
          <p className="text-2xl text-white">Morning Shift</p>
          <p className="text-emerald-400 text-sm mt-2">On Track - 85% Efficiency</p>
        </div>
        <div className="bg-[#0B1329] border border-white/10 rounded-xl p-5">
          <h4 className="text-slate-400 text-sm mb-1">Machines Running</h4>
          <p className="text-2xl text-white">
            {workCenters.filter(w => w.status === 'Active').reduce((acc, w) => acc + w.machine_count, 0)} 
            <span className="text-lg text-slate-500"> / {workCenters.reduce((acc, w) => acc + w.machine_count, 0)}</span>
          </p>
        </div>
        <div className="bg-[#0B1329] border border-white/10 rounded-xl p-5">
          <h4 className="text-slate-400 text-sm mb-1">Critical Alerts</h4>
          <p className="text-2xl text-red-400">2</p>
          <p className="text-slate-400 text-sm mt-2">Maintenance required on WC-003</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0B1329] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Machine Status</h3>
          <div className="space-y-4">
            {workCenters.map((wc, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${wc.status === 'Active' ? 'bg-emerald-500' : wc.status === 'Maintenance' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-sm text-white">{wc.name}</p>
                    <p className="text-xs text-slate-400">Load: {wc.utilization_pct}%</p>
                  </div>
                </div>
                <Badge variant="outline">{wc.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0B1329] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Live Production Orders</h3>
          <div className="space-y-4">
            {activeOrders.slice(0, 5).map((order, i) => {
              const pct = Math.min(100, Math.floor((order.actual_qty / order.planned_qty) * 100)) || 0;
              return (
                <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white">{order.order_number} - {order.product}</span>
                    <span className="text-slate-400">{pct}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-2 text-slate-400">
                    <span>{order.work_center}</span>
                    <span>{order.actual_qty} / {order.planned_qty}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
