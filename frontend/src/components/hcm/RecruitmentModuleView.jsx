import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Plus,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter,
  DollarSign,
  UserPlus
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function RecruitmentModuleView({
  jobOpenings = [],
  onCreateJob,
  onRefresh
}) {
  const { addToast } = useToast();
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Retail Operations',
    location: 'Main Flagship Store',
    openings: 1,
    salary_range: '$50,000 - $65,000'
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      addToast({ title: 'Validation Error', message: 'Job title is required.', type: 'danger' });
      return;
    }
    await onCreateJob(formData);
    setIsNewJobModalOpen(false);
    setFormData({
      title: '',
      department: 'Retail Operations',
      location: 'Main Flagship Store',
      openings: 1,
      salary_range: '$50,000 - $65,000'
    });
  };

  const pipelineStages = [
    { id: 'applied', label: 'Inbound Sourced', count: 46, color: 'text-slate-300' },
    { id: 'screening', label: 'HR Screening', count: 28, color: 'text-cyan-400' },
    { id: 'interview', label: 'Technical Interview', count: 14, color: 'text-primary' },
    { id: 'offer', label: 'Offer Extended', count: 5, color: 'text-amber-400' },
    { id: 'hired', label: 'Hired & Enrolled', count: 8, color: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Enterprise Talent Acquisition & ATS Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage open job requisitions, candidate evaluation funnels, and recruitment offers
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsNewJobModalOpen(true)}
          className="text-xs shadow-md shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Create Job Requisition
        </Button>
      </div>

      {/* ATS Pipeline Funnel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {pipelineStages.map((stage) => (
          <div key={stage.id} className="p-3.5 rounded-xl border border-white/10 bg-[#0B1329] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              {stage.label}
            </span>
            <div className={`text-2xl font-black font-mono ${stage.color}`}>
              {stage.count}
            </div>
            <p className="text-[10px] text-slate-500">Active candidates</p>
          </div>
        ))}
      </div>

      {/* Active Job Requisitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobOpenings.map((job) => (
          <div
            key={job.id}
            className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-4 hover:border-primary/40 transition group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                  {job.department}
                </span>
                <h4 className="text-base font-bold text-white mt-1.5 group-hover:text-primary transition">
                  {job.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {job.location}
                </p>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                {job.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-[#050A16] border border-white/5">
              <div>
                <span className="text-slate-400 block text-[10px]">Open Seats</span>
                <strong className="text-white font-mono">{job.openings} Positions</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Applicants</span>
                <strong className="text-primary font-mono">{job.applicants} Candidates</strong>
              </div>
              <div className="col-span-2 pt-1 border-t border-white/5">
                <span className="text-slate-400 block text-[10px]">Target Budget Range</span>
                <span className="text-emerald-400 font-mono font-medium">{job.salary_range}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] font-mono">Stage: {job.stage}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  addToast({
                    title: 'Applicant Pool Opened',
                    message: `Displaying candidate profiles for ${job.title}.`,
                    type: 'info'
                  });
                }}
                className="text-xs text-primary hover:text-white"
              >
                Review Pipeline <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* New Requisition Modal */}
      <Modal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        title="Create Job Requisition"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Requisition Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Lead Logistics Dispatcher"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Target Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Retail Operations">Retail Operations</option>
                <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                <option value="Warehouse Operations">Warehouse Operations</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Retail Technology">Retail Technology</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Location</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Main Flagship Store">Main Flagship Store</option>
                <option value="Central Logistics Hub">Central Logistics Hub</option>
                <option value="HQ Corporate (Hybrid)">HQ Corporate (Hybrid)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Approved Openings</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.openings}
                onChange={(e) => setFormData({ ...formData, openings: parseInt(e.target.value || 1) })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Target Compensation</label>
              <input
                type="text"
                placeholder="$50,000 - $65,000"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewJobModalOpen(false)}
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
              Publish Requisition
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
