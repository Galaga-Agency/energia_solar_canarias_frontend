import React from "react";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Texture from "@/components/Texture";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";

const NotificationDetailModal = ({ isOpen, onClose, notification, userId }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleRedirect = () => {
    // Different routing logic based on provider
    if (notification.provider === "goodwe") {
      router.push(
        `/dashboard/${userId}/plants/${notification.provider}/${notification.stationId}`
      );
    } else if (notification.provider === "victron") {
      // Fallback routing for Victron
      router.push(
        `/dashboard/${userId}/plants/${notification.provider}/${
          notification.plantId || notification.idSite
        }`
      );
    }
    onClose();
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const renderProviderSpecificContent = () => {
    switch (notification.provider) {
      case "goodwe":
        return (
          <>
            {/* Plant Info Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {t("plantInformation")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("plantName")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray font-medium">
                    {notification.stationname}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("serialNumber")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {notification.devicesn}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Alert Details Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {t("alertDetails")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("alertName")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray font-medium">
                    {notification.warningname}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("alertCode")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {notification.warning_code}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("deviceName")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {notification.deviceName}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("deviceType")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {notification.device_type ||
                      notification.pw_type ||
                      t("notSpecified")}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("warningLevel")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {notification.warninglevel}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("errorType")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {notification.error_type}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Time Information */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {t("timeInformation")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("happenTime")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {formatDate(notification.happentime)}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("recoveryTime")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {formatDate(notification.recoverytime)}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        );

      case "victron":
        return (
          <>
            {/* Plant Info Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {t("plantInformation")}
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("plantName")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray font-medium">
                    {notification.plantName}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("deviceName")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {notification.device}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Alert Details Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {t("alertDetails")}
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("alertName")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray font-medium">
                    {notification.description}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("alertType")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {notification.nameEnum}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("severity")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {notification.severity}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("siteId")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {notification.idSite}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Time Information */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {t("timeInformation")}
              </h3>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <label className="text-gray-500 dark:text-gray-400">
                    {t("happenTime")}
                  </label>
                  <p className="text-custom-dark-blue dark:text-custom-light-gray">
                    {formatDate(notification.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        );

      default:
        return <p>{t("unknownProvider")}</p>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="relative w-full max-w-4xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-4 md:p-6 backdrop-blur-lg shadow-xl overflow-hidden"
    >
      <Texture className="opacity-30" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 py-4 px-6 bg-gradient-to-r from-custom-yellow to-custom-yellow/90 rounded-xl text-custom-dark-blue">
        <div className="flex items-center gap-2">
          <FaBell className="text-2xl" />
          <h2 className="text-xl md:text-2xl">{t("alertDetails")}</h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="flex-shrink-0 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="h-6 w-6 text-custom-dark-blue" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {renderProviderSpecificContent()}

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end gap-4 mt-6"
        >
          <PrimaryButton onClick={handleRedirect}>
            {t("goToPlant")}
          </PrimaryButton>
        </motion.div>
      </div>
    </Modal>
  );
};

export default NotificationDetailModal;
