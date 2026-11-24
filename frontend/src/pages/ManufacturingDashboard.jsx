import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useManufacturing } from '../hooks/useManufacturing';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  BOMView,
  ProductionOrdersView,
  WorkCenterView,
  CapacityPlanningView,
  MRPView,
  ShopFloorDashboard,
  ProductionAnalytics,
  ManufacturingKPIGrid,
  ManufacturingExportModal
} from '../components/manufacturing';
import { RefreshCw, Download, Plus } from 'lucide-react';

const TABS = [
  'Shop Floor',
  'Production Orders',
  'BOM',
  'Work Centers',
  'Capacity Planning',
  'MRP Engine',
  'Analytics'
];

export const ManufacturingDashboard = () => {
  const {
    loading,
    boms,
    productionOrders,
    workCenters,
    capacityPlan,
    mrpData,
    kpis,
    analytics,
    filters,
    setFilters,
    isExportModalOpen,
    setIsExportModalOpen,
    handleCreateOrder,
    handleUpdateOrderStatus,
    refreshData
  } = useManufacturing();

  const [activeTab, setActiveTab] = useState('Shop Floor');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'e' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsExportModalOpen(true);
      }
      if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        refreshData();
      }
      if (e.key === 'Escape') {
        setIsExportModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsExportModalOpen, refreshData]);

  if (loading && !kpis.length) {
    return <div className="p-8 text-white text-center">Loading Manufacturing Module...</div>;
  }

  const activeProductionOrders = productionOrders.filter(o => o.status === 'In Progress');

  return (
    <div className="min-h-screen bg-[#050A16] text-white p-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Badge className="bg-primary/20 text-primary border-primary/30">Phase 4.7</Badge>
            <h1 className="text-2xl font-bold">Enterprise Manufacturing & Production Planning (MRP)</h1>
          </div>
          <p className="text-slate-400 text-sm">Monitor and control manufacturing operations, shop floor, and material requirements.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={refreshData} title="Refresh (Ctrl+R)">
            <RefreshCw size={16} className="mr-2" /> Refresh
          </Button>
          <Button variant="outline" onClick={() => setIsExportModalOpen(true)} title="Export (Ctrl+E)">
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button variant="primary">
            <Plus size={16} className="mr-2" /> New Order
          </Button>
        </div>
      </div>

      {/* Smart Filters Bar */}
      <div className="bg-[#0B1329] border border-white/10 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input 
            type="text" 
            placeholder="Search orders, items, work centers..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <select 
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="All">All Statuses</option>
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select 
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
          value={filters.workCenter}
          onChange={(e) => setFilters({...filters, workCenter: e.target.value})}
        >
          <option value="All">All Work Centers</option>
          {workCenters.map(wc => (
            <option key={wc.id} value={wc.id}>{wc.name}</option>
          ))}
        </select>
      </div>

      {/* KPI Grid */}
      <ManufacturingKPIGrid kpis={kpis} />

      {/* Cockpit Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 border-b border-white/10 pb-2 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'Shop Floor' && <ShopFloorDashboard activeOrders={activeProductionOrders} workCenters={workCenters} />}
          {activeTab === 'Production Orders' && <ProductionOrdersView data={productionOrders} onUpdateStatus={handleUpdateOrderStatus} />}
          {activeTab === 'BOM' && <BOMView data={boms} />}
          {activeTab === 'Work Centers' && <WorkCenterView data={workCenters} />}
          {activeTab === 'Capacity Planning' && <CapacityPlanningView data={capacityPlan} />}
          {activeTab === 'MRP Engine' && <MRPView data={mrpData} />}
          {activeTab === 'Analytics' && <ProductionAnalytics data={analytics} />}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <ManufacturingExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};
