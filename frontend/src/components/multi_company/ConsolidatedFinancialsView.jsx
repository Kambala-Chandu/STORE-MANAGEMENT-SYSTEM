import React from 'react';
import { motion } from 'framer-motion';

export const ConsolidatedFinancialsView = ({ financials }) => {
  const { income_statement, balance_sheet } = financials;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <div className="bg-[#0B1329] rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Consolidated Income Statement</h3>
          <p className="text-xs text-slate-400 mt-1">YTD 2024 (Group Level, USD)</p>
        </div>
        <div className="p-4">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">
              {income_statement?.map((row, idx) => (
                <tr key={idx} className={row.item === 'Net Income' || row.item === 'Gross Profit' ? 'font-bold text-white' : 'text-slate-300'}>
                  <td className={`py-3 ${row.item === 'Net Income' ? 'text-primary' : ''}`}>{row.item}</td>
                  <td className="py-3 text-right font-mono">
                    ${(row.amount / 1000000).toFixed(1)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#0B1329] rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Consolidated Balance Sheet</h3>
          <p className="text-xs text-slate-400 mt-1">As of Today (Group Level, USD)</p>
        </div>
        <div className="p-4">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">
              {balance_sheet?.map((row, idx) => (
                <tr key={idx} className="text-slate-300 hover:text-white transition-colors">
                  <td className="py-3 font-medium">{row.item}</td>
                  <td className="py-3 text-right font-mono">
                    ${(row.amount / 1000000).toFixed(1)}M
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
