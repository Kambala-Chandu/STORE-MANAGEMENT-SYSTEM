import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export const CurrencyManagerView = ({ currencies, activeCurrency, onSetDefault }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="bg-[#0B1329] rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Supported Currencies</h3>
          <Button variant="primary" size="sm">Add Currency</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 w-12">Flag</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Rate to USD</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currencies.map((currency, idx) => (
                <tr key={idx} className={`hover:bg-white/5 transition-colors ${activeCurrency === currency.code ? 'bg-primary/5' : ''}`}>
                  <td className="px-6 py-4 text-xl text-center">{currency.flag}</td>
                  <td className="px-6 py-4 font-mono font-medium text-white">{currency.code}</td>
                  <td className="px-6 py-4">{currency.name}</td>
                  <td className="px-6 py-4 font-medium text-white">{currency.symbol}</td>
                  <td className="px-6 py-4 font-mono">{currency.rate_to_usd.toFixed(4)}</td>
                  <td className="px-6 py-4 text-slate-400">Today, 12:00 PM</td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant={activeCurrency === currency.code ? 'outline' : 'neutral'}
                      size="sm"
                      onClick={() => onSetDefault(currency.code)}
                      disabled={activeCurrency === currency.code}
                    >
                      {activeCurrency === currency.code ? 'Default' : 'Set Default'}
                    </Button>
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
