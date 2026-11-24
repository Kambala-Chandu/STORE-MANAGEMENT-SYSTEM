import { useState, useEffect, useCallback, useMemo } from 'react';
import { hrService } from '../services/hrService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

export function useHCM() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrollRuns, setPayrollRuns] = useState([]);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [performanceReviews, setPerformanceReviews] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [lifeEvents, setLifeEvents] = useState([]);

  // Active filters
  const [filters, setFilters] = useState({
    department: 'ALL',
    branch: 'ALL',
    status: 'ALL',
    search: ''
  });

  // Modal controls
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [selectedEmployeeProfile, setSelectedEmployeeProfile] = useState(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPunchModalOpen, setIsPunchModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Fetch all HCM datasets
  const loadAllHCMData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        emps,
        depts,
        att,
        lvs,
        pay,
        jobs,
        perf
      ] = await Promise.all([
        hrService.getEmployees(),
        hrService.getDepartments(),
        hrService.getAttendance(),
        hrService.getLeaves(),
        hrService.getPayrollRuns(),
        hrService.getJobOpenings(),
        hrService.getPerformanceReviews()
      ]);

      setEmployees(emps || []);
      setDepartments(depts || []);
      setAttendance(att || []);
      setLeaves(lvs || []);
      setPayrollRuns(pay || []);
      setJobOpenings(jobs || []);
      setPerformanceReviews(perf || []);
      setDocuments(hrService.getDocuments());
      setLifeEvents(hrService.getLifeEvents());
    } catch (err) {
      console.error('HCM synchronization error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllHCMData();
  }, [loadAllHCMData]);

  // Handlers
  const handleCreateEmployee = async (empData) => {
    try {
      const created = await hrService.createEmployee(empData);
      setEmployees(prev => [created, ...prev]);
      setIsAddEmployeeModalOpen(false);
      addToast({
        title: 'Employee Profile Enrolled',
        message: `${created.first_name} ${created.last_name} (${created.employee_code}) enrolled in ${created.department}.`,
        type: 'success'
      });
      return created;
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to enroll employee.', type: 'danger' });
    }
  };

  const handlePunchClock = async (punchData) => {
    try {
      const punch = await hrService.punchAttendance({
        ...punchData,
        employee_code: user?.employee_code || 'SH-1002',
        employee_name: user?.username || 'Staff Associate'
      });
      setAttendance(prev => [punch, ...prev]);
      setIsPunchModalOpen(false);
      addToast({
        title: 'Attendance Check-In Logged',
        message: `Clock-in registered at ${punch.check_in} for ${punch.employee_name}.`,
        type: 'success'
      });
      return punch;
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to register punch.', type: 'danger' });
    }
  };

  const handleApplyLeave = async (leaveData) => {
    try {
      const leave = await hrService.applyLeave({
        ...leaveData,
        employee_code: user?.employee_code || 'SH-1002',
        employee_name: user?.username || 'Staff Associate'
      });
      setLeaves(prev => [leave, ...prev]);
      setIsLeaveModalOpen(false);
      addToast({
        title: 'Leave Application Dispatched',
        message: `${leave.leave_type} request for ${leave.days} day(s) submitted for supervisor authorization.`,
        type: 'success'
      });
      return leave;
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to apply leave.', type: 'danger' });
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      const updated = await hrService.updateLeaveStatus(leaveId, 'Approved', user?.username || 'Director HR');
      setLeaves(prev => prev.map(l => l.id === leaveId ? updated : l));
      addToast({
        title: 'Leave Request Approved',
        message: `Leave authorized and absence calendar updated.`,
        type: 'success'
      });
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to approve leave.', type: 'danger' });
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      const updated = await hrService.updateLeaveStatus(leaveId, 'Rejected', user?.username || 'Director HR');
      setLeaves(prev => prev.map(l => l.id === leaveId ? updated : l));
      addToast({
        title: 'Leave Request Rejected',
        message: 'Notification sent to employee citing staffing requirements.',
        type: 'warning'
      });
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to reject leave.', type: 'danger' });
    }
  };

  const handleExecutePayroll = async (payrollData) => {
    try {
      const run = await hrService.executePayrollRun(payrollData);
      setPayrollRuns(prev => [run, ...prev]);
      setIsPayrollModalOpen(false);
      addToast({
        title: 'Direct Deposit Payroll Disbursed',
        message: `${run.period} payroll ($${Number(run.total_net).toLocaleString()}) routed to NACHA bank clearing house.`,
        type: 'success'
      });
      return run;
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to run payroll.', type: 'danger' });
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      const job = await hrService.createJobOpening(jobData);
      setJobOpenings(prev => [job, ...prev]);
      setIsJobModalOpen(false);
      addToast({
        title: 'Job Opening Published',
        message: `Requisition "${job.title}" posted to internal ATS and job portals.`,
        type: 'success'
      });
      return job;
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to post job opening.', type: 'danger' });
    }
  };

  const handleUploadDocument = (docData) => {
    const doc = hrService.uploadDocument(docData);
    setDocuments(prev => [doc, ...prev]);
    addToast({
      title: 'HR Compliance Document Uploaded',
      message: `${doc.title} filed to employee digital vault.`,
      type: 'success'
    });
    return doc;
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchDept = filters.department === 'ALL' || e.department?.toLowerCase() === filters.department?.toLowerCase();
      const matchBranch = filters.branch === 'ALL' || e.branch?.toLowerCase() === filters.branch?.toLowerCase();
      const matchStatus = filters.status === 'ALL' || e.employment_status?.toLowerCase() === filters.status?.toLowerCase();
      const matchSearch = !filters.search ||
        e.first_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        e.last_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        e.employee_code?.toLowerCase().includes(filters.search.toLowerCase()) ||
        e.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        e.designation?.toLowerCase().includes(filters.search.toLowerCase());
      return matchDept && matchBranch && matchStatus && matchSearch;
    });
  }, [employees, filters]);

  const kpis = useMemo(() => hrService.get12HRKPIs(), []);
  const analytics = useMemo(() => hrService.getHRAnalytics(), []);

  return {
    loading,
    employees: filteredEmployees,
    rawEmployees: employees,
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
    isAddEmployeeModalOpen,
    setIsAddEmployeeModalOpen,
    selectedEmployeeProfile,
    setSelectedEmployeeProfile,
    isLeaveModalOpen,
    setIsLeaveModalOpen,
    isPunchModalOpen,
    setIsPunchModalOpen,
    isPayrollModalOpen,
    setIsPayrollModalOpen,
    isJobModalOpen,
    setIsJobModalOpen,
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
    refreshHCMData: loadAllHCMData
  };
}
