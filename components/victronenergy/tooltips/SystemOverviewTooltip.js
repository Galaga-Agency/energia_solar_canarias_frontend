import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { format } from "date-fns";

const getColors = (theme) => ({
  consumption:
    theme === "dark"
      ? "rgba(189, 191, 192, 0.8)" // More vibrant gray with slight opacity
      : "rgba(156, 163, 175, 0.3)", // Softer gray for light mode

  solarProduction:
    theme === "dark"
      ? "rgba(255, 213, 122, 0.8)" // Brighter, more saturated yellow
      : "rgba(255, 213, 122, 0.8)", // Consistent yellow with slight opacity

  export:
    theme === "dark"
      ? "rgba(101, 120, 128, 0.9)" // Deeper, more defined teal-gray
      : "#FFD57B",

  import:
    theme === "dark"
      ? "rgba(156, 163, 175, 0.9)" // More defined gray
      : "#BDBFC0",

  batteryAverage:
    theme === "dark"
      ? "rgba(255, 213, 122, 1)" // Bright, full opacity yellow
      : "#0B2738",

  batteryMin:
    theme === "dark"
      ? "rgba(189, 191, 192, 1)" // Bright, full opacity gray
      : "#BDBFC0",

  batteryMax:
    theme === "dark"
      ? "rgba(173, 147, 106, 1)" // Richer, more defined brown
      : "#AD936A",
});

const SystemOverviewTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);
  const COLORS = getColors(theme);

  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload || {};

  return (
    <div
      className={`z-[999] p-4 rounded-lg shadow-lg ${
        theme === "dark"
          ? "bg-slate-800/95 text-gray-100 border border-gray-700"
          : "bg-white/95 text-gray-800 border border-gray-200"
      }`}
    >
      <div className="font-medium mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        {format(new Date(label), "HH:mm, dd MMM yyyy")}
      </div>

      {data.consumption !== undefined && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.consumption }}
            ></span>
            <span>{t("Consumo")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.consumption).toFixed(2)} kWh
          </span>
        </div>
      )}

      {data.solar !== undefined && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.solarProduction }}
            ></span>
            <span>{t("Solar")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.solar).toFixed(2)} kWh
          </span>
        </div>
      )}

      {data.battery !== undefined && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.batteryAverage }}
            ></span>
            <span>{t("Batería Promedio")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.battery).toFixed(2)}%
          </span>
        </div>
      )}

      {data.batteryStateMin !== undefined && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.batteryMin }}
            ></span>
            <span>{t("Batería Mín")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.batteryStateMin).toFixed(2)}%
          </span>
        </div>
      )}

      {data.batteryStateMax !== undefined && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.batteryMax }}
            ></span>
            <span>{t("Batería Máx")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.batteryStateMax).toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default SystemOverviewTooltip;
