import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  Award,
  AlertCircle,
  Clock,
  TrendingUp,
  DollarSign,
  ArrowRight,
  UserCheck,
  UserX,
  Zap,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  cn,
} from '../ui';

export const CustomerIntelligenceView = ({ customerIntel, loading = false }) => {
  const [segment, setSegment] = useState('top'); // 'top' | 'atRisk' | 'inactive' | 'fastGrowing'

  const {
    topCustomers = [],
    customersAtRisk = [],
    inactiveCustomers = [],
    fastGrowingCustomers = [],
    avgLifetimeValue = 450,
    purchaseFrequency = '2.4 / mo',
    repeatCustomerRate = '68.5%',
    totalCount = 0,
    activeCount = 0,
  } = customerIntel || {};

  const currentList =
    segment === 'top'
      ? topCustomers
      : segment === 'atRisk'
      ? customersAtRisk
      : segment === 'inactive'
      ? inactiveCustomers
      : fastGrowingCustomers;

  return (
    <div className="space-y-6">
      {/* Executive Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Avg Lifetime Value (LTV)
            </span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            ${avgLifetimeValue.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Across active account cohort profiles.
          </p>
        </Card>

        <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Repeat Customer Rate
            </span>
            <UserCheck className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-blue-400">
            {repeatCustomerRate}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Accounts with &gt;1 settled transaction.
          </p>
        </Card>

        <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Order Frequency
            </span>
            <Clock className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-purple-300">
            {purchaseFrequency}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Monthly average frequency per active patron.
          </p>
        </Card>

        <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              At-Risk VIPs
            </span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-rose-400">
            {customersAtRisk.length} accounts
          </p>
          <p className="mt-1 text-xs text-slate-400">
            High spenders inactive for &gt;35 days.
          </p>
        </Card>
      </div>

      {/* Cohort Segmentation Table */}
      <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
        <CardHeader
          title="Algorithmic Customer Cohort Segmentation"
          description="Automated RFM (Recency, Frequency, Monetary) intelligence profiling across consumer accounts."
          actions={
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
                {[
                  { id: 'top', label: `Top VIPs (${topCustomers.length})`, icon: Award },
                  { id: 'atRisk', label: `At Risk (${customersAtRisk.length})`, icon: AlertCircle },
                  { id: 'fastGrowing', label: `Fast Growing (${fastGrowingCustomers.length})`, icon: Zap },
                  { id: 'inactive', label: `Inactive (${inactiveCustomers.length})`, icon: UserX },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSegment(tab.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150',
                      segment === tab.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    )}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <Button as={Link} to="/customers" variant="secondary" size="sm" iconRight={ArrowRight}>
                Directory
              </Button>
            </div>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto ds-scroll">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Customer Account</th>
                  <th className="py-3 px-4">Total Settled Spend</th>
                  <th className="py-3 px-4">Transactions</th>
                  <th className="py-3 px-4">Avg Order Value</th>
                  <th className="py-3 px-4">Recency (Days Inactive)</th>
                  <th className="py-3 px-4">Loyalty Balance</th>
                  <th className="py-3 px-4 text-right">CRM Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {currentList.map((c) => {
                  const isAtRisk = c.daysSinceLastPurchase >= 35 && c.daysSinceLastPurchase < 90;
                  const isInactive = c.daysSinceLastPurchase >= 90;

                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{c.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{c.phone} · {c.email}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-white font-mono">
                        ${c.totalSpent.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {c.ordersCount} orders
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        ${c.aov.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('font-medium', isInactive ? 'text-slate-500' : isAtRisk ? 'text-rose-400 font-bold' : 'text-emerald-400')}>
                          {c.daysSinceLastPurchase > 365 ? 'No orders recorded' : `${c.daysSinceLastPurchase} days ago`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge tone="purple" size="sm">{c.loyaltyPoints} pts</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          as={Link}
                          to="/customers"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300"
                        >
                          View Account
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {currentList.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <Users className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                <p className="font-medium text-white">No accounts in this cohort</p>
                <p className="text-xs text-slate-500 mt-1">Customer records will automatically populate as CRM activity builds.</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CustomerIntelligenceView;

