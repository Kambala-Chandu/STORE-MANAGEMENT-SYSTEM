import React from 'react';
import { CheckCircle2, Shield, FileText } from 'lucide-react';
import { Badge } from '../ui';

export const QualityPlansView = ({ qualityPlans = [] }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Quality Control Inspection Plans</h3>
        <p className="text-xs text-slate-400">Standard Operating Procedures, AQL Sampling Plans and Tolerances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {qualityPlans.map((plan) => (
          <div key={plan.id} className="bg-[#0B1329] border border-white/10 rounded-xl p-5 hover:border-primary/40 transition-colors shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                  <p className="text-xs text-slate-400">Target: {plan.product}</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {plan.status}
              </Badge>
            </div>

            <div className="space-y-2 text-xs text-slate-300 bg-[#050A16]/50 p-3 rounded-lg border border-white/5">
              <div className="flex justify-between">
                <span className="text-slate-400">Sampling Standard:</span>
                <span className="font-medium text-white">{plan.sampling_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Acceptance Criteria:</span>
                <span className="font-medium text-emerald-400">{plan.acceptance_criteria}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/5 text-[11px]">
                <span className="text-slate-500">Last Revised:</span>
                <span className="font-mono text-slate-400">{plan.last_updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
