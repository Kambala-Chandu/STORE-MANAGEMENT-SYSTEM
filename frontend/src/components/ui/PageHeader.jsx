import React from 'react';
import { cn } from '../../lib/cn';

/**
 * Standard page header used at the top of every page.
 * Responsive: title column truncates, actions wrap below on mobile.
 */
export const PageHeader = ({ title, description, icon: Icon, badge, actions, breadcrumb, className }) => (
  <header className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
    <div className="flex items-start gap-3 min-w-0">
      {Icon && (
        <span className="hidden sm:flex p-2.5 rounded-lg bg-primary/15 border border-primary/25 text-primary-soft flex-shrink-0">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        {breadcrumb && <div className="mb-1">{breadcrumb}</div>}
        <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
          <h1 className="text-title-lg sm:text-display font-semibold text-content tracking-tight min-w-0 break-words">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-body text-content-muted mt-1 max-w-2xl">{description}</p>
        )}
      </div>
    </div>
    {actions && <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">{actions}</div>}
  </header>
);

export const SectionHeader = ({ title, description, actions, className }) => (
  <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between', className)}>
    <div className="min-w-0">
      <h2 className="text-title font-semibold text-content truncate">{title}</h2>
      {description && <p className="text-caption text-content-muted mt-0.5">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
  </div>
);

export default PageHeader;
