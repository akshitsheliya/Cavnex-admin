import React, { useState } from "react";
import { Modal, message } from "antd";

const statusFlow = [
  {
    id: "new",
    label: "New",
    icon: "✨",
    color: "purple",
    order: 1,
  },
  {
    id: "contacted",
    label: "Contacted",
    icon: "📞",
    color: "blue",
    order: 2,
  },
  {
    id: "meeting",
    label: "Meeting",
    icon: "🤝",
    color: "amber",
    order: 3,
  },
  {
    id: "proposal_pending",
    label: "Proposal Pending",
    icon: "⏳",
    color: "orange",
    order: 4,
    hasAutoReminder: true,
  },
  {
    id: "proposal_sent",
    label: "Proposal Sent",
    icon: "📨",
    color: "cyan",
    order: 5,
  },
  {
    id: "negotiation",
    label: "Negotiation",
    icon: "💬",
    color: "yellow",
    order: 6,
  },
  {
    id: "closed_won",
    label: "Won",
    icon: "🎉",
    color: "green",
    order: 7,
    isFinal: true,
  },
  {
    id: "closed_lost",
    label: "Lost",
    icon: "❌",
    color: "red",
    order: 8,
    isFinal: true,
  },
];

const colorClasses = {
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
    hover: "hover:bg-purple-500/30",
    solid: "bg-purple-500",
  },
  blue: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    hover: "hover:bg-blue-500/30",
    solid: "bg-blue-500",
  },
  amber: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    hover: "hover:bg-amber-500/30",
    solid: "bg-amber-500",
  },
  orange: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
    hover: "hover:bg-orange-500/30",
    solid: "bg-orange-500",
  },
  cyan: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    hover: "hover:bg-cyan-500/30",
    solid: "bg-cyan-500",
  },
  yellow: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    hover: "hover:bg-yellow-500/30",
    solid: "bg-yellow-500",
  },
  green: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/30",
    hover: "hover:bg-green-500/30",
    solid: "bg-green-500",
  },
  red: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    hover: "hover:bg-red-500/30",
    solid: "bg-red-500",
  },
};

