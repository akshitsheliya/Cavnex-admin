import React from "react";
import { useNavigate } from "react-router-dom";

const ClientCard = ({ client, onDelete, onStatusChange }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    const config = {
      active: {
        bg: "bg-neon-green/20",
        text: "text-neon-green",
        border: "border-neon-green/30",
        label: "Active",
      },
      inactive: {
        bg: "bg-gray-500/20",
        text: "text-gray-400",
        border: "border-gray-500/30",
        label: "Inactive",
      },
      on_hold: {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        border: "border-amber-500/30",
        label: "On Hold",
      },
    };
    return config[status] || config.active;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statusConfig = getStatusConfig(client.status);

  return (
    <div className="glass-card p-6 hover:border-neon-green/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-black">
              {client.businessName?.charAt(0).toUpperCase() ||
                client.clientName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3
              onClick={() => navigate(`/clients/${client._id}`)}
              className="text-lg font-semibold text-white group-hover:text-neon-green transition-colors cursor-pointer"
            >
              {client.businessName}
            </h3>
            <p className="text-sm text-gray-400">{client.clientName}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
        >
          {statusConfig.label}
        </span>
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
          <span className="truncate">{client.email}</span>
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
          <span>{client.phone}</span>
        </div>
        {client.industry && (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>{client.industry}</span>
          </div>
        )}
        {client.address?.city && (
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
            <span>{client.address.city}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-xs text-gray-500">Projects</p>
          <p className="text-lg font-semibold text-white">
            {client.totalProjects || 0}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-xs text-gray-500">Revenue</p>
          <p className="text-lg font-semibold text-neon-green">
            {formatCurrency(client.totalRevenue || 0)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
        <button
          onClick={() => navigate(`/clients/${client._id}`)}
          className="flex-1 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          View
        </button>
        <button
          onClick={() => navigate(`/clients/${client._id}/edit`)}
          className="flex-1 py-2 text-sm text-gray-400 hover:text-neon-green hover:bg-neon-green/10 rounded-lg transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => navigate(`/projects/new?clientId=${client._id}`)}
          className="flex-1 py-2 text-sm text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-colors"
        >
          + Project
        </button>
        <button
          onClick={() => onDelete(client._id)}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
  );
};

export default ClientCard;
