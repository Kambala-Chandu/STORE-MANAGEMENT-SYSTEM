import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

/**
 * Lightweight accessible dropdown menu (click to open, ESC / outside click to close).
 */
export const Dropdown = ({ trigger, align = 'right', width = 'w-56', className, children }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn('relative inline-flex', className)}>
      {React.cloneElement(trigger, {
        onClick: (e) => {
          trigger.props.onClick?.(e);
          setOpen((v) => !v);
        },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      })}

      {open && (
        <div
          role="menu"
          className={cn(
            'absolute top-[calc(100%+8px)] z-50 rounded-lg border border-border-strong bg-surface',
            'shadow-xl p-1.5 animate-scale-in origin-top',
            align === 'right' ? 'right-0' : 'left-0',
            width
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ icon: Icon, tone = 'default', className, children, ...props }) => (
  <button
    type="button"
    role="menuitem"
    className={cn(
      'w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-body font-medium text-left',
      'transition-colors duration-fast',
      tone === 'danger'
        ? 'text-danger-soft hover:bg-danger/10'
        : 'text-content-muted hover:text-content hover:bg-elevated',
      className
    )}
    {...props}
  >
    {Icon && <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
    <span className="truncate">{children}</span>
  </button>
);

export const DropdownLabel = ({ children }) => (
  <p className="px-3 pt-2 pb-1 text-caption font-bold uppercase tracking-wider text-content-subtle">{children}</p>
);

export const DropdownSeparator = () => <div className="my-1.5 h-px bg-border" role="separator" />;

export default Dropdown;
