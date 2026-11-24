import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/client';
import { getApiErrorMessage } from '../utils/apiError';
import { PackagePlus, Plus, X, ShoppingCart, DollarSign, Truck, Boxes, PackageCheck } from 'lucide-react';
import {
  PageHeader,
  StatCard,
  Card,
  CardBody,
  DataTable,
  Badge,
  Modal,
  Select,
  Input,
  Button,
  useToast,
} from '../components/ui';

const STATUS_TONE = {
  Received: 'success',
  Ordered: 'warning',
  Cancelled: 'danger',
};

export const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [supplierId, setSupplierId] = useState('');
  const [purchaseStatus, setPurchaseStatus] = useState('Received');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [receivingId, setReceivingId] = useState(null);
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const toast = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [poRes, sRes, pRes] = await Promise.all([
        apiClient.get('/purchases/', { params: { limit: 500 } }),
        apiClient.get('/suppliers/'),
        apiClient.get('/products/', { params: { limit: 50 } })
      ]);
      setPurchases(poRes.data);
      setSuppliers(sRes.data);
      setProducts(pRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!modalOpen) return undefined;
    const timer = window.setTimeout(async () => {
      try {
        const response = await apiClient.get('/products/', {
          params: { search: productSearch.trim() || undefined, limit: 50 },
        });
        setProducts((current) => {
          const selectedIds = new Set(items.map((item) => Number(item.product_id)));
          const selected = current.filter((product) => selectedIds.has(product.id));
          return [...selected, ...response.data.filter(
            (product) => !selectedIds.has(product.id)
          )];
        });
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to search products'));
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [modalOpen, productSearch]);

  const openNewPO = () => {
    setSupplierId(suppliers[0]?.id || '');
    setPurchaseStatus('Received');
    setProductSearch('');
    setItems([{ product_id: products[0]?.id || '', quantity: 10, unit_cost: products[0]?.cost_price || 0 }]);
    setError('');
    setIdempotencyKey(crypto.randomUUID());
    setModalOpen(true);
  };

  const addItemRow = () => {
    setItems([...items, { product_id: products[0]?.id || '', quantity: 10, unit_cost: products[0]?.cost_price || 0 }]);
  };

  const removeItemRow = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const lineTotal = (row) => (parseFloat(row.quantity) || 0) * (parseFloat(row.unit_cost) || 0);
  const orderTotal = useMemo(() => items.reduce((sum, r) => sum + lineTotal(r), 0), [items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        supplier_id: supplierId ? parseInt(supplierId) : null,
        status: purchaseStatus,
        items: items.map(it => ({
          product_id: parseInt(it.product_id),
          quantity: parseInt(it.quantity),
          unit_cost: parseFloat(it.unit_cost)
        })),
        notes: purchaseStatus === 'Received'
          ? 'Inward purchase received immediately'
          : 'Purchase ordered for later receiving'
      };
      await apiClient.post('/purchases/', payload, {
        headers: { 'Idempotency-Key': idempotencyKey },
      });
      setIdempotencyKey('');
      setModalOpen(false);
      fetchData();
      toast?.success?.('Purchase order created');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to create purchase order'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReceive = async (purchase) => {
    if (receivingId !== null) return;
    setReceivingId(purchase.id);
    try {
      await apiClient.post(`/purchases/${purchase.id}/receive`);
      toast.success('Purchase received', `${purchase.purchase_number} was added to stock once.`);
      await fetchData();
    } catch (err) {
      toast.error('Could not receive purchase', getApiErrorMessage(err, 'Please review the purchase and try again.'));
    } finally {
      setReceivingId(null);
    }
  };

  const totalSpend = useMemo(
    () => purchases.filter((p) => p.status === 'Received').reduce((s, p) => s + (p.total_amount || 0), 0),
    [purchases]
  );
  const activeSuppliersCount = useMemo(
    () => new Set(purchases.filter((p) => p.supplier_name).map((p) => p.supplier_name)).size,
    [purchases]
  );
  const totalUnitsInbound = useMemo(
    () => purchases.filter((p) => p.status === 'Received').reduce((s, p) => s + (p.items?.reduce((a, it) => a + (it.quantity || 0), 0) || 0), 0),
    [purchases]
  );

  const columns = [
    {
      key: 'purchase_number',
      header: 'PO Number',
      sortable: true,
      searchValue: (po) => po.purchase_number,
      render: (po) => <span className="font-mono font-bold text-primary-soft">{po.purchase_number}</span>,
    },
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      sortValue: (po) => new Date(po.created_at).getTime(),
      render: (po) => <span className="text-caption text-content-subtle">{new Date(po.created_at).toLocaleString()}</span>,
    },
    {
      key: 'supplier_name',
      header: 'Supplier',
      sortable: true,
      searchValue: (po) => po.supplier_name || 'Direct',
      render: (po) => <span className="font-semibold text-content truncate block">{po.supplier_name || 'Direct'}</span>,
    },
    {
      key: 'items',
      header: 'Items Count',
      render: (po) => <span className="text-caption text-content-subtle">{po.items?.length || 0} products</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (po) => <Badge tone={STATUS_TONE[po.status] || 'info'}>{po.status}</Badge>,
    },
    {
      key: 'total_amount',
      header: 'Total Amount',
      align: 'right',
      sortable: true,
      sortValue: (po) => po.total_amount,
      render: (po) => <span className="font-bold text-success">${po.total_amount.toFixed(2)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (po) => po.status === 'Ordered' ? (
        <Button
          size="sm"
          icon={PackageCheck}
          loading={receivingId === po.id}
          disabled={receivingId !== null}
          onClick={() => handleReceive(po)}
        >
          Receive
        </Button>
      ) : null,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Supplier Purchases (Stock Inward)"
        description="Receive purchase orders and automatically increase product stock"
        icon={PackagePlus}
        actions={
          <Button icon={Plus} onClick={openNewPO}>
            New Inward PO
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Purchase Orders" value={purchases.length} icon={ShoppingCart} tone="info" loading={loading} />
        <StatCard title="Received Spend" value={`$${totalSpend.toFixed(2)}`} icon={DollarSign} tone="success" loading={loading} />
        <StatCard title="Active Suppliers" value={activeSuppliersCount} icon={Truck} tone="warning" loading={loading} />
        <StatCard title="Units Received" value={totalUnitsInbound} icon={Boxes} tone="info" loading={loading} />
      </div>

      <Card>
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            rows={purchases}
            rowKey={(po) => po.id}
            loading={loading}
            searchable
            pageSize={10}
            initialSort={{ key: 'created_at', direction: 'desc' }}
            emptyTitle="No purchase orders yet"
            emptyDescription="Create an inward PO to start receiving stock."
            emptyIcon={PackagePlus}
            mobileCards
          />
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Purchase Order (Inward Stock)"
        description="Create an order for later or receive stock immediately"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="purchase-form" loading={submitting}>
              {purchaseStatus === 'Received' ? 'Receive Immediately' : 'Create Order'}
            </Button>
          </>
        }
      >
        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-caption">{error}</div>
        )}
        <form id="purchase-form" onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Select Supplier"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            placeholder="Direct Procurement"
            options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
          />

          <Select
            label="Purchase Workflow"
            value={purchaseStatus}
            onChange={(e) => setPurchaseStatus(e.target.value)}
            options={[
              { value: 'Received', label: 'Receive immediately' },
              { value: 'Ordered', label: 'Order now, receive later' },
            ]}
          />

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-caption font-semibold text-content-muted">Inward Line Items</span>
              <Button type="button" variant="link" size="sm" icon={Plus} onClick={addItemRow}>
                Add Item
              </Button>
            </div>

            <Input
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Search all products by name, SKU, or barcode"
              aria-label="Search purchase products"
            />

            <div className="mt-2 rounded-lg border border-border overflow-hidden">
              <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_90px_100px_90px_36px] gap-2 px-3 py-2 bg-elevated/60 text-caption font-semibold text-content-subtle uppercase">
                <span>Product</span>
                <span>Qty</span>
                <span>Unit Cost</span>
                <span className="text-right">Total</span>
                <span />
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border">
                {items.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_90px_100px_90px_36px] gap-2 p-3 items-center">
                    <select
                      value={row.product_id}
                      onChange={(e) => {
                        const p = products.find((prod) => prod.id === parseInt(e.target.value));
                        const newItems = [...items];
                        newItems[idx].product_id = e.target.value;
                        newItems[idx].unit_cost = p ? p.cost_price : 0;
                        setItems(newItems);
                      }}
                      className="min-w-0 w-full bg-elevated border border-border rounded-md py-2 px-2.5 text-caption text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={row.quantity}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].quantity = e.target.value;
                        setItems(newItems);
                      }}
                      className="w-full bg-elevated border border-border rounded-md py-2 px-2.5 text-caption text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Cost"
                      value={row.unit_cost}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].unit_cost = e.target.value;
                        setItems(newItems);
                      }}
                      className="w-full bg-elevated border border-border rounded-md py-2 px-2.5 text-caption text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    />
                    <span className="text-caption font-semibold text-content text-right shrink-0">${lineTotal(row).toFixed(2)}</span>
                    <button
                      type="button"
                      aria-label="Remove line item"
                      onClick={() => removeItemRow(idx)}
                      disabled={items.length <= 1}
                      className="text-danger hover:text-danger p-1.5 rounded-md hover:bg-danger/10 disabled:opacity-30 disabled:cursor-not-allowed justify-self-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-3 py-2.5 bg-elevated/60 border-t border-border">
                <span className="text-caption font-semibold text-content-muted">Order Total</span>
                <span className="text-body font-bold text-success">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Purchases;
