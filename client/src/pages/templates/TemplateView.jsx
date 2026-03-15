import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import TemplatePreview from "../../components/templates/TemplatePreview";
import templateService from "../../services/templateService";
import { toast } from "react-hot-toast";

const TemplateView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("preview");

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await templateService.getTemplate(id);
      setTemplate(response.data);
    } catch (error) {
      console.error("Error fetching template:", error);
      toast.error("Failed to load template");
      navigate("/templates");
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      await templateService.duplicateTemplate(id);
      toast.success("Template duplicated successfully");
      navigate("/templates");
    } catch (error) {
      console.error("Error duplicating template:", error);
      toast.error("Failed to duplicate template");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;

    try {
      await templateService.deleteTemplate(id);
      toast.success("Template deleted successfully");
      navigate("/templates");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template");
    }
  };

  const getTypeConfig = (type) => {
    const config = {
      proposal: { bg: "bg-neon-blue/20", text: "text-neon-blue", icon: "📋" },
      agreement: {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        icon: "📜",
      },
      invoice: { bg: "bg-neon-green/20", text: "text-neon-green", icon: "🧾" },
      email: { bg: "bg-amber-500/20", text: "text-amber-400", icon: "📧" },
      custom: { bg: "bg-gray-500/20", text: "text-gray-400", icon: "⚙️" },
    };
    return config[type] || config.custom;
  };

  if (loading) {
    return <Loader />;
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Template not found</p>
      </div>
    );
  }

  const typeConfig = getTypeConfig(template.type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/templates")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Templates
          </button>
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-xl ${typeConfig.bg} flex items-center justify-center text-3xl`}
            >
              {typeConfig.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{template.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.bg} ${typeConfig.text}`}
                >
                  {template.type}
                </span>
                <span className="text-sm text-gray-500">
                  {template.category}
                </span>
                {template.isSystem && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-gray-400">
                    System Template
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleDuplicate}>
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Duplicate
          </Button>
          {!template.isSystem && (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate(`/templates/${id}/edit`)}
              >
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400">Placeholders</p>
          <p className="text-2xl font-bold text-white">
            {template.placeholders?.length || 0}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400">Usage Count</p>
          <p className="text-2xl font-bold text-white">
            {template.usageCount || 0}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400">Status</p>
          <p
            className={`text-lg font-semibold ${template.isActive ? "text-neon-green" : "text-gray-500"}`}
          >
            {template.isActive ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400">Created</p>
          <p className="text-lg font-semibold text-white">
            {new Date(template.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Description */}
      {template.description && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
          <p className="text-gray-400">{template.description}</p>
        </div>
      )}

      {/* Tags */}
      {template.tags && template.tags.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab("preview")}
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
            activeTab === "preview"
              ? "text-neon-green border-b-2 border-neon-green"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Preview & Test
        </button>
        <button
          onClick={() => setActiveTab("raw")}
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
            activeTab === "raw"
              ? "text-neon-green border-b-2 border-neon-green"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Raw Content
        </button>
        <button
          onClick={() => setActiveTab("placeholders")}
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
            activeTab === "placeholders"
              ? "text-neon-green border-b-2 border-neon-green"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Placeholders
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "preview" && <TemplatePreview template={template} />}

      {activeTab === "raw" && (
        <div className="glass-card p-6">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-white/5 p-4 rounded-xl overflow-auto max-h-[60vh]">
            {template.content}
          </pre>
        </div>
      )}

      {activeTab === "placeholders" && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Available Placeholders
          </h2>
          {template.placeholders && template.placeholders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Key
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Label
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Required
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Default Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {template.placeholders.map((placeholder, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-3 px-4">
                        <code className="bg-neon-green/20 text-neon-green px-2 py-0.5 rounded text-sm">
                          {`{{${placeholder.key}}}`}
                        </code>
                      </td>
                      <td className="py-3 px-4 text-white">
                        {placeholder.label}
                      </td>
                      <td className="py-3 px-4 text-gray-400 capitalize">
                        {placeholder.type}
                      </td>
                      <td className="py-3 px-4">
                        {placeholder.required ? (
                          <span className="text-neon-green">Yes</span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {placeholder.defaultValue || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No placeholders defined in this template
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateView;
