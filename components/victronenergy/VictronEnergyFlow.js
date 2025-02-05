import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useParams } from "next/navigation";
import { MoreVertical, UtilityPole } from "lucide-react";
import { Popover, PopoverTrigger } from "@heroui/react";
import { BsPlusCircle } from "react-icons/bs";
import { formatPowerValue } from "@/utils/powerUtils";
import { processVictronData } from "@/utils/victronDataProcessor";
import GridDetailsPopover from "./popovers/GridDetailsPopover";
import EnergyLoadingClock from "@/components/EnergyLoadingClock";
import BatteryIndicator from "@/components/BatteryIndicator";
import EnergyFlowSkeleton from "@/components/loadingSkeletons/EnergyFlowSkeleton";
import useDeviceType from "@/hooks/useDeviceType";
import { selectUser } from "@/store/slices/userSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import {
  fetchVictronEnergyRealtimeData,
  selectLoadingDetails,
} from "@/store/slices/plantsSlice";
import { PiSolarPanelLight } from "react-icons/pi";
import MpptDetailsPopover from "./popovers/MpptDetailsPopover";
import BatteryDetailsPopover from "./popovers/BatteryDetailsPopover";
import LoadsDetailsPopover from "./popovers/LoadsDetailsPopover";
import { HiOutlineHome } from "react-icons/hi";
import victronLogoLight from "@/public/assets/logos/victron-energy-azul.png";
import victronLogoDark from "@/public/assets/logos/victron-energy-amarillo.png";
import Image from "next/image";
import { TbBatteryAutomotive } from "react-icons/tb";
import { breakWordWithHyphen } from "@/utils/textUtils";
import { CiCircleMore } from "react-icons/ci";

