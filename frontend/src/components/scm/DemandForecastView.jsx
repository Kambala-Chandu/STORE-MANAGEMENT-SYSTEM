import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
export const DemandForecastView = ({ data }) => (
    <div className="bg-[#0B1329] p-4 border border-white/10 rounded-lg">
        <h3 className="text-white mb-4">Demand Forecast</h3>
        <div className="h-64"><ResponsiveContainer><AreaChart data={data}><XAxis dataKey="month" /><YAxis /><Tooltip /><Area type="monotone" dataKey="forecast" stroke="#3B82F6" fill="#3B82F6" opacity={0.5} /><Area type="monotone" dataKey="actual" stroke="#10B981" fill="#10B981" opacity={0.5} /></AreaChart></ResponsiveContainer></div>
    </div>
);
