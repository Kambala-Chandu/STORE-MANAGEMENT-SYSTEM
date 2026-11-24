import React from 'react';
import { Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '../ui';

export const QualityAuditsView = ({ audits = [] }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Quality Compliance & Standards Audits</h3>
        <p className="text-xs text-slate-400">External Accreditations, Internal Quality System Checks and Vendor Audits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {audits.map((a) => (
          <div key={a.id} className="bg-[#0B1329] border border-white/10 rounded-xl p-5 shadow-xl hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  {a.type}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Scope: {a.scope}</p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {a.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#050A16]/50 p-3 rounded-lg border border-white/5 text-center">
              <div>
                <div className="text-[10px] text-slate-400">Compliance Score</div>
                <div className="text-base font-bold text-emerald-400">{a.score}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Findings Count</div>
                <div className="text-base font-bold text-amber-400">{a.findings_count}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Audit Date</div>
                <div className="text-xs font-mono text-slate-300 mt-1">{a.date}</div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-400 flex justify-between items-center">
              <span>Lead Auditor:</span>
              <span className="text-white font-medium">{a.auditor}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
