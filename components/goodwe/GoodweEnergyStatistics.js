import React from "react";
import {
  IoFlashSharp,
  IoSpeedometerOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { PiSolarPanelFill } from "react-icons/pi";
import { RiBattery2ChargeLine } from "react-icons/ri";
import { BsCalendarMonth } from "react-icons/bs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Info } from "lucide-react";

const GoodweEnergyStatistics = ({
  goodwePlant,
  t,
  theme,
  formatValueWithDecimals,
  batteryLevel,
  todayPVGeneration,
}) => {
  const stats = [
    {
      icon: IoFlashSharp,
      title: t("currentPower"),
      value: formatValueWithDecimals(goodwePlant?.kpi?.pac || 0, "kW"),
      tooltip: t("currentPowerTooltip"),
    },
    {
      icon: PiSolarPanelFill,
      title: t("totalCapacity"),
      value: formatValueWithDecimals(goodwePlant?.info?.capacity || 0, "kW"),
      tooltip: t("totalCapacityTooltip"),
    },
    {
      icon: RiBattery2ChargeLine,
      title: t("batteryCapacity"),
      value: formatValueWithDecimals(
        goodwePlant?.info?.battery_capacity || 0,
        "kW"
      ),
      tooltip: t("batteryCapacityTooltip"),
    },
    {
      icon: IoTimeOutline,
      title: t("todayGeneration"),
      value: formatValueWithDecimals(todayPVGeneration || 0, "kW"),
      tooltip: t("todayGenerationTooltip"),
    },
    {
      icon: BsCalendarMonth,
      title: t("monthlyGeneration"),
      value: formatValueWithDecimals(
        goodwePlant?.kpi?.month_generation || 0,
        "kW"
      ),
      tooltip: t("monthlyGenerationTooltip"),
    },
    {
      icon: IoSpeedometerOutline,
      title: t("totalGeneration"),
      value: formatValueWithDecimals(goodwePlant?.kpi?.total_power || 0, "kW"),
      tooltip: t("totalGenerationTooltip"),
    },
  ];

  return (
    <section
      className={`bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 md:pb-8 mb-6 backdrop-blur-sm shadow-lg ${
        batteryLevel ? "xl:min-w-[40vw]" : "xl:min-w-[calc(50%-36px)]"
      }`}
    >
      <h2 className="text-xl mb-6 text-left text-custom-dark-blue dark:text-custom-yellow">
        {t("energyStatistics")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {stats.map(({ icon: Icon, title, value, tooltip }, index) => (
          <div
            key={index}
            className="relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md flex flex-col items-center gap-3 hover:scale-105 transform transition-transform duration-700"
          >
            <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
              <Icon className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
            </div>
            <p className="mt-6 text-base font-medium text-slate-600 dark:text-slate-300">
              {title}
            </p>
            <div className="text-custom-dark-blue dark:text-custom-yellow flex items-baseline gap-1">
              <span
                className="text-xl font-bold truncate max-w-[120px]"
                title={value}
              >
                {value.split(" ")[0]}
              </span>
              <span className="text-sm">kW</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-custom-dark-blue dark:text-custom-yellow cursor-help absolute top-2 right-2" />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm max-w-xs"
                >
                  <p className="text-sm">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GoodweEnergyStatistics;
