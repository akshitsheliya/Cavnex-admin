import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { NotificationBell } from "../components/common";

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

const Navbar = ({ onMenuClick, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  const pageLabel = getPageLabel(location.pathname);
  const isSubPage =
    location.pathname !== "/" && location.pathname !== "/dashboard";
  const segments = location.pathname.split("/").filter(Boolean);
  const sectionLabel = segments[0]
    ? routeLabels["/" + segments[0]] ||
      segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
    : "Dashboard";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                <span className="text-white font-medium">{pageLabel}</span>
              </>
            )}
            {segments.length === 1 && (
              <span className="text-white font-medium">{pageLabel}</span>
            )}
          </div>

          <div className="md:hidden">
            <span className="text-white font-semibold text-sm">
              {pageLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell />

          <button
            onClick={() => navigate("/settings")}
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
