import { useState, useEffect, useCallback, useMemo } from 'react';
import { financeService } from '../services/financeService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

export function useFinance() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [journals, setJournals] = useState([]);
  const [trialBalance, setTrialBalance] = useState({ accounts: [], total_debit: 0, total_credit: 0 });
  const [payables, setPayables] = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [cashAccounts, setCashAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [statements, setStatements] = useState({});
  const [taxes, setTaxes] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [costCenters, setCostCenters] = useState([]);

  // Modals state
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Smart Filters
  const [filters, setFilters] = useState({
    dateRange: 'This Month',
    branch: 'ALL',
    warehouse: 'ALL',
    department: 'ALL',
    costCenter: 'ALL',
    account: 'ALL',
    vendor: 'ALL',
    customer: 'ALL',
    status: 'ALL'
  });

  const loadAllFinanceData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        accs,
        jrnls,
        tb,
        pays,
        recs,
        cash,
        bdgts,
        stmts,
        tx,
        invs
      ] = await Promise.all([
        financeService.getAccounts(),
        financeService.getJournalEntries(),
        financeService.getTrialBalance(),
        financeService.getAccountsPayable(),
        financeService.getAccountsReceivable(),
        financeService.getCashAccounts(),
        financeService.getBudgets(),
        financeService.getFinancialStatements(),
        financeService.getTaxes(),
        financeService.getInvoices()
      ]);

      setAccounts(accs || []);
      setJournals(jrnls || []);
      setTrialBalance(tb || { accounts: [], total_debit: 0, total_credit: 0 });
      setPayables(pays || []);
      setReceivables(recs || []);
      setCashAccounts(cash || []);
      setBudgets(bdgts || []);
      setStatements(stmts || {});
      setTaxes(tx || {});
      setInvoices(invs || []);
      setExpenses(financeService.getExpenses());
      setCostCenters(financeService.getCostCenters());
    } catch (err) {
      console.error('Finance synchronization error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllFinanceData();
  }, [loadAllFinanceData]);

  // Handlers
  const handleCreateJournal = async (entryData) => {
    try {
      const created = await financeService.createJournalEntry({
        ...entryData,
        created_by: user?.username || 'Finance Controller'
      });
      setJournals((prev) => [created, ...prev]);
      addToast({
        type: 'success',
        title: 'Journal Entry Recorded',
        message: `Voucher ${created.entry_number} drafted with ${created.lines?.length || 2} balanced lines.`
      });
      setIsJournalModalOpen(false);
      setEditingJournal(null);
      return created;
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Could not record journal voucher.' });
    }
  };

  const handlePostJournal = async (id) => {
    try {
      const updated = await financeService.postJournalEntry(id);
      setJournals((prev) => prev.map((j) => (j.id === id ? updated : j)));
      addToast({
        type: 'success',
        title: 'Ledger Posted',
        message: `Journal entry ${updated.entry_number} is officially committed to the General Ledger.`
      });
    } catch {
      addToast({ type: 'error', title: 'Post Failed', message: 'Could not post journal entry.' });
    }
  };

  const handleReverseJournal = async (id) => {
    try {
      const reversed = await financeService.reverseJournalEntry(id, user?.username || 'Finance Controller');
      if (reversed) {
        setJournals((prev) => [reversed, ...prev]);
        addToast({
          type: 'info',
          title: 'Reversal Executed',
          message: `Reversal entry ${reversed.entry_number} posted with inverted debit/credit balances.`
        });
      }
    } catch {
      addToast({ type: 'error', title: 'Reversal Failed', message: 'Could not execute journal reversal.' });
    }
  };

  const handleCreateAccount = async (accData) => {
    try {
      const created = await financeService.createAccount(accData);
      setAccounts((prev) => [created, ...prev]);
      addToast({
        type: 'success',
        title: 'Account Created',
        message: `GL Account #${created.code} - ${created.name} registered in Chart of Accounts.`
      });
      return created;
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Could not create account.' });
    }
  };

  // 12 Finance KPIs
  const kpis = useMemo(() => financeService.get12FinanceKPIs(filters), [filters]);

  // Analytics charts
  const analyticsData = useMemo(() => financeService.getFinancialAnalytics(), []);

  return {
    loading,
    accounts,
    journals,
    trialBalance,
    payables,
    receivables,
    cashAccounts,
    budgets,
    statements,
    taxes,
    invoices,
    expenses,
    costCenters,
    kpis,
    analyticsData,
    // Filters
    filters,
    setFilters,
    // Modals
    isJournalModalOpen,
    setIsJournalModalOpen,
    editingJournal,
    setEditingJournal,
    isInvoiceModalOpen,
    setIsInvoiceModalOpen,
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    // Handlers
    handleCreateJournal,
    handlePostJournal,
    handleReverseJournal,
    handleCreateAccount,
    refreshData: loadAllFinanceData
  };
}
