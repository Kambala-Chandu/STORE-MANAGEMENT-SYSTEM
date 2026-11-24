import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Shield,
  Zap,
  Sparkles
} from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function GlobalWorkflowDrawer({
  isOpen,
  onClose,
  approvals = [],
  onSelectApproval,
  onOpenFullPage
}) {
  const pendingItems = approvals.filter((a) =>
    ['Pending', 'Changes Requested', 'Overdue'].includes(a.status)
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary-soft" />
          <span>Pending Approvals Queue</span>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
            {pendingItems.length} Actionable
          </Badge>
        </div>
      }
      subtitle="Quick authorization queue accessible via keyboard shortcut [A]"
      size="md"
      className="bg-[#0B1329] border-l border-white/10"
    >
      <div className="flex flex-col h-full space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs">
          <span className="text-slate-300">Shortcut: Press <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-[10px] text-white">N</kbd> for New Workflow</span>
          {onOpenFullPage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClose();
                onOpenFullPage();
              }}
              className="text-xs h-7 gap-1 text-primary-soft hover:text-white"
            >
              Full Workflows Hub <ExternalLink className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {pendingItems.length > 0 ? (
            pendingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectApproval(item);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/40 transition cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white group-hover:text-primary-soft">
                    {item.item_ref}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      item.priority === 'Urgent'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }
                  >
                    {item.priority}
                  </Badge>
                </div>

                <div className="text-xs">
                  <span className="text-slate-300 font-medium block">{item.workflow_name}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    By {item.requester} • Tier {item.current_level} of {item.total_levels}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-emerald-400 font-semibold">
                    ${Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                    Review Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <p>Your pending approvals queue is completely clear!</p>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
