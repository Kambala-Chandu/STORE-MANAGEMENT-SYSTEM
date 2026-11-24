import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../api/client';
import {
  computeAIBusinessSummary,
  computeInventoryForecasting,
  computeSalesForecast,
  computeCustomerIntelligence,
  computeSupplierIntelligence,
  computeProductIntelligence,
  computeAIRecommendations,
  computeForecastChartDatasets,
  computeSmartAlerts,
  computeAIKPICards,
} from '../services/aiAnalyticsEngine';

export function useAIAnalytics() {
  const [data, setData] = useState({
    stats: null,
    sales: [],
    products: [],
    customers: [],
    suppliers: [],
    purchases: [],
    profitLoss: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAIDatasets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, salesRes, productsRes, customersRes, suppliersRes, purchasesRes, plRes] =
        await Promise.allSettled([
          apiClient.get('/dashboard/stats'),
          apiClient.get('/sales/?limit=100'),
          apiClient.get('/products/?limit=100'),
          apiClient.get('/customers/?limit=100'),
          apiClient.get('/suppliers/?limit=100'),
          apiClient.get('/purchases/?limit=100'),
          apiClient.get('/reports/profit-loss'),
        ]);

      const stats = statsRes.status === 'fulfilled' ? statsRes.value.data : null;
      const sales = salesRes.status === 'fulfilled' && Array.isArray(salesRes.value.data) ? salesRes.value.data : [];
      const products = productsRes.status === 'fulfilled' && Array.isArray(productsRes.value.data) ? productsRes.value.data : [];
      const customers = customersRes.status === 'fulfilled' && Array.isArray(customersRes.value.data) ? customersRes.value.data : [];
      const suppliers = suppliersRes.status === 'fulfilled' && Array.isArray(suppliersRes.value.data) ? suppliersRes.value.data : [];
      const purchases = purchasesRes.status === 'fulfilled' && Array.isArray(purchasesRes.value.data) ? purchasesRes.value.data : [];
      const profitLoss = plRes.status === 'fulfilled' ? plRes.value.data : null;

      setData({ stats, sales, products, customers, suppliers, purchases, profitLoss });
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching AI analytics datasets:', err);
      setError(err?.response?.data?.detail || 'Failed to compute predictive AI analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAIDatasets();
  }, [fetchAIDatasets]);

  // 1. Executive AI Business Summary
  const aiSummary = useMemo(() => {
    return computeAIBusinessSummary(data);
  }, [data]);

  // 2. Smart Inventory Forecasting
  const inventoryForecast = useMemo(() => {
    return computeInventoryForecasting(data.products, data.sales, data.purchases);
  }, [data.products, data.sales, data.purchases]);

  // 3. Smart Sales Forecast
  const salesForecast = useMemo(() => {
    return computeSalesForecast(data.stats, data.sales);
  }, [data.stats, data.sales]);

  // 4. Customer Intelligence
  const customerIntel = useMemo(() => {
    return computeCustomerIntelligence(data.customers, data.sales);
  }, [data.customers, data.sales]);

  // 5. Supplier Intelligence
  const supplierIntel = useMemo(() => {
    return computeSupplierIntelligence(data.suppliers, data.purchases);
  }, [data.suppliers, data.purchases]);

  // 6. Product Intelligence
  const productIntel = useMemo(() => {
    return computeProductIntelligence(data.products, data.sales);
  }, [data.products, data.sales]);

  // 7. AI Recommendation Engine
  const recommendations = useMemo(() => {
    return computeAIRecommendations({
      inventoryForecast,
      productIntel,
      customerIntel,
      supplierIntel,
    });
  }, [inventoryForecast, productIntel, customerIntel, supplierIntel]);

  // 8. Forecast Charts Datasets
  const chartDatasets = useMemo(() => {
    return computeForecastChartDatasets({
      stats: data.stats,
      salesForecast,
      inventoryForecast,
      customerIntel,
      supplierIntel,
      profitLoss: data.profitLoss,
    });
  }, [data.stats, salesForecast, inventoryForecast, customerIntel, supplierIntel, data.profitLoss]);

  // 9. Smart Alert Center
  const alerts = useMemo(() => {
    return computeSmartAlerts({
      products: data.products,
      sales: data.sales,
      purchases: data.purchases,
      customers: data.customers,
      profitLoss: data.profitLoss,
      stats: data.stats,
    });
  }, [data.products, data.sales, data.purchases, data.customers, data.profitLoss, data.stats]);

  // 10. AI KPI Cards
  const aiKpis = useMemo(() => {
    return computeAIKPICards({
      stats: data.stats,
      salesForecast,
      customerIntel,
      supplierIntel,
      profitLoss: data.profitLoss,
      products: data.products,
    });
  }, [data.stats, salesForecast, customerIntel, supplierIntel, data.profitLoss, data.products]);

  return {
    loading,
    error,
    lastUpdated,
    refresh: fetchAIDatasets,
    rawData: data,
    aiSummary,
    inventoryForecast,
    salesForecast,
    customerIntel,
    supplierIntel,
    productIntel,
    recommendations,
    chartDatasets,
    alerts,
    aiKpis,
  };
}

export default useAIAnalytics;

