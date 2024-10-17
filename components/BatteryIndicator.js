import React from "react";

const BatteryIndicator = ({ batterySOC }) => {
  let batteryColor;
  let batteryWidth;

  if (batterySOC >= 75) {
    batteryColor = "bg-green-400"; // Good
    batteryWidth = "100%";
  } else if (batterySOC >= 50) {
    batteryColor = "bg-yellow-400"; // Moderate
    batteryWidth = "75%";
  } else if (batterySOC >= 25) {
    batteryColor = "bg-orange-400"; // Low
    batteryWidth = "50%";
  } else {
    batteryColor = "bg-red-600"; // Critical
    batteryWidth = "25%";
  }

  return (
    <div className="flex flex-wrap mr-auto ">
      <div className="w-48 mx-auto">
        <div className="shadow w-1/2 rounded border-2 border-gray-400 flex my-1 relative">
          <div className="border-r-8 h-6 rounded-r absolute flex border-gray-400 ml-24 mt-2 z-10"></div>
          <div
            className={`${batteryColor} text-xs font-bold leading-none flex items-center justify-center m-1 py-4 text-center text-white`}
            style={{ width: batteryWidth }}
          >
            <div className="absolute left-2 mx-8 text-gray-700 dark:text-custom-light-gray">
              {batterySOC}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryIndicator;
