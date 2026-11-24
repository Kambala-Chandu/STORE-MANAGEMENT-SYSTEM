export const mobileService = {
    getSyncStatus: async () => ({ last_sync: '2023-10-01T12:00:00Z', pending_uploads: 3, pending_downloads: 0, conflicts: 0, isOnline: navigator.onLine }),
    getOfflineQueue: async () => ([]),
    addToOfflineQueue: async (action) => { return true; },
    syncNow: async () => { return new Promise(resolve => setTimeout(resolve, 1000)); },
    getPWAStatus: async () => ({ isInstalled: false, canInstall: true, notificationsEnabled: true }),
    get12MobileKPIs: async () => [
        { id: 1, label: "Offline Sessions", value: "127", status: "success" },
        { id: 2, label: "Sync Success Rate", value: "99.2%", status: "success" },
        { id: 3, label: "Pending Uploads", value: "3", status: "warning" },
        { id: 4, label: "Mobile Users", value: "28", status: "success" },
        { id: 5, label: "Avg Session Duration", value: "12 min", status: "success" },
        { id: 6, label: "Data Cached", value: "284 MB", status: "success" },
        { id: 7, label: "Push Sent", value: "1,204", status: "success" },
        { id: 8, label: "Conflicts", value: "0", status: "success" },
        { id: 9, label: "Downloads", value: "45", status: "success" },
        { id: 10, label: "App Installs", value: "42", status: "success" },
        { id: 11, label: "Storage Used", value: "12%", status: "success" },
        { id: 12, label: "Battery Usage", value: "Low", status: "success" }
    ],
    getMobileAnalytics: async () => ({})
};
