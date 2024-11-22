import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
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
        <Icon className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
      );
    }
    return null;
  };

  const formatValue = (text) => {
    if (typeof text !== "string" || !isMobile) return text; // Only format on mobile

    return text
      .split(" ") // Split the value into words
      .map((word) => {
        if (word.length > 10) {
          // Break the word at 10 characters
          const firstPart = word.slice(0, 10);
          const restPart = word.slice(10);
          return `${firstPart}-\n${restPart}`; // Break and add the rest on a new line
        }
        return word;
      })
      .join(" "); // Rejoin the formatted words into a single string
  };

  const renderValue = () => {
    const formattedValue = formatValue(value);

    return (
      <span
        className="text-right text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow whitespace-pre-wrap break-words"
        title={value} // Show full text on hover
      >
        {formattedValue}
      </span>
    );
  };

  return (
    <div className="flex items-start justify-between gap-2 w-full">
      <div className="flex items-center gap-2">
        {renderIcon()}
        <strong className="text-lg dark:text-custom-light-gray whitespace-nowrap">
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
      <div className="text-right max-w-[70%]">{renderValue()}</div>
    </div>
  );
};

export default DetailRow;
