import React, { useState } from 'react';
import {
  User,
  Building,
  Mail,
  Phone,
  Shield,
  Plus,
  Search,
  Filter,
  Star,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function ContactManagementView({ contacts = [] }) {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [contactList, setContactList] = useState(
    contacts.length > 0
      ? contacts
      : [
          {
            id: 'con-1',
            name: 'Arthur Pendelton',
            title: 'Director of Store Systems',
            company: 'Summit Hardware Network',
            email: 'a.pendelton@summithardware.com',
            phone: '+1 (555) 712-4412',
            role: 'Decision Maker',
            influence: 'High'
          },
          {
            id: 'con-2',
            name: 'Gregory House',
            title: 'VP Operations & Supply',
            company: 'Acme Logistics Global',
            email: 'ghouse@acmelogistics.com',
            phone: '+1 (555) 349-8805',
            role: 'Executive Sponsor',
            influence: 'High'
          },
          {
            id: 'con-3',
            name: 'Linda Sterling',
            title: 'Chief Logistics Engineer',
            company: 'Apex Distribution Group',
            email: 'lsterling@apexgroup.com',
            phone: '+1 (555) 890-3329',
            role: 'Technical Evaluator',
            influence: 'Medium'
          }
        ]
  );

  const [newContact, setNewContact] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    role: 'Decision Maker',
    influence: 'High'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const created = {
      ...newContact,
      id: `con-${Date.now()}`
    };
    setContactList([created, ...contactList]);
    setIsModalOpen(false);
    addToast({
      title: 'Contact Profile Registered',
      message: `${created.name} (${created.title}) added to ${created.company}.`,
      type: 'success'
    });
  };

  const filtered = contactList.filter((c) => {
    const matchRole = filterRole === 'ALL' || c.role === filterRole;
    const matchSearch = !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stakeholder Filter:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Stakeholders</option>
            <option value="Executive Sponsor">Executive Sponsor</option>
            <option value="Decision Maker">Decision Maker</option>
            <option value="Technical Evaluator">Technical Evaluator</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search contact or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs shadow-md shadow-primary/20"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Contact
          </Button>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((con) => (
          <div
            key={con.id}
            className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-3 hover:border-primary/40 transition group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary font-bold flex items-center justify-center text-sm border border-primary/30">
                  {con.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-primary transition">{con.name}</h4>
                  <p className="text-xs text-slate-400">{con.title}</p>
                </div>
              </div>
              <Badge variant="primary" className="text-[10px]">
                {con.role}
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-[#050A16] border border-white/5 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate font-semibold">{con.company}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{con.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{con.phone}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>Influence Level: <strong className="text-amber-400">{con.influence}</strong></span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  addToast({
                    title: 'Contact Dossier Opened',
                    message: `Displaying interaction thread with ${con.name}.`,
                    type: 'info'
                  });
                }}
                className="text-xs text-primary hover:text-white"
              >
                Activities
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add B2B Account Decision Maker"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Arthur Pendelton"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Company Account *</label>
              <input
                type="text"
                required
                placeholder="e.g. Summit Hardware"
                value={newContact.company}
                onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Director of Systems"
                value={newContact.title}
                onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="contact@enterprise.com"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Phone</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
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
              Save Contact
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
