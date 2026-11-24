import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const DefectTrackingView = ({ defects = [] }) => {
  const chartData = defects.map((d) => ({
    name: d.category,
    value: d.occurrences
  }));

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Defect Tracking & Pareto Classification</h3>
        <p className="text-xs text-slate-400">PPM Defect Density, Assembly Lines and Financial Scrap Impact</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie Chart */}
        <div className="bg-[#0B1329] border border-white/10 rounded-xl p-4 shadow-xl flex flex-col items-center">
          <h4 className="text-xs font-semibold text-slate-300 mb-2 self-start">Defect Distribution by Category</h4>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defects Table */}
        <div className="lg:col-span-2 bg-[#0B1329] border border-white/10 rounded-xl overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-white/10">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Defect Description</th>
                <th className="p-3.5">Line Location</th>
                <th className="p-3.5 text-right">Occurrences</th>
                <th className="p-3.5 text-right">Cost Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {defects.map((d) => (
                <tr key={d.code} className="hover:bg-white/[0.03] transition-colors">
                  <td className="p-3.5 font-mono text-rose-400 font-semibold">{d.code}</td>
                  <td className="p-3.5 text-slate-300">{d.category}</td>
                  <td className="p-3.5 text-white font-medium">{d.description}</td>
                  <td className="p-3.5 text-slate-400">{d.line}</td>
                  <td className="p-3.5 text-right font-mono font-semibold text-white">{d.occurrences}</td>
                  <td className="p-3.5 text-right font-mono text-rose-300 font-semibold">${d.cost_impact?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
