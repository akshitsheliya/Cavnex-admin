import React from "react";
import Card from "../common/Card";

const RecentActivity = ({ activities, onActivityClick, onViewAll }) => {
  return (
    <Card
      title="Recent Activity"
      subtitle="All updates from your agency"
      actions={
        onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-neon-green hover:text-neon-blue transition-colors"
          >
            View All
          </button>
        )
      }
    >
      <div className="space-y-3">
        {activities.length === 0 ? (
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id || index}
              onClick={() => onActivityClick(activity)}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-neon-green/30 transition-all duration-200 cursor-pointer group"
            >
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-br ${activity.color} shadow-lg flex-shrink-0`}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d={activity.icon}
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
                    {activity.title}
                  </p>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/10 text-gray-400 uppercase">
                    {activity.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {activity.description}
                </p>
                {activity.statusChange && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-500 uppercase">
                      {activity.statusChange.from}
                    </span>
                    <svg
                      className="w-3 h-3 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    <span
                      className={`text-[10px] uppercase font-medium ${
                        activity.statusChange.to === "completed" ||
                        activity.statusChange.to === "converted" ||
                        activity.statusChange.to === "paid"
                          ? "text-neon-green"
                          : activity.statusChange.to === "lost" ||
                              activity.statusChange.to === "cancelled"
                            ? "text-red-400"
                            : "text-neon-blue"
                      }`}
                    >
                      {activity.statusChange.to}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 flex flex-col items-end gap-1 ml-2">
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {activity.time}
                </span>
                <svg
                  className="w-4 h-4 text-gray-600 group-hover:text-neon-green transition-colors"
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
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentActivity;
