import { useState, useEffect, useCallback, useMemo } from 'react';
import { localizationService } from '../services/localizationService';

export const useLocalization = () => {
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [countryConfigs, setCountryConfigs] = useState([]);
  const [taxConfigs, setTaxConfigs] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [activeLanguage, setActiveLanguageState] = useState(localStorage.getItem('activeLanguage') || 'en-US');
  const [activeCurrency, setActiveCurrencyState] = useState(localStorage.getItem('activeCurrency') || 'USD');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        langs,
        currs,
        rates,
        configs,
        taxes,
        kpiData
      ] = await Promise.all([
        localizationService.getLanguages(),
        localizationService.getCurrencies(),
        localizationService.getExchangeRates(),
        localizationService.getCountryConfigs(),
        localizationService.getTaxConfigs(),
        localizationService.get12LocalizationKPIs()
      ]);
      setLanguages(langs);
      setCurrencies(currs);
      setExchangeRates(rates);
      setCountryConfigs(configs);
      setTaxConfigs(taxes);
      setKpis(kpiData);
    } catch (error) {
      console.error("Error loading localization data:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const setActiveLanguage = useCallback((code) => {
    setActiveLanguageState(code);
    localizationService.saveActiveLanguage(code);
  }, []);

  const setActiveCurrency = useCallback((code) => {
    setActiveCurrencyState(code);
    localizationService.saveActiveCurrency(code);
  }, []);

  return {
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
  };
};
