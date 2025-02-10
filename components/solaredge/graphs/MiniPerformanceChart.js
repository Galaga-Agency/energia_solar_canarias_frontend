import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import MiniGraphTooltip from "../tooltips/MiniGraphTooltip";
import { useTranslation } from "react-i18next";

export const MiniPerformanceChart = ({
  data,
  isLoading,
  error,
  selectedRange,
}) => {
  const lightModeId = "colorLight";
  const darkModeId = "colorDark";
  const { t } = useTranslation();

  const formatXAxis = (timeStr) => {
    if (!timeStr) return "";

    try {
      const date = new Date(timeStr);
      const padNumber = (num) => String(num).padStart(2, "0");

      // Check if the date is actually yesterday
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const isActuallyYesterday =
        date.toISOString().split("T")[0] ===
        yesterday.toISOString().split("T")[0];

      if (selectedRange?.toUpperCase() === "YESTERDAY" && isActuallyYesterday) {
        return `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
      }

      // For other ranges or non-yesterday dates
      switch (selectedRange?.toUpperCase()) {
        case "YEAR":
          return date
            .toLocaleDateString("es", { month: "short" })
            .toUpperCase();
        case "WEEK":
        case "MONTH":
          return `${padNumber(date.getUTCDate())}/${padNumber(
            date.getUTCMonth() + 1
          )}`;
        default:
          return `${padNumber(date.getUTCDate())}/${padNumber(
            date.getUTCMonth() + 1
          )}`;
      }
    } catch (e) {
      console.error("Date formatting error:", e);
      return "";
    }
  };

  const { chartData } = useMemo(() => {
    if (!data?.chartEnergy || Object.keys(data.chartEnergy).length === 0) {
      return { chartData: [] };
    }

    const transformedData = Object.entries(data.chartEnergy)
      .map(([time, value]) => ({
        time,
        value: typeof value === "string" ? parseFloat(value) : value,
      }))
      .filter((item) => !isNaN(item.value))
      .sort((a, b) => new Date(a.time) - new Date(b.time));

    return { chartData: transformedData };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex-1 h-24 ml-4 -mt-2 flex items-center justify-center text-gray-500">
        {t("loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 h-24 ml-4 -mt-2 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!chartData?.length) {
    return (
      <div className="flex-1 h-24 ml-4 -mt-2 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="flex-1 h-24 ml-4 -mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={lightModeId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(0, 44, 63)" stopOpacity={0.5} />
              <stop
                offset="100%"
                stopColor="rgb(201, 202, 202)"
                stopOpacity={0.5}
              />
            </linearGradient>
            <linearGradient id={darkModeId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="rgb(255, 213, 122)"
                stopOpacity={0.5}
              />
              <stop
                offset="100%"
                stopColor="rgb(0, 44, 63)"
                stopOpacity={0.5}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 10, fill: "#888888" }}
            tickLine={false}
            axisLine={false}
            minTickGap={5}
            interval={selectedRange === "YESTERDAY" ? 3 : "preserveStartEnd"}
            angle={-35}
            textAnchor="end"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#888888" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value} kWh`}
          />
          <Tooltip content={<MiniGraphTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fillOpacity={1}
            fill={`url(#${lightModeId})`}
            className="block dark:hidden"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fillOpacity={1}
            fill={`url(#${darkModeId})`}
            className="hidden dark:block"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniPerformanceChart;
