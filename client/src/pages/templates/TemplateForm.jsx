import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import TemplateEditor from "../../components/templates/TemplateEditor";
import templateService from "../../services/templateService";
import { templateTypes, templateCategories } from "../../data/placeholders";
import { toast } from "react-hot-toast";

const TemplateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "proposal",
    category: "section",
    content: "",
    subject: "",
    tags: [],
    isActive: true,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isEdit) {
      fetchTemplate();
    }
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await templateService.getTemplate(id);
      const template = response.data;
      setFormData({
        name: template.name || "",
        description: template.description || "",
        type: template.type || "proposal",
        category: template.category || "section",
        content: template.content || "",
        subject: template.subject || "",
        tags: template.tags || [],
        isActive: template.isActive !== false,
      });
    } catch (error) {
      console.error("Error fetching template:", error);
      toast.error("Failed to load template");
      navigate("/templates");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Template name is required");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Template content is required");
      return;
    }

    try {
      setSaving(true);
      if (isEdit) {
        await templateService.updateTemplate(id, formData);
        toast.success("Template updated successfully");
      } else {
        await templateService.createTemplate(formData);
        toast.success("Template created successfully");
      }
      navigate("/templates");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error(error.response?.data?.message || "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
          <h1 className="text-3xl font-bold text-white">
            {isEdit ? "Edit Template" : "Create Template"}
          </h1>
        </div>
        <Button onClick={handleSubmit} loading={saving}>
          {isEdit ? "Update Template" : "Create Template"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Template Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Standard Proposal Cover"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                >
                  {templateTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                >
                  {templateCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of this template"
              />
            </div>
            {formData.type === "email" && (
              <div className="md:col-span-2">
                <Input
                  label="Email Subject"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="e.g., Project Proposal: {{projectName}}"
                />
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl min-h-[48px]">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-neon-green/20 text-neon-green text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tag and press Enter"
                  className="flex-1 min-w-[150px] bg-transparent text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Template Content */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Template Content
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Use placeholders like{" "}
            <code className="bg-white/10 px-1 rounded">{"{{clientName}}"}</code>{" "}
            that will be replaced with actual values when rendering.
          </p>
          <TemplateEditor
            value={formData.content}
            onChange={(value) => handleChange("content", value)}
            placeholder="Enter your template content here. Use {{placeholders}} for dynamic values..."
            rows={20}
            showPlaceholderHelper={true}
            showPreview={true}
          />
        </div>

        {/* Settings */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="w-5 h-5 rounded border-white/10 bg-white/5 text-neon-green focus:ring-neon-green/50"
            />
            <span className="text-white">Template is active</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/templates")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Update Template" : "Create Template"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TemplateForm;
