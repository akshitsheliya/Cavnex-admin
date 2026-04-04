import React from "react";
import { useNavigate } from "react-router-dom";

const ClientProjects = ({ projects = [], clientId }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    const config = {
      pending: {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        label: "Pending",
      },
      in_progress: {
        bg: "bg-neon-blue/20",
        text: "text-neon-blue",
        label: "In Progress",
      },
      completed: {
        bg: "bg-neon-green/20",
        text: "text-neon-green",
        label: "Completed",
      },
      on_hold: {
        bg: "bg-gray-500/20",
        text: "text-gray-400",
        label: "On Hold",
      },
      cancelled: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        label: "Cancelled",
      },
    };
    return config[status] || config.pending;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-gray-400 mb-4">No projects yet</p>
        <button
          onClick={() => navigate(`/projects/new?clientId=${clientId}`)}
          className="px-4 py-2 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-lg hover:bg-neon-green/20 transition-colors text-sm"
        >
          Create First Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {projects.map((project) => {
        const statusConfig = getStatusConfig(project.status);
        return (
          <div
            key={project._id}
            onClick={() => navigate(`/projects/${project._id}`)}
            className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3 mb-2 sm:mb-3">
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-white group-hover:text-neon-green transition-colors text-sm sm:text-base truncate">
                  {project.name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {project.description?.substring(0, 50)}
                  {project.description?.length > 50 ? "..." : ""}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 ${statusConfig.bg} ${statusConfig.text}`}
              >
                {statusConfig.label}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {project.budget && (
                  <span className="text-xs sm:text-sm text-neon-green whitespace-nowrap">
                    {formatCurrency(project.budget)}
                  </span>
                )}
                {project.deadline && (
                  <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                    Due:{" "}
                    {new Date(project.deadline).toLocaleDateString("en-IN")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-500"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 tabular-nums">
                  {project.progress || 0}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClientProjects;
