import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button } from '../components/ui';
import { useWarehouse } from '../hooks/useWarehouse';
import { 
    ReceivingView, WarehouseZonesView, BinsLocatorView, PickingView, 
    ShippingView, CycleCountView, WarehouseAnalytics, WarehouseKPIGrid, WarehouseExportModal 
} from '../components/warehouse';

export const WarehouseDashboard = () => {
    const { 
        loading, zones, bins, receipts, pickOrders, shipments, cycleCounts, kpis, analytics,
        filters, setFilters, isExportModalOpen, setIsExportModalOpen,
        handleCreateReceipt, handleCreatePickOrder, refreshData
    } = useWarehouse();

    const [activeTab, setActiveTab] = useState('Receiving');

    const tabs = ['Receiving', 'Zones & Storage', 'Bin Locator', 'Picking & Packing', 'Shipping', 'Cycle Counting', 'Analytics'];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'E' || e.key === 'e') setIsExportModalOpen(true);
            if (e.key === 'R' || e.key === 'r') refreshData();
            if (e.key === 'Escape') setIsExportModalOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setIsExportModalOpen, refreshData]);

    return (
        <div className="p-6 bg-[#050A16] min-h-screen text-white">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">Warehouse Management System</h1>
                        <Badge className="bg-primary/20 text-primary">PHASE 4.8</Badge>
                    </div>
                    <p className="text-slate-400 mt-1">Enterprise WMS and Storage Operations</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => setIsExportModalOpen(true)} className="bg-white/5 border border-white/10 px-4 py-2 rounded text-slate-300 hover:text-white">
                        Export (E)
                    </Button>
                    <Button onClick={refreshData} className="bg-primary text-white px-4 py-2 rounded">
                        {loading ? 'Refreshing...' : 'Refresh (R)'}
                    </Button>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <input 
                    type="text" 
                    placeholder="Search WMS..." 
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="bg-[#0B1329] border border-white/10 px-4 py-2 rounded text-white flex-1 max-w-md"
                />
            </div>

            <WarehouseKPIGrid data={kpis} />

            <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap ${
                            activeTab === tab 
                            ? 'bg-primary text-white shadow-md shadow-primary/20' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'Receiving' && <ReceivingView data={receipts} handleCreateReceipt={handleCreateReceipt} />}
                    {activeTab === 'Zones & Storage' && <WarehouseZonesView data={zones} />}
                    {activeTab === 'Bin Locator' && <BinsLocatorView data={bins} />}
                    {activeTab === 'Picking & Packing' && <PickingView data={pickOrders} handleCreatePickOrder={handleCreatePickOrder} />}
                    {activeTab === 'Shipping' && <ShippingView data={shipments} />}
                    {activeTab === 'Cycle Counting' && <CycleCountView data={cycleCounts} />}
                    {activeTab === 'Analytics' && <WarehouseAnalytics data={analytics} />}
                </motion.div>
            </AnimatePresence>

            <WarehouseExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        </div>
    );
};
