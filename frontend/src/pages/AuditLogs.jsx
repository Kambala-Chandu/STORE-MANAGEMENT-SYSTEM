import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { ShieldAlert, RefreshCw, UserCheck, Calendar } from 'lucide-react';
import { PageHeader, Card, CardBody, DataTable, Badge, Input, Select, Toolbar, ToolbarGroup } from '../components/ui';

const ACTION_OPTIONS = [
  { value: 'ALL', label: 'All Recorded Actions' },
  { value: 'INVOICE_CREATED', label: 'Invoice Created' },
  { value: 'INVOICE_DELETED', label: 'Invoice Deleted' },
  { value: 'INVOICE_EMAILED', label: 'Invoice Emailed' },
  { value: 'PRODUCT_UPDATED', label: 'Product Updated' },
  { value: 'STOCK_UPDATED', label: 'Stock Adjusted' },
  { value: 'USER_LOGIN', label: 'User Login' },
  { value: 'BACKUP_EXPORTED', label: 'Backup Exported' },
  { value: 'BACKUP_RESTORED', label: 'Backup Restored' },
];

const actionTone = (action) => {
  if (!action) return 'neutral';
  if (action.includes('DELETED')) return 'danger';
  if (action.includes('CREATED')) return 'success';
  if (action.includes('BACKUP')) return 'purple';
  return 'info';
};

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (actionFilter !== 'ALL') params.action = actionFilter;

      const res = await apiClient.get('/audit/', { params });
      setLogs(res.data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFilter]);

  const columns = [
    {
      key: 'created_at',
      header: 'Timestamp',
      sortable: true,
      sortValue: (row) => new Date(row.created_at).getTime(),
      render: (row) => (
        <span className="font-mono text-caption text-content-muted whitespace-nowrap">
          {new Date(row.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'username',
      header: 'User',
      sortable: true,
      render: (row) => (
        <span className="flex items-center gap-1.5 font-semibold text-content min-w-0">
          <UserCheck className="w-3.5 h-3.5 text-info-soft flex-shrink-0" aria-hidden="true" />
          <span className="truncate">{row.username || 'System'}</span>
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      render: (row) => (
        <Badge tone={actionTone(row.action)} size="sm">
          {row.action}
        </Badge>
      ),
    },
    {
      key: 'entity_id',
      header: 'Entity',
      render: (row) => (
        <span className="font-mono text-content-muted">{row.entity_id || row.entity_type || '-'}</span>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      mobileHidden: true,
      render: (row) => <span className="text-content-muted break-words">{row.details || '-'}</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Enterprise Audit & Compliance Log"
        description="Immutable security event tracking, invoice lifecycle actions, stock adjustments, and administrative overrides."
        icon={ShieldAlert}
        actions={
          <button
            onClick={fetchLogs}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-secondary hover:bg-secondary-hover border border-border-strong text-body font-semibold text-content transition-all duration-base ease-enterprise shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-primary-soft" aria-hidden="true" />
            <span>Refresh Logs</span>
          </button>
        }
      />

      <Card>
        <Toolbar className="rounded-t-xl">
          <ToolbarGroup grow>
            <Input
              containerClassName="w-full md:max-w-sm"
              placeholder="Search user, action details, or invoice ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
              aria-label="Search audit logs"
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <Select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              options={ACTION_OPTIONS}
              aria-label="Filter by action type"
              containerClassName="min-w-[220px]"
            />
          </ToolbarGroup>
        </Toolbar>
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            rows={logs}
            rowKey={(row) => row.id}
            loading={loading}
            emptyTitle="No audit records found"
            emptyDescription="No audit records match the current search or filter criteria."
            emptyIcon={Calendar}
            pageSize={25}
            initialSort={{ key: 'created_at', dir: 'desc' }}
            mobileTitle={(row) => (
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-info-soft flex-shrink-0" aria-hidden="true" />
                {row.username || 'System'}
              </span>
            )}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default AuditLogs;
