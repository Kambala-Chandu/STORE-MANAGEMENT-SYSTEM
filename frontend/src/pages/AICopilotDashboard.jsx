import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAICopilot } from '../hooks/useAICopilot';
import { AIChatView, InsightsCenterView, RecommendationsView, AnomalyDetectionView, ForecastView, AIKPIGrid, AIExportModal } from '../components/ai_copilot';

export const AICopilotDashboard = () => {
  const { loading, chatMessages, insights, recommendations, anomalies, forecasts, kpis, inputMessage, setInputMessage, isChatLoading, handleSendMessage, isExportModalOpen, setIsExportModalOpen, refreshData } = useAICopilot();
  const [activeTab, setActiveTab] = useState('AI Enterprise Chat');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'E' || e.key === 'e') setIsExportModalOpen(true);
      if (e.key === 'R' || e.key === 'r') refreshData();
      if (e.key === 'Escape') setIsExportModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsExportModalOpen, refreshData]);

  const tabs = ['AI Enterprise Chat', 'Insights Center', 'Recommendations', 'Anomaly Detection', 'Forecasts'];

  return (
    <div className="p-6 bg-[#050A16] min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Enterprise AI Copilot</h1>
          <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">PHASE 4.16</span>
        </div>
        <div className="flex gap-2">
          <button onClick={refreshData} className="px-4 py-2 bg-white/5 rounded hover:bg-white/10">Refresh (R)</button>
          <button onClick={() => setIsExportModalOpen(true)} className="px-4 py-2 bg-primary rounded">Export (E)</button>
        </div>
      </div>

      <AIKPIGrid kpis={kpis} />

      <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded transition-colors ${activeTab === tab ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'AI Enterprise Chat' && <AIChatView messages={chatMessages} inputMessage={inputMessage} setInputMessage={setInputMessage} onSend={handleSendMessage} loading={isChatLoading} />}
            {activeTab === 'Insights Center' && <InsightsCenterView insights={insights} />}
            {activeTab === 'Recommendations' && <RecommendationsView recommendations={recommendations} />}
            {activeTab === 'Anomaly Detection' && <AnomalyDetectionView anomalies={anomalies} />}
            {activeTab === 'Forecasts' && <ForecastView forecasts={forecasts} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <AIExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};
