import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Boxes,
  Users,
  Truck,
  Package,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  Cpu,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { Button, cn } from '../ui';
import { ExecutiveAISummaryPanel } from './ExecutiveAISummaryPanel';
import { AIKPIGrid } from './AIKPIGrid';
import { SmartInventoryForecast } from './SmartInventoryForecast';
import { SmartSalesForecast } from './SmartSalesForecast';
import { CustomerIntelligenceView } from './CustomerIntelligenceView';
import { SupplierIntelligenceView } from './SupplierIntelligenceView';
import { ProductIntelligenceView } from './ProductIntelligenceView';
import { AIRecommendationEngineView } from './AIRecommendationEngineView';
import { EnterpriseForecastCharts } from './EnterpriseForecastCharts';
import { SmartAlertCenter } from './SmartAlertCenter';

export const EnterpriseAIIntelligenceHub = ({
  aiAnalytics,
  defaultTab = 'forecast',
  showSummaryPanel = true,
  showKpiGrid = true,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const {
    loading,
    refresh,
    lastUpdated,
    aiSummary,
    inventoryForecast,
    salesForecast,
    customerIntel,
    supplierIntel,
    productIntel,
    recommendations,
    chartDatasets,
    alerts,
    aiKpis,
  } = aiAnalytics;

  const tabs = [
    { id: 'forecast', label: 'Forecast & Visuals', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory Depletion', icon: Boxes },
    { id: 'sales', label: 'Sales Projections', icon: Calendar },
    { id: 'recommendations', label: 'AI Recommendations', icon: Lightbulb, badge: recommendations.length },
    { id: 'customers', label: 'Customer Intel', icon: Users },
    { id: 'suppliers', label: 'Supplier Health', icon: Truck },
    { id: 'products', label: 'Product Intel', icon: Package },
    { id: 'alerts', label: 'Exception Alerts', icon: AlertTriangle, badge: alerts.length, badgeTone: 'danger' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Executive AI Business Summary Panel */}
      {showSummaryPanel && (
        <ExecutiveAISummaryPanel
          aiSummary={aiSummary}
          loading={loading}
          onRefresh={refresh}
          lastUpdated={lastUpdated}
        />
      )}

      {/* 2. 7-KPI Enterprise Stat Grid */}
      {showKpiGrid && (
        <section aria-label="Enterprise AI Key Indicators">
          <AIKPIGrid kpis={aiKpis} loading={loading} />
        </section>
      )}

      {/* 3. Navigation Tabs */}
      <section aria-label="AI Intelligence Sub-modules" className="space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto ds-scroll py-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-[#0b1329]/90 border border-white/[0.06] text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={cn(
                      'ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : tab.badgeTone === 'danger'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-blue-500/20 text-blue-300'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Synced {lastUpdated?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* 4. Active Sub-module View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'forecast' && (
              <div className="space-y-6">
                <EnterpriseForecastCharts chartDatasets={chartDatasets} />
                <SmartSalesForecast forecast={salesForecast} loading={loading} />
              </div>
            )}

            {activeTab === 'inventory' && (
              <SmartInventoryForecast items={inventoryForecast} loading={loading} />
            )}

            {activeTab === 'sales' && (
              <SmartSalesForecast forecast={salesForecast} loading={loading} />
            )}

            {activeTab === 'recommendations' && (
              <AIRecommendationEngineView recommendations={recommendations} loading={loading} />
            )}

            {activeTab === 'customers' && (
              <CustomerIntelligenceView customerIntel={customerIntel} loading={loading} />
            )}

            {activeTab === 'suppliers' && (
              <SupplierIntelligenceView suppliers={supplierIntel} loading={loading} />
            )}

            {activeTab === 'products' && (
              <ProductIntelligenceView productIntel={productIntel} loading={loading} />
            )}

            {activeTab === 'alerts' && (
              <SmartAlertCenter alerts={alerts} loading={loading} />
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
};

export default EnterpriseAIIntelligenceHub;

