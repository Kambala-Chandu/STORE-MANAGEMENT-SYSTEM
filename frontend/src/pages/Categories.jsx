import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { getApiErrorMessage } from '../utils/apiError';
import { FolderTree, Plus, Edit2, Trash2, Layers, Package } from 'lucide-react';
import {
  PageHeader, Breadcrumbs, Card, CardBody, DataTable, Badge, Button,
  Modal, ConfirmDialog, Input, Textarea, StatCard, ErrorBanner
} from '../components/ui';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const res = await apiClient.get('/categories/');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setLoadError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditCat(null);
    setName('');
    setDescription('');
    setError('');
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditCat(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editCat) {
        await apiClient.put(`/categories/${editCat.id}`, { name, description });
      } else {
        await apiClient.post('/categories/', { name, description });
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save category'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await apiClient.delete(`/categories/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, 'Cannot delete category'));
    } finally {
      setDeleting(false);
    }
  };

  const totalCategories = categories.length;
  const totalProductsAcrossCategories = categories.reduce((sum, c) => sum + (c.product_count || 0), 0);
  const emptyCategories = categories.filter(c => !c.product_count).length;

  const columns = [
    {
      key: 'name',
      header: 'Category',
      sortable: true,
      render: (cat) => (
        <div className="flex items-center gap-3 min-w-0">
          <span className="p-2 bg-primary/15 text-primary-soft rounded-lg border border-primary/25 flex-shrink-0">
            <FolderTree className="w-4 h-4" />
          </span>
          <span className="font-semibold text-content break-words min-w-0">{cat.name}</span>
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      mobileHidden: true,
      render: (cat) => <span className="text-caption text-content-muted break-words">{cat.description || 'No description provided.'}</span>
    },
    {
      key: 'product_count',
      header: 'Products',
      sortable: true,
      render: (cat) => <Badge tone="neutral">{cat.product_count || 0} products</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      hideable: false,
      render: (cat) => (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="icon-sm" icon={Edit2} aria-label={`Edit ${cat.name}`} onClick={() => openEdit(cat)} />
          <Button variant="danger" size="icon-sm" icon={Trash2} aria-label={`Delete ${cat.name}`} onClick={() => setDeleteTarget(cat)} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Product Categories"
        description="Organize and group items in your store catalog"
        icon={FolderTree}
        breadcrumb={<Breadcrumbs items={[{ label: 'Categories' }]} />}
        actions={<Button variant="primary" icon={Plus} onClick={openCreate}>New Category</Button>}
      />

      {loadError && <ErrorBanner message={loadError} onRetry={fetchCategories} />}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Categories" value={totalCategories} icon={FolderTree} tone="primary" loading={loading} />
        <StatCard title="Products Categorized" value={totalProductsAcrossCategories} icon={Package} tone="success" loading={loading} />
        <StatCard title="Empty Categories" value={emptyCategories} icon={Layers} tone="warning" loading={loading} />
      </div>

      <Card>
        <DataTable
          columns={columns}
          rows={categories}
          rowKey={(c) => c.id}
          loading={loading}
          searchable
          searchPlaceholder="Search categories…"
          pageSize={25}
          initialSort={{ key: 'name', dir: 'asc' }}
          emptyTitle="No categories found"
          emptyDescription="Create your first category to organize your products."
          emptyIcon={FolderTree}
          mobileTitle={(c) => c.name}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCat ? 'Edit Category' : 'New Category'}
        description={editCat ? 'Update the category name and description.' : 'Create a new category to group your products.'}
        size="sm"
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
          <Input
            label="Category Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            label="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => { setDeleteTarget(null); setDeleteError(''); }}
        onConfirm={handleDelete}
        title="Delete Category"
        message={deleteError || `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        loading={deleting}
      />
    </div>
  );
};
