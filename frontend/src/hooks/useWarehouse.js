import { useState, useEffect, useCallback, useMemo } from 'react';
import { warehouseService } from '../services/warehouseService';

export const useWarehouse = () => {
    const [loading, setLoading] = useState(false);
    const [zones, setZones] = useState([]);
    const [bins, setBins] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [pickOrders, setPickOrders] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [cycleCounts, setCycleCounts] = useState([]);
    const [kpis, setKpis] = useState([]);
    const [analytics, setAnalytics] = useState({ throughput: [], utilization: [], picking_accuracy: [] });
    
    const [filters, setFilters] = useState({ search: '', zone: 'All', status: 'All' });
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const refreshData = useCallback(async () => {
        setLoading(true);
        try {
            const [z, b, r, p, s, c, k, a] = await Promise.all([
                warehouseService.getZones(),
                warehouseService.getBins(),
                warehouseService.getReceiptQueue(),
                warehouseService.getPickOrders(),
                warehouseService.getShipments(),
                warehouseService.getCycleCounts(),
                warehouseService.get12WarehouseKPIs(),
                warehouseService.getWarehouseAnalytics()
            ]);
            setZones(z); setBins(b); setReceipts(r); setPickOrders(p);
            setShipments(s); setCycleCounts(c); setKpis(k); setAnalytics(a);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleCreateReceipt = useCallback(async (data) => {
        await warehouseService.createReceipt(data);
        await refreshData();
    }, [refreshData]);

    const handleCreatePickOrder = useCallback(async (data) => {
        await warehouseService.createPickOrder(data);
        await refreshData();
    }, [refreshData]);

    return {
        loading, zones, bins, receipts, pickOrders, shipments, cycleCounts, kpis, analytics,
        filters, setFilters, isExportModalOpen, setIsExportModalOpen,
        handleCreateReceipt, handleCreatePickOrder, refreshData
    };
};
