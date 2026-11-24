export const documentService = {
  getFolders: async () => ['HR', 'Finance', 'Legal', 'Contracts', 'Quality', 'Operations', 'IT'],
  getDocuments: async () => {
    return Array.from({ length: 35 }, (_, i) => ({
      doc_id: `DOC-${2000 + i}`,
      title: `Corporate Document ${i + 1}`,
      category: ['Policy', 'Procedure', 'Contract', 'Manual'][i % 4],
      folder: ['HR', 'Finance', 'Legal', 'Contracts', 'Quality', 'Operations', 'IT'][i % 7],
      owner: `User ${i % 5 + 1}`,
      created_date: '2023-10-01',
      modified_date: '2023-10-05',
      version: `v1.${i % 3}`,
      size_mb: (Math.random() * 10).toFixed(2),
      status: ['Draft', 'Review', 'Approved', 'Archived'][i % 4],
      tags: ['Internal', 'Confidential'],
      is_signed: i % 2 === 0
    }));
  },
  getVersionHistory: async (docId) => [{ version: 'v1.0', date: '2023-10-01', author: 'User 1', change_description: 'Initial draft', size: '2MB' }],
  searchDocuments: async (query) => [],
  get12DocumentKPIs: async () => [
    { label: 'Total Documents', value: '14,832' },
    { label: 'Storage Used', value: '847 GB' },
    { label: 'Pending Approvals', value: '23' },
    { label: 'OCR Processed Today', value: '156' },
    { label: 'Avg Retrieval Time', value: '1.2s' },
    { label: 'Compliance Score', value: '98.4%' },
    { label: 'Archived Docs', value: '3,420' },
    { label: 'Active Drafts', value: '112' },
    { label: 'Docs Signed', value: '450' },
    { label: 'Expiring Soon', value: '18' },
    { label: 'Views This Week', value: '8,430' },
    { label: 'Storage Limit', value: '85%' }
  ],
  getDocumentAnalytics: async () => ({
    uploadTrend: [{ name: 'Jan', uploads: 120 }, { name: 'Feb', uploads: 150 }],
    categoryDistribution: [{ name: 'Policy', value: 30 }, { name: 'Contract', value: 40 }],
    accessTrend: [{ name: 'Mon', access: 200 }, { name: 'Tue', access: 250 }]
  }),
  uploadDocument: async (data) => ({ success: true }),
  approveDocument: async (id) => ({ success: true })
};
