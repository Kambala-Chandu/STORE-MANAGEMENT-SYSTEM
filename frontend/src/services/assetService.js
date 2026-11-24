export const assetService = {
    getAssets: async () => Array.from({length: 25}, (_, i) => ({asset_id: `A-${i}`, name: `Machine ${i}`, category: 'Equip', location: 'Floor 1', purchase_cost: 10000, current_value: 8000, status: 'Active'})),
    getMaintenanceOrders: async () => Array.from({length: 20}, (_, i) => ({id: i, type: 'Preventive', asset: `A-${i}`, status: 'Open'})),
    getCalendar: async () => [],
    getDepreciation: async () => [],
    get12AssetKPIs: async () => Array.from({length: 12}, (_, i) => ({title: `KPI ${i}`, value: `Val ${i}`})),
    getAssetAnalytics: async () => ({}),
    createAsset: async () => ({}),
    createMaintenanceOrder: async () => ({})
};
