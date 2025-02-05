import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "@/store/slices/themeSlice";

const CustomTooltipEnergyComparison = ({
  active,
  payload,
  label,
  timeUnit,
}) => {
  const theme = useSelector(selectTheme);
  const { t } = useTranslation();

  const COLORS =
    theme === "dark"
      ? ["#A48D67", "#657880", "#BDBFC0", "#FFD57B", "#695A42"]
      : ["#0B2738", "#AD936A", "#FFD57B", "#0B2738", "#728EA1"];

  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className={`z-[999] p-4 rounded-lg shadow-lg ${
        theme === "dark"
          ? "bg-slate-800/95 text-gray-100 border border-gray-700"
          : "bg-white/95 text-gray-800 border border-gray-200"
      }`}
    >
      <div className="font-medium mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        {label}
      </div>

      <div className="mb-3">
        <div className="font-medium mb-2 text-sm opacity-75">
          {timeUnit === "MONTH"
            ? t("monthly_production", "Producción Mensual")
            : t("yearly_production", "Producción Anual")}
        </div>

        {payload.map((entry, index) => (
          <div
            key={entry.name}
            className="flex justify-between items-center gap-4 py-1"
          >
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    timeUnit === "YEAR"
                      ? theme === "dark"
                        ? "#FFD57B"
                        : "#0B2738"
                      : COLORS[index % COLORS.length],
                }}
              />
              <span>{entry.name}:</span>
            </span>
            <span className="font-medium">
              {entry.value >= 1000000
                ? `${(entry.value / 1000000).toFixed(1)} MWh`
                : entry.value >= 1000
                ? `${(entry.value / 1000).toFixed(1)} kWh`
                : `${entry.value.toFixed(1)} Wh`}
            </span>
          </div>
        ))}
      </div>

      {payload.length > 1 && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-75">{t("total", "Total")}:</span>
            <span className="font-medium">
              {(() => {
                const total = payload.reduce(
                  (sum, entry) => sum + (entry.value || 0),
                  0
                );
                if (total >= 1000000)
                  return `${(total / 1000000).toFixed(1)} MWh`;
                if (total >= 1000) return `${(total / 1000).toFixed(1)} kWh`;
                return `${total.toFixed(1)} Wh`;
              })()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTooltipEnergyComparison;
