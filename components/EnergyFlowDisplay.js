import React, { useEffect, useState, memo, useRef } from "react";
import Image from "next/image";
import houseIllustration from "@/public/assets/img/house-illustration.png";
import solarPanelIllustration from "@/public/assets/img/solar-panel-illustration.png";
import gridIllustration from "@/public/assets/img/grid.png";
import useDeviceType from "@/hooks/useDeviceType";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGoodweRealtimeData,
  fetchSolarEdgeRealtimeData,
  selectRealtimeLoading,
} from "@/store/slices/plantsSlice";
import EnergyLoadingClock from "@/components/EnergyLoadingClock";
import { useTranslation } from "next-i18next";
import BatteryIndicator from "./BatteryIndicator";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/Tooltip";
import { Info } from "lucide-react";
import EnergyFlowSkeleton from "./LoadingSkeletons/EnergyFlowSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";
import { useParams } from "next/navigation";
import { selectUser } from "@/store/slices/userSlice";

const EnergyFlowDisplay = memo(({ provider }) => {
  const { isMobile } = useDeviceType();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [realtimeData, setRealtimeData] = useState({
    powerflow: { load: 0, pv: 0, grid: 0, soc: 0 },
  });
  const [error, setError] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const lastUpdatedRef = useRef("");
  const isLoading = useSelector(selectRealtimeLoading);
  const theme = useSelector(selectTheme);
  const params = useParams();
  const formattedPlantId = params?.plantId?.toString() || null;
  const token = useSelector(selectUser).tokenIdentificador;

  if (!formattedPlantId) {
    console.error("Plant ID is missing");
    return;
  }

  console.log("Plant ID from params:", params.plantId);
  console.log("Token:", token);

  const fetchRealtimeData = async () => {
    try {
      setIsFetching(true);

      let response;
      let parsedData = {
        powerflow: { load: 0, pv: 0, grid: 0, soc: 0 }, // Default structure
      };

      switch (provider) {
        case "goodwe":
          response = await dispatch(
            fetchGoodweRealtimeData({ plantId: formattedPlantId, token })
          ).unwrap();
          parsedData = response?.data || parsedData; // Ensure fallback structure
          break;

        case "solaredge":
          response = await dispatch(
            fetchSolarEdgeRealtimeData({ plantId: formattedPlantId, token })
          ).unwrap();
          parsedData = response?.data || parsedData; // Same fallback structure
          break;

        default:
          throw new Error("Unsupported provider");
      }

      if (!parsedData.powerflow) {
        parsedData.powerflow = { load: 0, pv: 0, grid: 0, soc: 0 };
      }

      setRealtimeData(parsedData);
      setError(false);
      lastUpdatedRef.current = new Date().toLocaleString();
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 300);
    } catch (err) {
      console.error("Error fetching real-time data:", err);
      setError(true);
      setRealtimeData({
        powerflow: { load: 0, pv: 0, grid: 0, soc: 0 }, // Reset to default
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!formattedPlantId || !token) {
      console.warn("Missing plant ID or token. Skipping API call.");
      return;
    }
    fetchRealtimeData();
  }, [formattedPlantId, token, dispatch]);

  const { load, pv, grid, soc } = realtimeData || {};

  return (
    <>
      {isLoading ? (
        <EnergyFlowSkeleton theme={theme} />
      ) : (
        <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 mb-6 backdrop-blur-sm">
          {isMobile ? (
            <div className="relative flex flex-col justify-left">
              <h2 className="text-xl font-semibold text-custom-dark-blue dark:text-custom-yellow mb-4">
                {t("Real-Time Energy Flow")}
              </h2>
              <div className="relative flex items-center gap-2 justify-around">
                <span className="text-left text-sm text-gray-600 dark:text-gray-400">
                  {t("lastUpdated")}: {lastUpdatedRef.current || t("fetching")}
                </span>
                <EnergyLoadingClock
                  duration={30}
                  onComplete={fetchRealtimeData}
                  isPaused={isFetching}
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-custom-dark-blue dark:text-custom-yellow mb-4">
                {t("Real-Time Energy Flow")}
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col items-end">
                <EnergyLoadingClock
                  duration={30}
                  onComplete={fetchRealtimeData}
                  isPaused={isFetching}
                />
                <span className="absolute top-4 right-16 max-w-36">
                  {t("lastUpdated")}: {lastUpdatedRef.current || t("fetching")}
                </span>
              </div>
            </div>
          )}

          {/* Battery Indicator with Tooltip */}
          <div className="flex items-center gap-2 mt-8 md:mt-0">
            <BatteryIndicator soc={soc} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="text-md text-custom-dark-blue dark:text-custom-yellow cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm max-w-xs p-2 rounded-md shadow-lg"
                >
                  <p className="text-sm font-medium">
                    {t("batteryIndicatorTooltip")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="relative w-full h-auto">
            <div className="relative inset-0 flex flex-col items-center justify-center">
              {isMobile ? (
                <div className="relative flex flex-col items-center mt-10 mb-6">
                  <Image
                    src={solarPanelIllustration}
                    alt="Solar Panel"
                    className="relative max-w-[35%] h-auto object-contain mb-2 p-2"
                  />
                  <div className="flex justify-between w-full mt-2 items-center">
                    <Image
                      src={houseIllustration}
                      alt="House"
                      className="max-w-[35%] h-auto object-contain p-2 pb-0"
                    />
                    <Image
                      src={gridIllustration}
                      alt="Grid"
                      className="max-w-[30%] h-auto object-contain mb-2 p-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between mx-12">
                  <Image
                    src={houseIllustration}
                    alt="House"
                    className="max-w-[15%] h-auto object-contain mb-2 p-2"
                  />
                  <div className="flex my-auto h-1 bg-blue-500 w-full"></div>
                  <Image
                    src={solarPanelIllustration}
                    alt="Solar Panel"
                    className="max-w-[15%] h-auto object-contain mb-4 p-2 pr-4"
                  />
                  <div className="flex my-auto h-1 bg-blue-500 w-full"></div>
                  <Image
                    src={gridIllustration}
                    alt="Grid"
                    className="md:max-w-[14%] lg:max-w-[12%] h-auto object-contain md:mb-12 lg:mb-16 p-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Energy stats with responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
              <span className="block text-sm text-slate-600 dark:text-slate-300">
                {t("Energy Consumed")}
              </span>
              <span
                className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                  isBlinking ? "animate-double-blink" : ""
                }`}
              >
                {error ? "N/A" : load || 0}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
              <span className="block text-sm text-slate-600 dark:text-slate-300">
                {t("Energy Produced")}
              </span>
              <span
                className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                  isBlinking ? "animate-double-blink" : ""
                }`}
              >
                {error ? "N/A" : pv || 0}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
              <span className="block text-sm text-slate-600 dark:text-slate-300">
                {t("Energy Exported")}
              </span>
              <span
                className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                  isBlinking ? "animate-double-blink" : ""
                }`}
              >
                {error ? "N/A" : grid || 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default EnergyFlowDisplay;
