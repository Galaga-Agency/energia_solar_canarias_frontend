import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/Tooltip";
import { Info } from "lucide-react";

const EnergyBlock = ({
  isBlinking,
  title,
  value,
  unit,
  icon: Icon,
  tooltip,
  details,
  className,
}) => {
  return (
    <div
      className={`relative bg-white dark:bg-custom-dark-blue rounded-lg p-6 backdrop-blur-sm shadow-lg flex flex-col h-full group 
      transition-all duration-700 ease-in-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
      hover:translate-y-[-4px] ${className} z-10`}
    >
      {/* Icon Tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="absolute top-4 right-4">
            <Info className="w-5 h-5 text-custom-dark-blue/60 dark:text-custom-yellow/60 transition-all duration-300 hover:scale-110 hover:text-custom-dark-blue dark:hover:text-custom-yellow" />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-xs bg-gray-200 dark:bg-gray-800 text-sm p-3 rounded-lg shadow"
          >
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute -top-10 w-20 h-20 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
          <Icon className="text-5xl text-custom-dark-blue dark:text-custom-yellow transition-transform duration-700 ease-in-out group-hover:scale-110" />
        </div>

        <div className="text-center mt-12 space-y-2">
          <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
            {title}
          </h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-blue-700 dark:from-custom-yellow dark:to-yellow-500 bg-clip-text text-transparent">
            {value !== null ? `${value} ${unit}` : "-"}
          </p>
        </div>
      </div>

      {details && (
        <div className="w-full mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-4">
          {details}
        </div>
      )}
    </div>
  );
};

export default EnergyBlock;
