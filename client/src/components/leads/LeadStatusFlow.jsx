import React, { useState } from "react";
import { message, Modal } from "antd";

const statusFlow = [
  {
    id: "new",
    label: "New",
    icon: "✨",
    color: "purple",
    next: "contacted",
  },
  {
    id: "contacted",
    label: "Contacted",
    icon: "📞",
    color: "blue",
    next: "meeting",
    canSkipTo: ["proposal_pending", "proposal_sent"],
  },
  {
    id: "meeting",
    label: "Meeting",
    icon: "🤝",
    color: "amber",
    next: "proposal_pending",
    canSkipTo: ["proposal_sent"],
  },
  {
    id: "proposal_pending",
    label: "Proposal Pending",
    icon: "⏳",
    color: "orange",
    next: "proposal_sent",
    hasNotification: true,
  },
  {
    id: "proposal_sent",
    label: "Proposal Sent",
    icon: "📨",
    color: "cyan",
    next: "negotiation",
  },
  {
    id: "negotiation",
    label: "Negotiation",
    icon: "💬",
    color: "yellow",
    next: "closed_won",
    canSkipTo: ["closed_lost"],
  },
  {
    id: "closed_won",
    label: "Won",
    icon: "🎉",
    color: "green",
    isFinal: true,
  },
  {
    id: "closed_lost",
    label: "Lost",
    icon: "❌",
    color: "red",
    isFinal: true,
  },
];

const colorClasses = {
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
    hover: "hover:bg-purple-500/30",
  },
  blue: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    hover: "hover:bg-blue-500/30",
  },
  amber: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    hover: "hover:bg-amber-500/30",
  },
  orange: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
    hover: "hover:bg-orange-500/30",
  },
  cyan: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    hover: "hover:bg-cyan-500/30",
  },
  yellow: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    hover: "hover:bg-yellow-500/30",
  },
  green: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/30",
    hover: "hover:bg-green-500/30",
  },
  red: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    hover: "hover:bg-red-500/30",
  },
};

const LeadStatusFlow = ({ currentStatus, onStatusChange, disabled }) => {
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [selectedSkipStatus, setSelectedSkipStatus] = useState(null);

  const currentIndex = statusFlow.findIndex((s) => s.id === currentStatus);
  const currentStep = statusFlow[currentIndex];

  const handleComplete = async () => {
    if (currentStep?.next) {
      try {
        await onStatusChange(currentStep.next);
        message.success(
          `Status updated to ${statusFlow.find((s) => s.id === currentStep.next)?.label}`
        );
      } catch (error) {
        message.error("Failed to update status");
      }
    }
  };

  const handleSkip = (targetStatus) => {
    setSelectedSkipStatus(targetStatus);
    setShowSkipModal(true);
  };

  const confirmSkip = async () => {
    try {
      await onStatusChange(selectedSkipStatus);
      message.success(
        `Status updated to ${statusFlow.find((s) => s.id === selectedSkipStatus)?.label}`
      );
      setShowSkipModal(false);
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  if (!currentStep) return null;

  return (
    <div className="space-y-4">
      {/* Current Status Display */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="text-3xl">{currentStep.icon}</div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Current Status
          </p>
          <p className="text-lg font-semibold text-white">
            {currentStep.label}
          </p>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${colorClasses[
            currentStep.color
          ]?.bg.replace("/20", "")}`}
        />
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          {statusFlow
            .filter((s) => !s.isFinal || s.id === currentStatus)
            .map((step, index) => {
              const isPast = index < currentIndex;
              const isCurrent = step.id === currentStatus;
              const colors = colorClasses[step.color];

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm
                      border-2 transition-all duration-300
                      ${isCurrent ? `${colors.bg} ${colors.border} ${colors.text}` : ""}
                      ${isPast ? "bg-neon-green/20 border-neon-green text-neon-green" : ""}
                      ${!isPast && !isCurrent ? "bg-white/5 border-white/10 text-gray-500" : ""}
                    `}
                  >
                    {isPast ? "✓" : step.icon}
                  </div>
                  <p
                    className={`
                      text-[10px] mt-1 text-center max-w-[60px]
                      ${isCurrent ? colors.text : ""}
                      ${isPast ? "text-neon-green" : ""}
                      ${!isPast && !isCurrent ? "text-gray-500" : ""}
                    `}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
        </div>

        <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 -z-10">
          <div
            className="h-full bg-neon-green transition-all duration-500"
            style={{
              width: `${(currentIndex / (statusFlow.length - 3)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      {!currentStep.isFinal && (
        <div className="space-y-2">
          {/* Mark as Complete */}
          {currentStep.next && (
            <button
              onClick={handleComplete}
              disabled={disabled}
              className={`
                w-full p-3 rounded-xl font-medium transition-all duration-200
                flex items-center justify-between group
                ${colorClasses[statusFlow.find((s) => s.id === currentStep.next)?.color]?.bg}
                ${colorClasses[statusFlow.find((s) => s.id === currentStep.next)?.color]?.border}
                ${colorClasses[statusFlow.find((s) => s.id === currentStep.next)?.color]?.text}
                ${colorClasses[statusFlow.find((s) => s.id === currentStep.next)?.color]?.hover}
                border disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span className="flex items-center gap-2">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Mark as{" "}
                {statusFlow.find((s) => s.id === currentStep.next)?.label}
              </span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
            </button>
          )}

          {/* Skip Options */}
          {currentStep.canSkipTo && (
            <div className="space-y-1.5">
              <p className="text-xs text-gray-400 px-1">Quick Actions:</p>
              {currentStep.canSkipTo.map((statusId) => {
                const targetStep = statusFlow.find((s) => s.id === statusId);
                const colors = colorClasses[targetStep?.color];
                return (
                  <button
                    key={statusId}
                    onClick={() => handleSkip(statusId)}
                    disabled={disabled}
                    className={`
                      w-full p-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      flex items-center justify-between
                      bg-white/5 border border-white/10 text-gray-400
                      hover:bg-white/10 hover:${colors?.text}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span>{targetStep?.icon}</span>
                      Skip to {targetStep?.label}
                    </span>
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
                        d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
          )}

          {/* Notification for Proposal Pending */}
          {currentStep.hasNotification && (
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-start gap-2">
              <svg
                className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-400">
                  Proposal Deadline Reminder
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Send proposal within 24 hours for better conversion
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skip Confirmation Modal */}
      <Modal
        open={showSkipModal}
        onCancel={() => setShowSkipModal(false)}
        title={<span className="text-white">Confirm Skip</span>}
        footer={null}
        className="custom-modal"
        centered
        width={400}
      >
        <p className="text-gray-300 mb-4">
          Are you sure you want to skip to{" "}
          <strong className="text-white">
            {statusFlow.find((s) => s.id === selectedSkipStatus)?.label}
          </strong>
          ?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShowSkipModal(false)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmSkip}
            className="px-4 py-2 rounded-lg bg-neon-green/20 border border-neon-green/30 text-neon-green hover:bg-neon-green/30 transition-colors"
          >
            Confirm Skip
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LeadStatusFlow;
