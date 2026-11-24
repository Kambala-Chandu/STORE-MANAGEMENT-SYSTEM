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

export const ProjectAnalytics = ({ analytics }) => {
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white">Project Analytics & Performance Velocity</h3>
        <p className="text-xs text-slate-400">Sprint Throughput, Departmental Capital Allocations and Engineer Utilization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Velocity Trend */}
        <div className="bg-[#0B1329] border border-white/10 rounded-xl p-5 shadow-xl">
          <h4 className="text-xs font-semibold text-slate-300 mb-4">Sprint Story Velocity (Planned vs Completed)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.velocityTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="planned" name="Planned Stories" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="completed" name="Completed Stories" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget vs Spent */}
        <div className="bg-[#0B1329] border border-white/10 rounded-xl p-5 shadow-xl">
          <h4 className="text-xs font-semibold text-slate-300 mb-4">Capital Budget vs Actual Spend ($k)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.budgetDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="department" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} unit="k" />
                <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="budget" name="Approved Budget" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Actual Spent" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
