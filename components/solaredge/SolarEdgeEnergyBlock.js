import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Info } from "lucide-react";

const SolarEdgeEnergyBlock = ({
  isBlinking,
  title,
  value,
  unit,
  icon: Icon,
  tooltip,
  details,
  className = "",
}) => {
  if (!Icon) {
    console.warn("Icon prop is required for SolarEdgeEnergyBlock");
    return null;
  }

  return (
    <div className={`relative h-full w-full`}>
      {/* Icon Tooltip */}
      <Popover showArrow offset={20} placement="bottom">
        <PopoverTrigger>
          <Info className="w-5 h-5 text-custom-dark-blue/60 dark:text-custom-yellow/60 transition-all duration-300 hover:scale-110 hover:text-custom-dark-blue dark:hover:text-custom-yellow absolute top-4 right-4" />
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small">{tooltip}</div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="overflow-auto absolute -top-10 w-32 h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
          <Icon className="w-24 h-24 text-custom-dark-blue dark:text-custom-yellow transition-transform duration-700 ease-in-out group-hover:scale-110" />
        </div>

        <div className="text-center mt-36 space-y-2">
          <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
            {title}
          </h3>
          <p
            className={`text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-blue-700 dark:from-custom-yellow dark:to-yellow-500 bg-clip-text text-transparent ${
              isBlinking ? "animate-double-blink" : ""
            }`}
          >
            {value !== null && value !== undefined ? `${value} ${unit}` : "-"}
          </p>
        </div>
      </div>
      <div className="absolute bottom-0">
        {details && (
          <div className="w-full mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-4">
            {details}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolarEdgeEnergyBlock;
