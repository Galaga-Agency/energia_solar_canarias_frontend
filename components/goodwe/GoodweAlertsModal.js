// GoodweAlertsModal.js
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiX, FiArchive, FiCheck } from "react-icons/fi";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { useTranslation } from "next-i18next";
import Texture from "@/components/Texture";
import PrimaryButton from "@/components/ui/PrimaryButton";
import CustomCheckbox from "@/components/ui/CustomCheckbox";

const GoodweAlertsModal = ({ isOpen, onClose, alerts }) => {
  const { t } = useTranslation();
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [showActive, setShowActive] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const formatDateTime = (dateString) => {
    try {
      const date = parse(dateString, "MM/dd/yyyy HH:mm:ss", new Date());
      return format(date, "dd/MM/yyyy HH:mm", { locale: es });
    } catch (error) {
      console.error("Error parsing date:", dateString);
      return dateString;
    }
  };

  const getSeverityColor = (warningLevel, status) => {
    if (status === 0) return "bg-red-500 dark:bg-red-500/80";
    if (warningLevel === 1) return "bg-yellow-500 dark:bg-yellow-500/80";
    return "bg-green-500 dark:bg-green-500/80";
  };

  const filteredAlerts = alerts.filter((alert) =>
    showActive ? alert.status === 0 : alert.status === 1
  );

  const handleSelectAlert = (alertId) => {
    setSelectedAlerts((prev) =>
      prev.includes(alertId)
        ? prev.filter((id) => id !== alertId)
        : [...prev, alertId]
    );
  };

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
                        className={`select-none px-4 py-2 rounded-lg transition-colors ${
                          showActive
                            ? "bg-custom-yellow text-custom-dark-blue"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {t("Active")}
                      </button>
                      <button
                        onClick={() => setShowActive(false)}
                        className={`select-none px-4 py-2 rounded-lg transition-colors ${
                          !showActive
                            ? "bg-custom-yellow text-custom-dark-blue"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {t("Cleared")}
                      </button>
                    </div>

                    {selectedAlerts.length > 0 && (
                      <div className="flex gap-2">
                        <PrimaryButton
                          onClick={() => {}}
                          className="flex items-center gap-2"
                        >
                          <FiCheck />
                          <p className="ml-2">{t("Mark as Read")}</p>
                        </PrimaryButton>
                        <PrimaryButton
                          onClick={() => {}}
                          className="flex items-center gap-2"
                        >
                          <FiArchive />
                          <p className="ml-2">{t("Archive")}</p>
                        </PrimaryButton>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4"
                  >
                    {filteredAlerts.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        {showActive
                          ? t("No active alerts")
                          : t("No cleared alerts")}
                      </div>
                    ) : (
                      filteredAlerts.map((alert) => (
                        <div
                          key={alert.warningid}
                          className="bg-white/50 dark:bg-slate-700/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <CustomCheckbox
                              checked={selectedAlerts.includes(alert.warningid)}
                              onChange={() =>
                                handleSelectAlert(alert.warningid)
                              }
                            />
                            <div className="flex items-center justify-between flex-1">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`min-w-3 w-3 h-3 rounded-full ${getSeverityColor(
                                    alert.warninglevel,
                                    alert.status
                                  )}`}
                                />
                                <div>
                                  <p className="text-custom-dark-blue dark:text-custom-yellow font-medium">
                                    {alert.warningname}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {alert.deviceName}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                                <div>{formatDateTime(alert.happentime)}</div>
                                {alert.status === 1 && alert.recoverytime && (
                                  <div className="text-green-600 dark:text-green-400">
                                    {t("Resolved")}:{" "}
                                    {
                                      formatDateTime(alert.recoverytime).split(
                                        " "
                                      )[1]
                                    }
                                  </div>
                                )}
                              </div>
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

export default GoodweAlertsModal;
