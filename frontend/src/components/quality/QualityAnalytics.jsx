import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const QualityAnalytics = ({ analytics }) => {
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white">Quality Intelligence & Trend Analytics</h3>
        <p className="text-xs text-slate-400">First Pass Yield, Defect Pareto Distributions and CAPA Closure Velocity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Trend */}
        <div className="bg-[#0B1329] border border-white/10 rounded-xl p-5 shadow-xl">
          <h4 className="text-xs font-semibold text-slate-300 mb-4">First Pass Yield (FPY) 10-Month Trend vs Target (%)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.yieldTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis domain={[92, 100]} stroke="#64748B" fontSize={11} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="yield_rate" name="Actual Yield %" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="target" name="Target Floor %" stroke="#3B82F6" strokeDasharray="4 4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CAPA Closure Sprints */}
        <div className="bg-[#0B1329] border border-white/10 rounded-xl p-5 shadow-xl">
          <h4 className="text-xs font-semibold text-slate-300 mb-4">CAPA Ticket Velocity (Opened vs Closed)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.capaClosureTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="opened" name="Opened Issues" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" name="Remediated" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
