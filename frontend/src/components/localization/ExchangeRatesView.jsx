import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ExchangeRatesView = ({ exchangeRates }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 flex flex-col gap-6"
    >
      <div className="bg-[#0B1329] p-6 rounded-xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Exchange Rate Trends (vs USD)</h3>
          <select className="bg-[#050A16] border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>1 Year</option>
          </select>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={exchangeRates} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#ffffff50" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B1329', borderColor: '#ffffff20', color: '#fff' }}
              />
              <Legend wrapperStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="EUR" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="GBP" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="JPY" yAxisId={1} stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
              <YAxis yAxisId={1} orientation="right" domain={['auto', 'auto']} stroke="#ffffff50" fontSize={12} tickLine={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
