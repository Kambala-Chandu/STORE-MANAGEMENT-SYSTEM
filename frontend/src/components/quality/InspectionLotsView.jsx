import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge, Button } from '../ui';

export const InspectionLotsView = ({ inspectionLots = [], onCreateLot }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    batch: '',
    inspection_type: 'Incoming',
    inspector: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.product || !formData.batch) return;
    onCreateLot?.(formData);
    setFormData({ product: '', batch: '', inspection_type: 'Incoming', inspector: '' });
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    if (status === 'Passed') return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Passed</Badge>;
    if (status === 'Failed') return <Badge className="bg-rose-500/20 text-rose-400 border border-rose-500/30">Failed</Badge>;
    return <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">Under Review</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Quality Inspection Lots</h3>
          <p className="text-xs text-slate-400">Incoming, In-Process and Final Verification Tracking</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-white text-xs px-3.5 py-2 rounded-lg">
          <Plus className="w-3.5 h-3.5" />
          <span>New Inspection Lot</span>
        </Button>
      </div>

      <div className="bg-[#0B1329] border border-white/10 rounded-xl overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-white/10">
            <tr>
              <th className="p-3.5">Lot Number</th>
              <th className="p-3.5">Product & Batch</th>
              <th className="p-3.5">Stage</th>
              <th className="p-3.5">Inspector</th>
              <th className="p-3.5 text-right">Pass Qty</th>
              <th className="p-3.5 text-right">Fail Qty</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 text-center">Defects</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {inspectionLots.map((lot) => (
              <tr key={lot.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="p-3.5 font-mono font-medium text-white">{lot.lot_number}</td>
                <td className="p-3.5">
                  <div className="text-white font-medium">{lot.product}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{lot.batch}</div>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[11px] bg-white/5 border border-white/10 text-slate-300">
                    {lot.inspection_type}
                  </span>
                </td>
                <td className="p-3.5 text-slate-300">{lot.inspector}</td>
                <td className="p-3.5 text-right font-mono text-emerald-400 font-medium">{lot.pass_qty}</td>
                <td className="p-3.5 text-right font-mono text-rose-400 font-medium">{lot.fail_qty}</td>
                <td className="p-3.5 text-center">{getStatusBadge(lot.status)}</td>
                <td className="p-3.5 text-center">
                  {lot.defect_codes?.length > 0 ? (
                    <div className="flex gap-1 justify-center flex-wrap">
                      {lot.defect_codes.map((d, i) => (
                        <span key={i} className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">
                          {d}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-500 text-[10px]">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0B1329] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl text-white">
              <h3 className="text-base font-bold mb-4">Create Inspection Lot</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. Micro Stepper Motor 24V"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Batch / Heat Number</label>
                  <input
                    type="text"
                    required
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. BAT-2026-99"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Inspection Type</label>
                    <select
                      value={formData.inspection_type}
                      onChange={(e) => setFormData({ ...formData, inspection_type: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    >
                      <option value="Incoming">Incoming</option>
                      <option value="In-Process">In-Process</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Assigned Inspector</label>
                    <input
                      type="text"
                      required
                      value={formData.inspector}
                      onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                      placeholder="e.g. Marcus Vance"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg">
                    Cancel
                  </button>
                  <Button type="submit" className="bg-primary text-white text-xs px-4 py-2 rounded-lg">
                    Register Lot
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
