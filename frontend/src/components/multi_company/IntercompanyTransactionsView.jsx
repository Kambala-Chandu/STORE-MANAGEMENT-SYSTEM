import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';

export const IntercompanyTransactionsView = ({ transactions }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="bg-[#0B1329] rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-lg font-semibold text-white">Intercompany Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">From Company</th>
                <th className="px-6 py-4">To Company</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">{tx.date}</td>
                  <td className="px-6 py-4 font-medium">{tx.from_company}</td>
                  <td className="px-6 py-4 font-medium">{tx.to_company}</td>
                  <td className="px-6 py-4 text-slate-400">{tx.type}</td>
                  <td className="px-6 py-4 font-mono">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: tx.currency }).format(tx.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={tx.status === 'Completed' ? 'success' : 'warning'}>{tx.status}</Badge>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No intercompany transactions found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
