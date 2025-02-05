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
  fetchGoodweRealtimeData,
  selectLoadingDetails,
  selectRealtimeLoading,
} from "@/store/slices/plantsSlice";
import EnergyLoadingClock from "@/components/EnergyLoadingClock";
import { useTranslation } from "next-i18next";
import { useParams } from "next/navigation";
import { selectTheme } from "@/store/slices/themeSlice";
import { selectUser } from "@/store/slices/userSlice";
import { PiSolarPanelLight } from "react-icons/pi";
import { TbPlug } from "react-icons/tb";
import { HiOutlineHome } from "react-icons/hi";
import Image from "next/image";
import EnergyFlowSkeleton from "@/components/loadingSkeletons/EnergyFlowSkeleton";
import BatteryIndicator from "@/components/BatteryIndicator";
import goodweLogo from "@/public/assets/logos/goodwe-logo.png";
import { Grid, UtilityPole } from "lucide-react";
import { breakWordWithHyphen } from "@/utils/textUtils";

const GoodweEnergyFlow = memo(() => {
  const params = useParams();
  const { isMobile } = useDeviceType();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isLoading = useSelector(selectRealtimeLoading);
  const theme = useSelector(selectTheme);
  const user = useSelector(selectUser);
  const isComponentLoading = useSelector(selectLoadingDetails);

  const formatPowerValue = (value) => {
    if (value === 0) return "0";
    if (Math.abs(value) < 1000) {
      return `${value.toFixed(2)}`;
    }
    return `${value.toFixed(2)}`;
  };

  const [realtimeData, setRealtimeData] = useState({
    powerflow: {
      load: 0,
      pv: 0,
      grid: 0,
      soc: 0,
      batteryFlow: 0,
      status: {
        isImporting: false,
        gridStatus: 0,
        batteryStatus: 0,
        pvStatus: 0,
        loadStatus: 0,
      },
      unit: "kW",
    },
  });
  const [error, setError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const lastUpdatedRef = useRef(new Date().toLocaleString());
  const formattedPlantId = params?.plantId?.toString() || null;
  const token = useMemo(() => user?.tokenIdentificador, [user]);

  const fetchRealtimeData = useCallback(async () => {
    if (!formattedPlantId || !token) {
      console.error("Plant ID or token is missing");
      return;
    }

    try {
      setIsFetching(true);
      const response = await dispatch(
        fetchGoodweRealtimeData({ plantId: formattedPlantId, token })
      ).unwrap();

      const powerflowData = response.data.powerflow;

      console.log("powerflowData", powerflowData);

      // Keep values in Watts as they come from the API
      const pvValue = parseFloat(powerflowData?.pv?.replace("W", "")) || 0;
      const loadValue = parseFloat(powerflowData?.load?.replace("W", "")) || 0;
      const gridValue = parseFloat(powerflowData?.grid?.replace("W", "")) || 0;
      const batteryValue =
        parseFloat(powerflowData?.bettery?.replace("W", "")) || 0;

      // Determine if we're importing or exporting based on load vs production
      const isImporting = loadValue > pvValue;

      setRealtimeData({
        powerflow: {
          load: loadValue,
          pv: pvValue,
          grid: gridValue,
          soc: powerflowData?.soc || 0,
          batteryFlow: batteryValue,
          status: {
            isImporting,
            gridStatus: powerflowData?.gridStatus,
            batteryStatus: powerflowData?.betteryStatus,
            pvStatus: powerflowData?.pvStatus,
            loadStatus: powerflowData?.loadStatus,
          },
          unit: "W", // Keep it as Watts
        },
      });

      setError(false);
      lastUpdatedRef.current = new Date().toLocaleString();
      setIsFetching(false);
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 300);
    } catch (err) {
      console.error("Error fetching real-time data:", err);
      setError(true);
      setRealtimeData({
        powerflow: {
          load: 0,
          pv: 0,
          grid: 0,
          soc: 0,
          batteryFlow: 0,
          status: {
            isImporting: false,
            gridStatus: 0,
            batteryStatus: 0,
            pvStatus: 0,
            loadStatus: 0,
          },
          unit: "W",
        },
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

  if (isComponentLoading || !realtimeData) {
    return <EnergyFlowSkeleton theme={theme} />;
  }

  const {
    load = 0,
    pv = 0,
    grid = 0,
    soc = 0,
    batteryFlow = 0,
    status = {},
    unit = "kW",
  } = realtimeData.powerflow;

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

      {/* Custom Grid Layout */}
      <div className="relative w-full h-[650px] p-4 mt-4">
        {/* Center Logo Circle */}
        <div className="group absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[170px] h-[170px] md:w-[260px] md:h-[260px] z-50 shadow-xl rounded-full">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] transition-all duration-1000">
            <div className="absolute inset-0 rotate-180 bg-gradient-to-t from-yellow-400/40 via-green-500/40 to-transparent rounded-full blur-[100px] group-hover:blur-[120px] group-hover:scale-110 transition-all duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/40 via-green-500/40 to-transparent rounded-full blur-[100px] group-hover:blur-[120px] group-hover:scale-110 transition-all duration-1000 animate-pulse"></div>
          </div>

          <div className="relative bg-white/70 dark:bg-custom-dark-blue/70 rounded-full p-6 backdrop-blur-md shadow-lg flex flex-col items-center justify-center h-full transition-all duration-700 group-hover:transform group-hover:scale-105 group-hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] dark:group-hover:shadow-[0_20px_50px_rgba(254,_204,_27,_0.4)]">
            <div className="relative w-24 h-24 md:w-32 xl:h-32 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-180">
              <Image
                src={goodweLogo}
                alt="Goodwe Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Top Left - Solar */}
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
                <p
                  className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent whitespace-nowrap ${
                    isBlinking ? "animate-double-blink" : ""
                  }`}
                >
                  {formatPowerValue(pv)}
                  <span className="text-sm xl:text-base ml-1">{unit}</span>
                </p>
              </div>
            </div>

            <div className="absolute w-full md:w-[75%] 2xl:w-[90%] bottom-0 md:bottom-10 lg:bottom-4 2xl:bottom-0 left-0 mb-4 lg:mb-0 lg:mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-1 xl:pt-4">
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center md:px-2 py-1 text-nowrap">
                  <span className="text-xs lg:text-base">
                    {t("solarStatus")}
                  </span>
                  <span className="font-medium text-custom-dark-blue dark:text-custom-yellow mr-20 md:mr-4 2xl:mr-20 md:text-base">
                    {pv > 0 ? t("Active") : t("Inactive")}
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
              <div className="overflow-auto absolute -top-6 right-0 md:right-[calc(50%-4rem)] lg:-top-10 w-24 h-24 lg:w-32 lg:h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
                <UtilityPole className="w-16 h-16 xl:w-24 xl:h-24 text-custom-dark-blue dark:text-custom-yellow transition-transform duration-700 ease-in-out group-hover:scale-110" />
              </div>
              <div className="text-center mt-20 lg:mt-28 space-y-2">
                <h3 className="max-w-[60%] md:max-w-full text-center text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                  {status.isImporting
                    ? t("gridImportTitle")
                    : t("gridExportTitle")}
                </h3>
                <p
                  className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent whitespace-nowrap ${
                    isBlinking ? "animate-double-blink" : ""
                  }`}
                >
                  {formatPowerValue(Math.abs(grid))}
                  <span className="text-sm xl:text-base ml-1">{unit}</span>
                </p>
              </div>
            </div>

            <div className="absolute w-full md:w-[75%] 2xl:w-[90%] bottom-0 md:bottom-10 lg:bottom-4 2xl:bottom-0 right-0 lg:mb-0 lg:mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-1 xl:pt-4">
              <div className="space-y-2">
                <div className="flex flex-col items-end md:flex-row md:justify-between md:items-center md:px-2 py-1">
                  <span className="text-nowrap lg:ml-12 xl:ml-20 text-xs lg:text-base">
                    {t("gridStatus")}
                  </span>
                  <span className="text-right font-medium text-custom-dark-blue dark:text-custom-yellow lg:text-base whitespace-pre-line">
                    {grid !== 0
                      ? breakWordWithHyphen(t("Connected"), 6, isMobile)
                      : breakWordWithHyphen(t("Disconnected"), 6, isMobile)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left - Battery */}
        <div className="absolute bottom-0 left-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg [border-top-right-radius:250px] [border-bottom-left-radius:250px] p-6 backdrop-blur-sm shadow-lg group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-700 ease-in-out hover:translate-y-[-4px]">
          <div className="flex-1 flex flex-col items-center justify-start relative h-full">
            <div className="absolute -bottom-8 left-0 md:left-[calc(50%-4rem)] md:-top-10 w-24 h-24 lg:w-32 lg:h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110">
              <div className="w-16 xl:w-24 transition-transform duration-700 ease-in-out group-hover:scale-110 left-0 md:left-[calc(50%-4rem)] md:-bottom-48">
                <BatteryIndicator soc={soc} />
              </div>
            </div>
            <div className="flex flex-col items-center mt-10 md:mt-20 lg:mt-28 space-y-2">
              <h3 className="mx-auto mr-6 md:mr-auto max-w-full text-center text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                {breakWordWithHyphen(t("batteryTitle"), 8, isMobile)}
              </h3>
              <div className="flex flex-col items-center gap-1">
                <p
                  className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent whitespace-nowrap ${
                    isBlinking ? "animate-double-blink" : ""
                  }`}
                >
                  {formatPowerValue(batteryFlow)}
                  <span className="text-sm xl:text-base ml-1">{unit}</span>
                </p>
              </div>
            </div>

            <div className="overflow-hidden absolute w-full md:w-[75%] 2xl:w-[90%] bottom-14 md:bottom-8 lg:bottom-0 left-0 md:right-0 md:ml-auto mb-4 xl:mb-0 xl:mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-2 xl:pt-4">
              <div className="space-y-2">
                <div className="flex flex-col items-end justify-start md:gap-4 md:flex-row md:justify-between md:items-center md:px-2">
                  <span className="md:ml-4 xl:ml-12 2xl:ml-20 text-gray-600 dark:text-gray-400 text-nowrap text-xs lg:text-base">
                    {t("batteryStatus")}
                  </span>
                  <span className="font-medium text-custom-dark-blue dark:text-custom-yellow lg:text-base">
                    {batteryFlow > 0
                      ? t("Charging")
                      : batteryFlow < 0
                      ? t("Discharging")
                      : t("Inactive")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right - Consumption */}
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
                <p
                  className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue dark:from-custom-yellow dark:to-custom-yellow bg-clip-text text-transparent whitespace-nowrap ${
                    isBlinking ? "animate-double-blink" : ""
                  }`}
                >
                  {formatPowerValue(load)}
                  <span className="text-sm xl:text-base ml-1">{unit}</span>
                </p>
              </div>
            </div>
            <div className="md:mr-12 absolute w-full md:w-[75%] 2xl:w-[90%] bottom-14 md:bottom-8 lg:bottom-0 right-0 md:left-0 mb-4 xl:mb-0 xl:mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-2 xl:pt-4">
              <div className="space-y-2">
                <div className="flex flex-col items-start justify-end md:flex-row md:justify-between md:items-center md:px-2">
                  <span className="text-nowrap text-xs lg:text-base">
                    {t("loadsStatus")}
                  </span>
                  <span className="font-medium text-custom-dark-blue dark:text-custom-yellow lg:mr-6 xl:mr-12 2xl:mr-20 lg:text-base">
                    {load > 0 ? t("Active") : t("Inactive")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

GoodweEnergyFlow.displayName = "GoodweEnergyFlow";

export default GoodweEnergyFlow;
