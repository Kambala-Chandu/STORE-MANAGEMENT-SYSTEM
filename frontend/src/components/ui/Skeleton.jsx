import React from 'react';
import { cn } from '../../lib/cn';

export const Skeleton = ({ className, rounded = 'rounded-sm', ...props }) => (
  <div
    aria-hidden="true"
    className={cn('relative overflow-hidden bg-elevated', rounded, className)}
    {...props}
  >
    <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
  </div>
);

export const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)} role="status" aria-label="Loading content">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')} />
    ))}
  </div>
);

export const SkeletonCard = ({ className }) => (
  <div className={cn('bg-surface border border-border rounded-xl p-5 space-y-4', className)} role="status" aria-label="Loading">
    <div className="flex items-center justify-between gap-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-8" rounded="rounded-lg" />
    </div>
    <Skeleton className="h-7 w-32" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const SkeletonTable = ({ rows = 6, cols = 5, className }) => (
  <div className={cn('w-full space-y-2', className)} role="status" aria-label="Loading table">
    <Skeleton className="h-10 w-full" />
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {Array.from({ length: cols }).map((__, c) => (
          <Skeleton key={c} className="h-9" />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
