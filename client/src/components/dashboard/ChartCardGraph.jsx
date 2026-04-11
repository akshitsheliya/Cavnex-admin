import React, { useState, useRef } from "react";
import { Modal, Select } from "antd";
import {
  formatCurrency,
  formatCurrencyFull,
} from "../../../utils/dashboardHelpers";

const ChartCardGraph = ({
  title,
  subtitle,
  data = [],
  period = "year",
  onPeriodChange,
  revenueData = {},
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const svgRef = useRef(null);

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

  const width = 100;
  const height = 50;
  const padding = { top: 5, right: 5, bottom: 8, left: 5 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getPath = () => {
    if (chartData.length === 0) return "";
    const points = chartData.map((d, i) => {
      const x = padding.left + (i / (chartData.length - 1 || 1)) * chartWidth;
      const value = d.total || d.value || 0;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      return { x, y };
    });
    return points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");
  };

  const getAreaPath = () => {
    if (chartData.length === 0) return "";
    const linePath = getPath();
    return `${linePath} L ${padding.left + chartWidth} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;
  };

  const getPointPosition = (index) => {
    const x = padding.left + (index / (chartData.length - 1 || 1)) * chartWidth;
    const value = chartData[index]?.total || chartData[index]?.value || 0;
    const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
    return { x, y };
  };

  const handlePointClick = (item, index) => {
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

  const getLabel = (item, index) => {
    if (period === "all") return item.year;
    if (period === "6months") return item.month?.substring(0, 1);
    return months[index]?.substring(0, 1);
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-xs text-gray-400">Total Revenue</p>
          <p className="text-base sm:text-lg font-bold text-neon-green break-words">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-xs text-gray-400">Received</p>
          <p className="text-base sm:text-lg font-bold text-green-400 break-words">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-xs text-gray-400">Projects</p>
          <p className="text-base sm:text-lg font-bold text-white">
            {totalProjects}
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
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
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <p className="text-gray-400">No revenue data available</p>
            <p className="text-gray-500 text-sm mt-1">
              Complete projects to see trends
            </p>
          </div>
        </div>
      ) : (
        <div className="relative h-64">
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00ff88" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>
              <linearGradient
                id="areaGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(0,255,136,0.3)" />
                <stop offset="100%" stopColor="rgba(0,255,136,0)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1={padding.left}
                y1={padding.top + chartHeight * (1 - ratio)}
                x2={padding.left + chartWidth}
                y2={padding.top + chartHeight * (1 - ratio)}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.1"
              />
            ))}

            <path d={getAreaPath()} fill="url(#areaGradient)" />

            <path
              d={getPath()}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />

            {chartData.map((item, i) => {
              const { x, y } = getPointPosition(i);
              const value = item.total || item.value || 0;
              const hasData = value > 0;

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="3"
                    fill="transparent"
                    className="cursor-pointer"
                    onClick={() => handlePointClick(item, i)}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={hoveredIndex === i ? "1.5" : "1"}
                    fill={hasData ? "#000" : "rgba(255,255,255,0.2)"}
                    stroke={
                      hasData ? "url(#lineGradient)" : "rgba(255,255,255,0.3)"
                    }
                    strokeWidth="0.3"
                    className="transition-all duration-200 cursor-pointer"
                    onClick={() => handlePointClick(item, i)}
                  />
                  {hoveredIndex === i && hasData && (
                    <circle
                      cx={x}
                      cy={y}
                      r="2.5"
                      fill="none"
                      stroke="#00ff88"
                      strokeWidth="0.2"
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
            {chartData.map((item, i) => (
              <span
                key={i}
                className={`text-xs transition-colors cursor-pointer ${
                  hoveredIndex === i ? "text-neon-green" : "text-gray-500"
                }`}
                onClick={() => handlePointClick(item, i)}
              >
                {getLabel(item, i)}
              </span>
            ))}
          </div>

          {hoveredIndex !== null && chartData[hoveredIndex] && (
            <div
              className="absolute bg-dark-600 border border-white/10 rounded-lg px-3 py-2 text-xs pointer-events-none z-10 transform -translate-x-1/2"
              style={{
                left: `${(hoveredIndex / (chartData.length - 1 || 1)) * 100}%`,
                top: "20px",
              }}
            >
              <p className="font-semibold text-neon-green">
                {formatCurrency(
                  chartData[hoveredIndex].total ||
                    chartData[hoveredIndex].value ||
                    0
                )}
              </p>
              <p className="text-gray-400">
                {chartData[hoveredIndex].projectCount || 0} projects
              </p>
              {chartData[hoveredIndex].paid > 0 && (
                <p className="text-green-400">
                  Paid: {formatCurrency(chartData[hoveredIndex].paid)}
                </p>
              )}
              <p className="text-gray-500 mt-1">Click for details</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-gradient-to-r from-neon-green to-neon-blue rounded flex-shrink-0" />
          <span className="text-xs text-gray-400">Revenue Trend</span>
        </div>
        <p className="text-xs text-gray-500">Click point for details</p>
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
                            className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
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

export default ChartCardGraph;
