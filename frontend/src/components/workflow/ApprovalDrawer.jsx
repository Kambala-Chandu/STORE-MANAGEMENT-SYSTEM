import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  XCircle,
  RotateCcw,
  UserCheck,
  TrendingUp,
  FileText,
  Clock,
  AlertTriangle,
  Building,
  User,
  Calendar,
  DollarSign,
  Send,
  Download,
  Shield,
  FileCheck,
  MessageSquare,
  History
} from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MultiLevelApprovalEngine } from './MultiLevelApprovalEngine';

export function ApprovalDrawer({
  approval,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
  onDelegate,
  onEscalate
}) {
  const [activeTab, setActiveTab] = useState('hierarchy');
  const [commentInput, setCommentInput] = useState('');
  const [delegateTarget, setDelegateTarget] = useState('Rachel Adams');
  const [actionModal, setActionModal] = useState(null); // 'approve' | 'reject' | 'changes' | 'delegate' | 'escalate'
  const [actionRemarks, setActionRemarks] = useState('');

  if (!approval) return null;

  const isPending = ['Pending', 'Changes Requested', 'Overdue'].includes(approval.status);

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
        return 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse';
      case 'Changes Requested':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Escalated':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default:
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
  };

  const handleConfirmAction = () => {
    if (!actionModal) return;
    if (actionModal === 'approve') onApprove(approval.id, actionRemarks);
    else if (actionModal === 'reject') onReject(approval.id, actionRemarks);
    else if (actionModal === 'changes') onRequestChanges(approval.id, actionRemarks);
    else if (actionModal === 'delegate') onDelegate(approval.id, delegateTarget, actionRemarks);
    else if (actionModal === 'escalate') onEscalate(approval.id, actionRemarks);

    setActionModal(null);
    setActionRemarks('');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span className="font-mono text-base font-bold text-white tracking-wide">
            {approval.item_ref}
          </span>
          <Badge variant="outline" className={getStatusBadge(approval.status)}>
            {approval.status}
          </Badge>
          <Badge variant="outline" className={getPriorityBadge(approval.priority)}>
            {approval.priority}
          </Badge>
        </div>
      }
      subtitle={
        <span className="text-xs text-slate-400">
          {approval.workflow_name} • Initiated by {approval.requester}
        </span>
      }
      size="xl"
      className="bg-[#0B1329] border-l border-white/10"
    >
      <div className="flex flex-col h-full space-y-6">
        {/* Top Summary Banner */}
        <div className="rounded-xl border border-white/10 bg-[#070D1E]/90 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Financial Impact</span>
            <span className="text-base font-bold text-white flex items-center gap-1 font-mono">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              {Number(approval.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Department</span>
            <span className="text-white font-medium flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-primary-soft" />
              {approval.department || 'Operations'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">SLA Target</span>
            <span
              className={`font-semibold flex items-center gap-1 font-mono ${
                approval.sla_status === 'Overdue'
                  ? 'text-rose-400'
                  : approval.sla_status === 'Warning'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {new Date(approval.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({approval.sla_status})
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Approval Stage</span>
            <span className="text-white font-medium">
              Tier {approval.current_level} of {approval.total_levels} ({approval.level_label})
            </span>
          </div>
        </div>

        {/* Requester Information */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-sm text-primary-soft">
              {approval.requester_avatar || approval.requester?.slice(0, 2).toUpperCase() || 'RQ'}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{approval.requester}</h4>
              <p className="text-xs text-slate-400">
                {approval.requester_role || 'Employee'} • {approval.department}
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {new Date(approval.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Executive Summary Narrative */}
        {approval.summary && (
          <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3.5 text-xs text-slate-300 leading-relaxed">
            <strong className="text-white font-medium block mb-1">Request Objective / Justification:</strong>
            {approval.summary}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-white/10 gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('hierarchy')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'hierarchy'
                ? 'border-primary text-primary-soft font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Approval Hierarchy & Timeline
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('attachments')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'attachments'
                ? 'border-primary text-primary-soft font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Attachments ({approval.attachments?.length || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comments')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'comments'
                ? 'border-primary text-primary-soft font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Discussion & Remarks ({approval.comments?.length || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-primary text-primary-soft font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Audit Trail ({approval.history?.length || 0})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'hierarchy' && (
            <MultiLevelApprovalEngine
              currentLevel={approval.current_level}
              totalLevels={approval.total_levels}
              status={approval.status}
              comments={approval.comments}
              history={approval.history}
            />
          )}

          {activeTab === 'attachments' && (
            <div className="space-y-3">
              {approval.attachments && approval.attachments.length > 0 ? (
                approval.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary-soft">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-white block">
                          {typeof file === 'string' ? file : file.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {typeof file === 'object' ? file.size : 'Verified Evidence Doc'}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-8">
                      <Download className="w-3.5 h-3.5" /> View
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  No attachments uploaded for this request.
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {approval.comments && approval.comments.length > 0 ? (
                  approval.comments.map((c, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{c.author}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                            {c.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(c.time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">No comments recorded yet.</p>
                )}
              </div>

              {/* Add Comment Input */}
              <div className="pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  placeholder="Add note or instruction for audit record..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!commentInput.trim()}
                  onClick={() => {
                    onApprove(approval.id, commentInput);
                    setCommentInput('');
                  }}
                  className="h-9 px-3 text-xs gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Note
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {approval.history && approval.history.length > 0 ? (
                approval.history.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{h.event}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{h.note || `Actor: ${h.actor}`}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4">No history entries available.</p>
              )}
            </div>
          )}
        </div>

        {/* Action Confirmation Modal Backdrop */}
        <AnimatePresence>
          {actionModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-xl border border-primary/40 bg-[#0E1A38] shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Confirm {actionModal.replace('_', ' ')}
                </span>
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {actionModal === 'delegate' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Select Delegation Recipient
                  </label>
                  <select
                    value={delegateTarget}
                    onChange={(e) => setDelegateTarget(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Rachel Adams (Finance Lead)">Rachel Adams (Finance Lead)</option>
                    <option value="Arthur Vance (Executive Director)">Arthur Vance (Executive Director)</option>
                    <option value="Marcus Chen (Department Manager)">Marcus Chen (Department Manager)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Reason / Audit Comment
                </label>
                <textarea
                  rows={2}
                  placeholder={`Enter justification for ${actionModal}...`}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActionModal(null)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant={
                    actionModal === 'approve'
                      ? 'success'
                      : actionModal === 'reject'
                      ? 'destructive'
                      : 'primary'
                  }
                  size="sm"
                  onClick={handleConfirmAction}
                  className="h-8 text-xs capitalize"
                >
                  Confirm {actionModal}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Footer Bar */}
        {isPending && !actionModal && (
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActionModal('delegate')}
                className="text-xs h-9 text-slate-300 hover:text-white"
              >
                <UserCheck className="w-3.5 h-3.5 mr-1 text-blue-400" /> Delegate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActionModal('escalate')}
                className="text-xs h-9 text-purple-400 hover:bg-purple-500/10"
              >
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> Escalate
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActionModal('changes')}
                className="text-xs h-9 border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Request Changes
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setActionModal('reject')}
                className="text-xs h-9"
              >
                <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
              </Button>

              <Button
                variant="success"
                size="sm"
                onClick={() => setActionModal('approve')}
                className="text-xs h-9 bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Authorize & Sign
              </Button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
