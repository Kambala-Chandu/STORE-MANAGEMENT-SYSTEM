import React, { useState } from 'react';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Calendar,
  Plus,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function AttendanceManagementView({
  attendance = [],
  onPunchClock,
  onRefresh
}) {
  const { addToast } = useToast();
  const [isPunchModalOpen, setIsPunchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('ALL');

  const [punchData, setPunchData] = useState({
    employee_code: 'SH-1002',
    employee_name: 'Elena Rostova',
    shift: 'Retail Store (09:00 - 18:00)',
    branch: 'Main Flagship Store',
    notes: 'Standard morning shift check-in'
  });

  const handlePunchSubmit = async (e) => {
    e.preventDefault();
    await onPunchClock(punchData);
    setIsPunchModalOpen(false);
  };

  const filtered = attendance.filter((a) => {
    const matchShift = filterShift === 'ALL' || a.shift?.includes(filterShift);
    const matchSearch = !searchTerm ||
      a.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.branch?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchShift && matchSearch;
  });

  const onTimeCount = attendance.filter(a => a.status === 'On Time').length;
  const lateCount = attendance.filter(a => a.status?.includes('Late')).length;
  const totalOvertime = attendance.reduce((sum, a) => sum + (a.overtime_hours || 0), 0);

  return (
    <div className="space-y-4">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Logged Today</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            {attendance.length} Shifts
          </div>
          <p className="mt-1 text-xs text-slate-400">Punches synchronized</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>On-Time Arrival</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
            {attendance.length > 0 ? ((onTimeCount / attendance.length) * 100).toFixed(0) : 100}%
          </div>
          <p className="mt-1 text-xs text-slate-400">{onTimeCount} on-time starts</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Late Incidents</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400 font-mono">
            {lateCount}
          </div>
          <p className="mt-1 text-xs text-slate-400">&gt; 15 min grace period</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Accumulated Overtime</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-400 font-mono">
            {totalOvertime.toFixed(1)} Hrs
          </div>
          <p className="mt-1 text-xs text-slate-400">Overtime hours logged</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shift Filter:</span>
          <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Shifts</option>
            <option value="Morning">Morning Shift</option>
            <option value="Retail Store">Retail Store</option>
            <option value="Retail POS">Retail POS</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPunchModalOpen(true)}
            className="text-xs shadow-md shadow-primary/20"
          >
            <Clock className="w-3.5 h-3.5 mr-1" />
            Log Attendance Punch
          </Button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Employee Code</th>
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">Shift Schedule</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4 text-center">Check-In</th>
                <th className="py-3 px-4 text-center">Check-Out</th>
                <th className="py-3 px-4 text-right">Hours</th>
                <th className="py-3 px-4 text-center">Punctuality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((att) => (
                <tr key={att.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {att.date}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    {att.employee_code}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {att.employee_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {att.shift}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {att.branch}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">
                    {att.check_in || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                    {att.check_out || 'Active On Duty'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-white">
                    {att.hours_worked > 0 ? `${att.hours_worked}h` : 'In Progress'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        att.status === 'On Time'
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {att.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Punch Clock Modal */}
      <Modal
        isOpen={isPunchModalOpen}
        onClose={() => setIsPunchModalOpen(false)}
        title="Simulated Timecard Punch Clock Terminal"
        maxWidth="max-w-md"
      >
        <form onSubmit={handlePunchSubmit} className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-[#050A16] border border-white/10 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Terminal Time</span>
            <div className="text-3xl font-black text-white font-mono tracking-wider">
              {new Date().toLocaleTimeString()}
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">GPS Geofence Verified: Within Store Perimeter</p>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Employee ID & Code</label>
            <input
              type="text"
              required
              value={punchData.employee_code}
              onChange={(e) => setPunchData({ ...punchData, employee_code: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Employee Full Name</label>
            <input
              type="text"
              required
              value={punchData.employee_name}
              onChange={(e) => setPunchData({ ...punchData, employee_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Assigned Shift</label>
            <select
              value={punchData.shift}
              onChange={(e) => setPunchData({ ...punchData, shift: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Retail Store (09:00 - 18:00)">Retail Store (09:00 - 18:00)</option>
              <option value="Morning Shift (08:00 - 17:00)">Morning Shift (08:00 - 17:00)</option>
              <option value="Evening Logistics (14:00 - 23:00)">Evening Logistics (14:00 - 23:00)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPunchModalOpen(false)}
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
              Confirm Check-In
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
