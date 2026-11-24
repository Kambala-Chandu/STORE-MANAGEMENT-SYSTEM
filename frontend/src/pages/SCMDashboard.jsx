import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSCM } from '../hooks/useSCM';
import { DemandForecastView, SupplyPlanView, ShipmentTrackingView, SupplierRiskView, InventoryOptimizationView, SCMAnalytics, SCMKPIGrid, SCMExportModal } from '../components/scm';

export const SCMDashboard = () => {
    const { loading, demandForecast, supplyPlan, shipments, supplierRisk, inventoryOptimization, kpis, analytics, filters, setFilters, isExportModalOpen, setIsExportModalOpen, refreshData } = useSCM();
    const [activeTab, setActiveTab] = useState('Demand Forecasting');

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'e' || e.key === 'E') setIsExportModalOpen(true);
            if (e.key === 'r' || e.key === 'R') refreshData();
            if (e.key === 'Escape') setIsExportModalOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setIsExportModalOpen, refreshData]);

    const tabs = ['Demand Forecasting', 'Supply Planning', 'Shipment Tracking', 'Supplier Risk', 'Inventory Optimization', 'Analytics'];

    return (
        <div className="p-6 bg-[#050A16] min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div><span className="bg-primary text-white px-2 py-1 rounded text-xs">Phase 4.9</span><h1 className="text-2xl text-white font-bold mt-2">Supply Chain Management</h1></div>
                <div><button onClick={() => setIsExportModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded">Export</button></div>
            </div>
            <SCMKPIGrid kpis={kpis} />
            <div className="flex space-x-2 my-6">
                {tabs.map(t => <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded ${activeTab === t ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>{t}</button>)}
            </div>
            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    {activeTab === 'Demand Forecasting' && <DemandForecastView data={demandForecast} />}
                    {activeTab === 'Supply Planning' && <SupplyPlanView data={supplyPlan} />}
                    {activeTab === 'Shipment Tracking' && <ShipmentTrackingView data={shipments} />}
                    {activeTab === 'Supplier Risk' && <SupplierRiskView data={supplierRisk} />}
                    {activeTab === 'Inventory Optimization' && <InventoryOptimizationView data={inventoryOptimization} />}
                    {activeTab === 'Analytics' && <SCMAnalytics data={analytics} />}
                </motion.div>
            </AnimatePresence>
            <SCMExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        </div>
    );
};
