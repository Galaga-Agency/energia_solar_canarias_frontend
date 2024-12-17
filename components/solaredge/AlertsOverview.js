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
    .slice(0, 5);

  const getSeverityColor = (severity) => {
    if (severity <= 3) {
      return "bg-yellow-500 dark:bg-yellow-500/80";
    } else if (severity <= 5) {
      return "bg-orange-500 dark:bg-orange-500/80";
    }
    return "bg-red-500 dark:bg-red-500/80";
  };

  return (
    <>
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
            <FiAlertCircle className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
            {t("alertsTitle")}
            <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
              ({alerts.length})
            </span>
          </h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md overflow-hidden">
          {recentAlerts.map((alert, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors duration-300 border-b border-slate-200 dark:border-slate-600/50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${getSeverityColor(
                      alert.severity
                    )} shadow-sm`}
                  />
                  <span className="text-slate-700 dark:text-slate-200">
                    {alert.message}
                  </span>
                </div>
                {alert.occurrences > 1 && (
                  <span className="text-sm px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">
                    x{alert.occurrences}
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-4">
                {format(new Date(alert.firstOccurrence), "dd/MM/yyyy HH:mm", {
                  locale: es,
                })}
              </span>
            </div>
          ))}
        </div>

        {alerts.length > 5 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-secondary text-custom-dark-blue dark:text-custom-yellow hover:bg-slate-100 dark:hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors duration-300"
            >
              {t("viewAll")}
            </button>
          </div>
        )}
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
