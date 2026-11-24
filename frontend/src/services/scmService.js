export const scmService = {
    getDemandForecast: async () => Array.from({length: 12}, (_, i) => ({month: `Month ${i+1}`, forecast: 1000 + i*50, actual: 980 + i*45})),
    getSupplyPlan: async () => Array.from({length: 20}, (_, i) => ({id: i, supplier: `Supplier ${i}`, category: 'Electronics', planned_qty: 500, confirmed_qty: 480, eta: '2023-12-01'})),
    getShipments: async () => Array.from({length: 25}, (_, i) => ({id: `SHP-${i}`, carrier: 'FedEx', tracking: `TRK99${i}`, status: 'In Transit', eta: '2023-11-15'})),
    getSupplierRisk: async () => Array.from({length: 15}, (_, i) => ({id: i, supplier: `Vendor ${i}`, risk: 'Low', factors: 'Geopolitical', mitigation: 'Diversification'})),
    getInventoryOptimization: async () => Array.from({length: 20}, (_, i) => ({id: i, item: `SKU-${i}`, current_stock: 50, reorder_point: 60, suggested_qty: 150, supplier: `Sup-${i}`, lead_days: 7})),
    get12SCMKPIs: async () => Array.from({length: 12}, (_, i) => ({title: `KPI ${i}`, value: `Val ${i}`})),
    getSCMAnalytics: async () => ({})
};
