import React, { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import AlertsModal from "@/components/AlertsModal";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AlertsOverview = ({ alerts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  // Get recent unique alerts for the overview
  const recentAlerts = alerts
    .reduce((acc, alert) => {
      const existing = acc.find((a) => a.type === alert.type);
      if (existing) {
        existing.occurrences++;
        if (new Date(alert.date) < new Date(existing.firstOccurrence)) {
          existing.firstOccurrence = alert.date;
        }
      } else {
        acc.push({
          ...alert,
          occurrences: 1,
          firstOccurrence: alert.date,
        });
      }
      return acc;
    }, [])
    .slice(0, 3);

  return (
    <>
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg backdrop-blur-sm shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FiAlertCircle className="text-red-500 text-xl" />
            <h2 className="text-lg font-medium text-custom-dark-blue dark:text-custom-yellow">
              {t("alertsTitle")} ({alerts.length})
            </h2>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800/50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full bg-${
                      alert.severity <= 3
                        ? "yellow"
                        : alert.severity <= 5
                        ? "orange"
                        : "red"
                    }-500`}
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {alert.message}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(alert.firstOccurrence), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-md font-secondary text-custom-dark-blue dark:text-custom-yellow hover:underline"
          >
            {t("viewAll")}
          </button>
        </div>
      </div>

      <AlertsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alerts={alerts}
      />
    </>
  );
};

export default AlertsOverview;
