import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  User,
  DollarSign,
  Send,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function EnterpriseInvoiceView({ invoices = [], onRefresh }) {
  const { addToast } = useToast();
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'Customer' | 'Vendor'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [previewInvoice, setPreviewInvoice] = useState(null);

  // Extended enterprise mock invoice dataset if empty
  const defaultInvoices = [
    {
      id: 'inv-101',
      type: 'Customer',
      invoice_number: 'INV-2026-09191',
      partner: 'Acme Logistics Corp',
      partner_email: 'billing@acmelogistics.com',
      date: '2026-09-19',
      due_date: '2026-10-19',
      amount: 2850.00,
      tax_amount: 235.12,
      subtotal: 2614.88,
      status: 'Paid',
      payment_method: 'ACH Transfer',
      items: [
        { desc: 'Industrial Barcode Scanner Terminals (Model X-90)', qty: 5, unit_price: 380.00, total: 1900.00 },
        { desc: 'Direct Thermal Barcode Shipping Labels (1000/roll)', qty: 25, unit_price: 28.59, total: 714.88 }
      ],
      timeline: [
        { stage: 'Draft Generated', date: '2026-09-19 09:14', actor: 'Automated POS System' },
        { stage: 'Invoice Issued & Dispatched', date: '2026-09-19 10:00', actor: 'Billing Gateway' },
        { stage: 'Payment Received', date: '2026-09-28 14:22', actor: 'JPMorgan Chase ACH' }
      ]
    },
    {
      id: 'inv-102',
      type: 'Customer',
      invoice_number: 'INV-2026-09193',
      partner: 'Summit Hardware Supply',
      partner_email: 'ap@summithardware.com',
      date: '2026-09-22',
      due_date: '2026-10-22',
      amount: 3420.00,
      tax_amount: 282.15,
      subtotal: 3137.85,
      status: 'Current',
      payment_method: 'Net 30 Terms',
      items: [
        { desc: 'Receipt Thermal Printers (Ethernet + USB)', qty: 8, unit_price: 280.00, total: 2240.00 },
        { desc: 'Heavy Duty POS Cash Drawers (Dual Media Slots)', qty: 6, unit_price: 149.64, total: 897.85 }
      ],
      timeline: [
        { stage: 'Draft Generated', date: '2026-09-22 11:30', actor: 'Marcus Chen' },
        { stage: 'Invoice Issued & Dispatched', date: '2026-09-22 11:45', actor: 'Billing Gateway' }
      ]
    },
    {
      id: 'inv-103',
      type: 'Vendor',
      invoice_number: 'BILL-2026-0889',
      partner: 'TechSupply International',
      partner_email: 'accounts@techsupply.com',
      date: '2026-10-04',
      due_date: '2026-11-04',
      amount: 2100.00,
      tax_amount: 0.00,
      subtotal: 2100.00,
      status: 'Approved',
      payment_method: 'Scheduled Wire Transfer',
      items: [
        { desc: 'Core Warehouse Network Gateway Hubs (Layer 3)', qty: 2, unit_price: 1050.00, total: 2100.00 }
      ],
      timeline: [
        { stage: 'Vendor Bill Received', date: '2026-10-04 15:20', actor: 'Procurement Intake' },
        { stage: '3-Way Match Verified', date: '2026-10-04 16:10', actor: 'ERP Matching Bot' },
        { stage: 'Finance Manager Approved', date: '2026-10-05 09:30', actor: 'Finance Controller' }
      ]
    },
    {
      id: 'inv-104',
      type: 'Customer',
      invoice_number: 'INV-2026-07920',
      partner: 'Apex Distribution Group',
      partner_email: 'finance@apexgroup.com',
      date: '2026-08-15',
      due_date: '2026-09-15',
      amount: 12400.00,
      tax_amount: 1023.00,
      subtotal: 11377.00,
      status: 'Overdue',
      payment_method: 'Wire Transfer',
      items: [
        { desc: 'Automated Conveyor Sortation Scanner Rig', qty: 2, unit_price: 5688.50, total: 11377.00 }
      ],
      timeline: [
        { stage: 'Invoice Issued', date: '2026-08-15 10:00', actor: 'Sales Operations' },
        { stage: 'Payment Overdue Notification Sent', date: '2026-09-16 08:00', actor: 'Dunning Automation' },
        { stage: 'Second Notice Dispatched', date: '2026-09-30 09:00', actor: 'Collections Specialist' }
      ]
    }
  ];

  const displayList = (invoices.length > 0 ? invoices : defaultInvoices).map(inv => ({
    ...defaultInvoices.find(d => d.invoice_number === inv.invoice_number) || inv
  }));

  const filtered = displayList.filter(inv => {
    const matchesType = filterType === 'ALL' || inv.type === filterType;
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    const matchesSearch = !searchTerm ||
      inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.partner?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">Paid</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">Approved</Badge>;
      case 'Overdue':
        return <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10">Overdue</Badge>;
      default:
        return <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10">Current</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Toggle */}
          <div className="inline-flex rounded-lg p-1 bg-[#050A16] border border-white/10">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filterType === 'ALL' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All Invoices
            </button>
            <button
              onClick={() => setFilterType('Customer')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filterType === 'Customer' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Customer (AR)
            </button>
            <button
              onClick={() => setFilterType('Vendor')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filterType === 'Vendor' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Vendor Bills (AP)
            </button>
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Current">Current</option>
            <option value="Approved">Approved</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice # or partner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              addToast({
                title: 'Invoices Exported',
                message: 'Invoice repository records exported as Excel XLSX.',
                type: 'info'
              });
            }}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Counterparty / Account</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((inv) => (
                <tr key={inv.id || inv.invoice_number} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-white flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    {inv.invoice_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={inv.type === 'Customer' ? 'primary' : 'warning'} className="text-[11px]">
                      {inv.type === 'Customer' ? 'AR Invoice' : 'AP Bill'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    {inv.partner}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {inv.date}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {inv.due_date}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    ${Number(inv.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {getStatusBadge(inv.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewInvoice(inv)}
                      className="text-xs text-primary hover:text-white hover:bg-primary/20"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Preview
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No matching invoices found in enterprise ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail / Preview Modal */}
      {previewInvoice && (
        <Modal
          isOpen={!!previewInvoice}
          onClose={() => setPreviewInvoice(null)}
          title={`Invoice Preview: ${previewInvoice.invoice_number}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-xs text-slate-300">
            {/* Header section */}
            <div className="flex justify-between items-start p-4 rounded-xl bg-[#050A16] border border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  StoreHub Enterprise Commercial Document
                </span>
                <h2 className="text-xl font-extrabold text-white mt-0.5 font-mono">
                  {previewInvoice.invoice_number}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  {getStatusBadge(previewInvoice.status)}
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-400">Terms: {previewInvoice.payment_method || 'Standard'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Amount Payable</span>
                <span className="text-2xl font-black text-primary font-mono block">
                  ${Number(previewInvoice.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-slate-400">Due: {previewInvoice.due_date}</span>
              </div>
            </div>

            {/* Billed To/From */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg border border-white/5 bg-[#050A16]">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Issued By (Entity)
                </span>
                <div className="font-semibold text-white">StoreHub International Ltd.</div>
                <div className="text-slate-400 text-[11px]">Enterprise Logistics & Retail Hub</div>
                <div className="text-slate-400 text-[11px]">EIN: 47-1928401 | VAT: US992144</div>
              </div>
              <div className="p-3.5 rounded-lg border border-white/5 bg-[#050A16]">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Counterparty ({previewInvoice.type === 'Customer' ? 'Customer' : 'Vendor'})
                </span>
                <div className="font-semibold text-white">{previewInvoice.partner}</div>
                <div className="text-slate-400 text-[11px]">{previewInvoice.partner_email || 'partner@enterprise.corp'}</div>
                <div className="text-slate-400 text-[11px]">Trade Account Verified</div>
              </div>
            </div>

            {/* Line items table */}
            <div className="rounded-lg border border-white/10 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#050A16] text-slate-400 font-semibold border-b border-white/10 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#050A16]/50">
                  {(previewInvoice.items || [
                    { desc: 'Commercial Goods & Services Delivered', qty: 1, unit_price: previewInvoice.amount, total: previewInvoice.amount }
                  ]).map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-medium text-white">{item.desc}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-300">{item.qty}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                        ${Number(item.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-white">
                        ${Number(item.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Audit Timeline */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Processing Lifecycle Audit
              </span>
              <div className="space-y-2">
                {(previewInvoice.timeline || [
                  { stage: 'Document Created', date: previewInvoice.date, actor: 'System' }
                ]).map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#050A16] border border-white/5">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-white">{step.stage}</span>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <span className="font-mono">{step.date}</span> • <span>{step.actor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addToast({
                      title: 'Print Spooler Initiated',
                      message: `Invoice ${previewInvoice.invoice_number} routed to default system printer.`,
                      type: 'info'
                    });
                  }}
                  className="text-xs border-white/10 text-slate-300"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addToast({
                      title: 'PDF Downloaded',
                      message: `Official fiscal PDF for ${previewInvoice.invoice_number} downloaded.`,
                      type: 'success'
                    });
                  }}
                  className="text-xs border-white/10 text-slate-300"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download PDF
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {previewInvoice.status !== 'Paid' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      addToast({
                        title: 'Invoice Settled',
                        message: `Marked invoice ${previewInvoice.invoice_number} as Paid in General Ledger.`,
                        type: 'success'
                      });
                      setPreviewInvoice(null);
                    }}
                    className="text-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Mark as Paid
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPreviewInvoice(null)}
                  className="text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
