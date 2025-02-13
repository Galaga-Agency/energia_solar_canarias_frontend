import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { FiAlertCircle } from "react-icons/fi";
import {
  fetchActiveNotifications,
  selectActiveNotifications,
  selectActiveError,
} from "@/store/slices/notificationsSlice";
import { selectUser } from "@/store/slices/userSlice";
import useDeviceType from "@/hooks/useDeviceType";
import AlertsSkeleton from "@/components/loadingSkeletons/AlertsSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";
import NotificationListItem from "@/components/alerts/AlertsListItem";

const GoodweAlerts = ({ plantId, onViewAll }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notifications = useSelector(selectActiveNotifications);
  const error = useSelector(selectActiveError);
  const user = useSelector(selectUser);
  const { isTablet } = useDeviceType();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    if (user?.tokenIdentificador) {
      dispatch(
        fetchActiveNotifications({
          pageIndex: 1,
          pageSize: 50,
        })
      );
    }
  }, [dispatch, user?.tokenIdentificador]);

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p className="text-red-600 dark:text-red-400">
          {t("Error loading alerts")}: {error}
        </p>
      </div>
    );
  }

  const goodweAlerts = notifications.filter(
    (notification) => notification.provider === "goodwe"
  );

  const filteredRecords = plantId
    ? goodweAlerts.filter((alert) => alert.stationId === plantId)
    : goodweAlerts;

  const recentRecords = filteredRecords.slice(0, 2);

  return (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mb-6 backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
          <FiAlertCircle className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
        </div>
        <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
          {t("System Alerts")}
        </h2>
        <span className="text-slate-500 dark:text-slate-400 text-md ml-1 mb-2">
          ({filteredRecords.length})
        </span>
      </div>

      {recentRecords.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FiAlertCircle className="text-4xl text-slate-400 dark:text-slate-500 mb-3" />
            <p className="text-slate-600 dark:text-slate-300 font-secondary">
              {t("noAlerts")}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {t("systemRunningOk")}
            </p>
          </div>{" "}
        </div>
      ) : (
        <div className="flex flex-col">
          {recentRecords.map((alert) => (
            <NotificationListItem
              key={alert.id}
              notification={{
                ...alert,
                warningid: alert.id,
                warninglevel: (() => {
                  switch (alert.severity) {
                    case "high":
                      return 3;
                    case "medium":
                      return 2;
                    case "low":
                      return 1;
                    default:
                      return 2;
                  }
                })(),
                happentime: alert.timestamp,
                status: 0,
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button
          onClick={onViewAll}
          className="select-none font-secondary text-custom-dark-blue dark:text-custom-yellow hover:bg-slate-100 dark:hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors duration-300"
        >
          {t("View All")}
        </button>
      </div>
    </div>
  );
};

export default GoodweAlerts;
