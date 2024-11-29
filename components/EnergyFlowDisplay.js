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
import { Info, UtilityPole } from "lucide-react";
import { selectTheme } from "@/store/slices/themeSlice";
import { useParams } from "next/navigation";
import { selectUser } from "@/store/slices/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faSolarPanel } from "@fortawesome/free-solid-svg-icons";

const EnergyFlowDisplay = memo(({ provider }) => {
  const { isMobile } = useDeviceType();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [realtimeData, setRealtimeData] = useState({
    powerflow: { load: 0, pv: 0, grid: 0, soc: 0, unit: "kW" },
  });
  const [error, setError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const lastUpdatedRef = useRef(new Date().toLocaleString());
  const isLoading = useSelector(selectRealtimeLoading);
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

      let response;
      let parsedData = {
        powerflow: { load: 0, pv: 0, grid: 0, soc: 0, unit: "kW" },
      };

      switch (provider) {
        case "goodwe":
          response = await dispatch(
            fetchGoodweRealtimeData({ plantId: formattedPlantId, token })
          ).unwrap();

          parsedData = {
            powerflow: {
              load: parseFloat(
                response.siteCurrentPowerFlow.LOAD.currentPower.replace(
                  /\D/g,
                  ""
                )
              ),
              pv: parseFloat(
                response.siteCurrentPowerFlow.PV.currentPower.replace(/\D/g, "")
              ),
              grid: parseFloat(
                response.siteCurrentPowerFlow.GRID.currentPower.replace(
                  /\D/g,
                  ""
                )
              ),
              soc: response.siteCurrentPowerFlow.STORAGE?.chargeLevel || 0,
              unit: "kW",
            },
          };
          break;

        case "solaredge":
          response = await dispatch(
            fetchSolarEdgeRealtimeData({ plantId: formattedPlantId, token })
          ).unwrap();

          parsedData = {
            powerflow: {
              load: response.siteCurrentPowerFlow.LOAD.currentPower,
              pv: response.siteCurrentPowerFlow.PV.currentPower,
              grid: response.siteCurrentPowerFlow.GRID.currentPower,
              soc: response.siteCurrentPowerFlow.STORAGE?.chargeLevel || 0,
              unit: response.siteCurrentPowerFlow.unit,
            },
          };
          break;

        default:
          throw new Error("Unsupported provider");
      }

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
  }, [formattedPlantId, token, dispatch, provider]);

  useEffect(() => {
    if (!formattedPlantId || !token) {
      return;
    }

    fetchRealtimeData();
    const interval = setInterval(fetchRealtimeData, 30000);
    return () => clearInterval(interval);
  }, [fetchRealtimeData, formattedPlantId, token]);

  if (!formattedPlantId) {
    return null;
  }

  const {
    load = 0,
    pv = 0,
    grid = 0,
    soc = 0,
    unit = "kW",
  } = realtimeData?.powerflow || {};

  const formatPowerValue = (value, unit) => {
    if (provider === "goodwe") {
      return `${parseFloat(value.replace(/\D/g, ""))}`;
    } else {
      return `${value.toFixed(2)} ${unit}`;
    }
  };

  return (
    <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 mb-6 backdrop-blur-sm">
      {isMobile ? (
        <div className="relative flex flex-col justify-left mb-6">
          <h2 className="text-xl font-semibold text-custom-dark-blue dark:text-custom-yellow mb-4">
            {t("Real-Time Energy Flow")}
          </h2>
          <div className="relative flex items-center gap-2 justify-around">
            <span className="text-left text-sm text-gray-600 dark:text-gray-400">
              {t("lastUpdated")}: {lastUpdatedRef.current}
            </span>
            <EnergyLoadingClock
              duration={30}
              onComplete={fetchRealtimeData}
              isPaused={isFetching}
            />
          </div>
        </div>
      ) : (
        // Desktop layout
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
              {t("lastUpdated")}: {lastUpdatedRef.current}
            </span>
          </div>
        </div>
      )}

      {/* Energy Flow */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Energy Consumed */}
        <div className="w-full md:w-1/3 group flex flex-col items-center gap-4 relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 w-full h-52 -top-6 rounded-full bg-custom-light-gray/05 dark:bg-gray-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
          <FontAwesomeIcon
            icon={faHouse}
            className="text-custom-dark-blue dark:text-custom-yellow text-[150px] group-hover:scale-105 transition-transform my-4"
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

        {/* Energy Produced */}
        <div className="w-full md:w-1/3 group flex flex-col items-center gap-4 relative">
          <div className="absolute inset-0 w-full h-52 -top-6 rounded-full bg-custom-light-gray/05 dark:bg-gray-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
          <FontAwesomeIcon
            icon={faSolarPanel}
            className="text-custom-dark-blue dark:text-custom-yellow text-[150px] group-hover:scale-105 transition-transform my-4"
          />
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

        {/* Energy Exported */}
        <div className="w-full md:w-1/3 group flex flex-col items-center gap-4 relative">
          <div className="absolute inset-0 w-full h-52 -top-6 rounded-full bg-custom-light-gray/05 dark:bg-gray-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
          <UtilityPole
            size={150}
            className="text-custom-dark-blue dark:text-custom-yellow group-hover:scale-105 transition-transform my-4"
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
  );
});

EnergyFlowDisplay.displayName = "EnergyFlowDisplay";

export default EnergyFlowDisplay;
