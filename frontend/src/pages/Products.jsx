import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { getApiErrorMessage } from '../utils/apiError';
import { Package, Plus, Edit2, Trash2, AlertTriangle, RefreshCw, Boxes, DollarSign, Layers } from 'lucide-react';
import {
  PageHeader, Breadcrumbs, Card, CardBody, DataTable, Badge, Button,
  Modal, ConfirmDialog, Input, Select, Toolbar, ToolbarGroup, StatCard, ErrorBanner
} from '../components/ui';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    description: '',
    category_id: '',
    supplier_id: '',
    cost_price: 0,
    selling_price: 0,
    quantity: 0,
    reorder_level: 10,
    unit: 'pcs',
    is_active: true
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const [pRes, cRes, sRes] = await Promise.all([
        apiClient.get('/products/', {
          params: {
            low_stock_only: lowStockFilter,
            search: productSearch.trim() || undefined,
            skip: productPage * 25,
            limit: 25,
          },
        }),
        apiClient.get('/categories/'),
        apiClient.get('/suppliers/')
      ]);
      setProducts(pRes.data);
      setHasNextPage(pRes.data.length === 25);
      setCategories(cRes.data);
      setSuppliers(sRes.data);
    } catch (err) {
      console.error('Error loading products:', err);
      setLoadError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(fetchData, 250);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lowStockFilter, productSearch, productPage]);

  const openCreateModal = () => {
    setEditProduct(null);
    setFormData({
      name: '',
      sku: '',
      barcode: '',
      description: '',
      category_id: categories[0]?.id || '',
      supplier_id: suppliers[0]?.id || '',
      cost_price: 0,
      selling_price: 0,
      quantity: 0,
      reorder_level: 10,
      unit: 'pcs',
      is_active: true
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      barcode: prod.barcode || '',
      description: prod.description || '',
      category_id: prod.category_id || '',
      supplier_id: prod.supplier_id || '',
      cost_price: prod.cost_price,
      selling_price: prod.selling_price,
      quantity: prod.quantity,
      reorder_level: prod.reorder_level,
      unit: prod.unit,
      is_active: prod.is_active
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : null,
        cost_price: parseFloat(formData.cost_price) || 0,
        selling_price: parseFloat(formData.selling_price) || 0,
        quantity: parseInt(formData.quantity) || 0,
        reorder_level: parseInt(formData.reorder_level) || 10
      };

      if (editProduct) {
        await apiClient.put(`/products/${editProduct.id}`, payload);
      } else {
        await apiClient.post('/products/', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save product'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await apiClient.delete(`/products/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, 'Failed to delete product'));
    } finally {
      setDeleting(false);
    }
  };

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.quantity <= p.reorder_level).length;
  const inventoryValue = products.reduce((sum, p) => sum + (p.cost_price || 0) * (p.quantity || 0), 0);
  const totalRetailValue = products.reduce((sum, p) => sum + (p.selling_price || 0) * (p.quantity || 0), 0);

  const columns = [
    {
      key: 'sku',
      header: 'SKU / Code',
      sortable: true,
      render: (p) => <span className="font-mono text-xs text-primary-soft font-semibold">{p.sku}</span>
    },
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
      render: (p) => <span className="font-semibold text-content break-words">{p.name}</span>
    },
    {
      key: 'category_name',
      header: 'Category',
      sortable: true,
      render: (p) => <span className="text-caption text-content-muted">{p.category_name || '-'}</span>
    },
    {
      key: 'cost_price',
      header: 'Cost',
      sortable: true,
      align: 'right',
      render: (p) => <span className="text-caption text-content-muted">${p.cost_price.toFixed(2)}</span>
    },
    {
      key: 'selling_price',
      header: 'Selling Price',
      sortable: true,
      align: 'right',
      render: (p) => <span className="font-bold text-success-soft">${p.selling_price.toFixed(2)}</span>
    },
    {
      key: 'quantity',
      header: 'Stock',
      sortable: true,
      render: (p) => (
        <Badge tone={p.quantity <= p.reorder_level ? 'danger' : 'neutral'}>
          {p.quantity} {p.unit}
        </Badge>
      )
    },
    {
      key: 'supplier_name',
      header: 'Supplier',
      sortable: true,
      mobileHidden: true,
      render: (p) => <span className="text-caption text-content-muted">{p.supplier_name || '-'}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      hideable: false,
      render: (p) => (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="icon-sm" icon={Edit2} aria-label={`Edit ${p.name}`} onClick={() => openEditModal(p)} />
          <Button variant="danger" size="icon-sm" icon={Trash2} aria-label={`Delete ${p.name}`} onClick={() => setDeleteTarget(p)} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Product Inventory Catalog"
        description="Manage store items, pricing, SKUs, and stock limits"
        icon={Package}
        breadcrumb={<Breadcrumbs items={[{ label: 'Products' }]} />}
        actions={
          <>
            <Button variant="secondary" icon={RefreshCw} onClick={fetchData} aria-label="Refresh products">
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="primary" icon={Plus} onClick={openCreateModal}>New Product</Button>
          </>
        }
      />

      {loadError && <ErrorBanner message={loadError} onRetry={fetchData} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Products on Page" value={totalProducts} icon={Boxes} tone="primary" loading={loading} />
        <StatCard title="Low Stock on Page" value={lowStockCount} icon={AlertTriangle} tone="warning" loading={loading} />
        <StatCard title="Page Cost Value" value={`$${inventoryValue.toFixed(2)}`} icon={DollarSign} tone="info" loading={loading} />
        <StatCard title="Page Retail Value" value={`$${totalRetailValue.toFixed(2)}`} icon={Layers} tone="success" loading={loading} />
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={productSearch}
            onChange={(event) => {
              setProductSearch(event.target.value);
              setProductPage(0);
            }}
            placeholder="Search all products by name, SKU, barcode, or description"
            aria-label="Search all products"
          />
          <div className="flex items-center gap-2 text-caption text-content-muted">
            <Button variant="secondary" size="sm" disabled={productPage === 0}
              onClick={() => setProductPage((page) => Math.max(0, page - 1))}>Previous</Button>
            <span>Page {productPage + 1}</span>
            <Button variant="secondary" size="sm" disabled={!hasNextPage}
              onClick={() => setProductPage((page) => page + 1)}>Next</Button>
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={products}
          rowKey={(p) => p.id}
          loading={loading}
          pageSize={0}
          initialSort={{ key: 'name', dir: 'asc' }}
          emptyTitle="No products found"
          emptyDescription="Add your first product to start building your catalog."
          emptyIcon={Package}
          mobileTitle={(p) => p.name}
          toolbarExtra={
            <Toolbar className="p-0 border-0 bg-transparent">
              <ToolbarGroup>
                <Button
                  variant={lowStockFilter ? 'warning' : 'secondary'}
                  size="sm"
                  icon={AlertTriangle}
                  onClick={() => setLowStockFilter(!lowStockFilter)}
                >
                  {lowStockFilter ? 'Showing Low Stock' : 'Filter Low Stock'}
                </Button>
              </ToolbarGroup>
            </Toolbar>
          }
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProduct ? 'Edit Product' : 'Add New Product'}
        description={editProduct ? 'Update product details, pricing and stock levels.' : 'Fill in the details to add a new product to your catalog.'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>
              {editProduct ? 'Update Product' : 'Save Product'}
            </Button>
          </>
        }
      >
        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-md text-danger-soft text-body">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Product Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <Input
              label="SKU"
              hint="Auto-generated if left blank"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g. ELE-1001"
            />
            <Input
              label="Barcode"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              placeholder="e.g. 89012345"
            />
            <Select
              label="Category"
              placeholder="Select Category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              options={categories.map(c => ({ value: c.id, label: c.name }))}
            />
            <Select
              label="Supplier"
              placeholder="Select Supplier"
              value={formData.supplier_id}
              onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
              options={suppliers.map(s => ({ value: s.id, label: s.name }))}
            />
            <Input
              label="Cost Price ($)"
              type="number"
              step="0.01"
              value={formData.cost_price}
              onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
            />
            <Input
              label="Selling Price ($)"
              type="number"
              step="0.01"
              required
              value={formData.selling_price}
              onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
            />
            <Input
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
            <Input
              label="Reorder Level"
              type="number"
              hint="Alert threshold for low stock"
              value={formData.reorder_level}
              onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => { setDeleteTarget(null); setDeleteError(''); }}
        onConfirm={handleDelete}
        title="Delete Product"
        message={deleteError || `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        loading={deleting}
      />
    </div>
  );
};
