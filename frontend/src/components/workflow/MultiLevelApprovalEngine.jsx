import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Shield,
  User,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export function MultiLevelApprovalEngine({
  approvalLevels = [],
  currentLevel = 1,
  totalLevels = 3,
  status = 'Pending',
  comments = [],
  history = []
}) {
  // If approvalLevels array is not provided, generate default hierarchy based on current/total
  const tiers = approvalLevels.length > 0 ? approvalLevels : [
    { level: 1, role: 'Employee', label: 'Requester Submission', sla_hours: 0 },
    { level: 2, role: 'Manager', label: 'Department Manager Review', sla_hours: 24 },
    { level: 3, role: 'Finance', label: 'Finance Director Sign-off', sla_hours: 48 },
    { level: 4, role: 'Director', label: 'Executive Board Approval', sla_hours: 72 }
  ].slice(0, Math.max(totalLevels, 1));

  const getStepStatus = (levelIdx) => {
    const stepNum = levelIdx + 1;
    if (status === 'Rejected') {
      if (stepNum === currentLevel) return 'rejected';
      if (stepNum < currentLevel) return 'approved';
      return 'idle';
    }
    if (status === 'Approved') {
      return 'approved';
    }
    if (status === 'Escalated') {
      if (stepNum === currentLevel) return 'escalated';
      if (stepNum < currentLevel) return 'approved';
      return 'idle';
    }
    // Pending
    if (stepNum < currentLevel) return 'approved';
    if (stepNum === currentLevel) return 'in_progress';
    return 'idle';
  };

  const getStatusIcon = (stepStatus) => {
    switch (stepStatus) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-amber-400 animate-pulse" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      case 'escalated':
        return <AlertCircle className="w-5 h-5 text-purple-400" />;
      default:
        return <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />;
    }
  };

  const getBadgeStyle = (stepStatus) => {
    switch (stepStatus) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'in_progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'escalated':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Stepper Bar */}
      <div className="relative flex items-center justify-between w-full px-2 py-4">
        {/* Continuous Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
        <div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-gradient-to-r from-emerald-500 via-primary to-amber-500 -z-0 transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(0, ((currentLevel - 1) / Math.max(tiers.length - 1, 1)) * 100))}%`
          }}
        />

        {tiers.map((tier, idx) => {
          const stepStatus = getStepStatus(idx);
          const isCurrent = idx + 1 === currentLevel;

          return (
            <div key={tier.level || idx} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-[#0B1329] ${
                  stepStatus === 'approved'
                    ? 'border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/20'
                    : stepStatus === 'in_progress'
                    ? 'border-amber-400 text-amber-300 ring-4 ring-amber-400/20 shadow-md shadow-amber-500/20'
                    : stepStatus === 'rejected'
                    ? 'border-rose-500 text-rose-400'
                    : stepStatus === 'escalated'
                    ? 'border-purple-500 text-purple-400 ring-4 ring-purple-500/20'
                    : 'border-slate-700 text-slate-500'
                }`}
              >
                {getStatusIcon(stepStatus)}
              </div>

              <div className="mt-2 text-center">
                <span className="text-[11px] font-semibold text-white block whitespace-nowrap">
                  Tier {idx + 1}: {tier.role}
                </span>
                <span className="text-[10px] text-slate-400 block max-w-[110px] truncate">
                  {tier.label || `Level ${idx + 1}`}
                </span>
                {tier.sla_hours > 0 && (
                  <span className="text-[9px] font-mono text-slate-500">
                    SLA: {tier.sla_hours}h
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Detail Cards with Approver Remarks */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-primary" /> Approval Tier Audit Logs & Remarks
        </h4>

        {tiers.map((tier, idx) => {
          const stepStatus = getStepStatus(idx);
          const relatedComment = comments.find(
            (c) => c.role?.toLowerCase() === tier.role?.toLowerCase() || c.role?.toLowerCase().includes(tier.role?.toLowerCase())
          );
          const relatedHistory = history.find(
            (h) => h.event?.toLowerCase().includes(`level ${idx + 1}`) || (idx === tiers.length - 1 && h.event?.toLowerCase().includes('final'))
          );

          return (
            <motion.div
              key={tier.level || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                stepStatus === 'in_progress'
                  ? 'bg-amber-950/15 border-amber-500/30 ring-1 ring-amber-500/20'
                  : stepStatus === 'approved'
                  ? 'bg-emerald-950/10 border-emerald-500/20'
                  : stepStatus === 'rejected'
                  ? 'bg-rose-950/15 border-rose-500/30'
                  : 'bg-white/[0.02] border-white/5 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold ${
                      stepStatus === 'approved'
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : stepStatus === 'in_progress'
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                        : stepStatus === 'rejected'
                        ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                    }`}
                  >
                    T{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{tier.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-white/5 border-white/10 text-slate-300">
                        {tier.role}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {tier.sla_hours ? `Target turnaround: within ${tier.sla_hours} hours` : 'Immediate evaluation'}
                    </span>
                  </div>
                </div>

                <Badge variant="outline" className={getBadgeStyle(stepStatus)}>
                  {stepStatus === 'approved'
                    ? 'Approved'
                    : stepStatus === 'in_progress'
                    ? 'Awaiting Sign-off'
                    : stepStatus === 'rejected'
                    ? 'Rejected'
                    : stepStatus === 'escalated'
                    ? 'Escalated'
                    : 'Upcoming'}
                </Badge>
              </div>

              {/* Recorded Comment or Log */}
              {relatedComment ? (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-start gap-2.5 text-xs bg-black/20 p-2.5 rounded-lg">
                  <MessageSquare className="w-3.5 h-3.5 text-primary-soft shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{relatedComment.author}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(relatedComment.time).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-slate-300 italic">"{relatedComment.text}"</p>
                  </div>
                </div>
              ) : relatedHistory ? (
                <div className="mt-3 pt-2 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
                  <span>{relatedHistory.note || relatedHistory.event}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(relatedHistory.time).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
