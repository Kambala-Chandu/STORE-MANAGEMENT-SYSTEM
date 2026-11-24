import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const CountryConfigView = ({ countryConfigs }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {countryConfigs.map((config) => (
        <div key={config.id} className="bg-[#0B1329] rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
            <span className="text-2xl">{config.flag}</span>
            <h3 className="text-lg font-semibold text-white">{config.country}</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Date Format</span>
              <span className="text-sm font-medium text-white font-mono bg-white/5 px-2 py-1 rounded">{config.date_format}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Number Format</span>
              <span className="text-sm font-medium text-white font-mono bg-white/5 px-2 py-1 rounded">{config.number_format}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Currency</span>
              <Badge variant="neutral">{config.currency}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Primary Language</span>
              <Badge variant="neutral">{config.primary_language}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Tax System</span>
              <span className="text-sm text-white">{config.tax_system_name}</span>
            </div>
          </div>
          <div className="p-4 border-t border-white/10">
            <Button variant="outline" className="w-full">Edit Configuration</Button>
          </div>
        </div>
      ))}
      <div className="bg-[#0B1329]/50 rounded-xl border border-white/10 border-dashed flex items-center justify-center h-full min-h-[250px] cursor-pointer hover:bg-white/5 transition-colors">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-2">+</div>
          <p>Add Country</p>
        </div>
      </div>
    </motion.div>
  );
};
