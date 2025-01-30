import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { format } from "date-fns";

const getColors = (theme) => ({
  toBattery: theme === "dark" ? "#FFD57B" : "#FFD57B",
  directUse: theme === "dark" ? "#AD936A" : "#BDBFC0",
});

const GeneratorTooltip = ({ active, payload, label }) => {
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

  const total = (data.toBattery || 0) + (data.directUse || 0);

  // Regular chart tooltip
  return (
    <div
      className={`z-[999] p-4 rounded-lg shadow-lg ${
        theme === "dark"
          ? "bg-slate-800/95 text-gray-100 border border-gray-700"
          : "bg-white/95 text-gray-800 border border-gray-200"
      }`}
    >
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
        {format(new Date(data.timestamp), "dd/MM/yyyy HH:mm")}
      </div>

      {data.toBattery !== 0 && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.toBattery }}
            ></span>
            <span>{t("A la batería")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.toBattery).toFixed(2)} kWh
          </span>
        </div>
      )}

      {data.directUse !== 0 && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.directUse }}
            ></span>
            <span>{t("Uso directo")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.directUse).toFixed(2)} kWh
          </span>
        </div>
      )}

      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">{t("Total")}:</span>
        <span className="font-medium">{total.toFixed(2)} kWh</span>
      </div>
    </div>
  );
};

export default GeneratorTooltip;
