import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import victronBlue from "@/public/assets/logos/victron-energy-azul.png";
import victronYellow from "@/public/assets/logos/victron-energy-amarillo.png";
import { PiSolarPanelLight } from "react-icons/pi";
import { TbBatteryAutomotive, TbPlug } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { useParams } from "next/navigation";
import { selectUser } from "@/store/slices/userSlice";
import EnergyBlock from "./EnergyBlock";
import {
  fetchVictronEnergyRealtimeData,
  selectLoadingDetails,
} from "@/store/slices/plantsSlice";
import BatteryIndicator from "@/components/BatteryIndicator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/Tooltip";
import { Info } from "lucide-react";
import VictronEnergyFlowSkeleton from "../loadingSkeletons/VictronEnergyFlowSkeleton";
import useDeviceType from "@/hooks/useDeviceType";
import EnergyLoadingClock from "../EnergyLoadingClock";
import { GiElectric } from "react-icons/gi";
import { IoSunnyOutline, IoSunnySharp } from "react-icons/io5";
import Image from "next/image";

const VictronEnergyFlow = () => {
  const dispatch = useDispatch();
  const [energyData, setEnergyData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const theme = useSelector(selectTheme);
  const { t } = useTranslation();
  const params = useParams();
  const plantId = params?.plantId;
  const user = useSelector(selectUser);
  const token = user?.tokenIdentificador;
  const isComponentLoading = useSelector(selectLoadingDetails);
  const { isMobile } = useDeviceType();
  const lastUpdatedRef = useRef(new Date().toLocaleString());
  const [isBlinking, setIsBlinking] = useState(false);

  const processRecords = (records) => {
    if (!records) return null;

    const findValue = (description, device = null) => {
      const record = records.find(
        (r) =>
          r.description === description && (device ? r.Device === device : true)
      );
      return record?.formattedValue;
    };

    const findNumericValue = (description, device = null) => {
      const value = findValue(description, device);
      return value ? parseFloat(value) : 0;
    };

    const findAttributeValue = (code) => {
      if (code === "solar_yield") {
        // Calculate total from components
        const l1 = findNumericValue("PV - AC-coupled on output L1");
        const l2 = findNumericValue("PV - AC-coupled on output L2");
        const l3 = findNumericValue("PV - AC-coupled on output L3");
        const dc = findNumericValue("PV - DC-coupled");
        return l1 + l2 + l3 + dc;
      }
      return 0;
    };

    const findMPPTValue = (records, mpptId) => {
      const mpptRecords = records.filter(
        (r) => r.Device === "Solar Charger" && r.instance === mpptId
      );

      // If no records found for this MPPT, return null
      if (!mpptRecords.length) return null;

      const current =
        Math.round(
          (parseFloat(
            mpptRecords.find((r) => r.idDataAttribute === 442)?.rawValue || 0
          ) /
            parseFloat(
              mpptRecords.find((r) => r.idDataAttribute === 86)?.rawValue || 1
            )) *
            10
        ) / 10;

      return {
        voltage: parseFloat(
          mpptRecords.find((r) => r.idDataAttribute === 86)?.formattedValue
        ),
        current: current,
        power: parseFloat(
          mpptRecords.find((r) => r.idDataAttribute === 442)?.formattedValue
        ),
      };
    };

    // Get all active MPPT instances
    const getMPPTInstances = (records) => {
      return [
        ...new Set(
          records
            .filter((r) => r.Device === "Solar Charger")
            .map((r) => r.instance)
        ),
      ];
    };

    const mpptInstances = getMPPTInstances(records);
    const mpptData = {};
    mpptInstances.forEach((instance) => {
      const mpptValue = findMPPTValue(records, instance);
      if (mpptValue) {
        mpptData[instance] = mpptValue;
      }
    });

    const pvCharger = {
      power: findNumericValue("PV - DC-coupled"),
      mpptData,
    };

    const getInverterPhases = (records) => {
      return [
        ...new Set(
          records
            .filter(
              (r) =>
                r.description?.includes("L") && r.description?.includes("Power")
            )
            .map((r) => r.description.match(/L(\d)/)?.[1])
            .filter(Boolean)
        ),
      ].sort();
    };

    const phases = getInverterPhases(records);
    const inverterData = {};

    phases.forEach((phase) => {
      inverterData[`L${phase}`] = {
        power: findNumericValue(`L${phase} Power`),
        voltage: findNumericValue(`L${phase} Voltage`),
        current: findNumericValue(`L${phase} Current`),
      };
    });

    const inverter = {
      ...inverterData,
      totalPower: Object.values(inverterData).reduce(
        (sum, phase) => sum + phase.power,
        0
      ),
    };

    const generator = {
      status: findValue("Manual start", "Generator"),
      uptime: findValue("Manual start timer", "Generator"),
    };

    const findFromToGrid = () => {
      const fromToGridRecord = records.find((r) => r.code === "from_to_grid");
      return fromToGridRecord ? fromToGridRecord.formattedValue : "-";
    };

    const fromToGrid = findFromToGrid();

    return {
      acInput: {
        state: findValue("AC-Input", "System overview"),
      },
      battery: {
        soc: findNumericValue("Battery SOC"),
        voltage: findNumericValue("Voltage", "Battery Monitor"),
        current: findNumericValue("Current", "Battery Monitor"),
        temp: findNumericValue("Battery temperature"),
        dcPower: findNumericValue("Battery Power"),
        state: findValue("Battery state"),
      },
      inverter,
      pvCharger,
      loads: {
        L1: {
          power: findNumericValue("AC Consumption L1"),
          frequency: findNumericValue("Phase 1 frequency"),
        },
        L2: {
          power: findNumericValue("AC Consumption L2"),
          frequency: findNumericValue("Phase 2 frequency"),
        },
        L3: {
          power: findNumericValue("AC Consumption L3"),
          frequency: findNumericValue("Phase 3 frequency"),
        },
        totalPower:
          findNumericValue("AC Consumption L1") +
          findNumericValue("AC Consumption L2") +
          findNumericValue("AC Consumption L3"),
      },
      solarYield: findAttributeValue("solar_yield"),
      generator,
      fromToGrid,
    };
  };

  const fetchRealtimeData = useCallback(async () => {
    if (!plantId || !token || isFetching) return;
    setIsFetching(true);

    try {
      const result = await dispatch(
        fetchVictronEnergyRealtimeData({
          plantId,
          token,
        })
      ).unwrap();

      const processedData = processRecords(result?.records);
      if (processedData) {
        setEnergyData(processedData);
        lastUpdatedRef.current = new Date().toLocaleString();
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 300);
      }
    } catch (err) {
      console.error("Error fetching real-time data:", err);
    } finally {
      setIsFetching(false);
    }
  }, [dispatch, plantId, token, isFetching]);

  useEffect(() => {
    fetchRealtimeData();
    const intervalId = setInterval(fetchRealtimeData, 15000); // Re-fetch every 15 seconds
    lastUpdatedRef.current = new Date().toLocaleString();
    return () => clearInterval(intervalId);
  }, [fetchRealtimeData]);

  if (isComponentLoading || !energyData) {
    return <VictronEnergyFlowSkeleton theme={theme} />;
  }

  // console.log("Real-Time Data Response:", energyData);

  return (
    <>
      {isMobile ? (
        <div className="flex items-center gap-2 justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("lastUpdated")}: {lastUpdatedRef.current}
          </span>
          <EnergyLoadingClock
            duration={15}
            onComplete={fetchRealtimeData}
            isPaused={isFetching}
          />
        </div>
      ) : (
        <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col items-end">
          <EnergyLoadingClock
            duration={15}
            onComplete={fetchRealtimeData}
            isPaused={isFetching}
          />
          <span className="absolute top-4 right-16 max-w-36">
            {t("lastUpdated")}: {lastUpdatedRef.current}
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <EnergyBlock
            isBlinking={isBlinking}
            title={t("victronEnergyFlow.acInput.title")}
            value={
              energyData?.fromToGrid !== undefined
                ? energyData?.fromToGrid
                : "-"
            }
            unit={energyData?.fromToGrid > 0 ? "W" : ""}
            icon={TbPlug}
            tooltip={t("victronEnergyFlow.acInput.tooltip")}
          />

          {/* Generator Block */}
          <EnergyBlock
            isBlinking={isBlinking}
            title={t("victronEnergyFlow.generator.title")}
            value={
              energyData?.generator?.power !== undefined
                ? energyData?.generator?.power
                : "-"
            }
            unit={energyData?.generator?.power > 0 ? "W" : ""}
            icon={TbBatteryAutomotive}
            tooltip={t("victronEnergyFlow.generator.tooltip")}
            details={
              energyData?.generator?.status && (
                <div className="space-y-2">
                  {/* Status */}
                  <div className="flex justify-between items-center px-2 py-1">
                    <span>{t("victronEnergyFlow.generator.status")}</span>
                    <span className="font-medium text-custom-dark-blue dark:text-custom-yellow">
                      {energyData?.generator?.status === "Stopped"
                        ? t("victronEnergyFlow.generator.stopped")
                        : t("victronEnergyFlow.generator.running")}
                    </span>
                  </div>

                  {/* Uptime */}
                  <div className="flex justify-between items-center px-2 py-1">
                    <span>{t("victronEnergyFlow.generator.uptime")}</span>
                    <span className="font-medium text-custom-dark-blue dark:text-custom-yellow">
                      {energyData?.generator?.uptime ||
                        t("victronEnergyFlow.generator.noData")}
                    </span>
                  </div>
                </div>
              )
            }
          />

          {/* Battery Block */}
          <div
            className="relative bg-white dark:bg-custom-dark-blue rounded-lg p-6 backdrop-blur-sm shadow-lg flex flex-col flex-grow group 
  transition-all duration-700 ease-in-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
  hover:translate-y-[-4px] z-10"
          >
            {/* Info Icon */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="absolute top-4 right-4">
                  <Info className="w-5 h-5 text-custom-dark-blue/60 dark:text-custom-yellow/60 transition-all duration-300 hover:scale-110 hover:text-custom-dark-blue dark:hover:text-custom-yellow" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-gray-200 dark:bg-gray-800 text-sm p-3 rounded-lg shadow">
                  <p>{t("victronEnergyFlow.battery.tooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex-1 flex flex-col items-center justify-start relative">
              <div className="absolute -top-10 w-48 transition-transform duration-700 ease-in-out group-hover:scale-105">
                <BatteryIndicator soc={energyData?.battery.soc} />
              </div>
              <div className="text-center mt-28">
                <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                  {(() => {
                    const state = energyData?.battery.state?.toLowerCase();
                    switch (state) {
                      case "idle":
                        return t("victronEnergyFlow.battery.idle");
                      case "charging":
                        return t("victronEnergyFlow.battery.charging");
                      case "discharging":
                        return t("victronEnergyFlow.battery.discharging");
                      default:
                        return energyData?.battery.state || "-";
                    }
                  })()}
                </h3>
              </div>
            </div>

            <div className="w-full mt-6 text-sm space-y-2 border-t border-gray-200 dark:border-gray-700/50 pt-4">
              {[
                t("victronEnergyFlow.battery.voltage"),
                t("victronEnergyFlow.battery.current"),
                t("victronEnergyFlow.battery.temperature"),
              ].map((label, index) => (
                <div
                  key={label}
                  className="flex justify-between items-center px-2 py-1 rounded-md "
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {label}
                  </span>
                  <span
                    className={`font-medium text-custom-dark-blue dark:text-custom-yellow ${
                      isBlinking && "animate-double-blink"
                    }`}
                  >
                    {index === 0 && (
                      <>
                        {energyData?.battery.voltage
                          ? `${energyData?.battery.voltage} V`
                          : "-"}
                      </>
                    )}
                    {index === 1 && (
                      <>
                        {energyData?.battery.current
                          ? `${energyData?.battery.current} A`
                          : "-"}
                      </>
                    )}
                    {index === 2 && (
                      <>
                        {energyData?.battery.temp
                          ? `${energyData?.battery.temp} °C`
                          : "-"}
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column */}
        <div className="flex flex-col gap-8">
          <EnergyBlock
            isBlinking={isBlinking}
            title="Inversor FV"
            value={energyData?.inverter.totalPower}
            unit={
              typeof energyData?.inverter.totalPower === "number" ? "W" : ""
            }
            icon={FaExchangeAlt}
            tooltip={t("victronEnergyFlow.inverter.tooltip")}
            details={
              <div className="mt-4 space-y-2">
                {["L1", "L2", "L3"]
                  .filter((phase) => energyData?.inverter?.[phase]?.power)
                  .map((phase) => (
                    <div
                      key={phase}
                      className="flex justify-between items-center px-2 py-1"
                    >
                      <span>{phase}</span>
                      <span className="font-medium text-custom-dark-blue dark:text-custom-yellow">
                        {energyData?.inverter?.[phase]?.power || "No Data"} W
                      </span>
                    </div>
                  ))}
              </div>
            }
          />

          {/* Center Column - Inverter Block */}
          <div className="relative flex-grow group">
            {/* Enhanced glow effect */}
            {energyData?.acInput?.state === "Inverting" && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] transition-all duration-1000">
                <div className="absolute inset-0 rotate-180 bg-gradient-to-t from-yellow-400/40 via-green-500/40 to-transparent rounded-full blur-[100px] group-hover:blur-[120px] group-hover:scale-110 transition-all duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/40 via-green-500/40 to-transparent rounded-full blur-[100px] group-hover:blur-[120px] group-hover:scale-110 transition-all duration-1000 animate-pulse"></div>
              </div>
            )}
            <div
              className="relative bg-white dark:bg-custom-dark-blue rounded-full p-6 backdrop-blur-md shadow-lg flex flex-col items-center justify-center h-full transition-all duration-700
    group-hover:transform group-hover:scale-105
    group-hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]
    dark:group-hover:shadow-[0_20px_50px_rgba(254,_204,_27,_0.4)]"
            >
              {/* Info Icon */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="absolute top-[calc(50% - 12px)] right-4">
                    <Info className="w-5 h-5 text-custom-dark-blue/60 dark:text-custom-yellow/60 transition-all duration-300 hover:scale-110 hover:text-custom-dark-blue dark:hover:text-custom-yellow" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-gray-200 dark:bg-gray-800 text-sm p-3 rounded-lg shadow">
                    <p>{t("victronEnergyFlow.inverter.tooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="absolute -top-4 w-20 h-20 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 group-hover:shadow-lg">
                <div className="relative w-16 h-16 transform transition-all duration-700 group-hover:scale-125 group-hover:rotate-180">
                  <Image
                    src={theme === "dark" ? victronYellow : victronBlue}
                    alt="Victron Energy Logo"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="text-center mt-12 space-y-2">
                <p className="text-2xl font-bold bg-gradient-to-r from-custom-dark-blue to-blue-700 dark:from-custom-yellow dark:to-yellow-500 bg-clip-text text-transparent">
                  {energyData?.acInput?.state
                    ? t("victronEnergyFlow.acInput.state.inverting")
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          <EnergyBlock
            isBlinking={isBlinking}
            title="Potencia solar total"
            value={energyData?.solarYield}
            unit={typeof energyData?.solarYield === "number" ? "W" : ""}
            icon={IoSunnyOutline}
            tooltip={t("victronEnergyFlow.solarYield.tooltip")}
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          <EnergyBlock
            isBlinking={isBlinking}
            title={t("victronEnergyFlow.loads.title")}
            value={energyData?.loads?.totalPower || "-"}
            unit={energyData?.loads?.totalPower > 0 ? "W" : ""}
            icon={GiElectric}
            tooltip={t("victronEnergyFlow.loads.tooltip")}
            details={
              <div className="space-y-2">
                {Object.entries(energyData?.loads || {})
                  .filter(
                    ([phase, data]) => phase !== "totalPower" && data?.power
                  ) // Filter out phases without power data
                  .map(([phase, data]) => (
                    <div
                      key={phase}
                      className="flex justify-between items-center px-2 py-1"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {phase}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-custom-dark-blue dark:text-custom-yellow">
                          {data.power}W
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            }
          />

          <EnergyBlock
            isBlinking={isBlinking}
            title="Cargador PV"
            value={energyData?.pvCharger?.power}
            unit="W"
            icon={PiSolarPanelLight}
            tooltip={t("victronEnergyFlow.pvCharger.tooltip")}
            details={
              <div className="space-y-2">
                {Object.entries(energyData?.pvCharger?.mpptData || {}).map(
                  ([id, data]) => (
                    <div
                      key={id}
                      className="flex justify-between items-center px-2 py-1"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        MPPT-{id}
                      </span>
                      <div className="flex gap-4">
                        <span
                          className={`text-gray-600 dark:text-gray-400 ${
                            isBlinking && "animate-double-blink"
                          }`}
                        >
                          {data.voltage}V
                        </span>
                        <span
                          className={`text-gray-600 dark:text-gray-400 ${
                            isBlinking && "animate-double-blink"
                          }`}
                        >
                          {data.current}A
                        </span>
                        <span
                          className={`font-medium text-custom-dark-blue dark:text-custom-yellow ${
                            isBlinking && "animate-double-blink"
                          }`}
                        >
                          {data.power}W
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default VictronEnergyFlow;
