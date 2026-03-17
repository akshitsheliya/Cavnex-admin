// src/pages/projects/ProjectList.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import FilterBar from "../../components/common/FilterBar";
import Pagination from "../../components/common/Pagination";
import StatCards from "../../components/common/StatCards";
import EmptyState from "../../components/common/EmptyState";
import ErrorAlert from "../../components/common/ErrorAlert";
import ProjectCard from "../../components/projects/ProjectCard";
import { projectFilterConfig } from "../../config/filterConfigs";
import { formatCurrency } from "../../utils/formatters";
import projectService from "../../services/projectService";

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 9,
    total: 0,
    pages: 1,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    projectType: "",
    priority: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        page: pagination.current,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.projectType) params.projectType = filters.projectType;
      if (filters.priority) params.priority = filters.priority;

      const response = await projectService.getProjects(params);
      setProjects(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.limit, filters]);

  const fetchStats = async () => {
    try {
      const response = await projectService.getProjectStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "",
      projectType: "",
      priority: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await projectService.deleteProject(id);
      fetchProjects();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  const statCards = stats
    ? [
        {
          label: "Total Projects",
          value: stats.totalProjects || 0,
          color: "from-purple-500 to-pink-500",
          icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
        },
        {
          label: "Active",
          value: stats.activeProjects || 0,
          color: "from-neon-blue to-cyan-400",
          icon: "M13 10V3L4 14h7v7l9-11h-7z",
        },
        {
          label: "Overdue",
          value: stats.overdueProjects || 0,
          color: "from-red-500 to-rose-500",
          icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        },
        {
          label: "Total Revenue",
          value: formatCurrency(stats.totalPaid || 0),
          color: "from-green-400 to-emerald-500",
          icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        },
      ]
    : [];

  const hasFilters =
    filters.search || filters.status || filters.projectType || filters.priority;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your client projects</p>
        </div>
        <Button variant="neon" onClick={() => navigate("/projects/new")}>
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Project
        </Button>
      </div>

      <ErrorAlert message={error} onClose={() => setError("")} />

      <StatCards stats={statCards} />

      <FilterBar
        searchPlaceholder="Search projects..."
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        filterConfig={projectFilterConfig}
      />

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <EmptyState
          icon="📁"
          title="No projects found"
          description={
            hasFilters
              ? "Try adjusting your filters"
              : "Create your first project to get started"
          }
          actionLabel={hasFilters ? undefined : "Create Project"}
          onAction={hasFilters ? undefined : () => navigate("/projects/new")}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <Pagination
            currentPage={pagination.current}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ProjectList;
