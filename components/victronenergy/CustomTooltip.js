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
  const COLORS = getColors(theme); // Uses updated color palette

  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload || {};

  const formatNumber = (value, unit) =>
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

      {/* Power Section */}
      {(data.consumption !== undefined || data.solar !== undefined) && (
        <div className="mb-3">
          <div className="font-medium mb-2 text-sm opacity-75">
            {t("Energía")}
          </div>
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
        </div>
      )}

      {/* Battery Section */}
      {data.battery !== undefined && (
        <div className="mb-3">
          <div className="font-medium mb-2 text-sm opacity-75">
            {t("Estado Batería")}
          </div>
          {renderSection(t("Actual"), data.battery, COLORS.batteryAverage, "%")}
          <div
            className="mt-1 pl-2 border-l-2"
            style={{ borderColor: COLORS.battery }}
          >
            {renderSection(
              t("Mínimo"),
              data.batteryStateMin,
              COLORS.batteryMin,
              "%"
            )}
            {renderSection(
              t("Máximo"),
              data.batteryStateMax,
              COLORS.batteryMax,
              "%"
            )}
          </div>
        </div>
      )}

      {/* Forecast Section */}
      {(data.forecastSolar !== undefined ||
        data.forecastConsumption !== undefined) && (
        <div>
          <div className="font-medium mb-2 text-sm opacity-75">
            {t("Previsión")}
          </div>
          {data.forecastSolar !== undefined &&
            renderSection(
              t("Solar"),
              data.forecastSolar,
              COLORS.solarProduction,
              "kWh"
            )}
          {data.forecastConsumption !== undefined &&
            renderSection(
              t("Consumo"),
              data.forecastConsumption,
              COLORS.consumption,
              "kWh"
            )}
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
