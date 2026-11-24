import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, AlertTriangle, Award, AlertCircle, BarChart3, Download, RefreshCw, SlidersHorizontal, Search, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useQuality } from '../hooks/useQuality';
import {
  InspectionLotsView,
  QualityPlansView,
  CAPAView,
  QualityAuditsView,
  DefectTrackingView,
  QualityAnalytics,
  QualityKPIGrid,
  QualityExportModal
} from '../components/quality';

export const QualityDashboard = () => {
  const {
    loading,
    inspectionLots,
    qualityPlans,
    capas,
    audits,
    defects,
    kpis,
    analytics,
    filters,
    setFilters,
    isExportModalOpen,
    setIsExportModalOpen,
    handleCreateCapa,
    handleCreateInspectionLot,
    refreshData
  } = useQuality();

  const [activeTab, setActiveTab] = useState('lots');

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (['input', 'textarea', 'select'].includes(activeTag)) return;

      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsExportModalOpen(true);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        refreshData();
      } else if (e.key === 'Escape') {
        setIsExportModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refreshData, setIsExportModalOpen]);

  const tabs = [
    { id: 'lots', label: 'Inspection Lots', icon: ShieldCheck, count: inspectionLots?.length || 0 },
    { id: 'plans', label: 'Quality Plans', icon: CheckCircle2, count: qualityPlans?.length || 0 },
    { id: 'capa', label: 'CAPA Corrective Actions', icon: AlertTriangle, count: capas?.filter(c => c.status !== 'Resolved')?.length || 0 },
    { id: 'audits', label: 'Audits & ISO', icon: Award, count: audits?.length || 0 },
    { id: 'defects', label: 'Defect Taxonomy', icon: AlertCircle, count: defects?.length || 0 },
    { id: 'analytics', label: 'Quality Analytics', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-[#0B1329] relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              Enterprise ERP Phase 4.11
            </span>
            <span className="text-slate-400 text-xs font-medium">• SAP QM Equivalent</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Enterprise Quality Management System (QMS)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Inspection lots, AQL statistical acceptance sampling, 8D CAPA corrective action workflows, ISO 9001 compliance audit trails, and defect pareto analytics.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
            title="Refresh QMS Data (R)"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh <span className="hidden sm:inline font-mono text-[10px] text-slate-400 ml-1">(R)</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="text-xs shadow-lg shadow-primary/25"
            title="Export Quality Dossier (E)"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export <span className="hidden sm:inline font-mono text-[10px] text-primary-foreground/80 ml-1">(E)</span>
          </Button>
        </div>
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-primary/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Smart Filters Bar */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase text-[11px] tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            Lot Filter:
          </span>

          <select
            value={filters?.status || 'ALL'}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Inspection Statuses</option>
            <option value="Passed">Passed Only</option>
            <option value="Rejected">Rejected Only</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Quarantine">Quarantine</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search lot, product, inspector..."
            value={filters?.query || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* 12 Executive Quality KPIs */}
      <QualityKPIGrid kpis={kpis} />

      {/* Tabs Navigation */}
      <div className="border-b border-white/10">
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none">
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
                  <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'lots' && (
              <InspectionLotsView inspectionLots={inspectionLots} onCreateLot={handleCreateInspectionLot} />
            )}
            {activeTab === 'plans' && (
              <QualityPlansView qualityPlans={qualityPlans} />
            )}
            {activeTab === 'capa' && (
              <CAPAView capas={capas} onCreateCapa={handleCreateCapa} />
            )}
            {activeTab === 'audits' && (
              <QualityAuditsView audits={audits} />
            )}
            {activeTab === 'defects' && (
              <DefectTrackingView defects={defects} />
            )}
            {activeTab === 'analytics' && (
              <QualityAnalytics analytics={analytics} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Export Modal */}
      <QualityExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};

export default QualityDashboard;
