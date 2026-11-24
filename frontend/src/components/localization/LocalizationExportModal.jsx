import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

export const LocalizationExportModal = ({ isOpen, onClose }) => {
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
          <h2 className="text-xl font-bold text-white mb-4">Export Localization Data</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Format</label>
              <select className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="json">JSON (Language Strings)</option>
                <option value="csv">CSV (Tax/Currency Lists)</option>
                <option value="excel">Excel</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Dataset</label>
              <select className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="all">All Settings</option>
                <option value="translations">Translations</option>
                <option value="taxes">Tax Configurations</option>
                <option value="rates">Exchange Rates</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="neutral" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={onClose}>Download Export</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
