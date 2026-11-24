import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  PieChart as PieIcon,
  Shield,
  Activity
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';

const VOLUME_TREND_DATA = [
  { day: 'Mon', submitted: 18, approved: 16, rejected: 2 },
  { day: 'Tue', submitted: 24, approved: 22, rejected: 1 },
  { day: 'Wed', submitted: 29, approved: 26, rejected: 3 },
  { day: 'Thu', submitted: 35, approved: 31, rejected: 2 },
  { day: 'Fri', submitted: 42, approved: 39, rejected: 2 },
  { day: 'Sat', submitted: 22, approved: 20, rejected: 1 },
  { day: 'Sun', submitted: 14, approved: 13, rejected: 0 }
];

const DEPARTMENT_HOURS_DATA = [
  { dept: 'POS Cashiers', hours: 0.8 },
  { dept: 'Procurement', hours: 4.5 },
  { dept: 'Warehouse Ops', hours: 11.2 },
  { dept: 'Finance & Risk', hours: 16.4 },
  { dept: 'Exec Board', hours: 28.6 }
];

const OUTCOME_PIE_DATA = [
  { name: 'Approved', value: 167, color: '#10B981' },
  { name: 'Pending Review', value: 24, color: '#F59E0B' },
  { name: 'Rejected', value: 11, color: '#F43F5E' },
  { name: 'Escalated', value: 6, color: '#8B5CF6' }
];

const SLA_BY_WORKFLOW_DATA = [
  { name: 'PO Approval', compliance: 96.5 },
  { name: 'POS Discount', compliance: 99.2 },
  { name: 'Inventory Adj', compliance: 91.8 },
  { name: 'Credit Increase', compliance: 94.0 },
  { name: 'Supplier Onboard', compliance: 100.0 },
  { name: 'Price Change', compliance: 95.5 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1329] p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1">
      {label && <p className="font-semibold text-white mb-1">{label}</p>}
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
          <span className="text-slate-400 capitalize">{entry.name}:</span>
          <span className="font-mono font-bold text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function WorkflowAnalyticsCharts() {
  return (
    <div className="space-y-6">
      {/* Top 2 charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Throughput Volume */}
        <div className="lg:col-span-8 rounded-xl border border-white/10 bg-[#0B1329] p-5">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-soft" />
              <h3 className="text-sm font-semibold text-white">
                Approval Volume & Processing Throughput (7 Days)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              96.2% Velocity
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VOLUME_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="submitted"
                  name="Submitted"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSubmitted)"
                />
                <Area
                  type="monotone"
                  dataKey="approved"
                  name="Approved"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorApproved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outcome Breakdown Donut */}
        <div className="lg:col-span-4 rounded-xl border border-white/10 bg-[#0B1329] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <PieIcon className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Decision Outcomes</h3>
          </div>

          <div className="h-52 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={OUTCOME_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {OUTCOME_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-white/5">
            {OUTCOME_PIE_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400 truncate">{item.name}</span>
                <span className="font-mono font-bold text-white ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 2 charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Turnaround Time by Department */}
        <div className="lg:col-span-6 rounded-xl border border-white/10 bg-[#0B1329] p-5">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Average Resolution Time (Hours)</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Benchmark: &lt;24h</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENT_HOURS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="dept" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="h" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" name="Average Hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Compliance by Workflow */}
        <div className="lg:col-span-6 rounded-xl border border-white/10 bg-[#0B1329] p-5">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">SLA Compliance Rate (%) by Category</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Org Target: &gt;95%</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={SLA_BY_WORKFLOW_DATA}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" domain={[80, 100]} stroke="#64748B" fontSize={11} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="compliance" name="SLA Compliance" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
