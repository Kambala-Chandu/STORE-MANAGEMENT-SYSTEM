import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Activity,
  ShieldCheck,
  Users,
  Truck,
  Zap,
} from 'lucide-react';
import { StatCard, SkeletonCard } from '../ui';

const KPI_ICONS = {
  'kpi-forecast-rev': DollarSign,
  'kpi-predicted-profit': TrendingUp,
  'kpi-demand-index': Activity,
  'kpi-inventory-health': ShieldCheck,
  'kpi-customer-retention': Users,
  'kpi-supplier-health': Truck,
  'kpi-growth-index': Zap,
};

export const AIKPIGrid = ({ kpis = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
      {kpis.map((kpi, idx) => {
        const Icon = KPI_ICONS[kpi.id] || TrendingUp;
        return (
          <motion.div
            key={kpi.id || idx}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
          >
            <StatCard
              title={kpi.title}
              value={kpi.value}
              subtitle={kpi.subtitle}
              icon={Icon}
              tone={kpi.tone || 'primary'}
              trend={kpi.trend}
              deltaLabel={kpi.deltaLabel}
              className="h-full border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg hover:border-blue-500/30 transition-all duration-200"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default AIKPIGrid;

