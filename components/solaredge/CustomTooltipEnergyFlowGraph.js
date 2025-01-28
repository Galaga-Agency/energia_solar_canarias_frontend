import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "@/store/slices/themeSlice";
import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const getColors = (theme) => ({
  consumption: theme === "dark" ? "#BDBFC0" : "#0B2738",
  solarProduction: theme === "dark" ? "#657880" : "#FFD57B",
  export: theme === "dark" ? "#A48D67" : "#9CA3AF",
  import: theme === "dark" ? "#9CA3AF" : "#AD936A",
  selfConsumption: theme === "dark" ? "#FFD57B" : "#BDBFC0",
});

const formatDateSafely = (dateStr) => {
  try {
    const date =
      typeof dateStr === "string" ? parseISO(dateStr) : new Date(dateStr);
    if (!isValid(date)) return "Invalid Date";
    return format(date, "HH:mm, dd MMM yyyy", { locale: es });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

const CustomTooltipEnergyFlowGraph = ({ active, payload, label }) => {
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);
  const COLORS = getColors(theme);

  if (!active || !payload || !payload.length) return null;

  const data = payload?.[0]?.payload || {};

  const formatNumber = (value) =>
    typeof value !== "undefined" && value !== null
      ? `${Number(value).toFixed(2)} kW`
      : "-";

  const renderSection = (label, value, color) => (
    <div className="flex justify-between items-center gap-4 py-1">
      <span className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span>{label}:</span>
      </span>
      <span className="font-medium">{formatNumber(value)}</span>
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
        {formatDateSafely(label)}
      </div>

      {/* Energy Flow Section */}
      <div className="mb-3">
        <div className="font-medium mb-2 text-sm opacity-75">
          {t("energy Flow")}
        </div>
        {renderSection(
          t("solar Production"),
          data.solarProduction,
          COLORS.solarProduction
        )}
        {renderSection(t("Consumption"), data.consumption, COLORS.consumption)}
        {renderSection(
          t("self Consumption"),
          data.selfConsumption,
          COLORS.selfConsumption
        )}
        {renderSection(t("exportToGrid"), data.export, COLORS.export)}
        {renderSection(t("importFromGrid"), data.import, COLORS.import)}
      </div>

      {/* Energy Balance */}
      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-75">{t("gridBalance")}:</span>
          <span className="font-medium">
            {formatNumber((data.export || 0) - (data.import || 0))}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm opacity-75">{t("selfSufficiency")}:</span>
          <span className="font-medium">
            {data.consumption > 0
              ? `${((data.selfConsumption / data.consumption) * 100).toFixed(
                  1
                )}%`
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltipEnergyFlowGraph;
