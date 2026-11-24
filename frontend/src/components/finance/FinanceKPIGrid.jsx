import React from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  CreditCard,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  AlertCircle,
  Briefcase,
  Layers,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export function FinanceKPIGrid({ kpis }) {
  const defaultKPIs = {
    revenue: { title: 'Gross Revenue', value: '$2,450,800.00', delta: '+14.2%', tone: 'primary', subtitle: 'Billed sales YTD' },
    expenses: { title: 'Operating Expenses', value: '$485,120.00', delta: '-4.2% under', tone: 'warning', subtitle: 'OPEX spend' },
    netProfit: { title: 'Net Profit (EBITDA)', value: '$882,280.00', delta: '+18.6%', tone: 'success', subtitle: 'Pre-tax EBITDA' },
    grossProfit: { title: 'Gross Profit', value: '$1,245,600.00', delta: '+12.4%', tone: 'info', subtitle: '36.0% margin' },
    cash: { title: 'Cash on Hand', value: '$48,250.00', delta: '+1.5%', tone: 'neutral', subtitle: 'Store vault safe' },
    bankBalance: { title: 'Bank Balances', value: '$594,550.00', delta: '+8.4%', tone: 'primary', subtitle: 'JPMorgan & Wells' },
    receivables: { title: 'Accounts Receivable', value: '$318,400.00', delta: '94% current', tone: 'info', subtitle: 'Trade AR balance' },
    payables: { title: 'Accounts Payable', value: '$242,500.00', delta: '100% scheduled', tone: 'warning', subtitle: 'Trade AP balance' },
    operatingMargin: { title: 'Operating Margin', value: '36.0%', delta: '+1.4% pts', tone: 'success', subtitle: 'Healthy retention' },
    budgetUtilization: { title: 'Budget Utilization', value: '89.4%', delta: 'Under budget', tone: 'primary', subtitle: 'Fiscal control' },
    outstandingInvoices: { title: 'Outstanding Invoices', value: '$35,820.00', delta: '3 overdue', tone: 'danger', subtitle: 'Collections watch' },
    workingCapital: { title: 'Net Working Capital', value: '$1,719,400.00', delta: '2.44x ratio', tone: 'success', subtitle: 'Strong liquidity' }
  };

  const data = kpis || defaultKPIs;

  const cardConfig = [
    { key: 'revenue', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { key: 'expenses', icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { key: 'netProfit', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { key: 'grossProfit', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { key: 'cash', icon: Briefcase, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { key: 'bankBalance', icon: Building, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { key: 'receivables', icon: ArrowUpRight, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { key: 'payables', icon: ArrowDownRight, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { key: 'operatingMargin', icon: PieChart, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { key: 'budgetUtilization', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { key: 'outstandingInvoices', icon: FileText, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { key: 'workingCapital', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {cardConfig.map(({ key, icon: Icon, color, bg }) => {
        const item = data[key] || defaultKPIs[key];
        const isPositive = item.delta?.includes('+') || item.delta?.includes('under') || item.delta?.includes('current') || item.delta?.includes('ratio');

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
              <span className={`font-semibold font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
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
