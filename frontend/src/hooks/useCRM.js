import { useState, useEffect, useCallback, useMemo } from 'react';
import { crmService } from '../services/crmService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

export function useCRM() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [customers360, setCustomers360] = useState([]);
  const [leads, setLeads] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loyalty, setLoyalty] = useState({ total_members: 0, tiers: [], active_coupons: [] });

  // Filters
  const [filters, setFilters] = useState({
    tier: 'ALL',
    status: 'ALL',
    search: ''
  });

  // Modals state
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isAddOppModalOpen, setIsAddOppModalOpen] = useState(false);
  const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState(false);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [isAddCampaignModalOpen, setIsAddCampaignModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState(null);

  // Fetch CRM datasets
  const loadAllCRMData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        custs,
        lds,
        opps,
        tkts,
        camps,
        loyal
      ] = await Promise.all([
        crmService.getCustomers360(),
        crmService.getLeads(),
        crmService.getOpportunities(),
        crmService.getSupportTickets(),
        crmService.getCampaigns(),
        crmService.getLoyaltySummary()
      ]);

      setCustomers360(custs || []);
      setLeads(lds || []);
      setOpportunities(opps || []);
      setContacts(crmService.getContacts());
      setActivities(crmService.getActivities());
      setTickets(tkts || []);
      setCampaigns(camps || []);
      setLoyalty(loyal || { total_members: 0, tiers: [], active_coupons: [] });
    } catch (err) {
      console.error('CRM synchronization error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllCRMData();
  }, [loadAllCRMData]);

  // Handlers
  const handleCreateLead = async (leadData) => {
    try {
      const created = await crmService.createLead({
        ...leadData,
        assigned_to: leadData.assigned_to || user?.username || 'Sarah Jenkins'
      });
      setLeads(prev => [created, ...prev]);
      setIsAddLeadModalOpen(false);
      addToast({
        title: 'Sales Lead Enrolled',
        message: `${created.name} (${created.company}) added with Score ${created.score}.`,
        type: 'success'
      });
      return created;
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to create lead.', type: 'danger' });
    }
  };

  const handleCreateOpportunity = async (oppData) => {
    try {
      const created = await crmService.createOpportunity({
        ...oppData,
        assigned_rep: oppData.assigned_rep || user?.username || 'Sarah Jenkins'
      });
      setOpportunities(prev => [created, ...prev]);
      setIsAddOppModalOpen(false);
      addToast({
        title: 'Deal Opportunity Created',
        message: `Opportunity "${created.title}" ($${Number(created.amount).toLocaleString()}) added to pipeline.`,
        type: 'success'
      });
      return created;
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to create opportunity.', type: 'danger' });
    }
  };

  const handleUpdateOppStage = async (id, stage) => {
    try {
      const updated = await crmService.updateOpportunityStage(id, stage);
      setOpportunities(prev => prev.map(o => o.id === id ? updated : o));
      addToast({
        title: 'Deal Stage Advanced',
        message: `Opportunity moved to stage: ${stage}.`,
        type: 'info'
      });
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to update deal stage.', type: 'danger' });
    }
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      const created = await crmService.createSupportTicket({
        ...ticketData,
        assigned_agent: ticketData.assigned_agent || user?.username || 'Lucas Vance'
      });
      setTickets(prev => [created, ...prev]);
      setIsAddTicketModalOpen(false);
      addToast({
        title: 'Support Ticket Logged',
        message: `Ticket ${created.ticket_number} created with SLA target: ${created.sla_target_hours}h.`,
        type: 'success'
      });
      return created;
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to create support ticket.', type: 'danger' });
    }
  };

  const handleResolveTicket = (id) => {
    const updated = crmService.resolveSupportTicket(id);
    setTickets(prev => prev.map(t => t.id === id ? updated : t));
    addToast({
      title: 'Ticket Marked as Resolved',
      message: 'Resolution logged and customer feedback survey dispatched.',
      type: 'success'
    });
  };

  const handleLogActivity = (activityData) => {
    const act = crmService.logActivity({
      ...activityData,
      owner: activityData.owner || user?.username || 'Sarah Jenkins'
    });
    setActivities(prev => [act, ...prev]);
    setIsAddActivityModalOpen(false);
    addToast({
      title: 'Sales Activity Logged',
      message: `${act.type} scheduled for ${act.counterparty}.`,
      type: 'success'
    });
    return act;
  };

  const handleCreateCampaign = (campData) => {
    const camp = crmService.createCampaign(campData);
    setCampaigns(prev => [camp, ...prev]);
    setIsAddCampaignModalOpen(false);
    addToast({
      title: 'Marketing Campaign Launched',
      message: `Campaign "${camp.name}" scheduled across ${camp.channel}.`,
      type: 'success'
    });
    return camp;
  };

  const filteredCustomers = useMemo(() => {
    return customers360.filter(c => {
      const matchTier = filters.tier === 'ALL' || c.tier?.toLowerCase().includes(filters.tier.toLowerCase());
      const matchSearch = !filters.search ||
        c.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.customer_code?.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.industry?.toLowerCase().includes(filters.search.toLowerCase());
      return matchTier && matchSearch;
    });
  }, [customers360, filters]);

  const kpis = useMemo(() => crmService.get12CRMKPIs(), []);
  const analytics = useMemo(() => crmService.getCRMAnalytics(), []);

  return {
    loading,
    customers360: filteredCustomers,
    rawCustomers: customers360,
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
    isAddLeadModalOpen,
    setIsAddLeadModalOpen,
    isAddOppModalOpen,
    setIsAddOppModalOpen,
    isAddTicketModalOpen,
    setIsAddTicketModalOpen,
    isAddActivityModalOpen,
    setIsAddActivityModalOpen,
    isAddCampaignModalOpen,
    setIsAddCampaignModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    selectedCustomerProfile,
    setSelectedCustomerProfile,
    handleCreateLead,
    handleCreateOpportunity,
    handleUpdateOppStage,
    handleCreateTicket,
    handleResolveTicket,
    handleLogActivity,
    handleCreateCampaign,
    refreshCRMData: loadAllCRMData
  };
}
