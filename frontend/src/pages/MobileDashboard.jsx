import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobile } from '../hooks/useMobile';
import {
    SyncStatusView, OfflineQueueView, PWAInstallView, MobileFeaturesList,
    MobileAnalytics, MobileKPIGrid, MobileExportModal
} from '../components/mobile';

export const MobileDashboard = () => {
    const { loading, kpis, isOnline, isExportModalOpen, setIsExportModalOpen, refreshData } = useMobile();
    const [activeTab, setActiveTab] = useState('Sync Status');
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'e' || e.key === 'E') setIsExportModalOpen(true);
            if (e.key === 'r' || e.key === 'R') refreshData();
            if (e.key === 'Escape') setIsExportModalOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setIsExportModalOpen, refreshData]);

    const renderTab = () => {
        switch(activeTab) {
            case 'Sync Status': return <SyncStatusView />;
            case 'Offline Queue': return <OfflineQueueView />;
            case 'PWA Settings': return <PWAInstallView />;
            case 'Mobile Features': return <MobileFeaturesList />;
            case 'Analytics': return <MobileAnalytics />;
            default: return null;
        }
    };

    return (
        <div className="bg-[#050A16] min-h-screen text-white p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Mobile & Offline ERP Dashboard</h1>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs">Phase 4.20</span>
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={refreshData} className="px-4 py-2 bg-[#0B1329] border border-white/10 rounded">Refresh (R)</button>
                    <button onClick={() => setIsExportModalOpen(true)} className="px-4 py-2 bg-blue-500 rounded">Export (E)</button>
                </div>
            </div>
            
            <MobileKPIGrid kpis={kpis} />
            
            <div className="flex gap-2 mb-4 overflow-x-auto border-b border-white/10 pb-2 mt-6">
                {['Sync Status', 'Offline Queue', 'PWA Settings', 'Mobile Features', 'Analytics'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded whitespace-nowrap ${activeTab === tab ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                        {tab}
                    </button>
                ))}
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    {renderTab()}
                </motion.div>
            </AnimatePresence>
            
            <MobileExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        </div>
    );
};
