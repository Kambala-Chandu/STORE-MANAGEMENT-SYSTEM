import React, { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Field, fieldBase } from './Input';

export const Select = forwardRef(function Select(
  { label, hint, error, options, placeholder, className, containerClassName, id, required, children, ...props },
  ref
) {
  const generated = useId();
  const selectId = id || generated;
  return (
    <Field id={selectId} label={label} hint={hint} error={error} required={required} className={containerClassName}>
      <div className="relative flex items-center min-w-0">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          className={cn(
            fieldBase,
            'h-10 pl-3 pr-9 text-body appearance-none cursor-pointer',
            error && 'border-danger',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options
            ? options.map((opt) => {
                const value = typeof opt === 'object' ? opt.value : opt;
                const text = typeof opt === 'object' ? opt.label : opt;
                return (
                  <option key={value} value={value}>
                    {text}
                  </option>
                );
              })
            : children}
        </select>
        <ChevronDown
          className="absolute right-3 w-4 h-4 text-content-subtle pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </Field>
  );
});

export default Select;
