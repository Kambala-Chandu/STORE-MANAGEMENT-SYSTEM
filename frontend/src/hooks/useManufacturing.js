import { useState, useEffect, useCallback, useMemo } from 'react';
import { manufacturingService } from '../services/manufacturingService';

export const useManufacturing = () => {
  const [loading, setLoading] = useState(true);
  const [boms, setBoms] = useState([]);
  const [productionOrders, setProductionOrders] = useState([]);
  const [workCenters, setWorkCenters] = useState([]);
  const [capacityPlan, setCapacityPlan] = useState([]);
  const [mrpData, setMrpData] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  const [filters, setFilters] = useState({ status: 'All', workCenter: 'All', search: '' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bData, pData, wData, cData, mData, kData, aData] = await Promise.all([
        manufacturingService.getBOMs(),
        manufacturingService.getProductionOrders(),
        manufacturingService.getWorkCenters(),
        manufacturingService.getCapacityPlan(),
        manufacturingService.getMRPRun(),
        manufacturingService.get12ManufacturingKPIs(),
        manufacturingService.getManufacturingAnalytics()
      ]);
      
      setBoms(bData);
      setProductionOrders(pData);
      setWorkCenters(wData);
      setCapacityPlan(cData);
      setMrpData(mData);
      setKpis(kData);
      setAnalytics(aData);
    } catch (error) {
      console.error("Failed to fetch manufacturing data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateOrder = useCallback(async (orderData) => {
    try {
      await manufacturingService.createProductionOrder(orderData);
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [fetchData]);

  const handleUpdateOrderStatus = useCallback(async (id, status) => {
    try {
      await manufacturingService.updateOrderStatus(id, status);
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [fetchData]);

  const refreshData = fetchData;

  return {
    loading,
    boms,
    productionOrders,
    workCenters,
    capacityPlan,
    mrpData,
    kpis,
    analytics,
    filters,
    setFilters,
    isExportModalOpen,
    setIsExportModalOpen,
    handleCreateOrder,
    handleUpdateOrderStatus,
    refreshData
  };
};
