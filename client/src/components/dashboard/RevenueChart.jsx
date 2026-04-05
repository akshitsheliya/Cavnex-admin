import React from "react";
import Card from "../common/Card";
import Dropdown from "../common/Dropdown";
import { formatCurrency } from "../../utils/dashboardHelpers";

const RevenueChart = ({
  chartData,
  chartPeriod,
  onPeriodChange,
  onBarClick,
  chartMaxValue,
  chartTotalRevenue,
  chartTotalPaid,
  chartTotalProjects,
}) => {
  const currentYear = new Date().getFullYear();

  const periodOptions = [
    { value: "6months", label: "Last 6 Months" },
    { value: "year", label: `This Year (${currentYear})` },
    { value: "all", label: "All Time" },
  ];

  const getBarLabel = (item) => {
    if (chartPeriod === "all") return item.year || item.label;
    if (chartPeriod === "6months")
      return item.shortMonth || item.month?.substring(0, 1);
    return item.month?.substring(0, 1) || "";
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
          <p className="text-sm text-gray-400">
            Revenue from completed projects
          </p>
        </div>
        <Dropdown
          value={chartPeriod}
          onChange={onPeriodChange}
          options={periodOptions}
          placeholder="Select Period"
          variant="minimal"
          size="sm"
          className="min-w-[160px]"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-xs text-gray-400">Total Revenue</p>
          <p className="text-lg font-bold text-neon-green">
            {formatCurrency(chartTotalRevenue)}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-xs text-gray-400">Received</p>
          <p className="text-lg font-bold text-green-400">
            {formatCurrency(chartTotalPaid)}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-xs text-gray-400">Projects</p>
          <p className="text-lg font-bold text-white">{chartTotalProjects}</p>
        </div>
      </div>

      {chartData.length === 0 ||
      chartData.every((d) => (d.total || 0) === 0) ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-gray-400">No revenue data available</p>
            <p className="text-gray-500 text-sm mt-1">
              Complete projects to see revenue
            </p>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 px-2">
          {chartData.map((item, i) => {
            const value = item.total || 0;
            const height =
              chartMaxValue > 0 ? (value / chartMaxValue) * 100 : 0;
            const hasData = value > 0;

            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                onClick={() => onBarClick(item, i)}
              >
                <div className="relative w-full flex justify-center">
                  <div
                    className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${
                      hasData
                        ? "bg-gradient-to-t from-neon-green/60 to-neon-blue/60 hover:from-neon-green hover:to-neon-blue group-hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                    style={{ height: `${Math.max(height * 2, 8)}px` }}
                  />
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 px-3 py-2 bg-dark-600 border border-white/10 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
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
                    <p className="text-gray-500 mt-1 text-[10px]">
                      Click for details
                    </p>
                  </div>
                  {hasData && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-neon-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                  )}
                </div>
                <span className="text-xs text-gray-500 group-hover:text-white transition-colors">
                  {getBarLabel(item)}
                </span>
              </div>
            );
          })}
        </div>
      )}

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
    </Card>
  );
};

export default RevenueChart;
