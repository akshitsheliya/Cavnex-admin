import React from "react";
import Button from "./Button";

const PageHeader = ({
  title,
  subtitle,
  onRefresh,
  refreshing = false,
  actions,
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={`p-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-neon-green/30 transition-all duration-200 ${
              refreshing ? "animate-spin" : ""
            }`}
            title="Refresh"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
        {actions}
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
