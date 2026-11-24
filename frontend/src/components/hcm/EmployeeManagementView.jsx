import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  UserCheck,
  Eye,
  Edit2,
  Shield,
  Briefcase,
  ChevronRight,
  Award
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function EmployeeManagementView({
  employees = [],
  departments = [],
  onAddEmployee,
  onRefresh
}) {
  const { addToast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // New Employee Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: 'Retail Operations',
    designation: '',
    employment_type: 'Full-Time',
    employment_status: 'Active',
    branch: 'Main Flagship Store',
    reporting_manager: 'Sarah Jenkins',
    salary: '',
    join_date: new Date().toISOString().slice(0, 10),
    emergency_contact: '',
    address: ''
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.designation) {
      addToast({ title: 'Validation Error', message: 'Name and designation are required.', type: 'danger' });
      return;
    }
    await onAddEmployee({
      ...formData,
      salary: parseFloat(formData.salary || 50000)
    });
    setIsAddModalOpen(false);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department: 'Retail Operations',
      designation: '',
      employment_type: 'Full-Time',
      employment_status: 'Active',
      branch: 'Main Flagship Store',
      reporting_manager: 'Sarah Jenkins',
      salary: '',
      join_date: new Date().toISOString().slice(0, 10),
      emergency_contact: '',
      address: ''
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">Active</Badge>;
      case 'on leave':
        return <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px]">On Leave</Badge>;
      case 'probation':
        return <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-[10px]">Probation</Badge>;
      default:
        return <Badge variant="outline" className="border-slate-500/30 text-slate-400 bg-slate-500/10 text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Staff: <strong className="text-white font-mono">{employees.length}</strong>
          </span>
          <div className="hidden sm:inline-flex rounded-lg p-0.5 bg-[#050A16] border border-white/10 ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Card Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${viewMode === 'table' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Data Table
            </button>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs shadow-md shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Enroll New Employee
        </Button>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="p-4 rounded-xl border border-white/10 bg-[#0B1329] space-y-3 hover:border-primary/40 transition group cursor-pointer"
              onClick={() => setSelectedEmployee(emp)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/30 to-blue-400/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                    {emp.first_name[0]}{emp.last_name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-primary transition">
                      {emp.first_name} {emp.last_name}
                    </h3>
                    <p className="text-xs text-slate-400">{emp.designation}</p>
                  </div>
                </div>
                {getStatusBadge(emp.employment_status)}
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Building className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate">{emp.department}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{emp.branch}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate font-mono text-[11px]">{emp.email}</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 text-[11px]">ID: {emp.employee_code}</span>
                <span className="text-primary font-medium flex items-center gap-1 text-[11px]">
                  View Dossier <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Employee Name</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Reporting Manager</th>
                  <th className="py-3 px-4">Tenure Since</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      {emp.employee_code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {emp.first_name} {emp.last_name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-medium">{emp.designation}</div>
                      <div className="text-[11px] text-slate-400">{emp.department}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {emp.branch}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {emp.reporting_manager}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {emp.join_date}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(emp.employment_status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEmployee(emp)}
                        className="text-xs text-primary hover:text-white"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Dossier Profile Modal */}
      {selectedEmployee && (
        <Modal
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          title={`Employee Dossier: ${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs text-slate-300">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-[#050A16] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xl">
                  {selectedEmployee.first_name[0]}{selectedEmployee.last_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">
                      {selectedEmployee.first_name} {selectedEmployee.last_name}
                    </h2>
                    {getStatusBadge(selectedEmployee.employment_status)}
                  </div>
                  <p className="text-xs text-primary font-medium">{selectedEmployee.designation}</p>
                  <p className="text-[11px] text-slate-400">Code: {selectedEmployee.employee_code} • {selectedEmployee.employment_type}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Base Salary</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  ${Number(selectedEmployee.salary || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-slate-400 block">Annualized Gross</span>
              </div>
            </div>

            {/* Demographics & Org Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-white/5 bg-[#050A16] space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  Organizational Placement
                </span>
                <div><span className="text-slate-400">Department:</span> <strong className="text-white">{selectedEmployee.department}</strong></div>
                <div><span className="text-slate-400">Operating Branch:</span> <strong className="text-white">{selectedEmployee.branch}</strong></div>
                <div><span className="text-slate-400">Direct Manager:</span> <strong className="text-white">{selectedEmployee.reporting_manager}</strong></div>
                <div><span className="text-slate-400">Hire Date:</span> <strong className="text-white font-mono">{selectedEmployee.join_date}</strong></div>
              </div>

              <div className="p-3 rounded-lg border border-white/5 bg-[#050A16] space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  Contact & Emergency Info
                </span>
                <div><span className="text-slate-400">Email:</span> <span className="text-white font-mono">{selectedEmployee.email}</span></div>
                <div><span className="text-slate-400">Phone:</span> <span className="text-white font-mono">{selectedEmployee.phone}</span></div>
                <div><span className="text-slate-400">Emergency:</span> <span className="text-white">{selectedEmployee.emergency_contact || 'None Listed'}</span></div>
                <div><span className="text-slate-400">Address:</span> <span className="text-white">{selectedEmployee.address || 'Confidential'}</span></div>
              </div>
            </div>

            {/* Leave Balance Counters */}
            <div className="p-3 rounded-lg border border-white/5 bg-[#050A16]">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Statutory Leave Accrual Balances
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Annual Vacation</span>
                  <span className="text-base font-bold text-white font-mono">
                    {selectedEmployee.leave_balance?.annual || 14} Days
                  </span>
                </div>
                <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Sick Leave</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {selectedEmployee.leave_balance?.sick || 8} Days
                  </span>
                </div>
                <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Casual Leave</span>
                  <span className="text-base font-bold text-cyan-400 font-mono">
                    {selectedEmployee.leave_balance?.casual || 4} Days
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Review Status */}
            <div className="p-3 rounded-lg border border-white/5 bg-[#050A16] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Q3 Performance Appraisal Rating:</span>
                <strong className="text-white font-mono font-bold">{selectedEmployee.kpis?.score || '4.8'} / 5.0</strong>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                Exceeds Expectations
              </Badge>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedEmployee(null)}
                className="text-xs"
              >
                Close Dossier
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Enterprise Employee"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">First Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Liam"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Last Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Gallagher"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Corporate Email</label>
              <input
                type="email"
                placeholder="employee@storehub.enterprise"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Retail Operations">Retail Operations</option>
                <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                <option value="Warehouse Operations">Warehouse Operations</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Designation / Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lead POS Specialist"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Branch</label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Main Flagship Store">Main Flagship Store</option>
                <option value="Central Logistics Hub">Central Logistics Hub</option>
                <option value="HQ Corporate">HQ Corporate</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Annual Salary ($)</label>
              <input
                type="number"
                placeholder="55000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Reporting Manager</label>
              <input
                type="text"
                placeholder="Sarah Jenkins"
                value={formData.reporting_manager}
                onChange={(e) => setFormData({ ...formData, reporting_manager: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              className="text-xs border-white/10 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="text-xs shadow-md shadow-primary/20"
            >
              Enroll Employee
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
