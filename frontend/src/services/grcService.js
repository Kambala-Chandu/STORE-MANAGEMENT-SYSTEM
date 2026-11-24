export const grcService = {
    getRisks: async () => {
        return Array.from({length: 20}, (_, i) => ({
            risk_id: `RSK-${i+100}`,
            title: `Risk ${i+1}`,
            category: ["Operational", "Financial", "Compliance", "Strategic", "IT"][i % 5],
            likelihood: (i % 5) + 1,
            impact: ((i+2) % 5) + 1,
            risk_score: ((i % 5) + 1) * (((i+2) % 5) + 1),
            owner: `Owner ${i+1}`,
            status: "Active",
            mitigation_plan: "Plan details...",
            last_reviewed: "2023-10-01"
        }));
    },
    getComplianceControls: async () => { return []; },
    getAudits: async () => { return []; },
    getFindings: async () => { return []; },
    getFraudAlerts: async () => { return []; },
    get12GRCKPIs: async () => {
        return [
            { id: 1, label: "Risk Score", value: "34/100", status: "success" },
            { id: 2, label: "Open Risks", value: "18", status: "warning" },
            { id: 3, label: "Compliance Rate", value: "97.8%", status: "success" },
            { id: 4, label: "Pending Audits", value: "3", status: "warning" },
            { id: 5, label: "Fraud Alerts", value: "2", status: "danger" },
            { id: 6, label: "SOX Compliance", value: "98.4%", status: "success" },
            { id: 7, label: "High Risks", value: "4", status: "danger" },
            { id: 8, label: "Audit Findings", value: "12", status: "warning" },
            { id: 9, label: "Controls Tested", value: "145", status: "success" },
            { id: 10, label: "Policy Breaches", value: "1", status: "danger" },
            { id: 11, label: "Data Breaches", value: "0", status: "success" },
            { id: 12, label: "GDPR Score", value: "99%", status: "success" }
        ];
    },
    getGRCAnalytics: async () => {
        return {
            riskDistribution: [],
            complianceTrend: [],
            auditCoverage: []
        };
    },
    createRisk: async (data) => {
        return { success: true, ...data };
    }
};
