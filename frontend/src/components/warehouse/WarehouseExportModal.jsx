import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';

export const WarehouseExportModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#0B1329] p-6 rounded-lg border border-white/10 w-[400px] shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Export WMS Data</h3>
                <div className="space-y-4 text-sm text-slate-300">
                    <div>
                        <label className="block mb-2 text-slate-400">Dataset Scope</label>
                        <select className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white">
                            <option>Full WMS Audit</option>
                            <option>Inbound Receipts</option>
                            <option>Pick Orders</option>
                            <option>Outbound Shipments</option>
                            <option>Cycle Counts</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-slate-400">Period Selector</label>
                        <select className="w-full bg-[#050A16] border border-white/10 p-2 rounded text-white">
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-slate-400">Format</label>
                        <div className="flex gap-2">
                            {['Excel', 'PDF', 'CSV', 'Print'].map(fmt => (
                                <button key={fmt} className="flex-1 bg-white/5 hover:bg-primary/20 border border-white/10 py-2 rounded text-center transition-colors">
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button onClick={onClose} className="text-slate-400">Cancel</Button>
                        <Button onClick={onClose} className="bg-primary text-white px-4 py-2 rounded">Export Data</Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
