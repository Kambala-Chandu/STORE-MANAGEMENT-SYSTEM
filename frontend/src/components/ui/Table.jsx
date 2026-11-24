import React from 'react';
import { cn } from '../../lib/cn';

/**
 * Responsive table primitives. The wrapper handles horizontal overflow so
 * pages never cause a page-level horizontal scrollbar on mobile/tablet.
 */
export const TableWrapper = ({ className, minWidth = 640, children, ...props }) => (
  <div
    className={cn('w-full min-w-0 overflow-auto ds-scroll max-h-[min(70dvh,44rem)]', className)}
    {...props}
  >
    <div style={{ minWidth: `${minWidth}px` }}>{children}</div>
  </div>
);

export const Table = ({ className, children, ...props }) => (
  <table className={cn('w-full border-collapse text-body', className)} {...props}>
    {children}
  </table>
);

export const THead = ({ className, children }) => (
  <thead
    className={cn(
      'sticky top-0 z-10 bg-elevated/95 backdrop-blur-sm',
      'shadow-[0_1px_0_0_rgb(var(--color-border))]',
      className
    )}
  >
    {children}
  </thead>
);

export const TBody = ({ className, children }) => (
  <tbody className={cn('divide-y divide-border', className)}>{children}</tbody>
);

export const TR = ({ className, interactive = false, children, ...props }) => (
  <tr
    className={cn(
      'transition-colors duration-fast',
      'hover:bg-elevated/45',
      interactive && 'cursor-pointer',
      className
    )}
    {...props}
  >
    {children}
  </tr>
);

export const TH = ({ align = 'left', className, children, ...props }) => (
  <th
    scope="col"
    className={cn(
      'px-4 py-3 text-caption font-bold uppercase tracking-wider text-content-muted whitespace-nowrap',
      align === 'right' && 'text-right',
      align === 'center' && 'text-center',
      align === 'left' && 'text-left',
      className
    )}
    {...props}
  >
    {children}
  </th>
);

export const TD = ({ align = 'left', className, children, ...props }) => (
  <td
    className={cn(
      'px-4 py-3 text-body text-content align-middle',
      align === 'right' && 'text-right',
      align === 'center' && 'text-center',
      className
    )}
    {...props}
  >
    {children}
  </td>
);

export default Table;
