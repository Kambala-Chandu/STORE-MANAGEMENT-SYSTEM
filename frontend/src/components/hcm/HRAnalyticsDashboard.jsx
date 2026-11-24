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
  Users,
  Clock,
  DollarSign,
  PieChart as PieIcon,
  Award,
  Calendar
} from 'lucide-react';
import { Badge } from '../ui/Badge';

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
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function HRAnalyticsDashboard({ analyticsData }) {
  const defaultData = {
    departmentHeadcount: [
      { name: 'Supply Chain', count: 34 },
      { name: 'Retail Store', count: 28 },
      { name: 'Warehouse Inv', count: 19 },
      { name: 'Finance & Tax', count: 8 },
      { name: 'People & HR', count: 6 }
    ],
    attendanceTrend: [
      { month: 'May', rate: 95.2, overtime: 142 },
      { month: 'Jun', rate: 96.1, overtime: 168 },
      { month: 'Jul', rate: 94.8, overtime: 185 },
      { month: 'Aug', rate: 96.8, overtime: 154 },
      { month: 'Sep', rate: 96.4, overtime: 160 }
    ],
    hiringTrend: [
      { month: 'May', hired: 4, exited: 1 },
      { month: 'Jun', hired: 6, exited: 2 },
      { month: 'Jul', hired: 3, exited: 1 },
      { month: 'Aug', hired: 5, exited: 1 },
      { month: 'Sep', hired: 4, exited: 0 }
    ],
    payrollDistribution: [
      { name: 'Supply Chain & SCM', value: 112000 },
      { name: 'Retail Operations', value: 68500 },
      { name: 'Warehouse Logistics', value: 38200 },
      { name: 'Finance & HR Corp', value: 29900 }
    ],
    performanceCurve: [
      { rating: '5.0 Exceptional', percentage: 22 },
      { rating: '4.0 - 4.9 Exceeds', percentage: 56 },
      { rating: '3.0 - 3.9 Meets', percentage: 18 },
      { rating: '< 3.0 Needs Improvement', percentage: 4 }
    ]
  };

  const data = analyticsData || defaultData;

  return (
    <div className="space-y-6">
      {/* Grid: 2 Main Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount Distribution */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Staff Headcount Allocation by Department
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Active enterprise roster density</p>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-[10px]">
              95 Headcount
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentHeadcount}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Employees" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance & Overtime Trends */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Attendance Punctuality Rate & Overtime
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Punctuality percentage (Target: &gt;95%)</p>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
              96.4% Avg
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.attendanceTrend}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={[90, 100]} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" name="Attendance %" stroke="#10B981" fill="url(#attGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Hiring Net Flow & Payroll Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring vs Attrition */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Hiring Inflow vs Staff Attrition Trends
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Talent acquisition velocity vs turnover</p>
            </div>
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-[10px]">
              +16 Net Growth
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.hiringTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
                <Line type="monotone" dataKey="hired" name="New Hires" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="exited" name="Departures" stroke="#F43F5E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payroll Expense Allocation */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                Departmental Payroll Cost Apportionment
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Monthly gross wage allocation ($248,600)</p>
            </div>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px]">
              OPEX Staff
            </Badge>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.payrollDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.payrollDistribution.map((entry, index) => (
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
    </div>
  );
}
