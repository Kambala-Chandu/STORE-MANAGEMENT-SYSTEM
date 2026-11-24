import { useState, useEffect, useCallback, useMemo } from 'react';
import { multiCompanyService } from '../services/multiCompanyService';

export const useMultiCompany = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [activeCompany, setActiveCompanyState] = useState(localStorage.getItem('activeCompany') || '1');
  const [branches, setBranches] = useState([]);
  const [intercompanyTransactions, setIntercompanyTransactions] = useState([]);
  const [consolidatedFinancials, setConsolidatedFinancials] = useState({ income_statement: [], balance_sheet: [] });
  const [branchPerformance, setBranchPerformance] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({ company: 'All', period: 'YTD' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        comps,
        intercomp,
        consol,
        perf,
        kpiData,
        analyticsData
      ] = await Promise.all([
        multiCompanyService.getCompanies(),
        multiCompanyService.getIntercompanyTransactions(),
        multiCompanyService.getConsolidatedFinancials(),
        multiCompanyService.getBranchPerformance(),
        multiCompanyService.get12MultiCompanyKPIs(),
        multiCompanyService.getMultiCompanyAnalytics()
      ]);
      setCompanies(comps);
      setIntercompanyTransactions(intercomp);
      setConsolidatedFinancials(consol);
      setBranchPerformance(perf);
      setKpis(kpiData);
      setAnalytics(analyticsData);
      setBranches(perf); // reusing performance data for branches array
    } catch (error) {
      console.error("Error loading multi-company data:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSwitchCompany = useCallback((companyId) => {
    setActiveCompanyState(companyId);
    multiCompanyService.switchActiveCompany(companyId);
  }, []);

  const setActiveCompany = handleSwitchCompany;

  return {
    loading,
    companies,
    activeCompany,
    setActiveCompany,
    handleSwitchCompany,
    branches,
    intercompanyTransactions,
    consolidatedFinancials,
    branchPerformance,
    kpis,
    analytics,
    filters,
    setFilters,
    isExportModalOpen,
    setIsExportModalOpen,
    refreshData
  };
};
