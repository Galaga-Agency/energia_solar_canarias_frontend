import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import {
  BsBatteryCharging,
  BsBatteryFull,
  BsBatteryHalf,
} from "react-icons/bs";

const batteryStateIcons = {
  charging: {
    icon: BsBatteryCharging,
    color: "text-green-500",
    size: "text-2xl",
  },
  discharging: { icon: BsBatteryHalf, color: "text-red-500", size: "text-2xl" },
  resting: { icon: BsBatteryFull, color: "text-gray-400", size: "text-2xl" },
};

const BatteryStatuses = () => {
  const { t } = useTranslation();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="flex items-center relative">
      <div className="flex flex-row space-x-6">
        {Object.entries(batteryStateIcons).map(
          ([status, { icon: Icon, color, size }]) => (
            <div key={status} className="flex items-center">
              <Icon className={`${size} ${color} mt-1`} />
              <span className="ml-2 text-lg text-custom-dark-blue dark:text-custom-light-gray capitalize">
                {capitalizeFirstLetter(t(`${status}`))}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BatteryStatuses;
