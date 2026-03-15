import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import TemplateCard from "../../components/templates/TemplateCard";
import templateService from "../../services/templateService";
import { templateTypes, templateCategories } from "../../data/placeholders";
import { toast } from "react-hot-toast";

const TemplateList = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    search: "",
  });

  useEffect(() => {
    fetchTemplates();
    fetchStats();
  }, [filters]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const response = await templateService.getTemplates(params);
      setTemplates(response.data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await templateService.getTemplateStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;

    try {
      await templateService.deleteTemplate(id);
      toast.success("Template deleted successfully");
      fetchTemplates();
      fetchStats();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await templateService.duplicateTemplate(id);
      toast.success("Template duplicated successfully");
      fetchTemplates();
    } catch (error) {
      console.error("Error duplicating template:", error);
      toast.error("Failed to duplicate template");
    }
  };

  const handleSeedDefaults = async () => {
    try {
      const response = await templateService.seedDefaultTemplates();
      toast.success(response.message || "Default templates created");
      fetchTemplates();
      fetchStats();
    } catch (error) {
      console.error("Error seeding templates:", error);
      toast.error("Failed to create default templates");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Templates</h1>
          <p className="text-gray-400 mt-1">Manage your document templates</p>
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
          <Button onClick={() => navigate("/templates/new")}>
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

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {stats.totalTemplates}
            </p>
            <p className="text-sm text-gray-400">Total Templates</p>
          </div>
          {Object.entries(stats.typeCounts || {}).map(([type, count]) => (
            <div key={type} className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-sm text-gray-400 capitalize">{type}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search templates..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
          >
            <option value="">All Types</option>
            {templateTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
          >
            <option value="">All Categories</option>
            {templateCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          {(filters.type || filters.category || filters.search) && (
            <button
              onClick={() => setFilters({ type: "", category: "", search: "" })}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <Loader />
      ) : templates.length > 0 ? (
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
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No templates found
          </h3>
          <p className="text-gray-400 mb-6">
            {filters.search || filters.type || filters.category
              ? "Try adjusting your filters"
              : "Get started by creating your first template or loading defaults"}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" onClick={handleSeedDefaults}>
              Load Defaults
            </Button>
            <Button onClick={() => navigate("/templates/new")}>
              Create Template
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateList;
