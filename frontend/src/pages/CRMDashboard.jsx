import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  TrendingUp,
  Building2,
  Calendar,
  LifeBuoy,
  Megaphone,
  Award,
  BarChart3,
  MessageSquare,
  Download,
  RefreshCw,
  SlidersHorizontal,
  Search,
  Sparkles,
  DollarSign,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useCRM } from '../hooks/useCRM';
import {
  Customer360View,
  LeadManagementView,
  OpportunityPipelineView,
  ContactManagementView,
  SalesActivitiesView,
  CustomerSupportView,
  MarketingCampaignsView,
  LoyaltyProgramView,
  CRMAnalyticsDashboard,
  CommunicationCenterView,
  CRMKPIGrid,
  CRMExportModal
} from '../components/crm';

export function CRMDashboard() {
  const {
    loading,
    customers360,
    rawCustomers,
    leads,
    opportunities,
    contacts,
    activities,
    tickets,
    campaigns,
    loyalty,
    kpis,
    analytics,
    filters,
    setFilters,
    isExportModalOpen,
    setIsExportModalOpen,
    handleCreateLead,
    handleCreateOpportunity,
    handleUpdateOppStage,
    handleCreateTicket,
    handleResolveTicket,
    handleLogActivity,
    handleCreateCampaign,
    refreshCRMData
  } = useCRM();

  const [activeTab, setActiveTab] = useState('customers');

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
        refreshCRMData();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setActiveTab('leads');
      } else if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        setActiveTab('opportunities');
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setActiveTab('tickets');
      } else if (e.key === 'Escape') {
        setIsExportModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refreshCRMData, setIsExportModalOpen]);

  const tabs = [
    { id: 'customers', label: 'Customer 360°', icon: Users, count: customers360.length },
    { id: 'leads', label: 'Lead Management', icon: UserPlus, count: leads.filter(l => l.status === 'New' || l.status === 'Contacted').length },
    { id: 'opportunities', label: 'Deals & Pipeline', icon: TrendingUp, count: opportunities.length },
    { id: 'contacts', label: 'B2B Accounts & Contacts', icon: Building2, count: contacts.length },
    { id: 'activities', label: 'Sales Activities', icon: Calendar, count: activities.length },
    { id: 'tickets', label: 'Support & SLAs', icon: LifeBuoy, count: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length },
    { id: 'campaigns', label: 'Marketing Campaigns', icon: Megaphone, count: campaigns.length },
    { id: 'loyalty', label: 'Loyalty & Rewards', icon: Award, count: loyalty?.total_members || 0 },
    { id: 'analytics', label: 'CRM Analytics', icon: BarChart3 },
    { id: 'communications', label: 'Omni-Channel Hub', icon: MessageSquare }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-[#0B1329] relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              Enterprise ERP Phase 4.6
            </span>
            <span className="text-slate-400 text-xs font-medium">• Salesforce & Dynamics 365 Grade CRM</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Enterprise CRM, Customer Experience & Sales Automation
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            360° customer dossiers, AI lead scoring & routing, Kanban sales opportunity pipelines, SLA-governed helpdesk tickets, omnichannel messaging, and loyalty tier engines.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshCRMData}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
            title="Refresh CRM Pipeline (Press R)"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh <span className="hidden sm:inline font-mono text-[10px] text-slate-400 ml-1">(R)</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
            title="Export CRM Dossier (Press E)"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export <span className="hidden sm:inline font-mono text-[10px] text-slate-400 ml-1">(E)</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('opportunities')}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
            title="Pipeline Deals (Press O)"
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            New Deal <span className="hidden sm:inline font-mono text-[10px] text-slate-400 ml-1">(O)</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('leads')}
            className="text-xs shadow-lg shadow-primary/25"
            title="Add Lead (Press N)"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Add Lead <span className="hidden sm:inline font-mono text-[10px] text-primary-foreground/80 ml-1">(N)</span>
          </Button>
        </div>

        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-primary/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Smart Filters Bar */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase text-[11px] tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            CRM Scope:
          </span>

          <select
            value={filters.tier}
            onChange={(e) => setFilters(prev => ({ ...prev, tier: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Loyalty Tiers</option>
            <option value="Platinum">Platinum Enterprise</option>
            <option value="Gold">Gold VIP</option>
            <option value="Silver">Silver Preferred</option>
            <option value="Bronze">Bronze Entry</option>
          </select>

          <div className="flex items-center gap-1 bg-[#050A16] border border-white/10 px-2 py-1 rounded-lg text-slate-400 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Predictive Lead Routing: <strong className="text-emerald-400 font-mono">ENGAGED</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search account, code, email, rep..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 12 Executive CRM KPI Cards */}
      <CRMKPIGrid kpis={kpis} />

      {/* Enterprise Cockpit Tabs Navigation */}
      <div className="border-b border-white/10">
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none" aria-label="CRM Tabs">
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
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'customers' && (
              <Customer360View
                customers={customers360}
                onRefresh={refreshCRMData}
              />
            )}

            {activeTab === 'leads' && (
              <LeadManagementView
                leads={leads}
                onCreateLead={handleCreateLead}
                onRefresh={refreshCRMData}
              />
            )}

            {activeTab === 'opportunities' && (
              <OpportunityPipelineView
                opportunities={opportunities}
                onCreateOpportunity={handleCreateOpportunity}
                onUpdateStage={handleUpdateOppStage}
                onRefresh={refreshCRMData}
              />
            )}

            {activeTab === 'contacts' && (
              <ContactManagementView
                contacts={contacts}
              />
            )}

            {activeTab === 'activities' && (
              <SalesActivitiesView
                activities={activities}
                onLogActivity={handleLogActivity}
              />
            )}

            {activeTab === 'tickets' && (
              <CustomerSupportView
                tickets={tickets}
                onCreateTicket={handleCreateTicket}
                onResolveTicket={handleResolveTicket}
              />
            )}

            {activeTab === 'campaigns' && (
              <MarketingCampaignsView
                campaigns={campaigns}
                onCreateCampaign={handleCreateCampaign}
              />
            )}

            {activeTab === 'loyalty' && (
              <LoyaltyProgramView
                loyalty={loyalty}
              />
            )}

            {activeTab === 'analytics' && (
              <CRMAnalyticsDashboard
                analytics={analytics}
              />
            )}

            {activeTab === 'communications' && (
              <CommunicationCenterView />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Export Modal */}
      <CRMExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

export default CRMDashboard;
