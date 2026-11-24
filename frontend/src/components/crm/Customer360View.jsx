import React, { useState } from 'react';
import {
  Users,
  Eye,
  Building,
  Phone,
  Mail,
  DollarSign,
  Award,
  Calendar,
  Clock,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function Customer360View({
  customers = [],
  onRefresh
}) {
  const { addToast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const getTierBadge = (tier) => {
    if (tier?.includes('Platinum') || tier?.includes('Diamond')) {
      return <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-[10px] font-bold">{tier}</Badge>;
    }
    if (tier?.includes('Gold')) {
      return <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px] font-bold">{tier}</Badge>;
    }
    return <Badge variant="outline" className="border-slate-500/30 text-slate-300 bg-slate-500/10 text-[10px]">{tier}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Enterprise Accounts: <strong className="text-white font-mono">{customers.length}</strong>
          </span>
          <div className="hidden sm:inline-flex rounded-lg p-0.5 bg-[#050A16] border border-white/10 ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Card Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${viewMode === 'table' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Data Table
            </button>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            addToast({
              title: 'Customer Directory Synchronized',
              message: 'Account balances and LTV metrics refreshed from ERP sales ledger.',
              type: 'info'
            });
          }}
          className="text-xs border-white/10 text-slate-300 hover:text-white"
        >
          Synchronize Accounts
        </Button>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((cust) => (
            <div
              key={cust.id}
              className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4 hover:border-primary/40 transition group cursor-pointer"
              onClick={() => setSelectedCustomer(cust)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                    {cust.customer_code}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 group-hover:text-primary transition">
                    {cust.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{cust.industry || cust.type}</p>
                </div>
                {getTierBadge(cust.tier)}
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[#050A16] border border-white/5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Lifetime Value (LTV)</span>
                  <strong className="text-emerald-400 font-mono text-sm font-extrabold">
                    ${Number(cust.lifetime_value || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Orders Placed</span>
                  <strong className="text-white font-mono text-sm">{cust.total_orders} Orders</strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-white/5 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Loyalty Points:</span>
                  <span className="text-amber-400 font-mono font-bold text-[11px]">{cust.loyalty_points?.toLocaleString()} pts</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Rep: <strong className="text-white">{cust.assigned_rep}</strong></span>
                <span className="text-primary font-medium flex items-center gap-1 text-[11px]">
                  Customer 360° <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Account Code</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Industry / Type</th>
                  <th className="py-3 px-4 text-center">Membership Tier</th>
                  <th className="py-3 px-4 text-right">LTV Gross</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4">Account Lead</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      {cust.customer_code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {cust.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {cust.industry || cust.type}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getTierBadge(cust.tier)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      ${Number(cust.lifetime_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                      {cust.total_orders}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {cust.assigned_rep}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(cust)}
                        className="text-xs text-primary hover:text-white"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        360° Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer 360 Deep Profile Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer 360° Dossier: ${selectedCustomer.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs text-slate-300">
            {/* Header section */}
            <div className="p-4 rounded-xl bg-[#050A16] border border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                    {selectedCustomer.customer_code}
                  </span>
                  {getTierBadge(selectedCustomer.tier)}
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                    {selectedCustomer.status}
                  </Badge>
                </div>
                <h2 className="text-xl font-extrabold text-white mt-1.5">{selectedCustomer.name}</h2>
                <p className="text-xs text-slate-400">{selectedCustomer.industry} • {selectedCustomer.address}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Cumulative LTV</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ${Number(selectedCustomer.lifetime_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-slate-400 block">Credit Line: ${Number(selectedCustomer.credit_limit || 50000).toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#050A16] border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Total Invoiced Orders</span>
                <span className="text-lg font-bold text-white font-mono">{selectedCustomer.total_orders}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#050A16] border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Loyalty Reward Points</span>
                <span className="text-lg font-bold text-amber-400 font-mono">{selectedCustomer.loyalty_points?.toLocaleString()} pts</span>
              </div>
              <div className="p-3 rounded-lg bg-[#050A16] border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Account Executive</span>
                <span className="text-xs font-bold text-white truncate block mt-1">{selectedCustomer.assigned_rep}</span>
              </div>
            </div>

            {/* Recent Purchase History */}
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Recent Enterprise Purchase Transactions
              </span>
              <div className="rounded-lg border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Order #</th>
                      <th className="py-2.5 px-3">Items Purchased</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#050A16]/50">
                    {(selectedCustomer.recent_purchases || []).map((p, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-mono font-bold text-primary">{p.order_id}</td>
                        <td className="py-2 px-3 text-white font-medium">{p.items}</td>
                        <td className="py-2 px-3 text-slate-400 font-mono">{p.date}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">
                          ${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Communication Timeline */}
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Interaction & Engagement Timeline
              </span>
              <div className="space-y-2">
                {(selectedCustomer.timeline || []).map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#050A16] border border-white/5 flex items-start gap-2.5">
                    <div className="p-1 rounded bg-primary/20 text-primary mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{step.type}</span>
                        <span className="text-[10px] text-slate-500 font-mono">• {step.date}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">{step.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedCustomer(null)}
                className="text-xs"
              >
                Close Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
