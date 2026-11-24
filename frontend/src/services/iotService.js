export const iotService = {
  getDevices: async () => {
    return Array.from({ length: 30 }, (_, i) => ({
      device_id: `DEV-${1000 + i}`,
      name: `Sensor ${i + 1}`,
      type: ['RFID Reader', 'Temperature Sensor', 'GPS Tracker', 'Smart Shelf', 'Camera', 'Motion Sensor', 'Humidity Sensor'][i % 7],
      location: `Zone ${(i % 5) + 1}`,
      status: ['Online', 'Offline', 'Warning'][i % 3],
      battery_pct: 100 - (i * 2),
      last_ping: new Date().toISOString(),
      firmware_version: '1.2.0',
      readings: []
    }));
  },
  getSensorReadings: async () => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      temperature: 20 + Math.random() * 5,
      humidity: 40 + Math.random() * 10,
      motion: Math.random() * 100
    }));
  },
  getAlerts: async () => {
    return Array.from({ length: 15 }, (_, i) => ({
      alert_id: `ALT-${i}`,
      device: `DEV-${1000 + i}`,
      severity: ['Critical', 'High', 'Medium'][i % 3],
      message: `Anomaly detected on DEV-${1000 + i}`,
      timestamp: new Date().toISOString(),
      acknowledged: false
    }));
  },
  getDeviceHealth: async () => {
    return { online: 25, offline: 3, warning: 2, needs_attention: [] };
  },
  get12IoTKPIs: async () => {
    return [
      { label: 'Connected Devices', value: '247', trend: '+12' },
      { label: 'Online Rate', value: '98.4%', trend: '+0.5%' },
      { label: 'Active Alerts', value: '7', trend: '-2' },
      { label: 'Avg Response Time', value: '42ms', trend: '-5ms' },
      { label: 'Data Points/Hour', value: '18.4K', trend: '+1K' },
      { label: 'Sensor Accuracy', value: '99.7%', trend: '+0.1%' },
      { label: 'Battery Replacements', value: '12', trend: '-3' },
      { label: 'Network Uptime', value: '99.99%', trend: '0' },
      { label: 'Firmware Outdated', value: '5', trend: '-2' },
      { label: 'API Calls', value: '1.2M', trend: '+50K' },
      { label: 'Gateway Load', value: '45%', trend: '+2%' },
      { label: 'Data Storage', value: '1.5TB', trend: '+50GB' }
    ];
  },
  getIoTAnalytics: async () => {
    return { uptime: [], alerts: [], throughput: [] };
  },
  acknowledgeAlert: async (id) => {
    return { status: 'success', alert_id: id };
  }
};
