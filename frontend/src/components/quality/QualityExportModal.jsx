import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, X } from 'lucide-react';
import { Button } from '../ui';

export const QualityExportModal = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState('pdf');
  const [scope, setScope] = useState('full');
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0B1329] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl text-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold">Export Quality Data & Audits</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Export Scope</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'full', label: 'Full QMS Dossier' },
                { id: 'lots', label: 'Inspection Lots Only' },
                { id: 'capa', label: 'Open CAPA Log' },
                { id: 'audits', label: 'ISO Audits Summary' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScope(s.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    scope === s.id
                      ? 'border-primary bg-primary/10 text-white font-semibold'
                      : 'border-white/10 bg-[#050A16] text-slate-400 hover:border-white/20'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Output Format</label>
            <div className="grid grid-cols-3 gap-2">
              {['pdf', 'csv', 'xlsx'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`p-2 rounded-lg border uppercase font-mono text-center transition-all ${
                    format === f
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-white/10 bg-[#050A16] text-slate-400 hover:border-white/20'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-lg"
            >
              Cancel
            </button>
            <Button
              onClick={handleExport}
              disabled={downloading}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Compiling Dossier...' : 'Download Export'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
