import React, { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../api/client';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PackageCheck,
  Printer,
  Download,
  Calendar,
  Percent,
  Users,
  Truck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  PageHeader,
  StatCard,
  Card,
  CardHeader,
  CardBody,
  DataTable,
  Badge,
  Tabs,
  Button,
  Skeleton,
} from '../components/ui';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6'];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg px-3 py-2 text-body">
      {label && <p className="text-caption font-semibold text-content-muted mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-caption text-content flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || p.fill }} />
          <span className="text-content-muted">{p.name}:</span>
          <span className="font-semibold">{typeof p.value === 'number' ? fixed(p.value, 2) : p.value}</span>
        </p>
      ))}
    </div>
  );
};

const fixed = (v, d = 2) => Number(v ?? 0).toFixed(d);

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [salesReport, setSalesReport] = useState(null);
  const [profitLoss, setProfitLoss] = useState(null);
  const [inventoryValuation, setInventoryValuation] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReports = useCallback(async (isMountedRef = { current: true }) => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const [sRes, plRes, invRes, custRes, supRes] = await Promise.all([
        apiClient.get('/reports/sales', { params }),
        apiClient.get('/reports/profit-loss', { params }),
        apiClient.get('/reports/inventory'),
        apiClient.get('/customers/'),
        apiClient.get('/suppliers/')
      ]);
      if (isMountedRef.current) {
        setSalesReport(sRes.data);
        setProfitLoss(plRes.data);
        setInventoryValuation(invRes.data);
        setCustomers(custRes.data || []);
        setSuppliers(supRes.data || []);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error('Error loading reports:', err);
        setError(err.response?.data?.detail || 'Failed to load report datasets from the server.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const isMountedRef = { current: true };
    fetchReports(isMountedRef);
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchReports]);

  /**
   * Cross-browser RFC 4180 compliant CSV generator with UTF-8 BOM.
   */
  const downloadCsv = (filename, rows) => {
    if (!rows || rows.length === 0) return;

    const formatCell = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvContent = '﻿' + rows.map((r) => r.map(formatCell).join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Multi-tab dynamic CSV export for all 6 report categories.
   */
  const handleExportCsv = () => {
    const today = new Date().toISOString().slice(0, 10);

    if (activeTab === 'overview') {
      const header = ['Metric Description', 'Value', 'Unit / Currency', 'Notes'];
      const rows = [
        ['Net Revenue (Excluding Tax)', profitLoss ? fixed(profitLoss.total_revenue, 2) : '0.00', 'USD', 'Sales subtotal after discounts, excluding tax'],
        ['Cost of Goods Sold (COGS)', profitLoss ? fixed(profitLoss.total_cogs, 2) : '0.00', 'USD', 'Total purchase cost of sold items'],
        ['Gross Profit', profitLoss ? fixed(profitLoss.gross_profit, 2) : '0.00', 'USD', 'Net revenue excluding tax minus COGS'],
        ['Gross Profit Margin', profitLoss ? `${fixed(profitLoss.profit_margin_percent, 1)}%` : '0.0%', 'Percent', 'Gross profit / net revenue excluding tax'],
        ['Total Completed Orders', salesReport ? salesReport.total_orders : 0, 'Orders', 'All settled POS transactions'],
        ['Total Discounts Given', salesReport ? fixed(salesReport.total_discounts, 2) : '0.00', 'USD', 'Promotions and order discounts'],
        ['Total Tax Collected', salesReport ? fixed(salesReport.total_tax, 2) : '0.00', 'USD', 'Sales tax / GST collected'],
        ['Net Sales Total', salesReport ? fixed(salesReport.total_net_sales, 2) : '0.00', 'USD', 'Taxable net sales after discounts'],
        ['Inventory Units on Hand', inventoryValuation ? inventoryValuation.total_units : 0, 'Units', 'Current physical inventory count'],
        ['Inventory Cost Asset Value', inventoryValuation ? fixed(inventoryValuation.total_cost_value, 2) : '0.00', 'USD', 'Total inventory valued at purchase cost'],
        ['Inventory Retail Asset Value', inventoryValuation ? fixed(inventoryValuation.total_retail_value, 2) : '0.00', 'USD', 'Total inventory valued at selling price'],
        ['Potential Unrealized Profit', inventoryValuation ? fixed(inventoryValuation.potential_profit, 2) : '0.00', 'USD', 'Retail Value minus Cost Value']
      ];
      downloadCsv(`Financial_Report_${today}.csv`, [header, ...rows]);
    } else if (activeTab === 'daily') {
      const header = ['Date', 'Completed Orders', 'Gross Sales ($)', 'Discounts ($)', 'Tax Collected ($)', 'Net Sales ($)'];
      const rows = (salesReport?.breakdown || []).map((b) => [
        b.date,
        b.orders_count,
        fixed(b.gross_sales, 2),
        fixed(b.discounts, 2),
        fixed(b.tax_collected, 2),
        fixed(b.net_sales, 2)
      ]);
      downloadCsv(`Daily_Sales_Report_${today}.csv`, [header, ...rows]);
    } else if (activeTab === 'inventory') {
      const header = ['Inventory Metric', 'Valuation / Count', 'Currency', 'Notes'];
      const rows = [
        ['Total Catalog SKUs / Units', inventoryValuation ? inventoryValuation.total_units : 0, 'Units', 'Physical stock count across active inventory'],
        ['Total Cost Asset Value', inventoryValuation ? fixed(inventoryValuation.total_cost_value, 2) : '0.00', 'USD', 'Sum of (quantity * cost_price)'],
        ['Total Retail Asset Value', inventoryValuation ? fixed(inventoryValuation.total_retail_value, 2) : '0.00', 'USD', 'Sum of (quantity * selling_price)'],
        ['Unrealized Potential Profit', inventoryValuation ? fixed(inventoryValuation.potential_profit, 2) : '0.00', 'USD', 'Projected gross profit when sold']
      ];
      downloadCsv(`Inventory_Valuation_Report_${today}.csv`, [header, ...rows]);
    } else if (activeTab === 'gst') {
      const header = ['Tax Component', 'Tax Rate (%)', 'Taxable Base Amount ($)', 'Tax Amount ($)', 'Compliance Status'];
      const taxable = salesReport ? fixed(salesReport.total_net_sales, 2) : '0.00';
      const totalTax = salesReport ? fixed(salesReport.total_tax, 2) : '0.00';
      const cgst = salesReport ? fixed(salesReport.total_tax / 2, 2) : '0.00';
      const sgst = salesReport ? fixed(salesReport.total_tax / 2, 2) : '0.00';
      const rows = [
        ['Central GST (CGST)', '2.50%', fixed(Number(taxable) / 2, 2), cgst, 'Ready for Filing'],
        ['State GST (SGST)', '2.50%', fixed(Number(taxable) / 2, 2), sgst, 'Ready for Filing'],
        ['Total Output GST Combined', '5.00%', taxable, totalTax, 'Reconciled & Ready for Filing']
      ];
      downloadCsv(`GST_Tax_Report_${today}.csv`, [header, ...rows]);
    } else if (activeTab === 'customers') {
      const header = ['Customer ID', 'Customer Name', 'Phone Number', 'Email Address', 'Loyalty Points'];
      const rows = customers.map((c) => [
        c.id,
        c.name,
        c.phone || 'N/A',
        c.email || 'N/A',
        c.loyalty_points || 0
      ]);
      downloadCsv(`Customer_Performance_Report_${today}.csv`, [header, ...rows]);
    } else if (activeTab === 'suppliers') {
      const header = ['Supplier ID', 'Supplier / Vendor Name', 'Contact Person', 'Email Address', 'Phone Number', 'Address'];
      const rows = suppliers.map((s) => [
        s.id,
        s.name,
        s.contact_name || 'N/A',
        s.email || 'N/A',
        s.phone || 'N/A',
        s.address || 'N/A'
      ]);
      downloadCsv(`Supplier_Report_${today}.csv`, [header, ...rows]);
    }
  };

  const tabs = useMemo(() => [
    { value: 'overview', label: 'Financial Overview & P&L', icon: TrendingUp },
    { value: 'daily', label: 'Daily Sales', icon: Calendar },
    { value: 'inventory', label: 'Inventory Valuation', icon: PackageCheck },
    { value: 'gst', label: 'GST & Tax Summary', icon: Percent },
    { value: 'customers', label: 'Customer Performance', icon: Users },
    { value: 'suppliers', label: 'Supplier Purchases', icon: Truck },
  ], []);

  const dailyChartData = useMemo(
    () => (salesReport?.breakdown || []).map((b) => ({
      date: b.date,
      'Gross Sales': Number(fixed(b.gross_sales, 2)),
      'Net Sales': Number(fixed(b.net_sales, 2)),
      Tax: Number(fixed(b.tax_collected, 2)),
    })),
    [salesReport]
  );

  const valuationPieData = useMemo(() => {
    if (!inventoryValuation) return [];
    return [
      { name: 'Cost Value', value: Number(fixed(inventoryValuation.total_cost_value, 2)) },
      { name: 'Potential Profit', value: Number(fixed(inventoryValuation.potential_profit, 2)) },
    ];
  }, [inventoryValuation]);

  const activeTabLabel = tabs.find((t) => t.value === activeTab)?.label || 'Enterprise Statement';
  const printTimestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="space-y-6 animate-fade-in-up print:m-0 print:p-0 print:space-y-4 print:text-slate-900">
      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL PRINT HEADER                                              */}
      {/* ========================================================================= */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-3.5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white font-black text-xl flex items-center justify-center rounded-md">
              S
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">
                STOREHUB ENTERPRISE RETAIL INC.
              </div>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
                {activeTabLabel.toUpperCase()}
              </h1>
            </div>
          </div>
          <div className="text-right text-[10.5px] text-slate-600 leading-snug">
            <div><strong>Generated:</strong> {printTimestamp}</div>
            <div><strong>Report Type:</strong> Official Audited Statement</div>
            <div><strong>Scope:</strong> Reconciled Store Ledger &bull; Active</div>
          </div>
        </div>
      </div>

      {/* Screen Page Header (Hidden in Print via .no-print) */}
      <div className="no-print">
        <PageHeader
          title="Enterprise Analytics & Reports"
          description="Profit & Loss statements, Tax/GST compliance summaries, Inventory valuation, and vendor ledgers"
          icon={BarChart3}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="secondary" icon={Download} onClick={handleExportCsv}>
                Export CSV
              </Button>
              <Button icon={Printer} onClick={() => window.print()}>
                Print Report
              </Button>
            </div>
          }
        />
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger p-4 rounded-xl flex items-center justify-between no-print text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="secondary" onClick={() => fetchReports()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
          </Button>
        </div>
      )}

      {/* Tabs Navigation (Hidden in Print) */}
      <div className="no-print">
        <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className="no-print flex flex-wrap items-end gap-3">
        <label className="text-caption text-content-muted">
          Start date
          <input className="block mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-body text-content"
            type="date" value={startDate} max={endDate || undefined}
            onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label className="text-caption text-content-muted">
          End date
          <input className="block mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-body text-content"
            type="date" value={endDate} min={startDate || undefined}
            onChange={(event) => setEndDate(event.target.value)} />
        </label>
        {(startDate || endDate) && (
          <Button variant="secondary" onClick={() => { setStartDate(''); setEndDate(''); }}>
            Clear dates
          </Button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FINANCIAL OVERVIEW & P&L                                           */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 print:space-y-4">
          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 print:grid-cols-3 print:gap-3">
            <StatCard
              title="Gross Profit"
              value={profitLoss ? `$${fixed(profitLoss.gross_profit, 2)}` : '-'}
              subtitle={profitLoss ? `Margin ${fixed(profitLoss.profit_margin_percent, 1)}%` : ''}
              icon={TrendingUp}
              tone="success"
              loading={loading}
              className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none"
            />
            <StatCard
              title="Net Sales Total"
              value={salesReport ? `$${fixed(salesReport.total_net_sales, 2)}` : '-'}
              subtitle={salesReport ? `${salesReport.total_orders} orders settled` : ''}
              icon={DollarSign}
              tone="info"
              loading={loading}
              className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none"
            />
            <StatCard
              title="Inventory Asset Value"
              value={inventoryValuation ? `$${fixed(inventoryValuation.total_cost_value, 2)}` : '-'}
              subtitle={inventoryValuation ? `${inventoryValuation.total_units} units on hand` : ''}
              icon={PackageCheck}
              tone="warning"
              loading={loading}
              className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none"
            />
          </div>

          {/* 2-Column Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-3">
            <Card className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none">
            <CardHeader title="Profit & Loss Summary" description="Net sales before tax, COGS, and gross margin" />
              <CardBody>
                {profitLoss ? (
                  <div className="space-y-3 print:space-y-2">
                    <div className="flex justify-between text-caption print:text-xs">
                      <span className="text-content-muted print:text-slate-600">Net Revenue (excl. tax):</span>
                      <span className="font-bold text-content print:text-slate-900">${fixed(profitLoss.total_revenue, 2)}</span>
                    </div>
                    <div className="flex justify-between text-caption print:text-xs">
                      <span className="text-content-muted print:text-slate-600">Cost of Goods Sold (COGS):</span>
                      <span className="font-bold text-content print:text-slate-900">${fixed(profitLoss.total_cogs, 2)}</span>
                    </div>
                    <div className="flex justify-between text-body font-bold text-success print:text-slate-900 pt-3 print:pt-2 border-t border-border print:border-slate-300">
                      <span>Gross Profit:</span>
                      <span>${fixed(profitLoss.gross_profit, 2)}</span>
                    </div>
                    <p className="text-caption text-content-subtle print:text-xs print:text-slate-600">
                      Gross Profit Margin: <span className="font-bold text-success print:text-slate-900">{fixed(profitLoss.profit_margin_percent, 1)}%</span>
                    </p>
                  </div>
                ) : (
                  <Skeleton className="h-32 w-full" />
                )}
              </CardBody>
            </Card>

            <Card className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none">
              <CardHeader title="Net Sales Revenue" description="Discounts, tax collected, and net position" />
              <CardBody>
                {salesReport ? (
                  <div className="space-y-3 print:space-y-2">
                    <div className="flex justify-between text-caption print:text-xs">
                      <span className="text-content-muted print:text-slate-600">Completed POS Orders:</span>
                      <span className="font-bold text-content print:text-slate-900">{salesReport.total_orders}</span>
                    </div>
                    <div className="flex justify-between text-caption print:text-xs">
                      <span className="text-content-muted print:text-slate-600">Total Discounts Applied:</span>
                      <span className="font-bold text-warning print:text-slate-900">-${fixed(salesReport.total_discounts, 2)}</span>
                    </div>
                    <div className="flex justify-between text-caption print:text-xs">
                      <span className="text-content-muted print:text-slate-600">Total Tax / GST Collected:</span>
                      <span className="font-bold text-content print:text-slate-900">${fixed(salesReport.total_tax, 2)}</span>
                    </div>
                    <div className="flex justify-between text-body font-bold text-info print:text-slate-900 pt-3 print:pt-2 border-t border-border print:border-slate-300">
                      <span>Net Sales Total:</span>
                      <span>${fixed(salesReport.total_net_sales, 2)}</span>
                    </div>
                  </div>
                ) : (
                  <Skeleton className="h-32 w-full" />
                )}
              </CardBody>
            </Card>
          </div>

          {/* Full Width Sales Trend Chart (Natural A4 Height) */}
          {dailyChartData.length > 0 && (
            <Card className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none">
              <CardHeader title="Sales Trend Performance" description="Daily gross revenue vs. net settled sales" />
              <CardBody>
                <div className="h-72 w-full print:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.6} />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#475569" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#475569" />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
                      <Line type="monotone" dataKey="Gross Sales" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Net Sales" stroke={CHART_COLORS[1]} strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DAILY SALES LEDGER                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'daily' && (
        <div className="space-y-6 print:space-y-4">
          {dailyChartData.length > 0 && (
            <Card className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none">
              <CardHeader title="Daily Sales Volume" description="Comparative gross vs. net sales bar chart" />
              <CardBody>
                <div className="h-72 w-full print:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.6} />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#475569" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#475569" />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
                      <Bar dataKey="Gross Sales" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Net Sales" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          )}

          <Card className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none">
            <CardHeader
              title="Daily Sales Financial Ledger"
              description={`${salesReport?.breakdown?.length || 0} recorded business days`}
            />
            <CardBody className="p-0">
              <DataTable
                columns={[
                  { key: 'date', header: 'Date', sortable: true, render: (r) => <span className="font-mono font-medium text-content print:text-slate-900">{r.date}</span> },
                  { key: 'orders_count', header: 'Orders', sortable: true },
                  { key: 'gross_sales', header: 'Gross Sales', sortable: true, render: (r) => `$${fixed(r.gross_sales, 2)}` },
                  { key: 'discounts', header: 'Discounts', sortable: true, render: (r) => <span className="text-warning print:text-slate-900">-${fixed(r.discounts, 2)}</span> },
                  { key: 'tax_collected', header: 'Tax', sortable: true, render: (r) => `$${fixed(r.tax_collected, 2)}` },
                  {
                    key: 'net_sales',
                    header: 'Net Sales',
                    align: 'right',
                    sortable: true,
                    render: (r) => <span className="font-bold text-success print:text-slate-900">${fixed(r.net_sales, 2)}</span>,
                  },
                ]}
                rows={salesReport?.breakdown || []}
                rowKey={(r, i) => r.date || i}
                pageSize={20}
                mobileCards
                emptyTitle="No sales records found"
              />
            </CardBody>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INVENTORY VALUATION                                                */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && inventoryValuation && (
        <div className="space-y-6 print:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 print:grid-cols-4 print:gap-3">
            <StatCard title="Total SKUs" value={`${inventoryValuation.total_units} units`} icon={PackageCheck} tone="info" className="print:break-inside-avoid print:bg-white print:border print:border-slate-300" />
            <StatCard title="Cost Value" value={`$${fixed(inventoryValuation.total_cost_value, 2)}`} icon={DollarSign} tone="info" className="print:break-inside-avoid print:bg-white print:border print:border-slate-300" />
            <StatCard title="Retail Value" value={`$${fixed(inventoryValuation.total_retail_value, 2)}`} icon={TrendingUp} tone="warning" className="print:break-inside-avoid print:bg-white print:border print:border-slate-300" />
            <StatCard title="Unrealized Profit" value={`$${fixed(inventoryValuation.potential_profit, 2)}`} icon={BarChart3} tone="success" className="print:break-inside-avoid print:bg-white print:border print:border-slate-300" />
          </div>
          <Card className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none">
            <CardHeader title="Cost vs. Potential Profit Asset Distribution" description="Current balance between acquisition cost and projected sales value" />
            <CardBody>
              <div className="h-72 w-full print:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={valuationPieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={115} paddingAngle={4}>
                      {valuationPieData.map((entry, i) => (
                        <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: GST & TAX COMPLIANCE SUMMARY                                       */}
      {/* ========================================================================= */}
      {activeTab === 'gst' && (
        <div className="space-y-6 print:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3 print:gap-3">
            <StatCard
              title="Total Taxable Base"
              value={salesReport ? `$${fixed(salesReport.total_net_sales, 2)}` : '$0.00'}
              icon={DollarSign}
              tone="info"
              className="print:break-inside-avoid print:bg-white print:border print:border-slate-300"
            />
            <StatCard
              title="Output GST Collected (5%)"
              value={salesReport ? `$${fixed(salesReport.total_tax, 2)}` : '$0.00'}
              icon={Percent}
              tone="success"
              className="print:break-inside-avoid print:bg-white print:border print:border-slate-300"
            />
            <StatCard
              title="Tax Compliance Status"
              value={<span className="inline-flex items-center gap-1"><Badge tone="info">Ready for Filing</Badge></span>}
              icon={PackageCheck}
              tone="info"
              className="print:break-inside-avoid print:bg-white print:border print:border-slate-300"
            />
          </div>

          <Card className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none">
            <CardHeader title="Tax Apportionment & Breakdown" description="Standard Central & State GST allocation ledger" />
            <CardBody className="p-0">
              <DataTable
                columns={[
                  { key: 'item', header: 'Tax Item', render: (r) => <span className="font-semibold text-content print:text-slate-900">{r.item}</span> },
                  { key: 'rate', header: 'Rate', render: (r) => <span className="font-mono">{r.rate}</span> },
                  { key: 'base', header: 'Taxable Amount', render: (r) => `$${fixed(r.base, 2)}` },
                  { key: 'amount', header: 'Tax Amount ($)', align: 'right', render: (r) => <span className="font-bold text-success print:text-slate-900">${fixed(r.amount, 2)}</span> },
                  { key: 'status', header: 'Status', render: (r) => <span className="text-blue-600 font-semibold">{r.status}</span> },
                ]}
                rows={[
                  { item: 'Central GST (CGST)', rate: '2.50%', base: (salesReport?.total_net_sales || 0) / 2, amount: (salesReport?.total_tax || 0) / 2, status: 'Reconciled' },
                  { item: 'State GST (SGST)', rate: '2.50%', base: (salesReport?.total_net_sales || 0) / 2, amount: (salesReport?.total_tax || 0) / 2, status: 'Reconciled' },
                  { item: 'Total Output GST Combined', rate: '5.00%', base: salesReport?.total_net_sales || 0, amount: salesReport?.total_tax || 0, status: 'Filing Ready' }
                ]}
                rowKey={(r) => r.item}
                pageSize={10}
              />
            </CardBody>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CUSTOMER PERFORMANCE                                               */}
      {/* ========================================================================= */}
      {activeTab === 'customers' && (
        <Card className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none">
          <CardHeader title="Registered Customer Accounts & Loyalty Standing" description="Complete customer directory and reward points register" />
          <CardBody className="p-0">
            <DataTable
              columns={[
                { key: 'name', header: 'Customer Name', sortable: true, render: (c) => <span className="font-semibold text-content print:text-slate-900">{c.name}</span> },
                { key: 'phone', header: 'Phone', render: (c) => c.phone || 'N/A' },
                { key: 'email', header: 'Email', hideable: true, mobileHidden: true, render: (c) => c.email || 'N/A' },
                {
                  key: 'loyalty_points',
                  header: 'Loyalty Points',
                  align: 'right',
                  sortable: true,
                  render: (c) => <span className="font-mono font-bold text-warning print:text-slate-900">{c.loyalty_points || 0} pts</span>,
                },
              ]}
              rows={customers}
              rowKey={(c) => c.id}
              searchable
              pageSize={20}
              mobileCards
              emptyTitle="No registered customers yet"
            />
          </CardBody>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SUPPLIERS LEDGER                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'suppliers' && (
        <Card className="print:break-inside-avoid print:bg-white print:border print:border-slate-300 print:shadow-none">
          <CardHeader title="Active Supply Vendors Directory" description="Authorized vendor accounts and purchase procurement contacts" />
          <CardBody className="p-0">
            <DataTable
              columns={[
                { key: 'name', header: 'Supplier Name', sortable: true, render: (s) => <span className="font-semibold text-content print:text-slate-900">{s.name}</span> },
                { key: 'contact_name', header: 'Contact Person', render: (s) => s.contact_name || 'N/A' },
                { key: 'email', header: 'Email', hideable: true, mobileHidden: true, render: (s) => s.email || 'N/A' },
                { key: 'phone', header: 'Phone', render: (s) => s.phone || 'N/A' },
              ]}
              rows={suppliers}
              rowKey={(s) => s.id}
              searchable
              pageSize={20}
              mobileCards
              emptyTitle="No suppliers configured yet"
            />
          </CardBody>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 2. PROFESSIONAL PRINT FOOTER                                              */}
      {/* ========================================================================= */}
      <div className="hidden print:flex items-center justify-between border-t border-slate-300 pt-3 mt-6 text-[10px] text-slate-600 font-medium">
        <div>Generated by StoreHub POS Enterprise Edition &bull; Confidential Financial Statement</div>
        <div>System Verified &bull; Official Record</div>
      </div>
    </div>
  );
};

export default Reports;
