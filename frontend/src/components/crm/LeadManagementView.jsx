import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Flame,
  Plus,
  Building,
  Mail,
  Phone,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function LeadManagementView({
  leads = [],
  onCreateLead,
  onRefresh
}) {
  const { addToast } = useToast();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    title: '',
    email: '',
    phone: '',
    source: 'Website Demo Request',
    estimated_value: '',
    score: 85,
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company) {
      addToast({ title: 'Validation Error', message: 'Lead name and company are required.', type: 'danger' });
      return;
    }
    await onCreateLead({
      ...formData,
      estimated_value: parseFloat(formData.estimated_value || 25000),
      score: parseInt(formData.score || 80)
    });
    setIsModalOpen(false);
    setFormData({
      name: '',
      company: '',
      title: '',
      email: '',
      phone: '',
      source: 'Website Demo Request',
      estimated_value: '',
      score: 85,
      notes: ''
    });
  };

  const getScoreBadge = (score) => {
    if (score >= 85) {
      return (
        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <Flame className="w-3 h-3 fill-emerald-400" /> {score} Hot
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
          {score} Warm
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
        {score} Nurture
      </span>
    );
  };

  const filtered = leads.filter((l) => {
    const matchStatus = filterStatus === 'ALL' || l.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchSearch = !searchTerm ||
      l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-lg p-1 bg-[#050A16] border border-white/10 overflow-x-auto">
          {['ALL', 'New Inbound', 'Contacted', 'Qualified'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filterStatus === st ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {st === 'ALL' ? 'All Leads' : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search lead or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs shadow-md shadow-primary/20"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Capture Lead
          </Button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Lead Name</th>
                <th className="py-3 px-4">Company & Role</th>
                <th className="py-3 px-4 text-center">AI Lead Score</th>
                <th className="py-3 px-4 text-right">Estimated Value</th>
                <th className="py-3 px-4">Acquisition Channel</th>
                <th className="py-3 px-4">Assigned Rep</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div>{lead.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{lead.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{lead.company}</div>
                    <div className="text-[11px] text-slate-400">{lead.title}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {getScoreBadge(lead.score)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    ${Number(lead.estimated_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {lead.source}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {lead.assigned_to}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={lead.status === 'Qualified' ? 'success' : 'primary'} className="text-[10px]">
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        addToast({
                          title: 'Lead Qualified & Converted',
                          message: `Lead ${lead.name} advanced to Sales Opportunity pipeline.`,
                          type: 'success'
                        });
                      }}
                      className="text-xs text-primary hover:text-white"
                    >
                      Convert <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Capture Lead Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Capture New Enterprise Sales Lead"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Contact Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jonathan Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Company *</label>
              <input
                type="text"
                required
                placeholder="e.g. Metro Retail LLC"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="lead@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Phone</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Lead Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Website Demo Request">Website Demo Request</option>
                <option value="In-Store POS Demo">In-Store POS Demo</option>
                <option value="National Retail Trade Expo">National Retail Trade Expo</option>
                <option value="Partner Referral">Partner Referral</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Estimated Deal ($)</label>
              <input
                type="number"
                placeholder="45000"
                value={formData.estimated_value}
                onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Discovery Notes</label>
            <textarea
              rows={3}
              placeholder="Hardware preferences, store count, timeline..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              Save Lead Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
