import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  Bar,
  ReferenceLine,
  Area,
} from "recharts";
import {
  fetchVictronEnergyGraphData,
  selectGraphData,
  selectGraphLoading,
  selectGraphError,
  clearGraphData,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import DateRangeModal from "./DateRangeModal";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subHours,
  subMonths,
  subWeeks,
} from "date-fns";
import { es } from "date-fns/locale";
import { useDataFetchWithRetry } from "@/hooks/useDataFetchWithRetry";
import useDeviceType from "@/hooks/useDeviceType";
import { selectTheme } from "@/store/slices/themeSlice";
import VictronGraphSkeleton from "../loadingSkeletons/VictronGraphSkeleton";
import { FiAlertCircle } from "react-icons/fi";

const getColors = (theme) => ({
  consumption: theme === "dark" ? "#FFD57B" : "#BDBFC0",
  solar: theme === "dark" ? "#BDBFC0" : "#0B2738",
  solarPredicted: theme === "dark" ? "#657880" : "#FFD57B",
  consumptionPredicted: theme === "dark" ? "#A48D67" : "#9CA3AF",
  battery: theme === "dark" ? "#9CA3AF" : "#AD936A",
});

const MetricCard = ({ title, value, predictedValue, icon, unit = "kWh" }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl shadow-lg hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-medium text-custom-dark-blue dark:text-custom-yellow">
          {title}
        </h3>
      </div>
      <p className="text-xl font-bold text-custom-dark-blue dark:text-custom-light-gray">
        {value} {unit}
      </p>
      {predictedValue && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("Total previsto")}: {predictedValue} {unit}
        </p>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);
  const COLORS = getColors(theme);

  if (!active || !payload || !payload.length) return null;

  const hasVoltageData = payload[0]?.payload?.batteryVoltage !== undefined;

  return (
    <div
      className={`
      p-3 rounded-lg shadow-lg min-w-[200px]
      ${
        theme === "dark"
          ? "bg-slate-800 text-gray-100 border border-gray-700"
          : "bg-white text-gray-800 border border-gray-200"
      }
    `}
    >
      <p
        className={`
        mb-2 font-medium
        ${theme === "dark" ? "text-gray-300" : "text-gray-600"}
      `}
      >
        {format(new Date(label), "HH:mm, dd MMM yyyy")}
      </p>

      {/* Consumption */}
      {payload.find((p) => p.dataKey === "consumption") && (
        <div className="flex justify-between items-center gap-4">
          <span style={{ color: COLORS.consumption }}>{t("Consumo")}:</span>
          <span
            className={`font-medium ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {payload.find((p) => p.dataKey === "consumption").value.toFixed(2)}{" "}
            kWh
          </span>
        </div>
      )}

      {/* Solar */}
      {payload.find((p) => p.dataKey === "solar") && (
        <div className="flex justify-between items-center gap-4">
          <span style={{ color: COLORS.solar }}>{t("Solar")}:</span>
          <span
            className={`font-medium ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {payload.find((p) => p.dataKey === "solar").value.toFixed(2)} kWh
          </span>
        </div>
      )}

      {/* Battery Percentage */}
      {payload.find((p) => p.dataKey === "battery") && (
        <div className="flex justify-between items-center gap-4">
          <span style={{ color: COLORS.battery }}>{t("Batería")}:</span>
          <span
            className={`font-medium ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {payload.find((p) => p.dataKey === "battery").value.toFixed(2)}%
          </span>
        </div>
      )}

      {/* Battery Voltage */}
      {hasVoltageData && (
        <div className="flex justify-between items-center gap-4">
          <span style={{ color: COLORS.battery }}>{t("Tensión")}:</span>
          <span
            className={`font-medium ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {payload[0].payload.batteryVoltage.toFixed(2)} V
          </span>
        </div>
      )}

      {/* Min/Max Voltage if available */}
      {hasVoltageData && (
        <div
          className={`
          mt-2 pt-2 text-sm
          ${
            theme === "dark"
              ? "border-t border-gray-700"
              : "border-t border-gray-200"
          }
        `}
        >
          <div className="flex justify-between items-center">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              {t("Min")}:
            </span>
            <span className="font-medium">
              {payload[0].payload.batteryMin.toFixed(2)} V
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              {t("Max")}:
            </span>
            <span className="font-medium">
              {payload[0].payload.batteryMax.toFixed(2)} V
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const VictronEnergyGraph = ({ plantId, currentRange, setIsDateModalOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const COLORS = {
    consumption: theme === "dark" ? "#FFD57B" : "#BDBFC0",
    solar: theme === "dark" ? "#BDBFC0" : "#0B2738",
    solarPredicted: theme === "dark" ? "#657880" : "#FFD57B",
    consumptionPredicted: theme === "dark" ? "#A48D67" : "#9CA3AF",
    battery: theme === "dark" ? "#9CA3AF" : "#AD936A",
  };
  const [showForecast, setShowForecast] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [authError, setAuthError] = useState(false);
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const error = useSelector(selectGraphError);
  const user = useSelector(selectUser);
  const { isMobile } = useDeviceType();

  // Update the validation function as well
  const validateGraphData = useCallback((data) => {
    if (!data?.records) return false;
    const records = data.records;
    return (
      Array.isArray(records?.bv) ||
      Array.isArray(records?.Pdc) ||
      Array.isArray(records?.bs) ||
      Array.isArray(records?.total_consumption) ||
      Array.isArray(records?.total_solar_yield)
    );
  }, []);

  const canShowForecast = useCallback((rangeType) => {
    return ["today"].includes(rangeType);
  }, []);

  const {
    handleFetch: fetchGraphData,
    isLoading: retryLoading,
    hasEmptyData,
  } = useDataFetchWithRetry({
    fetchAction: fetchVictronEnergyGraphData,
    clearAction: clearGraphData,
    data: graphData,
    validateData: validateGraphData,
    maxRetries: 3,
    retryDelay: 1000,
    token: user?.tokenIdentificador,
  });

  // Forecast data fetching
  const fetchForecastData = async () => {
    setIsForecastLoading(true);
    try {
      const { start, end } = calculateDateRange(currentRange);
      const { interval } = getRangeParams(currentRange.type);

      const forecastParams = {
        id: plantId,
        interval,
        type: "forecast",
        start,
        end,
      };

      const result = await fetchGraphData(forecastParams);
      setForecastData(result);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    } finally {
      setIsForecastLoading(false);
    }
  };

  const handleForecastToggle = async () => {
    if (!showForecast && !forecastData) {
      await fetchForecastData();
    }
    setShowForecast(!showForecast);
  };

  const getRangeParams = useCallback(
    (rangeType) => {
      switch (rangeType) {
        case "last2days":
          return { interval: "hours", type: "live_feed" };
        case "last7days":
          return { interval: "days", type: "live_feed" };
        case "last30days":
          return { interval: "days", type: "live_feed" };
        case "last90days":
          return { interval: isMobile ? "weeks" : "days", type: "live_feed" };
        case "last6months":
          return { interval: "months", type: "live_feed" };
        case "today":
          return {
            interval: "hours",
            type: showForecast ? "forecast" : "live_feed",
          };
        case "thisWeek":
          return { interval: "days", type: "live_feed" };
        case "thisMonth":
          return { interval: "days", type: "live_feed" };
        case "thisYear":
          return { interval: "months", type: "live_feed" };
        case "last12months":
          return { interval: "months", type: "live_feed" };
        case "yesterday":
          return { interval: "hours", type: "live_feed" };
        case "theDayBeforeYesterday":
          return { interval: "hours", type: "live_feed" };
        case "thisDayLastWeek":
          return { interval: "hours", type: "live_feed" };
        case "lastMonth":
          return { interval: "days", type: "live_feed" };
        case "lastWeek":
          return { interval: "days", type: "live_feed" };
        case "lastHour":
          return { interval: "15mins", type: "live_feed" };
        case "last3Hours":
          return { interval: "hours", type: "live_feed" };
        case "last6Hours":
          return { interval: "hours", type: "live_feed" };
        case "last12Hours":
          return { interval: "hours", type: "live_feed" };
        case "last24Hours":
          return { interval: "hours", type: "live_feed" };
        case "custom":
          return { interval: "15mins", type: "custom" };
        default:
          return { interval: "hours", type: "live_feed" };
      }
    },
    [isMobile, showForecast]
  );

  const calculateDateRange = useCallback(
    (range) => {
      const now = new Date();
      const currentHour = new Date(now);
      currentHour.setMinutes(0, 0, 0);

      // For ranges that can have forecasts
      if (showForecast && ["today"].includes(range.type)) {
        switch (range.type) {
          case "today": {
            return {
              start: Math.floor(now.getTime() / 1000),
              end: Math.floor(endOfDay(now).getTime() / 1000),
            };
          }
          case "thisWeek": {
            return {
              start: Math.floor(now.getTime() / 1000),
              end: Math.floor(endOfWeek(now, { locale: es }).getTime() / 1000),
            };
          }
          case "thisMonth": {
            return {
              start: Math.floor(now.getTime() / 1000),
              end: Math.floor(endOfMonth(now).getTime() / 1000),
            };
          }
          case "thisYear": {
            return {
              start: Math.floor(now.getTime() / 1000),
              end: Math.floor(endOfYear(now).getTime() / 1000),
            };
          }
        }
      }

      // For historical data
      switch (range.type) {
        case "lastHour": {
          return {
            start: Math.floor(subHours(currentHour, 1).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "last3Hours": {
          return {
            start: Math.floor(subHours(currentHour, 3).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "last6Hours": {
          return {
            start: Math.floor(subHours(currentHour, 6).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "last12Hours": {
          return {
            start: Math.floor(subHours(currentHour, 12).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "last24Hours": {
          return {
            start: Math.floor(subHours(currentHour, 24).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "today": {
          return {
            start: Math.floor(startOfDay(now).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "yesterday": {
          return {
            start: Math.floor(startOfDay(subDays(now, 1)).getTime() / 1000),
            end: Math.floor(endOfDay(subDays(now, 1)).getTime() / 1000),
          };
        }
        case "twoDaysAgo": {
          return {
            start: Math.floor(startOfDay(subDays(now, 2)).getTime() / 1000),
            end: Math.floor(endOfDay(subDays(now, 2)).getTime() / 1000),
          };
        }
        case "thisWeek": {
          return {
            start: Math.floor(
              startOfWeek(now, { locale: es }).getTime() / 1000
            ),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "lastWeek": {
          const lastWeekStart = startOfWeek(subWeeks(now, 1), { locale: es });
          const lastWeekEnd = endOfWeek(subWeeks(now, 1), { locale: es });
          return {
            start: Math.floor(lastWeekStart.getTime() / 1000),
            end: Math.floor(lastWeekEnd.getTime() / 1000),
          };
        }
        case "thisMonth": {
          return {
            start: Math.floor(startOfMonth(now).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "lastMonth": {
          return {
            start: Math.floor(startOfMonth(subMonths(now, 1)).getTime() / 1000),
            end: Math.floor(endOfMonth(subMonths(now, 1)).getTime() / 1000),
          };
        }
        case "last2days": {
          return {
            start: Math.floor(startOfDay(subDays(now, 2)).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "last7days": {
          return {
            start: Math.floor(startOfDay(subDays(now, 7)).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "last30days": {
          return {
            start: Math.floor(startOfDay(subDays(now, 30)).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "last90days": {
          return {
            start: Math.floor(startOfDay(subDays(now, 90)).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "last6months": {
          return {
            start: Math.floor(startOfMonth(subMonths(now, 6)).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
        case "custom": {
          return {
            start: Math.floor(range.start.getTime() / 1000),
            end: Math.floor(range.end.getTime() / 1000),
          };
        }
        default: {
          return {
            start: Math.floor(subHours(currentHour, 3).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }
      }
    },
    [showForecast]
  );

  const formatXAxis = useCallback(
    (timestamp) => {
      const date = new Date(timestamp);

      switch (currentRange.type) {
        case "last2days":
        case "last7days":
        case "last30days":
        case "last6months":
        case "lastWeek":
        case "lastMonth":
          return format(date, "dd MMM");
        case "last90days":
          return format(date, "dd MMM");
        case "today":
          return format(date, "HH:mm"); // Show hours for today's forecast
        case "thisWeek":
          return format(date, "EEE"); // Show remaining days of the week
        case "thisMonth":
          return format(date, "dd"); // Show remaining days of month
        case "thisYear":
          return format(date, "MMM"); // Show remaining months
        case "lastHour":
        case "last3Hours":
        case "last6Hours":
        case "last12Hours":
        case "last24Hours":
          return format(date, "HH:mm");
        case "custom":
          return format(date, "MM-dd");
        default:
          return format(date, "MM-dd");
      }
    },
    [currentRange]
  );

  const transformData = useCallback(
    (rawData, forecastData) => {
      // console.log("Raw Data passed to transformData:", rawData);

      // If we're in forecast mode and have forecast data
      if (showForecast && rawData?.records) {
        const forecastRecords = rawData.records;

        if (
          Array.isArray(forecastRecords.vrm_consumption_fc) &&
          Array.isArray(forecastRecords.solar_yield_forecast)
        ) {
          const now = new Date();

          const processedData = forecastRecords.vrm_consumption_fc
            .filter((entry) => entry[0] >= now.getTime())
            .map((entry) => {
              const timestamp = entry[0];
              const solarEntry = forecastRecords.solar_yield_forecast.find(
                (solar) => solar[0] === timestamp
              );

              return {
                timestamp,
                consumption: entry[1] || 0,
                solar: solarEntry?.[1] || 0,
                battery: null,
                solarYield: solarEntry?.[1] || 0,
                forecastConsumption: entry[1] || 0,
                forecastSolar: solarEntry?.[1] || 0,
              };
            });

          return processedData.sort((a, b) => a.timestamp - b.timestamp);
        }
      }

      // Original historical data processing
      if (!rawData?.records) {
        console.warn("No valid records in response:", rawData);
        return [];
      }

      const records = rawData.records;

      // Determine which type of data we have
      const hasBatteryVoltage =
        Array.isArray(records?.bv) && records.bv.length > 0;
      const hasBatteryState =
        Array.isArray(records?.bs) && records.bs.length > 0;
      const hasPdcData = Array.isArray(records?.Pdc);
      const hasConsumption = Array.isArray(records?.total_consumption);
      const hasSolarYield = Array.isArray(records?.total_solar_yield);

      // If we have battery voltage data, use it as primary reference
      if (hasBatteryVoltage) {
        const processedData = records.bv.map((bvEntry) => {
          const timestamp = bvEntry[0];
          const batteryVoltage = bvEntry[1] || 0; // Average voltage
          const minVoltage = bvEntry[2] || 0; // Min voltage
          const maxVoltage = bvEntry[3] || 0; // Max voltage

          // Get battery state (percentage) for the same timestamp
          const batteryPercentage = hasBatteryState
            ? records.bs.find((entry) => entry[0] === timestamp)?.[1] || 0
            : 0;

          // Get consumption and solar data if available
          const consumption = hasConsumption
            ? records.total_consumption.find(
                (entry) => entry[0] === timestamp
              )?.[1] || 0
            : 0;

          const solar = hasSolarYield
            ? records.total_solar_yield.find(
                (entry) => entry[0] === timestamp
              )?.[1] || 0
            : 0;

          return {
            timestamp,
            consumption,
            solar,
            battery: batteryPercentage, // Use percentage for the main line
            batteryVoltage, // Keep voltage data for tooltip
            batteryMin: minVoltage,
            batteryMax: maxVoltage,
            solarYield: solar,
            forecastConsumption: null,
            forecastSolar: null,
          };
        });

        return processedData.sort((a, b) => a.timestamp - b.timestamp);
      }

      // If we have Pdc data, use it as reference
      if (hasPdcData) {
        return records.Pdc.map((pdcEntry) => {
          const timestamp = pdcEntry[0];

          // Get battery state if available
          const batteryState = hasBatteryState
            ? records.bs.find((entry) => entry[0] === timestamp)?.[1] || 0
            : null;

          const consumption = hasConsumption
            ? records.total_consumption.find(
                (entry) => entry[0] === timestamp
              )?.[1] || 0
            : 0;

          const solar = hasSolarYield
            ? records.total_solar_yield.find(
                (entry) => entry[0] === timestamp
              )?.[1] || 0
            : 0;

          return {
            timestamp,
            consumption,
            solar,
            battery: batteryState,
            solarYield: solar,
            forecastConsumption: null,
            forecastSolar: null,
          };
        }).sort((a, b) => a.timestamp - b.timestamp);
      }

      // If we only have battery state data
      if (hasBatteryState) {
        return records.bs
          .map((bsEntry) => {
            const timestamp = bsEntry[0];
            const batteryState = bsEntry[1] || 0;

            const consumption = hasConsumption
              ? records.total_consumption.find(
                  (entry) => entry[0] === timestamp
                )?.[1] || 0
              : 0;

            const solar = hasSolarYield
              ? records.total_solar_yield.find(
                  (entry) => entry[0] === timestamp
                )?.[1] || 0
              : 0;

            return {
              timestamp,
              consumption,
              solar,
              battery: batteryState,
              solarYield: solar,
              forecastConsumption: null,
              forecastSolar: null,
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp);
      }

      // If we only have consumption or solar data
      if (hasConsumption || hasSolarYield) {
        const timestamps = new Set([
          ...(hasConsumption
            ? records.total_consumption.map((entry) => entry[0])
            : []),
          ...(hasSolarYield
            ? records.total_solar_yield.map((entry) => entry[0])
            : []),
        ]);

        return Array.from(timestamps)
          .map((timestamp) => {
            const consumption = hasConsumption
              ? records.total_consumption.find(
                  (entry) => entry[0] === timestamp
                )?.[1] || 0
              : 0;

            const solar = hasSolarYield
              ? records.total_solar_yield.find(
                  (entry) => entry[0] === timestamp
                )?.[1] || 0
              : 0;

            return {
              timestamp,
              consumption,
              solar,
              battery: null,
              solarYield: solar,
              forecastConsumption: null,
              forecastSolar: null,
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp);
      }

      // If we don't have any of the expected data structures
      console.warn("No supported data format found in records:", records);
      return [];
    },
    [showForecast]
  );

  const getAvailableYAxisId = (
    hasBatteryVoltage,
    hasConsumption,
    hasSolar,
    hasBatteryState
  ) => {
    if (hasConsumption || hasSolar) return "power";
    if (hasBatteryVoltage) return "voltage";
    if (hasBatteryState) return "percentage";
    return "power"; // Default fallback
  };

  const chartData = useMemo(() => {
    if (!graphData?.records) {
      console.error("No records found in graphData");
      return [];
    }

    return transformData(graphData, forecastData);
  }, [graphData, forecastData, transformData]);

  const totals = useMemo(() => {
    if (!graphData || !graphData.records) {
      return {
        consumption: 0,
        solar: 0,
        battery: 0,
        totalConsumption: 0,
        totalSolar: 0,
        genset: false,
      };
    }

    const records = graphData.records;

    // Check if total_consumption and total_solar_yield are available and not empty
    const totalConsumption =
      Array.isArray(records.total_consumption) &&
      records.total_consumption.length > 0
        ? records.total_consumption.reduce(
            (sum, item) => sum + (item[1] || 0),
            0
          )
        : 0;

    const totalSolar =
      Array.isArray(records.total_solar_yield) &&
      records.total_solar_yield.length > 0
        ? records.total_solar_yield.reduce(
            (sum, item) => sum + (item[1] || 0),
            0
          )
        : 0;

    const genset = records.total_genset;

    return {
      consumption: records.grid_history_to ? records.grid_history_to : 0,
      solar: records.grid_history_from ? records.grid_history_from : 0,
      battery: genset ? genset : "-",
      totalConsumption: totalConsumption.toFixed(1),
      totalSolar: totalSolar.toFixed(1),
      genset,
    };
  }, [graphData]);

  useEffect(() => {
    setIsInitialLoad(true);
    const { start, end } = calculateDateRange(currentRange);
    const { interval, type } = getRangeParams(currentRange.type);

    const params = {
      id: plantId,
      interval,
      type,
      start,
      end,
    };

    fetchGraphData(params)
      .then(() => {
        setIsInitialLoad(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        if (error.message === "El token no se puede authentificar con exito") {
          setAuthError(true);
        }
        setIsInitialLoad(false);
      });

    return () => dispatch(clearGraphData());
  }, [
    plantId,
    user?.tokenIdentificador,
    currentRange,
    fetchGraphData,
    dispatch,
    calculateDateRange,
    getRangeParams,
  ]);

  const handleRangeSelect = useCallback((range) => {
    setCurrentRange(range);
    setIsDateModalOpen(false);
  }, []);

  const hasBatteryVoltage =
    chartData.length > 0 && "batteryMin" in chartData[0];
  const hasConsumption =
    chartData.length > 0 && chartData.some((d) => d.consumption > 0);
  const hasSolar = chartData.length > 0 && chartData.some((d) => d.solar > 0);
  const hasBatteryState =
    chartData.length > 0 && chartData.some((d) => d.battery !== null);
  const hasNoData =
    chartData.length === 0 ||
    (!hasConsumption && !hasSolar && !hasBatteryState);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto">
            {canShowForecast(currentRange.type) && (
              <button
                className="select-none px-4 py-2 bg-custom-light-blue dark:bg-custom-dark-blue rounded-xl shadow-lg hover:shadow-xl transition-all text-custom-dark-blue dark:text-custom-light-gray w-full sm:w-auto"
                onClick={handleForecastToggle}
                disabled={isForecastLoading}
              >
                {isForecastLoading
                  ? t("Cargando pronóstico...")
                  : showForecast
                  ? t("Ocultar pronóstico")
                  : t("Mostrar pronóstico")}
              </button>
            )}
          </div>
          <button
            className="select-none px-4 py-2 bg-custom-light-blue dark:bg-custom-dark-blue rounded-xl shadow-lg hover:shadow-xl transition-all text-custom-dark-blue dark:text-custom-light-gray w-full sm:w-auto ml-auto"
            onClick={() => setIsDateModalOpen(true)}
          >
            {t(currentRange.type)}
          </button>
        </div>

        <div className="bg-white dark:bg-custom-dark-blue p-6 rounded-xl shadow-lg">
          {(isInitialLoad || isLoading || retryLoading) && (
            <VictronGraphSkeleton theme={theme} />
          )}

          {error && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center text-red-500">
                <p>{t("Error al cargar los datos")}</p>
                <p className="text-sm">{error.message}</p>
                <button
                  onClick={() => {
                    const { start, end } = calculateDateRange(currentRange);
                    const { interval, type } = getRangeParams(
                      currentRange.type
                    );
                    fetchGraphData({
                      id: plantId,
                      interval,
                      type,
                      start,
                      end,
                    });
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {t("Reintentar")}
                </button>
              </div>
            </div>
          )}

          {!isInitialLoad && !isLoading && !retryLoading && !error && (
            <>
              <div className="overflow-x-auto">
                <div style={{ minWidth: "600px" }}>
                  {hasNoData ? (
                    <div className="h-[400px] mb-6 flex flex-col items-center justify-center w-full bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <FiAlertCircle className="text-4xl mb-3 text-slate-400 dark:text-slate-500" />
                      <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                        {t("noDataAvailable")}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        {t("tryAnotherTimeRange")}
                      </p>
                      <button
                        onClick={() => setIsDateModalOpen(true)}
                        className="mt-4 px-4 py-2 text-sm bg-custom-yellow text-custom-dark-blue rounded-lg hover:bg-opacity-90 transition-all"
                      >
                        {t("selectDifferentRange")}
                      </button>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={formatXAxis}
                          type="number"
                          domain={["dataMin", "dataMax"]}
                          scale="time"
                          interval="preserveStartEnd"
                          tick={{ fontSize: 12 }}
                          className="text-custom-dark-blue dark:text-custom-light-gray"
                        />
                        <YAxis
                          yAxisId="power"
                          orientation="left"
                          label={{
                            value: "kWh",
                            angle: -90,
                            position: "insideLeft",
                            offset: 10,
                          }}
                          className="text-custom-dark-blue dark:text-custom-light-gray"
                        />
                        {hasBatteryState && (
                          <YAxis
                            yAxisId="percentage"
                            orientation="right"
                            domain={[0, 100]}
                            label={{
                              value: "%",
                              angle: 90,
                              position: "insideRight",
                              offset: 10,
                            }}
                            className="text-custom-dark-blue dark:text-custom-light-gray"
                          />
                        )}
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="top"
                          height={36}
                          className="text-custom-dark-blue dark:text-custom-light-gray"
                          payload={[
                            ...(hasConsumption
                              ? [
                                  {
                                    value: t("Consumo"),
                                    type: "line",
                                    color: COLORS.consumption,
                                  },
                                ]
                              : []),
                            ...(hasSolar
                              ? [
                                  {
                                    value: t("Solar"),
                                    type: "line",
                                    color: COLORS.solar,
                                  },
                                ]
                              : []),
                            ...(hasBatteryState
                              ? [
                                  {
                                    value: t("Batería"),
                                    type: "line",
                                    color: COLORS.battery,
                                  },
                                ]
                              : []),
                          ]}
                        />

                        {hasConsumption && (
                          <Line
                            type="monotone"
                            dataKey="consumption"
                            stroke={COLORS.consumption}
                            yAxisId="power"
                            name={t("Consumo")}
                            strokeWidth={3}
                            dot={false}
                            unit="kWh"
                          />
                        )}

                        {hasSolar && (
                          <Line
                            type="monotone"
                            dataKey="solar"
                            stroke={COLORS.solar}
                            yAxisId="power"
                            name={t("Solar")}
                            strokeWidth={3}
                            dot={false}
                            unit="kWh"
                          />
                        )}

                        {hasBatteryState && (
                          <Line
                            type="monotone"
                            dataKey="battery"
                            stroke={COLORS.battery}
                            yAxisId="percentage"
                            name={t("Batería")}
                            strokeWidth={3}
                            dot={false}
                            unit="%"
                          />
                        )}

                        {showForecast && !isForecastLoading && (
                          <>
                            {chartData.some(
                              (data) => data.forecastSolar !== null
                            ) && (
                              <Line
                                type="monotone"
                                dataKey="forecastSolar"
                                stroke={COLORS.solarPredicted}
                                strokeWidth={2}
                                dot={false}
                                fillOpacity={0.5}
                                yAxisId="power"
                                name={t("Solar previsto")}
                                unit="kWh"
                                connectNulls={true}
                              />
                            )}
                            {chartData.some(
                              (data) => data.forecastConsumption !== null
                            ) && (
                              <Line
                                type="monotone"
                                dataKey="forecastConsumption"
                                stroke={COLORS.consumptionPredicted}
                                strokeWidth={2}
                                dot={false}
                                fillOpacity={0.5}
                                yAxisId="power"
                                name={t("Consumo previsto")}
                                unit="kWh"
                                connectNulls={true}
                              />
                            )}
                          </>
                        )}
                        <ReferenceLine
                          x={new Date().getTime()}
                          stroke="#666"
                          label="Now"
                          strokeDasharray="3 3"
                          yAxisId="power"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                {/* Battery Voltage Metrics */}
                {hasBatteryVoltage && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <MetricCard
                      title={t("Tensión mínima")}
                      value={
                        chartData.length > 0
                          ? Math.min(
                              ...chartData.map((d) => d.batteryMin)
                            ).toFixed(2)
                          : "-"
                      }
                      icon={null}
                      unit="V"
                    />
                    <MetricCard
                      title={t("Tensión máxima")}
                      value={
                        chartData.length > 0
                          ? Math.max(
                              ...chartData.map((d) => d.batteryMax)
                            ).toFixed(2)
                          : "-"
                      }
                      icon={null}
                      unit="V"
                    />
                    <MetricCard
                      title={t("Tensión promedio")}
                      value={
                        chartData.length > 0
                          ? (
                              chartData.reduce((sum, d) => sum + d.battery, 0) /
                              chartData.length
                            ).toFixed(2)
                          : "-"
                      }
                      icon={null}
                      unit="V"
                    />
                    <MetricCard
                      title={t("Rango de tensión")}
                      value={
                        chartData.length > 0
                          ? `${Math.min(
                              ...chartData.map((d) => d.batteryMin)
                            ).toFixed(2)} - ${Math.max(
                              ...chartData.map((d) => d.batteryMax)
                            ).toFixed(2)}`
                          : "-"
                      }
                      icon={null}
                      unit="V"
                    />
                    <MetricCard
                      title={t("Última lectura")}
                      value={
                        chartData.length > 0
                          ? chartData[chartData.length - 1].battery.toFixed(2)
                          : "-"
                      }
                      icon={null}
                      unit="V"
                    />
                  </div>
                )}

                {/* Power Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <MetricCard
                    title={t("Hasta la entrada CA")}
                    value={
                      graphData.grid_history_to
                        ? graphData.grid_history_to.toFixed(1)
                        : "-"
                    }
                    icon={null}
                    unit="kWh"
                  />
                  <MetricCard
                    title={t("Entrada CA activa")}
                    value={
                      graphData.grid_history_from
                        ? graphData.grid_history_from.toFixed(1)
                        : "-"
                    }
                    icon={null}
                    unit="kWh"
                  />
                  <MetricCard
                    title={t("Generador")}
                    value={totals.genset ? totals.genset.toFixed(1) : "-"}
                    icon={null}
                    unit="kWh"
                  />
                  <MetricCard
                    title={t("Consumo")}
                    value={totals.totalConsumption}
                    icon={null}
                    unit="kWh"
                  />
                  <MetricCard
                    title={t("Solar")}
                    value={totals.totalSolar}
                    icon={null}
                    unit="kWh"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VictronEnergyGraph;
