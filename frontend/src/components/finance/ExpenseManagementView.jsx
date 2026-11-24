import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  Paperclip,
  Download,
  Filter,
  Search,
  User,
  Building,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function ExpenseManagementView({ expenses = [], onRefresh }) {
  const { addToast } = useToast();
  const [expenseList, setExpenseList] = useState(
    expenses.length > 0
      ? expenses
      : [
          {
            id: 'exp-1',
            claim_number: 'EXP-2026-104',
            employee: 'Elena Rostova',
            department: 'Retail Operations',
            category: 'POS Store Supplies',
            amount: 480.00,
            date: '2026-10-03',
            status: 'Approved',
            receipt: 'receipt_pos_supplies.pdf',
            description: 'Barcode ribbons and thermal roll replacements for POS terminals'
          },
          {
            id: 'exp-2',
            claim_number: 'EXP-2026-105',
            employee: 'Marcus Chen',
            department: 'Supply Chain',
            category: 'Logistics Courier',
            amount: 320.00,
            date: '2026-10-04',
            status: 'Approved',
            receipt: 'dhl_courier_slip.pdf',
            description: 'Emergency expedited courier delivery for replacement printer heads'
          },
          {
            id: 'exp-3',
            claim_number: 'EXP-2026-106',
            employee: 'David Miller',
            department: 'Warehouse Operations',
            category: 'Equipment Maintenance',
            amount: 850.00,
            date: '2026-10-05',
            status: 'Pending',
            receipt: 'forklift_service.pdf',
            description: 'Hydraulic seal inspection and preventative battery maintenance on Forklift-02'
          },
          {
            id: 'exp-4',
            claim_number: 'EXP-2026-107',
            employee: 'Sarah Jenkins',
            department: 'Commercial Sales',
            category: 'Client Relations',
            amount: 240.00,
            date: '2026-10-05',
            status: 'Pending',
            receipt: 'client_lunch_summit.pdf',
            description: 'Q4 contract renewal negotiation working lunch with Summit Hardware director'
          }
        ]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDept, setFilterDept] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [newClaim, setNewClaim] = useState({
    employee: '',
    department: 'Retail Operations',
    category: 'POS Store Supplies',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    receiptName: 'attached_receipt.pdf'
  });

  const handleApprove = (id) => {
    setExpenseList(prev => prev.map(e => e.id === id ? { ...e, status: 'Approved' } : e));
    addToast({
      title: 'Expense Claim Approved',
      message: 'Claim verified and posted to Accounts Payable ledger for direct disbursement.',
      type: 'success'
    });
  };

  const handleReject = (id) => {
    setExpenseList(prev => prev.map(e => e.id === id ? { ...e, status: 'Rejected' } : e));
    addToast({
      title: 'Expense Claim Rejected',
      message: 'Notification transmitted to claimant citing additional receipt documentation required.',
      type: 'warning'
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newClaim.employee || !newClaim.amount) {
      addToast({ title: 'Validation Error', message: 'Employee name and amount are required.', type: 'danger' });
      return;
    }
    const created = {
      id: `exp-${Date.now()}`,
      claim_number: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      employee: newClaim.employee,
      department: newClaim.department,
      category: newClaim.category,
      amount: parseFloat(newClaim.amount),
      date: newClaim.date,
      status: 'Pending',
      receipt: newClaim.receiptName,
      description: newClaim.description
    };
    setExpenseList([created, ...expenseList]);
    setIsModalOpen(false);
    setNewClaim({
      employee: '',
      department: 'Retail Operations',
      category: 'POS Store Supplies',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      description: '',
      receiptName: 'attached_receipt.pdf'
    });
    addToast({
      title: 'Expense Claim Submitted',
      message: `Claim ${created.claim_number} logged for supervisor approval.`,
      type: 'success'
    });
  };

  const filtered = expenseList.filter(e => {
    const matchDept = filterDept === 'ALL' || e.department === filterDept;
    const matchSearch = !searchTerm ||
      e.employee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.claim_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDept && matchSearch;
  });

  const totalPending = expenseList.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0);
  const totalApproved = expenseList.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-4">
      {/* Top Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Pending Authorization</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400 font-mono">
            ${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {expenseList.filter(e => e.status === 'Pending').length} claims awaiting review
          </p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Approved & Reimbursable</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
            ${totalApproved.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">Scheduled for Friday ACH payroll run</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Corporate Policy</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Tier-1 Auto-Approval: &lt; $100</div>
            <p className="text-xs text-slate-400 mt-0.5">Receipt attachment mandatory for all tax write-offs</p>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department:</span>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Departments</option>
            <option value="Retail Operations">Retail Operations</option>
            <option value="Supply Chain">Supply Chain</option>
            <option value="Warehouse Operations">Warehouse Operations</option>
            <option value="Commercial Sales">Commercial Sales</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-60">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee, category..."
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
            New Expense Claim
          </Button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Claim #</th>
                <th className="py-3 px-4">Employee / Claimant</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Category & Purpose</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Receipt</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {item.claim_number}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {item.employee}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {item.department}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">{item.category}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{item.description}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => {
                        addToast({
                          title: 'Receipt Evidence Opened',
                          message: `Viewing verified attachment: ${item.receipt}`,
                          type: 'info'
                        });
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                    >
                      <Paperclip className="w-3 h-3" />
                      View
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge
                      variant="outline"
                      className={`text-[11px] ${
                        item.status === 'Approved'
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          : item.status === 'Rejected'
                          ? 'border-rose-500/30 text-rose-400 bg-rose-500/10'
                          : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(item.id)}
                          className="text-xs text-emerald-400 hover:bg-emerald-500/20 p-1.5"
                          title="Approve Claim"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(item.id)}
                          className="text-xs text-rose-400 hover:bg-rose-500/20 p-1.5"
                          title="Reject Claim"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Claim Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Employee Expense Claim"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Employee Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Elena Rostova"
              value={newClaim.employee}
              onChange={(e) => setNewClaim({ ...newClaim, employee: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Department</label>
              <select
                value={newClaim.department}
                onChange={(e) => setNewClaim({ ...newClaim, department: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Retail Operations">Retail Operations</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="Warehouse Operations">Warehouse Operations</option>
                <option value="Commercial Sales">Commercial Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Category</label>
              <select
                value={newClaim.category}
                onChange={(e) => setNewClaim({ ...newClaim, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="POS Store Supplies">POS Store Supplies</option>
                <option value="Logistics Courier">Logistics Courier</option>
                <option value="Equipment Maintenance">Equipment Maintenance</option>
                <option value="Client Relations">Client Relations</option>
                <option value="Software & Cloud">Software & Cloud</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Claim Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={newClaim.amount}
                onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Date Incurred</label>
              <input
                type="date"
                value={newClaim.date}
                onChange={(e) => setNewClaim({ ...newClaim, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Business Purpose & Notes</label>
            <textarea
              rows={3}
              placeholder="State the commercial necessity and items purchased..."
              value={newClaim.description}
              onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="p-3 rounded-lg border border-dashed border-white/20 bg-[#050A16] flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <Paperclip className="w-4 h-4 text-primary" />
              <span>Simulated Receipt: <strong className="text-white">{newClaim.receiptName}</strong></span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase">Attached</span>
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
              Submit Claim
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
