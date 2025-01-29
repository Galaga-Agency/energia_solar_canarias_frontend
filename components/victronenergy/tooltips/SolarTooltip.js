import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { format } from "date-fns";

const getColors = (theme) => ({
  toBattery: theme === "dark" ? "#FFD57B" : "#FFD57B",
  directUse: theme === "dark" ? "#AD936A" : "#BDBFC0",
  toGrid: theme === "dark" ? "#A48D67" : "#AD936A",
});

const SolarTooltip = ({ active, payload, label }) => {
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

      {data.toGrid !== 0 && (
        <div className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.toGrid }}
            ></span>
            <span>{t("A la red")}:</span>
          </span>
          <span className="font-medium">
            {Number(data.toGrid).toFixed(2)} kWh
          </span>
        </div>
      )}

      <div className="flex justify-between items-center gap-4 pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
        <span>{t("Total")}:</span>
        <span className="font-medium">
          {(
            Number(data.toBattery || 0) +
            Number(data.directUse || 0) +
            Number(data.toGrid || 0)
          ).toFixed(2)}{" "}
          kWh
        </span>
      </div>
    </div>
  );
};

export default SolarTooltip;
