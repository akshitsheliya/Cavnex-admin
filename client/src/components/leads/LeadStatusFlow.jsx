import React, { useState } from "react";
import { Modal, message } from "antd";

const statusFlow = [
  { id: "new", label: "New", icon: "✨", color: "purple", order: 1 },
  { id: "contacted", label: "Contacted", icon: "📞", color: "blue", order: 2 },
  { id: "meeting", label: "Meeting", icon: "🤝", color: "amber", order: 3 },
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
    ring: "ring-purple-500/50",
  },
  blue: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    hover: "hover:bg-blue-500/30",
    solid: "bg-blue-500",
    ring: "ring-blue-500/50",
  },
  amber: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    hover: "hover:bg-amber-500/30",
    solid: "bg-amber-500",
    ring: "ring-amber-500/50",
  },
  orange: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
    hover: "hover:bg-orange-500/30",
    solid: "bg-orange-500",
    ring: "ring-orange-500/50",
  },
  cyan: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    hover: "hover:bg-cyan-500/30",
    solid: "bg-cyan-500",
    ring: "ring-cyan-500/50",
  },
  yellow: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    hover: "hover:bg-yellow-500/30",
    solid: "bg-yellow-500",
    ring: "ring-yellow-500/50",
  },
  green: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/30",
    hover: "hover:bg-green-500/30",
    solid: "bg-green-500",
    ring: "ring-green-500/50",
  },
  red: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    hover: "hover:bg-red-500/30",
    solid: "bg-red-500",
    ring: "ring-red-500/50",
  },
};