const LeadStatusFlow = ({
  currentStatus,
  onStatusChange,
  disabled,
  onAutoReminder,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentIndex = statusFlow.findIndex((s) => s.id === currentStatus);
  const currentStep = statusFlow[currentIndex];

  // Get previous step (excluding final statuses)
  const previousStep =
    currentIndex > 0
      ? statusFlow.filter((s) => !s.isFinal)[currentIndex - 1]
      : null;

  // Get next step (excluding final statuses for now)
  const mainStatuses = statusFlow.filter((s) => !s.isFinal);
  const currentMainIndex = mainStatuses.findIndex(
    (s) => s.id === currentStatus
  );
  const nextStep =
    currentMainIndex < mainStatuses.length - 1
      ? mainStatuses[currentMainIndex + 1]
      : null;

  // Get skip options (2+ steps ahead, excluding finals)
  const skipOptions = mainStatuses.filter(
    (s, idx) => idx > currentMainIndex + 1
  );

  // Final status options
  const finalOptions = statusFlow.filter(
    (s) => s.isFinal && s.id !== currentStatus
  );

  const handleStatusClick = (targetStatus) => {
    const targetStep = statusFlow.find((s) => s.id === targetStatus);

    // Check if auto reminder needed
    if (targetStep?.hasAutoReminder) {
      setPendingStatus(targetStatus);
      setShowConfirmModal(true);
    } else {
      confirmStatusChange(targetStatus);
    }
  };

  const confirmStatusChange = async (targetStatus) => {
    try {
      setLoading(true);
      await onStatusChange(targetStatus);

      const targetStep = statusFlow.find((s) => s.id === targetStatus);

      // Auto set reminder for proposal_pending
      if (targetStep?.hasAutoReminder && onAutoReminder) {
        await onAutoReminder();
        message.success("Status updated! 24hr reminder set automatically.");
      } else {
        message.success(`Status updated to ${targetStep?.label}`);
      }

      setShowConfirmModal(false);
      setPendingStatus(null);
    } catch (error) {
      message.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (!currentStep) return null;

  const isFinalStatus = currentStep.isFinal;

  return (
    <div className="space-y-4">
      {/* Current Status Display */}
      <div
        className={`flex items-center gap-3 p-4 rounded-xl ${colorClasses[currentStep.color]?.bg} border ${colorClasses[currentStep.color]?.border}`}
      >
        <div className="text-3xl">{currentStep.icon}</div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Current Status
          </p>
          <p
            className={`text-lg font-semibold ${colorClasses[currentStep.color]?.text}`}
          >
            {currentStep.label}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${colorClasses[currentStep.color]?.bg} ${colorClasses[currentStep.color]?.text} border ${colorClasses[currentStep.color]?.border}`}
        >
          Step {currentStep.order}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative px-2">
        <div className="flex justify-between mb-2">
          {mainStatuses.map((step, index) => {
            const isPast = index < currentMainIndex;
            const isCurrent = step.id === currentStatus;
            const colors = colorClasses[step.color];

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <button
                  onClick={() =>
                    !disabled && !isFinalStatus && handleStatusClick(step.id)
                  }
                  disabled={disabled || isFinalStatus}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm
                    border-2 transition-all duration-300 cursor-pointer
                    ${isCurrent ? `${colors.bg} ${colors.border} ${colors.text} ring-2 ring-offset-2 ring-offset-[#0a0a1a] ring-${step.color}-500/50` : ""}
                    ${isPast ? "bg-neon-green/20 border-neon-green text-neon-green" : ""}
                    ${!isPast && !isCurrent ? "bg-white/5 border-white/20 text-gray-500 hover:bg-white/10 hover:border-white/30" : ""}
                    ${disabled || isFinalStatus ? "cursor-not-allowed opacity-50" : ""}
                  `}
                  title={`Click to set: ${step.label}`}
                >
                  {isPast ? "✓" : step.icon}
                </button>
                <p
                  className={`
                    text-[9px] sm:text-[10px] mt-1.5 text-center max-w-[50px] sm:max-w-[60px] leading-tight
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

        {/* Progress Line */}
        <div className="absolute top-4 sm:top-5 left-6 right-6 h-0.5 bg-white/10 -z-10">
          <div
            className="h-full bg-gradient-to-r from-neon-green to-neon-green/50 transition-all duration-500"
            style={{
              width: `${(currentMainIndex / (mainStatuses.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      {!isFinalStatus && (
        <div className="space-y-3 pt-2">
          {/* Previous & Next Row */}
          <div className="grid grid-cols-2 gap-2">
            {/* Previous Button */}
            {previousStep ? (
              <button
                onClick={() => handleStatusClick(previousStep.id)}
                disabled={disabled || loading}
                className={`
                  p-3 rounded-xl font-medium transition-all duration-200
                  flex items-center justify-center gap-2
                  bg-white/5 border border-white/10 text-gray-400
                  hover:bg-white/10 hover:text-white hover:border-white/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
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
                <span className="text-sm">Back to {previousStep.label}</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-600 text-center text-sm">
                No previous step
              </div>
            )}

            {/* Next Button */}
            {nextStep ? (
              <button
                onClick={() => handleStatusClick(nextStep.id)}
                disabled={disabled || loading}
                className={`
                  p-3 rounded-xl font-medium transition-all duration-200
                  flex items-center justify-center gap-2
                  ${colorClasses[nextStep.color]?.bg}
                  ${colorClasses[nextStep.color]?.border}
                  ${colorClasses[nextStep.color]?.text}
                  ${colorClasses[nextStep.color]?.hover}
                  border disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className="text-sm">Next: {nextStep.label}</span>
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-600 text-center text-sm">
                Final step reached
              </div>
            )}
          </div>

          {/* Skip Options */}
          {skipOptions.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 px-1 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
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
                Skip to:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skipOptions.map((step) => {
                  const colors = colorClasses[step.color];
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStatusClick(step.id)}
                      disabled={disabled || loading}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                        flex items-center gap-1.5
                        bg-white/5 border border-white/10 text-gray-400
                        hover:${colors.bg} hover:${colors.text} hover:${colors.border}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <span>{step.icon}</span>
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Final Status Options */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-gray-500 px-1 mb-2 flex items-center gap-1">
              <svg
                className="w-3 h-3"
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
              Close Lead:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {finalOptions.map((step) => {
                const colors = colorClasses[step.color];
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStatusClick(step.id)}
                    disabled={disabled || loading}
                    className={`
                      p-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      flex items-center justify-center gap-2
                      ${colors.bg} border ${colors.border} ${colors.text}
                      ${colors.hover}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <span>{step.icon}</span>
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Final Status Message */}
      {isFinalStatus && (
        <div
          className={`p-4 rounded-xl ${colorClasses[currentStep.color]?.bg} border ${colorClasses[currentStep.color]?.border} text-center`}
        >
          <p className={`text-sm ${colorClasses[currentStep.color]?.text}`}>
            {currentStep.id === "closed_won"
              ? "🎉 Congratulations! This lead has been won."
              : "This lead has been closed."}
          </p>
          <button
            onClick={() => handleStatusClick("new")}
            disabled={disabled}
            className="mt-3 px-4 py-2 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
          >
            Reopen Lead
          </button>
        </div>
      )}

      {/* Confirm Modal for Auto Reminder */}
      <Modal
        open={showConfirmModal}
        onCancel={() => {
          setShowConfirmModal(false);
          setPendingStatus(null);
        }}
        title={
          <span className="text-white flex items-center gap-2">
            ⏳ Proposal Pending
          </span>
        }
        footer={null}
        className="custom-modal"
        centered
        width={420}
      >
        <div className="py-2">
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-orange-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-orange-400 font-medium">24 Hour Reminder</p>
                <p className="text-gray-400 text-sm mt-1">
                  A reminder will be automatically set to send the proposal
                  within 24 hours for better conversion.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Are you sure you want to mark this lead as{" "}
            <strong className="text-orange-400">Proposal Pending</strong>?
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowConfirmModal(false);
                setPendingStatus(null);
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmStatusChange(pendingStatus)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Confirm & Set Reminder"}
            </button>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .custom-modal .ant-modal-content {
          background: #1a1a2e !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
        }
        .custom-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          padding: 16px 24px !important;
        }
        .custom-modal .ant-modal-body {
          padding: 16px 24px 24px !important;
        }
        .custom-modal .ant-modal-title {
          color: white !important;
        }
        .custom-modal .ant-modal-close-x {
          color: #9ca3af !important;
        }
      `}</style>
    </div>
  );
};

export default LeadStatusFlow;
