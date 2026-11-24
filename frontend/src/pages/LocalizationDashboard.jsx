import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useLocalization } from '../hooks/useLocalization';
import {
  LanguageManagerView,
  CurrencyManagerView,
  ExchangeRatesView,
  CountryConfigView,
  TaxConfigView,
  LocalizationKPIGrid,
  LocalizationExportModal
} from '../components/localization';

export const LocalizationDashboard = () => {
  const {
    loading,
    languages,
    currencies,
    exchangeRates,
    countryConfigs,
    taxConfigs,
    kpis,
    activeLanguage,
    setActiveLanguage,
    activeCurrency,
    setActiveCurrency,
    isExportModalOpen,
    setIsExportModalOpen,
    refreshData
  } = useLocalization();

  const [activeTab, setActiveTab] = useState('languages');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'e' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT') {
        setIsExportModalOpen(true);
      } else if (e.key === 'r') {
        refreshData();
      } else if (e.key === 'Escape') {
        setIsExportModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsExportModalOpen, refreshData]);

  const tabs = [
    { id: 'languages', label: 'Language Manager' },
    { id: 'currencies', label: 'Currency Manager' },
    { id: 'rates', label: 'Exchange Rates' },
    { id: 'countries', label: 'Country Configurations' },
    { id: 'taxes', label: 'Tax Rules' }
  ];

  if (loading) {
    return <div className="p-8 text-white">Loading Localization Data...</div>;
  }

  return (
    <div className="min-h-screen bg-[#050A16] flex flex-col">
      <div className="p-6 pb-0 border-b border-white/10 bg-[#0B1329]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Enterprise Localization</h1>
              <Badge variant="primary">Phase 4.18</Badge>
            </div>
            <p className="text-slate-400 mt-1 text-sm">
              Manage multi-language, multi-currency, and regional compliance settings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={refreshData}>Refresh (R)</Button>
            <Button variant="primary" onClick={() => setIsExportModalOpen(true)}>Export (E)</Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <LocalizationKPIGrid kpis={kpis} />
        
        <AnimatePresence mode="wait">
          {activeTab === 'languages' && (
            <motion.div key="languages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LanguageManagerView languages={languages} activeLanguage={activeLanguage} onActivate={setActiveLanguage} />
            </motion.div>
          )}
          {activeTab === 'currencies' && (
            <motion.div key="currencies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CurrencyManagerView currencies={currencies} activeCurrency={activeCurrency} onSetDefault={setActiveCurrency} />
            </motion.div>
          )}
          {activeTab === 'rates' && (
            <motion.div key="rates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ExchangeRatesView exchangeRates={exchangeRates} />
            </motion.div>
          )}
          {activeTab === 'countries' && (
            <motion.div key="countries" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CountryConfigView countryConfigs={countryConfigs} />
            </motion.div>
          )}
          {activeTab === 'taxes' && (
            <motion.div key="taxes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TaxConfigView taxConfigs={taxConfigs} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LocalizationExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};
