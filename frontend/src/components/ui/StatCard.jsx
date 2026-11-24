import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Sparkline } from './Sparkline';

const TONES = {
  primary: 'bg-primary/12 text-primary-soft border-primary/25',
  success: 'bg-success/12 text-success-soft border-success/25',
  warning: 'bg-warning/12 text-warning-soft border-warning/25',
  danger: 'bg-danger/12 text-danger-soft border-danger/25',
  info: 'bg-info/12 text-info-soft border-info/25',
  purple: 'bg-purple-500/12 text-purple-300 border-purple-500/25',
  neutral: 'bg-secondary text-content-muted border-border-strong',
};

const NUMERIC = /^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/;

/**
 * Animates the numeric portion of a value (e.g. "$1,240.50" -> counts to 1240.50)
 * while preserving its prefix/suffix and decimal precision. Purely visual.
 */
const useAnimatedValue = (value) => {
  const raw = value === null || value === undefined ? '' : String(value);
  const match = raw.match(NUMERIC);
  const target = match ? Number(match[2].replace(/,/g, '')) : null;
  const [display, setDisplay] = useState(target ?? 0);
  const frame = useRef(0);

  useEffect(() => {
    if (target === null || Number.isNaN(target)) return undefined;
    if (typeof window === 'undefined') return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduce) {
      setDisplay(target);
      return undefined;
    }
    const start = performance.now();
    const from = 0;
    const duration = 650;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * eased);
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target]);

  if (target === null || Number.isNaN(target)) return raw;

  const decimals = (match[2].split('.')[1] || '').length;
  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${match[1]}${formatted}${match[3]}`;
};

/**
 * Enterprise KPI tile.
 * Structure: label + icon → metric → delta / caption → optional sparkline.
 * API is backwards compatible; `sparkline` and `deltaLabel` are additive.
 */
export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = 'primary',
  trend,
  deltaLabel,
  sparkline,
  status,
  loading = false,
  className,
}) => {
  const animated = useAnimatedValue(loading ? null : value);
  const hasTrend = trend !== undefined && trend !== null && Number.isFinite(Number(trend));
  const trendValue = hasTrend ? Number(trend) : 0;
  const TrendIcon = trendValue > 0 ? ArrowUpRight : trendValue < 0 ? ArrowDownRight : Minus;

  return (
    <div
      className={cn(
        'group relative flex h-full min-w-0 flex-col justify-between gap-4 overflow-hidden',
        'rounded-xl border border-border bg-surface p-4 shadow-sm ds-hover-lift',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="ds-eyebrow min-w-0 break-words">{title}</p>
        {Icon && (
          <span
            className={cn(
              'grid h-8 w-8 flex-shrink-0 place-items-center rounded-md border',
              'transition-colors duration-base ease-enterprise',
              TONES[tone] || TONES.primary
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="min-w-0">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded-sm bg-elevated" />
        ) : (
          <p className="ds-metric break-words text-title-lg sm:text-display">{animated}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          {hasTrend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-sm border px-1.5 py-0.5 text-caption font-bold leading-none',
                trendValue > 0
                  ? 'border-success/25 bg-success/10 text-success-soft'
                  : trendValue < 0
                    ? 'border-danger/25 bg-danger/10 text-danger-soft'
                    : 'border-border-strong bg-secondary text-content-muted'
              )}
            >
              <TrendIcon className="h-3 w-3" aria-hidden="true" />
              {Math.abs(trendValue).toFixed(1)}%
            </span>
          )}
          {deltaLabel && <span className="text-caption text-content-subtle">{deltaLabel}</span>}
          {status && (
            <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-content-muted">
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  tone === 'danger' ? 'bg-danger' : tone === 'warning' ? 'bg-warning' : 'bg-success'
                )}
                aria-hidden="true"
              />
              {status}
            </span>
          )}
          {subtitle && <p className="truncate text-caption text-content-muted">{subtitle}</p>}
        </div>
      </div>

      {sparkline && sparkline.length > 1 && !loading && (
        <div className="-mx-4 -mb-4 opacity-80 transition-opacity duration-base group-hover:opacity-100">
          <Sparkline data={sparkline} tone={tone} height={40} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
