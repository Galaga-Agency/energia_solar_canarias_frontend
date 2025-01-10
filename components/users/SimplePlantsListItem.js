import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { PiSolarPanelFill } from "react-icons/pi";

const SimplePlantsListItem = ({ plant, onClick, t }) => {
  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const parseAddress = (address) => {
    try {
      const parsed = JSON.parse(address);
      if (parsed?.center?.lat && parsed?.center?.lng) {
        return `Lat: ${parsed.center.lat.toFixed(
          2
        )}, Lng: ${parsed.center.lng.toFixed(2)}`;
      }
      return "N/A";
    } catch {
      return address || "N/A";
    }
  };

  return (
    <div
      className="w-full relative flex items-center justify-between rounded-xl group p-4 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer"
      onClick={() => onClick(plant)}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Icon Container */}
        <div className="shrink-0 w-10 h-10 bg-custom-yellow/10 rounded-full flex items-center justify-center">
          <PiSolarPanelFill className="text-xl text-custom-yellow" />
        </div>
        {/* Text Content */}
        <div className="min-w-0">
          <h3 className="font-medium text-custom-dark-blue dark:text-custom-yellow truncate">
            {capitalizeWords(plant.name)}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <FaLocationDot className="shrink-0 text-custom-yellow" />
            <p className="truncate">{parseAddress(plant.address)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePlantsListItem;
