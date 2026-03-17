import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    path: "/leads",
    label: "Leads",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    path: "/clients",
    label: "Clients",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    path: "/projects",
    label: "Projects",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  {
    path: "/proposals",
    label: "Proposals",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    path: "/agreements",
    label: "Agreements",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    path: "/invoices",
    label: "Invoices",
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    path: "/pricing",
    label: "Pricing Calculator",
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  {
    path: "/templates",
    label: "Templates",
    icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
  },
  {
    path: "/settings",
    label: "Settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  },
];

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  return (
    <>
      <style>{`
        .sidebar-root {
          background-color: #0a0a0a;
        }

        /* Tooltip */
        .sidebar-tooltip {
          position: absolute;
          left: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%) translateX(-6px);
          background-color: #1c1c1c;
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.18s ease, transform 0.18s ease;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 6px 16px rgba(0,0,0,0.5);
          z-index: 9999 !important;
        }
        .sidebar-tooltip::before {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: #1c1c1c;
        }
        .sidebar-nav-item:hover .sidebar-tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        /* Animated text areas — use max-width + opacity trick */
        .sb-fade {
          overflow: hidden;
          white-space: nowrap;
          transition:
            max-width 0.28s cubic-bezier(0.4,0,0.2,1),
            opacity 0.2s ease;
        }
        .sb-fade.show {
          max-width: 200px;
          opacity: 1;
        }
        .sb-fade.hide {
          max-width: 0px;
          opacity: 0;
        }

        /* Search bar height animation */
        .sb-search {
          overflow: hidden;
          transition:
            max-height 0.28s cubic-bezier(0.4,0,0.2,1),
            opacity 0.2s ease,
            padding 0.28s ease;
        }
        .sb-search.show {
          max-height: 80px;
          opacity: 1;
          padding-top: 12px;
          padding-bottom: 12px;
        }
        .sb-search.hide {
          max-height: 0px;
          opacity: 0;
          padding-top: 0;
          padding-bottom: 0;
        }

        /* "Menu" section label */
        .sb-section-label {
          overflow: hidden;
          transition:
            max-height 0.28s cubic-bezier(0.4,0,0.2,1),
            opacity 0.2s ease;
        }
        .sb-section-label.show {
          max-height: 32px;
          opacity: 1;
        }
        .sb-section-label.hide {
          max-height: 0px;
          opacity: 0;
        }

        /* Toggle btn rotation */
        .sb-toggle-icon {
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .sb-toggle-icon.expanded { transform: rotate(0deg); }
        .sb-toggle-icon.collapsed-state { transform: rotate(180deg); }
      `}</style>

      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside
        className={`
          sidebar-root
          fixed top-0 left-0 z-30 h-full
          border-r border-white/5
          transform transition-all duration-300 ease-out
          lg:static lg:translate-x-0
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full "}
          ${isCollapsed ? "w-[68px]" : "w-72"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-3 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-base">A</span>
            </div>
            <div className={`sb-fade ${isCollapsed ? "hide" : "show"}`}>
              <p className="text-base font-bold text-white leading-tight">
                Agency
              </p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`sb-toggle-icon w-4 h-4 ${isCollapsed ? "collapsed-state" : "expanded"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div
          className={`sb-search px-3 border-b border-white/5 flex-shrink-0 ${isCollapsed ? "hide" : "show"}`}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2.5 pl-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Nav */}
        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-0.5 transition-all duration-300 ${isCollapsed ? "px-2" : "px-3"}`}
        >
          <div className={`sb-section-label ${isCollapsed ? "hide" : "show"}`}>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">
              Menu
            </p>
          </div>

          {menuItems.map((item) => (
            <div key={item.path} className="relative sidebar-nav-item">
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center py-2.5 rounded-xl transition-all duration-150
                  ${isCollapsed ? "justify-center px-2" : "gap-3 px-3"}
                  ${
                    isActive
                      ? "text-white bg-gradient-to-r from-neon-green/15 to-neon-blue/15 border border-neon-green/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <svg
                      className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-neon-green" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d={item.icon}
                      />
                    </svg>

                    <div
                      className={`sb-fade flex items-center justify-between flex-1 ${isCollapsed ? "hide" : "show"}`}
                    >
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_rgba(0,255,136,0.6)] flex-shrink-0" />
                      )}
                    </div>
                  </>
                )}
              </NavLink>

              {isCollapsed && (
                <span className="sidebar-tooltip">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
