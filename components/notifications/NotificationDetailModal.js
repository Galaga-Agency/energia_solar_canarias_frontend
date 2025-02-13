"use client";

import React from "react";
import { useTranslation } from "next-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Info, Clock } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Texture from "@/components/Texture";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useRouter, useParams } from "next/navigation";
import { FaBell } from "react-icons/fa";

const NotificationDetailModal = ({ isOpen, onClose, notification }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userId, plantId: currentPlantId } = useParams();

  const handleRedirect = () => {
    if (!notification?.provider || !userId) {
      console.warn("Missing required navigation data:", {
        notification,
        userId,
      });
      return;
    }

    let plantId;
    let provider = notification.provider.toLowerCase();

    // First, handle the provider name conversion
    if (provider === "victron") {
      provider = "victronenergy";
    }

    // Then determine the correct plant ID based on provider
    if (provider === "goodwe") {
      plantId = notification.stationId || notification.stationid;
    } else if (provider === "victronenergy") {
      plantId = notification.plantId || notification.idSite;
    }

    if (!plantId) {
      console.warn("Could not determine plant ID:", notification);
      return;
    }

    // Store navigation context before redirecting
    localStorage.setItem(
      "plantNavigationContext",
      JSON.stringify({
        from: "notifications",
        notificationId: notification.id,
        timestamp: Date.now(),
      })
    );

    // Navigate using the correct URL pattern with the converted provider name
    const url = `/dashboard/${userId}/plants/${provider}/${plantId}`;
    router.push(url);
    onClose();
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const renderInfoCard = ({ title, value, delay = 0 }) => (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      className="bg-white/50 dark:bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm"
    >
      <label className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </label>
      <p className="text-custom-dark-blue dark:text-custom-light-gray font-medium mt-1">
        {value || t("notSpecified")}
      </p>
    </motion.div>
  );

  const renderSection = ({ title, children, icon: Icon, delay = 0 }) => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="space-y-4 bg-white/30 dark:bg-gray-800/20 rounded-xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-custom-dark-blue dark:text-custom-yellow" />
        <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </motion.div>
  );

  const renderProviderSpecificContent = () => {
    switch (notification.provider) {
      case "goodwe":
        return (
          <div className="space-y-6">
            {renderSection({
              title: t("plantInformation"),
              icon: Info,
              delay: 0.2,
              children: (
                <>
                  {renderInfoCard({
                    title: t("plantName"),
                    value: notification.stationname,
                    delay: 0.3,
                  })}
                  {renderInfoCard({
                    title: t("serialNumber"),
                    value: notification.devicesn,
                    delay: 0.4,
                  })}
                </>
              ),
            })}

            {renderSection({
              title: t("alertDetails"),
              icon: AlertTriangle,
              delay: 0.3,
              children: (
                <>
                  {renderInfoCard({
                    title: t("alertName"),
                    value: notification.warningname,
                    delay: 0.5,
                  })}
                  {renderInfoCard({
                    title: t("alertCode"),
                    value: notification.warning_code,
                    delay: 0.6,
                  })}
                  {renderInfoCard({
                    title: t("deviceName"),
                    value: notification.deviceName,
                    delay: 0.7,
                  })}
                  {renderInfoCard({
                    title: t("deviceType"),
                    value:
                      notification.device_type ||
                      notification.pw_type ||
                      t("notSpecified"),
                    delay: 0.8,
                  })}
                  {renderInfoCard({
                    title: t("warningLevel"),
                    value: notification.warninglevel,
                    delay: 0.9,
                  })}
                  {renderInfoCard({
                    title: t("errorType"),
                    value: notification.error_type,
                    delay: 1,
                  })}
                </>
              ),
            })}

            {renderSection({
              title: t("timeInformation"),
              icon: Clock,
              delay: 0.4,
              children: (
                <>
                  {renderInfoCard({
                    title: t("happenTime"),
                    value: formatDate(notification.happentime),
                    delay: 1.1,
                  })}
                  {renderInfoCard({
                    title: t("recoveryTime"),
                    value: formatDate(notification.recoverytime),
                    delay: 1.2,
                  })}
                </>
              ),
            })}
          </div>
        );

      case "victron":
        return (
          <div className="space-y-6">
            {renderSection({
              title: t("plantInformation"),
              icon: Info,
              delay: 0.2,
              children: (
                <>
                  {renderInfoCard({
                    title: t("plantName"),
                    value: notification.plantName,
                    delay: 0.3,
                  })}
                  {renderInfoCard({
                    title: t("deviceName"),
                    value: notification.device,
                    delay: 0.4,
                  })}
                </>
              ),
            })}

            {renderSection({
              title: t("alertDetails"),
              icon: AlertTriangle,
              delay: 0.3,
              children: (
                <>
                  {renderInfoCard({
                    title: t("alertName"),
                    value: notification.description,
                    delay: 0.5,
                  })}
                  {renderInfoCard({
                    title: t("alertType"),
                    value: notification.nameEnum,
                    delay: 0.6,
                  })}
                  {renderInfoCard({
                    title: t("severity"),
                    value: notification.severity,
                    delay: 0.7,
                  })}
                  {renderInfoCard({
                    title: t("siteId"),
                    value: notification.idSite,
                    delay: 0.8,
                  })}
                </>
              ),
            })}

            {renderSection({
              title: t("timeInformation"),
              icon: Clock,
              delay: 0.4,
              children: (
                <>
                  {renderInfoCard({
                    title: t("happenTime"),
                    value: formatDate(notification.timestamp),
                    delay: 0.9,
                  })}
                </>
              ),
            })}
          </div>
        );

      default:
        return <p>{t("unknownProvider")}</p>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: 0.1,
                }}
                className="relative w-full max-w-4xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-4 md:p-6 backdrop-blur-lg shadow-xl max-h-[80vh] xl:max-h-[85vh] overflow-y-auto custom-scrollbar"
              >
                <Texture className="opacity-30" />

                {/* Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between gap-4 mb-6 md:mb-8 bg-gradient-to-r from-custom-yellow to-custom-yellow/90 p-4 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <FaBell className="text-2xl text-custom-dark-blue" />
                    <h2 className="text-xl md:text-2xl font-semibold text-custom-dark-blue">
                      {t("alertDetails")}
                    </h2>
                  </div>

                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  >
                    <X className="h-6 w-6 text-custom-dark-blue" />
                  </motion.button>
                </motion.div>

                {/* Content */}
                <div className="space-y-6">
                  {renderProviderSpecificContent()}

                  {/* Actions */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-end gap-4 mt-8"
                  >
                    {(!currentPlantId ||
                      currentPlantId !==
                        (notification.stationId ||
                          notification.stationid ||
                          notification.plantId ||
                          notification.idSite)) && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <PrimaryButton
                          onClick={handleRedirect}
                          className="px-4"
                        >
                          {t("goToPlant")}
                        </PrimaryButton>
                      </motion.div>
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

export default NotificationDetailModal;
