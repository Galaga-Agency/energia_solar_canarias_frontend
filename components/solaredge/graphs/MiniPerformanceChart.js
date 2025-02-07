import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import MiniGraphCustomTooltip from "../tooltips/MiniGraphCustomTooltip";

export const MiniPerformanceChart = ({ data }) => {
  const lightModeId = "colorLight";
  const darkModeId = "colorDark";

  return (
    <div className="flex-1 h-24 ml-4 -mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            {/* Light mode gradient */}
            <linearGradient id={lightModeId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(0, 44, 63)" />
              <stop offset="100%" stopColor="rgb(201, 202, 202)" />
            </linearGradient>
            {/* Dark mode gradient */}
            <linearGradient id={darkModeId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(255, 213, 122)" />
              <stop offset="100%" stopColor="rgb(0, 44, 63)" />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "#888888" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#888888" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value} kWh`}
          />
          <Tooltip content={<MiniGraphCustomTooltip />} />

          {/* Light mode area - hidden in dark mode */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill={`url(#${lightModeId})`}
            className="block dark:hidden"
          />

          {/* Dark mode area - hidden in light mode */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill={`url(#${darkModeId})`}
            className="hidden dark:block"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniPerformanceChart;
