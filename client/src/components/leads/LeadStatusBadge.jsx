import React from "react";

const statusConfig = {
  new: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
    dot: "bg-purple-400",
    label: "New",
  },
  contacted: {
    bg: "bg-neon-blue/20",
    text: "text-neon-blue",
    border: "border-neon-blue/30",
    dot: "bg-neon-blue",
    label: "Contacted",
  },
  meeting: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
    label: "Meeting",
  },
  proposal_sent: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    dot: "bg-cyan-400",
    label: "Proposal Sent",
  },
  negotiation: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
    dot: "bg-orange-400",
    label: "Negotiation",
  },
  closed_won: {
    bg: "bg-neon-green/20",
    text: "text-neon-green",
    border: "border-neon-green/30",
    dot: "bg-neon-green",
    label: "Won",
  },
  closed_lost: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-400",
    label: "Lost",
  },
};

const sizes = {
  sm: { pill: "px-2 py-0.5 text-[10px]", dot: "w-1.5 h-1.5" },
  md: { pill: "px-2.5 py-0.5 text-xs", dot: "w-1.5 h-1.5" },
  lg: { pill: "px-3.5 py-1 text-sm", dot: "w-2 h-2" },
};

const LeadStatusBadge = ({ status, size = "md" }) => {
  const config = statusConfig[status] || statusConfig.new;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        whitespace-nowrap flex-shrink-0
        ${config.bg} ${config.text} ${config.border} ${sizeClass.pill}
      `}
    >
      <span
        className={`rounded-full flex-shrink-0 ${config.dot} ${sizeClass.dot}`}
      />
      {config.label}
    </span>
  );
};

export default LeadStatusBadge;
