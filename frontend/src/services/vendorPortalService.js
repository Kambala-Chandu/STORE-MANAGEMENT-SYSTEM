export const vendorPortalService = {
  getVendors: async () => Array.from({ length: 25 }, (_, i) => ({
    vendor_id: `VND-${1000 + i}`,
    name: `Global Supplier ${i + 1}`,
    category: ['IT', 'Logistics', 'Raw Materials', 'Services'][i % 4],
    country: ['USA', 'UK', 'Germany', 'Japan'][i % 4],
    rating: (Math.random() * 2 + 3).toFixed(1),
    status: ['Active', 'Pending', 'Suspended'][i % 3],
    contact_name: `Contact ${i}`,
    email: `contact${i}@supplier.com`,
    certifications: ['ISO 9001'],
    spend_ytd: `$${(Math.random() * 100000).toFixed(0)}`
  })),
  getRFQs: async () => Array.from({ length: 15 }, (_, i) => ({
    rfq_number: `RFQ-${2023}-${i}`,
    title: `Request for Laptops ${i}`,
    category: 'IT',
    deadline: '2023-12-01',
    responses_received: i % 5,
    status: ['Open', 'Closed', 'Awarded'][i % 3],
    budget_estimate: `$${(Math.random() * 50000).toFixed(0)}`
  })),
  getContracts: async () => Array.from({ length: 12 }, (_, i) => ({
    contract_number: `CTR-${i}`,
    vendor: `Supplier ${i}`,
    value: `$${(Math.random() * 200000).toFixed(0)}`,
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    renewal_status: ['Active', 'Expiring', 'Expired'][i % 3]
  })),
  getVendorPerformance: async (id) => ({ quality: 90, delivery: 85, price: 95, responsiveness: 88 }),
  get12VendorKPIs: async () => [
    { label: 'Active Vendors', value: '127' },
    { label: 'RFQ Response Rate', value: '84.3%' },
    { label: 'Contract Compliance', value: '96.7%' },
    { label: 'Avg Bid Time', value: '2.1 days' },
    { label: 'Vendor Satisfaction', value: '4.6' },
    { label: 'Cost Savings', value: '$284K' },
    { label: 'Total Spend', value: '$2.4M' },
    { label: 'Pending Approvals', value: '14' },
    { label: 'Open RFQs', value: '22' },
    { label: 'Expiring Contracts', value: '8' },
    { label: 'New Vendors', value: '15' },
    { label: 'High Risk', value: '3' }
  ],
  getVendorAnalytics: async () => ({ spendTrend: [], vendorDistribution: [], savingsTrend: [] }),
  createRFQ: async (data) => ({ success: true }),
  createVendor: async (data) => ({ success: true })
};
