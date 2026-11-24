import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Toolbar: filter/search/action strip that sits above tables and grids.
 * Mobile: stacks. Tablet+: search grows, actions stay right-aligned.
 */
export const Toolbar = ({ children, className }) => (
  <div
    className={cn(
      'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
      'px-4 py-3 border-b border-border bg-elevated/40',
      className
    )}
  >
    {children}
  </div>
);

export const ToolbarGroup = ({ grow = false, className, children }) => (
  <div
    className={cn(
      'flex items-center gap-2 flex-wrap min-w-0',
      grow && 'flex-1',
      className
    )}
  >
    {children}
  </div>
);

export const ToolbarSearch = ({ value, onChange, placeholder = 'Search…', label = 'Search', className, ...props }) => (
  <div className={cn('relative flex items-center w-full md:max-w-sm min-w-0', className)}>
    <Search className="absolute left-3 w-4 h-4 text-content-subtle pointer-events-none" aria-hidden="true" />
    <input
      type="search"
      aria-label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        'w-full h-10 pl-9 pr-3 text-body bg-surface text-content placeholder:text-content-subtle',
        'border border-border-strong rounded-md transition-all duration-base ease-enterprise',
        'hover:border-content-subtle focus:outline-none focus:border-primary-soft focus:ring-2 focus:ring-primary-soft/40'
      )}
      {...props}
    />
  </div>
);

export default Toolbar;
