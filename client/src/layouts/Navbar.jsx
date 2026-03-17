import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const routeLabels = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/clients": "Clients",
  "/projects": "Projects",
  "/proposals": "Proposals",
  "/agreements": "Agreements",
  "/invoices": "Invoices",
  "/pricing": "Pricing Calculator",
  "/templates": "Templates",
  "/settings": "Settings",
};

const getPageLabel = (pathname) => {
  if (pathname === "/" || pathname === "/dashboard") return "Dashboard";
  const segments = pathname.split("/").filter(Boolean);
  const base = "/" + segments[0];
  const baseLabel =
    routeLabels[base] ||
    segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  if (segments.length === 1) return baseLabel;
  if (segments[1] === "new") return `New ${baseLabel.replace(/s$/, "")}`;
  if (segments[2] === "edit") return `Edit ${baseLabel.replace(/s$/, "")}`;
  return baseLabel;
};

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pageLabel = getPageLabel(location.pathname);
  const isSubPage =
    location.pathname !== "/" && location.pathname !== "/dashboard";
  const segments = location.pathname.split("/").filter(Boolean);
  const sectionLabel = segments[0]
    ? routeLabels["/" + segments[0]] ||
      segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
    : "Dashboard";

  const notifications = [
    {
      id: 1,
      title: "New lead added",
      desc: "Acme Corporation just submitted a form",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Invoice overdue",
      desc: "Invoice #INV-0042 is 3 days overdue",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Project updated",
      desc: "E-commerce Platform moved to Review",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-gray-500">Dashboard</span>
            {isSubPage && (
              <>
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-gray-400">{sectionLabel}</span>
              </>
            )}
            {segments.length > 1 && (
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            <span className="text-white font-medium">
              {segments.length <= 1 === pageLabel}
            </span>
          </div>

          <div className="md:hidden">
            <span className="text-white font-semibold text-sm">
              {pageLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowDropdown(false);
              }}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-neon-green rounded-full flex items-center justify-center text-black text-[9px] font-bold leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-80 z-50 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: "#0f0f0f",
                    animation: "slideDown 0.2s ease-out",
                  }}
                >
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">
                      Notifications
                    </p>
                    <span className="text-xs text-neon-green cursor-pointer hover:text-neon-blue transition-colors">
                      Mark all read
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 cursor-pointer border-l-2 transition-colors ${n.unread ? "border-neon-green" : "border-transparent"}`}
                        style={{ backgroundColor: "transparent" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "rgba(255,255,255,0.04)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-neon-green" : "bg-gray-600"}`}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white">
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {n.desc}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {n.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-2.5 border-t border-white/10">
                    <button className="text-xs text-neon-green hover:text-neon-blue transition-colors w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => (window.location.href = "/settings")}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            title="Settings"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

          <div className="relative">
            <button
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 sm:gap-3 p-1.5 sm:pr-3 hover:bg-white/5 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center flex-shrink-0">
                <span className="text-black font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white leading-tight">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role || "Administrator"}
                </p>
              </div>
              <svg
                className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-56 z-50 rounded-2xl border border-white/10 shadow-2xl overflow-hidden py-1"
                  style={{
                    backgroundColor: "#0f0f0f",
                    animation: "slideDown 0.2s ease-out",
                  }}
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email || "admin@agency.com"}
                    </p>
                  </div>

                  <div className="border-t border-white/10 py-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
