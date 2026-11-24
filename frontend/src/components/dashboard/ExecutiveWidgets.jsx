import React, { memo } from 'react';
import { Target, Activity, Clock, Crown } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui';
import { cn } from '../../lib/cn';

// Formatters
const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value || 0);

// Shared Skeleton
const Skeleton = ({ className }) => <div className={cn("animate-pulse rounded-md bg-white/5", className)} />;

export const RevenueTargetWidget = memo(({ stats, loading }) => {
  if (loading) return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg h-full">
      <CardHeader className="pb-2"><Skeleton className="h-5 w-24" /></CardHeader>
      <CardBody className="flex items-center justify-center py-6"><Skeleton className="h-32 w-32 rounded-full" /></CardBody>
    </Card>
  );

  const revenue = stats?.total_revenue || 0;
  const target = 50000;
  const percentage = Math.min((revenue / target) * 100, 100);
  
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-slate-400">Revenue Target</h3>
        <Target className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center py-4">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="url(#blueGradient)"
              className="transition-all duration-1000 ease-in-out"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-white">{percentage.toFixed(0)}%</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center text-center">
          <span className="text-sm font-medium text-white">{formatCurrency(revenue)}</span>
          <span className="text-xs text-slate-500">of {formatCurrency(target)} target</span>
        </div>
      </CardBody>
    </Card>
  );
});
RevenueTargetWidget.displayName = 'RevenueTargetWidget';

export const InventoryHealthWidget = memo(({ stats, loading }) => {
  if (loading) return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg h-full">
      <CardHeader className="pb-2"><Skeleton className="h-5 w-32" /></CardHeader>
      <CardBody><Skeleton className="h-16 w-full" /></CardBody>
    </Card>
  );

  const total = stats?.total_products || 0;
  const lowStock = stats?.low_stock_count || 0;
  const healthy = total - lowStock;
  const percentage = total > 0 ? (healthy / total) * 100 : 0;
  
  let color = '#22c55e'; // green-500
  if (percentage < 50) color = '#ef4444'; // red-500
  else if (percentage <= 80) color = '#f59e0b'; // amber-500

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-slate-400">Inventory Health</h3>
        <Activity className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardBody className="flex flex-col justify-between py-4 h-full gap-4">
        <div>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-bold text-white">{percentage.toFixed(0)}%</span>
            <span className="text-sm text-slate-400 mb-1">Healthy</span>
          </div>
          <p className="text-xs text-slate-500">
            {formatNumber(healthy)} of {formatNumber(total)} products are well stocked
          </p>
        </div>
        
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mt-auto">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-in-out" 
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      </CardBody>
    </Card>
  );
});
InventoryHealthWidget.displayName = 'InventoryHealthWidget';

export const TodaySummaryWidget = memo(({ stats, loading }) => {
  if (loading) return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg h-full">
      <CardHeader className="pb-2"><Skeleton className="h-5 w-24" /></CardHeader>
      <CardBody className="space-y-4 py-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
      </CardBody>
    </Card>
  );

  const sales = stats?.today_sales || 0;
  const orders = stats?.today_orders || 0;
  const aov = orders > 0 ? sales / orders : 0;

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-slate-400">Today's Summary</h3>
        <Clock className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardBody className="py-2 flex flex-col justify-around h-[calc(100%-2rem)]">
        <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
          <span className="text-sm text-slate-400">Sales</span>
          <span className="font-semibold text-white">{formatCurrency(sales)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
          <span className="text-sm text-slate-400">Orders</span>
          <span className="font-semibold text-white">{formatNumber(orders)}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-slate-400">Avg Value</span>
          <span className="font-semibold text-white">{formatCurrency(aov)}</span>
        </div>
      </CardBody>
    </Card>
  );
});
TodaySummaryWidget.displayName = 'TodaySummaryWidget';

export const TopCategoryWidget = memo(({ stats, loading }) => {
  if (loading) return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg h-full">
      <CardHeader className="pb-2"><Skeleton className="h-5 w-32" /></CardHeader>
      <CardBody className="py-4"><Skeleton className="h-24 w-full" /></CardBody>
    </Card>
  );

  const topProduct = stats?.top_products?.[0];

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <h3 className="text-sm font-medium text-slate-400">Top Product</h3>
        <Crown className="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardBody className="flex flex-col justify-between py-4 h-full relative z-10">
        {topProduct ? (
          <>
            <div>
              <h4 className="text-base font-semibold text-white truncate" title={topProduct.name}>
                {topProduct.name}
              </h4>
              <p className="text-xs text-yellow-500/80 mt-1 font-mono">{topProduct.sku}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 bg-white/[0.02] rounded-lg p-3 border border-white/[0.05]">
              <div>
                <p className="text-xs text-slate-500 mb-1">Units Sold</p>
                <p className="text-sm font-semibold text-white">{formatNumber(topProduct.units_sold)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Revenue</p>
                <p className="text-sm font-semibold text-white">{formatCurrency(topProduct.revenue)}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No product data available
          </div>
        )}
      </CardBody>
    </Card>
  );
});
TopCategoryWidget.displayName = 'TopCategoryWidget';

export const ExecutiveWidgetsGrid = memo(({ stats, loading }) => (
  <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <RevenueTargetWidget stats={stats} loading={loading} />
    <InventoryHealthWidget stats={stats} loading={loading} />
    <TodaySummaryWidget stats={stats} loading={loading} />
    <TopCategoryWidget stats={stats} loading={loading} />
  </section>
));
ExecutiveWidgetsGrid.displayName = 'ExecutiveWidgetsGrid';

export default ExecutiveWidgetsGrid;