const VictronEnergyFlow = ({ plant }) => {
  const dispatch = useDispatch();
  const [energyData, setEnergyData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkingTimeoutRef = useRef(null);
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);
  const { plantId } = useParams();
  const user = useSelector(selectUser);
  const token = user?.tokenIdentificador;
  const isComponentLoading = useSelector(selectLoadingDetails);
  const { isMobile } = useDeviceType();
  const lastUpdatedRef = useRef(new Date().toLocaleString());
  const [rawRecords, setRawRecords] = useState(null);

  const fetchRealtimeData = useCallback(async () => {
    console.log("Fetching real-time data:", {
      plantId,
      tokenAvailable: !!token,
    });

    if (!plantId || !token || isFetching) return;

    setIsFetching(true);

    try {
      const result = await dispatch(
        fetchVictronEnergyRealtimeData({ plantId, token })
      ).unwrap();

      const records = result?.data?.records || result?.records || result || [];
      const processedData = processVictronData(records);
      setRawRecords(records);
      setEnergyData(processedData);

      if (processedData) {
        setEnergyData(processedData);
        lastUpdatedRef.current = new Date().toLocaleString();

        console.log("processedData", processedData);

        setIsBlinking(true);

        if (blinkingTimeoutRef.current) {
          clearTimeout(blinkingTimeoutRef.current);
        }

        blinkingTimeoutRef.current = setTimeout(() => {
          setIsBlinking(false);
          blinkingTimeoutRef.current = null;
        }, 300);
      } else {
        console.error("No processed data available");
      }
    } catch (err) {
      console.error("Error fetching real-time data:", err);
    } finally {
      setIsFetching(false);
    }
  }, [dispatch, plantId, token]);

  useEffect(() => {
    if (plantId && token) {
      fetchRealtimeData();
    }

    const interval = setInterval(() => {
      fetchRealtimeData();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [plantId, token, fetchRealtimeData]);

  // Initial data fetch
  useEffect(() => {
    // Fetch data on initial mount
    if (plantId && token) {
      fetchRealtimeData();
    } else {
      console.warn("Cannot fetch data: Missing plantId or token");
    }
  }, [plantId, token, fetchRealtimeData]);

  useEffect(() => {
    return () => {
      if (blinkingTimeoutRef.current) {
        clearTimeout(blinkingTimeoutRef.current);
      }
    };
  }, []);

  // If component is loading or no data, show skeleton
  if (isComponentLoading || !energyData) {
    return <EnergyFlowSkeleton theme={theme} />;
  }

  // Safe data extraction with extensive fallbacks
  const gridPower = energyData.gridPower?.totalPower ?? null;
  const pvChargerPower = energyData.pvCharger?.power ?? null;
  const batteryData = energyData.battery ?? {
    soc: null,
    dcPower: null,
    state: "Unknown",
  };
  const loadsData = energyData.loads ?? { totalPower: null };
  const generatorData = energyData.generator ?? {
    status: "Stopped",
    uptime: null,
  };

  return (
    <>
      {/* Header section */}
      <div className="mb-8">
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
      </div>

      {/* Grid Layout */}
      <div className="relative w-full h-[650px] p-4">
        {/* Center Logo */}
        <div className="group absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[170px] h-[170px] md:w-[260px] md:h-[260px] z-50 shadow-xl rounded-full">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] transition-all duration-1000">
            <div className="absolute inset-0 rotate-180 bg-gradient-to-t from-yellow-400/40 via-green-500/40 to-transparent rounded-full blur-[100px] group-hover:blur-[120px] group-hover:scale-110 transition-all duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/40 via-green-500/40 to-transparent rounded-full blur-[100px] group-hover:blur-[120px] group-hover:scale-110 transition-all duration-1000 animate-pulse"></div>
          </div>
          <div className="relative bg-white/70 dark:bg-custom-dark-blue/70 rounded-full p-6 backdrop-blur-md shadow-lg flex flex-col items-center justify-center h-full transition-all duration-700 group-hover:transform group-hover:scale-105 group-hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] dark:group-hover:shadow-[0_20px_50px_rgba(254,_204,_27,_0.4)]">
            <div className="relative w-24 h-24 md:w-32 xl:h-32 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-180">
              <Image
                src={theme === "dark" ? victronLogoDark : victronLogoLight}
                alt="Victron Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Solar Block  */}
        <div className="absolute top-0 left-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg [border-bottom-right-radius:250px] [border-top-left-radius:250px] p-6 backdrop-blur-sm shadow-lg group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-700 ease-in-out hover:translate-y-[-4px]">
          <div className="relative h-full w-full">
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="overflow-auto absolute -top-6 left-0 md:left-[calc(50%-4rem)] lg:-top-10 w-24 h-24 lg:w-32 lg:h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
                <PiSolarPanelLight className="w-16 h-16 xl:w-24 xl:h-24 text-custom-dark-blue dark:text-custom-yellow transition-transform duration-700 ease-in-out group-hover:scale-110" />
              </div>
              <div className="text-center mt-20 lg:mt-28 space-y-2">
                <h3 className="mx-auto max-w-[90%] md:max-w-full text-center text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                  {t("solarTitle")}
                </h3>
                <div className="flex items-center gap-2 justify-center">
                  <p
                    className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent whitespace-nowrap ${
                      isBlinking ? "animate-double-blink" : ""
                    }`}
                  >
                    {formatPowerValue(energyData?.pvCharger?.power)}
                  </p>
                  {energyData?.pvCharger?.mpptData && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <span
                          role="button"
                          tabIndex={0}
                          className="cursor-help outline-none focus:ring-0"
                        >
                          <CiCircleMore className="h-5 w-5 mt-1 md:mt-2 text-custom-dark-blue dark:text-custom-light-gray" />
                        </span>
                      </PopoverTrigger>
                      <MpptDetailsPopover
                        mpptData={energyData?.pvCharger?.mpptData}
                      />
                    </Popover>
                  )}
                </div>
              </div>
            </div>

            <div className="absolute w-full md:w-[75%] 2xl:w-[90%] bottom-0 md:bottom-10 lg:bottom-4 2xl:bottom-0 left-0 mb-4 md:mb-0 lg:mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-1 xl:pt-4">
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center md:px-2 py-1 text-nowrap 2xl:mr-16">
                  <span className="text-nowrap text-xs lg:text-base">
                    {t("solarStatus")}
                  </span>
                  <span className="font-medium text-custom-dark-blue dark:text-custom-yellow lg:text-base">
                    {energyData?.pvCharger?.power > 0
                      ? t("Active")
                      : t("Inactive")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right - Grid */}
        <div className="absolute top-0 right-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg [border-bottom-left-radius:250px] [border-top-right-radius:250px] p-6 backdrop-blur-sm shadow-lg group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-700 ease-in-out hover:translate-y-[-4px]">
          <div className="relative h-full w-full">
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="absolute -top-6 right-0 md:right-[calc(50%-4rem)] lg:-top-10 w-24 h-24 lg:w-32 lg:h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
                {energyData?.acInput?.state === "Generator" ? (
                  <TbBatteryAutomotive className="w-20 h-20 text-custom-dark-blue dark:text-custom-yellow" />
                ) : (
                  <UtilityPole className="w-16 h-16 xl:w-24 xl:h-24 text-custom-dark-blue dark:text-custom-yellow transition-transform duration-700 ease-in-out group-hover:scale-110" />
                )}
              </div>

              <div className="text-center mt-20 lg:mt-28 space-y-2">
                <h3 className="mx-auto max-w-full text-center text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                  {energyData?.acInput?.state === "Generator"
                    ? t("GeneratorBlock")
                    : t("gridConnections")}
                </h3>

                <div className="flex items-center gap-2 justify-center">
                  <p
                    className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent whitespace-nowrap ${
                      isBlinking ? "animate-double-blink" : ""
                    }`}
                  >
                    {energyData?.acInput?.state === "Generator" &&
                    generatorData?.uptime
                      ? `${generatorData.uptime} w`
                      : gridPower
                      ? `${gridPower} w`
                      : "-"}
                  </p>
                  {energyData?.acInput?.state !== "Generator" &&
                    gridPower != 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <span
                            role="button"
                            tabIndex={0}
                            className="cursor-help outline-none focus:ring-0"
                          >
                            <CiCircleMore className="h-5 w-5 mt-1 md:mt-2 text-custom-dark-blue dark:text-custom-light-gray" />
                          </span>
                        </PopoverTrigger>
                        <GridDetailsPopover
                          gridMetrics={energyData?.gridPower}
                        />
                      </Popover>
                    )}
                </div>
              </div>
            </div>

            <div className="absolute w-full md:w-[75%] 2xl:w-[90%] bottom-0 md:bottom-10 lg:bottom-4 2xl:bottom-0 right-0 lg:mb-0 lg:mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-1 xl:pt-4">
              <div className="space-y-2">
                <div className="flex flex-col items-end md:flex-row md:justify-between md:items-center md:px-2 py-1 2xl:ml-16">
                  <span className="text-nowrap text-xs lg:text-base">
                    {energyData?.acInput?.state === "Generator"
                      ? t("generatorStatus")
                      : t("gridStatus")}
                  </span>
                  <span className="text-right font-medium text-custom-dark-blue dark:text-custom-yellow lg:text-base whitespace-pre-line">
                    {energyData?.acInput?.state === "Generator"
                      ? generatorData.uptime > 0
                        ? t("Running")
                        : t("Stopped")
                      : gridPower > 0
                      ? breakWordWithHyphen(t("Importing"), 6, isMobile)
                      : gridPower < 0
                      ? breakWordWithHyphen(t("Exporting"), 6, isMobile)
                      : breakWordWithHyphen(t("Inactive"), 6, isMobile)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Battery Block */}
        <div className="absolute bottom-0 left-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg [border-top-right-radius:250px] [border-bottom-left-radius:250px] p-6 backdrop-blur-sm shadow-lg group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-700 ease-in-out hover:translate-y-[-4px]">
          <div className="flex-1 flex flex-col items-center justify-start relative h-full">
            <div className="absolute -bottom-8 left-0 md:left-[calc(50%-4rem)] md:-top-10 w-24 h-24 lg:w-32 lg:h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
              <div className="w-16 xl:w-24 transition-transform duration-700 ease-in-out group-hover:scale-110 left-0 md:left-[calc(50%-4rem)] md:-bottom-48">
                <BatteryIndicator soc={energyData?.battery?.soc} />
              </div>
            </div>
            <div className="flex flex-col items-center mt-10 md:mt-20 lg:mt-28 space-y-2">
              <h3 className="mx-auto mr-6 md:mr-auto max-w-full text-center text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                {breakWordWithHyphen(t("batteryTitle"), 8, isMobile)}
              </h3>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent whitespace-nowrap ${
                      isBlinking ? "animate-double-blink" : ""
                    }`}
                  >
                    {formatPowerValue(energyData?.battery?.dcPower)}
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <span
                        role="button"
                        tabIndex={0}
                        className="cursor-help outline-none focus:ring-0"
                      >
                        <CiCircleMore className="h-5 w-5 mt-1 md:mt-2 text-custom-dark-blue dark:text-custom-light-gray" />
                      </span>
                    </PopoverTrigger>
                    <BatteryDetailsPopover batteryData={energyData?.battery} />
                  </Popover>
                </div>
              </div>
            </div>

            <div className="overflow-hidden absolute w-full md:w-[75%] 2xl:w-[90%] bottom-14 md:bottom-8 lg:bottom-0 left-0 md:right-0 md:ml-auto mb-4 xl:mb-0 xl:mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-2 xl:pt-4">
              <div className="space-y-2">
                <div className="flex flex-col items-end justify-start md:gap-4 md:flex-row md:justify-between md:items-center md:px-2">
                  <span className="md:ml-4 xl:ml-12 2xl:ml-20 text-gray-600 dark:text-gray-400 text-nowrap text-xs lg:text-base">
                    {t("batteryStatus")}
                  </span>
                  <span className="font-medium text-custom-dark-blue dark:text-custom-yellow lg:text-base">
                    {t(energyData?.battery?.state)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Consumption Block */}
        <div className="absolute bottom-0 right-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg [border-top-left-radius:250px] [border-bottom-right-radius:250px] p-6 backdrop-blur-sm shadow-lg group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-700 ease-in-out hover:translate-y-[-4px]">
          <div className="relative h-full w-full">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="overflow-auto absolute -bottom-8 right-0 md:right-[calc(50%-4rem)] md:-top-10 w-24 h-24 lg:w-32 lg:h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
                <HiOutlineHome className="w-16 h-16 xl:w-24 xl:h-24 text-custom-dark-blue dark:text-custom-yellow transition-transform duration-700 ease-in-out group-hover:scale-110" />
              </div>
              <div className="flex flex-col items-center mt-10 md:mt-20 lg:mt-28 space-y-2">
                <h3 className="max-w-[60%] md:max-w-full text-center text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                  {t("loadsTitle")}
                </h3>
                <div className="flex items-center gap-2">
                  <p
                    className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent whitespace-nowrap ${
                      isBlinking ? "animate-double-blink" : ""
                    }`}
                  >
                    {formatPowerValue(energyData?.loads?.totalPower)}
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <span
                        role="button"
                        tabIndex={0}
                        className="cursor-help outline-none focus:ring-0"
                      >
                        <CiCircleMore className="h-5 w-5 mt-1 md:mt-2 text-custom-dark-blue dark:text-custom-light-gray" />
                      </span>
                    </PopoverTrigger>
                    <LoadsDetailsPopover loads={energyData?.loads} />
                  </Popover>
                </div>
              </div>
            </div>

            <div className="md:mr-12 absolute w-full md:w-[75%] 2xl:w-[90%] bottom-14 md:bottom-8 lg:bottom-0 right-0 md:left-0 mb-4 xl:mb-0 xl:mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-2 xl:pt-4">
              <div className="space-y-2">
                <div className="flex flex-col items-start justify-end md:flex-row md:justify-between md:items-center md:px-2">
                  <span className="text-nowrap text-xs lg:text-base">
                    {t("loadsStatus")}
                  </span>
                  <span className="font-medium text-custom-dark-blue dark:text-custom-yellow lg:mr-6 xl:mr-12 2xl:mr-20 lg:text-base">
                    {energyData?.loads?.totalPower > 0
                      ? t("Active")
                      : t("Inactive")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

VictronEnergyFlow.displayName = "VictronEnergyFlow";

export default VictronEnergyFlow;
