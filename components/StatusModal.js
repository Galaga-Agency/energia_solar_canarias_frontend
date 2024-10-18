import React from "react";
import { useTranslation } from "next-i18next";
import { FaTimes } from "react-icons/fa";

const StatusModal = ({ onClose, iconPosition, onMouseEnter, onMouseLeave }) => {
  const { t } = useTranslation();

  const statusColors = {
    working: "bg-green-500",
    error: "bg-red-500",
    waiting: "bg-yellow-500",
    disconnected: "bg-gray-500",
  };

  const statusDescriptions = {
    working: t("statusDescriptions.working"),
    waiting: t("statusDescriptions.waiting"),
    disconnected: t("statusDescriptions.disconnected"),
    error: t("statusDescriptions.error"),
  };

  return (
    <div
      className={`absolute z-50 ${iconPosition}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm w-full">
        <FaTimes
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer text-gray-500 dark:text-custom-yellow dark:hover:text-yellow-500 transition-all transition-300 hover:text-gray-700 text-xl"
        />
        <div className="space-y-2">
          {Object.keys(statusDescriptions).map((status) => (
            <div key={status} className="flex items-start">
              <div
                className={`mt-2 w-3 h-3 rounded-full ${statusColors[status]}`}
              />
              <span className="ml-4 max-w-[80%] dark:text-custom-light-gray">
                {statusDescriptions[status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
