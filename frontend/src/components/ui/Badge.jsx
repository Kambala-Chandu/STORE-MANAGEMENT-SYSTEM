import React from 'react';
import { cn } from '../../lib/cn';

const TONES = {
  neutral: 'bg-secondary text-content-muted border-border-strong',
  primary: 'bg-primary/15 text-primary-soft border-primary/30',
  success: 'bg-success/15 text-success-soft border-success/30',
  warning: 'bg-warning/15 text-warning-soft border-warning/30',
  danger: 'bg-danger/15 text-danger-soft border-danger/30',
  info: 'bg-info/15 text-info-soft border-info/30',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
};

const SIZES = {
  sm: 'text-caption px-2 py-0.5 gap-1',
  md: 'text-caption px-2.5 py-1 gap-1.5',
};

export const Badge = ({ tone = 'neutral', size = 'sm', dot = false, icon: Icon, className, children, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center font-semibold rounded-full border whitespace-nowrap leading-none',
      TONES[tone] || TONES.neutral,
      SIZES[size],
      className
    )}
    {...props}
  >
    {dot && <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" aria-hidden="true" />}
    {Icon && <Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />}
    {children}
  </span>
);

export default Badge;
