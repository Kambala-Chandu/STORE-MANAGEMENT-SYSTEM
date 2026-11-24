import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const TaxConfigView = ({ taxConfigs }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="bg-[#0B1329] rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Global Tax Rules</h3>
          <Button variant="primary" size="sm">New Tax Rule</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Tax Name</th>
                <th className="px-6 py-4">Rate (%)</th>
                <th className="px-6 py-4">Applies To</th>
                <th className="px-6 py-4">Effective Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {taxConfigs.map((tax) => (
                <tr key={tax.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{tax.country}</td>
                  <td className="px-6 py-4 text-slate-400">{tax.region}</td>
                  <td className="px-6 py-4">{tax.tax_name}</td>
                  <td className="px-6 py-4 font-mono text-primary">{tax.rate}%</td>
                  <td className="px-6 py-4">{tax.applies_to}</td>
                  <td className="px-6 py-4 text-slate-400">{tax.effective_date}</td>
                  <td className="px-6 py-4">
                    <Badge variant={tax.status === 'Active' ? 'success' : 'neutral'}>{tax.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
