"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { Home, Info } from "lucide-react";
import { FaSolarPanel, FaBatteryFull } from "react-icons/fa";
import {
  BsLightningChargeFill,
  BsChevronRight,
  BsChevronLeft,
} from "react-icons/bs";
import BatteryIndicator from "@/components/BatteryIndicator";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

const PowerCard = ({ title, value, unit = "W", icon: Icon, tooltipKey }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md",
        "rounded-xl shadow-md p-4 text-center transition-all",
        "flex flex-col gap-3 justify-center items-center"
      )}
    >
      <Icon className="text-4xl text-custom-dark-blue dark:text-custom-yellow" />
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
          {title}
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="text-slate-500 dark:text-slate-400 h-5 w-5 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{t(`energyFlow.tooltips.${tooltipKey}`)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-2xl font-bold text-custom-dark-blue dark:text-custom-yellow">
        {value} {unit}
      </p>
    </div>
  );
};

const EnergyFlowAnimation = ({ amount, direction, tooltipKey }) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex items-center justify-center py-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-2 transition-transform",
            direction === "right" ? "animate-flow-right" : "animate-flow-left"
          )}
          style={{ animationDelay: `${i * 200}ms` }}
        >
          {direction === "right" ? (
            <BsChevronRight className="text-yellow-400 text-3xl drop-shadow-md" />
          ) : (
            <BsChevronLeft className="text-yellow-400 text-3xl drop-shadow-md" />
          )}
        </div>
      ))}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="absolute bottom-0 text-sm text-slate-500 dark:text-slate-300 cursor-help">
              {amount} W
            </p>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{t(`energyFlow.tooltips.${tooltipKey}`)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const VictronEnergyFlow = ({ plantData, fetchRealtimeData }) => {
  const { t } = useTranslation();
  const [isBlinking, setIsBlinking] = useState(false);
  const lastUpdatedRef = useRef(new Date().toLocaleTimeString());

  // Simulated data
  const simulatedData = {
    acInput: 1200,
    solarYield: 3500,
    batterySoc: 85.5,
    load: 2800,
  };

  const handleRealtimeUpdate = useCallback(() => {
    fetchRealtimeData();
    lastUpdatedRef.current = new Date().toLocaleTimeString();
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 300);
  }, [fetchRealtimeData]);

  const { acInput, solarYield, batterySoc, load } = simulatedData;

  return (
    <div className="bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-900/60 dark:to-slate-900/40 rounded-3xl shadow-2xl p-8 backdrop-blur-md">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-custom-dark-blue dark:text-custom-yellow">
            {t("energyFlow.systemTitle")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("energyFlow.systemDescription")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("energyFlow.labels.lastUpdate")}: {lastUpdatedRef.current}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PowerCard
          title={t("energyFlow.labels.homeConsumption")}
          value={load}
          icon={Home}
          tooltipKey="homeConsumption"
        />
        <PowerCard
          title={t("energyFlow.labels.solarProduction")}
          value={solarYield}
          icon={FaSolarPanel}
          tooltipKey="solarProduction"
        />
        <PowerCard
          title={t("energyFlow.labels.gridInput")}
          value={acInput}
          icon={BsLightningChargeFill}
          tooltipKey="gridInput"
        />
        <div className="flex justify-center items-center">
          <BatteryIndicator soc={batterySoc} />
        </div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <EnergyFlowAnimation
          amount={solarYield}
          direction="right"
          tooltipKey="solarToHome"
        />
        <EnergyFlowAnimation
          amount={acInput}
          direction="right"
          tooltipKey="gridToHome"
        />
        <EnergyFlowAnimation
          amount={solarYield}
          direction="left"
          tooltipKey="solarToBattery"
        />
      </div>
    </div>
  );
};

export default VictronEnergyFlow;
