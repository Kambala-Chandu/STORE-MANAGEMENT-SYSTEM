import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const SensorReadingsView = ({ readings }) => (
  <div className="p-4 bg-[#0B1329] border border-white/10 rounded h-[500px]">
    <h3 className="text-white mb-4">Sensor Readings</h3>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={readings}>
        <XAxis dataKey="time" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)' }} />
        <Line type="monotone" dataKey="temperature" stroke="#3B82F6" />
        <Line type="monotone" dataKey="humidity" stroke="#10B981" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
