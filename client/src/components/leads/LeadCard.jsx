import React from "react";
import { useNavigate } from "react-router-dom";
import LeadStatusBadge from "./LeadStatusBadge";

const LeadCard = ({ lead, onDelete, onStatusChange, onConvert }) => {
  const navigate = useNavigate();

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="glass-card p-5 hover:border-neon-green/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
            <span className="text-lg font-semibold text-purple-400">
              {lead.leadName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3
              onClick={() => navigate(`/leads/${lead._id}`)}
              className="font-semibold text-white group-hover:text-neon-green transition-colors cursor-pointer"
            >
              {lead.leadName}
            </h3>
            <p className="text-sm text-gray-400">
              {lead.businessName || "No business name"}
            </p>
          </div>
        </div>
        <LeadStatusBadge status={lead.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg
            className="w-4 h-4"
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
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg
            className="w-4 h-4"
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
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{sourceIcons[lead.source] || "📌"}</span>
          <span className="capitalize">{lead.source?.replace("_", " ")}</span>
        </div>
        {!lead.organization && !lead.createdBy && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
            Website Lead
          </span>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg
            className="w-4 h-4"
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
          <span>{lead.city || "N/A"}</span>
        </div>
      </div>

      {lead.estimatedValue > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-neon-green/5 border border-neon-green/20">
          <p className="text-xs text-gray-400">Estimated Value</p>
          <p className="text-lg font-semibold text-neon-green">
            {formatCurrency(lead.estimatedValue)}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-xs text-gray-500">
          {formatDate(lead.createdAt)}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/leads/${lead._id}`)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="View"
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
          <button
            onClick={() => navigate(`/leads/${lead._id}/edit`)}
            className="p-2 text-gray-400 hover:text-neon-green hover:bg-neon-green/10 rounded-lg transition-colors"
            title="Edit"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          {lead.status !== "closed_won" && !lead.convertedToClient && (
            <button
              onClick={() => onConvert(lead._id)}
              className="p-2 text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-colors"
              title="Convert to Client"
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(lead._id)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete"
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
