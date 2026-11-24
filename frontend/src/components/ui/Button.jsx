import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const VARIANTS = {
  primary:
    'bg-primary text-primary-fg hover:bg-primary-hover shadow-sm hover:shadow-glow border border-primary/60',
  secondary:
    'bg-secondary text-content hover:bg-secondary-hover border border-border-strong shadow-xs',
  ghost:
    'bg-transparent text-content-muted hover:text-content hover:bg-secondary border border-transparent',
  outline:
    'bg-transparent text-content border border-border-strong hover:bg-secondary',
  success:
    'bg-success text-white hover:bg-success/90 border border-success/60 shadow-sm',
  danger:
    'bg-danger text-white hover:bg-danger/90 border border-danger/60 shadow-sm',
  warning:
    'bg-warning text-content-inverse hover:bg-warning/90 border border-warning/60 shadow-sm',
  link: 'bg-transparent text-primary-soft hover:underline border-0 shadow-none px-0',
};

const SIZES = {
  sm: 'h-8 px-3 text-caption gap-1.5 rounded-sm',
  md: 'h-10 px-4 text-body gap-2 rounded-md',
  lg: 'h-11 px-5 text-body gap-2 rounded-lg',
  icon: 'h-10 w-10 p-0 rounded-md justify-center',
  'icon-sm': 'h-9 w-9 p-0 rounded-sm justify-center',
};

export const Button = forwardRef(function Button(
  {
    as: Tag = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    iconRight: IconRight,
    className,
    children,
    disabled,
    type = 'button',
    ...props
  },
  ref
) {
  const isIconOnly = size === 'icon' || size === 'icon-sm';
  return (
    <Tag
      ref={ref}
      type={Tag === 'button' ? type : undefined}
      disabled={Tag === 'button' ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      className={cn(
        'relative inline-flex items-center justify-center font-semibold select-none',
        'transition-all duration-base ease-enterprise active:scale-[0.98]',
        'disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className={cn(isIconOnly ? 'w-4 h-4' : 'w-4 h-4', 'animate-spin')} aria-hidden="true" />
      ) : (
        Icon && <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      )}
      {!isIconOnly && children}
      {!isIconOnly && IconRight && !loading && (
        <IconRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      )}
    </Tag>
  );
});

export default Button;
