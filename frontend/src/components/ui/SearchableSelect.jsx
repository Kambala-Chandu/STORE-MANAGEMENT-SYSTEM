import React, { useState, useRef, useEffect, useId } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Field } from './Input';

export const SearchableSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option…',
  hint,
  error,
  required,
  className,
  containerClassName,
  id,
}) => {
  const generated = useId();
  const inputId = id || generated;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [open]);

  return (
    <Field id={inputId} label={label} hint={hint} error={error} required={required} className={containerClassName}>
      <div ref={wrapperRef} className={cn('relative min-w-0', className)}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full h-10 px-3 text-left bg-surface text-content border border-border-strong rounded-md flex items-center justify-between gap-2 transition-all duration-base',
            'hover:border-content-subtle focus:outline-none focus:border-primary-soft focus:ring-2 focus:ring-primary-soft/40',
            !selectedOption && 'text-content-subtle'
          )}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown className={cn('w-4 h-4 text-content-subtle transition-transform duration-fast', open && 'rotate-180')} />
        </button>

        {open && (
          <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-full rounded-lg border border-border-strong bg-surface shadow-2xl p-1.5 animate-scale-in">
            <div className="relative mb-1.5">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-subtle" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search…"
                className="w-full h-8 pl-8 pr-7 text-xs bg-elevated text-content placeholder:text-content-subtle rounded-md border border-border focus:outline-none focus:border-primary-soft"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-content-subtle hover:text-content"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto ds-scroll space-y-0.5">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = String(opt.value) === String(value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange?.(opt.value);
                        setOpen(false);
                      }}
                      className={cn(
                        'w-full px-2.5 py-1.5 rounded-sm text-xs font-medium text-left flex items-center justify-between transition-colors',
                        isSelected
                          ? 'bg-primary/15 text-primary-soft font-semibold'
                          : 'text-content-muted hover:text-content hover:bg-elevated'
                      )}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <p className="p-3 text-center text-xs text-content-subtle">No options found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Field>
  );
};

export default SearchableSelect;

