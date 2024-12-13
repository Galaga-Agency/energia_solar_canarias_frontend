import React from "react";
import { ChevronDown, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

const SolarEdgeEquipmentDetails = ({ equipmentData, t }) => {
  const [openSections, setOpenSections] = React.useState({});
  const contentRefs = React.useRef({});

  if (!equipmentData) return null;

  const sections = Object.entries(equipmentData).map(([sectionKey, items]) => ({
    key: sectionKey,
    title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
    count: items.reduce((acc, item) => acc + (item.count || 0), 0),
    items,
  }));

  const renderItem = (item, isNested = false) => {
    const info = Object.entries(item)
      .filter(
        ([key]) =>
          !["name", "model", "serialNumber", "items", "count"].includes(key)
      )
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    return (
      <div
        className={`flex items-center justify-between py-2 ${
          isNested ? "pl-8" : "px-4"
        } hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200`}
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-700 dark:text-gray-300">
            {item.name || item.model || item.serialNumber}
          </span>
          {info && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-sm">{info}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {item.count ? (
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            ({item.count})
          </span>
        ) : null}
      </div>
    );
  };

  const renderItems = (items, parentKey = "") => (
    <>
      {items.map((item, index) => {
        const key = `${parentKey}-${index}`;
        return (
          <React.Fragment key={key}>
            {renderItem(item)}
            {item.items?.length > 0 && (
              <div className="pl-4">{renderItems(item.items, key)}</div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );

  return (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg backdrop-blur-sm shadow-lg">
      <h2 className="text-xl p-4 text-custom-dark-blue dark:text-custom-yellow border-b border-gray-200 dark:border-gray-700">
        {t("equipment")}
      </h2>

      {sections.map(({ key, title, count, items }) => (
        <div
          key={key}
          className="border-b border-gray-200 dark:border-gray-700 last:border-0"
        >
          <button
            onClick={() =>
              setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-custom-dark-blue dark:text-custom-yellow font-medium">
                {title}
              </span>
              {count > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({count})
                </span>
              )}
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ease-in-out transform group-hover:text-custom-dark-blue dark:group-hover:text-custom-yellow ${
                openSections[key] ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            ref={(el) => (contentRefs.current[key] = el)}
            className={`overflow-hidden transition-all duration-300 ease-in-out`}
            style={{
              maxHeight: openSections[key]
                ? contentRefs.current[key]?.scrollHeight + "px"
                : "0",
            }}
          >
            <div className="pb-2">{renderItems(items)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SolarEdgeEquipmentDetails;
