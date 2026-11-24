import React, { useRef } from 'react';
import { cn } from '../../lib/cn';

/**
 * Accessible tab list with roving keyboard navigation (Arrow keys / Home / End).
 * Controlled: pass `value` and `onChange`.
 */
export const Tabs = ({ tabs = [], value, onChange, className, size = 'md' }) => {
  const refs = useRef([]);

  const onKeyDown = (e, index) => {
    const last = tabs.length - 1;
    let next = null;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    onChange?.(tabs[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-elevated/70 border border-border rounded-lg',
        'overflow-x-auto ds-scroll max-w-full',
        className
      )}
    >
      {tabs.map((tab, i) => {
        const active = tab.value === value;
        const Icon = tab.icon;
        return (
          <button
            key={tab.value}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onKeyDown={(e) => onKeyDown(e, i)}
            onClick={() => onChange?.(tab.value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-sm font-semibold whitespace-nowrap',
              'transition-all duration-base ease-enterprise',
              size === 'sm' ? 'px-3 h-8 text-caption' : 'px-4 h-9 text-body',
              active
                ? 'bg-surface text-content shadow-sm border border-border-strong'
                : 'text-content-muted hover:text-content border border-transparent'
            )}
          >
            {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-caption font-bold text-content-subtle">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
