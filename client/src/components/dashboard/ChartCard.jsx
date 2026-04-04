// import React from "react";

// const ChartCard = ({
//   title,
//   subtitle,
//   data = [],
//   type = "bar",
//   period = "6months",
//   onPeriodChange,
// }) => {
//   const defaultData = [65, 45, 75, 50, 85, 60, 90, 70, 95, 80, 88, 92];
//   const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

//   const chartData = data.length > 0 ? data : defaultData;
//   const maxValue = Math.max(...chartData, 1);

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-white">{title}</h3>
//           {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
//         </div>
//         <select
//           value={period}
//           onChange={(e) => onPeriodChange && onPeriodChange(e.target.value)}
//           className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-neon-green/50 cursor-pointer"
//         >
//           <option value="6months">Last 6 Months</option>
//           <option value="year">This Year</option>
//           <option value="all">All Time</option>
//         </select>
//       </div>

//       {type === "bar" && (
//         <div className="h-64 flex items-end justify-between gap-2 px-4">
//           {chartData.map((value, i) => {
//             const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
//             return (
//               <div
//                 key={i}
//                 className="flex-1 flex flex-col items-center gap-2 group"
//               >
//                 <div className="relative w-full">
//                   <div
//                     className="w-full bg-gradient-to-t from-neon-green/50 to-neon-blue/50 rounded-t-lg transition-all duration-500 hover:from-neon-green hover:to-neon-blue cursor-pointer group-hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
//                     style={{ height: `${Math.max(height * 2.5, 4)}px` }}
//                   />
//                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-600 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                     {value}%
//                   </div>
//                 </div>
//                 <span className="text-xs text-gray-500">{months[i]}</span>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {type === "line" && (
//         <div className="h-64 relative">
//           <svg className="w-full h-full" viewBox="0 0 400 200">
//             <defs>
//               <linearGradient
//                 id="lineGradient"
//                 x1="0%"
//                 y1="0%"
//                 x2="100%"
//                 y2="0%"
//               >
//                 <stop offset="0%" stopColor="#00ff88" />
//                 <stop offset="100%" stopColor="#00d4ff" />
//               </linearGradient>
//               <linearGradient
//                 id="areaGradient"
//                 x1="0%"
//                 y1="0%"
//                 x2="0%"
//                 y2="100%"
//               >
//                 <stop offset="0%" stopColor="rgba(0,255,136,0.3)" />
//                 <stop offset="100%" stopColor="rgba(0,255,136,0)" />
//               </linearGradient>
//             </defs>

//             <path
//               d={`M 0 ${200 - chartData[0] * 2} ${chartData.map((d, i) => `L ${(i * 400) / (chartData.length - 1)} ${200 - d * 2}`).join(" ")} L 400 200 L 0 200 Z`}
//               fill="url(#areaGradient)"
//             />

//             <path
//               d={`M 0 ${200 - chartData[0] * 2} ${chartData.map((d, i) => `L ${(i * 400) / (chartData.length - 1)} ${200 - d * 2}`).join(" ")}`}
//               fill="none"
//               stroke="url(#lineGradient)"
//               strokeWidth="3"
//               strokeLinecap="round"
//             />

//             {chartData.map((d, i) => (
//               <circle
//                 key={i}
//                 cx={(i * 400) / (chartData.length - 1)}
//                 cy={200 - d * 2}
//                 r="5"
//                 fill="#000"
//                 stroke="url(#lineGradient)"
//                 strokeWidth="2"
//                 className="cursor-pointer hover:r-8 transition-all"
//               />
//             ))}
//           </svg>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChartCard;

import React, { useState } from "react";
import Modal from "../common/Modal";

