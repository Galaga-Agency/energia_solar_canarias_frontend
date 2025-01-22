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
import { selectTheme } from "@/store/slices/themeSlice";
import NotificationListItem from "@/components/notifications/NotificationListItem";

const VictronEnergyAlerts = ({ plantId, onViewAll }) => {
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

  const victronAlerts = notifications.filter(
    (notification) => notification.provider === "victron"
  );

  const filteredRecords = plantId
    ? victronAlerts.filter((alert) => alert.plantId === plantId)
    : victronAlerts;

  const recentRecords = filteredRecords.slice(0, 2);

  return (
    <div className="flex-1">
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

      {recentRecords.length === 0 ? (
        <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md overflow-hidden flex items-center justify-center">
          <div className="p-8 text-center">
            <FiAlertCircle className="text-4xl text-slate-400 dark:text-slate-500 mb-3 mx-auto" />
            <p className="text-slate-600 dark:text-slate-300 font-secondary">
              {t("noAlerts")}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {t("systemRunningOk")}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {recentRecords.map((alert) => (
            <NotificationListItem key={alert.id} notification={alert} />
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

export default VictronEnergyAlerts;
