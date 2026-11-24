import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Boxes,
  AlertTriangle,
  Clock,
  Calendar,
  ShoppingCart,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  ToolbarSearch,
  cn,
} from '../ui';

export const SmartInventoryForecast = ({ items = [], loading = false }) => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const matchesRisk =
        riskFilter === 'All' ||
        (riskFilter === 'Critical' && (item.riskLevel === 'Critical' || item.riskLevel === 'Out of Stock')) ||
        item.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [items, search, riskFilter]);

  const riskCounts = useMemo(() => {
    return {
      all: items.length,
      critical: items.filter((i) => i.riskLevel === 'Critical' || i.riskLevel === 'Out of Stock').length,
      high: items.filter((i) => i.riskLevel === 'High').length,
      moderate: items.filter((i) => i.riskLevel === 'Moderate').length,
      low: items.filter((i) => i.riskLevel === 'Low').length,
    };
  }, [items]);

  return (
    <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
      <CardHeader
        title="Smart Inventory Depletion & Reorder Forecasting"
        description="Predictive burn-rate modeling calculates exact stockout dates and automated replenishment requirements."
        actions={
          <div className="flex items-center gap-2">
            <Button as={Link} to="/purchases" variant="primary" size="sm" iconRight={ArrowRight}>
              Procurement Hub
            </Button>
          </div>
        }
      />
      <CardBody className="p-5">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.06] pb-4 mb-4">
          <div className="w-full sm:w-72">
            <ToolbarSearch
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product or SKU..."
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto ds-scroll pb-1">
            <Filter className="h-3.5 w-3.5 text-slate-500 mr-1 flex-shrink-0" />
            {[
              { id: 'All', label: `All (${riskCounts.all})` },
              { id: 'Critical', label: `Urgent (${riskCounts.critical})`, color: 'text-rose-400' },
              { id: 'High', label: `High (${riskCounts.high})`, color: 'text-amber-400' },
              { id: 'Moderate', label: `Moderate (${riskCounts.moderate})`, color: 'text-blue-400' },
              { id: 'Low', label: `Safe (${riskCounts.low})`, color: 'text-emerald-400' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setRiskFilter(f.id)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150 whitespace-nowrap',
                  riskFilter === f.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto ds-scroll rounded-xl border border-white/[0.06]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Product Catalog Item</th>
                <th className="py-3 px-4">Stock on Hand</th>
                <th className="py-3 px-4">Daily Burn Rate</th>
                <th className="py-3 px-4">Depletion Horizon</th>
                <th className="py-3 px-4">Reorder Urgency</th>
                <th className="py-3 px-4">Rec. Reorder Qty</th>
                <th className="py-3 px-4">Target Order Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredItems.slice(0, 12).map((item) => {
                const isCritical = item.daysRemaining <= 4;
                const isHigh = item.daysRemaining <= 10 && !isCritical;

                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="font-mono text-[11px] text-slate-500">{item.sku} · {item.category}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn('font-bold font-mono', item.currentStock <= item.reorderLevel ? 'text-amber-400' : 'text-slate-200')}>
                        {item.currentStock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      ~{item.dailyBurnRate} / day
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Clock className={cn('h-3.5 w-3.5', isCritical ? 'text-rose-400 animate-pulse' : isHigh ? 'text-amber-400' : 'text-slate-400')} />
                        <span className={isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-slate-300'}>
                          {item.daysRemaining === 0 ? 'Out of stock' : `${item.daysRemaining} days left`}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        tone={
                          item.riskLevel === 'Out of Stock' || item.riskLevel === 'Critical'
                            ? 'danger'
                            : item.riskLevel === 'High'
                            ? 'warning'
                            : item.riskLevel === 'Moderate'
                            ? 'info'
                            : 'success'
                        }
                      >
                        {item.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-blue-400 font-mono">
                        +{item.recommendedReorderQty} units
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono">
                        ~${Math.round(item.estimatedCost).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className={cn('font-medium', item.recommendedReorderDate === 'Immediate Action' ? 'text-rose-400 font-bold' : '')}>
                        {item.recommendedReorderDate}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        as={Link}
                        to="/purchases"
                        variant={isCritical ? 'primary' : 'secondary'}
                        size="sm"
                        className="h-7 px-2.5 text-[11px]"
                      >
                        Create PO
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Boxes className="h-8 w-8 mx-auto text-slate-600 mb-2" />
              <p className="font-medium text-white">No products matching forecast filter</p>
              <p className="text-xs text-slate-500 mt-1">All catalog items have sufficient runway under current criteria.</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default SmartInventoryForecast;

