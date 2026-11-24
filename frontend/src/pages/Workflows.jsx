import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Plus,
  RefreshCw,
  Download,
  Shield,
  Zap,
  Clock,
  Activity,
  CheckCircle,
  FileSpreadsheet,
  AlertTriangle,
  Eye,
  Sliders,
  Sparkles,
  Command,
  ChevronRight
} from 'lucide-react';
import { useWorkflows } from '../hooks/useWorkflows';
import {
  PendingApprovalsDashboard,
  ApprovalDrawer,
  SLAMonitoringWidget,
  AutomationRulesBuilder,
  WorkflowHistoryAudit,
  WorkflowAnalyticsCharts,
  WorkflowExportModal,
  WorkflowBuilderModal,
  VisualWorkflowDesigner
} from '../components/workflow';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function Workflows() {
  const {
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
    refreshData
  } = useWorkflows();

  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'definitions' | 'rules' | 'analytics' | 'audit'
  const [inspectingWorkflow, setInspectingWorkflow] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Keyboard Shortcuts listener (N, A, R, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (['input', 'textarea', 'select'].includes(activeTag)) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsBuilderOpen(true);
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setActiveTab('approvals');
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        triggerRefresh();
      } else if (e.key === 'Escape') {
        setSelectedApproval(null);
        setIsBuilderOpen(false);
        setIsExportModalOpen(false);
        setInspectingWorkflow(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    refreshData().finally(() => {
      setTimeout(() => setIsRefreshing(false), 600);
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Enterprise Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-soft">
              Enterprise Governance & Operations
            </span>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Command className="w-3 h-3 text-slate-500" />
              <span>Shortcuts:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-slate-300 font-mono">N</kbd> New
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-slate-300 font-mono">A</kbd> Approvals
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-slate-300 font-mono">R</kbd> Refresh
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            Workflows & Approval Engine
            <Badge variant="outline" className="bg-primary/10 text-primary-soft border-primary/20 text-xs">
              S/4HANA & NetSuite Grade
            </Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-tier approvals, policy validation gates, SLA surveillance, and event-driven automation rules.
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerRefresh}
            disabled={isRefreshing}
            className="text-xs h-9 text-slate-300 hover:text-white border border-white/10 bg-white/[0.02]"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="text-xs h-9 border-white/10 text-slate-200 hover:bg-white/5"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Export Data
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsBuilderOpen(true)}
            className="text-xs h-9 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> New Workflow
          </Button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'approvals'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending Approvals Queue
          {kpis.pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold">
              {kpis.pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('definitions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'definitions'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Workflow Definitions ({workflows.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'rules'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Automation Rules ({rules.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'analytics'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          SLA & Intelligence Analytics
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'audit'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Governance Audit Trail
        </button>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === 'approvals' && (
          <motion.div
            key="tab-approvals"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {/* Pending Approvals Dashboard */}
            <PendingApprovalsDashboard
              kpis={kpis}
              approvals={filteredApprovals}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              onSelectApproval={setSelectedApproval}
              onQuickApprove={(id) => handleApprove(id, 'Quick authorized via approval table')}
              onQuickReject={(id) => handleReject(id, 'Declined via quick approval action')}
            />

            {/* SLA Monitoring Breach Bar */}
            <SLAMonitoringWidget
              slaAlerts={slaAlerts}
              onSelectAlert={(alert) => {
                const target = approvals.find((a) => a.id === alert.id);
                if (target) setSelectedApproval(target);
              }}
            />
          </motion.div>
        )}

        {activeTab === 'definitions' && (
          <motion.div
            key="tab-definitions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {inspectingWorkflow ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#0B1329]">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInspectingWorkflow(null)}
                      className="text-xs text-slate-300"
                    >
                      ← Back to All Workflows
                    </Button>
                    <div>
                      <h3 className="text-base font-bold text-white">{inspectingWorkflow.name}</h3>
                      <p className="text-xs text-slate-400">{inspectingWorkflow.description}</p>
                    </div>
                  </div>

                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    {inspectingWorkflow.status}
                  </Badge>
                </div>

                {/* Embedded Visual Canvas */}
                <VisualWorkflowDesigner nodes={inspectingWorkflow.nodes} readOnly={false} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    Configured Enterprise Pipelines ({workflows.length} Active Types)
                  </h3>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsBuilderOpen(true)}
                    className="text-xs h-8 gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Deploy Workflow
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {workflows.map((wf) => (
                    <motion.div
                      key={wf.id}
                      whileHover={{ y: -2 }}
                      className="rounded-xl border border-white/10 bg-[#0B1329] p-5 flex flex-col justify-between hover:border-primary/40 transition group cursor-pointer"
                      onClick={() => setInspectingWorkflow(wf)}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-mono text-[10px] text-slate-500 uppercase">
                            {wf.type || 'WORKFLOW'}
                          </span>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                            {wf.status}
                          </Badge>
                        </div>

                        <h4 className="text-sm font-semibold text-white group-hover:text-primary-soft transition">
                          {wf.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {wf.description}
                        </p>

                        <div className="mt-3 pt-2 border-t border-white/5 space-y-1 text-xs text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Trigger:</span>
                            <span className="font-mono text-[11px] truncate max-w-[140px] text-slate-300">
                              {wf.trigger}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Tiers:</span>
                            <span className="font-semibold text-white">
                              {wf.approval_levels?.length || 1} Level(s)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Success Rate:</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              {wf.success_rate || 98.5}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-primary-soft group-hover:text-white">
                        <span>Inspect Visual Canvas</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'rules' && (
          <motion.div
            key="tab-rules"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <AutomationRulesBuilder
              rules={rules}
              onToggleRule={handleToggleRule}
              onCreateRule={handleCreateRule}
            />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="tab-analytics"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <WorkflowAnalyticsCharts />
            <SLAMonitoringWidget
              slaAlerts={slaAlerts}
              onSelectAlert={(alert) => {
                const target = approvals.find((a) => a.id === alert.id);
                if (target) setSelectedApproval(target);
              }}
            />
          </motion.div>
        )}

        {activeTab === 'audit' && (
          <motion.div
            key="tab-audit"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <WorkflowHistoryAudit auditLogs={auditLogs} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over Approval Drawer */}
      <ApprovalDrawer
        approval={selectedApproval}
        isOpen={Boolean(selectedApproval)}
        onClose={() => setSelectedApproval(null)}
        onApprove={(id, comment) => handleApprove(id, comment)}
        onReject={(id, comment) => handleReject(id, comment)}
        onRequestChanges={(id, comment) => handleRequestChanges(id, comment)}
        onDelegate={(id, target, comment) => handleDelegate(id, target, comment)}
        onEscalate={(id, comment) => handleEscalate(id, comment)}
      />

      {/* New Workflow Builder Modal */}
      <WorkflowBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSave={handleCreateWorkflow}
      />

      {/* Export Modal */}
      <WorkflowExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        approvals={approvals}
        auditLogs={auditLogs}
      />
    </div>
  );
}

export default Workflows;
