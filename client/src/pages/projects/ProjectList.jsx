import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import ProjectCard from "../../components/projects/ProjectCard";
import ProjectFilters from "../../components/projects/ProjectFilters";
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage your client projects</p>
        </div>
        <Button variant="neon" onClick={() => navigate("/projects/new")}>
          + New Project
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4">
            <p className="text-sm text-gray-400">Total Projects</p>
            <p className="text-2xl font-bold text-white">
              {stats.totalProjects || 0}
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-gray-400">Active</p>
            <p className="text-2xl font-bold text-neon-blue">
              {stats.activeProjects || 0}
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-gray-400">Overdue</p>
            <p className="text-2xl font-bold text-red-400">
              {stats.overdueProjects || 0}
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-gray-400">Total Revenue</p>
            <p className="text-2xl font-bold text-neon-green">
              {formatCurrency(stats.totalPaid || 0)}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <ProjectFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-400 mb-6">
            {filters.search ||
            filters.status ||
            filters.projectType ||
            filters.priority
              ? "Try adjusting your filters"
              : "Create your first project to get started"}
          </p>
          {!filters.search &&
            !filters.status &&
            !filters.projectType &&
            !filters.priority && (
              <Button variant="neon" onClick={() => navigate("/projects/new")}>
                Create Project
              </Button>
            )}
        </div>
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.current}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectList;
