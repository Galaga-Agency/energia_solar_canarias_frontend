import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Info } from "lucide-react";
import useDeviceType from "@/hooks/useDeviceType";

const DetailRow = ({ icon: Icon, label, value = "N/A", tooltip }) => {
  const { isMobile } = useDeviceType();

  const renderIcon = () => {
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    if (typeof Icon === "function") {
      return (
        <Icon className="text-2xl text-custom-dark-blue dark:text-custom-light-gray shrink-0" />
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-1 xl:gap-2 w-full max-w-full overflow-hidden">
      <div className="flex items-center gap-2 overflow-hidden">
        {renderIcon()}
        <strong className="text-lg dark:text-custom-light-gray text-wrap overflow-hidden text-ellipsis">
          {label}
        </strong>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span role="button" tabIndex={0} className="cursor-help ml-2">
                  <Info className="h-4 w-4 text-custom-dark-blue dark:text-custom-yellow" />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm max-w-xs"
              >
                <p className="font-medium">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="text-left xl:text-right xl:max-w-[50%] overflow-hidden text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ml-4">
        {value}
      </div>
    </div>
  );
};

export default DetailRow;
