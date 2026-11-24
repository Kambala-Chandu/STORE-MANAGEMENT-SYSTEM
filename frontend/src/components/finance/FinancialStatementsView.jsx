import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Layers,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Building
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function FinancialStatementsView({ statements = {} }) {
  const [statementType, setStatementType] = useState('BS'); // 'BS' | 'PL' | 'CF'

  return (
    <div className="space-y-4">
      {/* Selector & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/10 bg-[#0B1329]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatementType('BS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statementType === 'BS'
                ? 'bg-primary text-white shadow-sm shadow-primary/20'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Balance Sheet (Statement of Financial Position)
          </button>
          <button
            type="button"
            onClick={() => setStatementType('PL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statementType === 'PL'
                ? 'bg-primary text-white shadow-sm shadow-primary/20'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Profit & Loss (Income Statement)
          </button>
          <button
            type="button"
            onClick={() => setStatementType('CF')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statementType === 'CF'
                ? 'bg-primary text-white shadow-sm shadow-primary/20'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Cash Flow Statement
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs h-8 gap-1.5 border-white/10 text-slate-300 hover:text-white"
          >
            <Printer className="w-3.5 h-3.5" /> Print Statement
          </Button>
        </div>
      </div>

      {/* Statement Sheet Canvas */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] p-6 max-w-4xl mx-auto space-y-6">
        {/* Document Header */}
        <div className="text-center pb-4 border-b border-white/10 space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-soft">
            StoreHub Enterprise Solutions Inc.
          </span>
          <h3 className="text-lg font-bold text-white">
            {statementType === 'BS' && 'Consolidated Balance Sheet'}
            {statementType === 'PL' && 'Statement of Profit and Loss (Income Statement)'}
            {statementType === 'CF' && 'Statement of Cash Flows (Direct Method)'}
          </h3>
          <span className="text-xs text-slate-400 font-mono block">
            Fiscal Period Ended October 05, 2026 (Currency in USD)
          </span>
        </div>

        {/* 1. BALANCE SHEET */}
        {statementType === 'BS' && (
          <div className="space-y-5 text-xs font-mono">
            {/* ASSETS */}
            <div className="space-y-2">
              <span className="font-sans font-bold uppercase text-slate-300 tracking-wider text-xs block pb-1 border-b border-white/5">
                ASSETS
              </span>
              <div className="space-y-1 pl-3">
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Cash on Hand & Demand Deposits (JPMorgan / Wells)</span>
                  <span className="text-white font-semibold">$642,800.00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Trade Accounts Receivable (Net of Allowance)</span>
                  <span className="text-white font-semibold">$318,400.00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Merchandise Inventory Ledger Valuation</span>
                  <span className="text-white font-semibold">$1,120,450.00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400 font-bold border-t border-white/5 pt-1">
                  <span>Total Current Assets:</span>
                  <span className="text-emerald-400">$2,081,650.00</span>
                </div>
              </div>

              <div className="space-y-1 pl-3 pt-2">
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Warehouse Fixtures, POS Terminals & Equipment</span>
                  <span className="text-white font-semibold">$345,000.00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Less: Accumulated Depreciation</span>
                  <span className="text-rose-400 font-semibold">($68,000.00)</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400 font-bold border-t border-white/5 pt-1">
                  <span>Total Fixed & Non-Current Assets:</span>
                  <span className="text-emerald-400">$277,000.00</span>
                </div>
              </div>

              <div className="flex justify-between py-2 border-y border-white/10 font-bold text-sm bg-white/[0.02] px-3">
                <span className="text-white font-sans">TOTAL ASSETS:</span>
                <span className="text-emerald-400">$2,358,650.00</span>
              </div>
            </div>

            {/* LIABILITIES & EQUITY */}
            <div className="space-y-2 pt-3">
              <span className="font-sans font-bold uppercase text-slate-300 tracking-wider text-xs block pb-1 border-b border-white/5">
                LIABILITIES & SHAREHOLDERS' EQUITY
              </span>
              <div className="space-y-1 pl-3">
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Trade Accounts Payable</span>
                  <span className="text-white font-semibold">$242,500.00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Accrued Payroll & Operational Liabilities</span>
                  <span className="text-white font-semibold">$64,200.00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Sales Tax & VAT Liability Payable</span>
                  <span className="text-white font-semibold">$38,400.00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Long-Term Commercial Note Payable</span>
                  <span className="text-white font-semibold">$500,000.00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400 font-bold border-t border-white/5 pt-1">
                  <span>Total Liabilities:</span>
                  <span className="text-amber-400">$845,100.00</span>
                </div>
              </div>

              <div className="space-y-1 pl-3 pt-2">
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Common Capital Stock</span>
                  <span className="text-white font-semibold">$500,000.00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Retained Earnings</span>
                  <span className="text-white font-semibold">$1,013,550.00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400 font-bold border-t border-white/5 pt-1">
                  <span>Total Shareholders' Equity:</span>
                  <span className="text-emerald-400">$1,513,550.00</span>
                </div>
              </div>

              <div className="flex justify-between py-2 border-y border-white/10 font-bold text-sm bg-white/[0.02] px-3">
                <span className="text-white font-sans">TOTAL LIABILITIES & EQUITY:</span>
                <span className="text-emerald-400">$2,358,650.00</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. P&L */}
        {statementType === 'PL' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-white/5 text-white font-bold">
              <span>Gross Billed Revenue</span>
              <span className="text-emerald-400">$2,450,800.00</span>
            </div>
            <div className="flex justify-between py-1.5 text-slate-300 pl-3">
              <span>Cost of Goods Sold (COGS)</span>
              <span className="text-rose-400">($1,568,520.00)</span>
            </div>
            <div className="flex justify-between py-2 border-y border-white/10 text-white font-bold bg-white/[0.02] px-3">
              <span>GROSS PROFIT (36.0% Margin)</span>
              <span className="text-emerald-400">$882,280.00</span>
            </div>

            <div className="space-y-1 pl-3 pt-2">
              <span className="font-sans font-bold text-slate-400 uppercase text-[10px] block mb-1">
                Operating Expenses (OPEX)
              </span>
              <div className="flex justify-between py-1 text-slate-300">
                <span>Warehouse Logistics & Distribution</span>
                <span>$164,200.00</span>
              </div>
              <div className="flex justify-between py-1 text-slate-300">
                <span>Retail POS Operations & Salaries</span>
                <span>$118,400.00</span>
              </div>
              <div className="flex justify-between py-1 text-slate-300">
                <span>Technology, Cloud ERP & IT</span>
                <span>$58,200.00</span>
              </div>
              <div className="flex justify-between py-1 text-slate-300">
                <span>General Corporate & Admin</span>
                <span>$144,320.00</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400 font-bold border-t border-white/5 pt-1">
                <span>Total Operating Expenses:</span>
                <span className="text-amber-400">$485,120.00</span>
              </div>
            </div>

            <div className="flex justify-between py-2 border-y border-white/10 text-white font-bold text-sm bg-white/[0.02] px-3">
              <span>NET OPERATING INCOME (EBITDA):</span>
              <span className="text-emerald-400">$397,160.00</span>
            </div>
          </div>
        )}

        {/* 3. CASH FLOW */}
        {statementType === 'CF' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-1 pl-3">
              <span className="font-sans font-bold text-slate-400 uppercase text-[10px] block mb-1">
                Cash Flows from Operating Activities
              </span>
              <div className="flex justify-between py-1 text-slate-300">
                <span>Cash Receipts from Customers</span>
                <span className="text-emerald-400">$2,410,200.00</span>
              </div>
              <div className="flex justify-between py-1 text-slate-300">
                <span>Cash Paid to Trade Suppliers & Vendors</span>
                <span className="text-rose-400">($1,420,800.00)</span>
              </div>
              <div className="flex justify-between py-1 text-slate-300">
                <span>Cash Paid for Salaries & Operating Overhead</span>
                <span className="text-rose-400">($346,600.00)</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400 font-bold border-t border-white/5 pt-1">
                <span>Net Cash from Operations:</span>
                <span className="text-emerald-400">$642,800.00</span>
              </div>
            </div>

            <div className="space-y-1 pl-3 pt-2">
              <span className="font-sans font-bold text-slate-400 uppercase text-[10px] block mb-1">
                Cash Flows from Investing Activities
              </span>
              <div className="flex justify-between py-1 text-slate-300">
                <span>Capital Expenditures (Warehouse Terminals)</span>
                <span className="text-rose-400">($48,250.00)</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400 font-bold border-t border-white/5 pt-1">
                <span>Net Cash Used in Investing:</span>
                <span className="text-rose-400">($48,250.00)</span>
              </div>
            </div>

            <div className="flex justify-between py-2 border-y border-white/10 text-white font-bold text-sm bg-white/[0.02] px-3">
              <span>NET INCREASE IN CASH & EQUIVALENTS:</span>
              <span className="text-emerald-400">$594,550.00</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
