import { useState, useCallback, useEffect } from 'react';
import { qualityService } from '../services/qualityService';

export const useQuality = () => {
  const [loading, setLoading] = useState(true);
  const [inspectionLots, setInspectionLots] = useState([]);
  const [qualityPlans, setQualityPlans] = useState([]);
  const [capas, setCapas] = useState([]);
  const [audits, setAudits] = useState([]);
  const [defects, setDefects] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'ALL' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [lotsData, plansData, capaData, auditsData, defectsData, kpiData, analyticsData] = await Promise.all([
        qualityService.getInspectionLots(),
        qualityService.getQualityPlans(),
        qualityService.getCAPAs(),
        qualityService.getAudits(),
        qualityService.getDefects(),
        qualityService.get12QualityKPIs(),
        qualityService.getQualityAnalytics()
      ]);
      setInspectionLots(lotsData);
      setQualityPlans(plansData);
      setCapas(capaData);
      setAudits(auditsData);
      setDefects(defectsData);
      setKpis(kpiData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load quality data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleCreateCapa = useCallback(async (data) => {
    try {
      const created = await qualityService.createCapa(data);
      setCapas((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Failed to create CAPA:', err);
    }
  }, []);

  const handleCreateInspectionLot = useCallback(async (data) => {
    try {
      const created = await qualityService.createInspectionLot(data);
      setInspectionLots((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Failed to create inspection lot:', err);
    }
  }, []);

  return {
    loading,
    inspectionLots,
    qualityPlans,
    capas,
    audits,
    defects,
    kpis,
    analytics,
    filters,
    setFilters,
    isExportModalOpen,
    setIsExportModalOpen,
    handleCreateCapa,
    handleCreateInspectionLot,
    refreshData
  };
};
