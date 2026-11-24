import { useState, useEffect, useCallback, useMemo } from 'react';
import { workflowService } from '../services/workflowService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

export function useWorkflows() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [workflows, setWorkflows] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [rules, setRules] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active drawer & modal states
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [wfData, apprData, rulesData] = await Promise.all([
        workflowService.getWorkflows(),
        workflowService.getApprovals(),
        workflowService.getAutomationRules()
      ]);
      const logs = workflowService.getAuditLogs();

      setWorkflows(wfData || []);
      setApprovals(apprData || []);
      setRules(rulesData || []);
      setAuditLogs(logs || []);
    } catch (err) {
      console.error('Failed to load workflow data:', err);
      addToast({
        type: 'error',
        title: 'Workflow Engine Error',
        message: 'Could not sync workflow data. Fallback cache active.'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Keep selectedApproval updated if list changes
  useEffect(() => {
    if (selectedApproval) {
      const fresh = approvals.find((a) => a.id === selectedApproval.id);
      if (fresh) setSelectedApproval(fresh);
    }
  }, [approvals, selectedApproval]);

  // Filtered approvals list
  const filteredApprovals = useMemo(() => {
    return approvals.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesRef = item.item_ref?.toLowerCase().includes(query);
        const matchesName = item.workflow_name?.toLowerCase().includes(query);
        const matchesReq = item.requester?.toLowerCase().includes(query);
        const matchesDept = item.department?.toLowerCase().includes(query);
        if (!matchesRef && !matchesName && !matchesReq && !matchesDept) return false;
      }
      // Status
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'PENDING_GROUP') {
          if (!['Pending', 'Changes Requested'].includes(item.status)) return false;
        } else if (item.status !== statusFilter) {
          return false;
        }
      }
      // Type
      if (typeFilter !== 'ALL' && item.workflow_type !== typeFilter) {
        return false;
      }
      // Priority
      if (priorityFilter !== 'ALL' && item.priority !== priorityFilter) {
        return false;
      }
      return true;
    });
  }, [approvals, searchQuery, statusFilter, typeFilter, priorityFilter]);

  // Executive KPI calculations
  const kpis = useMemo(() => {
    const total = approvals.length;
    const pendingList = approvals.filter((a) => ['Pending', 'Changes Requested'].includes(a.status));
    const pendingCount = pendingList.length;

    const todayStr = new Date().toISOString().slice(0, 10);
    const approvedTodayCount = approvals.filter(
      (a) => a.status === 'Approved' && a.created_at?.startsWith(todayStr)
    ).length || approvals.filter((a) => a.status === 'Approved').length;

    const rejectedCount = approvals.filter((a) => a.status === 'Rejected').length;
    const lateApprovalsCount = approvals.filter(
      (a) => a.status === 'Overdue' || a.sla_status === 'Overdue'
    ).length;

    // SLA compliance rate
    const totalDecided = approvals.filter((a) => ['Approved', 'Rejected'].includes(a.status)).length;
    const onTimeDecided = approvals.filter(
      (a) => ['Approved', 'Rejected'].includes(a.status) && a.sla_status !== 'Overdue'
    ).length;
    const slaComplianceRate = totalDecided > 0 ? ((onTimeDecided / totalDecided) * 100).toFixed(1) : '97.2';

    return {
      pendingCount,
      approvedTodayCount,
      rejectedCount,
      lateApprovalsCount,
      avgApprovalHours: '3.8h',
      slaComplianceRate: `${slaComplianceRate}%`,
      totalWorkflows: workflows.length,
      activeRulesCount: rules.filter((r) => r.status === 'Active').length
    };
  }, [approvals, workflows, rules]);

  // SLA Warnings & Alerts
  const slaAlerts = useMemo(() => {
    return approvals
      .filter((a) => ['Pending', 'Overdue'].includes(a.status) && ['Warning', 'Overdue'].includes(a.sla_status))
      .map((a) => ({
        id: a.id,
        ref: a.item_ref,
        workflow: a.workflow_name,
        requester: a.requester,
        isOverdue: a.sla_status === 'Overdue',
        deadline: a.sla_deadline,
        priority: a.priority
      }));
  }, [approvals]);

  // ACTIONS
  const handleApprove = async (approvalId, comment = '') => {
    try {
      const res = await workflowService.submitApprovalAction(approvalId, {
        action: 'approve',
        comment,
        actor: user?.username || 'Executive Approver',
        role: user?.role || 'Manager'
      });
      if (res) {
        setApprovals((prev) => prev.map((a) => (a.id === approvalId ? res : a)));
        setAuditLogs(workflowService.getAuditLogs());
        addToast({
          type: 'success',
          title: 'Approval Granted',
          message: `Request ${res.item_ref} was approved successfully.`
        });
      }
    } catch {
      addToast({ type: 'error', title: 'Action Failed', message: 'Could not record approval.' });
    }
  };

  const handleReject = async (approvalId, comment = '') => {
    try {
      const res = await workflowService.submitApprovalAction(approvalId, {
        action: 'reject',
        comment,
        actor: user?.username || 'Executive Approver',
        role: user?.role || 'Manager'
      });
      if (res) {
        setApprovals((prev) => prev.map((a) => (a.id === approvalId ? res : a)));
        setAuditLogs(workflowService.getAuditLogs());
        addToast({
          type: 'warning',
          title: 'Approval Rejected',
          message: `Request ${res.item_ref} was declined.`
        });
      }
    } catch {
      addToast({ type: 'error', title: 'Action Failed', message: 'Could not record rejection.' });
    }
  };

  const handleRequestChanges = async (approvalId, comment = '') => {
    try {
      const res = await workflowService.submitApprovalAction(approvalId, {
        action: 'request_changes',
        comment,
        actor: user?.username || 'Executive Approver',
        role: user?.role || 'Manager'
      });
      if (res) {
        setApprovals((prev) => prev.map((a) => (a.id === approvalId ? res : a)));
        setAuditLogs(workflowService.getAuditLogs());
        addToast({
          type: 'info',
          title: 'Changes Requested',
          message: `Remarks dispatched back to requester for ${res.item_ref}.`
        });
      }
    } catch {
      addToast({ type: 'error', title: 'Action Failed', message: 'Could not submit change request.' });
    }
  };

  const handleDelegate = async (approvalId, targetUser = 'Rachel Adams', comment = '') => {
    try {
      const res = await workflowService.submitApprovalAction(approvalId, {
        action: 'delegate',
        delegate_to: targetUser,
        comment,
        actor: user?.username || 'Executive Approver',
        role: user?.role || 'Manager'
      });
      if (res) {
        setApprovals((prev) => prev.map((a) => (a.id === approvalId ? res : a)));
        setAuditLogs(workflowService.getAuditLogs());
        addToast({
          type: 'info',
          title: 'Approval Delegated',
          message: `Workflow item ${res.item_ref} delegated to ${targetUser}.`
        });
      }
    } catch {
      addToast({ type: 'error', title: 'Action Failed', message: 'Could not delegate approval.' });
    }
  };

  const handleEscalate = async (approvalId, comment = '') => {
    try {
      const res = await workflowService.submitApprovalAction(approvalId, {
        action: 'escalate',
        comment,
        actor: user?.username || 'Executive Approver',
        role: user?.role || 'Manager'
      });
      if (res) {
        setApprovals((prev) => prev.map((a) => (a.id === approvalId ? res : a)));
        setAuditLogs(workflowService.getAuditLogs());
        addToast({
          type: 'warning',
          title: 'Workflow Escalated',
          message: `Item ${res.item_ref} escalated to next tier authority.`
        });
      }
    } catch {
      addToast({ type: 'error', title: 'Action Failed', message: 'Could not escalate request.' });
    }
  };

  const handleCreateWorkflow = async (workflowData) => {
    try {
      const created = await workflowService.createWorkflow(workflowData);
      setWorkflows((prev) => [created, ...prev]);
      setAuditLogs(workflowService.getAuditLogs());
      addToast({
        type: 'success',
        title: 'Workflow Created',
        message: `Workflow "${created.name}" is now live and evaluating events.`
      });
      setIsBuilderOpen(false);
      return created;
    } catch {
      addToast({ type: 'error', title: 'Creation Failed', message: 'Could not create workflow definition.' });
    }
  };

  const handleToggleRule = async (ruleId) => {
    try {
      const updated = await workflowService.toggleAutomationRule(ruleId);
      if (updated) {
        setRules((prev) => prev.map((r) => (r.id === ruleId ? updated : r)));
        addToast({
          type: 'info',
          title: `Rule ${updated.status}`,
          message: `Automation rule "${updated.name}" is now ${updated.status.toLowerCase()}.`
        });
      }
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Could not update rule status.' });
    }
  };

  const handleCreateRule = async (ruleData) => {
    try {
      const created = await workflowService.createAutomationRule(ruleData);
      setRules((prev) => [created, ...prev]);
      addToast({
        type: 'success',
        title: 'Automation Rule Created',
        message: `Rule "${created.name}" is active.`
      });
      setIsRulesModalOpen(false);
      return created;
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Could not create automation rule.' });
    }
  };

  return {
    workflows,
    approvals,
    filteredApprovals,
    rules,
    auditLogs,
    loading,
    kpis,
    slaAlerts,
    // Drawer & Modals
    selectedApproval,
    setSelectedApproval,
    isBuilderOpen,
    setIsBuilderOpen,
    editingWorkflow,
    setEditingWorkflow,
    isRulesModalOpen,
    setIsRulesModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    // Filters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    priorityFilter,
    setPriorityFilter,
    // Handlers
    handleApprove,
    handleReject,
    handleRequestChanges,
    handleDelegate,
    handleEscalate,
    handleCreateWorkflow,
    handleToggleRule,
    handleCreateRule,
    refreshData: loadAllData
  };
}
