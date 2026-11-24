import React, { useState } from 'react';
import {
  Award,
  Star,
  TrendingUp,
  Target,
  Plus,
  User,
  CheckCircle,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function EmployeePerformanceView({
  performanceReviews = [],
  onRefresh
}) {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState(
    performanceReviews.length > 0
      ? performanceReviews
      : [
          {
            id: 'perf-01',
            employee_code: 'SH-1001',
            employee_name: 'Marcus Chen',
            cycle: 'Q3 2026 Executive Review',
            kpi_rating: 4.8,
            goals_met: '96%',
            rating_label: 'Exceeds Expectations',
            recommendation: 'Executive Stock Incentive & Retention Grant',
            reviewer: 'Sarah Jenkins',
            status: 'Completed'
          },
          {
            id: 'perf-02',
            employee_code: 'SH-1002',
            employee_name: 'Elena Rostova',
            cycle: 'Q3 2026 Store Review',
            kpi_rating: 4.9,
            goals_met: '98%',
            rating_label: 'Exceptional',
            recommendation: 'Promotion to Regional Operations Director',
            reviewer: 'Sarah Jenkins',
            status: 'Completed'
          },
          {
            id: 'perf-03',
            employee_code: 'SH-1003',
            employee_name: 'David Miller',
            cycle: 'Q3 2026 Logistics Review',
            kpi_rating: 4.4,
            goals_met: '92%',
            rating_label: 'Consistently Meets Standards',
            recommendation: 'Annual Step Compensation Increment',
            reviewer: 'Marcus Chen',
            status: 'Completed'
          }
        ]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    employee_code: 'SH-1006',
    employee_name: 'Lucas Vance',
    cycle: 'Q3 2026 Retail Review',
    kpi_rating: 4.5,
    goals_met: '90%',
    rating_label: 'Exceeds Expectations',
    recommendation: 'Merit Step Increase & Team Lead Confirmation',
    reviewer: 'Elena Rostova'
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      ...newReview,
      id: `perf-${Date.now()}`,
      status: 'Completed'
    };
    setReviews([created, ...reviews]);
    setIsModalOpen(false);
    addToast({
      title: 'Performance Appraisal Finalized',
      message: `Appraisal for ${created.employee_name} saved to employee personnel file.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Enterprise Performance Avg</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Star className="w-4 h-4 fill-emerald-400" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            4.7 / 5.0
          </div>
          <p className="mt-1 text-xs text-slate-400">Top quartile enterprise standard</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Goal Attainment Index</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-primary font-mono">
            95.3%
          </div>
          <p className="mt-1 text-xs text-slate-400">Quarterly OKRs completed</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329]">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-medium">
            <span>Promotions Recommended</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400 font-mono">
            {reviews.length} Finalized
          </div>
          <p className="mt-1 text-xs text-slate-400">Merit adjustments active</p>
        </div>
      </div>

      {/* Control bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex justify-between items-center">
        <div>
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Appraisal Cycles & Merit Evaluation Records
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Objective KPI ratings and career promotion tracking</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs shadow-md shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Log Employee Appraisal
        </Button>
      </div>

      {/* Reviews Table */}
      <div className="rounded-xl border border-white/10 bg-[#0B1329] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A16] text-slate-400 uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Evaluation Cycle</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center">Goals Met</th>
                <th className="py-3 px-4">Performance Tier</th>
                <th className="py-3 px-4">Merit Recommendation</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div>{r.employee_name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{r.employee_code}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">
                    {r.cycle}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-400 text-sm">
                    {r.kpi_rating} / 5.0
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">
                    {r.goals_met}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="primary" className="text-[10px]">
                      {r.rating_label}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs font-medium">
                    {r.recommendation}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-medium">
                    {r.reviewer}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Appraisal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Executive Performance Appraisal"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Employee Name & Code</label>
            <input
              type="text"
              required
              value={newReview.employee_name}
              onChange={(e) => setNewReview({ ...newReview, employee_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Overall Rating (1.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                required
                value={newReview.kpi_rating}
                onChange={(e) => setNewReview({ ...newReview, kpi_rating: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Goals Met (%)</label>
              <input
                type="text"
                required
                value={newReview.goals_met}
                onChange={(e) => setNewReview({ ...newReview, goals_met: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Merit / Promotion Recommendation</label>
            <input
              type="text"
              required
              value={newReview.recommendation}
              onChange={(e) => setNewReview({ ...newReview, recommendation: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
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
              Finalize Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
