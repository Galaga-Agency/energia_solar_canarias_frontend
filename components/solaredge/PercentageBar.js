import React from "react";
import { Info } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import {
  roundToWhole,
  roundToOneDecimal,
  formatNumber,
} from "@/utils/roundNumbers";

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
  // Convert values to numbers, handle null/undefined cases, and convert from W to kW
  const numericValue1 = (Number(value1) || 0) / 1000;
  const numericValue2 = (Number(value2) || 0) / 1000;

  // Calculate total and percentages
  const total = numericValue1 + numericValue2;
  const percentage1 =
    total > 0 ? roundToOneDecimal((numericValue1 / total) * 100) : 0;
  const percentage2 =
    total > 0 ? roundToOneDecimal((numericValue2 / total) * 100) : 0;

  // Format display values
  const displayValue1 = formatNumber(roundToOneDecimal(numericValue1));
  const displayValue2 = formatNumber(roundToOneDecimal(numericValue2));

  return (
    <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
          {title}
        </h3>
        {tooltip && (
          <Popover showArrow offset={20} placement="bottom">
            <PopoverTrigger>
              <Info className="h-4 w-4 text-custom-dark-blue dark:text-custom-yellow cursor-help" />
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2">
                <div className="text-small">{tooltip}</div>
              </div>
            </PopoverContent>
          </Popover>
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
            className="w-3 h-3 rounded-sm shrink-0"
            style={{ backgroundColor: color1 }}
          />
          <span className="text-custom-dark-blue dark:text-custom-light-gray">
            {label1}: {displayValue1} kW ({percentage1}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm shrink-0"
            style={{ backgroundColor: color2 }}
          />
          <span className="text-custom-dark-blue dark:text-custom-light-gray">
            {label2}: {displayValue2} kW ({percentage2}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default PercentageBar;
