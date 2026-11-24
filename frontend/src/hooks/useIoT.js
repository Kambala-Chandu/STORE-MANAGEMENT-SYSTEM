import { useState, useEffect, useCallback } from 'react';
import { iotService } from '../services/iotService';
import { Toast } from '../components/ui/Toast';

export const useIoT = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [sensorReadings, setSensorReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [deviceHealth, setDeviceHealth] = useState(null);
  const [kpis, setKpis] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({ query: '' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [d, s, a, dh, k, an] = await Promise.all([
        iotService.getDevices(),
        iotService.getSensorReadings(),
        iotService.getAlerts(),
        iotService.getDeviceHealth(),
        iotService.get12IoTKPIs(),
        iotService.getIoTAnalytics()
      ]);
      setDevices(d); setSensorReadings(s); setAlerts(a); setDeviceHealth(dh); setKpis(k); setAnalytics(an);
    } catch (e) {
      console.error(e);
      Toast?.error('Failed to load IoT data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAcknowledgeAlert = useCallback(async (id) => {
    await iotService.acknowledgeAlert(id);
    setAlerts(alerts.map(a => a.alert_id === id ? { ...a, acknowledged: true } : a));
    Toast?.success('Alert acknowledged');
  }, [alerts]);

  const refreshData = fetchData;

  return { loading, devices, sensorReadings, alerts, deviceHealth, kpis, analytics, filters, setFilters, isExportModalOpen, setIsExportModalOpen, handleAcknowledgeAlert, refreshData };
};
