import { useState, useEffect, useCallback, useMemo } from 'react';
import { grcService } from '../services/grcService';

export const useGRC = () => {
    const [loading, setLoading] = useState(false);
    const [risks, setRisks] = useState([]);
    const [complianceControls, setComplianceControls] = useState([]);
    const [audits, setAudits] = useState([]);
    const [findings, setFindings] = useState([]);
    const [fraudAlerts, setFraudAlerts] = useState([]);
    const [kpis, setKpis] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [filters, setFilters] = useState({});
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [r, c, a, f, fa, k, an] = await Promise.all([
                grcService.getRisks(),
                grcService.getComplianceControls(),
                grcService.getAudits(),
                grcService.getFindings(),
                grcService.getFraudAlerts(),
                grcService.get12GRCKPIs(),
                grcService.getGRCAnalytics()
            ]);
            setRisks(r); setComplianceControls(c); setAudits(a); setFindings(f);
            setFraudAlerts(fa); setKpis(k); setAnalytics(an);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCreateRisk = useCallback(async (data) => {
        await grcService.createRisk(data);
        loadData();
    }, [loadData]);

    return {
        loading, risks, complianceControls, audits, findings, fraudAlerts, kpis, analytics,
        filters, setFilters, isExportModalOpen, setIsExportModalOpen, handleCreateRisk, refreshData: loadData
    };
};
