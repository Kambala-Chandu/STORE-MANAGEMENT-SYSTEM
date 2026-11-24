import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocuments } from '../hooks/useDocuments';
import { FolderView, DocumentListView, DocumentSearchView, VersionHistoryView, DocumentApprovalView, DocumentAnalytics, DocumentKPIGrid, DocumentExportModal } from '../components/documents';

export const DocumentsDashboard = () => {
  const { loading, kpis, isExportModalOpen, setIsExportModalOpen } = useDocuments();
  const [activeTab, setActiveTab] = useState('folders');
  
  return (
    <div className='bg-[#050A16] min-h-screen p-6 text-white'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl'>Document Management <span className='bg-primary px-2 py-1 rounded text-xs'>Phase 4.13</span></h1>
        <div>
           <button className='bg-primary px-4 py-2 rounded' onClick={() => setIsExportModalOpen(true)}>Export (E)</button>
        </div>
      </div>
      <DocumentKPIGrid kpis={kpis} />
      <div className='flex gap-4 my-4'>
        {['folders', 'list', 'search', 'approvals', 'versions', 'analytics'].map(tab => (
           <button key={tab} className={`px-4 py-2 ${activeTab === tab ? 'bg-primary shadow-primary/20' : 'text-slate-400 hover:bg-white/5'}`} onClick={() => setActiveTab(tab)}>{tab.toUpperCase()}</button>
        ))}
      </div>
      <AnimatePresence mode='wait'>
         <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {activeTab === 'folders' && <FolderView />}
            {activeTab === 'list' && <DocumentListView />}
            {activeTab === 'search' && <DocumentSearchView />}
            {activeTab === 'approvals' && <DocumentApprovalView />}
            {activeTab === 'versions' && <VersionHistoryView />}
            {activeTab === 'analytics' && <DocumentAnalytics />}
         </motion.div>
      </AnimatePresence>
      <DocumentExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};
