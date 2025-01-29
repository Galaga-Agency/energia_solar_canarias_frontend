import React from "react";
import { useTranslation } from "next-i18next";

const MetricCard = ({ title, value, predictedValue, icon, unit = "kWh" }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl shadow-lg hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors duration-300">
      {/* Icon Section */}
      {icon}

      {/* Text Content */}
      <div className="ml-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium font-secondary text-custom-dark-blue dark:text-custom-yellow">
          {title}
        </h3>
        <p className="text-xl font-bold text-custom-dark-blue dark:text-custom-light-gray">
          {value} {unit}
        </p>
        {predictedValue && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("Total previsto")}: {predictedValue} {unit}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
