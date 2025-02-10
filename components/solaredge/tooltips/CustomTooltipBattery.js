import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "@/store/slices/themeSlice";

const CustomTooltipBattery = ({ active, payload }) => {
  const theme = useSelector(selectTheme);
  const { t } = useTranslation();

  if (!active || !payload || !payload.length) return null;

  const { date, time, batteryPercentageState } = payload[0].payload;

  return (
    <div
      className={`z-[999] p-4 rounded-lg shadow-lg ${
        theme === "dark"
          ? "bg-slate-800/95 text-gray-100 border border-gray-700"
          : "bg-white/95 text-gray-800 border border-gray-200"
      }`}
    >
      <div className="font-medium mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        {`${date} ${time}`}
      </div>

      <div className="flex justify-between items-center gap-4 py-1">
        <span className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: theme === "dark" ? "#BDBFC0" : "#0B2738",
            }}
          />
          <span>{t("battery_state", "Estado de batería")}:</span>
        </span>
        <span className="font-medium">{batteryPercentageState}%</span>
      </div>
    </div>
  );
};

export default CustomTooltipBattery;
