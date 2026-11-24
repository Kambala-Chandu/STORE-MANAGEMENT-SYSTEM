import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const MRPView = ({ data }) => {
  return (
    <div className="bg-[#0B1329] border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-white font-medium">Material Requirements Planning</h3>
        <Button variant="primary" size="sm">Run MRP Engine</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Required Qty</th>
              <th className="p-4">On Hand</th>
              <th className="p-4">Shortage/Surplus</th>
              <th className="p-4">Lead Days</th>
              <th className="p-4">Recommended Order</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const shortage = item.on_hand - item.required_qty;
              const isShort = shortage < 0;
              return (
                <tr key={item.id || idx} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white font-medium">{item.item}</td>
                  <td className="p-4">{item.required_qty}</td>
                  <td className="p-4">{item.on_hand}</td>
                  <td className="p-4">
                    <span className={isShort ? 'text-red-400' : 'text-emerald-400'}>
                      {shortage}
                    </span>
                  </td>
                  <td className="p-4">{item.lead_days} days</td>
                  <td className="p-4">
                    {isShort ? (
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        Order {Math.abs(shortage) + (item.to_order || 0)}
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">No action</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
