import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Users,
  Truck,
  TrendingUp,
  RefreshCw,
  Boxes,
  ScanLine,
  FileBarChart,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Receipt,
  ShieldCheck,
  CircleDot,
  Layers,
  Database,
  Clock,
  CreditCard,
  Building2,
  Server,
  KeyRound,
  FileText,
  HelpCircle,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  ErrorState,
  SkeletonCard,
  Sparkline,
  StatCard,
  cn,
} from '../components/ui';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RANGES = [
  { value: 7, label: '7 Days' },
  { value: 14, label: '14 Days' },
  { value: 30, label: '30 Days' },
];

const QUICK_ACTIONS = [
  {
    to: '/pos',
    label: 'POS Register',
    description: 'Launch checkout & invoice creation',
    icon: ShoppingCart,
    tag: 'F1 Shortcut',
  },
  {
    to: '/products',
    label: 'New Product',
    description: 'Add SKU & price to catalog',
    icon: Package,
    tag: 'Catalog',
  },
  {
    to: '/inventory',
    label: 'Stock Ledger',
    description: 'Adjust stock & warehouse counts',
    icon: Boxes,
    tag: 'Inventory',
  },
  {
    to: '/reports',
    label: 'Financial Reports',
    description: 'P&L, Tax & GST analytics',
    icon: FileBarChart,
    tag: 'Analytics',
  },
];

const num = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);
const count = (n) => num(n).toLocaleString();
const currency = (n) => `$${num(n).toFixed(2)}`;

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

