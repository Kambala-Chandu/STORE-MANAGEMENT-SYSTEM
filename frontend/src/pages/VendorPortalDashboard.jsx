import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVendorPortal } from '../hooks/useVendorPortal';
import { VendorDirectoryView, RFQView, ContractManagementView, VendorPerformanceView, SpendAnalyticsView, VendorKPIGrid, VendorExportModal } from '../components/vendor_portal';

export const VendorPortalDashboard = () => {
  const { loading, kpis, isExportModalOpen, setIsExportModalOpen } = useVendorPortal();
  const [activeTab, setActiveTab] = useState('directory');
  
  return (
    <div className='bg-[#050A16] min-h-screen p-6 text-white'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl'>Vendor Portal & Procurement <span className='bg-primary px-2 py-1 rounded text-xs'>Phase 4.14</span></h1>
        <div>
           <button className='bg-primary px-4 py-2 rounded' onClick={() => setIsExportModalOpen(true)}>Export</button>
        </div>
      </div>
      <VendorKPIGrid kpis={kpis} />
      <div className='flex gap-4 my-4'>
        {['directory', 'rfq', 'contracts', 'performance', 'analytics'].map(tab => (
           <button key={tab} className={`px-4 py-2 ${activeTab === tab ? 'bg-primary shadow-primary/20' : 'text-slate-400 hover:bg-white/5'}`} onClick={() => setActiveTab(tab)}>{tab.toUpperCase()}</button>
        ))}
      </div>
      <AnimatePresence mode='wait'>
         <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {activeTab === 'directory' && <VendorDirectoryView />}
            {activeTab === 'rfq' && <RFQView />}
            {activeTab === 'contracts' && <ContractManagementView />}
            {activeTab === 'performance' && <VendorPerformanceView />}
            {activeTab === 'analytics' && <SpendAnalyticsView />}
         </motion.div>
      </AnimatePresence>
      <VendorExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};
