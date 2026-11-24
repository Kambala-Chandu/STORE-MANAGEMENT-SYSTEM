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

export function CRMExportModal({ isOpen, onClose }) {
  const { addToast } = useToast();
  const [format, setFormat] = useState('excel');
  const [dataset, setDataset] = useState('pipeline_leads');
  const [period, setPeriod] = useState('current_quarter');
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      onClose();
      addToast({
        title: 'CRM Export Generated',
        message: `Successfully generated ${format.toUpperCase()} export for ${dataset.replace(/_/g, ' ').toUpperCase()} (${period.replace(/_/g, ' ').toUpperCase()}).`,
        type: 'success'
      });
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enterprise CRM & CX Data Export Center"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 text-xs text-slate-300">
        <div>
          <label className="block text-slate-400 font-semibold mb-2 uppercase text-[11px] tracking-wider">
            Target Export Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'excel', label: 'Excel (XLSX)', icon: FileSpreadsheet, color: 'text-emerald-400' },
              { id: 'pdf', label: 'Executive PDF', icon: FileText, color: 'text-rose-400' },
              { id: 'csv', label: 'Raw CSV Feed', icon: Download, color: 'text-blue-400' },
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
                      ? 'border-primary bg-primary/20 text-white shadow-sm'
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
            CRM Dataset Scope
          </label>
          <select
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary text-xs"
          >
            <option value="pipeline_leads">Sales Leads & Scoring Pipeline</option>
            <option value="deals_opportunities">Deals & Opportunities Kanban Stages</option>
            <option value="customers_360">Customer 360° Profiles & Lifetime Value</option>
            <option value="support_tickets">Helpdesk Support Tickets & SLA Logs</option>
            <option value="marketing_campaigns">Marketing Campaigns & Conversion ROI</option>
            <option value="loyalty_members">Loyalty Program Ledger & Reward Tiers</option>
            <option value="sales_activities">Sales Rep Activity Logs & Meetings</option>
            <option value="b2b_contacts">B2B Corporate Accounts & Directory</option>
            <option value="full_crm_dossier">Comprehensive Executive CRM Audit Dossier</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase text-[11px] tracking-wider">
            Reporting Date Horizon
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary text-xs"
          >
            <option value="current_month">Current Month (October 2026)</option>
            <option value="current_quarter">Current Quarter (Q4 2026)</option>
            <option value="year_to_date">Full Fiscal Year 2026 YTD</option>
            <option value="all_time">Lifetime CRM History</option>
          </select>
        </div>

        <div className="p-3 rounded-lg border border-white/5 bg-[#050A16] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-white font-medium text-xs">Customer PII & Data Privacy Masking</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Compliant
          </span>
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
            {exporting ? 'Compiling CRM Export...' : `Export ${format.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
export default CRMExportModal;
