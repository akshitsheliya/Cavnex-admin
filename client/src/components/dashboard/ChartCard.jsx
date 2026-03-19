import React from "react";

const ChartCard = ({
  title,
  subtitle,
  data = [],
  type = "bar",
  period = "6months",
  onPeriodChange,
}) => {
  const defaultData = [65, 45, 75, 50, 85, 60, 90, 70, 95, 80, 88, 92];
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  const chartData = data.length > 0 ? data : defaultData;
  const maxValue = Math.max(...chartData, 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        <select
          value={period}
          onChange={(e) => onPeriodChange && onPeriodChange(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-neon-green/50 cursor-pointer"
        >
          <option value="6months">Last 6 Months</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {type === "bar" && (
        <div className="h-64 flex items-end justify-between gap-2 px-4">
          {chartData.map((value, i) => {
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <div className="relative w-full">
                  <div
                    className="w-full bg-gradient-to-t from-neon-green/50 to-neon-blue/50 rounded-t-lg transition-all duration-500 hover:from-neon-green hover:to-neon-blue cursor-pointer group-hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                    style={{ height: `${Math.max(height * 2.5, 4)}px` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-600 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {value}%
                  </div>
                </div>
                <span className="text-xs text-gray-500">{months[i]}</span>
              </div>
            );
          })}
        </div>
      )}

      {type === "line" && (
        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
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
            </defs>

            <path
              d={`M 0 ${200 - chartData[0] * 2} ${chartData.map((d, i) => `L ${(i * 400) / (chartData.length - 1)} ${200 - d * 2}`).join(" ")} L 400 200 L 0 200 Z`}
              fill="url(#areaGradient)"
            />

            <path
              d={`M 0 ${200 - chartData[0] * 2} ${chartData.map((d, i) => `L ${(i * 400) / (chartData.length - 1)} ${200 - d * 2}`).join(" ")}`}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {chartData.map((d, i) => (
              <circle
                key={i}
                cx={(i * 400) / (chartData.length - 1)}
                cy={200 - d * 2}
                r="5"
                fill="#000"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                className="cursor-pointer hover:r-8 transition-all"
              />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
};

export default ChartCard;
