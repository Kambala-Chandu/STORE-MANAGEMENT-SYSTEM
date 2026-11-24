import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  Filter,
  DollarSign,
  PieChart as PieIcon,
  ShieldCheck,
  Calendar,
  Users
} from 'lucide-react';
import { Badge } from '../ui/Badge';

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-lg border border-white/10 bg-[#0B1329] shadow-xl text-xs space-y-1">
        <p className="font-bold text-white mb-1.5">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {typeof entry.value === 'number'
                ? entry.value > 1000
                  ? `$${entry.value.toLocaleString()}`
                  : entry.value
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function CRMAnalyticsDashboard({ analyticsData }) {
  const defaultData = {
    salesFunnel: [
      { stage: 'Prospecting', count: 140, value: 840000 },
      { stage: 'Qualified', count: 85, value: 510000 },
      { stage: 'Proposal Sent', count: 48, value: 288000 },
      { stage: 'Negotiation', count: 26, value: 170550 },
      { stage: 'Closed Won', count: 18, value: 124000 }
    ],
    leadSources: [
      { name: 'POS Referrals', value: 38 },
      { name: 'Website Demo Requests', value: 28 },
      { name: 'Trade Shows & Expos', value: 20 },
      { name: 'Partner Ecosystem', value: 14 }
    ],
    monthlyRevenueForecast: [
      { month: 'Jul', actual: 98000, forecast: 95000 },
      { month: 'Aug', actual: 112000, forecast: 108000 },
      { month: 'Sep', actual: 124000, forecast: 120000 },
      { month: 'Oct', actual: 65000, forecast: 135000 },
      { month: 'Nov', actual: 0, forecast: 148000 },
      { month: 'Dec', actual: 0, forecast: 160000 }
    ],
    churnAndRetention: [
      { month: 'May', retention: 95.8, churn: 4.2 },
      { month: 'Jun', retention: 96.1, churn: 3.9 },
      { month: 'Jul', retention: 96.0, churn: 4.0 },
      { month: 'Aug', retention: 96.4, churn: 3.6 },
      { month: 'Sep', retention: 96.2, churn: 3.8 }
    ]
  };

  const data = analyticsData || defaultData;

  return (
    <div className="space-y-6">
      {/* Row 1: Pipeline Funnel & Acquisition Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Pipeline Funnel Progression */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                Sales Pipeline Funnel Volume
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Deal velocity and stage progression value</p>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-[10px]">
              $1.93M Pipeline
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.salesFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="#64748B" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <YAxis dataKey="stage" type="category" stroke="#64748B" fontSize={11} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Acquisition Sources */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                Lead Acquisition Channel Attribution
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Top-of-funnel customer generation sources</p>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
              Multi-Touch
            </Badge>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.leadSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.leadSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => `${val}% Attribution`}
                  contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Revenue Forecast & Churn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast vs Actuals */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Weighted Revenue Forecast vs Actuals
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Closed deals vs expected pipeline closure</p>
            </div>
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-[10px]">
              Q4 Outlook
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyRevenueForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
                <Bar dataKey="actual" name="Closed Revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forecast" name="Forecast Target" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn vs Retention */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Account Retention vs Gross Churn Rate
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Net revenue retention stability</p>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
              96.2% Retention
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.churnAndRetention}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
                <Line type="monotone" dataKey="retention" name="Retention %" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="churn" name="Churn %" stroke="#F43F5E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
