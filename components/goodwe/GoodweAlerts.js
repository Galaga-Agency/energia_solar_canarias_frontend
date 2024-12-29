import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { FiAlertCircle } from "react-icons/fi";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import {
  selectAlerts,
  selectAlertsLoading,
  selectAlertsError,
  fetchGoodweAlerts,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import useDeviceType from "@/hooks/useDeviceType";
import AlertsSkeleton from "@/components/loadingSkeletons/AlertsSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";

const GoodweAlerts = ({ plantId, onViewAll }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const alerts = useSelector(selectAlerts);
  const isLoading = useSelector(selectAlertsLoading);
  const error = useSelector(selectAlertsError);
  const user = useSelector(selectUser);
  const { isTablet } = useDeviceType();

  useEffect(() => {
    if (user?.tokenIdentificador) {
      dispatch(
        fetchGoodweAlerts({
          token: user.tokenIdentificador,
          pageIndex: 1,
          pageSize: 100,
        })
      );
    }
  }, [dispatch, user?.tokenIdentificador]);

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

  const records = alerts?.goodwe?.data?.list || [];
  const filteredRecords = plantId
    ? records.filter((alert) => alert.stationId === plantId)
    : records;
  const recentRecords = filteredRecords.slice(0, 3);

  const getSeverityColor = (warningLevel, status) => {
    if (status === 0) return "bg-red-500 dark:bg-red-500/80"; // Active alert
    if (warningLevel === 1) return "bg-yellow-500 dark:bg-yellow-500/80"; // Warning level
    return "bg-green-500 dark:bg-green-500/80"; // Resolved
  };

  const formatDateTime = (dateString) => {
    try {
      // Parse the date string "MM/DD/YYYY HH:mm:ss"
      const date = parse(dateString, "MM/dd/yyyy HH:mm:ss", new Date());
      return format(date, "dd/MM/yyyy HH:mm", { locale: es });
    } catch (error) {
      console.error("Error parsing date:", dateString);
      return dateString;
    }
  };

  return (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mb-6 backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
          <FiAlertCircle className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
        </div>
        <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
          {t("System Alerts")}
          <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
            ({filteredRecords.length})
          </span>
        </h2>
      </div>

      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md overflow-hidden">
        {recentRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FiAlertCircle className="text-4xl text-slate-400 dark:text-slate-500 mb-3" />
            <p className="text-slate-600 dark:text-slate-300 font-secondary">
              {t("noAlerts")}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {t("systemRunningOk")}
            </p>
          </div>
        ) : (
          recentRecords.map((alert) => (
            <div
              key={alert.warningid}
              className="flex justify-between items-center p-4 hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors duration-300 border-b border-slate-200 dark:border-slate-600/50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`min-w-3 w-3 h-3 rounded-full ${getSeverityColor(
                    alert.warninglevel,
                    alert.status
                  )}`}
                />
                <div className="flex flex-col">
                  <span className="text-slate-700 dark:text-slate-200">
                    {alert.warningname}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {alert.deviceName}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDateTime(alert.happentime)}
                </span>
                {alert.status === 1 && alert.recoverytime && (
                  <div className="text-xs text-green-500 dark:text-green-400">
                    {t("Resolved")}:{" "}
                    {formatDateTime(alert.recoverytime).split(" ")[1]}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {filteredRecords.length > 3 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onViewAll}
            className="select-none font-secondary text-custom-dark-blue dark:text-custom-yellow hover:bg-slate-100 dark:hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors duration-300"
          >
            {t("View All")}
          </button>
        </div>
      )}
    </div>
  );
};

export default GoodweAlerts;
