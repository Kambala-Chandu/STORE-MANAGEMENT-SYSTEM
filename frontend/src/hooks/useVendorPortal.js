import { useState, useEffect, useCallback } from 'react';
import { vendorPortalService } from '../services/vendorPortalService';

export const useVendorPortal = () => {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [performance, setPerformance] = useState({});
  const [kpis, setKpis] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [filters, setFilters] = useState({});
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setVendors(await vendorPortalService.getVendors());
    setRfqs(await vendorPortalService.getRFQs());
    setContracts(await vendorPortalService.getContracts());
    setKpis(await vendorPortalService.get12VendorKPIs());
    setAnalytics(await vendorPortalService.getVendorAnalytics());
    setLoading(false);
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  const handleCreateRFQ = async (data) => { await vendorPortalService.createRFQ(data); refreshData(); };
  const handleCreateVendor = async (data) => { await vendorPortalService.createVendor(data); refreshData(); };

  return { loading, vendors, rfqs, contracts, performance, kpis, analytics, filters, setFilters, isExportModalOpen, setIsExportModalOpen, handleCreateRFQ, handleCreateVendor, refreshData };
};
