import React from "react";

const LeadStatusBadge = ({ status, size = "md" }) => {
  const config = {
    new: {
      bg: "bg-purple-500/20",
      text: "text-purple-400",
      border: "border-purple-500/30",
      label: "New",
    },
    contacted: {
      bg: "bg-neon-blue/20",
      text: "text-neon-blue",
      border: "border-neon-blue/30",
      label: "Contacted",
    },
    meeting: {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      border: "border-amber-500/30",
      label: "Meeting",
    },
    proposal_sent: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      label: "Proposal Sent",
    },
    negotiation: {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      border: "border-orange-500/30",
      label: "Negotiation",
    },
    closed_won: {
      bg: "bg-neon-green/20",
      text: "text-neon-green",
      border: "border-neon-green/30",
      label: "Won",
    },
    closed_lost: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/30",
      label: "Lost",
    },
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  const { bg, text, border, label } = config[status] || config.new;

  return (
    <span
      className={`
            inline-flex items-center rounded-full font-medium border
            ${bg} ${text} ${border} ${sizes[size]}
        `}
    >
      {label}
    </span>
  );
};

export default LeadStatusBadge;
