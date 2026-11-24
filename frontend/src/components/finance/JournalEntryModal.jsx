import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function JournalEntryModal({
  isOpen,
  onClose,
  onSave,
  onPost,
  editingEntry = null,
  accounts = []
}) {
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState([
    { account_code: '1200', account_name: 'Merchandise Inventory Ledger', debit: 0, credit: 0, cost_center: 'Warehouse Central' },
    { account_code: '2010', account_name: 'Accounts Payable (Trade Vendors)', debit: 0, credit: 0, cost_center: 'Supply Chain' }
  ]);

  useEffect(() => {
    if (editingEntry) {
      setDescription(editingEntry.description || '');
      setReference(editingEntry.reference || '');
      setEntryDate(editingEntry.date || new Date().toISOString().slice(0, 10));
      setLines(editingEntry.lines || []);
    } else {
      setDescription('');
      setReference('');
      setEntryDate(new Date().toISOString().slice(0, 10));
      setLines([
        { account_code: '1200', account_name: 'Merchandise Inventory Ledger', debit: 0, credit: 0, cost_center: 'Warehouse Central' },
        { account_code: '2010', account_name: 'Accounts Payable (Trade Vendors)', debit: 0, credit: 0, cost_center: 'Supply Chain' }
      ]);
    }
  }, [editingEntry, isOpen]);

  const handleAddLine = () => {
    setLines([
      ...lines,
      { account_code: '1010', account_name: 'Cash on Hand (Vault)', debit: 0, credit: 0, cost_center: 'General' }
    ]);
  };

  const handleRemoveLine = (index) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleLineChange = (index, key, val) => {
    const updated = [...lines];
    if (key === 'account_code') {
      const matched = accounts.find((a) => a.code === val);
      updated[index] = {
        ...updated[index],
        account_code: val,
        account_name: matched?.name || updated[index].account_name
      };
    } else {
      updated[index] = { ...updated[index], [key]: val };
    }
    setLines(updated);
  };

  // Calculations
  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const imbalance = Math.abs(totalDebit - totalCredit);
  const isBalanced = imbalance < 0.01 && totalDebit > 0;

  const handleSubmit = (status = 'Draft') => {
    if (!description.trim()) return;
    onSave({
      id: editingEntry?.id,
      entry_number: editingEntry?.entry_number,
      date: entryDate,
      reference,
      description,
      status,
      total_debit: totalDebit,
      total_credit: totalCredit,
      lines
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-soft" />
          <span>{editingEntry ? `Edit Journal Entry ${editingEntry.entry_number}` : 'New General Ledger Journal Voucher'}</span>
        </div>
      }
      size="2xl"
    >
      <div className="space-y-4">
        {/* Header fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Posting Date</label>
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Reference / Document #</label>
            <input
              type="text"
              placeholder="e.g. PO-8892 or INV-4401"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Validation Status</label>
            <div className="h-8 flex items-center">
              {isBalanced ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" /> Balanced Entry
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/30 gap-1 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" /> Out of Balance (${imbalance.toFixed(2)})
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Voucher Description & Economic Purpose</label>
          <input
            type="text"
            placeholder="e.g. Accrual of monthly warehouse utility expenses and facility power"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
          />
        </div>

        {/* Lines Editor Table */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Journal Lines ({lines.length} items)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddLine}
              className="text-xs h-7 gap-1 text-primary-soft hover:text-white"
            >
              <Plus className="w-3.5 h-3.5" /> Add Line
            </Button>
          </div>

          <div className="rounded-lg border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-3">GL Account Code & Title</th>
                  <th className="py-2 px-3">Cost Center</th>
                  <th className="py-2 px-3 text-right">Debit ($)</th>
                  <th className="py-2 px-3 text-right">Credit ($)</th>
                  <th className="py-2 px-2 text-center w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-1.5 px-3">
                      <select
                        value={line.account_code}
                        onChange={(e) => handleLineChange(idx, 'account_code', e.target.value)}
                        className="w-full px-2 py-1 rounded bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                      >
                        {accounts.map((a) => (
                          <option key={a.code} value={a.code}>
                            {a.code} - {a.name} ({a.category})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-1.5 px-3">
                      <select
                        value={line.cost_center || 'General'}
                        onChange={(e) => handleLineChange(idx, 'cost_center', e.target.value)}
                        className="w-full px-2 py-1 rounded bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                      >
                        <option value="Retail Operations">Retail Operations</option>
                        <option value="Warehouse Central">Warehouse Central</option>
                        <option value="Supply Chain">Supply Chain</option>
                        <option value="Technology & IT">Technology & IT</option>
                        <option value="General Admin">General Admin</option>
                      </select>
                    </td>

                    <td className="py-1.5 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.debit || ''}
                        placeholder="0.00"
                        onChange={(e) => handleLineChange(idx, 'debit', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded bg-black/40 border border-white/10 text-right font-mono text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </td>

                    <td className="py-1.5 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.credit || ''}
                        placeholder="0.00"
                        onChange={(e) => handleLineChange(idx, 'credit', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded bg-black/40 border border-white/10 text-right font-mono text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </td>

                    <td className="py-1.5 px-2 text-center">
                      <button
                        type="button"
                        disabled={lines.length <= 2}
                        onClick={() => handleRemoveLine(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-20 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/10 bg-white/[0.03] font-mono font-bold text-xs">
                  <td colSpan={2} className="py-2.5 px-3 text-right text-slate-300">
                    Totals:
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-400">
                    ${totalDebit.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-400">
                    ${totalCredit.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!description.trim()}
              onClick={() => handleSubmit('Draft')}
              className="text-xs border-white/10 text-slate-200"
            >
              Save as Draft
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={!isBalanced || !description.trim()}
              onClick={() => handleSubmit('Posted')}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Post to General Ledger
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
