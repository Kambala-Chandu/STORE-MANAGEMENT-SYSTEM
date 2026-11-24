import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Boxes,
  Users,
  Truck,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Cpu,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Badge, Button, cn } from '../ui';

const CATEGORY_ICONS = {
  Revenue: TrendingUp,
  Inventory: Boxes,
  Profitability: ShieldCheck,
  Customers: Users,
  Procurement: Truck,
};

const TONE_STYLES = {
  success: {
    bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    borderGlow: 'hover:border-emerald-500/40',
    dot: 'bg-emerald-400',
    badgeTone: 'success',
  },
  warning: {
    bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    borderGlow: 'hover:border-amber-500/40',
    dot: 'bg-amber-400',
    badgeTone: 'warning',
  },
  danger: {
    bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    borderGlow: 'hover:border-rose-500/40',
    dot: 'bg-rose-400',
    badgeTone: 'danger',
  },
  purple: {
    bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    borderGlow: 'hover:border-purple-500/40',
    dot: 'bg-purple-400',
    badgeTone: 'purple',
  },
  info: {
    bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    borderGlow: 'hover:border-blue-500/40',
    dot: 'bg-blue-400',
    badgeTone: 'info',
  },
};

export const ExecutiveAISummaryPanel = ({
  aiSummary = [],
  loading = false,
  onRefresh,
  lastUpdated,
  onViewDeepAnalytics,
}) => {
  const [filter, setFilter] = useState('All');

  const filteredInsights = filter === 'All'
    ? aiSummary
    : aiSummary.filter((item) => item.category === filter);

  const categories = ['All', 'Revenue', 'Inventory', 'Profitability', 'Customers', 'Procurement'];

  return (
    <section
      aria-label="Executive AI Business Insights"
      className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-b from-[#0b1329]/95 via-[#0b1329]/80 to-[#050a16] p-5 shadow-2xl backdrop-blur-xl"
    >
      {/* Subtle Ambient AI Halo */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-600/[0.12] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-indigo-600/[0.10] blur-3xl" />

      {/* Header bar */}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 text-white">
            <Sparkles className="h-5 w-5 animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Executive AI Business Summary
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                <Cpu className="h-3 w-3" />
                Copilot Heuristics
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated operational narratives &amp; business health diagnostics derived from real ledger activity.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onViewDeepAnalytics && (
            <Button
              variant="secondary"
              size="sm"
              iconRight={ArrowRight}
              onClick={onViewDeepAnalytics}
              className="text-xs border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
            >
              Predictive Hub
            </Button>
          )}

          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              icon={RefreshCw}
              onClick={onRefresh}
              loading={loading}
              aria-label="Refresh AI Insights"
              className="text-xs text-slate-400 hover:text-white"
            >
              Re-analyze
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="relative mt-3 flex items-center gap-1.5 overflow-x-auto ds-scroll pb-1">
        <Filter className="h-3.5 w-3.5 text-slate-500 mr-1 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150 whitespace-nowrap',
              filter === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Enterprise Insight Cards Grid */}
      <div className="relative mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredInsights.map((insight, idx) => {
            const toneConfig = TONE_STYLES[insight.tone] || TONE_STYLES.info;
            const Icon = CATEGORY_ICONS[insight.category] || TrendingUp;

            return (
              <motion.div
                key={insight.id || idx}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className={cn(
                  'group relative flex flex-col justify-between rounded-xl border border-white/[0.07] bg-[#0b1329]/90 p-4 transition-all duration-200',
                  toneConfig.borderGlow,
                  'hover:bg-[#0f172a] hover:shadow-xl'
                )}
              >
                <div>
                  {/* Top Bar with Category & Metric */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <span className={cn('h-1.5 w-1.5 rounded-full', toneConfig.dot)} />
                      <Icon className="h-3.5 w-3.5 text-slate-400" />
                      {insight.category}
                    </span>

                    {insight.metric && (
                      <span className={cn('rounded-md border px-2 py-0.5 text-xs font-bold font-mono', toneConfig.bg)}>
                        {insight.metric}
                      </span>
                    )}
                  </div>

                  {/* Title & Human-readable summary */}
                  <h3 className="mt-2.5 text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {insight.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {insight.summary}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                {insight.actionTo && (
                  <div className="mt-3.5 flex items-center justify-between border-t border-white/[0.04] pt-2.5">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {insight.metricLabel || 'Smart Recommendation'}
                    </span>
                    <Link
                      to={insight.actionTo}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 group-hover:translate-x-0.5 transition-transform"
                    >
                      {insight.actionLabel || 'Inspect'}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ExecutiveAISummaryPanel;

