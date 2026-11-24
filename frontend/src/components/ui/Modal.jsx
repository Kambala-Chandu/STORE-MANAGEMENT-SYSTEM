import React, { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from './Button';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[min(96vw,1400px)]',
};

/**
 * Accessible dialog: focus trap, ESC to close, scroll lock, ARIA wiring.
 */
export const Modal = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
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
    }, 20);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute inset-0 bg-overlay/80 backdrop-blur-sm animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cn(
          'relative w-full bg-surface border border-border-strong shadow-xl',
          'rounded-t-2xl sm:rounded-xl max-h-[92dvh] flex flex-col animate-scale-in',
          'pb-[env(safe-area-inset-bottom)] sm:pb-0',
          SIZES[size] || SIZES.md,
          className
        )}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-5 py-4 border-b border-border">
          <div className="min-w-0">
            {title && <h2 className="text-title font-semibold text-content">{title}</h2>}
            {description && <p className="text-caption text-content-muted mt-1">{description}</p>}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close dialog" icon={X} />
        </div>

        <div className="px-5 py-5 overflow-y-auto ds-scroll flex-1 min-h-0">{children}</div>

        {footer && (
          <div className="px-5 py-4 border-t border-border flex flex-wrap items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
