import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import {
  formatCurrency,
  formatCurrencyFull,
} from "../../../utils/dashboardHelpers";

const RevenueDetailModal = ({
  isOpen,
  onClose,
  totalRevenue,
  paidRevenue,
  pendingRevenue,
  completedProjects,
  projects,
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="Revenue from Completed Projects"
      footer={null}
      centered
      width={800}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
            <p className="text-xs text-gray-400 uppercase">Total Budget</p>
            <p className="text-lg sm:text-xl font-bold text-green-400 mt-1 break-words">
              {formatCurrencyFull(totalRevenue)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30 text-center">
            <p className="text-xs text-gray-400 uppercase">Received</p>
            <p className="text-lg sm:text-xl font-bold text-neon-green mt-1 break-words">
              {formatCurrencyFull(paidRevenue)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
            <p className="text-xs text-gray-400 uppercase">Pending</p>
            <p className="text-lg sm:text-xl font-bold text-amber-400 mt-1 break-words">
              {formatCurrencyFull(pendingRevenue)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Completed Projects</span>
            <span className="text-white font-bold text-lg">
              {completedProjects}
            </span>
          </div>
        </div>

        {projects.filter((p) => p.status === "completed").length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-white font-medium">All Completed Projects</h4>
            <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
              {projects
                .filter((p) => p.status === "completed")
                .sort(
                  (a, b) =>
                    new Date(b.completedDate || b.updatedAt) -
                    new Date(a.completedDate || a.updatedAt)
                )
                .map((project) => (
                  <div
                    key={project._id}
                    onClick={() => {
                      onClose();
                      navigate(`/projects/${project._id}`);
                    }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm break-words">
                          {project.projectName || project.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {project.client?.businessName ||
                            project.client?.clientName ||
                            "No client"}
                        </p>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="text-neon-green font-semibold text-sm break-words">
                          {formatCurrencyFull(project.budget)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Paid: {formatCurrency(project.amountPaid || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all"
                          style={{
                            width: `${Math.min(((project.amountPaid || 0) / (project.budget || 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between mt-1 text-xs text-gray-500 gap-1">
                        <span>
                          {Math.round(
                            ((project.amountPaid || 0) /
                              (project.budget || 1)) *
                              100
                          )}
                          % paid
                        </span>
                        <span>
                          Balance:{" "}
                          {formatCurrency(
                            (project.budget || 0) - (project.amountPaid || 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
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
            <p className="text-gray-400">No completed projects yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Complete projects to see revenue
            </p>
          </div>
        )}

        <button
          onClick={() => {
            onClose();
            navigate("/projects?status=completed");
          }}
          className="w-full px-4 py-2.5 bg-neon-green/10 text-neon-green rounded-xl hover:bg-neon-green/20 transition-colors"
        >
          View All Completed Projects
        </button>
      </div>
    </Modal>
  );
};

export default RevenueDetailModal;
