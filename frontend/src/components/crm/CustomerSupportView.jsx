import React, { useState } from 'react';
import {
  LifeBuoy,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  User,
  Building,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function CustomerSupportView({
  tickets = [],
  onCreateTicket,
  onResolveTicket
}) {
  const { addToast } = useToast();
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customer: '',
    contact: '',
    subject: '',
    category: 'Hardware Peripheral',
    priority: 'High',
    notes: ''
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.subject) {
      addToast({ title: 'Validation Error', message: 'Customer and subject are required.', type: 'danger' });
      return;
    }
    await onCreateTicket(formData);
    setIsModalOpen(false);
    setFormData({
      customer: '',
      contact: '',
      subject: '',
      category: 'Hardware Peripheral',
      priority: 'High',
      notes: ''
    });
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-[10px] font-bold">Urgent (2h SLA)</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px] font-bold">High (4h SLA)</Badge>;
      default:
        return <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-[10px]">Medium (8h SLA)</Badge>;
    }
  };

  const filtered = tickets.filter((t) => {
    const matchPri = filterPriority === 'ALL' || t.priority?.toLowerCase() === filterPriority.toLowerCase();
    const matchStat = filterStatus === 'ALL' || t.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchSearch = !searchTerm ||
      t.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchPri && matchStat && matchSearch;
  });

  const openTickets = tickets.filter(t => t.status !== 'Resolved').length;

  return (
    <div className="space-y-4">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Open Support Cases</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <LifeBuoy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            {openTickets} Active
          </div>
          <p className="mt-1 text-xs text-slate-400">Under SLA monitoring</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>SLA Resolution Rate</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
            98.4%
          </div>
          <p className="mt-1 text-xs text-slate-400">Target: &gt;95.0%</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Avg Response Time</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-400 font-mono">
            18 Minutes
          </div>
          <p className="mt-1 text-xs text-slate-400">Tier-1 First touch SLA</p>
        </div>
      </div>

      {/* Control bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent Cases</option>
            <option value="High">High Cases</option>
            <option value="Medium">Medium Cases</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ticket # or customer..."
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
            New Ticket
          </Button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Customer Account</th>
                <th className="py-3 px-4">Subject & Issue</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-center">SLA Timer</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((tkt) => (
                <tr key={tkt.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    {tkt.ticket_number}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div>{tkt.customer}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{tkt.contact}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200 max-w-xs truncate">
                    {tkt.subject}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {tkt.category}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {getPriorityBadge(tkt.priority)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    {tkt.status === 'Resolved' ? (
                      <span className="text-emerald-400 font-bold">Completed</span>
                    ) : (
                      <span className="text-amber-400 font-bold flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tkt.sla_remaining_minutes}m left
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {tkt.assigned_agent}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={tkt.status === 'Resolved' ? 'success' : 'primary'} className="text-[10px]">
                      {tkt.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {tkt.status !== 'Resolved' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onResolveTicket(tkt.id)}
                        className="text-xs text-emerald-400 hover:bg-emerald-500/20 p-1.5"
                        title="Mark as Resolved"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Ticket Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Open Customer Support Case"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Customer Account *</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Logistics Global"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Contact Person</label>
            <input
              type="text"
              placeholder="e.g. Gregory House"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Issue Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Hardware Peripheral">Hardware Peripheral</option>
                <option value="Software & Firmware">Software & Firmware</option>
                <option value="Billing & Invoicing">Billing & Invoicing</option>
                <option value="General Support">General Support</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Priority SLA</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Urgent">Urgent (2h SLA)</option>
                <option value="High">High (4h SLA)</option>
                <option value="Medium">Medium (8h SLA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Subject / Summary *</label>
            <input
              type="text"
              required
              placeholder="e.g. Thermal Printer Paper Jam Error 04"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
              Create Support Case
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
