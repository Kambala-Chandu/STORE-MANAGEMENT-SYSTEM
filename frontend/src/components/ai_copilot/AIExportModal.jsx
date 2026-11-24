import React from 'react';

export const AIExportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#0B1329] border border-white/10 p-6 rounded shadow-2xl w-96">
        <h2 className="text-white text-lg mb-4">Export AI Data</h2>
        <select className="w-full bg-white/5 border border-white/10 text-white p-2 mb-4 rounded">
          <option>PDF Report</option><option>CSV Data</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
          <button onClick={onClose} className="px-4 py-2 bg-primary text-white rounded">Export</button>
        </div>
      </div>
    </div>
  );
};
