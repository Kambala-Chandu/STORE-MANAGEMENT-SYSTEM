import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cn';
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '../ui/Dropdown';
import {
  LogOut,
  Menu,
  ChevronDown,
  UserCircle2,
  Search,
  Bell,
  RefreshCw,
  ChevronRight,
  Plus,
  ShoppingCart,
  Package,
  Boxes,
  BarChart3,
  Building2,
  CheckCircle2,
  Shield,
  Clock,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

const TITLES = {
  '/': 'Executive Dashboard',
  '/pos': 'Point of Sale (POS)',
  '/sales': 'Sales History & Invoices',
  '/customers': 'Customer Directory',
  '/barcode-test': 'Barcode & Label Lab',
  '/products': 'Product Catalog',
  '/categories': 'Category Management',
  '/suppliers': 'Supplier Directory',
  '/inventory': 'Stock Ledger & Control',
  '/purchases': 'Purchase Orders',
  '/reports': 'Executive BI & Reports',
  '/audit': 'System Audit Logs',
  '/users': 'User Management & Roles',
  '/backup': 'Database Backup & Restore',
};

const SECTIONS = {
  '/': 'Overview',
  '/pos': 'Operations',
  '/sales': 'Operations',
  '/customers': 'Operations',
  '/barcode-test': 'Catalog',
  '/products': 'Catalog',
  '/categories': 'Catalog',
  '/suppliers': 'Catalog',
  '/inventory': 'Inventory',
  '/purchases': 'Inventory',
  '/reports': 'Analytics',
  '/audit': 'Administration',
  '/users': 'Administration',
  '/backup': 'Administration',
};

const ROLE_BADGE = {
  Admin: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  Manager: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Cashier: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

const QUICK_ACTIONS = [
  { to: '/pos', label: 'New POS Sale', icon: ShoppingCart },
  { to: '/products', label: 'Create Product', icon: Package },
  { to: '/inventory', label: 'Stock Adjustment', icon: Boxes },
  { to: '/reports', label: 'View Reports', icon: BarChart3 },
];

const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const formatDate = (date) =>
  date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

export const Navbar = ({ onOpenMobileNav }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const pageTitle = TITLES[pathname] || 'Workspace';
  const section = SECTIONS[pathname] || 'Enterprise';
  const initials = (user?.full_name || user?.username || 'U').substring(0, 2).toUpperCase();
  const role = user?.role || 'Cashier';

  const [now, setNow] = useState(() => new Date());
  const [updatedAt, setUpdatedAt] = useState(() => new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Live real-time clock
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Update timestamp when navigating
  useEffect(() => {
    setUpdatedAt(new Date());
  }, [pathname]);

  // Global command shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setUpdatedAt(new Date());
    window.setTimeout(() => {
      setRefreshing(false);
      navigate(0);
    }, 350);
  };

  return (
    <header className="sticky top-0 z-30 h-14 flex-shrink-0 border-b border-border bg-navbar/[0.92] backdrop-blur-xl">
      <div className="mx-auto flex h-full w-full max-w-[1700px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Nav Toggle + Workspace Breadcrumb */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Open sidebar menu"
            className="-ml-1 grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg text-content-muted hover:bg-elevated hover:text-content lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-content-muted">
              <span className="inline-flex items-center gap-1 text-content-muted">
                <Building2 className="h-3 w-3 text-primary-soft" />
                StoreHub
              </span>
              <ChevronRight className="h-3 w-3 text-content-subtle" aria-hidden="true" />
              <span className="text-content-muted">{section}</span>
              <ChevronRight className="h-3 w-3 text-content-subtle" aria-hidden="true" />
              <span className="text-content font-semibold truncate">{pageTitle}</span>
            </nav>
            <p className="sm:hidden truncate text-sm font-semibold text-content">{pageTitle}</p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:block min-w-0 max-w-md flex-1">
          <label htmlFor="global-search" className="sr-only">
            Global search across store
          </label>
          <div className="relative flex items-center">
            <Search
              className="pointer-events-none absolute left-3 h-4 w-4 text-content-subtle"
              aria-hidden="true"
            />
            <input
              id="global-search"
              ref={searchRef}
              type="search"
              placeholder="Search products, orders, customers (Press ⌘K)..."
              className={cn(
                'h-9 w-full min-w-0 rounded-lg border border-border bg-surface pl-9 pr-12 text-xs',
                'text-content placeholder:text-content-subtle transition-all duration-150',
                'hover:border-border-strong focus:border-primary-soft focus:outline-none focus:ring-2 focus:ring-primary-soft/20 focus:bg-surface'
              )}
            />
            <kbd className="pointer-events-none absolute right-2 hidden rounded border border-white/[0.10] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-content-muted lg:block">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Clock + Quick Action + Sync + Notifications + Profile */}
        <div className="flex flex-shrink-0 items-center gap-2">
          
          {/* Live Date/Time Clock */}
          <div className="hidden xl:flex flex-col items-end leading-tight pr-2">
            <span className="text-xs font-semibold text-content tabular-nums">{formatTime(now)}</span>
            <span className="text-[10px] text-content-muted">{formatDate(now)}</span>
          </div>

          <div className="hidden xl:block h-5 w-px bg-border" aria-hidden="true" />

          {/* Quick Actions Dropdown */}
          <Dropdown
            align="right"
            width="w-56"
            trigger={
              <button
                type="button"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-content-muted hover:text-content hover:bg-elevated transition-colors"
              >
                <Plus className="h-3.5 w-3.5 text-primary-soft" aria-hidden="true" />
                <span>Actions</span>
                <ChevronDown className="h-3 w-3 text-content-subtle" aria-hidden="true" />
              </button>
            }
          >
            <DropdownLabel>Operational Quick Actions</DropdownLabel>
            <DropdownSeparator />
            {QUICK_ACTIONS.map((a) => (
              <DropdownItem key={a.to} icon={a.icon} onClick={() => navigate(a.to)}>
                {a.label}
              </DropdownItem>
            ))}
          </Dropdown>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Refresh view data"
            title={`Last synchronized: ${formatTime(updatedAt)}`}
            className="grid h-9 w-9 place-items-center rounded-lg text-content-muted hover:bg-elevated hover:text-content transition-colors"
          >
            <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin text-primary-soft')} aria-hidden="true" />
          </button>

                    {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-content-muted hover:bg-elevated hover:text-content transition-colors"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400 hover:rotate-45 transition-transform" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 text-primary hover:-rotate-12 transition-transform" aria-hidden="true" />
            )}
          </button>

          {/* Notifications Center */}
          <Dropdown
            align="right"
            width="w-72"
            trigger={
              <button
                type="button"
                aria-label="System notifications"
                className="relative grid h-9 w-9 place-items-center rounded-lg text-content-muted hover:bg-elevated hover:text-content transition-colors"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-navbar" aria-hidden="true" />
              </button>
            }
          >
            <DropdownLabel>System Notifications</DropdownLabel>
            <DropdownSeparator />
            <DropdownItem disabled>
              <div className="flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>All services operating normally</span>
              </div>
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon={Boxes} onClick={() => navigate('/inventory')}>
              Check inventory reorder alerts
            </DropdownItem>
          </Dropdown>

          {/* User Profile Menu */}
          <Dropdown
            align="right"
            trigger={
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-border bg-surface p-1 pr-2 hover:bg-elevated transition-colors"
              >
                <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-content shadow-sm">
                  {initials}
                </span>
                <span className="hidden lg:block text-left">
                  <span className="block truncate text-xs font-semibold text-content leading-tight">
                    {user?.full_name || user?.username || 'User'}
                  </span>
                  <span className="block truncate text-[10px] text-content-muted leading-tight">{role}</span>
                </span>
                <ChevronDown className="hidden lg:block h-3.5 w-3.5 text-content-subtle" aria-hidden="true" />
              </button>
            }
          >
            <DropdownLabel>
              <span className="block truncate font-semibold text-content">
                {user?.full_name || user?.username || 'User'}
              </span>
              <span
                className={cn(
                  'mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                  ROLE_BADGE[role] || 'border-white/10 bg-white/5 text-slate-300'
                )}
              >
                {role}
              </span>
            </DropdownLabel>
            <DropdownSeparator />
            <DropdownItem icon={UserCircle2} disabled>
              Username: {user?.username || 'user'}
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon={LogOut} tone="danger" onClick={logout}>
              Sign Out
            </DropdownItem>
          </Dropdown>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
