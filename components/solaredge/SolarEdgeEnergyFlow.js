import React, { useState, useEffect, useCallback, useRef } from "react";
import solaredgeLogo from "@/public/assets/logos/solaredge-icon.png";
import { PiSolarPanelLight } from "react-icons/pi";
import { TbPlug, TbConnection } from "react-icons/tb";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { useParams } from "next/navigation";
import { selectUser } from "@/store/slices/userSlice";
import {
  fetchSolarEdgeRealtimeData,
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
import Image from "next/image";
import { GiElectric } from "react-icons/gi";
import { IoSunnyOutline } from "react-icons/io5";
import EnergyLoadingClock from "@/components/EnergyLoadingClock";
import useDeviceType from "@/hooks/useDeviceType";
import SolarEdgeEnergyBlock from "@/components/solaredge/SolarEdgeEnergyBlock";
import VictronEnergyFlowSkeleton from "@/components/loadingSkeletons/VictronEnergyFlowSkeleton";
import { HiHome, HiOutlineHome } from "react-icons/hi";

const SolarEdgeEnergyFlow = ({ provider }) => {
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

  const fetchRealtimeData = useCallback(async () => {
    if (!plantId || !token) return;

    if (!isFetching) {
      setIsFetching(true);
      try {
        const result = await dispatch(
          fetchSolarEdgeRealtimeData({
            plantId,
            token,
          })
        ).unwrap();

        if (result?.siteCurrentPowerFlow) {
          const powerFlow = result.siteCurrentPowerFlow;
          const processedData = {
            grid: {
              currentPower: powerFlow.GRID?.currentPower ?? 0,
              status: powerFlow.GRID?.status ?? "-",
              isImporting: powerFlow.GRID?.currentPower > 0,
            },
            load: {
              currentPower: powerFlow.LOAD?.currentPower ?? 0,
              status: powerFlow.LOAD?.status ?? "-",
            },
            pv: {
              currentPower: powerFlow.PV?.currentPower ?? 0,
              status: powerFlow.PV?.status ?? "-",
            },
            storage: {
              chargeLevel: powerFlow.STORAGE?.chargeLevel ?? 0,
              currentPower: powerFlow.STORAGE?.currentPower ?? 0,
              status: powerFlow.STORAGE?.status ?? "-",
              critical: powerFlow.STORAGE?.critical ?? false,
            },
            unit: powerFlow.unit ?? "kW",
          };

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
    }
  }, [dispatch, plantId, token]);

  useEffect(() => {
    fetchRealtimeData();
    const intervalId = setInterval(fetchRealtimeData, 15000);
    return () => clearInterval(intervalId);
  }, [fetchRealtimeData]);

  if (isComponentLoading || !energyData) {
    return <VictronEnergyFlowSkeleton theme={theme} />;
  }

  console.log("energyData", energyData);

  return (
    <>
      {isMobile ? (
        <div className="flex items-center gap-2 justify-between mb-4">
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
        <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col items-end mb-4">
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

      {/* Custom Grid Layout */}
      <div className="relative w-full h-[650px] p-4 ">
        {/* Center Inverter Circle */}
        <div className="group absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[170px] h-[170px] xl:w-[260px] xl:h-[260px] z-50 shadow-xl rounded-full ">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] transition-all duration-1000">
            <div className="absolute inset-0 rotate-180 bg-gradient-to-t from-yellow-400/40 via-green-500/40 to-transparent rounded-full blur-[100px] group-hover:blur-[120px] group-hover:scale-110 transition-all duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/40 via-green-500/40 to-transparent rounded-full blur-[100px] group-hover:blur-[120px] group-hover:scale-110 transition-all duration-1000 animate-pulse"></div>
          </div>

          <div
            className="relative bg-white/70 dark:bg-custom-dark-blue/70 rounded-full p-6 backdrop-blur-md shadow-lg flex flex-col items-center justify-center h-full transition-all duration-700
         group-hover:transform group-hover:scale-105
         group-hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]
         dark:group-hover:shadow-[0_20px_50px_rgba(254,_204,_27,_0.4)]"
          >
            <div className="relative w-24 h-24 xl:w-32 xl:h-32 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-180">
              <Image
                src={solaredgeLogo}
                alt="SolarEdge Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Top Left - Solar */}
        <div
          className="absolute top-0 left-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg [border-bottom-right-radius:250px] [border-top-left-radius:250px] p-6 backdrop-blur-sm shadow-lg group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-700 ease-in-out
      hover:translate-y-[-4px]"
        >
          <div className="relative h-full w-full">
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="overflow-auto absolute -top-6 left-0 xl:left-[calc(50%-4rem)] xl:-top-10 w-24 h-24 xl:w-32 xl:h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
                <PiSolarPanelLight className="w-16 h-16 xl:w-24 xl:h-24 text-custom-dark-blue dark:text-custom-yellow transition-transform duration-700 ease-in-out group-hover:scale-110" />
              </div>

              <div className="text-center mt-20 xl:mt-28 space-y-2">
                <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                  {t("solarTitle")}
                </h3>
                <p
                  className={`text-xl xl:text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent ${
                    isBlinking ? "animate-double-blink" : ""
                  }`}
                >
                  {energyData?.pv?.currentPower !== null &&
                  energyData?.pv?.currentPower !== undefined
                    ? `${energyData.pv.currentPower} ${energyData.unit}`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="absolute w-[90%] bottom-0 mb-4 xl:mb-0 xl:mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-1 xl:pt-4">
              <div className="space-y-2">
                <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center xl:px-2 py-1">
                  <span>{t("solarStatus")}</span>
                  <span className="font-medium text-custom-dark-blue dark:text-custom-yellow mr-20">
                    {energyData?.pv?.status || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right - Grid */}
        <div
          className="absolute  top-0 right-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg [border-bottom-left-radius:250px] [border-top-right-radius:250px] p-6 backdrop-blur-sm shadow-lg group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-700 ease-in-out
      hover:translate-y-[-4px]"
        >
          <div className="relative h-full w-full">
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="overflow-auto absolute -top-10 w-32 h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
                <TbPlug className="w-24 h-24 text-custom-dark-blue dark:text-custom-yellow transition-transform duration-700 ease-in-out group-hover:scale-110" />
              </div>
              <div className="text-center mt-28 space-y-2">
                {energyData.grid.isImporting === true ? (
                  <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                    {t("gridImportTitle")}
                  </h3>
                ) : (
                  <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                    {t("gridExportTitle")}
                  </h3>
                )}
                <p
                  className={`text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent ${
                    isBlinking ? "animate-double-blink" : ""
                  }`}
                >
                  {energyData?.grid?.currentPower !== null &&
                  energyData?.grid?.currentPower !== undefined
                    ? `${Math.abs(energyData.grid.currentPower)} ${
                        energyData.unit
                      }`
                    : "-"}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-[90%] mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2 py-1 ml-20">
                  <span>{t("gridStatus")}</span>
                  <span className="font-medium text-custom-dark-blue dark:text-custom-yellow">
                    {t(energyData?.grid?.status) || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left - Battery */}
        <div
          className="absolute bottom-0 left-0 w-[calc(50%-16px)] h-[calc(50%-16px)] rounded-lg p-6 backdrop-blur-sm shadow-lg [border-top-right-radius:250px] [border-bottom-left-radius:250px] group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-700 ease-in-out
      hover:translate-y-[-4px]"
        >
          <div className="flex-1 flex flex-col items-center justify-start relative h-full">
            <div className="absolute -top-10 w-32 h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
              <div className="w-24 transition-transform duration-700 ease-in-out group-hover:scale-110">
                <BatteryIndicator soc={energyData?.storage?.chargeLevel} />
              </div>
            </div>
            <div className="text-center mt-28 space-y-2">
              <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                {t("batteryTitle")}
              </h3>
              <p
                className={`text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent ${
                  isBlinking ? "animate-double-blink" : ""
                }`}
              >
                {energyData?.storage?.currentPower !== null &&
                energyData?.storage?.currentPower !== undefined
                  ? `${energyData.storage.currentPower} kW`
                  : "-"}
              </p>
            </div>

            <div className="absolute bottom-0 right-0 w-[90%] mt-4 text-sm space-y-2 border-t border-gray-200 dark:border-gray-700/50 pt-4 flex justify-between items-center">
              <span className="ml-20 text-gray-600 dark:text-gray-400">
                {t("batteryStatus")}
              </span>
              <span className="font-medium text-custom-dark-blue dark:text-custom-yellow">
                {t(energyData?.storage?.status?.toLowerCase()) || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Right - Consumption */}
        <div
          className="absolute bottom-0 right-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg [border-top-left-radius:250px] [border-bottom-right-radius:250px] p-6 backdrop-blur-sm shadow-lg group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-700 ease-in-out
      hover:translate-y-[-4px]"
        >
          <div className="relative h-full w-full">
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="overflow-auto absolute -top-10 w-32 h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
                <HiOutlineHome className="w-24 h-24 text-custom-dark-blue dark:text-custom-yellow transition-transform duration-700 ease-in-out group-hover:scale-110" />
              </div>
              <div className="text-center mt-28 space-y-2">
                <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                  {t("loadsTitle")}
                </h3>
                <p
                  className={`text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent ${
                    isBlinking ? "animate-double-blink" : ""
                  }`}
                >
                  {energyData?.load?.currentPower !== null &&
                  energyData?.load?.currentPower !== undefined
                    ? `${energyData.load.currentPower} ${energyData.unit}`
                    : "-"}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-[90%] mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2 py-1">
                  <span>{t("loadsStatus")}</span>
                  <span className="font-medium text-custom-dark-blue dark:text-custom-yellow mr-20">
                    {t(energyData?.load?.status || "-")}
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

export default SolarEdgeEnergyFlow;
