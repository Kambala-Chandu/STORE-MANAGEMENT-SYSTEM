import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  ShieldCheck,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  cn,
} from '../ui';

export const SmartSalesForecast = ({ forecast, loading = false }) => {
  const [horizon, setHorizon] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'quarterly'

  const {
    confidenceScore = 94.2,
    avgDailyRevenue = 1250,
    actualVsPredicted = [],
    dailyForecast = [],
    weeklyForecast = [],
    monthlyForecast = [],
    quarterForecast = [],
  } = forecast || {};

  return (
    <div className="space-y-6">
      {/* Top Confidence & Model Diagnostic Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Model Confidence
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              {confidenceScore}%
            </span>
            <Badge tone="success" size="sm">High Precision</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Linear regression &amp; day-of-week seasonality index.
          </p>
        </Card>

        <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Baseline Daily Velocity
            </span>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              ${avgDailyRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-400">/ day</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Estimated 30-day baseline average sales volume.
          </p>
        </Card>

        <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Projected 30D Run Rate
            </span>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-indigo-300">
              ${(avgDailyRevenue * 30 * 1.08).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <Badge tone="info" size="sm">+8.0% Lift</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Forecasted revenue including weekend lift adjustments.
          </p>
        </Card>
      </div>

      {/* Main Forecast Matrix Card */}
      <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
        <CardHeader
          title="Predictive Sales Trajectory & Projection Horizons"
          description="Algorithmic demand projections spanning daily, weekly, monthly, and quarterly operating periods."
          actions={
            <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
              {[
                { id: 'daily', label: '7-Day' },
                { id: 'weekly', label: '4-Week' },
                { id: 'monthly', label: '3-Month' },
                { id: 'quarterly', label: 'Quarterly' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setHorizon(tab.id)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150',
                    horizon === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          }
        />
        <CardBody className="p-5">
          {horizon === 'daily' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {dailyForecast.map((day, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center hover:border-blue-500/30 transition-all duration-200"
                >
                  <p className="text-xs font-semibold text-slate-400">{day.label}</p>
                  <p className="mt-2 text-base font-bold text-white tracking-tight">
                    ${day.predictedRevenue.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] text-blue-400 font-medium">
                    ~{day.predictedOrders} orders
                  </p>
                  <div className="mt-2 border-t border-white/[0.04] pt-1.5 text-[10px] text-slate-500 font-mono">
                    95% CI: ${day.lowerBound} - ${day.upperBound}
                  </div>
                </div>
              ))}
            </div>
          )}

          {horizon === 'weekly' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {weeklyForecast.map((w, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-blue-500/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">{w.week}</span>
                    <Badge tone="success" size="sm">{w.projectedGrowth}</Badge>
                  </div>
                  <p className="mt-2 text-xl font-bold text-white tracking-tight">
                    ${w.predictedRevenue.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 font-mono">
                    Target Volume: {w.predictedOrders} invoices
                  </p>
                </div>
              ))}
            </div>
          )}

          {horizon === 'monthly' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {monthlyForecast.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-blue-500/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">{m.month}</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{m.confidence} conf</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-white tracking-tight">
                    ${m.predictedRevenue.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 font-mono">
                    Projected: {m.predictedOrders} settled transactions
                  </p>
                </div>
              ))}
            </div>
          )}

          {horizon === 'quarterly' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quarterForecast.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-blue-500/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">{q.quarter}</span>
                    <span className="text-xs font-mono text-blue-400 font-bold">{q.confidence} conf</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-white tracking-tight">
                    ${q.predictedRevenue.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Enterprise quarterly quota target
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Trailing Actual vs Predicted Verification */}
      <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
        <CardHeader
          title="Backtesting: Actual vs Predicted Performance"
          description="Verification of model forecast accuracy against actual historical settled sales."
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto ds-scroll">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Operating Date</th>
                  <th className="py-3 px-4">Actual Settled Sales</th>
                  <th className="py-3 px-4">Model Prediction</th>
                  <th className="py-3 px-4">Variance (%)</th>
                  <th className="py-3 px-4 text-right">Accuracy Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {actualVsPredicted.map((row, idx) => {
                  const isPositive = parseFloat(row.variancePct) >= 0;
                  return (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-300 font-medium">
                        {row.date}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        ${row.actual.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        ${row.predicted.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('font-mono font-semibold', isPositive ? 'text-emerald-400' : 'text-amber-400')}>
                          {isPositive ? '+' : ''}{row.variancePct}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge tone={Math.abs(parseFloat(row.variancePct)) <= 10 ? 'success' : 'info'}>
                          {Math.abs(parseFloat(row.variancePct)) <= 10 ? 'High Precision' : 'Within Band'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SmartSalesForecast;

