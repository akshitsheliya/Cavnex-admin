import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";

const NotificationBell = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [actionLoading, setActionLoading] = useState(null);

  const {
    reminders,
    stats,
    loading,
    totalCount,
    hasNotifications,
    isOpen,
    toggleNotifications,
    closeNotifications,
    markAsCompleted,
    markAsDismissed,
    refresh,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeNotifications();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeNotifications]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        closeNotifications();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeNotifications]);

  const handleLeadClick = (leadId) => {
    closeNotifications();
    navigate(`/leads/${leadId}`);
  };

  const handleMarkCompleted = async (e, leadId) => {
    e.stopPropagation();
    setActionLoading(leadId);
    await markAsCompleted(leadId);
    setActionLoading(null);
  };

  const handleDismiss = async (e, leadId) => {
    e.stopPropagation();
    setActionLoading(leadId);
    await markAsDismissed(leadId);
    setActionLoading(null);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reminderDate = new Date(d);
    reminderDate.setHours(0, 0, 0, 0);

    if (reminderDate.getTime() === today.getTime()) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (reminderDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (reminderDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    }

    const diffDays = Math.floor((today - reminderDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && diffDays <= 7) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }

    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const allReminders = [
    ...reminders.overdue.map((r) => ({ ...r, type: "overdue" })),
    ...reminders.today.map((r) => ({ ...r, type: "today" })),
    ...reminders.upcoming.map((r) => ({ ...r, type: "upcoming" })),
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleNotifications}
        className={`relative p-2 rounded-xl transition-all duration-300 ${
          isOpen
            ? "bg-neon-green/10 text-neon-green"
            : hasNotifications
              ? "bg-white/5 text-amber-400 hover:bg-white/10"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
        }`}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 ${hasNotifications && !isOpen ? "animate-wiggle" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-black bg-neon-green rounded-full animate-pulse">
            {totalCount > 99 ? "99+" : totalCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#1a1a2e]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fadeIn"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <h3 className="text-white font-semibold">Reminders</h3>
                {totalCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400">
                    {totalCount}
                  </span>
                )}
              </div>
              <button
                onClick={refresh}
                disabled={loading}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
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
              </button>
            </div>

            {(stats.overdue > 0 || stats.today > 0) && (
              <div className="flex gap-2 mt-3">
                {stats.overdue > 0 && (
                  <div className="flex-1 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                    <p className="text-lg font-bold text-red-400">
                      {stats.overdue}
                    </p>
                    <p className="text-[10px] text-red-400/70 uppercase tracking-wide">
                      Overdue
                    </p>
                  </div>
                )}
                {stats.today > 0 && (
                  <div className="flex-1 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                    <p className="text-lg font-bold text-amber-400">
                      {stats.today}
                    </p>
                    <p className="text-[10px] text-amber-400/70 uppercase tracking-wide">
                      Today
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {loading && allReminders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading reminders...</p>
              </div>
            ) : allReminders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-white font-medium">All caught up!</p>
                <p className="text-gray-500 text-sm mt-1">
                  No pending reminders
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {stats.overdue > 0 && reminders.overdue.length > 0 && (
                  <div className="px-3 py-2 bg-red-500/5">
                    <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                      Overdue ({stats.overdue})
                    </p>
                  </div>
                )}
                {reminders.overdue.map((reminder) => (
                  <ReminderItem
                    key={reminder._id}
                    reminder={reminder}
                    type="overdue"
                    onLeadClick={handleLeadClick}
                    onComplete={handleMarkCompleted}
                    onDismiss={handleDismiss}
                    formatDate={formatDate}
                    isLoading={actionLoading === reminder._id}
                  />
                ))}

                {stats.today > 0 && reminders.today.length > 0 && (
                  <div className="px-3 py-2 bg-amber-500/5">
                    <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                      Today ({stats.today})
                    </p>
                  </div>
                )}
                {reminders.today.map((reminder) => (
                  <ReminderItem
                    key={reminder._id}
                    reminder={reminder}
                    type="today"
                    onLeadClick={handleLeadClick}
                    onComplete={handleMarkCompleted}
                    onDismiss={handleDismiss}
                    formatDate={formatDate}
                    isLoading={actionLoading === reminder._id}
                  />
                ))}

                {reminders.upcoming.length > 0 && (
                  <div className="px-3 py-2 bg-neon-blue/5">
                    <p className="text-[10px] font-semibold text-neon-blue uppercase tracking-wider">
                      Upcoming ({reminders.upcoming.length})
                    </p>
                  </div>
                )}
                {reminders.upcoming.map((reminder) => (
                  <ReminderItem
                    key={reminder._id}
                    reminder={reminder}
                    type="upcoming"
                    onLeadClick={handleLeadClick}
                    onComplete={handleMarkCompleted}
                    onDismiss={handleDismiss}
                    formatDate={formatDate}
                    isLoading={actionLoading === reminder._id}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10 bg-white/[0.02]">
            <button
              onClick={() => {
                closeNotifications();
                navigate("/leads");
              }}
              className="w-full py-2 text-center text-sm font-medium text-neon-green hover:text-neon-blue transition-colors rounded-lg hover:bg-white/5"
            >
              View All Leads →
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(10deg);
          }
          75% {
            transform: rotate(-5deg);
          }
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

const ReminderItem = ({
  reminder,
  type,
  onLeadClick,
  onComplete,
  onDismiss,
  formatDate,
  isLoading,
}) => {
  const typeConfig = {
    overdue: {
      dot: "bg-red-500",
      badge: "bg-red-500/20 text-red-400",
      bg: "bg-red-500/5",
    },
    today: {
      dot: "bg-amber-500 animate-pulse",
      badge: "bg-amber-500/20 text-amber-400",
      bg: "",
    },
    upcoming: {
      dot: "bg-neon-blue",
      badge: "bg-neon-blue/20 text-neon-blue",
      bg: "",
    },
  };

  const config = typeConfig[type] || typeConfig.upcoming;

  return (
    <div
      onClick={() => onLeadClick(reminder._id)}
      className={`p-3 hover:bg-white/5 cursor-pointer transition-colors ${config.bg} ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
      role="menuitem"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${config.dot}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-white truncate">
              {reminder.leadName}
            </p>
          </div>
          <p className="text-xs text-gray-500 truncate">
            {reminder.company || reminder.email}
          </p>
          {reminder.reminder?.note && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {reminder.reminder.note}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(reminder.reminder?.date)}
            </span>
            <div className="flex gap-1">
              <button
                onClick={(e) => onComplete(e, reminder._id)}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                title="Mark as done"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                ) : (
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={(e) => onDismiss(e, reminder._id)}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-500/20 transition-colors disabled:opacity-50"
                title="Dismiss"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
