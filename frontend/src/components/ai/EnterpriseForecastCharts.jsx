import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Boxes,
  Users,
  Truck,
  Activity,
  DollarSign,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  cn,
} from '../ui';

// Custom dark glass tooltip
const CustomRechartsTooltip = ({ active, payload, label, unit = '', prefix = '$' }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-white/[0.12] bg-[#0b1329]/[0.96] p-3 shadow-2xl backdrop-blur-xl">
      {label && <p className="mb-1 text-xs font-semibold text-slate-300">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`tip-${index}`} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
            />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="font-bold text-white">
              {prefix}{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}{unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const EnterpriseForecastCharts = ({ chartDatasets }) => {
  const [chartTab, setChartTab] = useState('sales');

  const {
    salesForecastChart = [],
    inventoryForecastChart = [],
    customerGrowthChart = [],
    supplierPerformanceChart = [],
    demandTrendChart = [],
    profitProjectionChart = [],
  } = chartDatasets || {};

  const tabs = [
    { id: 'sales', label: 'Sales Forecast', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory Burn-down', icon: Boxes },
    { id: 'profit', label: 'Profit Projection', icon: DollarSign },
    { id: 'demand', label: 'Demand Trend', icon: Activity },
    { id: 'customer', label: 'Customer Cohorts', icon: Users },
    { id: 'supplier', label: 'Supplier Reliability', icon: Truck },
  ];

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
      <CardHeader
        title="Enterprise Predictive Forecasting & Visual Intelligence"
        description="Multi-dimensional predictive modeling built on statistical regression and historical warehouse ledger patterns."
        actions={
          <div className="flex items-center gap-1.5 overflow-x-auto ds-scroll pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setChartTab(tab.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150 whitespace-nowrap',
                  chartTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        }
      />
      <CardBody className="p-5">
        <div className="h-72 w-full sm:h-80 lg:h-[22rem]">
          {/* 1. SALES FORECAST */}
          {chartTab === 'sales' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesForecastChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="predSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomRechartsTooltip prefix="$" />} />
                <Legend />
                <Area type="monotone" dataKey="actual" name="Historical Actual ($)" stroke="#3b82f6" fill="url(#actualSalesGrad)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="predicted" name="AI Projected Sales ($)" stroke="#10b981" strokeDasharray="5 5" fill="url(#predSalesGrad)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="confidenceUpper" name="Upper 95% Band" stroke="#34d399" strokeWidth={1} strokeDasharray="2 2" dot={false} />
                <Line type="monotone" dataKey="confidenceLower" name="Lower 95% Band" stroke="#6ee7b7" strokeWidth={1} strokeDasharray="2 2" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* 2. INVENTORY FORECAST */}
          {chartTab === 'inventory' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryForecastChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomRechartsTooltip prefix="" unit=" units" />} />
                <Legend />
                <Bar dataKey="stock" name="Current Stock" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="safetyLevel" name="Safety Threshold" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="daysLeft" name="Days Runway" stroke="#ef4444" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* 3. PROFIT PROJECTION */}
          {chartTab === 'profit' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitProjectionChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomRechartsTooltip prefix="$" />} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.1)" strokeWidth={2} />
                <Area type="monotone" dataKey="cogs" name="COGS Asset Cost" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.1)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" name="Net Gross Profit" stroke="#10b981" fill="url(#profitGrad)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* 4. DEMAND TREND */}
          {chartTab === 'demand' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandTrendChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomRechartsTooltip prefix="" unit=" orders" />} />
                <Legend />
                <Line type="monotone" dataKey="Electronics" stroke="#3b82f6" strokeWidth={2.5} />
                <Line type="monotone" dataKey="Apparel" stroke="#8b5cf6" strokeWidth={2.5} />
                <Line type="monotone" dataKey="Groceries" stroke="#10b981" strokeWidth={2.5} />
                <Line type="monotone" dataKey="Beverage" stroke="#f59e0b" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {/* 5. CUSTOMER COHORTS */}
          {chartTab === 'customer' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerGrowthChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomRechartsTooltip prefix="" unit=" accounts" />} />
                <Legend />
                <Bar dataKey="totalCustomers" name="Active Customers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="repeatOrders" name="Repeat Patrons" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="newAccounts" name="New Registrations" stroke="#10b981" strokeWidth={2.5} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* 6. SUPPLIER RELIABILITY */}
          {chartTab === 'supplier' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierPerformanceChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[60, 100]} />
                <Tooltip content={<CustomRechartsTooltip prefix="" unit="%" />} />
                <Legend />
                <Bar dataKey="reliability" name="Delivery Reliability (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quality" name="Quality Score (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overall" name="Composite Score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default EnterpriseForecastCharts;

