import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from './Button';

/**
 * Standard inline error panel used when a page/section fetch fails.
 * Purely presentational — retry handler comes from the page.
 */
export const ErrorState = ({
  title = 'Something went wrong',
  description,
  onRetry,
  retryLabel = 'Try again',
  compact = false,
  className,
}) => (
  <div
    role="alert"
    className={cn(
      'flex flex-col items-center justify-center text-center mx-auto gap-3',
      compact ? 'py-8 px-4' : 'py-14 px-6',
      className
    )}
  >
    <span className="p-3 rounded-xl bg-danger/10 border border-danger/25 text-danger">
      <AlertTriangle className={compact ? 'w-5 h-5' : 'w-6 h-6'} aria-hidden="true" />
    </span>
    <p className="text-body-lg font-semibold text-content">{title}</p>
    {description && <p className="text-body text-content-muted max-w-md break-words">{description}</p>}
    {onRetry && (
      <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry} className="mt-1">
        {retryLabel}
      </Button>
    )}
  </div>
);

/** Compact banner variant for errors above still-usable content. */
export const ErrorBanner = ({ message, onRetry, className }) => (
  <div
    role="alert"
    className={cn(
      'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
      'rounded-lg border border-danger/30 bg-danger/10 px-4 py-3',
      className
    )}
  >
    <p className="text-body text-danger flex items-start gap-2 min-w-0">
      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
      <span className="min-w-0 break-words">{message}</span>
    </p>
    {onRetry && (
      <Button variant="ghost" size="sm" icon={RefreshCw} onClick={onRetry} className="flex-shrink-0">
        Retry
      </Button>
    )}
  </div>
);

export default ErrorState;
