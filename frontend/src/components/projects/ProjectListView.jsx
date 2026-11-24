import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Briefcase, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';
import { Badge, Button } from '../ui';

export const ProjectListView = ({ projects = [], onCreateProject, onSelectProject, selectedProjectId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    department: 'Logistics',
    budget: '',
    start_date: '',
    end_date: '',
    priority: 'Medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.budget) return;
    onCreateProject?.({
      ...formData,
      budget: Number(formData.budget)
    });
    setFormData({ name: '', manager: '', department: 'Logistics', budget: '', start_date: '', end_date: '', priority: 'Medium' });
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    if (status === 'Completed') return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Completed</Badge>;
    if (status === 'Active') return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">Active</Badge>;
    if (status === 'On Hold') return <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">On Hold</Badge>;
    return <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">Planning</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Enterprise Project Directory</h3>
          <p className="text-xs text-slate-400">Capital Expenditure, Infrastructure Deployments and Milestones</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-white text-xs px-3.5 py-2 rounded-lg">
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const isSelected = selectedProjectId === proj.id;
          const budgetPct = Math.min(100, Math.round((proj.spent / (proj.budget || 1)) * 100));

          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject?.(proj)}
              className={`cursor-pointer bg-[#0B1329] border rounded-xl p-5 shadow-xl transition-all ${
                isSelected
                  ? 'border-primary ring-1 ring-primary/50'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">{proj.code}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1">{proj.name}</h4>
                  <p className="text-xs text-slate-400">{proj.department} &bull; {proj.manager}</p>
                </div>
                {getStatusBadge(proj.status)}
              </div>

              {/* Progress Bar */}
              <div className="my-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 text-[11px]">Sprint Progress</span>
                  <span className="font-mono font-bold text-primary">{proj.progress_pct}%</span>
                </div>
                <div className="w-full bg-[#050A16] h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${proj.progress_pct}%` }}
                  />
                </div>
              </div>

              {/* Budget & Spend */}
              <div className="bg-[#050A16]/50 p-2.5 rounded-lg border border-white/5 text-xs grid grid-cols-2 gap-2 mt-3">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Budget</div>
                  <div className="font-mono font-semibold text-white">${proj.budget?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Spent ({budgetPct}%)</div>
                  <div className="font-mono font-semibold text-slate-300">${proj.spent?.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                <div className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{proj.end_date}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  proj.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' :
                  proj.priority === 'High' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {proj.priority} Priority
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0B1329] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl text-white">
              <h3 className="text-base font-bold mb-4">Register New Enterprise Project</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. Cold Chain Storage Expansion"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Project Manager</label>
                    <input
                      type="text"
                      required
                      value={formData.manager}
                      onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                      placeholder="e.g. Sarah Jenkins"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    >
                      <option value="Logistics">Logistics</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="IT Systems">IT Systems</option>
                      <option value="Operations">Operations</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Budget ($)</label>
                    <input
                      type="number"
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                      placeholder="250000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Target End Date</label>
                    <input
                      type="date"
                      required
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full bg-[#050A16] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg">
                    Cancel
                  </button>
                  <Button type="submit" className="bg-primary text-white text-xs px-4 py-2 rounded-lg">
                    Initialize Project
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
