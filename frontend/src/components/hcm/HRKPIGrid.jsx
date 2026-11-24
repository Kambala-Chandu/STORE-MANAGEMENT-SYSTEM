import React from 'react';
import {
  Users,
  UserCheck,
  Clock,
  DollarSign,
  Briefcase,
  TrendingDown,
  Calendar,
  Layers,
  Award,
  PieChart,
  BookOpen,
  Smile
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export function HRKPIGrid({ kpis }) {
  const defaultKPIs = {
    headcount: { title: 'Total Headcount', value: '95 Staff', delta: '+6 this quarter', tone: 'primary', subtitle: 'Global enterprise roster' },
    activeEmployees: { title: 'Active On Duty', value: '93 Active', delta: '97.8% active', tone: 'success', subtitle: '2 on authorized leave' },
    attendanceRate: { title: 'Average Attendance', value: '96.4%', delta: '+1.2% pts', tone: 'success', subtitle: 'Target: >95.0%' },
    payrollCost: { title: 'Monthly Payroll', value: '$248,600.00', delta: 'On budget', tone: 'primary', subtitle: 'September disbursement' },
    openPositions: { title: 'Open Requisitions', value: '7 Roles', delta: '146 applicants', tone: 'info', subtitle: 'Active ATS pipeline' },
    attritionRate: { title: 'Annualized Attrition', value: '3.8%', delta: '-0.9% reduction', tone: 'success', subtitle: 'Industry benchmark: 8.5%' },
    avgTenure: { title: 'Average Tenure', value: '3.2 Years', delta: '+0.4y growth', tone: 'info', subtitle: 'Strong talent retention' },
    leaveUtilization: { title: 'Leave Utilization', value: '62.4%', delta: 'Healthy balance', tone: 'neutral', subtitle: 'Accrual tracking' },
    performanceIndex: { title: 'High Performers', value: '88.5%', delta: 'Rated >= 4.0/5.0', tone: 'success', subtitle: 'Q3 review aggregate' },
    diversityRatio: { title: 'Gender Diversity', value: '48% / 52%', delta: 'Equitable parity', tone: 'primary', subtitle: 'F / M distribution' },
    trainingHours: { title: 'Training / Staff', value: '24.5 Hrs', delta: '+3.5 hrs YTD', tone: 'info', subtitle: 'Compliance & Safety' },
    employeeCSAT: { title: 'Pulse Engagement', value: '89 / 100', delta: '+4 pts increase', tone: 'success', subtitle: 'Quarterly pulse survey' }
  };

  const data = kpis || defaultKPIs;

  const cardConfig = [
    { key: 'headcount', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { key: 'activeEmployees', icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { key: 'attendanceRate', icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { key: 'payrollCost', icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { key: 'openPositions', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { key: 'attritionRate', icon: TrendingDown, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { key: 'avgTenure', icon: Calendar, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { key: 'leaveUtilization', icon: Layers, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { key: 'performanceIndex', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { key: 'diversityRatio', icon: PieChart, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { key: 'trainingHours', icon: BookOpen, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { key: 'employeeCSAT', icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {cardConfig.map(({ key, icon: Icon, color, bg }) => {
        const item = data[key] || defaultKPIs[key];
        const isPositive = item.delta?.includes('+') || item.delta?.includes('active') || item.delta?.includes('budget') || item.delta?.includes('reduction') || item.delta?.includes('Equitable');

        return (
          <div
            key={key}
            className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col justify-between hover:border-primary/40 transition duration-150"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                  {item.title}
                </span>
                <div className={`p-1.5 rounded-lg ${bg} ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 text-xl font-bold font-mono text-white tracking-tight">
                {item.value}
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className={`font-semibold font-mono ${isPositive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {item.delta}
              </span>
              <span className="text-slate-500 truncate max-w-[90px]">{item.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
