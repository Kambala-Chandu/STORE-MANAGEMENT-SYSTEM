import React, { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from './Button';

const WIDTHS = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

/**
 * Accessible slide-out drawer panel (right side).
 * Focus trap, ESC to close, scroll lock, ARIA wiring.
 */
export const Drawer = ({
  open,
  onClose,
  title,
  description,
  width = 'md',
  footer,
  children,
  className,
  closeOnBackdrop = true,
}) => {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return undefined;
    previouslyFocused.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => {
      const target = panelRef.current?.querySelector(
        '[data-autofocus], button:not([disabled]), input, select, textarea'
      );
      target?.focus();
    }, 50);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end"
      onKeyDown={handleKeyDown}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-overlay/70 backdrop-blur-sm transition-opacity duration-slow"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
        style={{ animation: 'fadeIn 180ms ease-out' }}
      />

      {/* drawer panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cn(
          'relative w-full bg-surface border-l border-border-strong shadow-2xl',
          'h-full flex flex-col',
          WIDTHS[width] || WIDTHS.md,
          className
        )}
        style={{
          animation: 'slideInRight 220ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-border flex-shrink-0">
          <div className="min-w-0 flex-1">
            {title && <h2 className="text-title font-semibold text-content">{title}</h2>}
            {description && (
              <p className="text-caption text-content-muted mt-1">{description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close drawer"
            icon={X}
          />
        </div>

        {/* body */}
        <div className="px-5 py-5 overflow-y-auto ds-scroll flex-1 min-h-0">{children}</div>

        {/* footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-border flex flex-wrap items-center justify-end gap-2 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Drawer;

