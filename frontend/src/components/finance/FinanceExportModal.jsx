import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Image,
  CheckCircle,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export function FinanceExportModal({ isOpen, onClose }) {
  const { addToast } = useToast();
  const [format, setFormat] = useState('excel'); // 'excel' | 'pdf' | 'csv' | 'print' | 'png'
  const [dataset, setDataset] = useState('full_ledger');
  const [period, setPeriod] = useState('q3_2026');
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      onClose();
      addToast({
        title: 'Financial Document Exported',
        message: `Successfully generated ${format.toUpperCase()} export for ${dataset.replace('_', ' ').toUpperCase()} (${period.toUpperCase()}).`,
        type: 'success'
      });
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enterprise Financial Document Export Center"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 text-xs text-slate-300">
        <div>
          <label className="block text-slate-400 font-semibold mb-2 uppercase text-[11px] tracking-wider">
            Target Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'excel', label: 'Excel (XLSX)', icon: FileSpreadsheet, color: 'text-emerald-400' },
              { id: 'pdf', label: 'PDF Document', icon: FileText, color: 'text-rose-400' },
              { id: 'csv', label: 'Raw CSV', icon: Download, color: 'text-blue-400' },
              { id: 'print', label: 'Printable Sheet', icon: Printer, color: 'text-amber-400' }
            ].map((f) => {
              const Icon = f.icon;
              const isSelected = format === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={`p-3 rounded-lg border text-left flex flex-col items-center justify-center gap-1.5 transition ${
                    isSelected
                      ? 'border-primary bg-primary/20 text-white'
                      : 'border-white/10 bg-[#050A16] hover:bg-white/5 text-slate-400'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${f.color}`} />
                  <span className="font-semibold text-center text-[11px]">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase text-[11px] tracking-wider">
            Dataset Scope
          </label>
          <select
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="full_ledger">Complete General Ledger & Journal Vouchers</option>
            <option value="trial_balance">Standard Trial Balance & Chart of Accounts</option>
            <option value="financial_statements">Consolidated Financial Statements (BS, P&L, CF)</option>
            <option value="ap_aging">Accounts Payable (AP) Aging & Vendor Ledger</option>
            <option value="ar_aging">Accounts Receivable (AR) Aging & Statements</option>
            <option value="tax_schedules">Statutory Tax Schedules (GST/VAT)</option>
            <option value="cost_center_budgets">Cost Center & Department Budget Allocations</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase text-[11px] tracking-wider">
            Accounting Period
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="current_month">Current Month (October 2026)</option>
            <option value="q3_2026">Third Quarter 2026 (Q3)</option>
            <option value="q2_2026">Second Quarter 2026 (Q2)</option>
            <option value="fy_2026">Full Fiscal Year 2026 YTD</option>
            <option value="fy_2025">Fiscal Year 2025 (Historical Audited)</option>
          </select>
        </div>

        <div className="p-3 rounded-lg border border-white/5 bg-[#050A16] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-white font-medium">Enterprise Cryptographic E-Signature Stamp</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Included</span>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-white/10 text-slate-300"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={exporting}
            onClick={handleExport}
            className="text-xs shadow-md shadow-primary/20"
          >
            {exporting ? 'Compiling Financial Data...' : `Export as ${format.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
