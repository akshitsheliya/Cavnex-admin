import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import {
  formatCurrency,
  formatCurrencyFull,
} from "../../../utils/dashboardHelpers";

const ChartDetailModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={`Revenue Details - ${data.label || ""}`}
      footer={null}
      centered
      width={700}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
            <p className="text-xs text-gray-400 uppercase">Total Revenue</p>
            <p className="text-xl sm:text-2xl font-bold text-neon-green mt-1 break-words">
              {formatCurrencyFull(data.total || 0)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <p className="text-xs text-gray-400 uppercase">Received</p>
            <p className="text-xl sm:text-2xl font-bold text-green-400 mt-1 break-words">
              {formatCurrencyFull(data.paid || 0)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase">Pending Amount</p>
              <p className="text-lg sm:text-xl font-bold text-amber-400 mt-1 break-words">
                {formatCurrencyFull(data.pending || 0)}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-400">Collection Rate</p>
              <p className="text-base sm:text-lg font-bold text-white">
                {data.total > 0
                  ? Math.round(((data.paid || 0) / data.total) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Completed Projects</span>
            <span className="text-white font-bold text-lg">
              {data.projectCount || 0}
            </span>
          </div>
        </div>

        {data.projects && data.projects.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Projects</h4>
            <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
              {data.projects.map((project, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onClose();
                    navigate(`/projects/${project.id}`);
                  }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-neon-green/30 cursor-pointer transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm break-words">
                        {project.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {project.client}
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No projects in this period</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ChartDetailModal;