/** Calculate percentage change between halves of a time series */
const calculateDelta = (series) => {
  const values = (series || []).map((d) => num(d.revenue));
  if (values.length < 4) return null;
  const half = Math.floor(values.length / 2);
  const previous = values.slice(0, half).reduce((a, b) => a + b, 0);
  const current = values.slice(half).reduce((a, b) => a + b, 0);
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [range, setRange] = useState(7);
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'orders'
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [statsRes, salesRes, productsRes] = await Promise.allSettled([
        apiClient.get('/dashboard/stats'),
        apiClient.get('/sales/?limit=8'),
        apiClient.get('/products/?limit=100'),
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      } else {
        throw statsRes.reason;
      }

      if (salesRes.status === 'fulfilled') {
        setRecentSales(Array.isArray(salesRes.value.data) ? salesRes.value.data : []);
      }

      if (productsRes.status === 'fulfilled') {
        const prods = Array.isArray(productsRes.value.data) ? productsRes.value.data : [];
        const low = prods.filter(
          (p) => Number(p.quantity ?? 0) <= Number(p.reorder_level ?? 5) && p.is_active !== false
        );
        setLowStockProducts(low);
      }

      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err?.response?.data?.detail || 'Unable to load executive metrics at this time.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Sliced trend based on user-selected range
  const trend = useMemo(() => {
    const series = stats?.sales_trend || [];
    return series.slice(Math.max(0, series.length - range));
  }, [stats, range]);

  const rangeTotal = useMemo(
    () => trend.reduce((sum, d) => sum + Number(d.revenue || 0), 0),
    [trend]
  );
  const rangeOrdersTotal = useMemo(
    () => trend.reduce((sum, d) => sum + Number(d.orders || 0), 0),
    [trend]
  );
  const rangeAverage = trend.length ? rangeTotal / trend.length : 0;
  const rangeBest = useMemo(
    () => trend.reduce((best, d) => (Number(d.revenue || 0) > Number(best?.revenue || 0) ? d : best), null),
    [trend]
  );

  const revenueSeries = useMemo(() => trend.map((d) => num(d.revenue)), [trend]);
  const rangeDelta = useMemo(() => calculateDelta(trend), [trend]);

  // Chart configuration
  const chartData = {
    labels: trend.map((d) => {
      const parts = (d.date || '').split('-');
      return parts.length === 3 ? `${parts[1]}/${parts[2]}` : d.date;
    }),
    datasets: [
      {
        label: chartMetric === 'revenue' ? 'Revenue' : 'Orders',
        data: trend.map((d) => (chartMetric === 'revenue' ? d.revenue : d.orders)),
        borderColor: chartMetric === 'revenue' ? '#3b82f6' : '#8b5cf6',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(59, 130, 246, 0.08)';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          if (chartMetric === 'revenue') {
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.24)');
            gradient.addColorStop(0.8, 'rgba(59, 130, 246, 0.02)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          } else {
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.24)');
            gradient.addColorStop(0.8, 'rgba(139, 92, 246, 0.02)');
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
          }
          return gradient;
        },
        fill: true,
        tension: 0.32,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: chartMetric === 'revenue' ? '#60a5fa' : '#a78bfa',
        pointBorderColor: isDark ? '#0b1329' : '#ffffff',
        pointBorderWidth: 2,
        borderWidth: 2.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? 'rgba(11, 19, 41, 0.95)' : 'rgba(255, 255, 255, 0.98)',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#475569',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.9)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleFont: { size: 12, weight: '600', family: 'Inter, sans-serif' },
        bodyFont: { size: 13, weight: '500', family: 'Inter, sans-serif' },
        callbacks: {
          label: (item) =>
            chartMetric === 'revenue'
              ? ` Revenue: ${currency(item.parsed.y)}`
              : ` Orders: ${count(item.parsed.y)} transactions`,
        },
      },
    },
    scales: {
      x: {
        border: { display: false },
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.05)', drawTicks: false },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 11, family: 'Inter, sans-serif' },
          padding: 8,
        },
      },
      y: {
        border: { display: false },
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)', drawTicks: false },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 11, family: 'Inter, sans-serif' },
          padding: 10,
          maxTicksLimit: 5,
          callback: (v) => (chartMetric === 'revenue' ? `$${Number(v).toLocaleString()}` : v),
        },
      },
    },
  };

  // Top 6 KPI Stat Cards
  const kpiCards = stats
    ? [
        {
          title: "Today's Gross Sales",
          value: currency(stats.today_sales),
          subtitle: `${count(stats.today_orders)} orders recorded today`,
          icon: DollarSign,
          tone: 'primary',
          sparkline: revenueSeries,
          trend: rangeDelta,
          deltaLabel: rangeDelta === null ? undefined : `vs ${range}D avg`,
        },
        {
          title: 'Lifetime Revenue',
          value: currency(stats.total_revenue),
          subtitle: `${count(stats.total_orders)} completed orders`,
          icon: TrendingUp,
          tone: 'success',
          sparkline: revenueSeries,
        },
        {
          title: 'Active Catalog SKUs',
          value: count(stats.total_products),
          subtitle: 'Active inventory items',
          icon: Package,
          tone: 'info',
        },
        {
          title: 'Low Stock Urgency',
          value: count(stats.low_stock_count),
          subtitle: num(stats.low_stock_count) > 0 ? 'Requires immediate restock' : 'All stock optimal',
          icon: AlertTriangle,
          tone: num(stats.low_stock_count) > 0 ? 'danger' : 'neutral',
        },
        {
          title: 'Customer Directory',
          value: count(stats.total_customers),
          subtitle: 'Registered consumer profiles',
          icon: Users,
          tone: 'purple',
        },
        {
          title: 'Verified Suppliers',
          value: count(stats.total_suppliers),
          subtitle: 'Active procurement vendors',
          icon: Truck,
          tone: 'warning',
        },
      ]
    : [];

  const effectiveLowStock = lowStockProducts.length > 0 ? lowStockProducts : stats?.low_stock_items || [];
  const effectiveRecentSales = recentSales.length > 0 ? recentSales : stats?.recent_sales || [];
  const lowStockCount = num(stats?.low_stock_count) || effectiveLowStock.length;

  return (
    <div className="space-y-6 pb-8">

      {/* ╔══════════════════════════════════════════════╗
          ║  1. EXECUTIVE DASHBOARD HEADER               ║
          ╚══════════════════════════════════════════════╝ */}
      <section
        aria-label="Executive Dashboard Header"
        className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg backdrop-blur-xl p-6 shadow-xl"
      >
        {/* Soft Ambient Glow in Header */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-600/[0.06] blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Greeting & Subtitle */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                StoreHub Enterprise Portal
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Node 01
              </span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {getGreeting()},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                {user?.full_name?.split(' ')[0] || user?.username || 'Executive'}
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Operations overview for <span className="text-slate-200 font-medium">{range} Days</span> · Store performance, catalog velocity &amp; ledger summary.
            </p>
          </div>

          {/* Key Metric Highlights & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 border-t lg:border-t-0 border-white/[0.06] pt-4 lg:pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left sm:text-right">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {range}D Gross Revenue
                </p>
                <p className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {currency(rangeTotal)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Daily Avg Sales
                </p>
                <p className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {currency(rangeAverage)}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {range}D Orders
                </p>
                <p className="text-base sm:text-lg font-bold text-blue-400 tracking-tight">
                  {count(rangeOrdersTotal)} orders
                </p>
              </div>
            </div>

            {/* Range Pills & Refresh */}
            <div className="flex items-center gap-2 flex-wrap">
              <div
                role="group"
                aria-label="Select trend timeline"
                className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.02] p-1"
              >
                {RANGES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRange(r.value)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150',
                      range === r.value
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={() => {
                  fetchDashboardData();
                }}
                loading={loading}
                aria-label="Refresh Dashboard Data"
              >
                Sync
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Error state if server call fails */}
      {error && !stats && (
        <ErrorState
          title="Dashboard Metrics Unavailable"
          description={error}
          onRetry={fetchDashboardData}
        />
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-content">
          <Building2 className="h-3.5 w-3.5" />
          Operations Overview
        </div>
      </div>

          {/* ╔══════════════════════════════════════════════╗
              ║  2. EXECUTIVE 6-KPI STAT GRID                ║
              ╚══════════════════════════════════════════════╝ */}
          <section aria-label="Key Enterprise Indicators">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {loading && !stats
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : kpiCards.map((card) => <StatCard key={card.title} {...card} />)}
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  3. REVENUE ANALYTICS & TOP PRODUCTS         ║
          ╚══════════════════════════════════════════════╝ */}
      <section className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
        {/* Left 2 Cols: Revenue Trend Chart */}
        <Card className="flex flex-col xl:col-span-2 border-border bg-card shadow-lg shadow-lg">
          <CardHeader
            title="Revenue Performance & Velocity"
            description={`Net completed sales timeline across ${range} days`}
            actions={
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.02] p-0.5">
                  <button
                    type="button"
                    onClick={() => setChartMetric('revenue')}
                    className={cn(
                      'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors',
                      chartMetric === 'revenue'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    )}
                  >
                    Revenue ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMetric('orders')}
                    className={cn(
                      'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors',
                      chartMetric === 'orders'
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    )}
                  >
                    Volume (Orders)
                  </button>
                </div>
                {rangeDelta !== null && (
                  <Badge tone={rangeDelta >= 0 ? 'success' : 'danger'}>
                    {rangeDelta >= 0 ? '+' : ''}
                    {rangeDelta.toFixed(1)}% period delta
                  </Badge>
                )}
              </div>
            }
          />
          <CardBody className="flex-1 p-5">
            <div className="h-64 w-full sm:h-72 lg:h-[20rem]">
              {loading && !stats ? (
                <div className="h-full w-full animate-pulse rounded-xl bg-white/[0.03]" />
              ) : trend.length ? (
                <Line data={chartData} options={chartOptions} aria-label="Revenue performance chart" />
              ) : (
                <EmptyState
                  compact
                  icon={TrendingUp}
                  title="No Transactions in Range"
                  description="Completed POS invoices and billing entries will appear in this chart."
                />
              )}
            </div>
          </CardBody>
        </Card>

        {/* Right 1 Col: Top Performing Products */}
        <Card className="flex flex-col border-border bg-card shadow-lg shadow-lg">
          <CardHeader
            title="Top Velocity Products"
            description="Ranked by total units sold in sales history"
            actions={
              <Button as={Link} to="/products" variant="ghost" size="sm" iconRight={ArrowRight}>
                Catalog
              </Button>
            }
          />
          <CardBody className="flex-1 p-0">
            <div className="divide-y divide-white/[0.04] max-h-[22rem] overflow-y-auto ds-scroll">
              {stats?.top_products?.length ? (
                stats.top_products.map((tp, idx) => {
                  const maxUnits = stats.top_products[0]?.units_sold || 1;
                  const ratio = Math.min(100, Math.round((tp.units_sold / maxUnits) * 100));
                  return (
                    <div
                      key={tp.id ?? idx}
                      className="flex items-center gap-3.5 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                    >
                      <span
                        className={cn(
                          'grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg border text-xs font-bold tabular-nums',
                          idx === 0
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                            : idx === 1
                            ? 'bg-slate-300/15 border-slate-300/30 text-slate-200'
                            : idx === 2
                            ? 'bg-amber-700/15 border-amber-700/30 text-amber-400'
                            : 'bg-white/[0.03] border-white/[0.06] text-slate-400'
                        )}
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-white">{tp.name}</p>
                          <span className="text-sm font-bold text-slate-100 flex-shrink-0">
                            {currency(tp.revenue)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-slate-400">
                          <span className="font-mono text-[11px] text-slate-500">SKU {tp.sku}</span>
                          <span>{tp.units_sold} sold</span>
                        </div>
                        {/* Progress velocity indicator */}
                        <div className="mt-1.5 h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6">
                  <EmptyState
                    compact
                    icon={ShoppingCart}
                    title="No Top Sellers Yet"
                    description="Top velocity products will automatically populate once POS sales are completed."
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  4. QUICK ACTION COMMAND RAIL                ║
          ╚══════════════════════════════════════════════╝ */}
      <section aria-label="Operational Quick Actions">
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={cn(
                'group flex items-center justify-between gap-3.5 rounded-xl border border-border',
                'bg-surface/[0.75] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#0f172a] shadow-md'
              )}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  <action.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {action.label}
                  </p>
                  <p className="truncate text-xs text-slate-400">{action.description}</p>
                </div>
              </div>
              <span className="rounded bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 group-hover:text-slate-200 whitespace-nowrap">
                {action.tag}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  5. LOW STOCK WATCHLIST & RECENT TRANSACTIONS║
          ╚══════════════════════════════════════════════╝ */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Low Stock Watchlist */}
        <Card className="flex flex-col border-border bg-card shadow-lg shadow-lg">
          <CardHeader
            title="Low Stock Watchlist"
            description="Products at or below safety reorder threshold"
            actions={
              <Button as={Link} to="/inventory" variant="ghost" size="sm" iconRight={ArrowRight}>
                Full Ledger
              </Button>
            }
          />
          <CardBody className="flex-1 p-0">
            {effectiveLowStock.length ? (
              <div className="divide-y divide-white/[0.04] max-h-80 overflow-y-auto ds-scroll">
                {effectiveLowStock.slice(0, 8).map((item, idx) => {
                  const qty = Number(item.stock ?? item.quantity ?? 0);
                  const isOutOfStock = qty <= 0;
                  return (
                    <div
                      key={item.id ?? item.sku ?? idx}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                        <p className="font-mono text-xs text-slate-500 mt-0.5">
                          SKU: {item.sku ?? 'N/A'} · Reorder Level: {item.reorder_level ?? 5}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge tone={isOutOfStock ? 'danger' : 'warning'} dot>
                          {qty} {item.unit || 'units'} left
                        </Badge>
                        <Button
                          as={Link}
                          to="/purchases"
                          variant="secondary"
                          size="sm"
                          className="h-7 px-2 text-xs"
                        >
                          Restock
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8">
                <EmptyState
                  compact
                  icon={CheckCircle2}
                  title="Inventory Health Optimal"
                  description="All active catalog products have sufficient stock above their configured safety levels."
                />
              </div>
            )}
          </CardBody>
        </Card>

        {/* Live Recent Transactions */}
        <Card className="flex flex-col border-border bg-card shadow-lg shadow-lg">
          <CardHeader
            title="Recent Sales Transactions"
            description="Live billing activity from the POS terminal"
            actions={
              <Button as={Link} to="/sales" variant="ghost" size="sm" iconRight={ArrowRight}>
                Sales History
              </Button>
            }
          />
          <CardBody className="flex-1 p-0">
            {effectiveRecentSales.length ? (
              <div className="divide-y divide-white/[0.04] max-h-80 overflow-y-auto ds-scroll">
                {effectiveRecentSales.slice(0, 8).map((sale, idx) => (
                  <div
                    key={sale.id ?? sale.invoice_number ?? idx}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Receipt className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {sale.invoice_number || `INV-${sale.id}`}
                        </p>
                        <p className="truncate text-xs text-slate-400 mt-0.5">
                          {sale.customer_name || 'Walk-in Customer'} · {sale.payment_method || 'Cash'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-white tracking-tight">
                        {currency(sale.total_amount ?? sale.total ?? 0)}
                      </p>
                      <Badge tone={sale.status === 'Voided' ? 'danger' : 'success'} size="sm" className="mt-0.5">
                        {sale.status || 'Completed'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8">
                <EmptyState
                  compact
                  icon={Receipt}
                  title="No Invoices Recorded Yet"
                  description="Completed customer orders and invoices will be logged in this stream in real time."
                />
              </div>
            )}
          </CardBody>
        </Card>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  6. SYSTEM STATUS & INFRASTRUCTURE HEALTH    ║
          ╚══════════════════════════════════════════════╝ */}
      <section aria-label="System Status and Infrastructure">
        <Card className="border-border bg-card shadow-lg p-5 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Server className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Application Status</p>
                <p className="text-xs text-slate-400">
                  Dashboard data last refreshed: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>FastAPI Engine</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Configured Database</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>JWT Authentication</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Data Export</span>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
