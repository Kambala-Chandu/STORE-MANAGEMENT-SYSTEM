import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Enterprise breadcrumb trail.
 * items: [{ label, to }] — last item is rendered as the current page.
 */
export const Breadcrumbs = ({ items = [], className }) => {
  const trail = [{ label: 'Home', to: '/', icon: Home }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex items-center gap-1 flex-wrap text-caption text-content-subtle">
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          const Icon = item.icon;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1 min-w-0">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-60" aria-hidden="true" />}
              {last || !item.to ? (
                <span className="text-content-muted font-medium truncate" aria-current={last ? 'page' : undefined}>
                  {Icon && <Icon className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" aria-hidden="true" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="rounded-xs hover:text-content transition-colors duration-fast truncate"
                >
                  {Icon && <Icon className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" aria-hidden="true" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
