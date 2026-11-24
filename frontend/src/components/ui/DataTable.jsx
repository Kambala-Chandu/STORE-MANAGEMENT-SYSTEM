import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Columns3,
  Rows3,
  Search,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { Table, TBody, TD, TH, THead, TR, TableWrapper } from './Table';
import { EmptyState } from './EmptyState';
import { SkeletonTable } from './Skeleton';
import { Button } from './Button';
import { Dropdown, DropdownLabel } from './Dropdown';

/**
 * Enterprise data table — purely presentational.
 * Sorting, searching, density, column visibility and pagination all operate
 * on the array you pass in. No fetching, no business rules.
 *
 * columns: [{ key, header, align, sortable, width, className, hideable,
 *             mobileHidden, sortValue(row), searchValue(row), render(row, i) }]
 */
const DENSITIES = {
  comfortable: { td: 'py-3.5', th: 'py-3' },
  standard: { td: 'py-3', th: 'py-2.5' },
  compact: { td: 'py-1.5', th: 'py-2' },
};

export const DataTable = ({
  columns = [],
  rows = [],
  rowKey = (row, i) => row?.id ?? i,
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription,
  emptyIcon,
  emptyAction,
  onRowClick,
  pageSize = 0,
  pageSizeOptions = [10, 25, 50, 100],
  initialSort = null,
  caption,
  className,
  dense = false,
  searchable = false,
  searchPlaceholder = 'Search records…',
  toolbarExtra = null,
  showDensityToggle = true,
  showColumnToggle = true,
  mobileCards = true,
  mobileTitle,
  minTableWidth = 720,
}) => {
  const [sort, setSort] = useState(initialSort); // { key, dir }
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(pageSize);
  const [query, setQuery] = useState('');
  const [density, setDensity] = useState(dense ? 'compact' : 'standard');
  const [hidden, setHidden] = useState(() => new Set());
  const liveRef = useRef(null);

  useEffect(() => setSize(pageSize), [pageSize]);
  useEffect(() => setPage(0), [rows.length, query]);

  const visibleColumns = useMemo(
    () => columns.filter((c) => !hidden.has(c.key)),
    [columns, hidden]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!searchable || !q) return rows;
    return rows.filter((row) =>
      columns.some((col) => {
        const raw = col.searchValue ? col.searchValue(row) : row?.[col.key];
        return raw !== null && raw !== undefined && String(raw).toLowerCase().includes(q);
      })
    );
  }, [rows, query, columns, searchable]);

  const sorted = useMemo(() => {
    if (!sort?.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const accessor = col?.sortValue || ((row) => row?.[sort.key]);
    return [...filtered].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av === bv) return 0;
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      const res =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.dir === 'desc' ? -res : res;
    });
  }, [filtered, sort, columns]);

  const totalPages = size > 0 ? Math.max(1, Math.ceil(sorted.length / size)) : 1;
  const current = Math.min(page, totalPages - 1);
  const visible = size > 0 ? sorted.slice(current * size, current * size + size) : sorted;

  const toggleSort = (key) => {
    setPage(0);
    setSort((prev) =>
      prev?.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  };

  const toggleColumn = (key) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const d = DENSITIES[density] || DENSITIES.standard;

  const toolbar =
    searchable || showDensityToggle || showColumnToggle || toolbarExtra ? (
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 border-b border-border bg-elevated/30">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {searchable && (
            <div className="relative flex items-center w-full md:max-w-xs min-w-0">
              <Search
                className="absolute left-3 w-4 h-4 text-content-subtle pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search table"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-9 pr-3 text-body bg-surface text-content placeholder:text-content-subtle border border-border-strong rounded-md transition-all duration-base ease-enterprise hover:border-content-subtle focus:outline-none focus:border-primary-soft focus:ring-2 focus:ring-primary-soft/40"
              />
            </div>
          )}
          {toolbarExtra}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {showDensityToggle && (
            <Dropdown
              align="right"
              trigger={
                <Button variant="secondary" size="sm" icon={Rows3} aria-label="Row density">
                  <span className="hidden sm:inline capitalize">{density}</span>
                </Button>
              }
            >
              <DropdownLabel>Row density</DropdownLabel>
              {Object.keys(DENSITIES).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDensity(key)}
                  className={cn(
                    'w-full text-left px-3 py-2 text-body rounded-md capitalize transition-colors duration-fast',
                    density === key
                      ? 'bg-primary/15 text-primary-soft'
                      : 'text-content-muted hover:bg-elevated hover:text-content'
                  )}
                >
                  {key}
                </button>
              ))}
            </Dropdown>
          )}
          {showColumnToggle && columns.some((c) => c.hideable !== false) && (
            <Dropdown
              align="right"
              trigger={
                <Button variant="secondary" size="sm" icon={Columns3} aria-label="Column visibility">
                  <span className="hidden sm:inline">Columns</span>
                </Button>
              }
            >
              <DropdownLabel>Visible columns</DropdownLabel>
              <div className="max-h-64 overflow-y-auto ds-scroll">
                {columns
                  .filter((c) => c.hideable !== false)
                  .map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 px-3 py-2 text-body text-content-muted hover:bg-elevated hover:text-content rounded-md cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={!hidden.has(col.key)}
                        onChange={() => toggleColumn(col.key)}
                        className="h-4 w-4 rounded border-border-strong bg-surface accent-primary"
                      />
                      <span className="truncate">{col.header}</span>
                    </label>
                  ))}
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    ) : null;

  if (loading) {
    return (
      <div className="w-full min-w-0">
        {toolbar}
        <div className="p-4">
          <SkeletonTable cols={Math.max(columns.length, 3)} />
        </div>
      </div>
    );
  }

  const isEmpty = !sorted.length;

  return (
    <div className={cn('w-full min-w-0', className)}>
      {toolbar}

      {isEmpty ? (
        <EmptyState
          icon={emptyIcon}
          title={query ? 'No matching records' : emptyTitle}
          description={query ? `Nothing matched “${query}”. Try a different search.` : emptyDescription}
          action={query ? undefined : emptyAction}
        />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className={cn(mobileCards && 'hidden md:block')}>
            <TableWrapper minWidth={minTableWidth}>
              <Table>
                {caption && <caption className="sr-only">{caption}</caption>}
                <THead>
                  <TR>
                    {visibleColumns.map((col) => {
                      const isSorted = sort?.key === col.key;
                      const SortIcon = !isSorted
                        ? ChevronsUpDown
                        : sort.dir === 'asc'
                          ? ArrowUp
                          : ArrowDown;
                      return (
                        <TH
                          key={col.key}
                          align={col.align}
                          style={col.width ? { width: col.width } : undefined}
                          aria-sort={
                            isSorted ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined
                          }
                          className={cn(d.th, col.headerClassName)}
                        >
                          {col.sortable ? (
                            <button
                              type="button"
                              onClick={() => toggleSort(col.key)}
                              className={cn(
                                'inline-flex items-center gap-1.5 rounded-xs transition-colors duration-fast',
                                isSorted ? 'text-content' : 'hover:text-content'
                              )}
                            >
                              {col.header}
                              <SortIcon className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          ) : (
                            col.header
                          )}
                        </TH>
                      );
                    })}
                  </TR>
                </THead>
                <TBody>
                  {visible.map((row, i) => (
                    <TR
                      key={rowKey(row, i)}
                      className={cn(i % 2 === 1 && 'bg-elevated/20')}
                      interactive={!!onRowClick}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      tabIndex={onRowClick ? 0 : undefined}
                      onKeyDown={
                        onRowClick
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onRowClick(row);
                              }
                            }
                          : undefined
                      }
                    >
                      {visibleColumns.map((col) => (
                        <TD key={col.key} align={col.align} className={cn(d.td, col.className)}>
                          {col.render ? col.render(row, i) : row?.[col.key]}
                        </TD>
                      ))}
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
          </div>

          {/* Mobile card layout — no horizontal scrolling */}
          {mobileCards && (
            <ul className="md:hidden divide-y divide-border">
              {visible.map((row, i) => {
                const [first, ...rest] = visibleColumns.filter((c) => !c.mobileHidden);
                return (
                  <li
                    key={rowKey(row, i)}
                    className={cn(
                      'px-4 py-3.5 min-w-0 transition-colors duration-fast',
                      onRowClick && 'active:bg-elevated/70 cursor-pointer'
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    <div className="text-body font-semibold text-content break-words min-w-0">
                      {mobileTitle
                        ? mobileTitle(row, i)
                        : first
                          ? first.render
                            ? first.render(row, i)
                            : row?.[first.key]
                          : null}
                    </div>
                    <dl className="mt-2 grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-3 gap-y-1.5">
                      {rest.map((col) => (
                        <React.Fragment key={col.key}>
                          <dt className="text-caption text-content-subtle uppercase tracking-wide">
                            {col.header}
                          </dt>
                          <dd className="text-caption text-content-muted min-w-0 break-words text-right">
                            {col.render ? col.render(row, i) : row?.[col.key]}
                          </dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  </li>
                );
              })}
            </ul>
          )}

          {size > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <p className="text-caption text-content-muted" ref={liveRef} aria-live="polite">
                  Showing <span className="font-semibold text-content">{current * size + 1}</span>–
                  <span className="font-semibold text-content">
                    {Math.min((current + 1) * size, sorted.length)}
                  </span>{' '}
                  of <span className="font-semibold text-content">{sorted.length}</span>
                </p>
                {pageSizeOptions?.length > 1 && (
                  <label className="flex items-center gap-1.5 text-caption text-content-subtle">
                    <span className="hidden sm:inline">Rows</span>
                    <select
                      value={size}
                      onChange={(e) => {
                        setSize(Number(e.target.value));
                        setPage(0);
                      }}
                      aria-label="Rows per page"
                      className="h-8 rounded-md border border-border-strong bg-surface px-2 text-caption text-content focus:outline-none focus:ring-2 focus:ring-primary-soft/40"
                    >
                      {pageSizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={current === 0}
                >
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <span className="text-caption text-content-muted px-1 tabular-nums">
                  {current + 1} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  iconRight={ChevronRight}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={current >= totalPages - 1}
                >
                  <span className="hidden sm:inline">Next</span>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataTable;
