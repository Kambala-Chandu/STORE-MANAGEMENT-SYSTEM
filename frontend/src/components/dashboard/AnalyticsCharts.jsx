import React, { useMemo } from 'react';
import { Card, CardHeader, CardBody } from '../ui';
import {
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
  ResponsiveContainer,
  Legend,
  Label
} from 'recharts';

const chartConfig = {
  theme: {
    axis: {
      tick: { fill: '#64748b', fontSize: 12 },
      axisLine: { stroke: 'rgba(255,255,255,0.06)' },
      tickLine: { stroke: 'rgba(255,255,255,0.06)' }
    },
    grid: {
      stroke: 'rgba(255,255,255,0.06)'
    }
  },
  colors: {
    primary: '#3b82f6',
    primarySoft: '#93c5fd',
    warning: '#f59e0b',
    slate: '#64748b',
    white: '#ffffff',
    tooltipBg: '#0b1329',
    tooltipBorder: 'rgba(255,255,255,0.08)'
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/[0.08] bg-[#0b1329] p-3 shadow-xl">
        {label && <p className="mb-2 text-sm font-medium text-slate-200">{label}</p>}
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="font-semibold text-slate-100">
              {typeof entry.value === 'number' && entry.name.toLowerCase().includes('revenue')
                ? `$${entry.value.toLocaleString()}`
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const InventoryDistributionChart = React.memo(({ stats }) => {
  const data = useMemo(() => {
    if (!stats) return [];
    const inStock = Math.max(0, (stats.total_products || 0) - (stats.low_stock_count || 0));
    return [
      { name: 'In Stock', value: inStock, color: chartConfig.colors.primary },
      { name: 'Low Stock', value: stats.low_stock_count || 0, color: chartConfig.colors.warning }
    ];
  }, [stats]);

  if (!stats) return null;

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
      <CardHeader>
        <h3 className="text-lg font-semibold text-white">Inventory Status</h3>
      </CardHeader>
      <CardBody>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
                <Label
                  value={stats.total_products || 0}
                  position="center"
                  fill={chartConfig.colors.white}
                  style={{ fontSize: '24px', fontWeight: 'bold' }}
                />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
});
InventoryDistributionChart.displayName = 'InventoryDistributionChart';

export const WeeklyOrdersChart = React.memo(({ stats }) => {
  const data = useMemo(() => {
    if (!stats?.sales_trend) return [];
    return stats.sales_trend.slice(-7).map(d => ({
      ...d,
      date: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })
    }));
  }, [stats]);

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
      <CardHeader>
        <h3 className="text-lg font-semibold text-white">Weekly Orders</h3>
      </CardHeader>
      <CardBody>
        <div className="h-64 w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.colors.primary} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartConfig.colors.primary} stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartConfig.theme.grid.stroke} />
                <XAxis dataKey="date" {...chartConfig.theme.axis} />
                <YAxis {...chartConfig.theme.axis} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="orders" name="Orders" fill="url(#colorOrders)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
          )}
        </div>
      </CardBody>
    </Card>
  );
});
WeeklyOrdersChart.displayName = 'WeeklyOrdersChart';

export const RevenueComparisonChart = React.memo(({ stats }) => {
  const data = useMemo(() => {
    if (!stats?.sales_trend || stats.sales_trend.length < 2) return [];
    const trend = stats.sales_trend;
    const mid = Math.floor(trend.length / 2);
    const prev = trend.slice(0, mid);
    const curr = trend.slice(mid);
    
    // Merge into same array for comparison
    return curr.map((d, i) => ({
      day: `Day ${i + 1}`,
      current_revenue: d.revenue || 0,
      previous_revenue: prev[i]?.revenue || 0,
    }));
  }, [stats]);

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
      <CardHeader>
        <h3 className="text-lg font-semibold text-white">Revenue Comparison</h3>
      </CardHeader>
      <CardBody>
        <div className="h-64 w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.colors.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartConfig.colors.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.colors.slate} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartConfig.colors.slate} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartConfig.theme.grid.stroke} />
                <XAxis dataKey="day" {...chartConfig.theme.axis} />
                <YAxis {...chartConfig.theme.axis} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="previous_revenue" name="Previous Period" stroke={chartConfig.colors.slate} fillOpacity={1} fill="url(#colorPrev)" />
                <Area type="monotone" dataKey="current_revenue" name="Current Period" stroke={chartConfig.colors.primary} fillOpacity={1} fill="url(#colorCurr)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
          )}
        </div>
      </CardBody>
    </Card>
  );
});
RevenueComparisonChart.displayName = 'RevenueComparisonChart';

export const CategorySalesChart = React.memo(({ stats }) => {
  const data = useMemo(() => {
    if (!stats?.top_products) return [];
    return [...stats.top_products]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [stats]);

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
      <CardHeader>
        <h3 className="text-lg font-semibold text-white">Top Products by Revenue</h3>
      </CardHeader>
      <CardBody>
        <div className="h-64 w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor={chartConfig.colors.primarySoft} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartConfig.colors.primary} stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartConfig.theme.grid.stroke} />
                <XAxis type="number" {...chartConfig.theme.axis} tickFormatter={(val) => `$${val}`} />
                <YAxis type="category" dataKey="name" {...chartConfig.theme.axis} width={80} tick={{ fill: '#e2e8f0', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="revenue" name="Revenue" fill="url(#colorSales)" radius={[0, 4, 4, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
          )}
        </div>
      </CardBody>
    </Card>
  );
});
CategorySalesChart.displayName = 'CategorySalesChart';

export const AnalyticsGrid = React.memo(({ stats, loading }) => {
  if (loading) {
    return (
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[340px] animate-pulse rounded-xl border border-white/[0.08] bg-[#0b1329]/[0.85]" />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <RevenueComparisonChart stats={stats} />
      <WeeklyOrdersChart stats={stats} />
      <InventoryDistributionChart stats={stats} />
      <CategorySalesChart stats={stats} />
    </section>
  );
});
AnalyticsGrid.displayName = 'AnalyticsGrid';

export default AnalyticsGrid;
