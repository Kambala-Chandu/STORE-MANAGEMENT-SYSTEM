import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Clock,
  User,
  AlertCircle,
  Filter,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function LeaveManagementView({
  leaves = [],
  onApplyLeave,
  onApproveLeave,
  onRejectLeave
}) {
  const { addToast } = useToast();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  const [newLeave, setNewLeave] = useState({
    leave_type: 'Annual Leave',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date().toISOString().slice(0, 10),
    days: 1,
    reason: ''
  });

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!newLeave.reason) {
      addToast({ title: 'Validation Error', message: 'Please specify the reason for absence.', type: 'danger' });
      return;
    }
    await onApplyLeave(newLeave);
    setIsApplyModalOpen(false);
    setNewLeave({
      leave_type: 'Annual Leave',
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      days: 1,
      reason: ''
    });
  };

  const filtered = filterType === 'ALL'
    ? leaves
    : leaves.filter(l => l.leave_type === filterType);

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  return (
    <div className="space-y-4">
      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Annual Vacation</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">14 Days</div>
          <p className="mt-1 text-xs text-slate-400">Accrued standard allowance</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Medical & Sick Leave</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">10 Days</div>
          <p className="mt-1 text-xs text-slate-400">Full statutory paid benefit</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Casual & Personal</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-400 font-mono">5 Days</div>
          <p className="mt-1 text-xs text-slate-400">Immediate personal allowance</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Awaiting Authorization</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400 font-mono">
            {pendingLeaves.length} Requests
          </div>
          <p className="mt-1 text-xs text-slate-400">Pending manager action</p>
        </div>
      </div>

      {/* Control bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type Filter:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Absence Types</option>
            <option value="Annual Leave">Annual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
          </select>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsApplyModalOpen(true)}
          className="text-xs shadow-md shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Request Time Off
        </Button>
      </div>

      {/* Leaves Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration Range</th>
                <th className="py-3 px-4 text-center">Days</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((leave) => (
                <tr key={leave.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div>{leave.employee_name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{leave.employee_code}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="primary" className="text-[10px]">
                      {leave.leave_type}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {leave.start_date} <span className="text-slate-500">to</span> {leave.end_date}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                    {leave.days}d
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                    {leave.reason}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {leave.applied_on}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        leave.status === 'Approved'
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          : leave.status === 'Rejected'
                          ? 'border-rose-500/30 text-rose-400 bg-rose-500/10'
                          : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {leave.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {leave.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onApproveLeave(leave.id)}
                          className="text-xs text-emerald-400 hover:bg-emerald-500/20 p-1.5"
                          title="Authorize Leave"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRejectLeave(leave.id)}
                          className="text-xs text-rose-400 hover:bg-rose-500/20 p-1.5"
                          title="Decline Leave"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">
                        {leave.approved_by || 'Processed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Submit Time Off / Leave Application"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Leave Classification</label>
            <select
              value={newLeave.leave_type}
              onChange={(e) => setNewLeave({ ...newLeave, leave_type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Annual Leave">Annual Vacation Leave</option>
              <option value="Sick Leave">Medical / Sick Leave</option>
              <option value="Casual Leave">Casual Personal Leave</option>
              <option value="Maternity/Paternity">Maternity / Paternity Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Start Date</label>
              <input
                type="date"
                required
                value={newLeave.start_date}
                onChange={(e) => setNewLeave({ ...newLeave, start_date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">End Date</label>
              <input
                type="date"
                required
                value={newLeave.end_date}
                onChange={(e) => setNewLeave({ ...newLeave, end_date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Total Days</label>
            <input
              type="number"
              min="1"
              max="30"
              value={newLeave.days}
              onChange={(e) => setNewLeave({ ...newLeave, days: parseInt(e.target.value || 1) })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Reason / Justification *</label>
            <textarea
              rows={3}
              required
              placeholder="State the reason for absence..."
              value={newLeave.reason}
              onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsApplyModalOpen(false)}
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
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
