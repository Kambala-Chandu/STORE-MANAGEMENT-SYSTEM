import { useState, useCallback, useEffect } from 'react';
import { projectService } from '../services/projectService';

export const useProjects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'ALL' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [projData, resData, timeData, kpiData, analyticsData] = await Promise.all([
        projectService.getProjects(),
        projectService.getResources(),
        projectService.getTimesheets(),
        projectService.get12ProjectKPIs(),
        projectService.getProjectAnalytics()
      ]);
      setProjects(projData);
      setResources(resData);
      setTimesheets(timeData);
      setKpis(kpiData);
      setAnalytics(analyticsData);
      if (projData.length > 0 && !selectedProject) {
        setSelectedProject(projData[0]);
      }
    } catch (err) {
      console.error('Failed to load projects data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (selectedProject) {
      projectService.getTasks(selectedProject.id).then(setTasks);
    } else {
      projectService.getTasks().then(setTasks);
    }
  }, [selectedProject]);

  const handleCreateProject = useCallback(async (data) => {
    try {
      const created = await projectService.createProject(data);
      setProjects((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  }, []);

  const handleCreateTimesheet = useCallback(async (data) => {
    try {
      const created = await projectService.createTimesheet(data);
      setTimesheets((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Failed to create timesheet entry:', err);
    }
  }, []);

  return {
    loading,
    projects,
    selectedProject,
    setSelectedProject,
    tasks,
    resources,
    timesheets,
    kpis,
    analytics,
    filters,
    setFilters,
    isExportModalOpen,
    setIsExportModalOpen,
    handleCreateProject,
    handleCreateTimesheet,
    refreshData
  };
};
