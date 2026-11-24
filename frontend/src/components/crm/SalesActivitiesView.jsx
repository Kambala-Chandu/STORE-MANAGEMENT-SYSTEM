import React, { useState } from 'react';
import {
  Calendar,
  Phone,
  Video,
  CheckCircle,
  Clock,
  Plus,
  Building,
  User,
  CheckSquare,
  Search
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function SalesActivitiesView({
  activities = [],
  onLogActivity
}) {
  const { addToast } = useToast();
  const [filterType, setFilterType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newActivity, setNewActivity] = useState({
    type: 'Call',
    title: '',
    counterparty: '',
    due_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    notes: ''
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newActivity.title || !newActivity.counterparty) {
      addToast({ title: 'Validation Error', message: 'Activity title and counterparty are required.', type: 'danger' });
      return;
    }
    onLogActivity({
      ...newActivity,
      status: 'Scheduled'
    });
    setIsModalOpen(false);
    setNewActivity({
      type: 'Call',
      title: '',
      counterparty: '',
      due_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      notes: ''
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Call':
        return <Phone className="w-4 h-4 text-emerald-400" />;
      case 'Meeting':
        return <Video className="w-4 h-4 text-primary" />;
      case 'Task':
        return <CheckSquare className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-cyan-400" />;
    }
  };

  const filtered = filterType === 'ALL'
    ? activities
    : activities.filter(a => a.type === filterType);

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-lg p-1 bg-[#050A16] border border-white/10">
          {['ALL', 'Call', 'Meeting', 'Task'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filterType === t ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {t === 'ALL' ? 'All Activities' : `${t}s`}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs shadow-md shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Schedule Sales Activity
        </Button>
      </div>

      {/* Activities Feed */}
      <div className="space-y-3">
        {filtered.map((act) => (
          <div
            key={act.id}
            className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition"
          >
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 mt-0.5 sm:mt-0">
                {getActivityIcon(act.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" className="text-[10px]">
                    {act.type}
                  </Badge>
                  <h4 className="text-sm font-bold text-white">{act.title}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span className="font-semibold text-slate-300">{act.counterparty}</span>
                  <span>• Rep: {act.owner}</span>
                </p>
                {act.notes && (
                  <p className="text-[11px] text-slate-500 mt-1 italic max-w-xl truncate">{act.notes}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400 whitespace-nowrap">{act.due_date}</span>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                {act.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Activity Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Sales Engagement Activity"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Activity Type</label>
              <select
                value={newActivity.type}
                onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Call">Phone Call</option>
                <option value="Meeting">Executive Video Meeting</option>
                <option value="Task">Action Task / Quote Follow-up</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Target Account *</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Logistics Global"
                value={newActivity.counterparty}
                onChange={(e) => setNewActivity({ ...newActivity, counterparty: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Subject / Agenda *</label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Contract Terms Walkthrough"
              value={newActivity.title}
              onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Scheduled Date & Time</label>
            <input
              type="text"
              value={newActivity.due_date}
              onChange={(e) => setNewActivity({ ...newActivity, due_date: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Preparation Notes</label>
            <textarea
              rows={3}
              placeholder="Key objectives, demo requirements..."
              value={newActivity.notes}
              onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-xs border-white/10 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="text-xs"
            >
              Log Activity
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
