import React from "react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "New Lead",
      path: "/leads/new",
      icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
      gradient: "from-purple-500 to-pink-500",
      description: "Add a new lead",
    },
    {
      label: "New Client",
      path: "/clients/new",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      gradient: "from-neon-green to-neon-blue",
      description: "Add a new client",
    },
    {
      label: "New Project",
      path: "/projects/new",
      icon: "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      gradient: "from-neon-blue to-purple-500",
      description: "Start a new project",
    },
    {
      label: "New Invoice",
      path: "/invoices/new",
      icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
      gradient: "from-amber-500 to-orange-500",
      description: "Create new invoice",
    },
    {
      label: "New Proposal",
      path: "/proposals/new",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      gradient: "from-cyan-500 to-blue-500",
      description: "Draft a proposal",
    },
    {
      label: "Calculator",
      path: "/pricing",
      icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      gradient: "from-emerald-500 to-teal-500",
      description: "Calculate pricing",
    },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <p className="text-sm text-gray-400">Frequently used actions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 group"
          >
            <div
              className={`p-4 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d={action.icon}
                />
              </svg>
            </div>
            <div className="text-center w-full">
              <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white transition-colors block truncate w-full">
                {action.label}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:block mt-1 truncate w-full">
                {action.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
