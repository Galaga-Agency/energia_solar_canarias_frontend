import React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

const PercentageBar = ({
  title,
  value1,
  value2,
  label1,
  label2,
  color1,
  color2,
  tooltip,
}) => {
  // Utility function to format numbers (e.g., 22000 -> 22k)
  const formatNumber = (value) => {
    if (value === null || value === undefined) return "0";

    // Handle different scales
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toFixed(1);
  };

  // Convert values to numbers and handle null/undefined cases
  const numericValue1 = Number(value1) || 0;
  const numericValue2 = Number(value2) || 0;

  // Calculate total and percentages
  const total = numericValue1 + numericValue2;
  const percentage1 =
    total > 0 ? ((numericValue1 / total) * 100).toFixed(1) : 0;
  const percentage2 =
    total > 0 ? ((numericValue2 / total) * 100).toFixed(1) : 0;

  // Format display values
  const displayValue1 = formatNumber(numericValue1);
  const displayValue2 = formatNumber(numericValue2);

  return (
    <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
          {title}
        </h3>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-custom-dark-blue dark:text-custom-yellow cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Progress Bar */}
      <div className="flex items-center w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-inner">
        <div
          style={{ width: `${percentage1}%`, backgroundColor: color1 }}
          className="h-full transition-all duration-300"
        />
        <div
          style={{ width: `${percentage2}%`, backgroundColor: color2 }}
          className="h-full transition-all duration-300"
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-3 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: color1 }}
          />
          <span className="text-custom-dark-blue dark:text-custom-light-gray">
            {label1}: {displayValue1} kWh ({percentage1}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: color2 }}
          />
          <span className="text-custom-dark-blue dark:text-custom-light-gray">
            {label2}: {displayValue2} kWh ({percentage2}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default PercentageBar;
