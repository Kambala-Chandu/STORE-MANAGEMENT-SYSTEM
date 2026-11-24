import React, { useMemo, useState, memo } from 'react';
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
  Legend,
} from 'recharts';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Layers,
  Users,
  Boxes,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { Card, CardHeader, CardBody, Badge, Button } from '../ui';

const num = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);
const currency = (n) => `$${num(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const PALETTE = [
  '#2563eb', // Blue-600
  '#3b82f6', // Blue-500
  '#8b5cf6', // Violet-500
  '#10b981', // Emerald-500
  '#f59e0b', // Amber-500
  '#06b6d4', // Cyan-500
  '#ec4899', // Pink-500
  '#6366f1', // Indigo-500
];

/** Custom glassmorphic tooltip matching login card aesthetic */
export const CustomChartTooltip = ({ active, payload, label, formatter, unit = '' }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-white/[0.12] bg-[#0b1329]/[0.96] p-3 shadow-2xl backdrop-blur-xl">
      {label && <p className="mb-1 text-xs font-semibold text-slate-300">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="font-bold text-white">
              {formatter ? formatter(entry.value) : `${entry.value} ${unit}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 1. Inventory Distribution Donut / Radial Chart (Used in Second Row)
export const InventoryDistributionChart = memo(({ stats, products = [], loading = false }) => {
  const data = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const cat = p.category_name || 'General';
      if (!map[cat]) map[cat] = { name: cat, value: 0, units: 0 };
      map[cat].value += num(p.quantity) * num(p.selling_price || p.price || 0);
      map[cat].units += num(p.quantity);
    });

    const list = Object.values(map).sort((a, b) => b.value - a.value);
    if (!list.length) {
      const total = stats?.total_products || 24;
      const low = stats?.low_stock_count || 4;
      return [
        { name: 'In-Stock Optimal', value: Math.max(1, total - low), units: 480 },
        { name: 'Low Stock Urgency', value: low, units: 35 },
        { name: 'Safety Buffer', value: Math.round(total * 0.3), units: 140 },
      ];
    }
    return list.slice(0, 5);
  }, [products, stats]);

  const totalValuation = useMemo(() => data.reduce((s, c) => s + c.value, 0), [data]);

  return (
    <Card className="flex flex-col border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg h-full">
      <CardHeader
        title="Inventory Distribution"
        description="Catalog asset share by category"
        actions={
          <Button as={Link} to="/inventory" variant="ghost" size="sm" iconRight={ArrowRight}>
            Ledger
          </Button>
        }
      />
      <CardBody className="flex-1 p-4 flex flex-col justify-between">
        <div className="h-56 sm:h-64 w-full">
          {loading ? (
            <div className="h-full w-full animate-pulse rounded-xl bg-white/[0.03]" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomChartTooltip formatter={(v) => currency(v)} />} />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  stroke="rgba(11, 19, 41, 0.8)"
                  strokeWidth={2}
                  isAnimationActive
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`inv-cell-${index}`}
                      fill={PALETTE[index % PALETTE.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend pills */}
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs border-t border-white/[0.06] pt-3">
          {data.slice(0, 4).map((item, idx) => (
            <div key={item.name} className="flex items-center gap-2 truncate">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
              />
              <span className="truncate text-slate-300 text-[11px]">{item.name}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
});
InventoryDistributionChart.displayName = 'InventoryDistributionChart';

// 2. Category Analytics Chart (Used in Second Row)
export const CategoryAnalyticsChart = memo(({ stats, products = [], loading = false }) => {
  const data = useMemo(() => {
    // If top products exist, categorize their velocity
    if (products && products.length > 0) {
      const catMap = {};
      products.forEach((p) => {
        const cat = p.category_name || 'General';
        if (!catMap[cat]) catMap[cat] = { category: cat, units: 0, revenue: 0 };
        catMap[cat].units += num(p.quantity);
        catMap[cat].revenue += num(p.quantity) * num(p.selling_price || p.price || 0);
      });
      const list = Object.values(catMap).sort((a, b) => b.revenue - a.revenue);
      return list.slice(0, 5);
    }

    if (stats?.top_products?.length) {
      return stats.top_products.slice(0, 5).map((p) => ({
        category: p.name.length > 12 ? `${p.name.substring(0, 10)}…` : p.name,
        revenue: p.revenue,
        units: p.units_sold,
      }));
    }

    return [
      { category: 'Beverages', revenue: 4200, units: 280 },
      { category: 'Electronics', revenue: 8900, units: 140 },
      { category: 'Dairy', revenue: 3100, units: 310 },
      { category: 'Snacks', revenue: 2400, units: 190 },
      { category: 'Household', revenue: 1800, units: 85 },
    ];
  }, [products, stats]);

  return (
    <Card className="flex flex-col border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg h-full">
      <CardHeader
        title="Category Sales Analytics"
        description="Department volume & velocity"
        actions={
          <Button as={Link} to="/categories" variant="ghost" size="sm" iconRight={ArrowRight}>
            Categories
          </Button>
        }
      />
      <CardBody className="flex-1 p-4 flex flex-col justify-between">
        <div className="h-56 sm:h-64 w-full">
          {loading ? (
            <div className="h-full w-full animate-pulse rounded-xl bg-white/[0.03]" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="category"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${Number(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip content={<CustomChartTooltip formatter={(v) => currency(v)} />} />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cat-bar-${index}`}
                      fill={PALETTE[index % PALETTE.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/[0.06] pt-3">
          <span>Top Velocity Sector</span>
          <span className="font-semibold text-emerald-400">{data[0]?.category || 'General'}</span>
        </div>
      </CardBody>
    </Card>
  );
});
CategoryAnalyticsChart.displayName = 'CategoryAnalyticsChart';

// 3. Weekly Orders Flow Chart
export const WeeklyOrdersChart = memo(({ stats, loading = false }) => {
  const data = useMemo(() => {
    const trend = stats?.sales_trend || [];
    if (trend.length >= 7) {
      return trend.slice(-7).map((d) => {
        const parts = (d.date || '').split('-');
        const dayLabel = parts.length === 3 ? `${parts[1]}/${parts[2]}` : d.date;
        return {
          day: dayLabel,
          orders: num(d.orders),
          revenue: num(d.revenue),
        };
      });
    }

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => ({
      day,
      orders: Math.floor(16 + Math.sin(i * 1.2) * 8 + i * 2),
      revenue: Math.floor(1200 + Math.sin(i * 1.5) * 450 + i * 150),
    }));
  }, [stats]);

  return (
    <Card className="flex flex-col border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg h-full">
      <CardHeader title="Weekly Order Velocity" description="Daily completed sales volume" />
      <CardBody className="flex-1 p-4">
        <div className="h-56 sm:h-64 w-full">
          {loading ? (
            <div className="h-full w-full animate-pulse rounded-xl bg-white/[0.03]" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="orderAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomChartTooltip unit="orders" />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders Completed"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#orderAreaGrad)"
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardBody>
    </Card>
  );
});
WeeklyOrdersChart.displayName = 'WeeklyOrdersChart';

// 4. Combined Full Recharts Analytics Suite (interactive tabbed view)
export const RechartsAnalytics = memo(({ stats, products = [], recentSales = [], customers = [] }) => {
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    { id: 'inventory', label: 'Inventory Distribution', icon: PieIcon },
    { id: 'categories', label: 'Category Sales', icon: BarChart3 },
    { id: 'weekly', label: 'Weekly Velocity', icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
      <InventoryDistributionChart stats={stats} products={products} />
      <CategoryAnalyticsChart stats={stats} products={products} />
    </div>
  );
});
RechartsAnalytics.displayName = 'RechartsAnalytics';

export default RechartsAnalytics;

