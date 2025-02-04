import React from "react";
import { useTranslation } from "next-i18next";
import { PopoverContent } from "@heroui/react";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";

const MpptDetailsPopover = ({ mpptData }) => {
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);

  const formatPowerValue = (value) => {
    if (!value) return "0 W";
    return `${value.toFixed(0)} W`;
  };

  return (
    <PopoverContent
      className={`z-[999] p-4 rounded-lg shadow-lg ${
        theme === "dark"
          ? "bg-slate-800/95 text-gray-100 border border-gray-700"
          : "bg-white/95 text-gray-800 border border-gray-200"
      }`}
    >
      <div className="space-y-2">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          {t("mpptDetails")}
        </div>
        {Object.entries(mpptData).map(([instance, data]) => (
          <div key={instance} className="space-y-1">
            <div className="font-medium text-sm border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
              {t("mppt")} {instance}
            </div>
            <div className="flex justify-between items-center gap-4 py-1">
              <span className="flex items-center gap-2">
                <span>{t("voltage")}:</span>
              </span>
              <span className="font-medium">{data.voltage.toFixed(1)}V</span>
            </div>
            <div className="flex justify-between items-center gap-4 py-1">
              <span className="flex items-center gap-2">
                <span>{t("current")}:</span>
              </span>
              <span className="font-medium">{data.current.toFixed(1)}A</span>
            </div>
            <div className="flex justify-between items-center gap-4 py-1">
              <span className="flex items-center gap-2">
                <span>{t("power")}:</span>
              </span>
              <span className="font-medium">
                {formatPowerValue(data.power)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PopoverContent>
  );
};

export default MpptDetailsPopover;
