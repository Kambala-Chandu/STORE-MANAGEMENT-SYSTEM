import React, { forwardRef, useId } from 'react';
import { cn } from '../../lib/cn';

const fieldBase =
  'w-full bg-elevated text-content placeholder:text-content-subtle border border-border-strong rounded-md ' +
  'transition-all duration-base ease-enterprise hover:border-content-subtle ' +
  'focus:outline-none focus:border-primary-soft focus:ring-2 focus:ring-primary-soft/40 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export const Field = ({ id, label, hint, error, required, className, children }) => (
  <div className={cn('flex flex-col gap-1.5 min-w-0', className)}>
    {label && (
      <label htmlFor={id} className="text-caption font-semibold text-content-muted">
        {label}
        {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
      </label>
    )}
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="text-caption text-danger-soft">{error}</p>
    ) : (
      hint && <p id={`${id}-hint`} className="text-caption text-content-subtle">{hint}</p>
    )}
  </div>
);

export const Input = forwardRef(function Input(
  { label, hint, error, icon: Icon, className, containerClassName, id, required, ...props },
  ref
) {
  const generated = useId();
  const inputId = id || generated;
  return (
    <Field id={inputId} label={label} hint={hint} error={error} required={required} className={containerClassName}>
      <div className="relative flex items-center min-w-0">
        {Icon && (
          <Icon className="absolute left-3 w-4 h-4 text-content-subtle pointer-events-none" aria-hidden="true" />
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(fieldBase, 'h-10 px-3 text-body', Icon && 'pl-9', error && 'border-danger focus:ring-danger/40', className)}
          {...props}
        />
      </div>
    </Field>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, hint, error, className, containerClassName, id, required, rows = 4, ...props },
  ref
) {
  const generated = useId();
  const inputId = id || generated;
  return (
    <Field id={inputId} label={label} hint={hint} error={error} required={required} className={containerClassName}>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        className={cn(fieldBase, 'px-3 py-2.5 text-body resize-y ds-scroll', error && 'border-danger', className)}
        {...props}
      />
    </Field>
  );
});

export { fieldBase };
export default Input;
