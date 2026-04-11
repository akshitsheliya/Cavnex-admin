import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import { getStatusBadge, formatTimeAgo } from "../../utils/dashboardHelpers";

const RecentLeads = ({ leads, totalLeads }) => {
  const navigate = useNavigate();

  const StatusBadge = ({ status }) => {
    const { className, label } = getStatusBadge(status);
    return <span className={className}>{label}</span>;
  };

  return (
    <Card
      title="Recent Leads"
      subtitle="Latest incoming leads"
      actions={
        <button
          onClick={() => navigate("/leads")}
          className="text-sm text-neon-green hover:text-neon-blue transition-colors whitespace-nowrap"
        >
          View All ({totalLeads})
        </button>
      }
    >
      <div className="space-y-4">
        {leads.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 mx-auto text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-400">No leads found</p>
            <button
              onClick={() => navigate("/leads/new")}
              className="mt-4 px-4 py-2 bg-neon-green/10 text-neon-green rounded-lg hover:bg-neon-green/20 transition-colors"
            >
              Add First Lead
            </button>
          </div>
        ) : (
          leads.map((lead, index) => (
            <div
              key={lead._id || index}
              onClick={() => navigate(`/leads/${lead._id}`)}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-neon-green/30 transition-all duration-200 cursor-pointer group gap-3"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20 flex-shrink-0">
                  <span className="text-sm font-medium text-purple-400">
                    {(lead.leadName || lead.name || lead.company || "L")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors break-words">
                    {lead.leadName || lead.name || lead.company}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                </div>
              </div>
              <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
                <StatusBadge status={lead.status} />
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(lead.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentLeads;
