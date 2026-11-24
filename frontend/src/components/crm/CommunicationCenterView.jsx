import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  Smartphone,
  FileText,
  Send,
  Plus,
  Paperclip,
  CheckCircle,
  Building,
  User,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function CommunicationCenterView({ customerId }) {
  const { addToast } = useToast();
  const [filterType, setFilterType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [communications, setCommunications] = useState([
    {
      id: 'comm-1',
      type: 'Email',
      subject: 'Re: Enterprise Tier-1 Volume Pricing & Quotation',
      date: '2026-10-04 11:20',
      sender: 'Sarah Jenkins (Account Lead)',
      recipient: 'Arthur Pendelton (Summit Hardware)',
      body: 'Attached the revised pricing structure reflecting the 15-terminal volume discount as requested during our discovery call.'
    },
    {
      id: 'comm-2',
      type: 'SMS',
      subject: 'Shipment Dispatch Alert: Carrier Tracking',
      date: '2026-10-02 09:15',
      sender: 'StoreHub Automated Gateway',
      recipient: '+1 (555) 349-8800 (Acme Logistics)',
      body: 'Order #ORD-2026-9912 is out for freight delivery via FastLine Freight. Est. arrival by 14:00.'
    },
    {
      id: 'comm-3',
      type: 'Internal Note',
      subject: 'Credit Limit Expansion Recommendation',
      date: '2026-09-28 16:30',
      sender: 'Amina Diallo (Finance Controller)',
      recipient: 'Internal Sales Committee',
      body: 'Customer payment history flawless for 12 consecutive months. Recommend increasing trade credit line from $50,000 to $75,000.'
    }
  ]);

  const [newMessage, setNewMessage] = useState({
    type: 'Email',
    recipient: 'Arthur Pendelton (Summit Hardware)',
    subject: '',
    body: ''
  });

  const handleSendSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.subject || !newMessage.body) {
      addToast({ title: 'Validation Error', message: 'Subject and body are required.', type: 'danger' });
      return;
    }
    const created = {
      ...newMessage,
      id: `comm-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sender: 'Sarah Jenkins (StoreHub Rep)'
    };
    setCommunications([created, ...communications]);
    setIsModalOpen(false);
    setNewMessage({
      type: 'Email',
      recipient: 'Arthur Pendelton (Summit Hardware)',
      subject: '',
      body: ''
    });
    addToast({
      title: 'Communication Dispatched',
      message: `${created.type} sent to ${created.recipient}.`,
      type: 'success'
    });
  };

  const getCommIcon = (type) => {
    switch (type) {
      case 'Email':
        return <Mail className="w-4 h-4 text-primary" />;
      case 'SMS':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-amber-400" />;
    }
  };

  const filtered = filterType === 'ALL'
    ? communications
    : communications.filter(c => c.type === filterType);

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-lg p-1 bg-[#050A16] border border-white/10">
          {['ALL', 'Email', 'SMS', 'Internal Note'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filterType === t ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {t === 'ALL' ? 'All Communications' : `${t}s`}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs shadow-md shadow-primary/20"
        >
          <Send className="w-3.5 h-3.5 mr-1" />
          Compose Message
        </Button>
      </div>

      {/* Communications Thread List */}
      <div className="space-y-3">
        {filtered.map((comm) => (
          <div
            key={comm.id}
            className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-3 hover:border-primary/40 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5">
                  {getCommIcon(comm.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" className="text-[10px]">
                      {comm.type}
                    </Badge>
                    <h4 className="text-sm font-bold text-white">{comm.subject}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    From: <strong className="text-slate-300">{comm.sender}</strong> • To: <span className="text-slate-300">{comm.recipient}</span>
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-slate-400">{comm.date}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#050A16] border border-white/5 text-xs text-slate-300 leading-relaxed">
              {comm.body}
            </div>
          </div>
        ))}
      </div>

      {/* Compose Message Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Compose Customer Communication"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSendSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Channel</label>
              <select
                value={newMessage.type}
                onChange={(e) => setNewMessage({ ...newMessage, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Email">Email Dispatch</option>
                <option value="SMS">SMS Notification</option>
                <option value="Internal Note">Internal CRM Note</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Recipient</label>
              <input
                type="text"
                required
                value={newMessage.recipient}
                onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Subject *</label>
            <input
              type="text"
              required
              placeholder="e.g. Firmware Update Notification"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Message Content *</label>
            <textarea
              rows={4}
              required
              placeholder="Write customer message..."
              value={newMessage.body}
              onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-xs border-white/10 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="text-xs"
            >
              Send Communication
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
