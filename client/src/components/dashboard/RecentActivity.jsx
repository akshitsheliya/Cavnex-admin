// import React from "react";
// import Card from "../common/Card";

// const RecentActivity = ({ activities = [], onActivityClick, onViewAll }) => {
//   const defaultActivities = [
//     {
//       id: 1,
//       type: "lead",
//       title: "New lead received",
//       description: "Acme Corporation submitted a contact form",
//       time: "2 minutes ago",
//       icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
//       color: "from-purple-500 to-pink-500",
//     },
//     {
//       id: 2,
//       type: "project",
//       title: "Project milestone completed",
//       description: "E-commerce Platform reached 75% completion",
//       time: "1 hour ago",
//       icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
//       color: "from-neon-green to-neon-blue",
//     },
//     {
//       id: 3,
//       type: "invoice",
//       title: "Invoice paid",
//       description: "Tech Startups Inc paid ₹2,50,000",
//       time: "3 hours ago",
//       icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z",
//       color: "from-green-400 to-emerald-500",
//     },
//     {
//       id: 4,
//       type: "proposal",
//       title: "Proposal accepted",
//       description: "Digital Solutions accepted your proposal",
//       time: "5 hours ago",
//       icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
//       color: "from-neon-blue to-purple-500",
//     },
//     {
//       id: 5,
//       type: "client",
//       title: "New client onboarded",
//       description: "Growth Labs completed onboarding",
//       time: "1 day ago",
//       icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
//       color: "from-amber-500 to-orange-500",
//     },
//   ];

//   const displayActivities =
//     activities.length > 0 ? activities : defaultActivities;

//   const handleClick = (activity) => {
//     if (onActivityClick) {
//       onActivityClick(activity);
//     }
//   };

//   return (
//     <Card
//       title="Recent Activity"
//       subtitle="Latest updates from your agency"
//       actions={
//         onViewAll && (
//           <button
//             onClick={onViewAll}
//             className="text-sm text-neon-green hover:text-neon-blue transition-colors"
//           >
//             View All
//           </button>
//         )
//       }
//     >
//       <div className="space-y-4">
//         {displayActivities.length === 0 ? (
//           <div className="text-center py-8">
//             <svg
//               className="w-12 h-12 mx-auto text-gray-600 mb-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <p className="text-gray-500">No recent activity</p>
//           </div>
//         ) : (
//           displayActivities.map((activity, index) => (
//             <div
//               key={activity.id || index}
//               onClick={() => handleClick(activity)}
//               className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-neon-green/30 transition-all duration-200 cursor-pointer group"
//             >
//               <div
//                 className={`p-2.5 rounded-xl bg-gradient-to-br ${activity.color} shadow-lg flex-shrink-0`}
//               >
//                 <svg
//                   className="w-5 h-5 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1.5"
//                     d={activity.icon}
//                   />
//                 </svg>
//               </div>

//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
//                   {activity.title}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-0.5 truncate">
//                   {activity.description}
//                 </p>
//               </div>

//               <div className="flex flex-col items-end gap-1">
//                 <span className="text-xs text-gray-500 flex-shrink-0">
//                   {activity.time}
//                 </span>
//                 <svg
//                   className="w-4 h-4 text-gray-600 group-hover:text-neon-green transition-colors"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </Card>
//   );
// };

// export default RecentActivity;

import React from "react";
import Card from "../common/Card";

const RecentActivity = ({ activities = [], onActivityClick, onViewAll }) => {
  const getActivityIcon = (type, action) => {
    const icons = {
      lead: {
        default:
          "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
        converted:
          "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        status:
          "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
      },
      client: {
        default:
          "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        new: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
      },
      project: {
        default:
          "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
        completed: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        status:
          "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
      },
      invoice: {
        default:
          "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z",
        paid: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      },
      proposal: {
        default:
          "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        accepted: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      },
      agreement: {
        default:
          "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      },
    };

    return icons[type]?.[action] || icons[type]?.default || icons.lead.default;
  };

  const getActivityColor = (type, action) => {
    const colors = {
      lead: {
        default: "from-purple-500 to-pink-500",
        converted: "from-green-400 to-emerald-500",
        new: "from-purple-500 to-pink-500",
        contacted: "from-blue-500 to-cyan-500",
        qualified: "from-neon-green to-neon-blue",
        lost: "from-red-500 to-red-600",
      },
      client: {
        default: "from-amber-500 to-orange-500",
        new: "from-neon-green to-neon-blue",
        active: "from-green-400 to-emerald-500",
        inactive: "from-gray-500 to-gray-600",
      },
      project: {
        default: "from-neon-green to-neon-blue",
        completed: "from-green-400 to-emerald-500",
        planning: "from-purple-500 to-pink-500",
        design: "from-pink-500 to-rose-500",
        development: "from-blue-500 to-cyan-500",
        testing: "from-amber-500 to-orange-500",
        on_hold: "from-gray-500 to-gray-600",
      },
      invoice: {
        default: "from-cyan-500 to-blue-500",
        paid: "from-green-400 to-emerald-500",
        sent: "from-blue-500 to-cyan-500",
        overdue: "from-red-500 to-red-600",
      },
      proposal: {
        default: "from-neon-blue to-purple-500",
        accepted: "from-green-400 to-emerald-500",
        rejected: "from-red-500 to-red-600",
        sent: "from-blue-500 to-cyan-500",
      },
      agreement: {
        default: "from-purple-500 to-indigo-500",
        signed: "from-green-400 to-emerald-500",
        active: "from-neon-green to-neon-blue",
      },
    };

    return (
      colors[type]?.[action] || colors[type]?.default || colors.lead.default
    );
  };

  const handleClick = (activity) => {
    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

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
              onClick={() => handleClick(activity)}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-neon-green/30 transition-all duration-200 cursor-pointer group"
            >
              {/* Icon */}
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-br ${activity.color || getActivityColor(activity.type, activity.action)} shadow-lg flex-shrink-0`}
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
                    d={
                      activity.icon ||
                      getActivityIcon(activity.type, activity.action)
                    }
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors">
                    {activity.title}
                  </p>
                  {/* Type Badge */}
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/10 text-gray-400 uppercase">
                    {activity.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {activity.description}
                </p>
                {/* Status Change Indicator */}
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

              {/* Time & Arrow */}
              <div className="flex flex-col items-end gap-1">
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
