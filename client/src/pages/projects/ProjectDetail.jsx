import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import ProjectTimeline from "../../components/projects/ProjectTimeline";
import projectService from "../../services/projectService";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newFeature, setNewFeature] = useState({
    name: "",
    description: "",
    estimatedHours: "",
  });
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProject(id);
      setProject(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch project");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setSubmitting(true);
      await projectService.updateProjectStatus(id, newStatus);
      await fetchProject();
      setShowStatusModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProgressChange = async (newProgress) => {
    try {
      await projectService.updateProjectProgress(id, newProgress);
      await fetchProject();
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const handleAddFeature = async () => {
    if (!newFeature.name.trim()) return;

    try {
      setSubmitting(true);
      await projectService.addFeature(id, {
        name: newFeature.name,
        description: newFeature.description,
        estimatedHours: Number(newFeature.estimatedHours) || 0,
      });
      await fetchProject();
      setNewFeature({ name: "", description: "", estimatedHours: "" });
      setShowFeatureModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add feature");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateFeatureStatus = async (featureId, status) => {
    try {
      await projectService.updateFeature(id, featureId, { status });
      await fetchProject();
    } catch (err) {
      console.error("Failed to update feature:", err);
    }
  };

  const handleDeleteFeature = async (featureId) => {
    if (!window.confirm("Are you sure you want to delete this feature?"))
      return;

    try {
      await projectService.deleteFeature(id, featureId);
      await fetchProject();
    } catch (err) {
      console.error("Failed to delete feature:", err);
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.title.trim()) return;

    try {
      setSubmitting(true);
      await projectService.addMilestone(id, newMilestone);
      await fetchProject();
      setNewMilestone({ title: "", description: "", dueDate: "" });
      setShowMilestoneModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add milestone");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = (status) => {
    const config = {
      planning: {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        border: "border-purple-500/30",
        label: "Planning",
      },
      design: {
        bg: "bg-pink-500/20",
        text: "text-pink-400",
        border: "border-pink-500/30",
        label: "Design",
      },
      development: {
        bg: "bg-neon-blue/20",
        text: "text-neon-blue",
        border: "border-neon-blue/30",
        label: "Development",
      },
      testing: {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        border: "border-amber-500/30",
        label: "Testing",
      },
      review: {
        bg: "bg-cyan-500/20",
        text: "text-cyan-400",
        border: "border-cyan-500/30",
        label: "Review",
      },
      completed: {
        bg: "bg-neon-green/20",
        text: "text-neon-green",
        border: "border-neon-green/30",
        label: "Completed",
      },
      on_hold: {
        bg: "bg-gray-500/20",
        text: "text-gray-400",
        border: "border-gray-500/30",
        label: "On Hold",
      },
      cancelled: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/30",
        label: "Cancelled",
      },
    };
    return config[status] || config.planning;
  };

  const getTypeConfig = (type) => {
    const config = {
      website: { icon: "🌐", label: "Website" },
      webapp: { icon: "💻", label: "Web App" },
      mobileapp: { icon: "📱", label: "Mobile App" },
      ecommerce: { icon: "🛒", label: "E-commerce" },
      custom: { icon: "⚙️", label: "Custom" },
    };
    return config[type] || config.custom;
  };

  const statusOptions = [
    { value: "planning", label: "Planning" },
    { value: "design", label: "Design" },
    { value: "development", label: "Development" },
    { value: "testing", label: "Testing" },
    { value: "review", label: "Review" },
    { value: "completed", label: "Completed" },
    { value: "on_hold", label: "On Hold" },
    { value: "cancelled", label: "Cancelled" },
  ];

  if (loading) {
    return <Loader />;
  }

  if (error && !project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-400 mb-4">{error}</div>
        <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 mb-4">Project not found</div>
        <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const typeConfig = getTypeConfig(project.projectType);
  const balanceAmount = project.budget - project.amountPaid;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "features", label: `Features (${project.features?.length || 0})` },
    {
      id: "milestones",
      label: `Milestones (${project.milestones?.length || 0})`,
    },
    { id: "details", label: "Details" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Projects
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{typeConfig.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {project.projectName}
              </h1>
              <p className="text-gray-400 mt-1">
                {project.client?.businessName || project.client?.clientName}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                  {statusConfig.label}
                </span>
                <span className="text-sm text-gray-500">
                  {typeConfig.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowStatusModal(true)}>
              Change Status
            </Button>
            <Button
              variant="neon"
              onClick={() => navigate(`/projects/${id}/edit`)}
            >
              Edit Project
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <Card className="mb-6 p-6">
        <ProjectTimeline project={project} />
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-gray-400">Progress</p>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl font-bold text-white">
                {project.progress || 0}%
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-400">Budget</p>
          <p className="text-2xl font-bold text-neon-green mt-2">
            {formatCurrency(project.budget)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Paid: {formatCurrency(project.amountPaid)}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-400">Balance</p>
          <p
            className={`text-2xl font-bold mt-2 ${balanceAmount > 0 ? "text-amber-400" : "text-neon-green"}`}
          >
            {formatCurrency(balanceAmount)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {project.paymentStatus === "completed"
              ? "Fully Paid"
              : project.paymentStatus === "partial"
                ? "Partial Payment"
                : "Pending"}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-400">Deadline</p>
          <p className="text-2xl font-bold text-white mt-2">
            {formatDate(project.deadline)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Started: {formatDate(project.startDate)}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-white/5 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-neon-green text-black"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Description">
            <p className="text-gray-300">
              {project.description || "No description provided"}
            </p>
          </Card>

          <Card title="Technologies">
            {project.technologies && project.technologies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-neon-blue/20 text-neon-blue border border-neon-blue/30 text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No technologies specified</p>
            )}
          </Card>

          <Card title="Quick Progress Update">
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="100"
                value={project.progress || 0}
                onChange={(e) => handleProgressChange(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-green"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>0%</span>
                <span className="text-neon-green font-medium">
                  {project.progress || 0}%
                </span>
                <span>100%</span>
              </div>
            </div>
          </Card>

          <Card title="Links">
            <div className="space-y-3">
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-neon-green/30 transition-colors"
                >
                  <span className="text-xl">📁</span>
                  <div>
                    <p className="text-sm font-medium text-white">Repository</p>
                    <p className="text-xs text-gray-500 truncate">
                      {project.repositoryUrl}
                    </p>
                  </div>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-neon-green/30 transition-colors"
                >
                  <span className="text-xl">🌐</span>
                  <div>
                    <p className="text-sm font-medium text-white">Live URL</p>
                    <p className="text-xs text-gray-500 truncate">
                      {project.liveUrl}
                    </p>
                  </div>
                </a>
              )}
              {project.stagingUrl && (
                <a
                  href={project.stagingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-neon-green/30 transition-colors"
                >
                  <span className="text-xl">🧪</span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Staging URL
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {project.stagingUrl}
                    </p>
                  </div>
                </a>
              )}
              {!project.repositoryUrl &&
                !project.liveUrl &&
                !project.stagingUrl && (
                  <p className="text-gray-500 text-center py-4">
                    No links added
                  </p>
                )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "features" && (
        <Card
          title="Features"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFeatureModal(true)}
            >
              + Add Feature
            </Button>
          }
        >
          {project.features && project.features.length > 0 ? (
            <div className="space-y-3">
              {project.features.map((feature) => (
                <div
                  key={feature._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <select
                      value={feature.status}
                      onChange={(e) =>
                        handleUpdateFeatureStatus(feature._id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-medium border cursor-pointer ${
                        feature.status === "completed"
                          ? "bg-neon-green/20 text-neon-green border-neon-green/30"
                          : feature.status === "in_progress"
                            ? "bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                            : "bg-white/10 text-gray-400 border-white/10"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div>
                      <p className="font-medium text-white">{feature.name}</p>
                      {feature.description && (
                        <p className="text-sm text-gray-500">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {feature.estimatedHours > 0 && (
                      <span className="text-sm text-gray-400">
                        {feature.estimatedHours}h estimated
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteFeature(feature._id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No features added yet</p>
              <Button
                variant="outline"
                onClick={() => setShowFeatureModal(true)}
              >
                Add First Feature
              </Button>
            </div>
          )}
        </Card>
      )}

      {activeTab === "milestones" && (
        <Card
          title="Milestones"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMilestoneModal(true)}
            >
              + Add Milestone
            </Button>
          }
        >
          {project.milestones && project.milestones.length > 0 ? (
            <div className="space-y-3">
              {project.milestones.map((milestone) => (
                <div
                  key={milestone._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        milestone.status === "completed"
                          ? "bg-neon-green"
                          : "bg-gray-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-white">
                        {milestone.title}
                      </p>
                      {milestone.description && (
                        <p className="text-sm text-gray-500">
                          {milestone.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {milestone.dueDate && (
                      <p className="text-sm text-gray-400">
                        Due: {formatDate(milestone.dueDate)}
                      </p>
                    )}
                    <span
                      className={`text-xs ${
                        milestone.status === "completed"
                          ? "text-neon-green"
                          : "text-gray-500"
                      }`}
                    >
                      {milestone.status === "completed"
                        ? "Completed"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No milestones added yet</p>
              <Button
                variant="outline"
                onClick={() => setShowMilestoneModal(true)}
              >
                Add First Milestone
              </Button>
            </div>
          )}
        </Card>
      )}

      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Project Information">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Project Type</span>
                <span className="text-white">{typeConfig.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Priority</span>
                <span className="text-white capitalize">
                  {project.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={statusConfig.text}>{statusConfig.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created</span>
                <span className="text-white">
                  {formatDate(project.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-white">
                  {formatDate(project.updatedAt)}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Client Information">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span className="text-white">
                  {project.client?.clientName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Business</span>
                <span className="text-white">
                  {project.client?.businessName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="text-white">
                  {project.client?.email || "N/A"}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate(`/clients/${project.client?._id}`)}
              >
                View Client Details
              </Button>
            </div>
          </Card>

          {project.notes && (
            <Card title="Notes" className="lg:col-span-2">
              <p className="text-gray-300 whitespace-pre-wrap">
                {project.notes}
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Status Change Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Change Project Status"
      >
        <div className="space-y-3">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              disabled={submitting}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                project.status === option.value
                  ? "bg-neon-green/20 border-2 border-neon-green text-neon-green"
                  : "bg-white/5 border border-white/10 text-white hover:border-neon-green/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Modal>

      {/* Add Feature Modal */}
      <Modal
        isOpen={showFeatureModal}
        onClose={() => setShowFeatureModal(false)}
        title="Add New Feature"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Feature Name <span className="text-neon-green">*</span>
            </label>
            <input
              type="text"
              value={newFeature.name}
              onChange={(e) =>
                setNewFeature((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter feature name"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={newFeature.description}
              onChange={(e) =>
                setNewFeature((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter description"
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estimated Hours
            </label>
            <input
              type="text"
              value={newFeature.estimatedHours}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setNewFeature((prev) => ({
                  ...prev,
                  estimatedHours: val,
                }));
              }}
              placeholder="0"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowFeatureModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="neon"
              className="flex-1"
              onClick={handleAddFeature}
              loading={submitting}
            >
              Add Feature
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Milestone Modal */}
      <Modal
        isOpen={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        title="Add New Milestone"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Milestone Title <span className="text-neon-green">*</span>
            </label>
            <input
              type="text"
              value={newMilestone.title}
              onChange={(e) =>
                setNewMilestone((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter milestone title"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={newMilestone.description}
              onChange={(e) =>
                setNewMilestone((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter description"
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={newMilestone.dueDate}
              onChange={(e) =>
                setNewMilestone((prev) => ({
                  ...prev,
                  dueDate: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowMilestoneModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="neon"
              className="flex-1"
              onClick={handleAddMilestone}
              loading={submitting}
            >
              Add Milestone
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
