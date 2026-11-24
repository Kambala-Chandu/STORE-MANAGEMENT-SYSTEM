import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/client';
import { getApiErrorMessage } from '../utils/apiError';
import { Boxes, Plus, ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle, Layers, PackageX } from 'lucide-react';
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
  Textarea,
  Button,
  useToast,
} from '../components/ui';

const MOVEMENT_TONE = {
  RESTOCK: 'success',
  SALE: 'info',
  CORRECTION: 'warning',
  DAMAGE: 'danger',
  WASTAGE: 'danger',
};

const InventoryInner = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [adjustment, setAdjustment] = useState({ product_id: '', adjustment_type: 'RESTOCK', quantity_change: 1, notes: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, pRes] = await Promise.all([
        apiClient.get('/inventory/movements', { params: { limit: 500 } }),
        apiClient.get('/products/', { params: { limit: 500 } })
      ]);
      setMovements(mRes.data);
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

  const handleAdjust = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiClient.post('/inventory/adjust', {
        product_id: parseInt(adjustment.product_id),
        adjustment_type: adjustment.adjustment_type,
        quantity_change: parseInt(adjustment.quantity_change),
        notes: adjustment.notes
      });
      setModalOpen(false);
      fetchData();
      toast?.success?.('Stock adjustment applied');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Adjustment failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.quantity <= (p.reorder_level ?? 5)),
    [products]
  );
  const outOfStockCount = useMemo(() => products.filter((p) => p.quantity <= 0).length, [products]);
  const inboundToday = useMemo(() => {
    const today = new Date().toDateString();
    return movements.filter((m) => m.quantity > 0 && new Date(m.created_at).toDateString() === today).length;
  }, [movements]);

  const columns = [
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      sortValue: (m) => new Date(m.created_at).getTime(),
      render: (m) => <span className="text-caption text-content-subtle">{new Date(m.created_at).toLocaleString()}</span>,
    },
    {
      key: 'product',
      header: 'Product',
      sortable: true,
      sortValue: (m) => m.product_name,
      searchValue: (m) => `${m.product_name} ${m.product_sku}`,
      render: (m) => (
        <div className="min-w-0">
          <p className="font-semibold text-content truncate">{m.product_name}</p>
          <p className="text-caption text-content-subtle font-mono truncate">{m.product_sku}</p>
        </div>
      ),
    },
    {
      key: 'movement_type',
      header: 'Movement Type',
      sortable: true,
      render: (m) => <Badge tone={MOVEMENT_TONE[m.movement_type] || 'info'}>{m.movement_type}</Badge>,
    },
    {
      key: 'quantity',
      header: 'Quantity',
      align: 'right',
      sortable: true,
      sortValue: (m) => m.quantity,
      render: (m) =>
        m.quantity > 0 ? (
          <span className="inline-flex items-center gap-1 font-bold text-success justify-end">
            <ArrowUpRight className="w-4 h-4 shrink-0" /> +{m.quantity}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-bold text-danger justify-end">
            <ArrowDownRight className="w-4 h-4 shrink-0" /> {m.quantity}
          </span>
        ),
    },
    {
      key: 'reference_id',
      header: 'Reference',
      hideable: true,
      render: (m) => <span className="text-caption font-mono text-content-subtle">{m.reference_id || '-'}</span>,
    },
    {
      key: 'notes',
      header: 'Notes',
      hideable: true,
      mobileHidden: true,
      render: (m) => <span className="text-caption text-content-subtle">{m.notes || '-'}</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Stock Movements & Audit Trail"
        description="Complete log of all inventory inward, sales deductions, and adjustments"
        icon={Boxes}
        actions={
          <Button
            icon={Plus}
            onClick={() => {
              setAdjustment({ product_id: products[0]?.id || '', adjustment_type: 'RESTOCK', quantity_change: 5, notes: '' });
              setError('');
              setModalOpen(true);
            }}
          >
            Manual Stock Adjustment
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={products.length} icon={Layers} tone="info" loading={loading} />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          tone={lowStockProducts.length ? 'warning' : 'success'}
          loading={loading}
        />
        <StatCard title="Out of Stock" value={outOfStockCount} icon={PackageX} tone={outOfStockCount ? 'danger' : 'success'} loading={loading} />
        <StatCard title="Inbound Movements Today" value={inboundToday} icon={RefreshCw} tone="success" loading={loading} />
      </div>

      {lowStockProducts.length > 0 && (
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
              <h3 className="text-body font-semibold text-content">Products requiring attention</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.map((p) => (
                <Badge key={p.id} tone={p.quantity <= 0 ? 'danger' : 'warning'} dot>
                  {p.name} — {p.quantity} {p.unit}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            rows={movements}
            rowKey={(m) => m.id}
            loading={loading}
            searchable
            pageSize={10}
            initialSort={{ key: 'created_at', direction: 'desc' }}
            emptyTitle="No stock movements yet"
            emptyDescription="Adjustments, sales, and purchases will appear here."
            emptyIcon={Boxes}
            mobileCards
          />
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Manual Stock Adjustment"
        description="Correct stock levels for restocks, damage, wastage, or reconciliation"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="stock-adjust-form" loading={submitting}>Apply Adjustment</Button>
          </>
        }
      >
        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-caption">{error}</div>
        )}
        <form id="stock-adjust-form" onSubmit={handleAdjust} className="space-y-4">
          <Select
            label="Select Product *"
            value={adjustment.product_id}
            onChange={(e) => setAdjustment({ ...adjustment, product_id: e.target.value })}
            options={products.map((p) => ({ value: p.id, label: `${p.name} (Current: ${p.quantity} ${p.unit})` }))}
          />
          <Select
            label="Adjustment Reason"
            value={adjustment.adjustment_type}
            onChange={(e) => setAdjustment({ ...adjustment, adjustment_type: e.target.value })}
            options={[
              { value: 'RESTOCK', label: 'RESTOCK (+ Addition)' },
              { value: 'CORRECTION', label: 'CORRECTION (Reconciliation)' },
              { value: 'DAMAGE', label: 'DAMAGE (- Deduction)' },
              { value: 'WASTAGE', label: 'WASTAGE (- Deduction)' },
            ]}
          />
          <Input
            label="Quantity Change (+ or -)"
            type="number"
            required
            value={adjustment.quantity_change}
            onChange={(e) => setAdjustment({ ...adjustment, quantity_change: e.target.value })}
          />
          <Textarea
            label="Notes / Reason"
            rows={2}
            value={adjustment.notes}
            onChange={(e) => setAdjustment({ ...adjustment, notes: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
};

export const Inventory = InventoryInner;
export default Inventory;
