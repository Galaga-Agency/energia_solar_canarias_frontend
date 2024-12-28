import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useTranslation } from "next-i18next";
import Texture from "@/components/Texture";

const VictronAlertsModal = ({ isOpen, onClose, alerts }) => {
  const { t } = useTranslation();
  const [showActive, setShowActive] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getSeverityColor = (isActive) => {
    if (!isActive) return "bg-green-500 dark:bg-green-500/80";
    return "bg-red-500 dark:bg-red-500/80";
  };

  const filteredAlerts = alerts.filter((alert) =>
    showActive ? alert.isActive : !alert.isActive
  );

  const NoAlertsMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FiAlertCircle className="text-4xl text-gray-400 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
        {showActive ? t("No active alerts") : t("No cleared alerts")}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
        {showActive
          ? t("Everything is running smoothly")
          : t("No alerts have been cleared yet")}
      </p>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[999]">
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0">
            <div className="flex min-h-full items-center justify-center p-4 pb-20 md:pb-24">
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{
                  scale: 0.9,
                  y: 20,
                  opacity: 0,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: 0.1,
                }}
                className="relative w-full max-w-4xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-4 md:p-6 backdrop-blur-lg shadow-xl overflow-hidden"
              >
                <Texture className="opacity-30" />

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between gap-2 py-4 px-6 bg-gradient-to-r from-custom-yellow to-custom-yellow/90 rounded-xl text-custom-dark-blue mb-6"
                >
                  <div className="flex items-center gap-2">
                    <FiAlertCircle className="text-2xl" />
                    <h2 className="text-xl md:text-2xl font-bold">
                      {t("System Alerts")}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-black/10 rounded-full transition-colors"
                  >
                    <FiX className="text-2xl" />
                  </button>
                </motion.div>

                <div className="p-6 space-y-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-between items-center"
                  >
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowActive(true)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          showActive
                            ? "bg-custom-yellow text-custom-dark-blue"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {t("Active")}
                      </button>
                      <button
                        onClick={() => setShowActive(false)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          !showActive
                            ? "bg-custom-yellow text-custom-dark-blue"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {t("Cleared")}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4"
                  >
                    {filteredAlerts.length === 0 ? (
                      <NoAlertsMessage />
                    ) : (
                      filteredAlerts.map((alert) => (
                        <div
                          key={alert.idAlarm}
                          className="bg-white/50 dark:bg-slate-700/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center justify-between flex-1">
                            <div className="flex items-center gap-3">
                              <div
                                className={`min-w-3 w-3 h-3 rounded-full ${getSeverityColor(
                                  alert.isActive
                                )}`}
                              />
                              <div>
                                <p className="text-custom-dark-blue dark:text-custom-yellow font-medium">
                                  {alert.description}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {alert.device} - {alert.nameEnum}
                                </p>
                              </div>
                            </div>
                            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                              <div>
                                {format(
                                  new Date(alert.started * 1000),
                                  "dd/MM/yyyy HH:mm",
                                  { locale: es }
                                )}
                              </div>
                              {alert.cleared && (
                                <div className="text-green-600 dark:text-green-400">
                                  {t("Cleared")}:{" "}
                                  {format(
                                    new Date(alert.cleared * 1000),
                                    "HH:mm",
                                    { locale: es }
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VictronAlertsModal;
