import React, { useEffect, useState, useRef, useMemo } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { printReceipt } from '../utils/printReceipt';
import { downloadInvoicePdf } from '../utils/downloadInvoicePdf';
import {
  Receipt,
  Search,
  Printer,
  Eye,
  X,
  ScanLine,
  Mail,
  Download,
  Trash2,
  Calendar,
  CreditCard,
  RefreshCw,
  DollarSign,
  Hash,
} from 'lucide-react';
import {
  PageHeader,
  Breadcrumbs,
  Card,
  CardBody,
  Input,
  Select,
  Button,
  Badge,
  StatCard,
  DataTable,
  Modal,
  useToast,
} from '../components/ui';

export const SalesHistory = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const toast = useToast();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);

  // Barcode search input
  const [barcodeInput, setBarcodeInput] = useState('');
  const barcodeInputRef = useRef(null);

  // Advanced Filters
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date-desc');

  const showToast = (type, message) => {
    const fn = type === 'error' ? toast.error : type === 'warning' ? toast.warning : toast.success;
    fn(message);
  };

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = {
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage
      };
      if (search.trim()) params.search = search.trim();
      if (paymentFilter !== 'ALL') params.payment_method = paymentFilter;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (minAmount) params.min_amount = parseFloat(minAmount);
      if (maxAmount) params.max_amount = parseFloat(maxAmount);

      const res = await apiClient.get('/sales/', { params });
      setSales(res.data);
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, paymentFilter, startDate, endDate, minAmount, maxAmount]);

  const handleBarcodeSearch = async (e) => {
    e.preventDefault();
    const query = barcodeInput.trim();
    if (!query) return;

    try {
      setLoading(true);
      const res = await apiClient.get(`/sales/invoice/${encodeURIComponent(query)}`);
      setSelectedSale(res.data);
      setBarcodeInput('');
      showToast('success', `Found Invoice: ${res.data.invoice_number}`);
    } catch (err) {
      showToast('error', `Invoice Not Found for: "${query}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSale = async (sale) => {
    if (!isAdmin) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to void Invoice ${sale.invoice_number}?\n\nThe invoice will remain in history and its ${sale.items?.length || 0} line items will be restored to stock.`
    );
    if (!confirmDelete) return;

    try {
      await apiClient.delete(`/sales/${sale.id}`);
      showToast('success', `Invoice ${sale.invoice_number} voided and inventory restocked`);
      setSelectedSale(null);
      fetchSales();
    } catch (err) {
      showToast('error', err.response?.data?.detail || 'Failed to void invoice');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setPaymentFilter('ALL');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    fetchSales();
  };

  // Client-side sort if needed
  const sortedSales = [...sales].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'date-asc') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'amount-desc') return b.total_amount - a.total_amount;
    if (sortBy === 'amount-asc') return a.total_amount - b.total_amount;
    if (sortBy === 'invoice') return a.invoice_number.localeCompare(b.invoice_number);
    return 0;
  });

  // Summary KPIs computed from currently loaded page of sales
  const summary = useMemo(() => {
    const completed = sortedSales.filter((sale) => sale.status === 'Completed');
    const totalRevenue = completed.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const count = sortedSales.length;
    const avg = completed.length > 0 ? totalRevenue / completed.length : 0;
    return { totalRevenue, count, avg };
  }, [sortedSales]);

  const paymentOptions = [
    { value: 'ALL', label: 'All Payment Methods' },
    { value: 'CASH', label: 'Cash' },
    { value: 'CARD', label: 'Card' },
    { value: 'UPI', label: 'UPI / Digital' },
    { value: 'CREDIT', label: 'Store Credit' },
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest Date' },
    { value: 'date-asc', label: 'Oldest Date' },
    { value: 'amount-desc', label: 'Highest Amount' },
    { value: 'amount-asc', label: 'Lowest Amount' },
    { value: 'invoice', label: 'Invoice Number' },
  ];

  const columns = [
    {
      key: 'invoice_number',
      header: 'Invoice #',
      sortable: true,
      render: (sale) => <span className="font-mono font-bold text-primary-soft">{sale.invoice_number}</span>,
    },
    {
      key: 'created_at',
      header: 'Date & Time',
      sortable: true,
      mobileHidden: true,
      render: (sale) => (
        <span className="text-content-muted">
          {new Date(sale.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
        </span>
      ),
    },
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      render: (sale) => <span className="font-medium text-content">{sale.customer_name || 'Walk-in Customer'}</span>,
    },
    {
      key: 'cashier_name',
      header: 'Cashier',
      mobileHidden: true,
      render: (sale) => <span className="text-content-muted">{sale.cashier_name || 'Staff'}</span>,
    },
    {
      key: 'payment_method',
      header: 'Payment',
      render: (sale) => <Badge tone="info">{sale.payment_method}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (sale) => (
        <Badge tone={sale.status === 'Completed' ? 'success' : 'danger'}>{sale.status}</Badge>
      ),
    },
    {
      key: 'total_amount',
      header: 'Total',
      align: 'right',
      sortable: true,
      render: (sale) => (
        <span className="font-mono font-bold text-content tabular-nums">${sale.total_amount.toFixed(2)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (sale) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon-sm" icon={Eye} aria-label="Open Invoice Details" onClick={() => setSelectedSale(sale)} />
          <Button variant="ghost" size="icon-sm" icon={Printer} aria-label="Print Tax Invoice" className="text-info" onClick={() => printReceipt(sale)} />
          <Button variant="ghost" size="icon-sm" icon={Download} aria-label="Download PDF" className="text-success" onClick={() => downloadInvoicePdf(sale)} />
          <Button variant="ghost" size="icon-sm" icon={Mail} aria-label="Email not available" title="Email delivery is not available in version 1" disabled />
          {isAdmin && sale.status !== 'Voided' && (
            <Button variant="ghost" size="icon-sm" icon={Trash2} aria-label="Void Invoice" className="text-danger" onClick={() => handleDeleteSale(sale)} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Sales Invoice History"
        description="Enterprise POS sales lookup, tax invoice verification, and settlement ledger"
        icon={Receipt}
        breadcrumb={<Breadcrumbs items={[{ label: 'Sales' }, { label: 'History' }]} />}
        actions={
          <form onSubmit={handleBarcodeSearch} className="flex w-full sm:w-auto items-center gap-2 bg-elevated border border-primary/40 p-1.5 rounded-xl shadow-sm min-w-0">
            <div className="pl-2 text-primary-soft flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider shrink-0">
              <ScanLine className="w-4 h-4" />
              <span className="hidden sm:inline">Scan:</span>
            </div>
            <input
              ref={barcodeInputRef}
              type="text"
              aria-label="Scan or enter invoice barcode"
              placeholder="INV-2026..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="bg-surface border border-border text-content font-mono text-caption rounded-lg px-3 py-1.5 flex-1 sm:flex-none sm:w-48 min-w-0 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <Button type="submit" size="sm">Find</Button>
          </form>
        }
      />

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Invoices (this page)" value={summary.count} icon={Hash} tone="info" loading={loading} />
        <StatCard title="Completed Revenue (this page)" value={`$${summary.totalRevenue.toFixed(2)}`} icon={DollarSign} tone="success" loading={loading} />
        <StatCard title="Average Completed Sale" value={`$${summary.avg.toFixed(2)}`} icon={CreditCard} tone="primary" loading={loading} />
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardBody className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              icon={Search}
              placeholder="Search Invoice or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchSales()}
              aria-label="Search invoice or customer"
            />
            <Select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              options={paymentOptions}
              aria-label="Filter by payment method"
            />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label="Start date"
              title="Start Date"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="End date"
              title="End Date"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border text-caption">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-content-subtle">Amount:</span>
              <input
                type="number"
                placeholder="Min $"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                aria-label="Minimum amount"
                className="bg-elevated border border-border rounded-lg px-2 py-1.5 w-20 text-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary tabular-nums"
              />
              <span className="text-content-subtle">-</span>
              <input
                type="number"
                placeholder="Max $"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                aria-label="Maximum amount"
                className="bg-elevated border border-border rounded-lg px-2 py-1.5 w-20 text-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary tabular-nums"
              />
              <Button variant="secondary" size="sm" onClick={fetchSales}>Apply Filter</Button>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 min-w-[10rem]">
                <span className="text-content-subtle shrink-0">Sort By:</span>
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={sortOptions} className="!py-1.5" />
              </div>
              <Button variant="ghost" size="sm" icon={RefreshCw} onClick={resetFilters}>Reset</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Sales Invoices Table */}
      <Card className="!p-0 overflow-hidden">
        <DataTable
          columns={columns}
          rows={sortedSales}
          rowKey={(sale) => sale.id}
          loading={loading}
          onRowClick={(sale) => setSelectedSale(sale)}
          emptyTitle="No sales invoices found"
          emptyDescription="Try adjusting the filters or reset to view all invoices."
          emptyIcon={Receipt}
          mobileCards
          mobileTitle={(sale) => sale.invoice_number}
        />
      </Card>

      {/* Pagination Bar (server-side, kept separate from DataTable's local pagination) */}
      <div className="flex items-center justify-between text-caption text-content-subtle px-1">
        <div>Showing {sortedSales.length} items (Page {currentPage})</div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Previous page"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </Button>
          <span className="font-semibold text-content">Page {currentPage}</span>
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Next page"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={sortedSales.length < itemsPerPage}
          >
            ›
          </Button>
        </div>
      </div>

      {/* Invoice Details Modal */}
      <Modal
        open={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title={selectedSale ? `Invoice ${selectedSale.invoice_number}` : ''}
        description="Invoice Details"
        size="lg"
        footer={
          selectedSale && (
            <div className="flex flex-wrap items-center justify-between gap-3 w-full">
              {isAdmin && selectedSale.status !== 'Voided' ? (
                <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDeleteSale(selectedSale)}>
                  Void Invoice
                </Button>
              ) : <div />}
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="secondary" size="sm" icon={Mail} title="Email delivery is not available in version 1" disabled>Email Not Available</Button>
                <Button variant="secondary" size="sm" icon={Download} onClick={() => downloadInvoicePdf(selectedSale)}>Download PDF</Button>
                <Button variant="primary" size="sm" icon={Printer} onClick={() => printReceipt(selectedSale)}>Print Tax Invoice</Button>
              </div>
            </div>
          )
        }
      >
        {selectedSale && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-caption">
              <div className="bg-elevated p-3 rounded-lg border border-border">
                <span className="text-content-subtle block mb-1">Customer</span>
                <span className="font-semibold text-content">{selectedSale.customer_name || 'Walk-in'}</span>
              </div>
              <div className="bg-elevated p-3 rounded-lg border border-border">
                <span className="text-content-subtle block mb-1">Date & Time</span>
                <span className="font-semibold text-content">
                  {new Date(selectedSale.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="bg-elevated p-3 rounded-lg border border-border">
                <span className="text-content-subtle block mb-1">Payment Method</span>
                <span className="font-semibold text-primary-soft uppercase">{selectedSale.payment_method}</span>
              </div>
              <div className="bg-elevated p-3 rounded-lg border border-border">
                <span className="text-content-subtle block mb-1">Status / Total</span>
                <Badge tone={selectedSale.status === 'Completed' ? 'success' : 'danger'}>{selectedSale.status}</Badge>
                <span className="font-bold text-content font-mono tabular-nums ml-2">${selectedSale.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Item List */}
            <div className="space-y-2">
              <span className="text-caption font-bold text-content-subtle uppercase">Purchased Items</span>
              <div className="bg-elevated border border-border rounded-lg overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-caption text-content-muted min-w-[420px]">
                  <thead className="bg-surface text-caption uppercase font-bold text-content-subtle">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedSale.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-medium text-content">{it.product_name}</td>
                        <td className="py-2.5 px-3 text-center tabular-nums">{it.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">${it.unit_price.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-content tabular-nums">
                          ${it.subtotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default SalesHistory;
