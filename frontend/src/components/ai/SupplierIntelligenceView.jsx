import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Truck,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  cn,
} from '../ui';

export const SupplierIntelligenceView = ({ suppliers = [], loading = false }) => {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
        <CardHeader
          title="Automated Supplier Scorecards & Vendor Ranking"
          description="Multivariate scoring evaluating on-time delivery reliability, lead time efficiency, quality ratings, and price consistency."
          actions={
            <Button as={Link} to="/suppliers" variant="secondary" size="sm" iconRight={ArrowRight}>
              Supplier Matrix
            </Button>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto ds-scroll">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Rank / Supplier</th>
                  <th className="py-3 px-4">Delivery Reliability</th>
                  <th className="py-3 px-4">Avg Lead Time</th>
                  <th className="py-3 px-4">Quality Score</th>
                  <th className="py-3 px-4">Price Consistency</th>
                  <th className="py-3 px-4">Composite Score</th>
                  <th className="py-3 px-4">Procurement Tier</th>
                  <th className="py-3 px-4 text-right">Vendor POs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {suppliers.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'grid h-6 w-6 flex-shrink-0 place-items-center rounded-lg border text-xs font-bold font-mono',
                            idx === 0
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                              : idx === 1
                              ? 'bg-slate-300/15 border-slate-300/30 text-slate-200'
                              : idx === 2
                              ? 'bg-amber-700/15 border-amber-700/30 text-amber-400'
                              : 'bg-white/[0.03] border-white/[0.06] text-slate-400'
                          )}
                        >
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-white">{s.name}</p>
                          <p className="text-[11px] text-slate-500">{s.contactPerson} · {s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold font-mono text-emerald-400">{s.deliveryReliability}</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {s.avgLeadTimeDays}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {s.qualityScore}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {s.priceConsistency}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{s.overallScore}</span>
                        <div className="h-1.5 w-16 rounded-full bg-white/[0.08] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            style={{ width: `${s.overallScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge tone={s.tierTone}>{s.tier}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        as={Link}
                        to="/purchases"
                        variant="secondary"
                        size="sm"
                        className="h-7 px-2.5 text-[11px]"
                      >
                        New PO
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {suppliers.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <Truck className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                <p className="font-medium text-white">No supplier scorecard data</p>
                <p className="text-xs text-slate-500 mt-1">Vendor performance metrics will calculate automatically as POs are received.</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SupplierIntelligenceView;

