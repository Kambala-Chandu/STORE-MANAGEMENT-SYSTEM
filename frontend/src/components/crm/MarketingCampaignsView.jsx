import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Users,
  Plus,
  Play,
  CheckCircle,
  Eye,
  MousePointer,
  PieChart
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function MarketingCampaignsView({
  campaigns = [],
  onCreateCampaign
}) {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    channel: 'Email & Direct Outreach',
    segment: 'Tier-1 B2B Wholesalers',
    budget: '',
    recipients: 1000
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      addToast({ title: 'Validation Error', message: 'Campaign name is required.', type: 'danger' });
      return;
    }
    onCreateCampaign({
      ...formData,
      budget: parseFloat(formData.budget || 2000),
      status: 'Active'
    });
    setIsModalOpen(false);
    setFormData({
      name: '',
      channel: 'Email & Direct Outreach',
      segment: 'Tier-1 B2B Wholesalers',
      budget: '',
      recipients: 1000
    });
  };

  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.revenue_generated || 0), 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Attributed Campaign Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">Tracked via promo voucher redemption</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Total Campaign Spend</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            ${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">Aggregated marketing budget</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Aggregate Return (ROI)</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-white font-mono">1,260% ROI</div>
              <p className="text-xs text-slate-400 mt-0.5">High attribution efficiency</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-xs shadow-md shadow-primary/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4 hover:border-primary/40 transition group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                  {camp.channel}
                </span>
                <h4 className="text-base font-bold text-white mt-1.5 group-hover:text-primary transition">
                  {camp.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Segment: {camp.segment}</p>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                {camp.status}
              </Badge>
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-[#050A16] border border-white/5 text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Audience</span>
                <strong className="text-white font-mono">{camp.recipients?.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Open Rate</span>
                <strong className="text-emerald-400 font-mono">{camp.open_rate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Click Rate</span>
                <strong className="text-cyan-400 font-mono">{camp.click_rate}</strong>
              </div>
            </div>

            {/* Financial ROI */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Revenue Attributed</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  ${Number(camp.revenue_generated || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] uppercase block">ROI Factor</span>
                <span className="text-xs font-bold font-mono text-primary">{camp.roi}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Campaign Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Launch Marketing & Promotional Campaign"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Campaign Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Black Friday Hardware Flash"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Channel</label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Email & Direct Outreach">Email & Direct Outreach</option>
                <option value="SMS & App Push">SMS & App Push</option>
                <option value="Search & Social Ads">Search & Social Ads</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Audience Segment</label>
              <select
                value={formData.segment}
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Tier-1 B2B Wholesalers">Tier-1 B2B Wholesalers</option>
                <option value="Active Gold & Platinum Retail Shoppers">Active Gold & Platinum Retail Shoppers</option>
                <option value="SMB Multi-Store Owners">SMB Multi-Store Owners</option>
                <option value="Lapsed / Churn Risk Accounts">Lapsed / Churn Risk Accounts</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Budget Allocation ($)</label>
              <input
                type="number"
                placeholder="2500"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Estimated Audience</label>
              <input
                type="number"
                value={formData.recipients}
                onChange={(e) => setFormData({ ...formData, recipients: parseInt(e.target.value || 1000) })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
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
              Launch Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
