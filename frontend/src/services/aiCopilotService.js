export const aiCopilotService = {
  simulateChat: async (message) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const msg = message.toLowerCase();
        let response = "I am your enterprise AI copilot. How can I assist you with StoreHub ERP today?";
        if (msg.includes('inventory') || msg.includes('stock')) response = "Inventory levels are optimal. 3 items at risk of stockout.";
        else if (msg.includes('sales') || msg.includes('revenue')) response = "Sales are up 12% this week. Revenue forecast looks strong.";
        else if (msg.includes('hr') || msg.includes('employee') || msg.includes('payroll')) response = "No payroll anomalies detected. 2 employees approaching overtime limit.";
        else if (msg.includes('supplier') || msg.includes('vendor')) response = "Supplier deliveries are 95% on-time this month.";
        else if (msg.includes('finance') || msg.includes('budget')) response = "Budget utilization is at 45% for Q3. No immediate concerns.";
        
        resolve({
          response,
          confidence: 98.5,
          sources: ["ERP Database"],
          suggestions: ["Show details", "Generate report"]
        });
      }, 800);
    });
  },
  getInsights: async () => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      type: ['Anomaly', 'Opportunity', 'Risk', 'Forecast'][i % 4],
      description: `Insight ${i} description`,
      impact: 'High',
      recommended_action: 'Review data',
      confidence_pct: 85 + (i % 10)
    }));
  },
  getRecommendations: async () => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      module: ['Inventory', 'Sales', 'HR', 'Finance'][i % 4],
      priority: ['High', 'Medium', 'Low'][i % 3],
      description: `Recommendation ${i}`,
      potential_impact: `Save $${1000 * i}`
    }));
  },
  getAnomalies: async () => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      module: ['Sales', 'Inventory', 'HR'][i % 3],
      description: `Anomaly ${i} detected`,
      detected_at: new Date().toISOString(),
      severity: ['Critical', 'High', 'Medium'][i % 3],
      status: ['New', 'Investigating', 'Resolved'][i % 3]
    }));
  },
  getForecasts: async () => {
    return { revenue: [], inventory: [], demand: [] };
  },
  get12AIKPIs: async () => {
    return [
      { label: 'Insights Generated', value: '1,847', trend: '+124' },
      { label: 'Anomalies Detected', value: '23', trend: '-5' },
      { label: 'Forecast Accuracy', value: '91.4%', trend: '+2.1%' },
      { label: 'Recommendations Accepted', value: '78.3%', trend: '+5.4%' },
      { label: 'Cost Savings Identified', value: '$124K', trend: '+$12K' },
      { label: 'Risk Items Flagged', value: '7', trend: '-2' },
      { label: 'Chat Queries', value: '450', trend: '+45' },
      { label: 'Avg Response Time', value: '0.8s', trend: '-0.1s' },
      { label: 'User Satisfaction', value: '4.8/5', trend: '+0.2' },
      { label: 'Data Sources Used', value: '15', trend: '0' },
      { label: 'Model Confidence', value: '95%', trend: '+1%' },
      { label: 'Automation Triggers', value: '34', trend: '+8' }
    ];
  },
  getConversationHistory: () => {
    const hist = localStorage.getItem('ai_chat_history');
    return hist ? JSON.parse(hist) : [];
  },
  saveConversationHistory: (history) => {
    localStorage.setItem('ai_chat_history', JSON.stringify(history));
  }
};
