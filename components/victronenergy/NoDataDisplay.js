import React from "react";
import { useTranslation } from "next-i18next";
import { FiAlertCircle } from "react-icons/fi";

const NoDataDisplay = ({ onSelectRange }) => {
  const { t } = useTranslation();

  return (
    <div className="h-[400px] mb-6 flex flex-col items-center justify-center w-full bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <FiAlertCircle className="text-4xl mb-3 text-slate-400 dark:text-slate-500" />
      <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
        {t("noDataAvailable")}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
        {t("tryAnotherTimeRange")}
      </p>
      <button
        onClick={onSelectRange}
        className="mt-4 px-4 py-2 text-sm bg-custom-yellow text-custom-dark-blue rounded-lg hover:bg-opacity-90 transition-all"
      >
        {t("selectDifferentRange")}
      </button>
    </div>
  );
};

export default NoDataDisplay;
