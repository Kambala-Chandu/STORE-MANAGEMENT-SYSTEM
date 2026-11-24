import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Plus,
  ArrowRight,
  CheckCircle,
  Building,
  User,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function OpportunityPipelineView({
  opportunities = [],
  onCreateOpportunity,
  onUpdateStage,
  onRefresh
}) {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    account: '',
    stage: 'Qualification',
    amount: '',
    probability: 50,
    close_date: new Date().toISOString().slice(0, 10),
    next_step: ''
  });

  const stages = [
    { id: 'Qualification', label: 'Qualification', prob: '40%' },
    { id: 'Proposal Sent', label: 'Proposal Sent', prob: '75%' },
    { id: 'Negotiation', label: 'Negotiation', prob: '85%' },
    { id: 'Closed Won', label: 'Closed Won', prob: '100%' }
  ];

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.account || !formData.amount) {
      addToast({ title: 'Validation Error', message: 'Title, account, and amount are required.', type: 'danger' });
      return;
    }
    await onCreateOpportunity({
      ...formData,
      amount: parseFloat(formData.amount),
      probability: parseInt(formData.probability || 50)
    });
    setIsModalOpen(false);
    setFormData({
      title: '',
      account: '',
      stage: 'Qualification',
      amount: '',
      probability: 50,
      close_date: new Date().toISOString().slice(0, 10),
      next_step: ''
    });
  };

  const totalValue = opportunities.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalWeighted = opportunities.reduce((sum, o) => sum + (o.expected_revenue || 0), 0);

  const advanceStage = (opp) => {
    const stageOrder = ['Qualification', 'Proposal Sent', 'Negotiation', 'Closed Won'];
    const curIdx = stageOrder.indexOf(opp.stage);
    if (curIdx < stageOrder.length - 1) {
      const nextStage = stageOrder[curIdx + 1];
      onUpdateStage(opp.id, nextStage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Total Pipeline Value</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">{opportunities.length} active enterprise deals</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Weighted Expected Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
            ${totalWeighted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">Probability-adjusted Q4 forecast</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Pipeline Velocity</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-white font-mono">28.4 Days</div>
              <p className="text-xs text-slate-400 mt-0.5">Average sales cycle length</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-xs shadow-md shadow-primary/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Deal
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageDeals = opportunities.filter((o) => o.stage === stage.id);
          const stageTotal = stageDeals.reduce((sum, o) => sum + (o.amount || 0), 0);

          return (
            <div key={stage.id} className="space-y-3">
              {/* Column Header */}
              <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{stage.label}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Win Prob: {stage.prob}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary font-mono block">
                    ${(stageTotal / 1000).toFixed(0)}k
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{stageDeals.length} deals</span>
                </div>
              </div>

              {/* Deal Cards */}
              <div className="space-y-3 min-h-[300px]">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-4 rounded-xl border border-white/10 bg-[#0B1329] space-y-3 hover:border-primary/40 transition group"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold">
                          {deal.type}
                        </span>
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          ${deal.amount?.toLocaleString()}
                        </span>
                      </div>
                      <h5 className="font-bold text-white text-xs mt-2 group-hover:text-primary transition">
                        {deal.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        {deal.account}
                      </p>
                    </div>

                    <div className="p-2 rounded bg-[#050A16] border border-white/5 text-[10px] text-slate-400 space-y-1">
                      <div>Next Step: <strong className="text-white">{deal.next_step}</strong></div>
                      <div className="flex justify-between">
                        <span>Rep: <strong className="text-slate-300">{deal.assigned_rep}</strong></span>
                        <span className="font-mono">Close: {deal.close_date}</span>
                      </div>
                    </div>

                    {deal.stage !== 'Closed Won' && (
                      <div className="pt-2 border-t border-white/5 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => advanceStage(deal)}
                          className="text-[11px] text-primary hover:text-white p-1"
                        >
                          Advance Stage <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Deal Opportunity Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Sales Pipeline Opportunity"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Deal Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Warehouse Scanner Rig Expansion"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Target Account Company *</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Logistics Global"
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Deal Gross Amount ($) *</label>
              <input
                type="number"
                required
                placeholder="50000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Pipeline Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Qualification">Qualification (40%)</option>
                <option value="Proposal Sent">Proposal Sent (75%)</option>
                <option value="Negotiation">Negotiation (85%)</option>
                <option value="Closed Won">Closed Won (100%)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Next Action Step</label>
            <input
              type="text"
              placeholder="e.g. Schedule technical demo on Thursday"
              value={formData.next_step}
              onChange={(e) => setFormData({ ...formData, next_step: e.target.value })}
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
              Add Opportunity
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
