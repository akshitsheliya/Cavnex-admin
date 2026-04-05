// LeadCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import LeadStatusBadge from "./LeadStatusBadge";

const sourceIcons = {
  website: "🌐",
  instagram: "📸",
  referral: "🤝",
  google: "🔍",
  cold_call: "📞",
  linkedin: "💼",
  facebook: "👥",
  other: "📌",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const iconBtn =
  "p-1.5 sm:p-2 rounded-lg transition-colors duration-200 flex-shrink-0";

const LeadCard = ({ lead, onDelete, onConvert }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-3 sm:p-4 lg:p-5 flex flex-col hover:border-neon-green/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] transition-all duration-300 group min-h-0">
      {/* Header: avatar + name + status */}
      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Avatar */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex-shrink-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
            <span className="text-sm sm:text-base font-semibold text-purple-400">
              {lead.leadName?.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Name + business */}
          <div className="min-w-0 flex-1">
            <h3
              onClick={() => navigate(`/leads/${lead._id}`)}
              className="font-semibold text-white group-hover:text-neon-green transition-colors cursor-pointer truncate text-sm sm:text-base"
              title={lead.leadName}
            >
              {lead.leadName}
            </h3>
            <p
              className="text-[10px] sm:text-xs text-gray-400 truncate"
              title={lead.businessName}
            >
              {lead.businessName || "No business name"}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex-shrink-0">
          <LeadStatusBadge status={lead.status} size="sm" />
        </div>
      </div>

      {/* Meta grid */}
      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
        {/* Email */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs lg:text-sm text-gray-400 min-w-0">
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="truncate">{lead.email}</span>
        </div>

        {/* Phone + source row */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs lg:text-sm text-gray-400 min-w-0">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="truncate">{lead.phone}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs lg:text-sm text-gray-400 min-w-0">
            <span className="flex-shrink-0 text-xs sm:text-sm">
              {sourceIcons[lead.source] || "📌"}
            </span>
            <span className="capitalize truncate">
              {lead.source?.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* City row */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs lg:text-sm text-gray-400 min-w-0">
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{lead.city || "N/A"}</span>
          {!lead.organization && !lead.createdBy && (
            <span className="ml-auto flex-shrink-0 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30 whitespace-nowrap">
              Website
            </span>
          )}
        </div>
      </div>

      {/* Estimated Value */}
      {lead.estimatedValue > 0 && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-neon-green/5 border border-neon-green/20">
          <p className="text-[10px] sm:text-xs text-gray-400">
            Estimated Value
          </p>
          <p className="text-sm sm:text-base font-semibold text-neon-green mt-0.5">
            {formatCurrency(lead.estimatedValue)}
          </p>
        </div>
      )}

      {/* Footer: date + action icons */}
      <div className="flex items-center justify-between pt-2.5 sm:pt-3.5 border-t border-white/5 mt-auto">
        <span className="text-[10px] sm:text-xs text-gray-500 truncate">
          {formatDate(lead.createdAt)}
        </span>

        {/* ✅ NEW: Compact Copy Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const leadData = `Lead: ${lead.leadName}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nStatus: ${lead.status}`;
            navigator.clipboard.writeText(leadData);
            message.success("Lead details copied!");
          }}
          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-neon-green transition-colors"
          title="Copy details"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>

        <div className="flex items-center gap-0 flex-shrink-0">
          {/* View */}
          <button
            onClick={() => navigate(`/leads/${lead._id}`)}
            className={`${iconBtn} text-gray-400 hover:text-white hover:bg-white/10`}
            title="View"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          {/* Edit */}
          <button
            onClick={() => navigate(`/leads/${lead._id}/edit`)}
            className={`${iconBtn} text-gray-400 hover:text-neon-green hover:bg-neon-green/10`}
            title="Edit"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* Convert */}
          {lead.status !== "closed_won" && !lead.convertedToClient && (
            <button
              onClick={() => onConvert(lead._id)}
              className={`${iconBtn} text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10`}
              title="Convert to Client"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => onDelete(lead._id)}
            className={`${iconBtn} text-gray-400 hover:text-red-400 hover:bg-red-500/10`}
            title="Delete"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
