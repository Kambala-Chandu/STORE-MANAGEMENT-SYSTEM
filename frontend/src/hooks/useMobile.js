import { useState, useEffect, useCallback } from 'react';
import { mobileService } from '../services/mobileService';

export const useMobile = () => {
    const [loading, setLoading] = useState(false);
    const [syncStatus, setSyncStatus] = useState(null);
    const [offlineQueue, setOfflineQueue] = useState([]);
    const [pwaStatus, setPwaStatus] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [kpis, setKpis] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [s, o, p, k, a] = await Promise.all([
                mobileService.getSyncStatus(),
                mobileService.getOfflineQueue(),
                mobileService.getPWAStatus(),
                mobileService.get12MobileKPIs(),
                mobileService.getMobileAnalytics()
            ]);
            setSyncStatus(s); setOfflineQueue(o); setPwaStatus(p); setKpis(k); setAnalytics(a);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        }
    }, [loadData]);

    const handleSyncNow = useCallback(async () => {
        setIsSyncing(true);
        await mobileService.syncNow();
        setIsSyncing(false);
        loadData();
    }, [loadData]);

    const handleClearQueue = useCallback(async () => {
        loadData();
    }, [loadData]);

    return {
        loading, syncStatus, offlineQueue, pwaStatus, isOnline, kpis, analytics,
        isSyncing, handleSyncNow, handleClearQueue, isExportModalOpen, setIsExportModalOpen, refreshData: loadData
    };
};
