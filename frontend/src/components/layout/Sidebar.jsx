import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/cn';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Package,
  Tags,
  Truck,
  Users,
  Boxes,
  ShoppingBag,
  BarChart3,
  UserCog,
  ScanLine,
  ShieldAlert,
  Database,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Store,
} from 'lucide-react';

/**
 * Enterprise Sidebar (Azure Portal & Linear aesthetic).
 * Supports full expanded mode and compact icon rail mode.
 */
export const Sidebar = ({ collapsed = false, onToggleCollapse, mobileOpen = false, onCloseMobile }) => {
  const { user } = useAuth();
  const role = user?.role || 'Cashier';
  const isManager = ['Admin', 'Manager'].includes(role);
  const isAdmin = role === 'Admin';

  const groups = [
    {
      label: 'Operations',
      items: [
        { label: 'Executive Dashboard', to: '/', icon: LayoutDashboard, allow: true, end: true },
        { label: 'POS Terminal', to: '/pos', icon: ShoppingCart, allow: true },
        { label: 'Sales History', to: '/sales', icon: Receipt, allow: true },
        { label: 'Customers', to: '/customers', icon: Users, allow: true },
      ],
    },
    {
      label: 'Catalog & Products',
      items: [
        { label: 'Product Catalog', to: '/products', icon: Package, allow: isManager },
        { label: 'Categories', to: '/categories', icon: Tags, allow: isManager },
        { label: 'Suppliers', to: '/suppliers', icon: Truck, allow: isManager },
        { label: 'Barcode & QR Lab', to: '/barcode-test', icon: ScanLine, allow: true },
      ],
    },
    {
      label: 'Inventory Management',
      items: [
        { label: 'Stock Ledger', to: '/inventory', icon: Boxes, allow: isManager },
        { label: 'Purchase Orders', to: '/purchases', icon: ShoppingBag, allow: isManager },
      ],
    },
    {
      label: 'Analytics & BI',
      items: [{ label: 'Executive Reports', to: '/reports', icon: BarChart3, allow: isManager }],
    },
    {
      label: 'Administration & Security',
      items: [
        { label: 'Audit Logs', to: '/audit', icon: ShieldAlert, allow: isManager },
        { label: 'User Directory', to: '/users', icon: UserCog, allow: isAdmin },
        { label: 'Database Backup', to: '/backup', icon: Database, allow: isAdmin },
      ],
    },
  ]
    .map((g) => ({ ...g, items: g.items.filter((i) => i.allow) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      {/* Mobile Scrim */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        aria-label="Main enterprise navigation"
        className={cn(
          'fixed left-0 top-0 z-50 flex h-dvh select-none flex-col',
          'border-r border-border bg-sidebar shadow-2xl lg:shadow-none',
          'transition-[width,transform] duration-200 ease-out',
          collapsed ? 'lg:w-[4.5rem]' : 'lg:w-[16.5rem]',
          'w-[17.5rem] lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand & Workspace Header */}
        <div
          className={cn(
            'flex h-14 flex-shrink-0 items-center gap-3 border-b border-border px-4',
            collapsed && 'lg:justify-center lg:px-0'
          )}
        >
          <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/25 border border-white/20">
            <Store className="h-4 w-4 text-white" aria-hidden="true" />
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-bold text-content tracking-tight">StoreHub</p>
                <span className="rounded bg-blue-500/15 border border-blue-500/30 px-1 py-0.2 text-[9px] font-bold text-blue-300 uppercase">
                  Enterprise
                </span>
              </div>
              <p className="truncate text-[10px] text-content-muted font-medium">Retail Cloud Operations</p>
            </div>
          )}

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar navigation"
            className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg text-content-muted hover:bg-elevated hover:text-content lg:hidden"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Group Items */}
        <nav className="ds-scroll flex-1 space-y-4 overflow-y-auto px-3 py-3">
          {groups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!collapsed ? (
                <p className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-content-subtle">
                  {group.label}
                </p>
              ) : (
                <div className="mx-2 my-2 h-px bg-border" aria-hidden="true" />
              )}

              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                          cn(
                            'group relative flex items-center gap-3 rounded-xl px-2.5 py-2',
                            'text-xs font-medium transition-all duration-150',
                            collapsed && 'lg:justify-center lg:px-0 lg:py-2.5',
                            isActive
                              ? 'bg-primary/15 border border-primary/30 text-primary font-semibold shadow-sm'
                              : 'border border-transparent text-content-muted hover:bg-elevated hover:text-content'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {/* Active Accent Indicator */}
                            <span
                              className={cn(
                                'absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-r-full bg-blue-500',
                                'transition-all duration-150',
                                isActive ? 'h-4 opacity-100' : 'h-0 opacity-0'
                              )}
                              aria-hidden="true"
                            />

                            <Icon
                              className={cn(
                                'h-4 w-4 flex-shrink-0 transition-colors',
                                isActive ? 'text-primary' : 'text-content-muted group-hover:text-content'
                              )}
                              aria-hidden="true"
                            />

                            {!collapsed && <span className="truncate">{item.label}</span>}

                            {/* Floating Tooltip in Collapsed Mode */}
                            {collapsed && (
                              <span
                                role="tooltip"
                                className={cn(
                                  'pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-lg',
                                  'border border-border bg-surface px-2.5 py-1 text-xs font-medium text-content shadow-xl',
                                  'opacity-0 transition-opacity duration-150 lg:block group-hover:opacity-100'
                                )}
                              >
                                {item.label}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer: User Profile & Collapse Toggle */}
        <div className="flex-shrink-0 space-y-1.5 border-t border-border p-2.5">
          <div
            className={cn(
              'flex items-center gap-2.5 rounded-xl border border-border bg-surface/50 p-2',
              collapsed && 'lg:justify-center lg:p-1.5'
            )}
          >
            <div className="relative">
              <div className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
                {(user?.full_name || user?.username || 'US').substring(0, 2).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-sidebar" />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-content leading-tight">
                  {user?.full_name || user?.username || 'User'}
                </p>
                <p className="truncate text-[10px] text-content-muted leading-tight capitalize">{role}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
            aria-expanded={!collapsed}
            className={cn(
              'hidden w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium lg:flex',
              'text-content-muted hover:bg-elevated hover:text-content transition-colors',
              collapsed && 'justify-center px-0'
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4 text-content-muted" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 text-content-muted" />
                <span>Collapse Rail</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
