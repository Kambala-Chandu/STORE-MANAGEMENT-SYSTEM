import React from 'react';
import { cn } from '../../lib/cn';

export const Card = ({ as: Tag = 'div', interactive = false, padded = false, className, children, ...props }) => (
  <Tag
    className={cn(
      'rounded-xl border border-border bg-surface shadow-sm',
      'flex min-w-0 flex-col',
      interactive && 'ds-hover-lift cursor-pointer',
      padded && 'p-4',
      className
    )}
    {...props}
  >
    {children}
  </Tag>
);

export const CardHeader = ({ title, description, actions, className, children }) => (
  <div
    className={cn(
      'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3',
      className
    )}
  >
    <div className="min-w-0">
      {title && <h3 className="truncate text-body-lg font-semibold tracking-tight text-content">{title}</h3>}
      {description && <p className="mt-0.5 truncate text-caption text-content-subtle">{description}</p>}
      {children}
    </div>
    {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
  </div>
);

export const CardBody = ({ className, children, ...props }) => (
  <div className={cn('min-w-0 flex-1 p-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children }) => (
  <div className={cn('flex flex-wrap items-center gap-2 border-t border-border px-4 py-3', className)}>
    {children}
  </div>
);

export default Card;
