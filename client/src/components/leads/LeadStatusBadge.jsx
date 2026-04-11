// LeadStatusBadge.jsx
import React from "react";

const statusConfig = {
  new: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
    dot: "bg-purple-400",
    label: "New",
    icon: "✨",
  },
  contacted: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    dot: "bg-blue-400",
    label: "Contacted",
    icon: "📞",
  },
  meeting: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
    label: "Meeting",
    icon: "🤝",
  },
  proposal_pending: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
    dot: "bg-orange-400",
    label: "Proposal Pending",
    icon: "⏳",
  },
  proposal_sent: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    dot: "bg-cyan-400",
    label: "Proposal Sent",
    icon: "📨",
  },
  negotiation: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    dot: "bg-yellow-400",
    label: "Negotiation",
    icon: "💬",
  },
  closed_won: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/30",
    dot: "bg-green-400",
    label: "Won",
    icon: "🎉",
  },
  closed_lost: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-400",
    label: "Lost",
    icon: "❌",
  },
};

const sizes = {
  sm: {
    pill: "px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px]",
    dot: "w-1 h-1 sm:w-1.5 sm:h-1.5",
  },
  md: {
    pill: "px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs",
    dot: "w-1.5 h-1.5",
  },
  lg: {
    pill: "px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-xs sm:text-sm",
    dot: "w-1.5 h-1.5 sm:w-2 sm:h-2",
  },
};

const LeadStatusBadge = ({ status, size = "md", showIcon = false }) => {
  const config = statusConfig[status] || statusConfig.new;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span
      className={`
        inline-flex items-center gap-1 sm:gap-1.5 rounded-full font-medium border
        whitespace-nowrap flex-shrink-0
        ${config.bg} ${config.text} ${config.border} ${sizeClass.pill}
      `}
    >
      {showIcon && <span className="text-xs leading-none">{config.icon}</span>}
      <span
        className={`rounded-full flex-shrink-0 ${config.dot} ${sizeClass.dot}`}
      />
      {config.label}
    </span>
  );
};

export default LeadStatusBadge;
