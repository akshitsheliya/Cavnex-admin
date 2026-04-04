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
import Modal from "../../components/common/Modal";
import { getProjectStatCards } from "../../config/statCardConfigs";
import PageHeader from "../../components/common/PageHeader";

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
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      setStatsLoading(true);
      const response = await projectService.getProjectStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProjects(), fetchStats()]);
    setRefreshing(false);
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

  const statCards = getProjectStatCards(stats);

  const hasFilters =
    filters.search || filters.status || filters.projectType || filters.priority;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Manage your client Projects"
        onRefresh={handleRefresh}
        refreshing={refreshing}
      >
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
      </PageHeader>

      <ErrorAlert message={error} onClose={() => setError("")} />

      <StatCards stats={statCards} loading={statsLoading} columns={4} />

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
