import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const statusColors = {
  'Planned': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'In Progress': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Completed': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'Cancelled': 'bg-red-500/10 text-red-500 border-red-500/20'
};

export const ProductionOrdersView = ({ data, onUpdateStatus }) => {
  return (
    <div className="bg-[#0B1329] border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-white font-medium">Production Orders</h3>
        <Button variant="primary" size="sm">Create Order</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="p-4">Order #</th>
              <th className="p-4">Product</th>
              <th className="p-4">Work Center</th>
              <th className="p-4">Qty (Act/Plan)</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, idx) => (
              <tr key={order.id || idx} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-white">{order.order_number}</td>
                <td className="p-4">{order.product}</td>
                <td className="p-4">{order.work_center}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span>{order.actual_qty}</span>
                    <span className="text-slate-500">/</span>
                    <span>{order.planned_qty}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 mt-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full" 
                      style={{ width: `${Math.min(100, (order.actual_qty / order.planned_qty) * 100)}%` }}
                    />
                  </div>
                </td>
                <td className="p-4 text-xs">
                  <div>S: {order.start_date}</div>
                  <div>E: {order.end_date}</div>
                </td>
                <td className="p-4">
                  <Badge className={statusColors[order.status] || 'bg-slate-500/10 text-slate-400'}>
                    {order.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <select 
                    className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white"
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
