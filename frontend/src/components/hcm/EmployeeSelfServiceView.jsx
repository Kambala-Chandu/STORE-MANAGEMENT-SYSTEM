import React, { useState } from 'react';
import {
  User,
  Clock,
  Calendar,
  FileText,
  Download,
  CheckCircle,
  Shield,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

export function EmployeeSelfServiceView({
  onPunchClock,
  onRequestLeave
}) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [clockedIn, setClockedIn] = useState(true);

  const currentUser = {
    name: user?.username ? (user.username.charAt(0).toUpperCase() + user.username.slice(1)) : 'Elena Rostova',
    code: 'SH-1002',
    designation: 'Flagship Store General Manager',
    department: 'Retail Operations',
    branch: 'Main Flagship Store',
    email: 'elena.rostova@storehub.enterprise',
    phone: '+1 (555) 345-6789',
    annual_leave: 10,
    sick_leave: 7,
    casual_leave: 3
  };

  const handleTogglePunch = () => {
    setClockedIn(!clockedIn);
    addToast({
      title: clockedIn ? 'Clocked Out Successfully' : 'Clocked In Successfully',
      message: `Time stamp logged at ${new Date().toLocaleTimeString()} for ${currentUser.name}.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Profile Hero */}
      <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0B1329] via-[#050A16] to-[#0B1329] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/30 to-blue-400/20 border border-primary/40 flex items-center justify-center text-primary font-black text-2xl shadow-xl shadow-primary/20">
              {currentUser.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  Employee Self-Service Portal
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {currentUser.code}</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">{currentUser.name}</h2>
              <p className="text-xs text-slate-300 font-medium">{currentUser.designation} • {currentUser.department}</p>
            </div>
          </div>

          {/* Quick Punch Terminal */}
          <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329] flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Shift Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${clockedIn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-xs font-bold text-white">
                  {clockedIn ? 'Clocked In (Active)' : 'Clocked Out'}
                </span>
              </div>
            </div>
            <Button
              variant={clockedIn ? 'outline' : 'primary'}
              size="sm"
              onClick={handleTogglePunch}
              className="text-xs"
            >
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              {clockedIn ? 'Punch Out' : 'Punch In'}
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: Leave Balances & Fast Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Annual Vacation Balance</span>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {currentUser.annual_leave} <span className="text-sm font-normal text-slate-400">Days</span>
          </div>
          <p className="text-[11px] text-slate-500">Expiring Dec 31, 2026</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Medical / Sick Leave</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {currentUser.sick_leave} <span className="text-sm font-normal text-slate-400">Days</span>
          </div>
          <p className="text-[11px] text-slate-500">Full statutory coverage</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Casual / Personal Days</span>
            <User className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono">
            {currentUser.casual_leave} <span className="text-sm font-normal text-slate-400">Days</span>
          </div>
          <p className="text-[11px] text-slate-500">Available immediately</p>
        </div>
      </div>

      {/* Payslips & Documents Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Payslips */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              My Recent Pay Statements
            </h4>
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
              Direct Deposit
            </Badge>
          </div>

          <div className="space-y-2">
            {[
              { period: 'September 2026', date: 'Sept 30, 2026', net: '$5,625.00' },
              { period: 'August 2026', date: 'Aug 31, 2026', net: '$5,625.00' },
              { period: 'July 2026', date: 'July 31, 2026', net: '$5,510.00' }
            ].map((p, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#050A16] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">{p.period}</div>
                  <div className="text-[11px] text-slate-400 font-mono">Paid {p.date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-emerald-400 text-xs">{p.net}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      addToast({
                        title: 'PDF Payslip Generated',
                        message: `Statement for ${p.period} downloaded to client.`,
                        type: 'info'
                      });
                    }}
                    className="p-1.5 text-slate-400 hover:text-white"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Acknowledged Documents */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              My Compliance & Handbooks
            </h4>
            <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
              100% Signed
            </Badge>
          </div>

          <div className="space-y-2">
            {[
              { title: 'StoreHub Global Code of Conduct', date: 'Jan 15, 2026', status: 'Signed' },
              { title: 'POS Data Security & PCI-DSS Standard', date: 'Mar 10, 2026', status: 'Signed' },
              { title: 'Workplace Safety & Fire Evacuation', date: 'May 02, 2026', status: 'Signed' }
            ].map((doc, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#050A16] border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-medium text-white">{doc.title}</div>
                  <div className="text-[11px] text-slate-400">Acknowledged: {doc.date}</div>
                </div>
                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
