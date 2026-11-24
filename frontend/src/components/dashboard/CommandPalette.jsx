import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ArrowRight, CornerDownLeft, Clock, Sparkles,
  Package, Users, Truck, ShoppingCart, ShoppingBag, Boxes,
  BarChart3, UserCog, Settings, ShieldCheck, ChevronRight,
  Command, Layers, HelpCircle
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

const RECENT_COMMANDS_KEY = 'storehub_recent_commands_v1';

export const CommandPalette = () => {
  const navigate = useNavigate();
  const { commandPaletteOpen, setCommandPaletteOpen, searchUniversal } = usePlatform();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Recent commands from localStorage
  const [recentCommands, setRecentCommands] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_COMMANDS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Focus input whenever palette opens
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  // Execute universal search
  const searchResult = useMemo(() => {
    return searchUniversal(query);
  }, [query, searchUniversal]);

  // Filtered and flattened results for keyboard navigation
  const flatResults = useMemo(() => {
    let list = searchResult.results || [];
    if (activeCategoryFilter !== 'All') {
      list = list.filter((item) => item.category === activeCategoryFilter);
    }
    return list;
  }, [searchResult, activeCategoryFilter]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategoryFilter]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Save to recent commands
  const recordRecentCommand = (item) => {
    const next = [
      { id: item.id, title: item.title, subtitle: item.subtitle, category: item.category, url: item.url },
      ...recentCommands.filter((r) => r.id !== item.id)
    ].slice(0, 6);
    setRecentCommands(next);
    try {
      localStorage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  // Execute selected item
  const handleSelect = (item) => {
    if (!item) return;
    recordRecentCommand(item);
    setCommandPaletteOpen(false);

    if (item.action) {
      item.action();
    } else if (item.url) {
      navigate(item.url);
    }
  };

  // Keyboard navigation listener
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (flatResults.length > 0 ? (prev + 1) % flatResults.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (flatResults.length > 0 ? (prev - 1 + flatResults.length) % flatResults.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatResults[selectedIndex]) {
        handleSelect(flatResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setCommandPaletteOpen(false);
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[120] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md"
        onClick={() => setCommandPaletteOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label="Universal Command Palette"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -12 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.12] bg-[#070d1e] shadow-2xl shadow-blue-950/40 flex flex-col max-h-[82vh]"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header Search Input */}
          <div className="relative flex items-center border-b border-white/[0.08] px-4 py-3 bg-[#0b1329]/80">
            <Search className="w-5 h-5 text-blue-400 shrink-0 mr-3" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search products, orders, customers, vendors..."
              className="w-full bg-transparent text-body font-medium text-white placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-white rounded-md mr-2"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white/[0.04] border border-white/[0.1] rounded">
              ESC
            </kbd>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.06] bg-[#070d1e] overflow-x-auto ds-scroll text-caption">
            {['All', 'Quick Actions', 'Settings & Navigation', 'Products', 'Customers', 'Suppliers', 'Sales'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap text-xs ${
                  activeCategoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div ref={listRef} className="overflow-y-auto ds-scroll p-2 space-y-1 flex-1">
            {flatResults.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                <p className="text-body font-semibold text-slate-300">No results found</p>
                <p className="text-caption text-slate-500">
                  No records match "{query}". Try searching by SKU, invoice number, customer name, or action keyword.
                </p>
              </div>
            ) : (
              flatResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const IconComponent = item.icon || Sparkles;

                return (
                  <div
                    key={item.id}
                    data-active={isSelected}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                        : 'text-slate-300 hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-blue-500/30 border-blue-400/50 text-blue-300'
                            : 'bg-white/[0.04] border-white/[0.08] text-slate-400'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase rounded bg-white/[0.06] border border-white/[0.1] text-slate-300">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider hidden sm:inline">
                        {item.category}
                      </span>
                      {isSelected && (
                        <span className="p-1 rounded bg-blue-500/20 text-blue-300">
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Recent Searches Section (When no active query) */}
            {!query && recentCommands.length > 0 && (
              <div className="pt-3 mt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Recently Accessed
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setRecentCommands([]);
                      localStorage.removeItem(RECENT_COMMANDS_KEY);
                    }}
                    className="text-[10px] hover:text-white lowercase"
                  >
                    clear
                  </button>
                </div>
                <div className="space-y-0.5 mt-1">
                  {recentCommands.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => handleSelect(rec)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-white/[0.04] text-xs transition-colors"
                    >
                      <span className="truncate">{rec.title}</span>
                      <span className="text-slate-500 text-[10px] uppercase font-mono">{rec.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Shortcuts Guide */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.08] bg-[#0b1329] text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] font-mono text-[10px]">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] font-mono text-[10px]">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] font-mono text-[10px]">↵</kbd>
                Execute
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] font-mono text-[10px]">ESC</kbd>
                Dismiss
              </span>
            </div>
            <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest hidden sm:inline">
              StoreHub Platform Engine
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;

