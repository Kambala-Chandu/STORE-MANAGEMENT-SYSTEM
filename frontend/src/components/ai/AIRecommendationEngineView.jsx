import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Tag,
  Users,
  Truck,
  CheckCircle2,
  ChevronRight,
  Layers,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  cn,
} from '../ui';

const PRIORITY_TONES = {
  Critical: 'danger',
  High: 'warning',
  Medium: 'info',
  Optimization: 'success',
};

const TYPE_ICONS = {
  Inventory: Layers,
  Pricing: Tag,
  CRM: Users,
  Procurement: Truck,
  Merchandising: Sparkles,
};

export const AIRecommendationEngineView = ({ recommendations = [], loading = false }) => {
  const [filter, setFilter] = useState('All');

  const filteredRecs = filter === 'All'
    ? recommendations
    : recommendations.filter((r) => r.priority === filter);

  return (
    <div className="space-y-6">
      <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
        <CardHeader
          title="Autonomous AI Decision & Recommendation Engine"
          description="Prescriptive operational strategies synthesized across sales velocity, customer cohorts, and vendor lead times."
          actions={
            <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
              {['All', 'Critical', 'High', 'Medium', 'Optimization'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilter(p)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150',
                    filter === p
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          }
        />
        <CardBody className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredRecs.map((rec, idx) => {
                const Icon = TYPE_ICONS[rec.type] || Sparkles;
                const tone = PRIORITY_TONES[rec.priority] || 'info';

                return (
                  <motion.div
                    key={rec.id || idx}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    className={cn(
                      'group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-4.5 transition-all duration-200',
                      'hover:bg-[#0f172a] hover:border-white/[0.15] hover:shadow-xl'
                    )}
                  >
                    <div>
                      {/* Priority and Type Header */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                          <Icon className="h-4 w-4 text-blue-400" />
                          {rec.type} Strategy
                        </span>
                        <Badge tone={tone} size="sm">
                          {rec.priority} Priority
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="mt-3 text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        {rec.title}
                      </h3>

                      {/* Reason */}
                      <div className="mt-2 rounded-lg bg-white/[0.03] border border-white/[0.04] p-2.5 text-xs text-slate-300">
                        <span className="font-semibold text-slate-400">Diagnosis: </span>
                        {rec.reason}
                      </div>

                      {/* Expected Impact */}
                      <div className="mt-2.5 flex items-start gap-2 text-xs text-emerald-400 font-medium">
                        <TrendingUp className="h-4 w-4 shrink-0 mt-0.5" />
                        <span><strong>Expected Impact:</strong> {rec.expectedImpact}</span>
                      </div>
                    </div>

                    {/* Action Execution Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3">
                      <span className="text-[11px] text-slate-500 font-mono">
                        Ready for execution
                      </span>
                      <Button
                        as={Link}
                        to={rec.actionTo}
                        variant={rec.priority === 'Critical' ? 'primary' : 'secondary'}
                        size="sm"
                        iconRight={ChevronRight}
                        className="text-xs h-7.5"
                      >
                        {rec.actionLabel}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredRecs.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
              <p className="font-medium text-white">All operational parameters optimized</p>
              <p className="text-xs text-slate-500 mt-1">No active recommendations under the selected priority filter.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AIRecommendationEngineView;

