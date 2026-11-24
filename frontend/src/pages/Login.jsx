import React, { useState, useCallback, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Store,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Briefcase,
  ShoppingCart,
  Loader2,
  ArrowRight,
  Shield,
  Check,
  Boxes,
  BarChart3,
  Users,
  Globe,
  Info,
  FileText,
  Headphones,
  Sun,
  Moon,
} from 'lucide-react';
import heroImage from '../assets/images/login-hero.webp';

/* ── Storage Keys ────────────────────────────────── */
const STORAGE_REMEMBER_KEY = 'storehub_remember_device';
const STORAGE_USERNAME_KEY = 'storehub_saved_username';

/* ── Static Background Styles ── */
const BG_IMG_STYLE = {
  objectPosition: '50% 45%',
  filter: 'brightness(1.18) contrast(1.10) saturate(1.12)',
};

/* ── Security: Strip demo credentials from production bundle ── */
const IS_DEV = Boolean(import.meta.env.DEV);
const DEMO_ROLES = IS_DEV
  ? [
      { key: 'admin', label: 'Admin', username: 'admin', password: 'Admin@123', Icon: ShieldCheck },
      { key: 'manager', label: 'Manager', username: 'manager', password: 'Manager@123', Icon: Briefcase },
      { key: 'cashier', label: 'Cashier', username: 'cashier', password: 'Cashier@123', Icon: ShoppingCart },
    ]
  : [];

/* ── Static Marketing Feature List ── */
const FEATURES = [
  {
    Icon: Boxes,
    title: 'Inventory Intelligence',
    desc: 'Real-time tracking, stock optimization, and automated reordering.',
  },
  {
    Icon: BarChart3,
    title: 'Business Analytics',
    desc: 'Advanced reporting, insights, and performance dashboards.',
  },
  {
    Icon: ShieldCheck,
    title: 'Enterprise Security',
    desc: 'Role-based access, audit trails, and enterprise-grade encryption.',
  },
];

/* ── Static Metrics List ── */
const METRICS = [
  { Icon: Shield, value: '99.99%', label: 'Uptime SLA' },
  { Icon: Lock, value: 'TLS 1.3', label: 'Secure Encryption' },
  { Icon: Users, value: 'Multi-Role', label: 'Access Control' },
];

