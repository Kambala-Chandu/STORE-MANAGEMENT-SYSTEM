import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Package,
  TrendingUp,
  Clock,
  AlertOctagon,
  Percent,
  Sparkles,
  ArrowRight,
  Boxes,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  cn,
} from '../ui';

export const ProductIntelligenceView = ({ productIntel, loading = false }) => {
  const [activeTab, setActiveTab] = useState('bestSelling');

  const {
    bestSelling = [],
    slowMoving = [],
    deadStock = [],
    highProfit = [],
    lowMargin = [],
    highDemand = [],
  } = productIntel || {};

  const tabs = [
    { id: 'bestSelling', label: `Best Selling (${bestSelling.length})`, icon: TrendingUp },
    { id: 'highProfit', label: `High Profit (${highProfit.length})`, icon: Percent },
    { id: 'highDemand', label: `High Demand (${highDemand.length})`, icon: Sparkles },
    { id: 'slowMoving', label: `Slow Moving (${slowMoving.length})`, icon: Clock },
    { id: 'deadStock', label: `Dead Stock (${deadStock.length})`, icon: AlertOctagon },
    { id: 'lowMargin', label: `Low Margin (${lowMargin.length})`, icon: Boxes },
  ];

  const currentList =
    activeTab === 'bestSelling'
      ? bestSelling
      : activeTab === 'highProfit'
      ? highProfit
      : activeTab === 'highDemand'
      ? highDemand
      : activeTab === 'slowMoving'
      ? slowMoving
      : activeTab === 'deadStock'
      ? deadStock
      : lowMargin;

  return (
    <div className="space-y-6">
      <Card className="border-white/[0.08] bg-[#0b1329]/[0.85] shadow-lg">
        <CardHeader
          title="Autonomous Product Catalog Intelligence"
          description="Classification engine detecting revenue velocity stars, slow inventory drags, dead capital, and margin drivers."
          actions={
            <Button as={Link} to="/products" variant="secondary" size="sm" iconRight={ArrowRight}>
              Product Catalog
            </Button>
          }
        />
        <CardBody className="p-5">
          {/* Tab Filter bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto ds-scroll pb-3 border-b border-white/[0.06] mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Catalog Items Table */}
          <div className="overflow-x-auto ds-scroll rounded-xl border border-white/[0.06]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Catalog SKU / Name</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Cost Price</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Gross Margin (%)</th>
                  <th className="py-3 px-4">Units Sold</th>
                  <th className="py-3 px-4">Revenue Generated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {currentList.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="font-mono text-[11px] text-slate-500">{item.sku} · {item.category}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-200">{item.stock} units</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      ${item.costPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ${item.sellingPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        tone={
                          item.marginPct >= 35
                            ? 'success'
                            : item.marginPct >= 20
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {item.marginPct}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.unitsSold} units
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      ${item.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        as={Link}
                        to="/products"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300"
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {currentList.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <Package className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                <p className="font-medium text-white">No items in this category</p>
                <p className="text-xs text-slate-500 mt-1">Classification updates in real-time as inventory and sales change.</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductIntelligenceView;

