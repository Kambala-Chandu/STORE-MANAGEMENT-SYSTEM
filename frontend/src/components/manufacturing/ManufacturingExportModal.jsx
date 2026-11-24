import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const ManufacturingExportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal title="Export Manufacturing Data" onClose={onClose} isOpen={isOpen}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Format</label>
          <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white">
            <option value="excel">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
            <option value="pdf">PDF Report (.pdf)</option>
            <option value="print">Print view</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-slate-400 mb-2">Dataset Scope</label>
          <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white">
            <option value="production_orders">Production Orders</option>
            <option value="bom">Bill of Materials</option>
            <option value="capacity">Capacity Plan</option>
            <option value="scrap">Scrap & Defects</option>
            <option value="full_audit">Full Manufacturing Audit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Period</label>
          <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="ytd">Year to Date</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => {
          // Export logic would go here
          onClose();
        }}>
          Export Data
        </Button>
      </div>
    </Modal>
  );
};
