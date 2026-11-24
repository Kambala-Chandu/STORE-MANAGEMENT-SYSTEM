import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { ShieldCheck, Plus, Trash2, UserCog } from 'lucide-react';
import {
  PageHeader,
  Card,
  CardBody,
  DataTable,
  Badge,
  Button,
  Modal,
  ConfirmDialog,
  Input,
  Select,
} from '../components/ui';

const ROLE_TONE = {
  Admin: 'purple',
  Manager: 'warning',
  Cashier: 'success',
};

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', username: '', email: '', password: '', role: 'Cashier', is_active: true });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/users/');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiClient.post('/users/', formData);
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await apiClient.delete(`/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      setDeleteError(err.response?.data?.detail || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'full_name',
      header: 'Full Name',
      sortable: true,
      render: (u) => <span className="font-semibold text-content">{u.full_name}</span>,
    },
    {
      key: 'username',
      header: 'Username',
      sortable: true,
      render: (u) => <span className="font-mono text-caption text-primary-soft font-semibold">{u.username}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      mobileHidden: true,
      render: (u) => <span className="text-content-muted min-w-0 break-words">{u.email}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (u) => <Badge tone={ROLE_TONE[u.role] || 'neutral'}>{u.role}</Badge>,
    },
    {
      key: 'is_active',
      header: 'Status',
      sortable: true,
      sortValue: (u) => (u.is_active ? 1 : 0),
      render: (u) => (
        <Badge tone={u.is_active ? 'success' : 'danger'} dot>
          {u.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      hideable: false,
      render: (u) => (
        <Button
          variant="ghost"
          size="icon-sm"
          icon={Trash2}
          aria-label={`Delete user ${u.username}`}
          onClick={(e) => {
            e.stopPropagation();
            setDeleteError('');
            setDeleteTarget(u);
          }}
          className="hover:text-danger hover:bg-danger/15"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="User & Role Management"
        description="Control system access, roles (Admin, Manager, Cashier), and staff credentials."
        icon={ShieldCheck}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setFormData({ full_name: '', username: '', email: '', password: '', role: 'Cashier', is_active: true });
              setError('');
              setModalOpen(true);
            }}
          >
            New User
          </Button>
        }
      />

      <Card>
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            rows={users}
            rowKey={(u) => u.id}
            loading={loading}
            emptyTitle="No users found"
            emptyDescription="Create a system user to get started."
            emptyIcon={UserCog}
            searchable
            searchPlaceholder="Search users…"
            pageSize={25}
          />
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create System User"
        description="New users receive immediate access based on the assigned role."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="create-user-form" loading={submitting}>
              Create User
            </Button>
          </>
        }
      >
        {error && (
          <div className="mb-4 p-3 rounded-md bg-danger/15 border border-danger/30 text-danger-soft text-caption">
            {error}
          </div>
        )}
        <form id="create-user-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Username"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'Admin', label: 'Admin' },
                { value: 'Manager', label: 'Manager' },
                { value: 'Cashier', label: 'Cashier' },
              ]}
            />
          </div>
          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            hint="Minimum 8 characters recommended."
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={
          deleteError
            ? deleteError
            : `Are you sure you want to delete "${deleteTarget?.username}"? This action cannot be undone.`
        }
        confirmLabel="Delete User"
        tone="danger"
        loading={deleting}
      />
    </div>
  );
};

export default Users;
