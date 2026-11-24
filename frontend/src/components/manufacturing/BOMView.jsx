import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const BOMView = ({ data }) => {
  return (
    <div className="bg-[#0B1329] border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-white font-medium">Bill of Materials</h3>
        <Button variant="primary" size="sm">+ Add BOM</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="p-4">Item Name</th>
              <th className="p-4">Version</th>
              <th className="p-4">Components</th>
              <th className="p-4">Yield %</th>
              <th className="p-4">Standard Cost</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((bom, idx) => (
              <tr key={bom.id || idx} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-white font-medium">{bom.name}</td>
                <td className="p-4"><Badge variant="outline">{bom.version}</Badge></td>
                <td className="p-4">{bom.components_count} items</td>
                <td className="p-4">
                  <span className={bom.yield_pct >= 95 ? 'text-emerald-400' : 'text-amber-400'}>{bom.yield_pct}%</span>
                </td>
                <td className="p-4">${bom.standard_cost}</td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
