import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { format } from "date-fns";

const getColors = (theme) => ({
  consumption: theme === "dark" ? "#BDBFC080" : "#0B2738",
  solarProduction: theme === "dark" ? "#FFD57B" : "rgb(255, 213, 122)",
  export: theme === "dark" ? "#657880" : "#FFD57B",
  import: theme === "dark" ? "#9CA3AF" : "#BDBFC0",
  batteryAverage: theme === "dark" ? "#BDBFC0" : "#BDBFC070",
  batteryMin: theme === "dark" ? "#AD936A" : "#BDBFC0",
  batteryMax: theme === "dark" ? "#A48D67" : "#AD936A",
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