export const Login = () => {
  /* Unique element IDs for ARIA associations */
  const errorAlertId = useId();
  const capsLockAlertId = useId();
  const forgotNoticeId = useId();

  /* State hydrated with resilient try/catch for incognito / restricted storage */
  const [rememberDevice, setRememberDevice] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REMEMBER_KEY);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [username, setUsername] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USERNAME_KEY);
      if (savedUser) return savedUser;
    } catch {
      // safe fallback
    }
    return IS_DEV ? 'admin' : '';
  });

  const [password, setPassword] = useState(() => (IS_DEV ? 'Admin@123' : ''));
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(IS_DEV ? 'admin' : '');

  const { login } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const bgOverlayStyle = isDark
    ? {
        background:
          'linear-gradient(90deg, rgba(4,8,18,0.72) 0%, rgba(4,8,18,0.55) 40%, rgba(4,8,18,0.45) 65%, rgba(4,8,18,0.68) 100%)',
      }
    : {
        background:
          'linear-gradient(90deg, rgba(248,250,252,0.94) 0%, rgba(248,250,252,0.88) 40%, rgba(248,250,252,0.80) 65%, rgba(248,250,252,0.92) 100%)',
      };

  const cardGlassStyle = isDark
    ? {
        background: 'rgba(8, 15, 28, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow:
          '0 24px 64px -12px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.06), 0 0 32px -4px rgba(37, 99, 235, 0.08)',
      }
    : {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow:
          '0 20px 50px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8), 0 0 32px -4px rgba(37, 99, 235, 0.06)',
      };
  const navigate = useNavigate();

  /* ── Form Submission ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setError('');
    setForgotPasswordMsg(false);
    setLoading(true);

    try {
      try {
        if (rememberDevice) {
          localStorage.setItem(STORAGE_USERNAME_KEY, trimmedUsername);
          localStorage.setItem(STORAGE_REMEMBER_KEY, 'true');
        } else {
          localStorage.removeItem(STORAGE_USERNAME_KEY);
          localStorage.setItem(STORAGE_REMEMBER_KEY, 'false');
        }
      } catch {
        // storage disabled or quota exceeded
      }

      await login(trimmedUsername, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Role Selection (DEV only) ── */
  const handleSelectRole = useCallback((role) => {
    setUsername(role.username);
    setPassword(role.password);
    setSelectedRole(role.key);
    setError('');
    setForgotPasswordMsg(false);
  }, []);

  /* ── Desynchronize demo role button when user manually edits fields ── */
  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
    setSelectedRole((prev) => (prev ? '' : prev));
    setError((prev) => (prev ? '' : prev));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    setSelectedRole((prev) => (prev ? '' : prev));
    setError((prev) => (prev ? '' : prev));
  }, []);

  /* ── Caps Lock Detection ── */
  const handleKeyModifier = useCallback((e) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  }, []);

  /* ── Forgot Password Action ── */
  const handleForgotPassword = useCallback(() => {
    setForgotPasswordMsg((prev) => !prev);
    setError('');
  }, []);

  return (
    <div className="min-h-screen w-full bg-background relative overflow-y-auto lg:overflow-hidden flex flex-col justify-between px-6 sm:px-10 lg:px-14 xl:px-18 py-5 lg:py-6 select-text font-sans">

      {/* ── WAREHOUSE BACKGROUND ── */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none select-none" aria-hidden="true">
        <img
          src={heroImage}
          alt=""
          fetchpriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={BG_IMG_STYLE}
        />
        <div className="absolute inset-0" style={bgOverlayStyle} />
      </div>

      {/* ── LIVE REGION FOR SCREEN READERS ── */}
      <div className="sr-only" role="status" aria-live="polite">
        {loading ? 'Authenticating credentials, please wait...' : ''}
      </div>

      {/* ── MAIN CONTENT GRID (Exact matching alignment between Left & Right) ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center lg:items-center justify-between max-w-[1520px] mx-auto w-full my-auto py-2 lg:py-4 gap-8 lg:gap-12">

        {/* ═══ LEFT COLUMN (~54%) ═══ */}
        <section
          aria-label="Platform Overview"
          className="hidden lg:flex lg:w-[54%] flex-col justify-between py-1 max-w-[560px]"
        >
          {/* Top Brand (Aligns horizontally with Card Header) */}
          <div className="flex items-center gap-3 mb-8 xl:mb-10">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
              <Store className="h-4.5 w-4.5 text-white" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-bold text-content tracking-tight">StoreHub</span>
              <span className="text-slate-600" aria-hidden="true">|</span>
              <span className="text-[13.5px] text-content-muted font-medium">Enterprise Platform</span>
            </div>
          </div>

          {/* Hero Content (Headline aligns with "Welcome back") */}
          <div className="mb-8">
            <h1 className="text-[44px] xl:text-[50px] font-bold text-content leading-[1.06] tracking-tight mb-4">
              Store Management,
              <br />
              <span className="text-blue-500">
                simplified.
              </span>
            </h1>

            <p className="text-[14px] text-content-muted leading-[1.65] mb-8 max-w-[420px]">
              Unified inventory, sales, and operations platform
              designed for modern retail businesses to scale
              with confidence.
            </p>

            {/* 3 Features */}
            <div className="space-y-4">
              {FEATURES.map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="group flex items-start gap-3.5 hover:translate-x-[2.5px] transition-transform duration-150 ease-out cursor-default"
                >
                  <div className="h-11 w-11 rounded-[12px] bg-blue-500/[0.08] border border-blue-500/20 group-hover:border-blue-500/35 group-hover:bg-blue-500/[0.12] flex items-center justify-center shrink-0 transition-colors duration-150">
                    <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="pt-0.5">
                    <h2 className="text-[14px] font-bold text-content mb-0.5 tracking-tight">{title}</h2>
                    <p className="text-[12px] text-content-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics bar (Aligns horizontally with bottom of Login Card) */}
          <div className="hidden sm:flex items-center rounded-2xl bg-surface/75 border border-border backdrop-blur-md px-2 py-3 w-fit">
            {METRICS.map(({ Icon, value, label }, index) => (
              <React.Fragment key={label}>
                {index > 0 && <div className="w-px h-8 bg-white/[0.08] self-center" aria-hidden="true" />}
                <div className="flex items-center gap-2.5 px-4 xl:px-5">
                  <Icon className="h-4.5 w-4.5 text-blue-400/70 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[13.5px] font-bold text-content leading-tight">{value}</p>
                    <p className="text-[11px] text-content-muted mt-0.5">{label}</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ═══ RIGHT COLUMN (~44% — Login Card) ═══ */}
        <section
          aria-label="Sign In"
          className="w-full lg:w-[44%] flex items-center justify-center lg:justify-end"
        >
          <div className="w-full max-w-[450px]">
            <div
              className="rounded-[24px] border border-white/[0.08] p-6 sm:p-7 xl:p-8 transition-shadow duration-200"
              style={cardGlassStyle}
            >
              {/* Card header (Matches Left Brand Level) */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
                    <Store className="h-4 w-4 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] text-content-muted">StoreHub</span>
                    <span className="text-[13px] text-content font-semibold">Enterprise</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5" role="status" aria-label="System status: Production">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                    <span className="text-[12px] text-content-muted font-medium">Production</span>
                  </div>

                  <div className="h-3.5 w-px bg-border" aria-hidden="true" />

                  <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-surface text-content-muted hover:bg-elevated hover:text-content transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    {isDark ? (
                      <Sun className="h-3.5 w-3.5 text-amber-400 hover:rotate-45 transition-transform" aria-hidden="true" />
                    ) : (
                      <Moon className="h-3.5 w-3.5 text-primary hover:-rotate-12 transition-transform" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {/* Welcome Heading (Matches Left Title Level) */}
              <h2 className="text-[28px] font-bold text-content tracking-tight mb-1">
                Welcome back
              </h2>
              <p className="text-[13.5px] text-content-muted mb-5">
                Access your enterprise workspace securely.
              </p>

              {/* Error Banner */}
              {error && (
                <div
                  id={errorAlertId}
                  role="alert"
                  aria-live="assertive"
                  className="mb-3.5 p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-[12.5px] animate-fade-in"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 break-words">{error}</span>
                </div>
              )}

              {/* Forgot Password Helper Notice */}
              {forgotPasswordMsg && (
                <div
                  id={forgotNoticeId}
                  role="status"
                  aria-live="polite"
                  className="mb-3.5 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-2 text-blue-300 text-[12.5px] animate-fade-in"
                >
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" aria-hidden="true" />
                  <div className="leading-snug">
                    Self-service password recovery is disabled in this environment. Please contact your system administrator to reset credentials.
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>

                {/* Username Field */}
                <div className="mb-3.5">
                  <label htmlFor="login-username" className="block text-[12.5px] font-medium text-content-muted mb-1.5">
                    Username
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-150 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="login-username"
                      type="text"
                      name="username"
                      required
                      disabled={loading}
                      autoComplete="username"
                      value={username}
                      onChange={handleUsernameChange}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? errorAlertId : undefined}
                      placeholder="Enter your username"
                      className="w-full h-[48px] pl-10 pr-3.5 bg-surface border border-border rounded-[12px] text-[13.5px] text-content placeholder:text-content-subtle transition-all duration-150 hover:border-border-strong focus:outline-none focus:border-primary-soft focus:ring-2 focus:ring-primary-soft/40 focus:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-[12.5px] font-medium text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      aria-expanded={forgotPasswordMsg}
                      aria-controls={forgotPasswordMsg ? forgotNoticeId : undefined}
                      className="text-[12px] text-blue-400 hover:text-blue-300 transition-colors duration-150 focus-visible:outline-none focus-visible:underline rounded"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-150 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={loading}
                      autoComplete="current-password"
                      value={password}
                      onChange={handlePasswordChange}
                      onKeyDown={handleKeyModifier}
                      onKeyUp={handleKeyModifier}
                      aria-invalid={Boolean(error)}
                      aria-describedby={
                        [error ? errorAlertId : null, capsLockActive ? capsLockAlertId : null]
                          .filter(Boolean)
                          .join(' ') || undefined
                      }
                      placeholder="Enter your password"
                      className="w-full h-[48px] pl-10 pr-10 bg-surface border border-border rounded-[12px] text-[13.5px] text-content placeholder:text-content-subtle transition-all duration-150 hover:border-border-strong focus:outline-none focus:border-primary-soft focus:ring-2 focus:ring-primary-soft/40 focus:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-controls="login-password"
                      aria-pressed={showPassword}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-200 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {/* Caps Lock Indicator */}
                  {capsLockActive && (
                    <div
                      id={capsLockAlertId}
                      role="status"
                      aria-live="polite"
                      className="flex items-center gap-1.5 text-[11px] text-amber-300 mt-1 pl-1 animate-fade-in"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                      <span>Caps Lock is ON</span>
                    </div>
                  )}
                </div>

                {/* Remember Device Checkbox */}
                <label htmlFor="remember-device" className="flex items-center gap-2 cursor-pointer select-none mb-4">
                  <input
                    id="remember-device"
                    type="checkbox"
                    disabled={loading}
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded border-white/[0.15] bg-white/[0.04] text-blue-600 focus:ring-blue-500/40 focus:ring-offset-0 cursor-pointer disabled:opacity-50 transition-colors"
                  />
                  <span className="text-[13px] text-content-muted">Remember this device</span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !username.trim() || !password}
                  className="w-full h-[48px] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-[14.5px] rounded-[12px] shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1220]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Signing in…</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Access Demo Credentials */}
              {IS_DEV && DEMO_ROLES.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-slate-400">Quick access</span>
                    <span className="text-[11px] text-slate-400">Demo environment</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {DEMO_ROLES.map((role) => {
                      const active = selectedRole === role.key;
                      return (
                        <button
                          key={role.key}
                          type="button"
                          disabled={loading}
                          onClick={() => handleSelectRole(role)}
                          aria-label={`Use ${role.label} credentials`}
                          aria-pressed={active}
                          className={`flex items-center justify-center gap-1.5 h-[36px] rounded-lg text-[12px] font-medium border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:opacity-50 ${
                            active
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300 shadow-sm shadow-blue-500/10'
                              : 'bg-white/[0.03] border-white/[0.06] text-slate-300 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.1]'
                          }`}
                        >
                          <role.Icon className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{role.label}</span>
                          {active && <Check className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Card footer */}
              <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
                  <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>TLS 1.3 • 256-bit encrypted</span>
                </div>
                <span className="text-[11.5px] text-slate-400 font-mono">v1.0.0</span>
              </div>
            </div>

            {/* ── Mobile Footer ── */}
            <footer className="flex lg:hidden flex-col items-center gap-1.5 mt-5 pb-4 text-[11.5px] text-slate-400 text-center">
              <div className="flex items-center gap-3.5">
                <button type="button" className="hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:underline rounded">
                  Privacy Policy
                </button>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <button type="button" className="hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:underline rounded">
                  Terms of Service
                </button>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <button type="button" className="hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:underline rounded">
                  Support
                </button>
              </div>
              <span>© 2026 StoreHub Enterprise. All rights reserved.</span>
            </footer>

          </div>
        </section>
      </main>

      {/* ── Desktop Page Footer (Centered Links) ── */}
      <footer className="relative z-10 hidden lg:flex items-center justify-between max-w-[1520px] mx-auto w-full pt-3 text-[12px] text-slate-400 shrink-0">
        <span>© 2026 StoreHub Enterprise. All rights reserved.</span>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-5">
          <button type="button" className="flex items-center gap-1.5 hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:underline rounded">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Privacy Policy</span>
          </button>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <button type="button" className="flex items-center gap-1.5 hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:underline rounded">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Terms of Service</span>
          </button>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <button type="button" className="flex items-center gap-1.5 hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:underline rounded">
            <Headphones className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Support</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Login;

