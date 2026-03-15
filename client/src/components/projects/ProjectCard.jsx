import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, onDelete, onStatusChange }) => {
  const navigate = useNavigate();

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

  const getPriorityConfig = (priority) => {
    const config = {
      low: { color: "text-gray-400", bg: "bg-gray-500/20" },
      medium: { color: "text-neon-blue", bg: "bg-neon-blue/20" },
      high: { color: "text-amber-400", bg: "bg-amber-500/20" },
      urgent: { color: "text-red-400", bg: "bg-red-500/20" },
    };
    return config[priority] || config.medium;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const deadline = new Date(project.deadline);
    const diffTime = deadline - today;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days;
  };

  const statusConfig = getStatusConfig(project.status);
  const typeConfig = getTypeConfig(project.projectType);
  const priorityConfig = getPriorityConfig(project.priority);
  const daysRemaining = getDaysRemaining();
  const isOverdue =
    daysRemaining < 0 &&
    project.status !== "completed" &&
    project.status !== "cancelled";

  return (
    <div className="glass-card p-6 hover:border-neon-green/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{typeConfig.icon}</div>
          <div>
            <h3
              onClick={() => navigate(`/projects/${project._id}`)}
              className="font-semibold text-white group-hover:text-neon-green transition-colors cursor-pointer"
            >
              {project.projectName}
            </h3>
            <p className="text-sm text-gray-400">
              {project.client?.businessName ||
                project.client?.clientName ||
                "No Client"}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
          >
            {statusConfig.label}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color}`}
          >
            {project.priority?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-medium text-white">
            {project.progress || 0}%
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              project.progress >= 100
                ? "bg-gradient-to-r from-neon-green to-emerald-500"
                : "bg-gradient-to-r from-neon-green to-neon-blue"
            }`}
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-xs text-gray-500">Budget</p>
          <p className="text-sm font-semibold text-neon-green">
            {formatCurrency(project.budget)}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-xs text-gray-500">Deadline</p>
          <p
            className={`text-sm font-semibold ${isOverdue ? "text-red-400" : "text-white"}`}
          >
            {formatDate(project.deadline)}
          </p>
        </div>
      </div>

      {project.status !== "completed" && project.status !== "cancelled" && (
        <div
          className={`mb-4 p-3 rounded-xl ${isOverdue ? "bg-red-500/10 border border-red-500/30" : "bg-white/[0.02] border border-white/5"}`}
        >
          <p
            className={`text-sm ${isOverdue ? "text-red-400" : "text-gray-400"}`}
          >
            {isOverdue
              ? `Overdue by ${Math.abs(daysRemaining)} days`
              : `${daysRemaining} days remaining`}
          </p>
        </div>
      )}

      {project.features && project.features.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">
            Features (
            {project.features.filter((f) => f.status === "completed").length}/
            {project.features.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {project.features.slice(0, 4).map((feature, idx) => (
              <span
                key={idx}
                className={`px-2 py-1 rounded text-xs ${
                  feature.status === "completed"
                    ? "bg-neon-green/20 text-neon-green"
                    : feature.status === "in_progress"
                      ? "bg-neon-blue/20 text-neon-blue"
                      : "bg-white/10 text-gray-400"
                }`}
              >
                {feature.name}
              </span>
            ))}
            {project.features.length > 4 && (
              <span className="px-2 py-1 rounded text-xs bg-white/10 text-gray-400">
                +{project.features.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
        <button
          onClick={() => navigate(`/projects/${project._id}`)}
          className="flex-1 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          View
        </button>
        <button
          onClick={() => navigate(`/projects/${project._id}/edit`)}
          className="flex-1 py-2 text-sm text-gray-400 hover:text-neon-green hover:bg-neon-green/10 rounded-lg transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(project._id)}
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
  );
};

export default ProjectCard;
