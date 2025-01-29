import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";

const getColors = (theme) => ({
  batteria: theme === "dark" ? "#BDBFC080" : "#0B2738",
  sistemaFV: theme === "dark" ? "#FFD57B" : "rgb(255, 213, 122)",
  red: theme === "dark" ? "#A48D67" : "#AD936A",
  genset: theme === "dark" ? "#BDBFC0" : "#BDBFC070",
});

const ConsumptionTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);
  const COLORS = getColors(theme);

  if (!active || !payload || !payload.length) return null;

  // Get the first payload item
  const firstPayload = payload[0];
  const data = firstPayload?.payload || {};

  // Check if this is a pie chart tooltip (has name and value properties)
  if (data.name && typeof data.value !== "undefined") {
    return (
      <div
        className={`z-[999] p-4 rounded-lg shadow-lg ${
          theme === "dark"
            ? "bg-slate-800/95 text-gray-100 border border-gray-700"
            : "bg-white/95 text-gray-800 border border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center gap-4">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            ></span>
            <span>{data.name}:</span>
          </span>
          <span className="font-medium">{data.value.toFixed(2)} kWh</span>
        </div>
        {typeof data.percentage !== "undefined" && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {data.percentage.toFixed(1)}%
          </div>
        )}
      </div>
    );
  }

  // Regular chart tooltip
  return (
    <div
      className={`z-[999] p-4 rounded-lg shadow-lg ${
        theme === "dark"
          ? "bg-slate-800/95 text-gray-100 border border-gray-700"
          : "bg-white/95 text-gray-800 border border-gray-200"
      }`}
    >
      {data.fromBattery !== 0 && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.batteria }}
            ></span>
            <span>{t("Desde la batería")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.fromBattery).toFixed(2)} kWh
          </span>
        </div>
      )}

      {data.fromPV !== 0 && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.sistemaFV }}
            ></span>
            <span>{t("Desde el sistema FV")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.fromPV).toFixed(2)} kWh
          </span>
        </div>
      )}

      {data.fromGrid !== 0 && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.red }}
            ></span>
            <span>{t("Desde la red")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.fromGrid).toFixed(2)} kWh
          </span>
        </div>
      )}

      {data.fromGenset !== 0 && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.genset }}
            ></span>
            <span>{t("Desde el grupo electrógeno")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.fromGenset).toFixed(2)} kWh
          </span>
        </div>
      )}
    </div>
  );
};

export default ConsumptionTooltip;