const ChartCard = ({
  title,
  subtitle,
  data = [],
  type = "bar",
  period = "year",
  onPeriodChange,
  revenueData = {}, // { monthly: [], yearly: [], projects: [] }
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const shortMonths = [
    "J",
    "F",
    "M",
    "A",
    "M",
    "J",
    "J",
    "A",
    "S",
    "O",
    "N",
    "D",
  ];

  // Get current year
  const currentYear = new Date().getFullYear();

  // Process data based on period
  const getChartData = () => {
    if (
      period === "all" &&
      revenueData.yearly &&
      revenueData.yearly.length > 0
    ) {
      return revenueData.yearly;
    } else if (
      (period === "year" || period === "6months") &&
      revenueData.monthly &&
      revenueData.monthly.length > 0
    ) {
      if (period === "6months") {
        const currentMonth = new Date().getMonth();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12;
          last6Months.push(
            revenueData.monthly[monthIndex] || {
              month: months[monthIndex],
              monthIndex,
              total: 0,
              paid: 0,
              pending: 0,
              projectCount: 0,
              projects: [],
            }
          );
        }
        return last6Months;
      }
      return revenueData.monthly;
    }
    return [];
  };

  const chartData = getChartData();
  const maxValue = Math.max(
    ...chartData.map((d) => d.total || d.value || 0),
    1
  );

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const formatCurrencyFull = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleBarClick = (item, index) => {
    setSelectedData({
      ...item,
      index,
      label:
        period === "all"
          ? item.year
          : period === "6months"
            ? item.month
            : months[index],
    });
    setShowModal(true);
  };

  const getBarLabel = (item, index) => {
    if (period === "all") return item.year;
    if (period === "6months")
      return item.month?.substring(0, 3) || shortMonths[item.monthIndex];
    return shortMonths[index];
  };

  // Calculate totals
  const totalRevenue = chartData.reduce(
    (sum, d) => sum + (d.total || d.value || 0),
    0
  );
  const totalPaid = chartData.reduce((sum, d) => sum + (d.paid || 0), 0);
  const totalProjects = chartData.reduce(
    (sum, d) => sum + (d.projectCount || 0),
    0
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          )}
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        <select
          value={period}
          onChange={(e) => onPeriodChange && onPeriodChange(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-neon-green/50 cursor-pointer"
        >
          <option value="6months">Last 6 Months</option>
          <option value="year">This Year ({currentYear})</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {type === "bar" && (
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="min-w-[400px] h-64 flex items-end justify-between gap-2 px-2 sm:px-4">
            {chartData.map((value, i) => {
              const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
              const hasData = value > 0;

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  onClick={() => handleBarClick(item, i)}
                >
                  <div className="relative w-full flex justify-center">
                    {/* Bar */}
                    <div
                      className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${hasData
                          ? "bg-gradient-to-t from-neon-green/60 to-neon-blue/60 hover:from-neon-green hover:to-neon-blue group-hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                          : "bg-white/10"
                        }`}
                      style={{ height: `${Math.max(height * 2, 8)}px` }}
                    />

                    {/* Tooltip on hover */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-2 bg-dark-600 border border-white/10 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      <p className="font-semibold text-neon-green">
                        {formatCurrency(value)}
                      </p>
                      <p className="text-gray-400">
                        {item.projectCount || 0} projects
                      </p>
                      {item.paid > 0 && (
                        <p className="text-green-400">
                          Paid: {formatCurrency(item.paid)}
                        </p>
                      )}
                    </div>

                    {/* Click indicator */}
                    {hasData && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-neon-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                    )}
                  </div>

                  {/* Label */}
                  <span className="text-xs text-gray-500 group-hover:text-white transition-colors">
                    {getBarLabel(item, i)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-green to-neon-blue" />
          <span className="text-xs text-gray-400">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-400">Received</span>
        </div>
        <p className="text-xs text-gray-500">Click bar for details</p>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Revenue Details - ${selectedData?.label || ""}`}
      >
        {selectedData && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
                <p className="text-xs text-gray-400 uppercase">Total Revenue</p>
                <p className="text-2xl font-bold text-neon-green mt-1">
                  {formatCurrencyFull(
                    selectedData.total || selectedData.value || 0
                  )}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <p className="text-xs text-gray-400 uppercase">Received</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {formatCurrencyFull(selectedData.paid || 0)}
                </p>
              </div>
            </div>

            {/* Pending */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Pending Amount
                  </p>
                  <p className="text-xl font-bold text-amber-400 mt-1">
                    {formatCurrencyFull(selectedData.pending || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Collection Rate</p>
                  <p className="text-lg font-bold text-white">
                    {selectedData.total > 0
                      ? Math.round(
                        ((selectedData.paid || 0) / selectedData.total) * 100
                      )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Projects Count */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed Projects</span>
                <span className="text-white font-bold text-lg">
                  {selectedData.projectCount || 0}
                </span>
              </div>
            </div>

            {/* Projects List */}
            {selectedData.projects && selectedData.projects.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-white font-medium">Projects</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {selectedData.projects.map((project, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm truncate">
                            {project.name || project.projectName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {project.client || "No client"}
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <p className="text-neon-green font-semibold text-sm">
                            {formatCurrencyFull(project.budget)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Paid: {formatCurrency(project.amountPaid || 0)}
                          </p>
                        </div>
                      </div>
                      {/* Payment Progress */}
                      <div className="mt-2">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all"
                            style={{
                              width: `${Math.min(((project.amountPaid || 0) / (project.budget || 1)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No projects in this period</p>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChartCard;
