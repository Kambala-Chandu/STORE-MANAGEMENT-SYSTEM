import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';

export const BranchDashboardView = ({ branches }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 flex flex-col gap-6"
    >
      <div className="bg-[#0B1329] p-6 rounded-xl border border-white/10 h-64 flex flex-col items-center justify-center relative overflow-hidden">
        <h3 className="text-lg font-semibold text-white mb-4 z-10">Global Branch Network</h3>
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            {/* Simple map placeholder */}
            <svg viewBox="0 0 1000 500" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M200,150 Q400,50 600,150 T900,200" strokeDasharray="5,5" />
              <circle cx="200" cy="150" r="10" fill="#3B82F6" />
              <circle cx="600" cy="150" r="10" fill="#3B82F6" />
              <circle cx="900" cy="200" r="10" fill="#3B82F6" />
            </svg>
        </div>
        <p className="text-slate-400 z-10 text-center max-w-md">
          Interactive map visualization would be implemented here, showing real-time metrics across global locations.
        </p>
      </div>

      <div className="bg-[#0B1329] rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Branch Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Employees</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {branches.map((branch, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{branch.name}</td>
                  <td className="px-6 py-4 text-slate-400">{branch.company}</td>
                  <td className="px-6 py-4">{branch.city}</td>
                  <td className="px-6 py-4">${(branch.revenue / 1000000).toFixed(1)}M</td>
                  <td className="px-6 py-4">{branch.employees}</td>
                  <td className="px-6 py-4">
                    <Badge variant={branch.status === 'Active' ? 'success' : 'neutral'}>{branch.status}</Badge>
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
