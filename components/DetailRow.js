import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { Info } from "lucide-react";

const DetailRow = ({ icon: Icon, label, value = "N/A", tooltip }) => {
  const renderIcon = () => {
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    if (typeof Icon === "function") {
      return (
        <Icon className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
      );
    }
    return null;
  };

  const renderValue = () => {
    if (React.isValidElement(value)) {
      return value;
    }
    return <span>{value}</span>;
  };

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2">
        {renderIcon()}
        <div className="flex items-center">
          <strong className="text-lg dark:text-custom-light-gray">
            {label}
          </strong>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-custom-dark-blue dark:text-custom-yellow cursor-help ml-2" />
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm"
                >
                  <p className="font-medium">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow cursor-help">
              {renderValue()}
            </div>
          </TooltipTrigger>
          {tooltip && (
            <TooltipContent
              side="left"
              className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm"
            >
              <p className="font-medium">{tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DetailRow;
