import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { FaQuestionCircle } from "react-icons/fa";
import { FiBatteryCharging } from "react-icons/fi";
import StatusModal from "@/components/StatusModal";

const batteryStateColors = {
  charging: "bg-green-500",
  discharging: "bg-red-500",
  resting: "bg-yellow-500",
};

const BatteryStatuses = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });

  const handleModalOpen = (event) => {
    setIsModalOpen(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setIconPosition({ x: rect.x + rect.width / 2, y: rect.y + rect.height });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleMouseLeave = () => {
    handleModalClose();
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="flex items-center relative">
      <FiBatteryCharging className="text-3xl -rotate-90 text-custom-dark-blue dark:text-custom-yellow mr-2" />
      <div className="flex flex-row space-x-4">
        {Object.keys(batteryStateColors).map((status) => (
          <div key={status} className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full ${batteryStateColors[status]}`}
            />
            <span className="ml-2 text-lg text-custom-dark-blue dark:text-custom-light-gray capitalize">
              {capitalizeFirstLetter(t(`${status}`))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatteryStatuses;
