import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
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
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

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
              ${Number(entry.value).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function FinancialAnalyticsCharts({ analyticsData }) {
  const [trendRange, setTrendRange] = useState('9M');

  const defaultData = {
    revenueTrend: [
      { month: 'Jan', revenue: 165000, expenses: 38000, profit: 59400 },
      { month: 'Feb', revenue: 172000, expenses: 39500, profit: 61920 },
      { month: 'Mar', revenue: 183400, expenses: 41000, profit: 66024 },
      { month: 'Apr', revenue: 194000, expenses: 42500, profit: 69840 },
      { month: 'May', revenue: 201200, expenses: 43800, profit: 72432 },
      { month: 'Jun', revenue: 203000, expenses: 44200, profit: 73080 },
      { month: 'Jul', revenue: 218400, expenses: 46500, profit: 78624 },
      { month: 'Aug', revenue: 228900, expenses: 48200, profit: 82404 },
      { month: 'Sep', revenue: 234800, expenses: 49500, profit: 84528 }
    ],
    cashFlowTrend: [
      { month: 'May', operating: 68000, investing: -12000, net: 51000 },
      { month: 'Jun', operating: 72000, investing: -8000, net: 59000 },
      { month: 'Jul', operating: 79000, investing: -15000, net: 59000 },
      { month: 'Aug', operating: 84000, investing: -10000, net: 69000 },
      { month: 'Sep', operating: 88000, investing: -14000, net: 69000 }
    ],
    receivableAging: [
      { range: '0-30d Current', amount: 245000, color: '#10B981' },
      { range: '31-60d Warning', amount: 48000, color: '#3B82F6' },
      { range: '61-90d Overdue', amount: 18000, color: '#F59E0B' },
      { range: '90d+ Default Risk', amount: 7400, color: '#F43F5E' }
    ],
    departmentSpending: [
      { name: 'Supply Chain & Logistics', value: 420800 },
      { name: 'Retail POS Operations', value: 298400 },
      { name: 'IT & Cloud Infrastructure', value: 164200 },
      { name: 'Executive & Admin', value: 148500 }
    ]
  };

  const data = analyticsData || defaultData;

  return (
    <div className="space-y-6">
      {/* Chart 1: Revenue, Expense & Net Margin Trend */}
      <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Enterprise Revenue & Operating Profitability Dynamics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Consolidated billed revenue, OPEX expenditures, and pre-tax EBITDA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
              +18.6% Margin YoY
            </Badge>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.revenueTrend}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Gross Revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGrad)"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Operating Expenses"
                stroke="#F43F5E"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="Net Margin"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#profitGrad)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: 2 Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Distribution */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Monthly Cash Flow Activity
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Operating inflows vs CapEx investing</p>
            </div>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10">
              Positive Cashflow
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cashFlowTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                <Bar dataKey="operating" name="Operating Cash In" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="investing" name="CapEx Outflow" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="net" name="Net Position" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Spending Pie */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-cyan-400" />
                Department Cost Center Allocation
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Proportional operational expense distribution</p>
            </div>
            <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
              Budget Controlled
            </Badge>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.departmentSpending}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.departmentSpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => `$${Number(val).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#0B1329', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AR Aging Bar Breakdown */}
      <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Accounts Receivable Aging Maturity Tranches
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Current vs aging delinquency buckets</p>
          </div>
          <span className="text-xs font-mono text-slate-300">
            Total Outstanding: <strong className="text-white">$318,400.00</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {data.receivableAging.map((bucket, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#050A16] border border-white/5 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 block">{bucket.range}</span>
              <div className="text-lg font-bold font-mono text-white">
                ${bucket.amount.toLocaleString()}
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: bucket.color,
                    width: `${Math.round((bucket.amount / 318400) * 100)}%`
                  }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {Math.round((bucket.amount / 318400) * 100)}% of total AR
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
