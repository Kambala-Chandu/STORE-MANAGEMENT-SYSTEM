import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'storehub.theme';
const TRANSITION_CLASS = 'theme-transition';
const TRANSITION_MS = 280;

/**
 * Enterprise Theme System
 * ───────────────────────
 * • Supports "light" | "dark" | "system"
 * • Persists to localStorage under `storehub.theme`
 * • Responds to OS‑level `prefers-color-scheme` changes in real time
 * • Toggles the `light` class on <html> (index.css variables flip automatically)
 * • Adds a brief transition class during switch for smooth surface animation
 */
const ThemeContext = createContext(undefined);

const getSystemTheme = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const resolveTheme = (preference) =>
  preference === 'system' ? getSystemTheme() : preference;

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    return 'dark'; // default — existing users keep dark
  });

  const resolved = resolveTheme(preference);

  // Apply / remove the `light` class on <html>
  const applyTheme = useCallback((theme) => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, []);

  // Animate the transition
  const animateTransition = useCallback(() => {
    const root = document.documentElement;
    root.classList.add(TRANSITION_CLASS);
    window.setTimeout(() => root.classList.remove(TRANSITION_CLASS), TRANSITION_MS);
  }, []);

  // Apply on mount and whenever the resolved theme changes
  useEffect(() => {
    applyTheme(resolved);
  }, [resolved, applyTheme]);

  // Persist to localStorage whenever user changes preference
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, preference);
  }, [preference]);

  // Listen for OS‑level color scheme changes when in "system" mode
  useEffect(() => {
    if (preference !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme(getSystemTheme());
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [preference, applyTheme]);

  const setTheme = useCallback(
    (next) => {
      animateTransition();
      setPreference(next);
    },
    [animateTransition]
  );

  const toggleTheme = useCallback(() => {
    animateTransition();
    setPreference((prev) => {
      const current = resolveTheme(prev);
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [animateTransition]);

  const value = useMemo(
    () => ({
      /** User preference: 'dark' | 'light' | 'system' */
      preference,
      /** Actually rendered theme: 'dark' | 'light' */
      theme: resolved,
      /** Set preference explicitly */
      setTheme,
      /** Quick dark ↔ light toggle */
      toggleTheme,
      /** Convenience booleans */
      isDark: resolved === 'dark',
      isLight: resolved === 'light',
    }),
    [preference, resolved, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access the current theme and controls.
 * @returns {{ preference: string, theme: string, setTheme: Function, toggleTheme: Function, isDark: boolean, isLight: boolean }}
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

