import React, { useId } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Field } from './Input';

export const DatePicker = ({
  label,
  value,
  onChange,
  hint,
  error,
  placeholder = 'YYYY-MM-DD',
  min,
  max,
  className,
  containerClassName,
  id,
}) => {
  const generated = useId();
  const inputId = id || generated;

  const setPreset = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    onChange?.(d.toISOString().slice(0, 10));
  };

  return (
    <Field id={inputId} label={label} hint={hint} error={error} className={containerClassName}>
      <div className={cn('space-y-1.5', className)}>
        <div className="relative flex items-center">
          <CalendarIcon className="absolute left-3 w-4 h-4 text-content-subtle pointer-events-none" />
          <input
            id={inputId}
            type="date"
            value={value || ''}
            min={min}
            max={max}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full h-10 pl-9 pr-9 text-body bg-surface text-content border border-border-strong rounded-md transition-all duration-base hover:border-content-subtle focus:outline-none focus:border-primary-soft focus:ring-2 focus:ring-primary-soft/40 [color-scheme:dark]"
            placeholder={placeholder}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange?.('')}
              className="absolute right-3 p-0.5 rounded text-content-subtle hover:text-content"
              title="Clear date"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPreset(0)}
            className="text-[11px] px-2 py-0.5 rounded bg-elevated/70 hover:bg-elevated text-content-muted hover:text-content border border-border transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setPreset(7)}
            className="text-[11px] px-2 py-0.5 rounded bg-elevated/70 hover:bg-elevated text-content-muted hover:text-content border border-border transition-colors"
          >
            7 Days Ago
          </button>
          <button
            type="button"
            onClick={() => setPreset(30)}
            className="text-[11px] px-2 py-0.5 rounded bg-elevated/70 hover:bg-elevated text-content-muted hover:text-content border border-border transition-colors"
          >
            30 Days Ago
          </button>
        </div>
      </div>
    </Field>
  );
};

export default DatePicker;

