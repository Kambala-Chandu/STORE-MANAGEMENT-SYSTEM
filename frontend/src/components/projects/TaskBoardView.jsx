import React from 'react';
import { Clock, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui';

export const TaskBoardView = ({ tasks = [], selectedProject }) => {
  const columns = [
    { id: 'To Do', label: 'To Do', color: 'border-slate-500/40 text-slate-400' },
    { id: 'In Progress', label: 'In Progress', color: 'border-blue-500/40 text-blue-400' },
    { id: 'Review', label: 'Review & QA', color: 'border-amber-500/40 text-amber-400' },
    { id: 'Done', label: 'Completed', color: 'border-emerald-500/40 text-emerald-400' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Project Sprint Task Board</h3>
          <p className="text-xs text-slate-400">
            {selectedProject ? `Active Scope: ${selectedProject.name} (${selectedProject.code})` : 'All Enterprise Sprint Work'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div key={col.id} className="bg-[#0B1329] border border-white/10 rounded-xl p-4 shadow-xl flex flex-col">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>{col.label}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-slate-300 font-bold">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-[#050A16] border border-white/5 rounded-lg p-3 hover:border-white/20 transition-all shadow-md group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h5 className="text-xs font-semibold text-white leading-snug group-hover:text-primary transition-colors">
                        {task.title}
                      </h5>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                          {task.assignee?.charAt(0) || 'U'}
                        </div>
                        <span className="truncate max-w-[90px]">{task.assignee}</span>
                      </div>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium ${
                        task.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' :
                        task.priority === 'High' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-500/20 text-slate-300'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-500 italic">
                    No tasks in this lane
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
