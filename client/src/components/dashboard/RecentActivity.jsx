import React from "react";
import Card from "../common/Card";

const RecentActivity = ({ activities = [], onActivityClick, onViewAll }) => {
  const defaultActivities = [
    {
      id: 1,
      type: "lead",
      title: "New lead received",
      description: "Acme Corporation submitted a contact form",
      time: "2 minutes ago",
      icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      type: "project",
      title: "Project milestone completed",
      description: "E-commerce Platform reached 75% completion",
      time: "1 hour ago",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-neon-green to-neon-blue",
    },
    {
      id: 3,
      type: "invoice",
      title: "Invoice paid",
      description: "Tech Startups Inc paid ₹2,50,000",
      time: "3 hours ago",
      icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z",
      color: "from-green-400 to-emerald-500",
    },
    {
      id: 4,
      type: "proposal",
      title: "Proposal accepted",
      description: "Digital Solutions accepted your proposal",
      time: "5 hours ago",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      color: "from-neon-blue to-purple-500",
    },
    {
      id: 5,
      type: "client",
      title: "New client onboarded",
      description: "Growth Labs completed onboarding",
      time: "1 day ago",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const displayActivities =
    activities.length > 0 ? activities : defaultActivities;

  const handleClick = (activity) => {
    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

  return (
    <Card
      title="Recent Activity"
      subtitle="Latest updates from your agency"
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
      <div className="space-y-4">
        {displayActivities.length === 0 ? (
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
          displayActivities.map((activity, index) => (
            <div
              key={activity.id || index}
              onClick={() => handleClick(activity)}
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
                <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {activity.description}
                </p>
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
