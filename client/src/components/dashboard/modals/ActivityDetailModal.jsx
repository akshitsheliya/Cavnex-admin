import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../common/Modal";
import {
  formatCurrencyFull,
  getStatusBadgeStyle,
} from "../../../utils/dashboardHelpers";

const ActivityDetailModal = ({ isOpen, onClose, activity }) => {
  const navigate = useNavigate();

  if (!activity) return null;

  const handleViewDetail = () => {
    onClose();
    const routes = {
      lead: `/leads/${activity.id}`,
      client: `/clients/${activity.id}`,
      project: `/projects/${activity.id}`,
      invoice: `/invoices/${activity.id}`,
      proposal: `/proposals/${activity.id}`,
      agreement: `/agreements/${activity.id}`,
    };
    navigate(routes[activity.type] || "/");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Activity Details">
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${activity.color}`}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={activity.icon}
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">{activity.title}</h3>
              <p className="text-gray-400 text-sm">{activity.description}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Time:</span>
              <span className="text-white">{activity.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-white capitalize">{activity.type}</span>
            </div>
            {activity.statusChange && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status Change:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${getStatusBadgeStyle(activity.statusChange.from)}`}
                  >
                    {activity.statusChange.from}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${getStatusBadgeStyle(activity.statusChange.to)}`}
                  >
                    {activity.statusChange.to}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {activity.type === "lead" && activity.data && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-white font-medium mb-2">Lead Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="text-white ml-2">
                  {activity.data.leadName || activity.data.name}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <span className="text-white ml-2">{activity.data.email}</span>
              </div>
              {activity.data.phone && (
                <div>
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white ml-2">{activity.data.phone}</span>
                </div>
              )}
              {activity.data.source && (
                <div>
                  <span className="text-gray-400">Source:</span>
                  <span className="text-white ml-2 capitalize">
                    {activity.data.source}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {activity.type === "project" && activity.data && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-white font-medium mb-2">Project Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Progress:</span>
                <span className="text-white">
                  {activity.data.progress || 0}%
                </span>
              </div>
              {activity.data.budget && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Budget:</span>
                  <span className="text-neon-green">
                    {formatCurrencyFull(activity.data.budget)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {activity.type === "invoice" && activity.data && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-white font-medium mb-2">Invoice Details</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Amount:</span>
              <span className="text-neon-green font-semibold">
                {formatCurrencyFull(activity.data.total)}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleViewDetail}
            className="flex-1 px-4 py-2 bg-neon-green text-black font-semibold rounded-xl hover:bg-neon-green/90 transition-colors"
          >
            View Full Details
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ActivityDetailModal;
