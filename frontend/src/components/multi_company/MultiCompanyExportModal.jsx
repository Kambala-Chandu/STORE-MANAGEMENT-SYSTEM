import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

export const MultiCompanyExportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0B1329] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Export Multi-Company Data</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Format</label>
              <select className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="excel">Excel (.xlsx)</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF Report</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Scope</label>
              <select className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="all">All Companies</option>
                <option value="active">Active Company Only</option>
                <option value="consolidated">Consolidated Financials</option>
                <option value="intercompany">Intercompany Transactions</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Period</label>
              <select className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="ytd">Year to Date (YTD)</option>
                <option value="q1">Q1</option>
                <option value="q2">Q2</option>
                <option value="q3">Q3</option>
                <option value="q4">Q4</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="neutral" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              // Mock export
              onClose();
            }}>
              Download Export
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
