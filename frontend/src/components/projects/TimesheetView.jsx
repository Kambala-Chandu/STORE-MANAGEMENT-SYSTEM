import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, CheckCircle } from 'lucide-react';
import { Badge, Button } from '../ui';

export const TimesheetView = ({ timesheets = [], onCreateTimesheet }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    project: '',
    task: '',
    hours: 8,
    engineer: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.project || !formData.task) return;
    onCreateTimesheet?.({
      ...formData,
      hours: Number(formData.hours)
    });
    setFormData({ date: new Date().toISOString().split('T')[0], project: '', task: '', hours: 8, engineer: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Engineering Timesheets & Billable Hours</h3>
          <p className="text-xs text-slate-400">Weekly Timecards, Labor Cost Allocation and Project Accounting</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-white text-xs px-3.5 py-2 rounded-lg">
          <Plus className="w-3.5 h-3.5" />
          <span>Log Timecard</span>
        </Button>
      </div>

      <div className="bg-[#0B1329] border border-white/10 rounded-xl overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-white/10">
            <tr>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Engineer</th>
              <th className="p-3.5">Project</th>
              <th className="p-3.5">Work Task Description</th>
              <th className="p-3.5 text-right">Hours Logged</th>
              <th className="p-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {timesheets.map((ts) => (
              <tr key={ts.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="p-3.5 font-mono text-slate-400">{ts.date}</td>
                <td className="p-3.5 text-white font-medium">{ts.engineer}</td>
                <td className="p-3.5 text-primary font-medium">{ts.project}</td>
                <td className="p-3.5 text-slate-300 max-w-xs">{ts.task}</td>
                <td className="p-3.5 text-right font-mono font-bold text-white">{ts.hours} hrs</td>
                <td className="p-3.5 text-center">
                  <Badge className={ts.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}>
                    {ts.status}
                  </Badge>
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
              <h3 className="text-base font-bold mb-4">Log Engineering Hours</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Engineer Name</label>
                  <input
                    type="text"
                    required
                    value={formData.engineer}
                    onChange={(e) => setFormData({ ...formData, engineer: e.target.value })}
                    className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. Alex Rivera"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. Automated Micro-Fulfillment"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Task Description</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.task}
                    onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    placeholder="Describe specific engineering task performed..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg">
                    Cancel
                  </button>
                  <Button type="submit" className="bg-primary text-white text-xs px-4 py-2 rounded-lg">
                    Submit Timecard
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
