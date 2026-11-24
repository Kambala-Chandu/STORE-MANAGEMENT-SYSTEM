import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../lib/cn';

export const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', description, action, compact = false, className }) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center text-center mx-auto',
      compact ? 'py-8 px-4 gap-2' : 'py-14 px-6 gap-3',
      className
    )}
  >
    <span className="p-3 rounded-xl bg-elevated border border-border text-content-subtle">
      <Icon className={compact ? 'w-5 h-5' : 'w-6 h-6'} aria-hidden="true" />
    </span>
    <p className="text-body-lg font-semibold text-content">{title}</p>
    {description && <p className="text-body text-content-muted max-w-sm">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
