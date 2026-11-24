import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { getApiErrorMessage } from '../utils/apiError';
import { Truck, Plus, Edit2, Trash2, Phone, Mail, MapPin, Building2 } from 'lucide-react';
import {
  PageHeader, Breadcrumbs, Card, DataTable, Badge, Button,
  Modal, ConfirmDialog, Input, StatCard, ErrorBanner
} from '../components/ui';

export const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editSupp, setEditSupp] = useState(null);
  const [formData, setFormData] = useState({ name: '', contact_name: '', email: '', phone: '', address: '', city: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const res = await apiClient.get('/suppliers/');
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
      setLoadError('Failed to load suppliers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openCreate = () => {
    setEditSupp(null);
    setFormData({ name: '', contact_name: '', email: '', phone: '', address: '', city: '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditSupp(s);
    setFormData({
      name: s.name,
      contact_name: s.contact_name || '',
      email: s.email || '',
      phone: s.phone || '',
      address: s.address || '',
      city: s.city || ''
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editSupp) {
        await apiClient.put(`/suppliers/${editSupp.id}`, formData);
      } else {
        await apiClient.post('/suppliers/', formData);
      }
      setModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save supplier'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await apiClient.delete(`/suppliers/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchSuppliers();
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, 'Cannot delete supplier'));
    } finally {
      setDeleting(false);
    }
  };

  const totalSuppliers = suppliers.length;
  const suppliersWithEmail = suppliers.filter(s => !!s.email).length;
  const uniqueCities = new Set(suppliers.map(s => s.city).filter(Boolean)).size;

  const columns = [
    {
      key: 'name',
      header: 'Supplier',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3 min-w-0">
          <span className="p-2 bg-info/15 text-info-soft rounded-lg border border-info/25 flex-shrink-0">
            <Truck className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-content break-words">{s.name}</p>
            {s.contact_name && <p className="text-caption text-content-subtle break-words">Contact: {s.contact_name}</p>}
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      sortable: true,
      render: (s) => <span className="text-content-muted">{s.phone || '-'}</span>
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      mobileHidden: true,
      render: (s) => <span className="text-content-muted break-words">{s.email || '-'}</span>
    },
    {
      key: 'city',
      header: 'Location',
      sortable: true,
      render: (s) => <span className="text-content-muted">{[s.address, s.city].filter(Boolean).join(', ') || '-'}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      hideable: false,
      render: (s) => (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="icon-sm" icon={Edit2} aria-label={`Edit ${s.name}`} onClick={() => openEdit(s)} />
          <Button variant="danger" size="icon-sm" icon={Trash2} aria-label={`Delete ${s.name}`} onClick={() => setDeleteTarget(s)} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Supplier Directory"
        description="Manage vendor contacts and procurement sources"
        icon={Truck}
        breadcrumb={<Breadcrumbs items={[{ label: 'Suppliers' }]} />}
        actions={<Button variant="primary" icon={Plus} onClick={openCreate}>New Supplier</Button>}
      />

      {loadError && <ErrorBanner message={loadError} onRetry={fetchSuppliers} />}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Suppliers" value={totalSuppliers} icon={Truck} tone="primary" loading={loading} />
        <StatCard title="With Email Contact" value={suppliersWithEmail} icon={Mail} tone="success" loading={loading} />
        <StatCard title="Cities Covered" value={uniqueCities} icon={Building2} tone="info" loading={loading} />
      </div>

      <Card>
        <DataTable
          columns={columns}
          rows={suppliers}
          rowKey={(s) => s.id}
          loading={loading}
          searchable
          searchPlaceholder="Search suppliers by name, contact, city…"
          pageSize={25}
          initialSort={{ key: 'name', dir: 'asc' }}
          emptyTitle="No suppliers found"
          emptyDescription="Add your first supplier to begin managing procurement."
          emptyIcon={Truck}
          mobileTitle={(s) => s.name}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editSupp ? 'Edit Supplier' : 'New Supplier'}
        description={editSupp ? 'Update vendor contact and location details.' : 'Add a new supplier to your procurement directory.'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>Save</Button>
          </>
        }
      >
        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-md text-danger-soft text-body">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Company / Supplier Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Contact Person"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              />
            </div>
            <Input
              label="Phone"
              icon={Phone}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Input
                label="City"
                icon={MapPin}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => { setDeleteTarget(null); setDeleteError(''); }}
        onConfirm={handleDelete}
        title="Delete Supplier"
        message={deleteError || `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        loading={deleting}
      />
    </div>
  );
};
