import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const DeviceHealthView = ({ health }) => {
  if (!health) return null;
  const data = [
    { name: 'Online', value: health.online, color: '#10B981' },
    { name: 'Offline', value: health.offline, color: '#EF4444' },
    { name: 'Warning', value: health.warning, color: '#F59E0B' }
  ];
  return (
    <div className="p-4 bg-[#0B1329] border border-white/10 rounded h-[400px]">
      <h3 className="text-white mb-4">Fleet Health</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
