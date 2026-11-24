export const warehouseService = {
    getZones: async () => {
        return [
            {"id": 1, "name": "Receiving", "bins": 10, "utilization": 45, "temp": "Ambient", "status": "Active"},
            {"id": 2, "name": "Bulk Storage A", "bins": 100, "utilization": 82, "temp": "Ambient", "status": "Active"},
            {"id": 3, "name": "Bulk Storage B", "bins": 100, "utilization": 95, "temp": "Ambient", "status": "Active"},
            {"id": 4, "name": "Cold Chain", "bins": 40, "utilization": 60, "temp": "-18°C", "status": "Active"},
            {"id": 5, "name": "Hazmat", "bins": 20, "utilization": 25, "temp": "Ambient", "status": "Active"},
            {"id": 6, "name": "Picking", "bins": 80, "utilization": 75, "temp": "Ambient", "status": "Active"},
            {"id": 7, "name": "Packing", "bins": 15, "utilization": 50, "temp": "Ambient", "status": "Active"},
            {"id": 8, "name": "Dispatch", "bins": 15, "utilization": 30, "temp": "Ambient", "status": "Active"}
        ];
    },
    getBins: async () => {
        const bins = [];
        for(let i=1; i<=50; i++) {
            bins.push({"bin_id": `A${i}-R${i}-L${i}`, "zone": "Bulk Storage A", "aisle": `A${i}`, "row": `R${i}`, "level": `L${i}`, "item_stored": `ITEM-${i*10}`, "capacity_pct": 50+(i%50), "status": i%3===0 ? "Empty" : "Occupied"});
        }
        return bins;
    },
    getReceiptQueue: async () => {
        let receipts = localStorage.getItem('warehouse_receipts');
        if (receipts) return JSON.parse(receipts);
        receipts = [];
        for(let i=1; i<=15; i++) {
            receipts.push({"id": i, "PO_number": `PO-${1000+i}`, "supplier": `Supplier ${i}`, "expected_items": 100*i, "status": "Scheduled", "dock_door": `D-${i}`, "ETA": `2026-10-${10+(i%20)}`});
        }
        localStorage.setItem('warehouse_receipts', JSON.stringify(receipts));
        return receipts;
    },
    getPickOrders: async () => {
        let picks = localStorage.getItem('warehouse_picks');
        if (picks) return JSON.parse(picks);
        picks = [];
        for(let i=1; i<=20; i++) {
            picks.push({"id": i, "order_ref": `ORD-${2000+i}`, "items_to_pick": 10*i, "picker_name": `Picker ${i}`, "priority": i%3===0 ? "Urgent" : (i%2===0 ? "High" : "Normal"), "status": "Pending", "wave_batch": `W-${i}`});
        }
        localStorage.setItem('warehouse_picks', JSON.stringify(picks));
        return picks;
    },
    getShipments: async () => {
        const shipments = [];
        for(let i=1; i<=15; i++) {
            shipments.push({"id": i, "order_ref": `ORD-${2000+i}`, "tracking": `TRK-${3000+i}`, "carrier": "FedEx", "destination": "NY", "weight": `${10+i} kg`, "status": "In Transit"});
        }
        return shipments;
    },
    getCycleCounts: async () => {
        const counts = [];
        for(let i=1; i<=10; i++) {
            counts.push({"id": i, "zone": "Bulk Storage A", "bin_range": `A${i}-R${i}`, "last_counted": "2026-10-01", "variance_pct": i*0.1, "status": "Pending", "next_due": "2026-10-15"});
        }
        return counts;
    },
    get12WarehouseKPIs: async () => {
        return [
            {"title": "Warehouse Utilization", "value": "87.3%", "trend": "+1.2%", "trendUp": true},
            {"title": "Orders Picked Today", "value": "342", "trend": "+5%", "trendUp": true},
            {"title": "Receiving Accuracy", "value": "99.1%", "trend": "+0.1%", "trendUp": true},
            {"title": "Put-away Time", "value": "18 min", "trend": "-2 min", "trendUp": true},
            {"title": "Order Fulfillment Rate", "value": "98.7%", "trend": "+0.5%", "trendUp": true},
            {"title": "Cycle Count Accuracy", "value": "99.4%", "trend": "+0.2%", "trendUp": true},
            {"title": "Dock Door Utilization", "value": "65%", "trend": "+3%", "trendUp": true},
            {"title": "Picking Accuracy", "value": "99.8%", "trend": "+0.1%", "trendUp": true},
            {"title": "Inventory Turn", "value": "12.4", "trend": "+0.4", "trendUp": true},
            {"title": "Backorder Rate", "value": "1.2%", "trend": "-0.3%", "trendUp": false},
            {"title": "Return Rate", "value": "2.1%", "trend": "-0.5%", "trendUp": true},
            {"title": "Cost per Order", "value": "$3.45", "trend": "-$0.10", "trendUp": true}
        ];
    },
    getWarehouseAnalytics: async () => {
        return {
            "throughput": Array.from({length: 7}, (_, i) => ({day: `Day ${i+1}`, inbound: 100+i*10, outbound: 90+i*8})),
            "utilization": [{"zone": "Bulk A", "used": 82}, {"zone": "Bulk B", "used": 95}, {"zone": "Cold", "used": 60}],
            "picking_accuracy": Array.from({length: 7}, (_, i) => ({day: `Day ${i+1}`, accuracy: 99.0+i*0.1}))
        };
    },
    createReceipt: async (data) => {
        const receipts = JSON.parse(localStorage.getItem('warehouse_receipts') || '[]');
        receipts.push({id: Date.now(), ...data, status: "Scheduled"});
        localStorage.setItem('warehouse_receipts', JSON.stringify(receipts));
        return { success: true };
    },
    createPickOrder: async (data) => {
        const picks = JSON.parse(localStorage.getItem('warehouse_picks') || '[]');
        picks.push({id: Date.now(), ...data, status: "Pending"});
        localStorage.setItem('warehouse_picks', JSON.stringify(picks));
        return { success: true };
    }
};
