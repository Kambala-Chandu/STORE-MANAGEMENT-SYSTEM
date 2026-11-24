import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/cn';

const TONES = {
  success: { icon: CheckCircle2, cls: 'border-success/40 text-success-soft' },
  error: { icon: XCircle, cls: 'border-danger/40 text-danger-soft' },
  warning: { icon: AlertTriangle, cls: 'border-warning/40 text-warning-soft' },
  info: { icon: Info, cls: 'border-info/40 text-info-soft' },
};

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast) => {
      const id = Date.now() + Math.random();
      const entry = { id, tone: 'info', duration: 4000, ...toast };
      setToasts((prev) => [...prev, entry]);
      if (entry.duration > 0) {
        window.setTimeout(() => dismiss(id), entry.duration);
      }
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      toast: push,
      success: (title, description) => push({ tone: 'success', title, description }),
      error: (title, description) => push({ tone: 'error', title, description }),
      warning: (title, description) => push({ tone: 'warning', title, description }),
      info: (title, description) => push({ tone: 'info', title, description }),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="fixed z-[200] bottom-4 right-4 left-4 sm:left-auto flex flex-col gap-2 pointer-events-none sm:w-[380px]"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((t) => {
          const config = TONES[t.tone] || TONES.info;
          const Icon = config.icon;
          return (
            <div
              key={t.id}
              role="status"
              aria-live="polite"
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-lg border bg-surface/95 backdrop-blur',
                'px-4 py-3 shadow-xl animate-slide-in-right',
                config.cls
              )}
            >
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold text-content">{t.title}</p>
                {t.description && (
                  <p className="text-caption text-content-muted mt-0.5 break-words">{t.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="p-1 rounded-xs text-content-subtle hover:text-content transition-colors flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Safe no-op fallback so components never crash outside the provider.
    return {
      toast: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      dismiss: () => {},
    };
  }
  return ctx;
};

export default ToastProvider;
