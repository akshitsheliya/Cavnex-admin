import React from "react";
import StatCardSkeleton from "./StatCardSkeleton";

const StatCards = ({ stats = [], loading = false, columns }) => {
  const cols = columns || stats.length || 4;

  if (loading) {
    return <StatCardSkeleton count={cols} columns={cols} />;
  }

  if (!stats || stats.length === 0) {
    return null;
  }

  const gridColsClass = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${gridColsClass[cols] || "lg:grid-cols-4"} gap-4`}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          onClick={stat.onClick}
          className={`glass-card p-5 hover:border-neon-green/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] transition-all duration-300 group ${stat.onClick ? "cursor-pointer" : ""}`}
        >
          <div className="flex items-start justify-between">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
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
                  d={stat.icon}
                />
              </svg>
            </div>
            {stat.change && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  stat.changeType === "positive"
                    ? "bg-neon-green/10 text-neon-green"
                    : stat.changeType === "negative"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-gray-500/10 text-gray-400"
                }`}
              >
                {stat.changeType === "positive" && (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                )}
                {stat.changeType === "negative" && (
                  <svg
                    className="w-3 h-3 rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                )}
                {stat.change}
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1 group-hover:text-neon-green transition-colors">
              {stat.value}
            </p>
          </div>
          <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
              style={{ width: stat.progress ? `${stat.progress}%` : "70%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
