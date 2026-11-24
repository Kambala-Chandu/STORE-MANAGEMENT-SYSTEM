import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  X,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Clock,
  Layers,
  Copy,
  DollarSign,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  cn,
} from '../ui';

const SEVERITY_CONFIG = {
  Critical: {
    border: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
    icon: AlertOctagon,
    badgeTone: 'danger',
  },
  Warning: {
    border: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    icon: AlertTriangle,
    badgeTone: 'warning',
  },
  Info: {
    border: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    icon: Info,
    badgeTone: 'info',
  },
};

export const SmartAlertCenter = ({ alerts = [], loading = false }) => {
  const [activeAlerts, setActiveAlerts] = useState(alerts);
  const [severityFilter, setSeverityFilter] = useState('All');

  // Keep state in sync if alerts prop changes
  React.useEffect(() => {
    setActiveAlerts(alerts);
  }, [alerts]);

  const handleDismiss = (id) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAlerts = severityFilter === 'All'
    ? activeAlerts
    : activeAlerts.filter((a) => a.severity === severityFilter);

  const counts = {
    all: activeAlerts.length,
    critical: activeAlerts.filter((a) => a.severity === 'Critical').length,
    warning: activeAlerts.filter((a) => a.severity === 'Warning').length,
    info: activeAlerts.filter((a) => a.severity === 'Info').length,
  };

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
      <CardHeader
        title="Smart Enterprise Alert & Exception Center"
        description="Automated system sentinels monitoring anomalous sales shifts, stockout hazards, supplier delays, and data consistency."
        actions={
          <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
            {[
              { id: 'All', label: `All (${counts.all})` },
              { id: 'Critical', label: `Critical (${counts.critical})` },
              { id: 'Warning', label: `Warning (${counts.warning})` },
              { id: 'Info', label: `Info (${counts.info})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSeverityFilter(f.id)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150',
                  severityFilter === f.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />
      <CardBody className="p-5">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert) => {
              const conf = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.Info;
              const Icon = conf.icon;

              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-150',
                    conf.border,
                    'hover:bg-white/[0.02]'
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-white/[0.05]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge tone={conf.badgeTone} size="sm">
                          {alert.severity}
                        </Badge>
                        <span className="text-xs font-semibold text-white">
                          {alert.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          · {alert.category} · {alert.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                    {alert.actionTo && (
                      <Button
                        as={Link}
                        to={alert.actionTo}
                        variant="secondary"
                        size="sm"
                        iconRight={ArrowRight}
                        className="text-xs h-7.5"
                      >
                        {alert.actionLabel || 'Resolve'}
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDismiss(alert.id)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-white/[0.06] hover:text-white transition-colors"
                      title="Dismiss alert"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredAlerts.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
              <p className="font-medium text-white">Zero active anomalies detected</p>
              <p className="text-xs text-slate-500 mt-1">All telemetry systems and business rules operating within normal thresholds.</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default SmartAlertCenter;

