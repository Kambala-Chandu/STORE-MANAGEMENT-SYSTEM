import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const CapacityPlanningView = ({ data }) => {
  return (
    <div className="bg-[#0B1329] border border-white/10 rounded-xl p-5">
      <h3 className="text-white font-medium mb-6">Capacity vs Actual Load (Hours)</h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="capacity" name="Available Capacity" fill="#3B82F6" opacity={0.3} radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual_load" name="Actual Load" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
