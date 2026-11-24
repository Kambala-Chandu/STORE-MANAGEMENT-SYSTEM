import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Layers,
  FileText,
  PieChart,
  Plus,
  Download,
  RefreshCw,
  SlidersHorizontal,
  Calendar,
  Building,
  CreditCard,
  Receipt,
  ShieldCheck,
  Scale,
  ArrowUpRight,
  ArrowDownLeft,
  BookOpen,
  Briefcase,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useFinance } from '../hooks/useFinance';
import {
  JournalEntryModal,
  ChartOfAccountsView,
  GeneralLedgerView,
  AccountsPayableDashboard,
  AccountsReceivableDashboard,
  CashManagementView,
  BudgetPlanningView,
  FinancialStatementsView,
  TaxManagementView,
  EnterpriseInvoiceView,
  ExpenseManagementView,
  CostCenterView,
  FinancialAnalyticsCharts,
  FinanceKPIGrid,
  FinanceExportModal
} from '../components/finance';

export function FinanceDashboard() {
  const {
    loading,
    accounts,
    journals,
    trialBalance,
    payables,
    receivables,
    cashAccounts,
    budgets,
    statements,
    taxes,
    invoices,
    expenses,
    costCenters,
    kpis,
    analytics,
    filters,
    setFilters,
    isJournalModalOpen,
    setIsJournalModalOpen,
    editingJournal,
    setEditingJournal,
    isExportModalOpen,
    setIsExportModalOpen,
    handleCreateJournal,
    handlePostJournal,
    handleReverseJournal,
    handlePayBill,
    handleReceivePayment,
    handleTransferFunds,
    refreshFinanceData
  } = useFinance();

  // Active module tab
  const [activeTab, setActiveTab] = useState('analytics');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing inside input, textarea, or select
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (['input', 'textarea', 'select'].includes(activeTag)) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingJournal(null);
        setIsJournalModalOpen(true);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsExportModalOpen(true);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        refreshFinanceData();
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setActiveTab('invoices');
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setActiveTab('budgets');
      } else if (e.key === 'Escape') {
        setIsJournalModalOpen(false);
        setIsExportModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refreshFinanceData, setEditingJournal, setIsExportModalOpen, setIsJournalModalOpen]);

  // Tab configurations
  const tabs = [
    { id: 'analytics', label: 'Overview & Analytics', icon: TrendingUp },
    { id: 'accounts', label: 'Chart of Accounts', icon: BookOpen, count: accounts.length },
    { id: 'ledger', label: 'General Ledger & Vouchers', icon: Scale, count: journals.length },
    { id: 'payables', label: 'Accounts Payable', icon: ArrowDownLeft, count: payables.length },
    { id: 'receivables', label: 'Accounts Receivable', icon: ArrowUpRight, count: receivables.length },
    { id: 'statements', label: 'Financial Statements', icon: FileSpreadsheet },
    { id: 'cash', label: 'Cash & Treasury', icon: Building, count: cashAccounts.length },
    { id: 'budgets', label: 'Budget Planning', icon: Layers, count: budgets.length },
    { id: 'taxes', label: 'Tax Management', icon: ShieldCheck },
    { id: 'invoices', label: 'Invoice Repository', icon: FileText, count: invoices.length },
    { id: 'expenses', label: 'Expense Claims', icon: CreditCard, count: expenses.length },
    { id: 'cost_centers', label: 'Cost Centers', icon: Briefcase, count: costCenters.length }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-[#0B1329] relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              Enterprise ERP Phase 4.4
            </span>
            <span className="text-slate-400 text-xs font-medium">• GAAP & IFRS Compliant</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary" />
            Enterprise Finance & General Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Double-entry accounting, automated journal vouchers, real-time AP/AR aging, treasury cash management, and institutional financial reporting.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2">
          {/* Action Buttons with shortcuts */}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshFinanceData}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
            title="Refresh Ledger (Press R)"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh <span className="hidden sm:inline font-mono text-[10px] text-slate-400 ml-1">(R)</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
            title="Export Financials (Press E)"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export <span className="hidden sm:inline font-mono text-[10px] text-slate-400 ml-1">(E)</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingJournal(null);
              setIsJournalModalOpen(true);
            }}
            className="text-xs shadow-lg shadow-primary/25"
            title="New Journal Entry (Press N)"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Journal Entry <span className="hidden sm:inline font-mono text-[10px] text-primary-foreground/80 ml-1">(N)</span>
          </Button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-primary/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Smart Filters Bar */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase text-[11px] tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            Smart Ledger Filters:
          </span>

          {/* Date Range */}
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">Current Month (Oct 2026)</option>
            <option value="Q3-2026">Q3 2026</option>
            <option value="FY-2026">Full Fiscal Year 2026</option>
          </select>

          {/* Branch Filter */}
          <select
            value={filters.branch}
            onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Branches & Stores</option>
            <option value="Flagship">Main Flagship Retail</option>
            <option value="East">East Distribution Center</option>
            <option value="West">West Coast Warehouse</option>
          </select>

          {/* Cost Center Filter */}
          <select
            value={filters.costCenter}
            onChange={(e) => setFilters(prev => ({ ...prev, costCenter: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Cost Centers</option>
            <option value="Retail">Retail Store Operations</option>
            <option value="Logistics">Central Logistics Hub</option>
            <option value="IT">IT & Cloud Infrastructure</option>
            <option value="B2B">Commercial Sales Unit</option>
          </select>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">Ledger Balanced</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="font-mono text-[11px] text-slate-300">Currency: <strong>USD ($)</strong></span>
        </div>
      </div>

      {/* 12 Executive Finance KPI Cards */}
      <FinanceKPIGrid kpis={kpis} />

      {/* Enterprise Tabs Cockpit Navigation */}
      <div className="border-b border-white/10">
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none" aria-label="Finance Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels with Framer Motion Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'analytics' && (
            <FinancialAnalyticsCharts analyticsData={analytics} />
          )}

          {activeTab === 'accounts' && (
            <ChartOfAccountsView
              accounts={accounts}
              onAddAccount={() => {
                refreshFinanceData();
              }}
            />
          )}

          {activeTab === 'ledger' && (
            <GeneralLedgerView
              trialBalance={trialBalance}
              journals={journals}
              onNewEntry={() => {
                setEditingJournal(null);
                setIsJournalModalOpen(true);
              }}
              onPostEntry={handlePostJournal}
              onReverseEntry={handleReverseJournal}
              onEditEntry={(entry) => {
                setEditingJournal(entry);
                setIsJournalModalOpen(true);
              }}
            />
          )}

          {activeTab === 'payables' && (
            <AccountsPayableDashboard
              payables={payables}
              onPayBill={handlePayBill}
            />
          )}

          {activeTab === 'receivables' && (
            <AccountsReceivableDashboard
              receivables={receivables}
              onReceivePayment={handleReceivePayment}
            />
          )}

          {activeTab === 'statements' && (
            <FinancialStatementsView
              statements={statements}
            />
          )}

          {activeTab === 'cash' && (
            <CashManagementView
              cashAccounts={cashAccounts}
              onTransferFunds={handleTransferFunds}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetPlanningView
              budgets={budgets}
              onRefresh={refreshFinanceData}
            />
          )}

          {activeTab === 'taxes' && (
            <TaxManagementView
              taxes={taxes}
            />
          )}

          {activeTab === 'invoices' && (
            <EnterpriseInvoiceView
              invoices={invoices}
              onRefresh={refreshFinanceData}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpenseManagementView
              expenses={expenses}
              onRefresh={refreshFinanceData}
            />
          )}

          {activeTab === 'cost_centers' && (
            <CostCenterView
              costCenters={costCenters}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Journal Entry Modal */}
      <JournalEntryModal
        isOpen={isJournalModalOpen}
        onClose={() => {
          setIsJournalModalOpen(false);
          setEditingJournal(null);
        }}
        onSave={handleCreateJournal}
        initialData={editingJournal}
        availableAccounts={accounts}
      />

      {/* Export Modal */}
      <FinanceExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

export default FinanceDashboard;
