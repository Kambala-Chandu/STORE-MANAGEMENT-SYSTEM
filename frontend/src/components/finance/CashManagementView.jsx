import React, { useState } from 'react';
import {
  DollarSign,
  Building,
  ArrowRightLeft,
  CheckCircle,
  Plus,
  RefreshCw,
  Wallet,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function CashManagementView({ cashAccounts = [] }) {
  const { addToast } = useToast();
  const [accounts, setAccounts] = useState(cashAccounts);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [fromAccount, setFromAccount] = useState('Operating Checking (JPMorgan Chase)');
  const [toAccount, setToAccount] = useState('Payroll Reserve (Wells Fargo)');
  const [transferAmount, setTransferAmount] = useState('25000');

  const totalCash = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  const handleReconcile = (accId) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === accId
          ? { ...a, unreconciled: 0, last_reconciled: new Date().toISOString().slice(0, 10) }
          : a
      )
    );
    addToast({
      type: 'success',
      title: 'Bank Reconciled',
      message: 'Account statement matched 100% against General Ledger transactions.'
    });
  };

  const handleExecuteTransfer = () => {
    const amt = parseFloat(transferAmount) || 0;
    if (amt <= 0) return;

    setAccounts((prev) =>
      prev.map((a) => {
        if (a.name === fromAccount) return { ...a, balance: a.balance - amt };
        if (a.name === toAccount) return { ...a, balance: a.balance + amt };
        return a;
      })
    );

    addToast({
      type: 'success',
      title: 'Inter-Account Transfer Complete',
      message: `$${amt.toLocaleString()} transferred from ${fromAccount} to ${toAccount}.`
    });
    setIsTransferOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/10 bg-[#0B1329]">
        <div>
          <span className="text-xs text-slate-400 block mb-0.5">Consolidated Cash & Liquid Reserves</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            ${totalCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsTransferOpen(true)}
          className="text-xs h-8 gap-1.5 bg-primary hover:bg-primary-hover"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" /> Inter-Account Funds Transfer
        </Button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="p-5 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-white block">{acc.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">{acc.account_number}</span>
              </div>

              <div className="my-2">
                <span className="text-[10px] text-slate-400 block">Verified Ledger Balance</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  ${Number(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="space-y-1 text-xs pt-2 border-t border-white/5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Unreconciled Delta:</span>
                  <span className={acc.unreconciled > 0 ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                    ${Number(acc.unreconciled || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Last Reconciled:</span>
                  <span className="text-slate-400">{acc.last_reconciled}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              {acc.unreconciled === 0 ? (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle className="w-3 h-3" /> Fully Reconciled
                </span>
              ) : (
                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3" /> Pending Clear
                </span>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReconcile(acc.id)}
                disabled={acc.unreconciled === 0}
                className="h-7 text-[11px] border-white/10 text-slate-300 hover:text-white"
              >
                Reconcile
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Inter-Account Transfer Modal */}
      <Modal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        title="Execute Inter-Account Bank Transfer"
        size="md"
      >
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Source Account (Debit)</label>
            <select
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name} (${Number(a.balance).toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Destination Account (Credit)</label>
            <select
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name} (${Number(a.balance).toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Transfer Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <Button variant="ghost" size="sm" onClick={() => setIsTransferOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExecuteTransfer}
              className="text-xs bg-primary hover:bg-primary-hover"
            >
              Confirm Wire / Transfer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
