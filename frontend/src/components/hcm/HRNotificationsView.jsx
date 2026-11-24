import React, { useState } from 'react';
import {
  Bell,
  Cake,
  Award,
  Clock,
  CheckCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

export function HRNotificationsView({ lifeEvents = [] }) {
  const { addToast } = useToast();
  const [filterType, setFilterType] = useState('ALL');

  const defaultEvents = [
    {
      id: 'ev-1',
      type: 'birthday',
      title: "Elena Rostova's Birthday",
      subtitle: 'Celebrating today with the Main Flagship team',
      date: 'Today, Oct 05',
      department: 'Retail Operations',
      badge: 'Birthday Celebration'
    },
    {
      id: 'ev-2',
      type: 'anniversary',
      title: "Marcus Chen's 5th Work Anniversary",
      subtitle: 'Joined StoreHub on Oct 12, 2021 as Lead SCM Director',
      date: 'Oct 12, 2026',
      department: 'Supply Chain & Logistics',
      badge: '5-Year Milestone'
    },
    {
      id: 'ev-3',
      type: 'approval',
      title: "Lucas Vance's Medical Leave Request",
      subtitle: '1-Day Absence submitted for dental appointment',
      date: 'Pending Review',
      department: 'Retail Operations',
      badge: 'Action Required'
    },
    {
      id: 'ev-4',
      type: 'payroll',
      title: 'September 2026 Payroll Cycle Finalized',
      subtitle: '95 Direct deposit transfers ($196,420 net) disbursed',
      date: 'Sept 30, 2026',
      department: 'Finance & HR',
      badge: 'Automated Notice'
    }
  ];

  const events = lifeEvents.length > 0 ? lifeEvents : defaultEvents;

  const filtered = filterType === 'ALL'
    ? events
    : events.filter(e => e.type === filterType);

  const getEventIcon = (type) => {
    switch (type) {
      case 'birthday':
        return <Cake className="w-5 h-5 text-amber-400" />;
      case 'anniversary':
        return <Award className="w-5 h-5 text-primary" />;
      case 'approval':
        return <Clock className="w-5 h-5 text-rose-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Workforce Life Events & Operational Reminders
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Automated birthday greetings, service milestones, and pending approvals</p>
        </div>

        <div className="inline-flex rounded-lg p-1 bg-[#050A16] border border-white/10">
          {['ALL', 'birthday', 'anniversary', 'approval', 'payroll'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition capitalize ${
                filterType === t ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'ALL' ? 'All Alerts' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Events Feed */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex items-center justify-between gap-4 hover:border-primary/40 transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                {getEventIcon(item.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <Badge variant="outline" className="border-white/10 text-slate-300 bg-white/5 text-[10px]">
                    {item.badge || item.department}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{item.subtitle || `Department: ${item.department}`}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400 whitespace-nowrap">{item.date}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  addToast({
                    title: 'Action Triggered',
                    message: `Greeted or acknowledged: ${item.title}`,
                    type: 'info'
                  });
                }}
                className="text-xs border-white/10 text-slate-300 hover:text-white"
              >
                Send Note
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
