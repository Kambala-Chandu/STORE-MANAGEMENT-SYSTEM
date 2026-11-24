import { useState, useCallback, useMemo, useEffect } from 'react';
import { scmService } from '../services/scmService';

export const useSCM = () => {
    const [loading, setLoading] = useState(false);
    const [demandForecast, setDemandForecast] = useState([]);
    const [supplyPlan, setSupplyPlan] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [supplierRisk, setSupplierRisk] = useState([]);
    const [inventoryOptimization, setInventoryOptimization] = useState([]);
    const [kpis, setKpis] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [filters, setFilters] = useState({});
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const refreshData = useCallback(async () => {
        setLoading(true);
        setDemandForecast(await scmService.getDemandForecast());
        setSupplyPlan(await scmService.getSupplyPlan());
        setShipments(await scmService.getShipments());
        setSupplierRisk(await scmService.getSupplierRisk());
        setInventoryOptimization(await scmService.getInventoryOptimization());
        setKpis(await scmService.get12SCMKPIs());
        setAnalytics(await scmService.getSCMAnalytics());
        setLoading(false);
    }, []);

    useEffect(() => { refreshData(); }, [refreshData]);

    return { loading, demandForecast, supplyPlan, shipments, supplierRisk, inventoryOptimization, kpis, analytics, filters, setFilters, isExportModalOpen, setIsExportModalOpen, refreshData };
};
