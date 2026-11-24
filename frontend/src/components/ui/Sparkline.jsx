import React, { useId } from 'react';
import { cn } from '../../lib/cn';

const TONE_STROKE = {
  primary: 'rgb(var(--color-primary-soft))',
  success: 'rgb(var(--color-success-soft))',
  warning: 'rgb(var(--color-warning-soft))',
  danger: 'rgb(var(--color-danger-soft))',
  info: 'rgb(var(--color-info-soft))',
  purple: 'rgb(168 139 250)',
  neutral: 'rgb(var(--color-content-subtle))',
};

/**
 * Dependency-free SVG sparkline.
 * Purely presentational — renders nothing when there is not enough data.
 */
export const Sparkline = ({
  data = [],
  tone = 'primary',
  height = 36,
  strokeWidth = 1.5,
  area = true,
  className,
}) => {
  const gradientId = useId();
  const points = (data || []).map((d) => Number(d) || 0);

  if (points.length < 2) {
    return <div className={cn('h-9', className)} aria-hidden="true" />;
  }

  const width = 100;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const stepX = width / (points.length - 1);
  const pad = 2;
  const usable = height - pad * 2;

  const coords = points.map((v, i) => {
    const x = i * stepX;
    const y = pad + usable - ((v - min) / span) * usable;
    return [Number(x.toFixed(2)), Number(y.toFixed(2))];
  });

  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const fill = `${line} L${width},${height} L0,${height} Z`;
  const stroke = TONE_STROKE[tone] || TONE_STROKE.primary;
  const [lastX, lastY] = coords[coords.length - 1];

  return (
    <svg
      viewBox={`-1.5 0 ${width + 3} ${height}`}
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      className={cn('w-full', className)}
      style={{ height }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={fill} fill={`url(#${gradientId})`} stroke="none" />}
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r="1.6" fill={stroke} vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

export default Sparkline;
