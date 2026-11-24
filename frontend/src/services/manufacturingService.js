const STORAGE_KEY = 'storehub_manufacturing_data';

const generateMockData = () => {
  const boms = Array.from({ length: 15 }, (_, i) => ({
    id: `BOM-100${i}`,
    name: `Product Variant ${i + 1}`,
    version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)}`,
    components_count: Math.floor(Math.random() * 50) + 5,
    yield_pct: (90 + Math.random() * 9).toFixed(1),
    standard_cost: (100 + Math.random() * 900).toFixed(2),
  }));

  const productionOrders = Array.from({ length: 25 }, (_, i) => {
    const statuses = ['Planned', 'In Progress', 'Completed', 'Cancelled'];
    return {
      id: `PO-${2023000 + i}`,
      order_number: `PO-${2023000 + i}`,
      product: `Product Variant ${Math.floor(Math.random() * 15) + 1}`,
      planned_qty: Math.floor(Math.random() * 1000) + 50,
      actual_qty: Math.floor(Math.random() * 800),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      work_center: `Work Center ${Math.floor(Math.random() * 8) + 1}`,
      start_date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      end_date: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
      priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)]
    };
  });

  const workCenters = Array.from({ length: 8 }, (_, i) => ({
    id: `WC-00${i + 1}`,
    name: `Work Center ${i + 1}`,
    type: ['Assembly', 'Machining', 'Packaging', 'Inspection'][Math.floor(Math.random() * 4)],
    capacity_hours: 160,
    utilization_pct: (60 + Math.random() * 38).toFixed(1),
    status: ['Active', 'Maintenance', 'Offline'][Math.floor(Math.random() * 3)],
    machine_count: Math.floor(Math.random() * 10) + 1
  }));

  const capacityPlan = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    capacity: 1000,
    actual_load: Math.floor(600 + Math.random() * 500)
  }));

  const mrpData = Array.from({ length: 20 }, (_, i) => ({
    id: `MRP-${i}`,
    item: `Raw Material ${i + 1}`,
    required_qty: Math.floor(Math.random() * 5000) + 100,
    on_hand: Math.floor(Math.random() * 2000),
    to_order: Math.floor(Math.random() * 3000),
    lead_days: Math.floor(Math.random() * 30) + 1
  }));

  const kpis = [
    { label: "OEE", value: "87.4", unit: "%", trend: "+1.2%", trendDir: "up", icon: "Activity", color: "text-blue-500" },
    { label: "Production Volume", value: "4,280", unit: "units", trend: "+5.4%", trendDir: "up", icon: "Package", color: "text-emerald-500" },
    { label: "Scrap Rate", value: "2.1", unit: "%", trend: "-0.3%", trendDir: "down", icon: "Trash2", color: "text-red-500" },
    { label: "Machine Utilization", value: "91.3", unit: "%", trend: "+2.1%", trendDir: "up", icon: "Settings", color: "text-blue-500" },
    { label: "On-Time Delivery", value: "96.8", unit: "%", trend: "+1.1%", trendDir: "up", icon: "Clock", color: "text-emerald-500" },
    { label: "Yield", value: "98.5", unit: "%", trend: "+0.5%", trendDir: "up", icon: "CheckCircle", color: "text-emerald-500" },
    { label: "Maintenance Costs", value: "12.4", unit: "k", trend: "-2.1%", trendDir: "down", icon: "Wrench", color: "text-amber-500" },
    { label: "Labor Efficiency", value: "94.2", unit: "%", trend: "+1.4%", trendDir: "up", icon: "Users", color: "text-blue-500" },
    { label: "Inventory Turnover", value: "8.5", unit: "x", trend: "+0.2%", trendDir: "up", icon: "RefreshCw", color: "text-indigo-500" },
    { label: "Defect Rate", value: "1.2", unit: "%", trend: "-0.1%", trendDir: "down", icon: "AlertTriangle", color: "text-red-500" },
    { label: "Cycle Time", value: "42", unit: "mins", trend: "-3 mins", trendDir: "down", icon: "Timer", color: "text-blue-500" },
    { label: "First Pass Yield", value: "95.5", unit: "%", trend: "+0.8%", trendDir: "up", icon: "Award", color: "text-emerald-500" }
  ];

  const analytics = {
    productionTrend: Array.from({length: 12}, (_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], volume: 3000 + Math.random()*1500 })),
    oeeTrend: Array.from({length: 12}, (_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], oee: 80 + Math.random()*15 })),
    scrapTrend: Array.from({length: 6}, (_, i) => ({ product: `Product ${i+1}`, rate: 1 + Math.random()*4 }))
  };

  return { boms, productionOrders, workCenters, capacityPlan, mrpData, kpis, analytics };
};

const getStoredData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  const initial = generateMockData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveData = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const manufacturingService = {
  async getBOMs() { return getStoredData().boms; },
  async getProductionOrders() { return getStoredData().productionOrders; },
  async getWorkCenters() { return getStoredData().workCenters; },
  async getCapacityPlan() { return getStoredData().capacityPlan; },
  async getMRPRun() { return getStoredData().mrpData; },
  async get12ManufacturingKPIs() { return getStoredData().kpis; },
  async getManufacturingAnalytics() { return getStoredData().analytics; },
  
  async createProductionOrder(orderData) {
    const data = getStoredData();
    const newOrder = {
      id: `PO-${Date.now()}`,
      order_number: `PO-${Date.now()}`,
      actual_qty: 0,
      status: 'Planned',
      ...orderData
    };
    data.productionOrders.unshift(newOrder);
    saveData(data);
    return newOrder;
  },

  async updateOrderStatus(id, status) {
    const data = getStoredData();
    const orderIndex = data.productionOrders.findIndex(o => o.id === id || o.order_number === id);
    if (orderIndex > -1) {
      data.productionOrders[orderIndex].status = status;
      saveData(data);
      return data.productionOrders[orderIndex];
    }
    throw new Error('Order not found');
  }
};
