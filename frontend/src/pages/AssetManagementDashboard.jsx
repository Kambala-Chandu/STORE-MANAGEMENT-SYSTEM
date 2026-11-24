import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssets } from '../hooks/useAssets';
import { AssetRegisterView, MaintenanceOrdersView, MaintenanceCalendarView, DepreciationView, AssetAnalytics, AssetKPIGrid, AssetExportModal } from '../components/assets';

export const AssetManagementDashboard = () => {
    const { loading, assets, maintenanceOrders, calendar, depreciation, kpis, analytics, filters, setFilters, isExportModalOpen, setIsExportModalOpen, refreshData } = useAssets();
    const [activeTab, setActiveTab] = useState('Asset Register');

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'e' || e.key === 'E') setIsExportModalOpen(true);
            if (e.key === 'r' || e.key === 'R') refreshData();
            if (e.key === 'Escape') setIsExportModalOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setIsExportModalOpen, refreshData]);

    const tabs = ['Asset Register', 'Maintenance Orders', 'Calendar', 'Depreciation', 'Analytics'];

    return (
        <div className="p-6 bg-[#050A16] min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div><span className="bg-primary text-white px-2 py-1 rounded text-xs">Phase 4.10</span><h1 className="text-2xl text-white font-bold mt-2">Asset Management</h1></div>
                <div><button onClick={() => setIsExportModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded">Export</button></div>
            </div>
            <AssetKPIGrid kpis={kpis} />
            <div className="flex space-x-2 my-6">
                {tabs.map(t => <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded ${activeTab === t ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>{t}</button>)}
            </div>
            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    {activeTab === 'Asset Register' && <AssetRegisterView data={assets} />}
                    {activeTab === 'Maintenance Orders' && <MaintenanceOrdersView data={maintenanceOrders} />}
                    {activeTab === 'Calendar' && <MaintenanceCalendarView data={calendar} />}
                    {activeTab === 'Depreciation' && <DepreciationView data={depreciation} />}
                    {activeTab === 'Analytics' && <AssetAnalytics data={analytics} />}
                </motion.div>
            </AnimatePresence>
            <AssetExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        </div>
    );
};
