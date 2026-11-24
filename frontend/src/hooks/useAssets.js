import { useState, useCallback, useEffect } from 'react';
import { assetService } from '../services/assetService';

export const useAssets = () => {
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState([]);
    const [maintenanceOrders, setMaintenanceOrders] = useState([]);
    const [calendar, setCalendar] = useState([]);
    const [depreciation, setDepreciation] = useState([]);
    const [kpis, setKpis] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [filters, setFilters] = useState({});
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const refreshData = useCallback(async () => {
        setLoading(true);
        setAssets(await assetService.getAssets());
        setMaintenanceOrders(await assetService.getMaintenanceOrders());
        setCalendar(await assetService.getCalendar());
        setDepreciation(await assetService.getDepreciation());
        setKpis(await assetService.get12AssetKPIs());
        setAnalytics(await assetService.getAssetAnalytics());
        setLoading(false);
    }, []);

    useEffect(() => { refreshData(); }, [refreshData]);

    const handleCreateAsset = useCallback(async (data) => {}, []);
    const handleCreateMaintenanceOrder = useCallback(async (data) => {}, []);

    return { loading, assets, maintenanceOrders, calendar, depreciation, kpis, analytics, filters, setFilters, isExportModalOpen, setIsExportModalOpen, handleCreateAsset, handleCreateMaintenanceOrder, refreshData };
};
