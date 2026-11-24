import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Building2,
  Clock,
  Calendar,
  DollarSign,
  Briefcase,
  Award,
  UserCheck,
  TrendingUp,
  FileText,
  Bell,
  Plus,
  Download,
  RefreshCw,
  SlidersHorizontal,
  Search,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useHCM } from '../hooks/useHCM';
import {
  EmployeeManagementView,
  OrgStructureView,
  AttendanceManagementView,
  LeaveManagementView,
  PayrollManagementView,
  RecruitmentModuleView,
  EmployeePerformanceView,
  EmployeeSelfServiceView,
  HRAnalyticsDashboard,
  DocumentManagementView,
  HRNotificationsView,
  HRKPIGrid,
  HRExportModal
} from '../components/hcm';

export function HumanCapitalDashboard() {
  const {
    loading,
    employees,
    rawEmployees,
    departments,
    attendance,
    leaves,
    payrollRuns,
    jobOpenings,
    performanceReviews,
    documents,
    lifeEvents,
    kpis,
    analytics,
    filters,
    setFilters,
    isExportModalOpen,
    setIsExportModalOpen,
    handleCreateEmployee,
    handlePunchClock,
    handleApplyLeave,
    handleApproveLeave,
    handleRejectLeave,
    handleExecutePayroll,
    handleCreateJob,
    handleUploadDocument,
    refreshHCMData
  } = useHCM();

  const [activeTab, setActiveTab] = useState('employees');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (['input', 'textarea', 'select'].includes(activeTag)) return;

      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsExportModalOpen(true);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        refreshHCMData();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setActiveTab('leaves');
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setActiveTab('attendance');
      } else if (e.key === 'Escape') {
        setIsExportModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refreshHCMData, setIsExportModalOpen]);

  const tabs = [
    { id: 'employees', label: 'Employee Records', icon: Users, count: employees.length },
    { id: 'org', label: 'Org Hierarchy', icon: Building2, count: departments.length },
    { id: 'attendance', label: 'Attendance & Shifts', icon: Clock, count: attendance.length },
    { id: 'leaves', label: 'Leave Management', icon: Calendar, count: leaves.filter(l => l.status === 'Pending').length },
    { id: 'payroll', label: 'Payroll & Compensation', icon: DollarSign, count: payrollRuns.length },
    { id: 'recruitment', label: 'Recruitment & ATS', icon: Briefcase, count: jobOpenings.length },
    { id: 'performance', label: 'Performance & Appraisals', icon: Award, count: performanceReviews.length },
    { id: 'self_service', label: 'Self-Service (ESS)', icon: UserCheck },
    { id: 'analytics', label: 'Workforce Analytics', icon: TrendingUp },
    { id: 'documents', label: 'Document Vault', icon: FileText, count: documents.length },
    { id: 'notifications', label: 'Life Events', icon: Bell, count: lifeEvents.length }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-[#0B1329] relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              Enterprise ERP Phase 4.5
            </span>
            <span className="text-slate-400 text-xs font-medium">• SOC-2 & ISO 27001 Compliant</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Human Capital Management (HCM) & Payroll
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Global workforce census, geofenced punctuality tracking, multi-tier leave administration, automated NACHA direct deposit payroll, and talent intelligence.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshHCMData}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
            title="Refresh Roster (Press R)"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh <span className="hidden sm:inline font-mono text-[10px] text-slate-400 ml-1">(R)</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
            title="Export Workforce Records (Press E)"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export <span className="hidden sm:inline font-mono text-[10px] text-slate-400 ml-1">(E)</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('attendance')}
            className="text-xs shadow-lg shadow-primary/25"
            title="Timecard Terminal (Press P)"
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Punch Clock <span className="hidden sm:inline font-mono text-[10px] text-primary-foreground/80 ml-1">(P)</span>
          </Button>
        </div>

        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-primary/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Smart Filters Bar */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase text-[11px] tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            Roster Filters:
          </span>

          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Departments</option>
            <option value="Retail Operations">Retail Operations</option>
            <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
            <option value="Warehouse Operations">Warehouse Operations</option>
            <option value="Finance & Accounting">Finance & Accounting</option>
            <option value="Human Resources">Human Resources</option>
          </select>

          <select
            value={filters.branch}
            onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Work Locations</option>
            <option value="Main Flagship Store">Main Flagship Store</option>
            <option value="Central Logistics Hub">Central Logistics Hub</option>
            <option value="HQ Corporate">HQ Corporate</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Employment Statuses</option>
            <option value="Active">Active On Duty</option>
            <option value="On Leave">On Authorized Leave</option>
            <option value="Probation">Probationary Period</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name, role, code..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 12 Executive HCM KPI Cards */}
      <HRKPIGrid kpis={kpis} />

      {/* Enterprise Cockpit Tabs Navigation */}
      <div className="border-b border-white/10">
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none" aria-label="HCM Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'employees' && (
            <EmployeeManagementView
              employees={employees}
              departments={departments}
              onAddEmployee={handleCreateEmployee}
              onRefresh={refreshHCMData}
            />
          )}

          {activeTab === 'org' && (
            <OrgStructureView
              departments={departments}
              employees={employees}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceManagementView
              attendance={attendance}
              onPunchClock={handlePunchClock}
              onRefresh={refreshHCMData}
            />
          )}

          {activeTab === 'leaves' && (
            <LeaveManagementView
              leaves={leaves}
              onApplyLeave={handleApplyLeave}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
            />
          )}

          {activeTab === 'payroll' && (
            <PayrollManagementView
              payrollRuns={payrollRuns}
              onExecutePayroll={handleExecutePayroll}
              onRefresh={refreshHCMData}
            />
          )}

          {activeTab === 'recruitment' && (
            <RecruitmentModuleView
              jobOpenings={jobOpenings}
              onCreateJob={handleCreateJob}
              onRefresh={refreshHCMData}
            />
          )}

          {activeTab === 'performance' && (
            <EmployeePerformanceView
              performanceReviews={performanceReviews}
              onRefresh={refreshHCMData}
            />
          )}

          {activeTab === 'self_service' && (
            <EmployeeSelfServiceView
              onPunchClock={handlePunchClock}
              onRequestLeave={() => setActiveTab('leaves')}
            />
          )}

          {activeTab === 'analytics' && (
            <HRAnalyticsDashboard
              analyticsData={analytics}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentManagementView
              documents={documents}
              onUploadDocument={handleUploadDocument}
              onRefresh={refreshHCMData}
            />
          )}

          {activeTab === 'notifications' && (
            <HRNotificationsView
              lifeEvents={lifeEvents}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Export Center Modal */}
      <HRExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

export default HumanCapitalDashboard;
