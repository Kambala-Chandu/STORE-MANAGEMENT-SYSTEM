import React from 'react';
import {
  Users,
  Target,
  TrendingUp,
  DollarSign,
  TrendingDown,
  Award,
  ShieldCheck,
  PieChart,
  Repeat,
  Smile,
  Clock,
  Sparkles
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export function CRMKPIGrid({ kpis }) {
  const defaultKPIs = {
    activeLeads: { title: 'Qualified Leads', value: '48 Leads', delta: '+14% MoM', tone: 'primary', subtitle: 'Active outbound pipeline' },
    openOpportunities: { title: 'Pipeline Deals', value: '26 Deals', delta: '78% high probability', tone: 'info', subtitle: 'Weighted pipeline' },
    conversionRate: { title: 'Lead Conversion', value: '34.2%', delta: '+2.8% pts', tone: 'success', subtitle: 'Lead-to-deal ratio' },
    activeCustomers: { title: 'Active Accounts', value: '1,240 Accounts', delta: '+8 new B2B', tone: 'primary', subtitle: 'B2B & Wholesale' },
    lifetimeValue: { title: 'Avg Customer LTV', value: '$84,500.00', delta: '+12.5% YoY', tone: 'success', subtitle: 'Retention expansion' },
    pipelineRevenue: { title: 'Weighted Forecast', value: '$170,550.00', delta: 'Q4 Expected', tone: 'info', subtitle: 'Probability-weighted' },
    averageDealSize: { title: 'Average Deal Size', value: '$48,500.00', delta: '+6.4% YoY', tone: 'primary', subtitle: 'Enterprise average' },
    customerChurn: { title: 'Gross Churn Rate', value: '3.8%', delta: '-1.1% reduction', tone: 'success', subtitle: 'Industry benchmark: 6.5%' },
    netPromoterScore: { title: 'Net Promoter Score', value: '76 NPS', delta: 'World-class (>70)', tone: 'success', subtitle: 'Verified CSAT surveys' },
    slaCompliance: { title: 'SLA Resolution Rate', value: '98.4%', delta: 'Under 4h average', tone: 'success', subtitle: 'Support desk tickets' },
    marketingROI: { title: 'Marketing ROI', value: '1,260%', delta: 'Q3 Attributed', tone: 'success', subtitle: 'Omnichannel campaigns' },
    retentionRate: { title: 'Account Retention', value: '96.2%', delta: 'Net revenue retention', tone: 'primary', subtitle: 'Annualized renewals' }
  };

  const data = kpis || defaultKPIs;

  const cardConfig = [
    { key: 'activeLeads', icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
    { key: 'openOpportunities', icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { key: 'conversionRate', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { key: 'activeCustomers', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { key: 'lifetimeValue', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { key: 'pipelineRevenue', icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { key: 'averageDealSize', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { key: 'customerChurn', icon: TrendingDown, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { key: 'netPromoterScore', icon: Smile, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { key: 'slaCompliance', icon: ShieldCheck, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { key: 'marketingROI', icon: PieChart, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { key: 'retentionRate', icon: Repeat, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {cardConfig.map(({ key, icon: Icon, color, bg }) => {
        const item = data[key] || defaultKPIs[key];
        const isPositive = item.delta?.includes('+') || item.delta?.includes('reduction') || item.delta?.includes('World-class') || item.delta?.includes('Expected') || item.delta?.includes('Net');

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
