import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { FiAlertCircle } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  selectAlerts,
  selectAlertsLoading,
  selectAlertsError,
} from "@/store/slices/plantsSlice";
import AlertsSkeleton from "@/components/loadingSkeletons/AlertsSkeleton";
import useDeviceType from "@/hooks/useDeviceType";

const VictronEnergyAlerts = ({ onViewAll }) => {
  const { t } = useTranslation();
  const alerts = useSelector(selectAlerts);
  const isLoading = useSelector(selectAlertsLoading);
  const error = useSelector(selectAlertsError);
  const { isTablet } = useDeviceType();

  if (isLoading) {
    return <AlertsSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p className="text-red-600 dark:text-red-400">
          {t("Error loading alerts")}: {error}
        </p>
      </div>
    );
  }

  const records = alerts?.victronenergy?.records || [];
  const recentRecords = records.slice(0, isTablet ? 3 : 5);

  const getSeverityColor = (isActive) => {
    if (!isActive) return "bg-green-500 dark:bg-green-500/80";
    return "bg-red-500 dark:bg-red-500/80";
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
          <FiAlertCircle className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
        </div>
        <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
          {t("System Alerts")}
          <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
            ({records.length})
          </span>
        </h2>
      </div>

      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md overflow-hidden">
        {recentRecords.map((alert) => (
          <div
            key={alert.idAlarm}
            className="flex justify-between items-center p-4 hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors duration-300 border-b border-slate-200 dark:border-slate-600/50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`min-w-3 w-3 h-3 rounded-full ${getSeverityColor(
                  alert.isActive
                )}`}
              />
              <span className="text-slate-700 dark:text-slate-200">
                {alert.description}
              </span>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-4">
              {format(new Date(alert.started * 1000), "dd/MM/yyyy HH:mm", {
                locale: es,
              })}
            </span>
          </div>
        ))}
      </div>

      {records.length > (isTablet ? 3 : 5) && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onViewAll}
            className="font-secondary text-custom-dark-blue dark:text-custom-yellow hover:bg-slate-100 dark:hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors duration-300"
          >
            {t("View All")}
          </button>
        </div>
      )}
    </div>
  );
};

export default VictronEnergyAlerts;
