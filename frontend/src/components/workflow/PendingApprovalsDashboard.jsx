import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  Eye,
  Check,
  X,
  FileText,
  User,
  Shield,
  Layers,
  Sparkles,
  Calendar,
  DollarSign
} from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function PendingApprovalsDashboard({
  kpis,
  approvals,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onSelectApproval,
  onQuickApprove,
  onQuickReject
}) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Medium':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Rejected':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'Changes Requested':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Escalated':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default:
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Pending Approvals"
          value={kpis.pendingCount}
          delta={{ value: '+2 from yesterday', positive: false }}
          icon={Clock}
          tone="warning"
        />
        <StatCard
          title="Approved Today"
          value={kpis.approvedTodayCount}
          delta={{ value: '100% on schedule', positive: true }}
          icon={CheckCircle}
          tone="success"
        />
        <StatCard
          title="Rejected Requests"
          value={kpis.rejectedCount}
          delta={{ value: 'Policy enforcement', positive: true }}
          icon={XCircle}
          tone="danger"
        />
        <StatCard
          title="Avg Approval Time"
          value={kpis.avgApprovalHours}
          delta={{ value: '-18% vs last month', positive: true }}
          icon={Sparkles}
          tone="primary"
        />
        <StatCard
          title="SLA Compliance"
          value={kpis.slaComplianceRate}
          delta={{ value: 'Target: >95%', positive: true }}
          icon={Shield}
          tone="info"
        />
        <StatCard
          title="Late Approvals"
          value={kpis.lateApprovalsCount}
          delta={{ value: kpis.lateApprovalsCount > 0 ? 'Requires attention' : 'Zero overdue', positive: kpis.lateApprovalsCount === 0 }}
          icon={AlertTriangle}
          tone={kpis.lateApprovalsCount > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reference #, requester, department, or workflow..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_GROUP">All Actionable (Pending & Changes)</option>
            <option value="Pending">Pending Review</option>
            <option value="Overdue">Overdue Breach</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Escalated">Escalated</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Workflows</option>
            <option value="purchase_approval">Purchase Orders</option>
            <option value="sales_discount_approval">Sales Discounts</option>
            <option value="inventory_adjustment_approval">Inventory Adjustments</option>
            <option value="customer_credit_approval">Customer Credit</option>
            <option value="supplier_approval">Supplier Onboarding</option>
            <option value="user_creation_approval">User Roles</option>
            <option value="product_price_change_approval">Price Revisions</option>
            <option value="stock_transfer_approval">Stock Transfers</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Reference & Workflow</th>
                <th className="py-3.5 px-4">Requester</th>
                <th className="py-3.5 px-4">Impact / Amount</th>
                <th className="py-3.5 px-4">Hierarchy Progress</th>
                <th className="py-3.5 px-4">SLA Deadline</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {approvals.length > 0 ? (
                approvals.map((appr) => {
                  const isActionable = ['Pending', 'Changes Requested', 'Overdue'].includes(appr.status);

                  return (
                    <motion.tr
                      key={appr.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      onClick={() => onSelectApproval(appr)}
                    >
                      {/* Reference & Workflow */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white group-hover:text-primary-soft transition-colors">
                            {appr.item_ref}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {appr.workflow_name}
                        </span>
                      </td>

                      {/* Requester */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-[10px] text-primary-soft">
                            {appr.requester_avatar || appr.requester?.slice(0, 2).toUpperCase() || 'RQ'}
                          </div>
                          <div>
                            <span className="font-medium text-white block">{appr.requester}</span>
                            <span className="text-[10px] text-slate-500">{appr.department}</span>
                          </div>
                        </div>
                      </td>

                      {/* Impact / Amount */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-white">
                        {appr.amount > 0 ? (
                          <span className="flex items-center gap-0.5">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            {Number(appr.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">N/A (Policy)</span>
                        )}
                      </td>

                      {/* Hierarchy Progress */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-300 font-medium">
                            Tier {appr.current_level} of {appr.total_levels}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                          {appr.level_label}
                        </span>
                      </td>

                      {/* SLA Deadline */}
                      <td className="py-3.5 px-4">
                        <div
                          className={`flex items-center gap-1 font-mono text-[11px] font-semibold ${
                            appr.sla_status === 'Overdue'
                              ? 'text-rose-400'
                              : appr.sla_status === 'Warning'
                              ? 'text-amber-400'
                              : 'text-slate-300'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {new Date(appr.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(appr.sla_deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className={getPriorityBadge(appr.priority)}>
                          {appr.priority}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className={getStatusBadge(appr.status)}>
                          {appr.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {isActionable && (
                            <>
                              <button
                                type="button"
                                onClick={() => onQuickApprove(appr.id)}
                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition"
                                title="Quick Authorize"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onQuickReject(appr.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition"
                                title="Quick Reject"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelectApproval(appr)}
                            className="h-7 text-xs px-2 gap-1 text-slate-300 hover:text-white"
                          >
                            <Eye className="w-3 h-3" /> Review
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-slate-400">
                    No approval requests found matching the current search & filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
