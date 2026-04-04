// PageHeader.jsx
import React from "react";
import { ReloadOutlined } from "@ant-design/icons";

const PageHeader = ({
  title,
  subtitle,
  onRefresh,
  refreshing = false,
  actions,
  children,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-500 mt-0.5 sm:mt-1 text-xs sm:text-sm lg:text-base truncate">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-wrap">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={`p-2 sm:p-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-neon-green/30 transition-all duration-200 flex-shrink-0 ${
              refreshing ? "animate-spin" : ""
            }`}
            title="Refresh"
          >
            <ReloadOutlined className="text-sm sm:text-base" />
          </button>
        )}
        {actions}
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
