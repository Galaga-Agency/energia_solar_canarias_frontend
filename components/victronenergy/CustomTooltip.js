import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { format } from "date-fns";

const getColors = (theme) => ({
  consumption: theme === "dark" ? "#BDBFC080" : "#0B2738",
  solarProduction: theme === "dark" ? "#AD936A" : "#BDBFC0",
  export: theme === "dark" ? "#657880" : "#FFD57B",
  import: theme === "dark" ? "#9CA3AF" : "#BDBFC0",
  batteryAverage: theme === "dark" ? "#FFD57B" : "rgb(255, 213, 122)",
  batteryMin: theme === "dark" ? "#BDBFC0" : "#BDBFC070",
  batteryMax: theme === "dark" ? "#A48D67" : "#AD936A",
});

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);
  const COLORS = getColors(theme);

  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload || {};

  // Define known keys to avoid breaking other graphs
  const knownKeys = [
    "consumption",
    "solar",
    "battery",
    "batteryStateMin",
    "batteryStateMax",
    "forecastSolar",
    "forecastConsumption",
    "fromBattery",
    "fromPV",
    "grid_history_to",
    "grid_history_from",
  ];

  const formatNumber = (value, unit = "") =>
    typeof value !== "undefined" && value !== null
      ? `${Number(value).toFixed(2)} ${unit}`
      : "-";

  const renderSection = (label, value, color, unit) => (
    <div className="flex justify-between items-center gap-4 py-1">
      <span className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        ></span>
        <span>{label}:</span>
      </span>
      <span className="font-medium">{formatNumber(value, unit)}</span>
    </div>
  );

  return (
    <div
      className={`z-[999] p-4 rounded-lg shadow-lg ${
        theme === "dark"
          ? "bg-slate-800/95 text-gray-100 border border-gray-700"
          : "bg-white/95 text-gray-800 border border-gray-200"
      }`}
    >
      {/* Timestamp */}
      <div className="font-medium mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        {format(new Date(label), "HH:mm, dd MMM yyyy")}
      </div>

      {/* Keep original structure for known graphs */}
      {knownKeys.some((key) => key in data) ? (
        <>
          {data.consumption !== undefined &&
            renderSection(
              t("Consumo"),
              data.consumption,
              COLORS.consumption,
              "kWh"
            )}
          {data.solar !== undefined &&
            renderSection(
              t("Solar"),
              data.solar,
              COLORS.solarProduction,
              "kWh"
            )}
          {data.fromBattery !== undefined &&
            renderSection(
              t("Desde la batería"),
              data.fromBattery,
              COLORS.batteryAverage,
              "kWh"
            )}
          {data.fromPV !== undefined &&
            renderSection(
              t("Desde el sistema FV"),
              data.fromPV,
              COLORS.solarProduction,
              "kWh"
            )}
          {data.battery !== undefined &&
            renderSection(
              t("Batería"),
              data.battery,
              COLORS.batteryAverage,
              "%"
            )}
          {data.batteryStateMin !== undefined &&
            renderSection(
              t("Batería Min"),
              data.batteryStateMin,
              COLORS.batteryMin,
              "%"
            )}
          {data.batteryStateMax !== undefined &&
            renderSection(
              t("Batería Max"),
              data.batteryStateMax,
              COLORS.batteryMax,
              "%"
            )}
          {data.forecastSolar !== undefined &&
            renderSection(
              t("Solar previsto"),
              data.forecastSolar,
              COLORS.solarProduction,
              "kWh"
            )}
          {data.forecastConsumption !== undefined &&
            renderSection(
              t("Consumo previsto"),
              data.forecastConsumption,
              COLORS.consumption,
              "kWh"
            )}
          {data.grid_history_to !== undefined &&
            renderSection(
              t("Historial Red (To)"),
              data.grid_history_to,
              COLORS.import,
              "kWh"
            )}
          {data.grid_history_from !== undefined &&
            renderSection(
              t("Historial Red (From)"),
              data.grid_history_from,
              COLORS.export,
              "kWh"
            )}
        </>
      ) : (
        // If unknown data appears, show a generic tooltip
        Object.keys(data).map((key) =>
          renderSection(t(key), data[key], COLORS[key] || "#ccc", "kWh")
        )
      )}
    </div>
  );
};

export default CustomTooltip;
