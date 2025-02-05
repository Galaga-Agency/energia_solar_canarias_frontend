import React from "react";
import { PopoverContent } from "@heroui/react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { selectTheme } from "@/store/slices/themeSlice";

const GridDetailsPopover = ({ gridMetrics }) => {
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);

  if (!gridMetrics) return null;

  // Only get phases where all values are non-zero
  const phases = ["L1", "L2", "L3"].filter((phase) => {
    const metrics = gridMetrics[phase];
    return (
      metrics &&
      metrics.power !== 0 &&
      metrics.voltage !== 0 &&
      metrics.current !== 0
    );
  });

  return (
    <PopoverContent
      side="right"
      align="center"
      sideOffset={5}
      className={`z-[999] p-4 rounded-lg shadow-lg ${
        theme === "dark"
          ? "bg-slate-800/95 text-gray-100 border border-gray-700"
          : "bg-white/95 text-gray-800 border border-gray-200"
      }`}
    >
      <div className="space-y-2">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          {t("gridDetails")}
        </div>
        {phases.map((phase) => {
          const metrics = gridMetrics[phase];
          if (!metrics) return null;

          return (
            <div key={phase} className="space-y-1">
              <div className="font-medium text-sm border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                {t("phase")} {phase.replace("L", "")}
              </div>
              <div className="flex justify-between items-center gap-4 py-1">
                <span className="flex items-center gap-2">
                  <span>{t("power")}:</span>
                </span>
                <span className="font-medium">{metrics.power} W</span>
              </div>
              <div className="flex justify-between items-center gap-4 py-1">
                <span className="flex items-center gap-2">
                  <span>{t("voltage")}:</span>
                </span>
                <span className="font-medium">{metrics.voltage} V</span>
              </div>
              <div className="flex justify-between items-center gap-4 py-1">
                <span className="flex items-center gap-2">
                  <span>{t("current")}:</span>
                </span>
                <span className="font-medium">{metrics.current} A</span>
              </div>
            </div>
          );
        })}
      </div>
    </PopoverContent>
  );
};

export default GridDetailsPopover;
