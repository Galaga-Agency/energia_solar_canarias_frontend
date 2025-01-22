"use client";

import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import NotificationDetailModal from "./NotificationDetailModal";
import { FiAlertCircle } from "react-icons/fi";

// This mapping helps determine visual indicators based on notification severity
const SEVERITY_MAPPING = {
  goodwe: {
    1: { color: "bg-yellow-500", level: 1 }, // Low severity
    2: { color: "bg-orange-500", level: 2 }, // Medium severity
    3: { color: "bg-red-500", level: 3 }, // High severity
  },
  victron: {
    low: { color: "bg-yellow-500", level: 1 },
    warning: { color: "bg-orange-500", level: 2 },
    alarm: { color: "bg-red-500", level: 3 },
  },
  default: {
    color: "bg-gray-500",
    level: 1,
  },
};

const NotificationListItem = ({ notification }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  // Helper function to format dates consistently
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  // Function to process notification content based on provider type
  const renderNotificationContent = () => {
    switch (notification.provider) {
      case "goodwe":
        // Get severity details from mapping, fallback to default if not found
        const goodweSeverity =
          SEVERITY_MAPPING.goodwe[notification.warninglevel] ||
          SEVERITY_MAPPING.default;

        return {
          title: notification.stationname,
          deviceInfo: notification.deviceName || notification.devicesn,
          alertInfo: `${notification.warningname} ${
            notification.warning_code ? `(${notification.warning_code})` : ""
          }`,
          timestamp: notification.happentime,
          severityColor: goodweSeverity.color,
          severityLevel: goodweSeverity.level,
        };

      case "victron":
        // Determine severity for Victron notifications
        const victronSeverity =
          SEVERITY_MAPPING.victron[notification.severity?.toLowerCase()] ||
          (notification.nameEnum?.toLowerCase() === "alarm"
            ? SEVERITY_MAPPING.victron.alarm
            : SEVERITY_MAPPING.default);

        return {
          title: notification.plantName,
          deviceInfo: notification.device || "Unknown Device",
          alertInfo: notification.description,
          timestamp: new Date(notification.started * 1000).toISOString(),
          severityColor: victronSeverity.color,
          severityLevel: victronSeverity.level,
        };

      default:
        return {
          title: "Unknown Provider",
          deviceInfo: "",
          alertInfo: "",
          timestamp: new Date().toISOString(),
          severityColor: SEVERITY_MAPPING.default.color,
          severityLevel: SEVERITY_MAPPING.default.level,
        };
    }
  };

  const {
    title,
    deviceInfo,
    alertInfo,
    timestamp,
    severityColor,
    severityLevel,
  } = renderNotificationContent();

  return (
    <>
      <motion.div
        className="overflow-hidden w-full max-w-[85vw] md:max-w-[92vw] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div
          onClick={() => setShowModal(true)}
          className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl 
                   hover:shadow-lg hover:rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 
                   transition duration-300 cursor-pointer p-4"
        >
          <div className="flex items-center space-x-4">
            {/* Icon Section */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-custom-yellow/10 rounded-full flex items-center justify-center">
                <FiAlertCircle className="text-xl text-custom-yellow drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]" />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2 min-w-0">
                  <h3 className="font-medium text-custom-dark-blue dark:text-custom-yellow truncate">
                    {title}
                  </h3>
                  <div
                    className={`flex-shrink-0 h-2 w-2 rounded-full ${severityColor}`}
                    title={`Level ${severityLevel}`}
                  />
                </div>
              </div>

              {/* Device and Alert Info */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 text-sm">
                <div className="flex items-center space-x-1 min-w-0">
                  <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {t("device")}:
                  </span>
                  <span className="text-custom-dark-blue dark:text-custom-light-gray truncate">
                    {deviceInfo}
                  </span>
                </div>
                <div className="flex items-center space-x-1 min-w-0">
                  <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {t("alert")}:
                  </span>
                  <span className="text-custom-dark-blue dark:text-custom-light-gray truncate">
                    {alertInfo}
                  </span>
                </div>
              </div>

              {/* Timestamp - Mobile Only */}
              <div className="xl:hidden text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(timestamp)}
              </div>
            </div>

            {/* Timestamp - Desktop Only */}
            <div className="hidden xl:block flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
              {formatDate(timestamp)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <NotificationDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        notification={notification}
      />
    </>
  );
};

export default NotificationListItem;
