import React from "react";
import Card from "../common/Card";

const ProjectStatusChart = ({
  totalProjects,
  activeProjects,
  completedProjects,
  pendingProjects,
  inProgressPct,
  completedPct,
  pendingPct,
}) => {
  return (
    <Card title="Project Status" subtitle="Current distribution">
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="12"
            strokeDasharray={`${inProgressPct * 2.512} 251.2`}
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#gradient2)"
            strokeWidth="12"
            strokeDasharray={`${completedPct * 2.512} 251.2`}
            strokeDashoffset={`-${inProgressPct * 2.512}`}
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#gradient3)"
            strokeWidth="12"
            strokeDasharray={`${pendingPct * 2.512} 251.2`}
            strokeDashoffset={`-${(inProgressPct + completedPct) * 2.512}`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{totalProjects}</p>
            <p className="text-sm text-gray-400">Projects</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-green to-neon-blue" />
            <span className="text-sm text-gray-300">In Progress</span>
          </div>
          <span className="text-sm font-medium text-white">
            {activeProjects} ({inProgressPct}%)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-sm text-gray-300">Completed</span>
          </div>
          <span className="text-sm font-medium text-white">
            {completedProjects} ({completedPct}%)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-red-500" />
            <span className="text-sm text-gray-300">Pending/On Hold</span>
          </div>
          <span className="text-sm font-medium text-white">
            {pendingProjects} ({pendingPct}%)
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ProjectStatusChart;
