import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import { getStatusBadge } from "../../utils/dashboardHelpers";

const ActiveProjects = ({ projects, totalProjects }) => {
  const navigate = useNavigate();

  const StatusBadge = ({ status }) => {
    const { className, label } = getStatusBadge(status);
    return <span className={className}>{label}</span>;
  };

  return (
    <Card
      title="Active Projects"
      subtitle="Current project progress"
      actions={
        <button
          onClick={() => navigate("/projects")}
          className="text-sm text-neon-green hover:text-neon-blue transition-colors whitespace-nowrap"
        >
          View All ({totalProjects})
        </button>
      }
    >
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 mx-auto text-gray-600 mb-4"
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
            <p className="text-gray-400">No active projects</p>
            <button
              onClick={() => navigate("/projects/new")}
              className="mt-4 px-4 py-2 bg-neon-green/10 text-neon-green rounded-lg hover:bg-neon-green/20 transition-colors"
            >
              Create Project
            </button>
          </div>
        ) : (
          projects.map((project, index) => (
            <div
              key={project._id || index}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-neon-green/30 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors break-words">
                    {project.projectName || project.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {project.client?.clientName ||
                      project.client?.name ||
                      project.client?.company ||
                      "No client"}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <StatusBadge status={project.status} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-500"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  {project.progress || 0}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ActiveProjects;
