// src/pages/templates/TemplateList.jsx
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
import templateService from "../../services/templateService";
import { toast } from "react-hot-toast";

const TemplateList = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
  });

  useEffect(() => {
    fetchTemplates();
    fetchStats();
  }, [filters]);

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
      const response = await templateService.getTemplateStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
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

  const buildStatCards = () => {
    if (!stats) return [];
    const cards = [
      {
        label: "Total Templates",
        value: stats.totalTemplates || 0,
        color: "from-purple-500 to-pink-500",
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      },
    ];
    const typeColors = {
      invoice: "from-neon-green to-emerald-500",
      proposal: "from-neon-blue to-cyan-400",
      agreement: "from-amber-500 to-orange-500",
      receipt: "from-pink-500 to-rose-500",
    };
    const typeIcons = {
      invoice:
        "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
      proposal:
        "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      agreement:
        "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      receipt:
        "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    };
    if (stats.typeCounts) {
      Object.entries(stats.typeCounts).forEach(([type, count]) => {
        cards.push({
          label: type.charAt(0).toUpperCase() + type.slice(1),
          value: count,
          color: typeColors[type] || "from-gray-400 to-gray-500",
          icon:
            typeIcons[type] ||
            "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        });
      });
    }
    return cards;
  };

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

      <StatCards stats={buildStatCards()} />

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
          icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
