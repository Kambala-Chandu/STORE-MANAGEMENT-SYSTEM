import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  CheckCircle,
  Copy,
  Share2
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export function WorkflowExportModal({ isOpen, onClose, approvals = [], auditLogs = [] }) {
  const { addToast } = useToast();
  const [exportTarget, setExportTarget] = useState('approvals'); // 'approvals' | 'audit'

  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (exportTarget === 'approvals') {
      csvContent += 'Reference,Workflow,Requester,Department,Amount,Status,Priority,Current_Level,Total_Levels,SLA_Deadline\n';
      approvals.forEach((a) => {
        csvContent += `"${a.item_ref}","${a.workflow_name}","${a.requester}","${a.department}",${a.amount || 0},"${a.status}","${a.priority}",${a.current_level},${a.total_levels},"${a.sla_deadline}"\n`;
      });
    } else {
      csvContent += 'Timestamp,Event,Reference,Actor,Details,Status\n';
      auditLogs.forEach((l) => {
        csvContent += `"${l.timestamp}","${l.event}","${l.reference}","${l.actor}","${l.details}","${l.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `storehub_${exportTarget}_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Export Generated',
      message: `${exportTarget === 'approvals' ? 'Approvals queue' : 'Audit logs'} exported to CSV successfully.`
    });
    onClose();
  };

  const handlePrint = () => {
    window.print();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Enterprise Governance & Approvals"
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Select Dataset to Export</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setExportTarget('approvals')}
              className={`p-3 rounded-xl border text-left transition ${
                exportTarget === 'approvals'
                  ? 'border-primary bg-primary/10 text-white'
                  : 'border-white/10 bg-black/20 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-semibold text-xs block">Approval Requests</span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                {approvals.length} records available
              </span>
            </button>

            <button
              type="button"
              onClick={() => setExportTarget('audit')}
              className={`p-3 rounded-xl border text-left transition ${
                exportTarget === 'audit'
                  ? 'border-primary bg-primary/10 text-white'
                  : 'border-white/10 bg-black/20 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-semibold text-xs block">Immutable Audit Log</span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                {auditLogs.length} verified events
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="block text-xs font-medium text-slate-300">Choose Format</label>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-medium text-white block">CSV / Microsoft Excel (.csv)</span>
                  <span className="text-[11px] text-slate-400">Standard RFC 4180 comma-separated values</span>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-medium text-white block">Print View / PDF Document</span>
                  <span className="text-[11px] text-slate-400">Executive formatted print-ready ledger view</span>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
