import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { createPortal } from "react-dom";
import { Modal } from "antd";
import useAuth from "../hooks/useAuth";
import logo from "../assets/cavnex_main.svg";

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

const Tooltip = ({ label, targetRef, isVisible }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (targetRef.current && isVisible) {
      const rect = targetRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 12,
      });
    }
  }, [isVisible, targetRef]);

  if (!isVisible) return null;

  return createPortal(
    <div
      className="fixed z-[9999] bg-[#1a1a1a] text-white text-xs font-medium px-3 py-2 rounded-lg border border-white/10 shadow-xl pointer-events-none whitespace-nowrap animate-tooltip-in"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateY(-50%)",
      }}
    >
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-[#1a1a1a]" />
      {label}
    </div>,
    document.body
  );
};

const NavItem = ({ item, isCollapsed, onClose }) => {
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef(null);

  return (
    <div
      ref={itemRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavLink
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center py-2.5 rounded-xl transition-all duration-200
          ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"}
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
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="font-medium text-sm truncate">
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_rgba(0,255,136,0.6)] flex-shrink-0 ml-2" />
                )}
              </div>
            )}
          </>
        )}
      </NavLink>
      {isCollapsed && (
        <Tooltip label={item.label} targetRef={itemRef} isVisible={isHovered} />
      )}
    </div>
  );
};

const UserSection = ({ user, isCollapsed, logout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const userRef = useRef(null);
  const logoutRef = useRef(null);

  const userInitial = user?.name?.charAt(0).toUpperCase() || "A";
  const userName = user?.name || "Admin";
  const userEmail = user?.email || "admin@cavnex.com";

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      okText: "Yes, Logout",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        className: "!bg-red-500 !border-red-500 hover:!bg-red-600",
      },
      cancelButtonProps: {
        className: "!border-gray-600 !text-gray-300 hover:!border-gray-500",
      },
      className: "logout-modal",
      onOk: () => {
        logout();
      },
    });
  };

  if (isCollapsed) {
    return (
      <div className="border-t border-white/5 p-2 flex-shrink-0 space-y-2">
        <div
          ref={userRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center justify-center py-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
              <span className="text-black font-semibold text-sm">
                {userInitial}
              </span>
            </div>
          </div>
          <Tooltip
            label={`${userName} • ${userEmail}`}
            targetRef={userRef}
            isVisible={isHovered}
          />
        </div>

        <div
          ref={logoutRef}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
        >
          <div className="flex items-center justify-center py-2">
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all hover:scale-105 group"
            >
              <svg
                className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
          <Tooltip
            label="Logout"
            targetRef={logoutRef}
            isVisible={isLogoutHovered}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-white/5 p-3 flex-shrink-0">
      <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center flex-shrink-0">
          <span className="text-black font-semibold text-sm">
            {userInitial}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">{userName}</p>
          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all hover:scale-105 group"
          title="Logout"
        >
          <svg
            className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();

  return (
    <>
      <style>{`
        @keyframes tooltip-in {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
        .animate-tooltip-in {
          animation: tooltip-in 0.15s ease-out forwards;
        }
        .logout-modal .ant-modal-content {
          background-color: #141414 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
        }
        .logout-modal .ant-modal-header {
          background-color: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .logout-modal .ant-modal-title {
          color: #fff !important;
        }
        .logout-modal .ant-modal-body {
          color: #9ca3af !important;
        }
        .logout-modal .ant-modal-close {
          color: #9ca3af !important;
        }
        .logout-modal .ant-modal-close:hover {
          color: #fff !important;
        }
        .logout-modal .ant-modal-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .logout-modal .ant-btn-default {
          background-color: transparent !important;
          border-color: #4b5563 !important;
          color: #d1d5db !important;
        }
        .logout-modal .ant-btn-default:hover {
          border-color: #6b7280 !important;
          color: #fff !important;
        }
        .logout-modal .ant-btn-primary {
          background-color: #ef4444 !important;
          border-color: #ef4444 !important;
        }
        .logout-modal .ant-btn-primary:hover {
          background-color: #dc2626 !important;
          border-color: #dc2626 !important;
        }
      `}</style>

      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 z-30 h-full bg-[#0a0a0a] border-r border-white/5 transform transition-all duration-300 ease-out lg:static lg:translate-x-0 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-16" : "w-72"}`}
      >
        <div
          className={`flex items-center h-16 border-b border-white/5 flex-shrink-0 transition-all duration-300 ${
            isCollapsed ? "px-3 justify-center" : "px-4 justify-between"
          }`}
        >
          <div
            className={`flex items-center min-w-0 ${isCollapsed ? "" : "gap-3 flex-1"}`}
          >
            <div className="w-10 h-10 p-[6px] rounded-full bg-white/[0.02] backdrop-blur-xl border border-white/10  flex items-center justify-center flex-shrink-0">
              <img src={logo} alt="Cavnex Logo" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex flex-col gap-[3px] mt-1">
                <p className="text-lg font-bold text-white leading-tight truncate">
                  Cavnex
                </p>
                <p className="text-xs text-gray-500 truncate">Admin Panel</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
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
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {isCollapsed && (
          <div className="hidden lg:flex justify-center py-3 border-b border-white/5 flex-shrink-0">
            <button
              onClick={onToggleCollapse}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-4 h-4 rotate-180"
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
        )}

        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-white/5 flex-shrink-0">
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
        )}

        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1 ${isCollapsed ? "px-2" : "px-3"}`}
        >
          {!isCollapsed && (
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-3">
              Menu
            </p>
          )}
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isCollapsed={isCollapsed}
              onClose={onClose}
            />
          ))}
        </nav>

        <UserSection user={user} isCollapsed={isCollapsed} logout={logout} />
      </aside>
    </>
  );
};

export default Sidebar;
