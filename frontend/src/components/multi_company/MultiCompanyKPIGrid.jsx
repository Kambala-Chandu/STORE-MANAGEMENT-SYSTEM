import React from 'react';
import { motion } from 'framer-motion';

export const MultiCompanyKPIGrid = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-6">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-[#0B1329] p-4 rounded-xl border border-white/10 flex flex-col justify-between"
        >
          <p className="text-xs text-slate-400 font-medium truncate">{kpi.label}</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white">{kpi.value}</span>
            <span className={`text-xs font-semibold ${kpi.trendUp ? 'text-green-400' : 'text-red-400'}`}>
              {kpi.trend}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
