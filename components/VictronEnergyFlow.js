"use client";

import React, { useState, useCallback, useRef } from "react";
import { useTranslation } from "next-i18next";
import { Home, UtilityPole, ChevronRight, ChevronLeft } from "lucide-react";
import { FaSolarPanel, FaBatteryFull } from "react-icons/fa";
import EnergyLoadingClock from "@/components/EnergyLoadingClock";
import useDeviceType from "@/hooks/useDeviceType";

const VictronEnergyFlow = ({ plantData, fetchRealtimeData }) => {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useDeviceType();
  const [isBlinking, setIsBlinking] = useState(false);
  const lastUpdatedRef = useRef(new Date().toLocaleTimeString());

  // Extract the relevant data from the extended array
  const processPlantData = (data) => {
    if (!data?.extended) return {};

    const getValue = (code) => {
      const item = data.extended.find((item) => item.code === code);
      return item?.rawValue || item?.formattedValue || "N/A";
    };

    return {
      // Find and extract the raw values from the extended array
      acInput: getValue("ac_in") || "0 W",
      generator: getValue("generator") || "-",
      soc: getValue("bs") || "N/A",
      batteryVoltage: getValue("bv") || "N/A",
      batteryCurrent: getValue("bc") || "N/A",
      batteryState: getValue("bst") || "N/A",
      solarYield: getValue("solar_yield") || "N/A",
      load: getValue("consumption") || "N/A",
      inverterStatus: getValue("S") || "Inverting",
    };
  };

  // Process the plant data
  const {
    acInput = "0 W",
    generator = "-",
    soc = "100.0 %",
    batteryVoltage = "52.22 V",
    batteryCurrent = "0.00 A",
    batteryState = "En reposo",
    solarYield = "100 W",
    load = "86 W",
    inverterStatus = "Invirtiendo",
  } = processPlantData(plantData);

  const handleRealtimeUpdate = useCallback(() => {
    fetchRealtimeData();
    lastUpdatedRef.current = new Date().toLocaleTimeString();
    setIsBlinking(true);
    const timer = setTimeout(() => setIsBlinking(false), 300);
    return () => clearTimeout(timer);
  }, [fetchRealtimeData]);

  // Helper function to extract numeric value from power strings
  const extractPowerValue = (powerString) => {
    const match = String(powerString).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const renderFlow = useCallback(
    (fromValue, toValue, direction) => {
      const fromPower = extractPowerValue(fromValue);
      const toPower = extractPowerValue(toValue);

      if (fromPower <= 0 || toPower <= 0) return null;

      const FlowIcon = isMobile
        ? ChevronRight
        : direction === "right"
        ? ChevronRight
        : ChevronLeft;

      const flowClass = isMobile
        ? "animate-flow-right"
        : direction === "right"
        ? "animate-flow-right"
        : "animate-flow-left";

      return (
        <div className="relative flex items-center justify-center gap-1 py-4 group">
          <div className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 rounded-full opacity-20 group-hover:opacity-40 transition-all duration-300 bg-custom-yellow/30" />
          <div
            className={`flex ${
              isMobile && direction === "left"
                ? "scale-x-[-1] -scale-y-[1]"
                : ""
            } ${direction && !isMobile === "left" ? "" : "gap-3"}`}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative w-6 flex items-center justify-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]"
              >
                <FlowIcon
                  className={`
                    text-custom-yellow 
                    ${flowClass} relative z-10
                    transition-transform hover:scale-110
                  `}
                  size={isMobile ? 28 : 40}
                  strokeWidth={2.5}
                  style={{ animationDelay: `${i * 200}ms` }}
                />
                <div
                  className={`
                    absolute inset-0 blur-md -z-10 
                    bg-custom-yellow/30 
                    ${flowClass}
                  `}
                  style={{
                    animationDelay: `${i * 200}ms`,
                    transform: "scale(1.2)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    },
    [isMobile]
  );

  const renderMobileLayout = () => {
    return (
      <div className="relative flex flex-col items-center">
        <div className="w-[180px] flex flex-col items-center mb-32">
          <FaSolarPanel className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-custom-dark-blue dark:text-custom-yellow text-[72px] lg:text-[150px] font-group-hover:scale-105 transition-transform mb-2" />
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg shadow-md w-full text-center">
            <span className="block text-sm text-slate-600 dark:text-slate-300 text-nowrap">
              {t("Cargador FV")}
            </span>
            <span
              className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                isBlinking ? "animate-double-blink" : ""
              }`}
            >
              {solarYield}
            </span>
          </div>
        </div>

        <div className="relative w-full max-w-[400px]">
          <div className="absolute -top-24 left-1/4 -translate-x-1/2 w-24 h-24 flex items-center justify-center transform -rotate-[83deg]">
            {renderFlow(solarYield, load, "left")}
          </div>

          <div className="flex justify-between items-end gap-4 md:gap-24 mt-6">
            <div className="w-[180px]">
              <div className="flex flex-col items-center">
                <FaBatteryFull className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-custom-dark-blue dark:text-custom-yellow text-[72px] group-hover:scale-105 transition-transform mb-2" />
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg shadow-md w-full text-center">
                  <span className="block text-sm text-slate-600 dark:text-slate-300 text-nowrap">
                    {t("Batería")}
                  </span>
                  <span
                    className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                      isBlinking ? "animate-double-blink" : ""
                    }`}
                  >
                    {soc}
                  </span>
                  <span className="block text-xs text-slate-600 dark:text-slate-300">
                    {batteryVoltage} | {batteryCurrent}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-[180px]">
              <div className="flex flex-col items-center">
                <Home
                  className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-custom-dark-blue dark:text-custom-yellow group-hover:scale-105 transition-transform mb-2"
                  strokeWidth={2.5}
                  size={80}
                />
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg shadow-md w-full text-center">
                  <span className="block text-sm text-slate-600 dark:text-slate-300 text-nowrap">
                    {t("Cargas CA")}
                  </span>
                  <span
                    className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                      isBlinking ? "animate-double-blink" : ""
                    }`}
                  >
                    {load}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 mb-6 backdrop-blur-sm">
      <div className="mb-8">
        <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4 flex items-center gap-2">
          {t("Real-Time Energy Flow")}
          <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
            ({inverterStatus})
          </span>
        </h2>
        {isMobile ? (
          <div className="flex items-center gap-2 justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t("lastUpdated")}: {lastUpdatedRef.current}
            </span>
            <EnergyLoadingClock
              duration={15}
              onComplete={handleRealtimeUpdate}
            />
          </div>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col items-end">
            <EnergyLoadingClock
              duration={15}
              onComplete={handleRealtimeUpdate}
            />
            <span className="absolute top-4 right-16 max-w-36">
              {t("lastUpdated")}: {lastUpdatedRef.current}
            </span>
          </div>
        )}
      </div>

      <div className="md:hidden">{renderMobileLayout()}</div>

      <div className="hidden md:flex flex-row justify-between items-end gap-8">
        <div className="w-1/3 relative flex flex-col items-center">
          <div className="group flex flex-col items-center gap-4 w-full">
            <div className="absolute inset-0 w-full h-52 -top-6 rounded-full bg-gray-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
            <Home
              className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-custom-dark-blue dark:text-custom-yellow group-hover:scale-105 transition-transform mb-2"
              strokeWidth={2}
              size={isTablet ? 72 : 150}
            />
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg shadow-md group-hover:shadow-xl w-full text-center z-0">
              <span className="block text-sm text-slate-600 dark:text-slate-300">
                {t("Cargas CA")}
              </span>
              <span
                className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                  isBlinking ? "animate-double-blink" : ""
                }`}
              >
                {load}
              </span>
            </div>
          </div>
          <div className="absolute -right-12 top-[20%] lg:top-[40%] -translate-y-1/2">
            {renderFlow(solarYield, load, "left")}
          </div>
        </div>

        <div className="w-1/3 relative flex flex-col items-center">
          <div className="group flex flex-col items-center gap-4 w-full relative">
            <div className="absolute inset-0 w-full h-52 -top-6 rounded-full bg-gray-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
            <FaSolarPanel className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-custom-dark-blue dark:text-custom-yellow text-[72px] lg:text-[150px] group-hover:scale-105 transition-transform mb-2" />
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg shadow-md group-hover:shadow-xl w-full text-center z-0">
              <span className="block text-sm text-slate-600 dark:text-slate-300">
                {t("Cargador FV")}
              </span>
              <span
                className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                  isBlinking ? "animate-double-blink" : ""
                }`}
              >
                {solarYield}
              </span>
            </div>
          </div>
        </div>

        <div className="w-1/3 relative flex flex-col items-center">
          <div className="absolute -left-12 top-[20%] lg:top-[40%] -translate-y-1/2">
            {renderFlow(solarYield, batteryCurrent, "right")}
          </div>
          <div className="group flex flex-col items-center gap-4 w-full">
            <div className="absolute inset-0 w-full h-52 -top-6 rounded-full bg-gray-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
            <FaBatteryFull className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-custom-dark-blue dark:text-custom-yellow text-[72px] lg:text-[150px] group-hover:scale-105 transition-transform mb-2" />
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg shadow-md group-hover:shadow-xl w-full text-center z-0">
              <span className="block text-sm text-slate-600 dark:text-slate-300">
                {t("Batería")}
              </span>
              <span
                className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                  isBlinking ? "animate-double-blink" : ""
                }`}
              >
                {soc}
              </span>
              <span className="block text-xs text-slate-600 dark:text-slate-300 mt-1">
                {batteryVoltage} | {batteryCurrent}
              </span>
              <span className="block text-xs text-slate-600 dark:text-slate-300 mt-1">
                {batteryState}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictronEnergyFlow;
