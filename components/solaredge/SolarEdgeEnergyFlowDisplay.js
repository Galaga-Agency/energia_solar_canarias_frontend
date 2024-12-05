import React, {
  useEffect,
  useState,
  memo,
  useRef,
  useCallback,
  useMemo,
} from "react";
import useDeviceType from "@/hooks/useDeviceType";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSolarEdgeRealtimeData,
  selectLoadingDetails,
} from "@/store/slices/plantsSlice";
import EnergyLoadingClock from "@/components/EnergyLoadingClock";
import { useTranslation } from "next-i18next";
import { UtilityPole } from "lucide-react";
import { selectTheme } from "@/store/slices/themeSlice";
import { useParams } from "next/navigation";
import { selectUser } from "@/store/slices/userSlice";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Home } from "lucide-react";
import { FaSolarPanel } from "react-icons/fa";
import EnergyFlowSkeleton from "@/components/loadingSkeletons/EnergyFlowSkeleton";

const SolarEdgeEnergyFlowDisplay = memo(() => {
  const { isMobile, isTablet } = useDeviceType();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [realtimeData, setRealtimeData] = useState({
    powerflow: { load: 0, pv: 0, grid: 0, soc: 0, unit: "kW" },
  });
  const [error, setError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const lastUpdatedRef = useRef(new Date().toLocaleString());
  const isLoading = useSelector(selectLoadingDetails);
  const theme = useSelector(selectTheme);
  const params = useParams();
  const formattedPlantId = params?.plantId?.toString() || null;
  const user = useSelector(selectUser);
  const token = useMemo(() => user?.tokenIdentificador, [user]);

  const fetchRealtimeData = useCallback(async () => {
    if (!formattedPlantId || !token) {
      console.error("Plant ID or token is missing");
      return;
    }

    try {
      setIsFetching(true);
      const response = await dispatch(
        fetchSolarEdgeRealtimeData({ plantId: formattedPlantId, token })
      ).unwrap();

      const parsedData = {
        powerflow: {
          load: response.siteCurrentPowerFlow.LOAD.currentPower,
          pv: response.siteCurrentPowerFlow.PV.currentPower,
          grid: response.siteCurrentPowerFlow.GRID.currentPower,
          soc: response.siteCurrentPowerFlow.STORAGE?.chargeLevel || 0,
          unit: response.siteCurrentPowerFlow.unit,
        },
      };

      setRealtimeData(parsedData);
      setError(false);
      lastUpdatedRef.current = new Date().toLocaleString();
      setIsFetching(false);
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 300);
    } catch (err) {
      console.error("Error fetching real-time data:", err);
      setError(true);
      setRealtimeData({
        powerflow: { load: 0, pv: 0, grid: 0, soc: 0, unit: "kW" },
      });
      setIsFetching(false);
      setIsBlinking(false);
    }
  }, [formattedPlantId, token, dispatch]);

  useEffect(() => {
    if (!formattedPlantId || !token) {
      return;
    }

    fetchRealtimeData();
    const interval = setInterval(fetchRealtimeData, 30000);
    return () => clearInterval(interval);
  }, [fetchRealtimeData, formattedPlantId, token]);

  const formatPowerValue = (value, unit) => {
    return `${value.toFixed(2)} ${unit}`;
  };

  const {
    load = 0,
    pv = 0,
    grid = 0,
    unit = "kW",
  } = realtimeData?.powerflow || {};

  const hasFlow = useMemo(
    () => load > 0 || pv > 0 || grid > 0,
    [load, pv, grid]
  );

  const renderFlow = useCallback(
    (fromValue, toValue, direction) => {
      if (fromValue <= 0 || toValue <= 0) return null;

      const FlowIcon = isMobile
        ? ChevronRight
        : direction === "right"
        ? ChevronRight
        : ChevronLeft;

      const flowClass = isMobile
        ? direction === "right"
          ? "animate-flow-right"
          : "animate-flow-right"
        : direction === "right"
        ? "animate-flow-right"
        : "animate-flow-left";

      const intensity = Math.min(Math.max((fromValue / 10) * 100, 20), 100);
      const glowColor =
        theme === "dark"
          ? `rgba(255, 213, 122, ${intensity / 100})`
          : `rgba(0, 44, 63, ${intensity / 100})`;

      return (
        <div className="relative flex items-center justify-center gap-1 py-4 group">
          <div
            className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 rounded-full opacity-20 group-hover:opacity-40 transition-all duration-300"
            style={{
              background: `linear-gradient(${
                direction === "right" ? "90deg" : "270deg"
              }, 
            transparent 0%, 
            ${glowColor} 50%, 
            transparent 100%)`,
            }}
          />

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
                  style={{
                    animationDelay: `${i * 200}ms`,
                    filter: `drop-shadow(0 0 ${intensity / 20}px ${glowColor})`,
                  }}
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
    [theme, isMobile]
  );

  const renderMobileLayout = () => {
    return (
      <div className="relative flex flex-col items-center">
        {/* Top Solar Panel Container */}
        <div
          className={`w-[180px] flex flex-col items-center ${
            hasFlow && "mb-32"
          } `}
        >
          <FaSolarPanel className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-custom-dark-blue dark:text-custom-yellow text-[72px] lg:text-[150px] font-group-hover:scale-105 transition-transform mb-2" />

          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg shadow-md w-full text-center">
            <span className="block text-sm text-slate-600 dark:text-slate-300 text-nowrap">
              {t("Energy Produced")}
            </span>
            <span
              className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                isBlinking ? "animate-double-blink" : ""
              }`}
            >
              {error ? "N/A" : formatPowerValue(pv, unit)}
            </span>
          </div>
        </div>

        {/* Container for bottom row with flows */}
        <div className="relative w-full max-w-[400px]">
          {/* Flow to House (Left) */}
          <div className="absolute -top-24 left-1/4 -translate-x-1/2 w-24 h-24 flex items-center justify-center transform -rotate-[83deg]">
            {renderFlow(pv, load, "left")}
          </div>

          {/* Flow to Grid (Right) */}
          <div className="absolute -top-24 right-1/4 translate-x-1/2 w-24 h-24 flex items-center justify-center transform rotate-[83deg]">
            {renderFlow(pv, grid, "right")}
          </div>

          {/* Bottom Icons Container */}
          <div className="flex justify-center items-end gap-4 md:gap-24 mt-6">
            {/* House */}
            <div className="w-[180px]">
              <div className="flex flex-col items-center">
                <Home
                  className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-custom-dark-blue dark:text-custom-yellow group-hover:scale-105 transition-transform mb-2"
                  strokeWidth={2.5}
                  size={80}
                />
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg shadow-md w-full text-center">
                  <span className="block text-sm text-slate-600 dark:text-slate-300 text-nowrap">
                    {t("Energy Consumed")}
                  </span>
                  <span
                    className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                      isBlinking ? "animate-double-blink" : ""
                    }`}
                  >
                    {error ? "N/A" : formatPowerValue(load, unit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="w-[180px]">
              <div className="flex flex-col items-center">
                <UtilityPole
                  strokeWidth={2.5}
                  size={80}
                  className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-custom-dark-blue dark:text-custom-yellow mb-2"
                />
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg shadow-md w-full text-center">
                  <span className="block text-sm text-slate-600 dark:text-slate-300 text-nowrap">
                    {t("Energy Exported")}
                  </span>
                  <span
                    className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                      isBlinking ? "animate-double-blink" : ""
                    }`}
                  >
                    {error ? "N/A" : formatPowerValue(grid, unit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!formattedPlantId) {
    return null;
  }

  if (isLoading) {
    return <EnergyFlowSkeleton theme={theme} />;
  }

  return (
    <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 mb-6 backdrop-blur-sm">
      {/* Header section */}
      <div className="mb-8">
        <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
          {t("Real-Time Energy Flow")}
        </h2>
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

      {/* Responsive Layout Switch */}
      <div className="md:hidden">{renderMobileLayout()}</div>

      {/* Desktop Layout */}
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
                {t("Energy Consumed")}
              </span>
              <span
                className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                  isBlinking ? "animate-double-blink" : ""
                }`}
              >
                {error ? "N/A" : formatPowerValue(load, unit)}
              </span>
            </div>
          </div>
          <div className="absolute -right-12 top-[20%] lg:top-[40%] -translate-y-1/2">
            {renderFlow(pv, load, "left")}
          </div>
        </div>

        <div className="w-1/3 relative flex flex-col items-center">
          <div className="group flex flex-col items-center gap-4 w-full relative">
            <div className="absolute inset-0 w-full h-52 -top-6 rounded-full bg-gray-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
            <FaSolarPanel className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-custom-dark-blue dark:text-custom-yellow text-[72px] lg:text-[150px] group-hover:scale-105 transition-transform mb-2" />
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg shadow-md group-hover:shadow-xl w-full text-center z-0">
              <span className="block text-sm text-slate-600 dark:text-slate-300">
                {t("Energy Produced")}
              </span>
              <span
                className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                  isBlinking ? "animate-double-blink" : ""
                }`}
              >
                {error ? "N/A" : formatPowerValue(pv, unit)}
              </span>
            </div>
          </div>
        </div>

        <div className="w-1/3 relative flex flex-col items-center">
          <div className="absolute -left-12 top-[20%] lg:top-[40%] -translate-y-1/2">
            {renderFlow(pv, grid, "right")}
          </div>
          <div className="group flex flex-col items-center gap-4 w-full">
            <div className="absolute inset-0 w-full h-52 -top-6 rounded-full bg-gray-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
            <UtilityPole
              size={isTablet ? 72 : 150}
              className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-custom-dark-blue dark:text-custom-yellow group-hover:scale-105 transition-transform mb-2"
            />
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg shadow-md group-hover:shadow-xl w-full text-center z-0">
              <span className="block text-sm text-slate-600 dark:text-slate-300">
                {t("Energy Exported")}
              </span>
              <span
                className={`block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow ${
                  isBlinking ? "animate-double-blink" : ""
                }`}
              >
                {error ? "N/A" : formatPowerValue(grid, unit)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SolarEdgeEnergyFlowDisplay.displayName = "SolarEdgeEnergyFlowDisplay";

export default SolarEdgeEnergyFlowDisplay;
