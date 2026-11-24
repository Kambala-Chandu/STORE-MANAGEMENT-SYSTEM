import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ShoppingCart,
  Package,
  UserPlus,
  FileBarChart,
  Check,
  AlertCircle,
} from 'lucide-react';
import apiClient from '../../api/client';
import { cn } from '../../lib/cn';
import { Modal, Button } from '../ui';
import { useToast } from '../ui/Toast';

export const FloatingQuickActions = memo(({ onCustomerCreated }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);

  // Quick Customer Form State
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custLoading, setCustLoading] = useState(false);
  const [custError, setCustError] = useState('');

  const actions = [
    {
      id: 'pos',
      label: 'New POS Order',
      shortcut: 'F1',
      icon: ShoppingCart,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      onClick: () => {
        setOpen(false);
        navigate('/pos');
      },
    },
    {
      id: 'product',
      label: 'Create Product',
      shortcut: 'Alt+P',
      icon: Package,
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      onClick: () => {
        setOpen(false);
        navigate('/products');
      },
    },
    {
      id: 'customer',
      label: 'Quick Add Customer',
      shortcut: 'Alt+C',
      icon: UserPlus,
      color: 'bg-purple-600 hover:bg-purple-500 text-white',
      onClick: () => {
        setOpen(false);
        setCustomerModalOpen(true);
      },
    },
    {
      id: 'reports',
      label: 'Executive Reports',
      shortcut: 'Alt+R',
      icon: FileBarChart,
      color: 'bg-amber-600 hover:bg-amber-500 text-white',
      onClick: () => {
        setOpen(false);
        navigate('/reports');
      },
    },
  ];

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!custName.trim()) {
      setCustError('Customer name is required.');
      return;
    }

    try {
      setCustLoading(true);
      setCustError('');

      const res = await apiClient.post('/customers/', {
        name: custName.trim(),
        phone: custPhone.trim() || undefined,
        email: custEmail.trim() || undefined,
        address: custAddress.trim() || undefined,
      });

      toast?.success('Customer Registered', `${res.data.name} was successfully added.`);
      setCustomerModalOpen(false);
      setCustName('');
      setCustPhone('');
      setCustEmail('');
      setCustAddress('');
      onCustomerCreated?.(res.data);
    } catch (err) {
      setCustError(err?.response?.data?.detail || 'Failed to create customer profile.');
    } finally {
      setCustLoading(false);
    }
  };

  return (
    <>
      {/* ── Fixed Floating Action Button (FAB) ── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-end gap-2 mb-1"
            >
              {actions.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-center gap-2">
                    <span className="rounded-lg border border-white/[0.10] bg-[#0b1329]/[0.92] backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white shadow-lg pointer-events-none">
                      {act.label}{' '}
                      <kbd className="ml-1 text-[10px] text-slate-400 font-mono">{act.shortcut}</kbd>
                    </span>
                    <button
                      type="button"
                      onClick={act.onClick}
                      aria-label={act.label}
                      className={cn(
                        'grid h-11 w-11 place-items-center rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95',
                        act.color
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Close quick action rail' : 'Open operational quick actions'}
          aria-expanded={open}
          className={cn(
            'grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-2xl shadow-blue-600/40 border border-white/20 transition-all duration-200 hover:bg-blue-500 hover:scale-105 active:scale-95'
          )}
        >
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </motion.div>
        </button>
      </div>

      {/* ── Quick Add Customer Modal ── */}
      <Modal
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title="Quick Register Customer"
        description="Add a new customer profile directly to the enterprise database."
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setCustomerModalOpen(false)}
              disabled={custLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateCustomer}
              loading={custLoading}
              icon={Check}
            >
              Save Customer
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          {custError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{custError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wayne Enterprises"
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              className="w-full h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                className="w-full h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="procurement@corp.com"
                value={custEmail}
                onChange={(e) => setCustEmail(e.target.value)}
                className="w-full h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Delivery / Billing Address
            </label>
            <textarea
              rows={2}
              placeholder="100 Enterprise Way, Suite 400"
              value={custAddress}
              onChange={(e) => setCustAddress(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </form>
      </Modal>
    </>
  );
});
FloatingQuickActions.displayName = 'FloatingQuickActions';

export default FloatingQuickActions;

