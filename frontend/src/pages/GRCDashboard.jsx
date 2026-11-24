import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGRC } from '../hooks/useGRC';
import {
    RiskRegisterView, RiskMatrixView, ComplianceControlsView, AuditManagementView,
    AuditFindingsView, FraudDetectionView, GRCAnalytics, GRCKPIGrid, GRCExportModal
} from '../components/grc';

export const GRCDashboard = () => {
    const { loading, risks, kpis, isExportModalOpen, setIsExportModalOpen, refreshData } = useGRC();
    const [activeTab, setActiveTab] = useState('Risk Register');
    
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
            case 'Risk Register': return <RiskRegisterView risks={risks} />;
            case 'Risk Matrix': return <RiskMatrixView />;
            case 'Compliance Controls': return <ComplianceControlsView />;
            case 'Audit Management': return <AuditManagementView />;
            case 'Audit Findings': return <AuditFindingsView />;
            case 'Fraud Detection': return <FraudDetectionView />;
            case 'Analytics': return <GRCAnalytics />;
            default: return null;
        }
    };

    return (
        <div className="bg-[#050A16] min-h-screen text-white p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">GRC Dashboard</h1>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs">Phase 4.19</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={refreshData} className="px-4 py-2 bg-[#0B1329] border border-white/10 rounded">Refresh (R)</button>
                    <button onClick={() => setIsExportModalOpen(true)} className="px-4 py-2 bg-blue-500 rounded">Export (E)</button>
                </div>
            </div>
            
            <GRCKPIGrid kpis={kpis} />
            
            <div className="flex gap-2 mb-4 overflow-x-auto border-b border-white/10 pb-2 mt-6">
                {['Risk Register', 'Risk Matrix', 'Compliance Controls', 'Audit Management', 'Audit Findings', 'Fraud Detection', 'Analytics'].map(tab => (
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
            
            <GRCExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        </div>
    );
};
