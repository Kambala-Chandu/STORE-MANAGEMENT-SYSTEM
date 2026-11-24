import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { getApiErrorMessage } from '../utils/apiError';
import { Users, Plus, Edit2, Star, UserCheck, Award } from 'lucide-react';
import {
  PageHeader, Breadcrumbs, Card, DataTable, Badge, Button,
  Modal, Input, StatCard, ErrorBanner
} from '../components/ui';

export const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCust, setEditCust] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', loyalty_points: 0 });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const res = await apiClient.get('/customers/');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      setLoadError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openCreate = () => {
    setEditCust(null);
    setFormData({ name: '', email: '', phone: '', address: '', loyalty_points: 0 });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditCust(c);
    setFormData({
      name: c.name,
      email: c.email || '',
      phone: c.phone || '',
      address: c.address || '',
      loyalty_points: c.loyalty_points
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editCust) {
        await apiClient.put(`/customers/${editCust.id}`, formData);
      } else {
        await apiClient.post('/customers/', formData);
      }
      setModalOpen(false);
      fetchCustomers();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save customer'));
    } finally {
      setSubmitting(false);
    }
  };

  const totalCustomers = customers.length;
  const totalLoyaltyPoints = customers.reduce((sum, c) => sum + (c.loyalty_points || 0), 0);
  const activeLoyaltyCustomers = customers.filter(c => (c.loyalty_points || 0) > 0).length;

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (c) => <span className="font-semibold text-content break-words">{c.name}</span>
    },
    {
      key: 'phone',
      header: 'Phone',
      sortable: true,
      render: (c) => <span className="text-content-muted">{c.phone || '-'}</span>
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      mobileHidden: true,
      render: (c) => <span className="text-content-muted break-words">{c.email || '-'}</span>
    },
    {
      key: 'loyalty_points',
      header: 'Loyalty Points',
      sortable: true,
      render: (c) => (
        <Badge tone="warning" icon={Star}>{c.loyalty_points} pts</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      hideable: false,
      render: (c) => (
        <div className="flex justify-end">
          <Button variant="secondary" size="icon-sm" icon={Edit2} aria-label={`Edit ${c.name}`} onClick={() => openEdit(c)} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Customer Management"
        description="Track customer details and accumulated loyalty reward points"
        icon={Users}
        breadcrumb={<Breadcrumbs items={[{ label: 'Customers' }]} />}
        actions={<Button variant="primary" icon={Plus} onClick={openCreate}>New Customer</Button>}
      />

      {loadError && <ErrorBanner message={loadError} onRetry={fetchCustomers} />}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Customers" value={totalCustomers} icon={Users} tone="primary" loading={loading} />
        <StatCard title="Active Loyalty Members" value={activeLoyaltyCustomers} icon={UserCheck} tone="success" loading={loading} />
        <StatCard title="Total Loyalty Points" value={totalLoyaltyPoints} icon={Award} tone="warning" loading={loading} />
      </div>

      <Card>
        <DataTable
          columns={columns}
          rows={customers}
          rowKey={(c) => c.id}
          loading={loading}
          searchable
          searchPlaceholder="Search customers by name, phone, email…"
          pageSize={25}
          initialSort={{ key: 'name', dir: 'asc' }}
          emptyTitle="No customers found"
          emptyDescription="Add your first customer to begin tracking loyalty points."
          emptyIcon={Users}
          mobileTitle={(c) => c.name}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCust ? 'Edit Customer' : 'New Customer'}
        description={editCust ? 'Update customer contact details and loyalty balance.' : 'Add a new customer to your directory.'}
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
                label="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Loyalty Points"
              type="number"
              value={formData.loyalty_points}
              onChange={(e) => setFormData({ ...formData, loyalty_points: parseInt(e.target.value) || 0 })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
