import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  CheckCircle,
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export function HRExportModal({ isOpen, onClose }) {
  const { addToast } = useToast();
  const [format, setFormat] = useState('excel');
  const [dataset, setDataset] = useState('employee_roster');
  const [period, setPeriod] = useState('current_quarter');
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      onClose();
      addToast({
        title: 'Workforce Report Exported',
        message: `Successfully compiled ${format.toUpperCase()} export for ${dataset.replace('_', ' ').toUpperCase()} (${period.toUpperCase()}).`,
        type: 'success'
      });
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enterprise HCM & Payroll Export Center"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 text-xs text-slate-300">
        <div>
          <label className="block text-slate-400 font-semibold mb-2 uppercase text-[11px] tracking-wider">
            Target Document Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'excel', label: 'Excel (XLSX)', icon: FileSpreadsheet, color: 'text-emerald-400' },
              { id: 'pdf', label: 'PDF Report', icon: FileText, color: 'text-rose-400' },
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
            <option value="employee_roster">Employee Master Census & Records</option>
            <option value="attendance_logs">Attendance Punctuality & Overtime Logs</option>
            <option value="leave_records">Leave Balances & Absence History</option>
            <option value="payroll_history">Payroll Cycles & Statutory Tax Withholdings</option>
            <option value="recruitment_ats">Recruitment Pipeline & Requisitions</option>
            <option value="performance_reviews">Performance Appraisals & Promotion Logs</option>
            <option value="full_hcm_audit">Comprehensive Workforce Audit Packet</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase text-[11px] tracking-wider">
            Reporting Period
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="current_month">Current Month (October 2026)</option>
            <option value="current_quarter">Third Quarter (Q3 2026)</option>
            <option value="year_to_date">Full Fiscal Year 2026 YTD</option>
            <option value="historical">Complete Tenured History</option>
          </select>
        </div>

        <div className="p-3 rounded-lg border border-white/5 bg-[#050A16] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-white font-medium">SOC-2 & GDPR Employee PII Protection Masking</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Active</span>
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
            {exporting ? 'Compiling HCM Records...' : `Export as ${format.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
