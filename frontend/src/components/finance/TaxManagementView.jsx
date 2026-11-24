import React, { useState } from 'react';
import {
  Receipt,
  FileCheck,
  Calendar,
  AlertCircle,
  Download,
  Building,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Percent,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function TaxManagementView({ taxes = {} }) {
  const { addToast } = useToast();
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('ALL');
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filingPeriod, setFilingPeriod] = useState('Q3-2026');

  const taxCollected = taxes.tax_collected_sales || 74500.00;
  const taxPaid = taxes.tax_paid_purchases || 36100.00;
  const netLiability = taxes.net_tax_liability || (taxCollected - taxPaid);

  const taxSchedules = [
    {
      id: 'tx-gst-1',
      jurisdiction: 'Federal GST',
      rate: '5.00%',
      type: 'Value Added Goods',
      salesTaxable: 890000.00,
      collected: 44500.00,
      inputCredit: 21500.00,
      netPayable: 23000.00,
      status: 'Accrued',
      dueDate: '2026-10-31'
    },
    {
      id: 'tx-state-2',
      jurisdiction: 'State Retail Sales Tax',
      rate: '3.25%',
      type: 'POS Merchant Sales',
      salesTaxable: 923000.00,
      collected: 30000.00,
      inputCredit: 14600.00,
      netPayable: 15400.00,
      status: 'Accrued',
      dueDate: '2026-10-31'
    },
    {
      id: 'tx-vat-3',
      jurisdiction: 'Cross-Border VAT Import',
      rate: '7.50%',
      type: 'Customs Procurement',
      salesTaxable: 145000.00,
      collected: 0.00,
      inputCredit: 10875.00,
      netPayable: -10875.00,
      status: 'Credit Carried Forward',
      dueDate: '2026-11-15'
    },
    {
      id: 'tx-exc-4',
      jurisdiction: 'Special Warehousing Levy',
      rate: '1.20%',
      type: 'Storage & Freight',
      salesTaxable: 210000.00,
      collected: 2520.00,
      inputCredit: 1200.00,
      netPayable: 1320.00,
      status: 'Settled',
      dueDate: '2026-09-30'
    }
  ];

  const filteredSchedules = selectedJurisdiction === 'ALL'
    ? taxSchedules
    : taxSchedules.filter(t => t.jurisdiction.toLowerCase().includes(selectedJurisdiction.toLowerCase()));

  const handleFileReturn = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsFileModalOpen(false);
      addToast({
        title: 'Tax Return Dispatched',
        message: `Filing packet for ${filingPeriod} ($${netLiability.toLocaleString('en-US', { minimumFractionDigits: 2 })}) transmitted to Revenue Authority gateway with e-sign verification.`,
        type: 'success'
      });
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-400">Tax Collected (Sales)</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            ${taxCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">Output tax on customer invoices</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-400">Tax Paid (Input Credit)</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            ${taxPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">Input tax credit from vendor bills</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-400">Net Tax Liability</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400 tracking-tight">
            ${netLiability.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-400">Current quarter remittance due</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-400">Filing Deadline</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            {taxes.filing_due_date || 'Oct 31, 2026'}
          </div>
          <p className="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> 26 Days Remaining
          </p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/10 bg-[#0B1329]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jurisdiction Filter:</span>
          <select
            value={selectedJurisdiction}
            onChange={(e) => setSelectedJurisdiction(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Tax Authorities</option>
            <option value="Federal">Federal GST</option>
            <option value="State">State Sales Tax</option>
            <option value="VAT">Cross-Border VAT</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              addToast({
                title: 'Tax Ledger Audit Exported',
                message: 'Detailed statutory tax ledger breakdown downloaded as CSV.',
                type: 'info'
              });
            }}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Audit Report
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsFileModalOpen(true)}
            className="text-xs shadow-md shadow-primary/20"
          >
            <FileCheck className="w-3.5 h-3.5 mr-1.5" />
            E-File Quarterly Return
          </Button>
        </div>
      </div>

      {/* Tax Schedules Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Statutory Tax Liabilities & Schedule
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated sales tax, GST, and input tax credit ledger reconciliation
            </p>
          </div>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
            Compliant
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Authority & Jurisdiction</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-center">Rate</th>
                <th className="py-3 px-4 text-right">Taxable Gross</th>
                <th className="py-3 px-4 text-right">Output Tax (+)</th>
                <th className="py-3 px-4 text-right">Input Tax (-)</th>
                <th className="py-3 px-4 text-right">Net Remittance</th>
                <th className="py-3 px-4 text-center">Filing Due</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSchedules.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {row.jurisdiction}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {row.type}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-primary">
                    {row.rate}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                    ${row.salesTaxable.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-medium">
                    ${row.collected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-cyan-400">
                    ${row.inputCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    {row.netPayable < 0 ? `-$${Math.abs(row.netPayable).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `$${row.netPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-400 font-mono">
                    {row.dueDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-semibold ${
                        row.status === 'Settled'
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          : row.status === 'Credit Carried Forward'
                          ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
                          : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#050A16]/80 border-t border-white/10 font-semibold text-slate-300">
              <tr>
                <td colSpan={4} className="py-3.5 px-4 uppercase text-slate-400 tracking-wider">
                  Consolidated Tax Ledger Balance
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-emerald-400">
                  ${taxCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-cyan-400">
                  ${taxPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-amber-400 font-bold text-sm">
                  ${netLiability.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td colSpan={2} className="py-3.5 px-4 text-center text-xs text-slate-400">
                  Ready for Remittance
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* E-File Return Modal */}
      <Modal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        title="Electronic Tax Return Submission (E-Filing)"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-lg bg-primary/10 border border-primary/20 text-slate-300 leading-relaxed">
            <p className="font-semibold text-primary mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Direct Statutory Gateway Transmission
            </p>
            You are filing statutory declarations for federal and state jurisdictions. Remittances will be drawn from the primary operating bank account.
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Filing Tax Period</label>
            <select
              value={filingPeriod}
              onChange={(e) => setFilingPeriod(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Q3-2026">Q3 2026 (Jul 01 - Sep 30, 2026)</option>
              <option value="M09-2026">September 2026 Monthly Summary</option>
              <option value="M10-2026">October 2026 Flash Estimate</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#050A16] border border-white/5">
            <div>
              <span className="text-slate-400 block">Total Output Tax (Gross)</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                ${taxCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Total Input Credits</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">
                ${taxPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="col-span-2 pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-white font-semibold">Net Remittance Settlement</span>
              <span className="text-base font-extrabold text-amber-400 font-mono">
                ${netLiability.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Settlement Bank Account</label>
            <select className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Operating Checking (JPMorgan Chase - ****4892)</option>
              <option>Payroll Reserve (Wells Fargo - ****1024)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFileModalOpen(false)}
              className="text-xs border-white/10 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={submitting}
              onClick={handleFileReturn}
              className="text-xs"
            >
              {submitting ? 'Authenticating & Submitting...' : 'Confirm & E-File Return'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
