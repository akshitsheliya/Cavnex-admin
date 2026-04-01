import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import FilterBar from "../../components/common/FilterBar";
import StatCards from "../../components/common/StatCards";
import EmptyState from "../../components/common/EmptyState";
import ErrorAlert from "../../components/common/ErrorAlert";
import TemplateCard from "../../components/templates/TemplateCard";
import { templateFilterConfig } from "../../config/filterConfigs";
import { getTemplateStatCards } from "../../config/statCardConfigs";
import templateService from "../../services/templateService";
import { toast } from "react-hot-toast";

const TemplateList = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
  });

  useEffect(() => {
    fetchTemplates();
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const response = await templateService.getTemplates(params);
      setTemplates(response.data || []);
    } catch (err) {
      setError("Failed to load templates");
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await templateService.getTemplateStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", type: "", category: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;
    try {
      await templateService.deleteTemplate(id);
      toast.success("Template deleted successfully");
      fetchTemplates();
      fetchStats();
    } catch (err) {
      toast.error("Failed to delete template");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await templateService.duplicateTemplate(id);
      toast.success("Template duplicated successfully");
      fetchTemplates();
    } catch (err) {
      toast.error("Failed to duplicate template");
    }
  };

  const handleSeedDefaults = async () => {
    try {
      const response = await templateService.seedDefaultTemplates();
      toast.success(response.message || "Default templates created");
      fetchTemplates();
      fetchStats();
    } catch (err) {
      toast.error("Failed to create default templates");
    }
  };

  const statCards = getTemplateStatCards(stats);
  const hasFilters = filters.search || filters.type || filters.category;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Templates</h1>
          <p className="text-gray-500 mt-1">Manage your document templates</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleSeedDefaults}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Load Defaults
          </Button>
          <Button variant="neon" onClick={() => navigate("/templates/new")}>
            <svg
              className="w-4 h-4 mr-2"
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
            New Template
          </Button>
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError("")} />

      <StatCards stats={statCards} loading={statsLoading} />

      <FilterBar
        searchPlaceholder="Search templates..."
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        filterConfig={templateFilterConfig}
      />

      {loading ? (
        <Loader />
      ) : templates.length === 0 ? (
        <EmptyState
          title="No templates found"
          description={
            hasFilters
              ? "Try adjusting your filters"
              : "Get started by creating your first template or loading defaults"
          }
          actionLabel={hasFilters ? undefined : "Create Template"}
          onAction={hasFilters ? undefined : () => navigate("/templates/new")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateList;