const VerticalProgressBar = ({
  mainStatuses,
  currentMainIndex,
  currentStatus,
  isFinalStatus,
  isReallyDisabled,
  loading,
  onStatusClick,
}) => {
  return (
    <div className="flex flex-col gap-0">
      {mainStatuses.map((step, index) => {
        const isPast = currentMainIndex >= 0 && index < currentMainIndex;
        const isCurrent = step.id === currentStatus;
        const isUpcoming = !isPast && !isCurrent;
        const colors = colorClasses[step.color];
        const canClick = !isReallyDisabled && !isFinalStatus && !loading;
        const isLast = index === mainStatuses.length - 1;

        return (
          <div key={step.id} className="flex items-stretch gap-3">
            <div className="flex flex-col items-center">
              <button
                onClick={() => canClick && onStatusClick(step.id)}
                disabled={!canClick}
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300 flex-shrink-0 z-10
                  ${isCurrent ? `${colors.bg} ${colors.border} ${colors.text} ring-2 ring-offset-2 ring-offset-[#0a0a1a] ${colors.ring}` : ""}
                  ${isPast ? "bg-neon-green/20 border-neon-green text-neon-green" : ""}
                  ${isUpcoming ? "bg-white/5 border-white/20 text-gray-500" : ""}
                  ${canClick ? "cursor-pointer active:scale-95" : "cursor-default"}
                `}
              >
                {isPast ? "✓" : <span>{step.icon}</span>}
              </button>
              {!isLast && (
                <div className="w-0.5 flex-1 my-1 min-h-[20px]">
                  <div
                    className={`w-full h-full rounded-full ${isPast ? "bg-neon-green/50" : "bg-white/10"}`}
                  />
                </div>
              )}
            </div>

            <div
              className={`flex-1 flex items-center pb-${isLast ? "0" : "5"} min-w-0`}
              style={{ paddingBottom: isLast ? 0 : "20px" }}
            >
              <button
                onClick={() => canClick && onStatusClick(step.id)}
                disabled={!canClick}
                className={`
                  w-full text-left px-3 py-2 rounded-xl border transition-all duration-200
                  ${isCurrent ? `${colors.bg} ${colors.border}` : "bg-white/[0.02] border-white/5"}
                  ${canClick && !isCurrent ? "hover:bg-white/5 hover:border-white/10 active:scale-[0.99]" : ""}
                  ${canClick ? "cursor-pointer" : "cursor-default"}
                `}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-sm font-medium ${isCurrent ? colors.text : isPast ? "text-neon-green" : "text-gray-500"}`}
                  >
                    {step.label}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isCurrent && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                      >
                        Current
                      </span>
                    )}
                    {isPast && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/30">
                        Done
                      </span>
                    )}
                    {step.hasAutoReminder && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        ⏰
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  Step {step.order} of {mainStatuses.length}
                </p>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const HorizontalProgressBar = ({
  mainStatuses,
  currentMainIndex,
  currentStatus,
  isFinalStatus,
  isReallyDisabled,
  loading,
  onStatusClick,
}) => {
  return (
    <div className="relative">
      <div className="flex justify-between mb-2">
        {mainStatuses.map((step, index) => {
          const isPast = currentMainIndex >= 0 && index < currentMainIndex;
          const isCurrent = step.id === currentStatus;
          const colors = colorClasses[step.color];
          const canClick = !isReallyDisabled && !isFinalStatus && !loading;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1 min-w-0"
            >
              <button
                onClick={() => canClick && onStatusClick(step.id)}
                disabled={!canClick}
                className={`
                  w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300 flex-shrink-0
                  ${isCurrent ? `${colors.bg} ${colors.border} ${colors.text} ring-2 ring-offset-1 ring-offset-[#0a0a1a] ${colors.ring}` : ""}
                  ${isPast ? "bg-neon-green/20 border-neon-green text-neon-green" : ""}
                  ${!isPast && !isCurrent ? "bg-white/5 border-white/20 text-gray-500" : ""}
                  ${canClick ? "cursor-pointer hover:scale-110" : "cursor-not-allowed opacity-60"}
                `}
              >
                <span className="text-xs lg:text-sm">
                  {isPast ? "✓" : step.icon}
                </span>
              </button>
              <p
                className={`text-[8px] lg:text-[10px] mt-1 text-center leading-tight px-0.5 w-full truncate
                ${isCurrent ? colors.text : isPast ? "text-neon-green" : "text-gray-500"}`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="absolute top-4 lg:top-5 left-4 right-4 h-0.5 bg-white/10 -z-10">
        <div
          className="h-full bg-gradient-to-r from-neon-green to-neon-green/50 transition-all duration-500"
          style={{
            width: isFinalStatus
              ? "100%"
              : `${(Math.max(0, currentMainIndex) / (mainStatuses.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

const LeadStatusFlow = ({
  currentStatus,
  onStatusChange,
  disabled = false,
  onAutoReminder,
  isConverted = false,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentIndex = statusFlow.findIndex((s) => s.id === currentStatus);
  const currentStep = statusFlow[currentIndex] || statusFlow[0];
  const isFinalStatus = currentStep?.isFinal;

  const mainStatuses = statusFlow.filter((s) => !s.isFinal);
  const currentMainIndex = mainStatuses.findIndex(
    (s) => s.id === currentStatus
  );
  const previousStep =
    currentMainIndex > 0 ? mainStatuses[currentMainIndex - 1] : null;
  const nextStep =
    currentMainIndex >= 0 && currentMainIndex < mainStatuses.length - 1
      ? mainStatuses[currentMainIndex + 1]
      : null;
  const skipOptions = mainStatuses.filter(
    (_, idx) => idx > currentMainIndex + 1
  );

  const isReallyDisabled =
    disabled || (isConverted && currentStatus === "closed_won");

  const handleReopenLead = () => {
    if (isConverted) {
      message.warning(
        "Cannot reopen a converted lead. The client already exists."
      );
      return;
    }
    setShowReopenModal(true);
  };

  const confirmReopenLead = async () => {
    setLoading(true);
    try {
      await onStatusChange("new");
      message.success("Lead reopened successfully!");
      setShowReopenModal(false);
    } catch (error) {
      message.error("Failed to reopen lead");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (targetStatus) => {
    if (isReallyDisabled || loading) return;
    const targetStep = statusFlow.find((s) => s.id === targetStatus);
    if (targetStep?.hasAutoReminder) {
      setPendingStatus(targetStatus);
      setShowConfirmModal(true);
    } else {
      confirmStatusChange(targetStatus);
    }
  };

  const confirmStatusChange = async (targetStatus) => {
    setLoading(true);
    try {
      await onStatusChange(targetStatus);
      const targetStep = statusFlow.find((s) => s.id === targetStatus);
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

  if (!currentStep) {
    return <div className="p-4 text-center text-gray-400">Invalid status</div>;
  }

  return (
    <div className="space-y-4">
      <div
        className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl ${colorClasses[currentStep.color]?.bg} border ${colorClasses[currentStep.color]?.border}`}
      >
        <div className="text-2xl sm:text-3xl flex-shrink-0">
          {currentStep.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">
            Current Status
          </p>
          <p
            className={`text-base sm:text-lg font-semibold truncate ${colorClasses[currentStep.color]?.text}`}
          >
            {currentStep.label}
          </p>
        </div>
        <div
          className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0 border ${colorClasses[currentStep.color]?.bg} ${colorClasses[currentStep.color]?.text} ${colorClasses[currentStep.color]?.border}`}
        >
          {isFinalStatus
            ? "Final"
            : `Step ${currentStep.order}/${mainStatuses.length}`}
        </div>
      </div>

      <div className="block sm:hidden">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
          <p className="text-xs text-gray-500 mb-3 px-1">Progress</p>
          <VerticalProgressBar
            mainStatuses={mainStatuses}
            currentMainIndex={currentMainIndex}
            currentStatus={currentStatus}
            isFinalStatus={isFinalStatus}
            isReallyDisabled={isReallyDisabled}
            loading={loading}
            onStatusClick={handleStatusClick}
          />
        </div>
      </div>

      <div className="hidden sm:block relative px-2">
        <HorizontalProgressBar
          mainStatuses={mainStatuses}
          currentMainIndex={currentMainIndex}
          currentStatus={currentStatus}
          isFinalStatus={isFinalStatus}
          isReallyDisabled={isReallyDisabled}
          loading={loading}
          onStatusClick={handleStatusClick}
        />
      </div>

      {isFinalStatus && (
        <div
          className={`p-4 sm:p-5 rounded-xl ${colorClasses[currentStep.color]?.bg} border ${colorClasses[currentStep.color]?.border}`}
        >
          <div className="text-center mb-4">
            <div className="text-3xl sm:text-4xl mb-2">{currentStep.icon}</div>
            <p
              className={`text-base sm:text-lg font-semibold ${colorClasses[currentStep.color]?.text}`}
            >
              {currentStep.id === "closed_won"
                ? "Congratulations! Lead won."
                : "Lead marked as lost."}
            </p>
            {isConverted && (
              <p className="text-neon-blue text-sm mt-1">
                ✓ Converted to Client
              </p>
            )}
          </div>

          {!isConverted && (
            <button
              onClick={handleReopenLead}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {loading ? "Reopening..." : "Reopen Lead"}
            </button>
          )}

          {isConverted && (
            <div className="p-3 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-center">
              <p className="text-neon-blue text-xs sm:text-sm">
                This lead has been converted to a client and cannot be reopened.
              </p>
            </div>
          )}
        </div>
      )}

      {!isFinalStatus && (
        <div className="space-y-3 pt-1">
          <div className="block sm:hidden space-y-2">
            {nextStep && (
              <button
                onClick={() => handleStatusClick(nextStep.id)}
                disabled={isReallyDisabled || loading}
                className={`w-full p-3.5 rounded-xl font-semibold border disabled:opacity-50 flex items-center justify-between gap-3 transition-all active:scale-[0.99]
                  ${colorClasses[nextStep.color]?.bg} ${colorClasses[nextStep.color]?.border} ${colorClasses[nextStep.color]?.text} ${colorClasses[nextStep.color]?.hover}
                `}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg flex-shrink-0">{nextStep.icon}</span>
                  <div className="text-left min-w-0">
                    <p className="text-[10px] opacity-70 uppercase tracking-wider">
                      Next Step
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {nextStep.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {loading && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  )}
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            )}

            {previousStep && (
              <button
                onClick={() => handleStatusClick(previousStep.id)}
                disabled={isReallyDisabled || loading}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 flex items-center justify-between gap-3 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-1.5 flex-shrink-0">
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
                  <span className="text-xs text-gray-500">Previous</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm flex-shrink-0">
                    {previousStep.icon}
                  </span>
                  <span className="text-sm truncate">{previousStep.label}</span>
                </div>
              </button>
            )}

            {!nextStep && !previousStep && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-600 text-center text-sm">
                First step
              </div>
            )}
          </div>

          <div className="hidden sm:grid grid-cols-2 gap-2">
            {previousStep ? (
              <button
                onClick={() => handleStatusClick(previousStep.id)}
                disabled={isReallyDisabled || loading}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
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
                <span className="text-sm truncate">
                  Back: {previousStep.label}
                </span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-600 text-center text-sm">
                First step
              </div>
            )}

            {nextStep ? (
              <button
                onClick={() => handleStatusClick(nextStep.id)}
                disabled={isReallyDisabled || loading}
                className={`p-3 rounded-xl font-medium border disabled:opacity-50 flex items-center justify-center gap-2 transition-all
                  ${colorClasses[nextStep.color]?.bg} ${colorClasses[nextStep.color]?.border} ${colorClasses[nextStep.color]?.text} ${colorClasses[nextStep.color]?.hover}
                `}
              >
                <span className="text-sm truncate">Next: {nextStep.label}</span>
                <svg
                  className="w-4 h-4 flex-shrink-0"
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
                Last step
              </div>
            )}
          </div>

          {skipOptions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 px-1">Jump to:</p>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {skipOptions.map((step) => {
                  const colors = colorClasses[step.color];
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStatusClick(step.id)}
                      disabled={isReallyDisabled || loading}
                      className={`px-3 py-2 rounded-xl text-xs border disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]
                        ${colors.bg} ${colors.border} ${colors.text} ${colors.hover}
                      `}
                    >
                      <span>{step.icon}</span>
                      <span className="font-medium truncate">{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-gray-500 px-1 mb-2">Close Lead:</p>
            <div className="grid grid-cols-2 gap-2">
              {statusFlow
                .filter((s) => s.isFinal)
                .map((step) => {
                  const colors = colorClasses[step.color];
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStatusClick(step.id)}
                      disabled={isReallyDisabled || loading}
                      className={`p-3 rounded-xl font-medium border disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                        ${colors.bg} ${colors.border} ${colors.text} ${colors.hover}
                      `}
                    >
                      <span className="text-base">{step.icon}</span>
                      <span className="text-sm">{step.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      <Modal
        open={showConfirmModal}
        onCancel={() => {
          setShowConfirmModal(false);
          setPendingStatus(null);
        }}
        title={<span className="text-white">⏳ Proposal Pending</span>}
        footer={null}
        className="custom-modal"
        centered
        width="min(420px, 95vw)"
      >
        <div className="py-2">
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 mb-4">
            <p className="text-orange-400 font-semibold text-sm">
              ⏰ 24 Hour Reminder
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
              A reminder will be automatically set to follow up within 24 hours.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowConfirmModal(false);
                setPendingStatus(null);
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmStatusChange(pendingStatus)}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 disabled:opacity-50 text-sm font-medium hover:bg-orange-500/30 transition-all"
            >
              {loading ? "Updating..." : "Confirm & Set Reminder"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showReopenModal}
        onCancel={() => setShowReopenModal(false)}
        title={<span className="text-white">🔄 Reopen Lead</span>}
        footer={null}
        className="custom-modal"
        centered
        width="min(420px, 95vw)"
      >
        <div className="py-2">
          <p className="text-gray-300 mb-1 text-sm sm:text-base">
            Reset this lead to "New" status?
          </p>
          <p className="text-gray-500 text-xs mb-4">
            All progress will be reset and the lead will start from the
            beginning.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowReopenModal(false)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={confirmReopenLead}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-neon-blue/20 border border-neon-blue/30 text-neon-blue disabled:opacity-50 text-sm font-medium hover:bg-neon-blue/30 transition-all"
            >
              {loading ? "Reopening..." : "Yes, Reopen"}
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
