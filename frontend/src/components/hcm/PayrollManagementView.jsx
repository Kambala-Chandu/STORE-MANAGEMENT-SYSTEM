import React, { useState } from 'react';
import {
  DollarSign,
  Play,
  FileText,
  Download,
  Printer,
  CheckCircle,
  Building,
  User,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function PayrollManagementView({
  payrollRuns = [],
  onExecutePayroll,
  onRefresh
}) {
  const { addToast } = useToast();
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const [newRun, setNewRun] = useState({
    period: 'October 2026',
    total_gross: 252100.00,
    total_net: 199400.00,
    total_tax_withheld: 38900.00,
    total_benefits: 13800.00,
    employee_count: 95
  });

  const handleRunSubmit = async (e) => {
    e.preventDefault();
    await onExecutePayroll(newRun);
    setIsRunModalOpen(false);
  };

  const samplePayslip = {
    employee_name: 'Elena Rostova',
    employee_code: 'SH-1002',
    designation: 'Flagship Store General Manager',
    department: 'Retail Operations',
    period: 'October 2026',
    pay_date: '2026-10-31',
    bank_account: 'JPMorgan Chase (****4892)',
    earnings: [
      { item: 'Basic Monthly Salary', amount: 5800.00 },
      { item: 'House Rent Allowance (HRA)', amount: 1200.00 },
      { item: 'Executive Special Allowance', amount: 450.00 },
      { item: 'Store Revenue Target Bonus', amount: 350.00 }
    ],
    deductions: [
      { item: 'Federal Income Tax (Withholding)', amount: 1140.00 },
      { item: 'State & City Income Tax', amount: 395.00 },
      { item: 'Comprehensive Health & Dental Insurance', amount: 240.00 },
      { item: '401(k) Voluntary Retirement Plan', amount: 390.00 }
    ]
  };

  return (
    <div className="space-y-4">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Monthly Disbursement</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            $248,600.00
          </div>
          <p className="mt-1 text-xs text-slate-400">Direct deposit automated</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Tax Withholdings (IRS)</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
            $38,400.00
          </div>
          <p className="mt-1 text-xs text-slate-400">Remitted via EFTPS</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Health & Benefits Pool</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-400 font-mono">
            $13,780.00
          </div>
          <p className="mt-1 text-xs text-slate-400">Healthcare + 401(k) matches</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Payroll Frequency</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            Monthly (Last Day)
          </div>
          <p className="mt-1 text-xs text-slate-400">Next run: Oct 31, 2026</p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Payroll Clearing:</span>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
            NACHA ACH Connected
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedPayslip(samplePayslip)}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Sample Payslip
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRunModalOpen(true)}
            className="text-xs shadow-md shadow-primary/20"
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            Execute Payroll Cycle
          </Button>
        </div>
      </div>

      {/* Payroll History Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Cycle Period</th>
                <th className="py-3 px-4">Disbursement Date</th>
                <th className="py-3 px-4 text-center">Employees</th>
                <th className="py-3 px-4 text-right">Total Gross</th>
                <th className="py-3 px-4 text-right">Tax Withholding</th>
                <th className="py-3 px-4 text-right">Benefits / 401k</th>
                <th className="py-3 px-4 text-right">Net Disbursed</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payrollRuns.map((run) => (
                <tr key={run.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {run.period}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {run.run_date}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-300 font-semibold">
                    {run.employee_count}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-200">
                    ${Number(run.total_gross).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-cyan-400">
                    ${Number(run.total_tax_withheld).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                    ${Number(run.total_benefits || 13700).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    ${Number(run.total_net).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                      {run.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPayslip({ ...samplePayslip, period: run.period })}
                      className="text-xs text-primary hover:text-white"
                    >
                      Payslips
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={!!selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          title={`Earnings & Remittance Advice: ${selectedPayslip.period}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs text-slate-300">
            {/* Header */}
            <div className="p-4 rounded-xl bg-[#050A16] border border-white/10 flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  StoreHub International Ltd. • Corporate Payroll
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  Official Employee Compensation Statement
                </h2>
                <p className="text-[11px] text-slate-400">Pay Period: {selectedPayslip.period} • Disbursed: {selectedPayslip.pay_date}</p>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                Direct Deposit Cleared
              </Badge>
            </div>

            {/* Employee metadata */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#050A16] border border-white/5">
              <div>
                <span className="text-slate-400 block text-[11px]">Employee Name & ID</span>
                <strong className="text-white text-xs">{selectedPayslip.employee_name} ({selectedPayslip.employee_code})</strong>
                <span className="text-slate-400 block text-[11px] mt-1">Role: {selectedPayslip.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Department & Bank</span>
                <strong className="text-white text-xs">{selectedPayslip.department}</strong>
                <span className="text-slate-400 block text-[11px] mt-1">Direct Deposit: {selectedPayslip.bank_account}</span>
              </div>
            </div>

            {/* Earnings vs Deductions dual tables */}
            <div className="grid grid-cols-2 gap-4">
              {/* Earnings */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Gross Earnings (+)
                </span>
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-white/5 bg-[#050A16]/50">
                      {selectedPayslip.earnings.map((e, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-2.5 text-slate-300">{e.item}</td>
                          <td className="py-2 px-2.5 text-right font-mono font-semibold text-white">
                            ${e.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                  Statutory Deductions (-)
                </span>
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-white/5 bg-[#050A16]/50">
                      {selectedPayslip.deductions.map((d, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-2.5 text-slate-300">{d.item}</td>
                          <td className="py-2 px-2.5 text-right font-mono font-semibold text-rose-400">
                            -${d.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Net Pay summary */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#050A16] to-[#0B1329] border border-white/10 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Net Direct Deposit Disbursement</span>
                <span className="text-slate-500 text-[10px]">Federal & State Withholdings Deducted</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  $5,625.00
                </span>
                <span className="text-[10px] text-slate-400 block">Funds Settled to Checking</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  addToast({
                    title: 'Payslip PDF Downloaded',
                    message: `Official PDF payslip for ${selectedPayslip.period} saved to local device.`,
                    type: 'success'
                  });
                }}
                className="text-xs border-white/10 text-slate-300"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Download PDF
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedPayslip(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Execute Payroll Modal */}
      <Modal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        title="Execute Enterprise Payroll Run"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRunSubmit} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-lg bg-primary/10 border border-primary/20 text-slate-300 leading-relaxed">
            <p className="font-semibold text-primary mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Automated NACHA Direct Deposit Protocol
            </p>
            You are authorizing corporate payroll distribution across all active employees. Ledger vouchers will post automatically to the General Ledger.
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Payroll Cycle Period</label>
            <input
              type="text"
              required
              value={newRun.period}
              onChange={(e) => setNewRun({ ...newRun, period: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#050A16] border border-white/5">
            <div>
              <span className="text-slate-400 block">Total Gross Wages</span>
              <span className="text-sm font-bold text-white font-mono">
                ${newRun.total_gross.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Tax Withheld (30%)</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">
                ${newRun.total_tax_withheld.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="col-span-2 pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-white font-semibold">Net Disbursed to Staff</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                ${newRun.total_net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Disbursement Bank Account</label>
            <select className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Payroll Reserve Account (Wells Fargo - ****1024)</option>
              <option>Operating Checking (JPMorgan Chase - ****4892)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRunModalOpen(false)}
              className="text-xs border-white/10 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="text-xs"
            >
              Authorize & Disburse
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
