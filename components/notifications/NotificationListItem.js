"use client";

import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";
import NotificationDetailModal from "./NotificationDetailModal";
import { FiAlertCircle } from "react-icons/fi";

const NotificationListItem = ({ notification }) => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [showModal, setShowModal] = useState(false);

  const {
    stationname,
    deviceName,
    devicesn,
    warningname,
    warning_code,
    warninglevel,
    status,
    happentime,
  } = notification;

  const warningLevelColors = {
    1: "bg-yellow-500",
    2: "bg-orange-500",
    3: "bg-red-500",
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString(ES, es);
    } catch (error) {
      return dateString;
    }
  };

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
                {/* Station Name and Warning Level */}
                <div className="flex items-center space-x-2 min-w-0">
                  <h3 className="font-medium text-custom-dark-blue dark:text-custom-yellow truncate">
                    {stationname}
                  </h3>
                  <div
                    className={`flex-shrink-0 h-2 w-2 rounded-full ${
                      warningLevelColors[warninglevel] || "bg-gray-500"
                    }`}
                    title={`Level ${warninglevel}`}
                  />
                </div>
              </div>

              {/* Device and Alert Info - Single Line on Desktop */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 text-sm">
                <div className="flex items-center space-x-1 min-w-0">
                  <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {t("device")}:
                  </span>
                  <span className="text-custom-dark-blue dark:text-custom-light-gray truncate">
                    {deviceName || devicesn}
                  </span>
                </div>
                <div className="flex items-center space-x-1 min-w-0">
                  <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {t("alert")}:
                  </span>
                  <span className="text-custom-dark-blue dark:text-custom-light-gray truncate">
                    {warningname} {warning_code && `(${warning_code})`}
                  </span>
                </div>
              </div>

              {/* Timestamp - Mobile Only */}
              <div className="xl:hidden text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(happentime)}
              </div>
            </div>

            {/* Timestamp - Desktop Only */}
            <div className="hidden xl:block flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
              {formatDate(happentime)}
            </div>
          </div>
        </div>
      </motion.div>

      <NotificationDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        notification={notification}
        userId={user?.id}
      />
    </>
  );
};

export default NotificationListItem;
