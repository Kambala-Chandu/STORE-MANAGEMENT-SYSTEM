import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Badge, Button } from '../ui';

export const CAPAView = ({ capas = [], onCreateCapa }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    defect_description: '',
    root_cause: '',
    owner: '',
    target_date: '',
    severity: 'High'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.defect_description) return;
    onCreateCapa?.(formData);
    setFormData({ defect_description: '', root_cause: '', owner: '', target_date: '', severity: 'High' });
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    if (status === 'Closed') return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Closed</Badge>;
    if (status === 'In Progress') return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">In Progress</Badge>;
    if (status === 'Overdue') return <Badge className="bg-rose-500/20 text-rose-400 border border-rose-500/30">Overdue</Badge>;
    return <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">Open</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Corrective & Preventive Action (CAPA)</h3>
          <p className="text-xs text-slate-400">Root-Cause Analysis, Mitigation Plans and Resolution Sprints</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-white text-xs px-3.5 py-2 rounded-lg">
          <Plus className="w-3.5 h-3.5" />
          <span>New CAPA Ticket</span>
        </Button>
      </div>

      <div className="bg-[#0B1329] border border-white/10 rounded-xl overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-white/10">
            <tr>
              <th className="p-3.5">CAPA Ref</th>
              <th className="p-3.5">Defect Description</th>
              <th className="p-3.5">Root Cause</th>
              <th className="p-3.5">Owner</th>
              <th className="p-3.5">Target Date</th>
              <th className="p-3.5 text-center">Severity</th>
              <th className="p-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {capas.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="p-3.5 font-mono font-medium text-white">{c.ca_number}</td>
                <td className="p-3.5 text-white font-medium max-w-xs">{c.defect_description}</td>
                <td className="p-3.5 text-slate-400 max-w-xs">{c.root_cause}</td>
                <td className="p-3.5 text-slate-300">{c.owner}</td>
                <td className="p-3.5 font-mono text-slate-400">{c.target_date}</td>
                <td className="p-3.5 text-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    c.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300' :
                    c.severity === 'High' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {c.severity}
                  </span>
                </td>
                <td className="p-3.5 text-center">{getStatusBadge(c.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0B1329] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl text-white">
              <h3 className="text-base font-bold mb-4">Create CAPA Action</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Defect Description</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.defect_description}
                    onChange={(e) => setFormData({ ...formData, defect_description: e.target.value })}
                    className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    placeholder="Describe observed defect..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Identified Root Cause</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.root_cause}
                    onChange={(e) => setFormData({ ...formData, root_cause: e.target.value })}
                    className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    placeholder="Engineering / operational root cause..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Action Owner</label>
                    <input
                      type="text"
                      required
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                      placeholder="e.g. David Miller"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Target Close Date</label>
                    <input
                      type="date"
                      required
                      value={formData.target_date}
                      onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg">
                    Cancel
                  </button>
                  <Button type="submit" className="bg-primary text-white text-xs px-4 py-2 rounded-lg">
                    Log CAPA
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
