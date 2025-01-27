import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { format } from "date-fns";

const getColors = (theme) => ({
  consumption: theme === "dark" ? "#FFD57B" : "#BDBFC0",
  solar: theme === "dark" ? "#BDBFC0" : "#0B2738",
  solarPredicted: theme === "dark" ? "#657880" : "#FFD57B",
  consumptionPredicted: theme === "dark" ? "#A48D67" : "#9CA3AF",
  battery: theme === "dark" ? "#9CA3AF" : "#AD936A",
});

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);
  const COLORS = getColors(theme);

  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload || {};

  // Helper function for number formatting
  const formatNumber = (value, unit) =>
    typeof value !== "undefined" && value !== null
      ? `${Number(value).toFixed(2)} ${unit}`
      : "-";

  const renderSection = (label, value, color, unit) => (
    <div className="flex justify-between items-center gap-4">
      <span style={{ color }}>{label}:</span>
      <span
        className={`font-medium ${
          theme === "dark" ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {formatNumber(value, unit)}
      </span>
    </div>
  );

  return (
    <div
      className={`z-[999] p-4 rounded-lg shadow-lg ${
        theme === "dark"
          ? "bg-slate-800 text-gray-100 border border-gray-700"
          : "bg-white text-gray-800 border border-gray-200"
      }`}
    >
      {/* Timestamp */}
      <div className="font-medium mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        {format(new Date(label), "HH:mm, dd MMM yyyy")}
      </div>

      {/* Power Section */}
      {(data.consumption !== undefined || data.solar !== undefined) && (
        <div className="mb-3">
          <div className="font-medium mb-1">{t("Energía")}</div>
          {data.consumption !== undefined &&
            renderSection(
              t("Consumo"),
              data.consumption,
              COLORS.consumption,
              "kWh"
            )}
          {data.solar !== undefined &&
            renderSection(t("Solar"), data.solar, COLORS.solar, "kWh")}
        </div>
      )}

      {/* Battery Section */}
      {data.battery !== undefined && (
        <div className="mb-3">
          <div className="font-medium mb-1">{t("Estado Batería")}</div>
          {renderSection(t("Actual"), data.battery, COLORS.battery, "%")}
          <div className="text-sm mt-1">
            {renderSection(
              t("Mínimo"),
              data.batteryStateMin,
              COLORS.battery,
              "%"
            )}
            {renderSection(
              t("Máximo"),
              data.batteryStateMax,
              COLORS.battery,
              "%"
            )}
          </div>
        </div>
      )}

      {/* Voltage Section */}
      {/* {data.batteryVoltage !== undefined && (
        <div className="mb-3">
          <div className="font-medium mb-1">{t("Tensión Batería")}</div>
          {renderSection(t("Actual"), data.batteryVoltage, COLORS.battery, "V")}
          <div className="text-sm mt-1">
            {renderSection(
              t("Mínimo"),
              data.batteryVoltageMin,
              COLORS.battery,
              "V"
            )}
            {renderSection(
              t("Máximo"),
              data.batteryVoltageMax,
              COLORS.battery,
              "V"
            )}
          </div>
        </div>
      )} */}

      {/* Forecast Section */}
      {(data.forecastSolar !== undefined ||
        data.forecastConsumption !== undefined) && (
        <div>
          <div className="font-medium mb-1">{t("Previsión")}</div>
          {data.forecastSolar !== undefined &&
            renderSection(
              t("Solar"),
              data.forecastSolar,
              COLORS.solarPredicted,
              "kWh"
            )}
          {data.forecastConsumption !== undefined &&
            renderSection(
              t("Consumo"),
              data.forecastConsumption,
              COLORS.consumptionPredicted,
              "kWh"
            )}
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
