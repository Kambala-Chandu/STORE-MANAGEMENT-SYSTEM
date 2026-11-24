import React from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { cn } from '../../lib/cn';

const TONES = {
  danger: { icon: ShieldAlert, ring: 'bg-danger/15 text-danger-soft border-danger/30', variant: 'danger' },
  warning: { icon: AlertTriangle, ring: 'bg-warning/15 text-warning-soft border-warning/30', variant: 'warning' },
  info: { icon: Info, ring: 'bg-info/15 text-info-soft border-info/30', variant: 'primary' },
};

export const ConfirmDialog = ({
  open,
  onCancel,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading = false,
}) => {
  const config = TONES[tone] || TONES.danger;
  const Icon = config.icon;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="sm"
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={config.variant} onClick={onConfirm} loading={loading} data-autofocus>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={cn('p-2.5 rounded-lg border flex-shrink-0', config.ring)}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <p className="text-body text-content-muted leading-relaxed min-w-0">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
