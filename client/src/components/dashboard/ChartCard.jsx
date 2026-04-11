import React, { useState } from "react";
import { Modal, Select } from "antd";
import {
  formatCurrency,
  formatCurrencyFull,
} from "../../../utils/dashboardHelpers";

const ChartCard = ({
  title,
  subtitle,
  data = [],
  type = "bar",
  period = "year",
  onPeriodChange,
  revenueData = {},
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
  const currentYear = new Date().getFullYear();

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div className="flex-1">
          {title && (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          )}
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        <Select
          value={period}
          onChange={(value) => onPeriodChange && onPeriodChange(value)}
          className="w-full sm:w-auto min-w-[160px]"
          options={[
            { value: "6months", label: "Last 6 Months" },
            { value: "year", label: `This Year (${currentYear})` },
            { value: "all", label: "All Time" },
          ]}
        />
      </div>

      {type === "bar" && (
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[400px] h-64 flex items-end justify-between gap-2 px-2 sm:px-4">
            {chartData.map((item, i) => {
              const value = item.total || item.value || 0;
              const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
              const hasData = value > 0;

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  onClick={() => handleBarClick(item, i)}
                >
                  <div className="relative w-full flex justify-center">
                    <div
                      className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${
                        hasData
                          ? "bg-gradient-to-t from-neon-green/60 to-neon-blue/60 hover:from-neon-green hover:to-neon-blue group-hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                          : "bg-white/10"
                      }`}
                      style={{ height: `${Math.max(height * 2, 8)}px` }}
                    />

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

                    {hasData && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-neon-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                    )}
                  </div>

                  <span className="text-xs text-gray-500 group-hover:text-white transition-colors">
                    {getBarLabel(item, i)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex-shrink-0" />
          <span className="text-xs text-gray-400">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
          <span className="text-xs text-gray-400">Received</span>
        </div>
        <p className="text-xs text-gray-500">Click bar for details</p>
      </div>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        title={`Revenue Details - ${selectedData?.label || ""}`}
        footer={null}
        centered
        width={700}
      >
        {selectedData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
                <p className="text-xs text-gray-400 uppercase">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-neon-green mt-1 break-words">
                  {formatCurrencyFull(
                    selectedData.total || selectedData.value || 0
                  )}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <p className="text-xs text-gray-400 uppercase">Received</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400 mt-1 break-words">
                  {formatCurrencyFull(selectedData.paid || 0)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase">
                    Pending Amount
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-amber-400 mt-1 break-words">
                    {formatCurrencyFull(selectedData.pending || 0)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-400">Collection Rate</p>
                  <p className="text-base sm:text-lg font-bold text-white">
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

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed Projects</span>
                <span className="text-white font-bold text-lg">
                  {selectedData.projectCount || 0}
                </span>
              </div>
            </div>

            {selectedData.projects && selectedData.projects.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-white font-medium">Projects</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {selectedData.projects.map((project, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm break-words">
                            {project.name || project.projectName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {project.client || "No client"}
                          </p>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <p className="text-neon-green font-semibold text-sm break-words">
                            {formatCurrencyFull(project.budget)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Paid: {formatCurrency(project.amountPaid || 0)}
                          </p>
                        </div>
                      </div>
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
