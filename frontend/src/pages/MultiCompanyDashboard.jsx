import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useMultiCompany } from '../hooks/useMultiCompany';
import {
  CompanyOverview,
  BranchDashboardView,
  IntercompanyTransactionsView,
  ConsolidatedFinancialsView,
  MultiCompanyAnalytics,
  MultiCompanyKPIGrid,
  MultiCompanyExportModal
} from '../components/multi_company';

export const MultiCompanyDashboard = () => {
  const {
    loading,
    companies,
    activeCompany,
    handleSwitchCompany,
    branches,
    intercompanyTransactions,
    consolidatedFinancials,
    kpis,
    analytics,
    filters,
    setFilters,
    isExportModalOpen,
    setIsExportModalOpen,
    refreshData
  } = useMultiCompany();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'e' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT') {
        setIsExportModalOpen(true);
      } else if (e.key === 'r') {
        refreshData();
      } else if (e.key === 'Escape') {
        setIsExportModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsExportModalOpen, refreshData]);

  const tabs = [
    { id: 'overview', label: 'Company Overview' },
    { id: 'branches', label: 'Branch Dashboard' },
    { id: 'intercompany', label: 'Intercompany Transactions' },
    { id: 'financials', label: 'Consolidated Financials' },
    { id: 'analytics', label: 'Analytics' }
  ];

  if (loading) {
    return <div className="p-8 text-white">Loading Multi-Company Data...</div>;
  }

  return (
    <div className="min-h-screen bg-[#050A16] flex flex-col">
      {/* Header Banner */}
      <div className="p-6 pb-0 border-b border-white/10 bg-[#0B1329]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Multi-Company ERP</h1>
              <Badge variant="primary">Phase 4.17</Badge>
            </div>
            <p className="text-slate-400 mt-1 text-sm">
              Manage global company structures, branches, and consolidated financials.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={refreshData}>Refresh (R)</Button>
            <Button variant="primary" onClick={() => setIsExportModalOpen(true)}>Export (E)</Button>
          </div>
        </div>
        
        {/* Smart Filters Bar */}
        <div className="flex items-center gap-4 mb-4">
          <select 
            className="bg-[#050A16] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
            value={filters.company}
            onChange={(e) => setFilters(f => ({ ...f, company: e.target.value }))}
          >
            <option value="All">All Companies</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select 
            className="bg-[#050A16] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
            value={filters.period}
            onChange={(e) => setFilters(f => ({ ...f, period: e.target.value }))}
          >
            <option value="YTD">YTD</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <MultiCompanyKPIGrid kpis={kpis} />
        
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CompanyOverview companies={companies} activeCompany={activeCompany} onSwitchCompany={handleSwitchCompany} />
            </motion.div>
          )}
          {activeTab === 'branches' && (
            <motion.div key="branches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BranchDashboardView branches={branches} />
            </motion.div>
          )}
          {activeTab === 'intercompany' && (
            <motion.div key="intercompany" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IntercompanyTransactionsView transactions={intercompanyTransactions} />
            </motion.div>
          )}
          {activeTab === 'financials' && (
            <motion.div key="financials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ConsolidatedFinancialsView financials={consolidatedFinancials} />
            </motion.div>
          )}
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MultiCompanyAnalytics data={analytics} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MultiCompanyExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};
