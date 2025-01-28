import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Legend,
  Line,
  ReferenceLine,
  Area,
  BandedChart,
  Band,
  Polygon,
} from "recharts";
import {
  fetchVictronEnergyGraphData,
  selectGraphData,
  selectGraphLoading,
  selectGraphError,
  clearGraphData,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { useDataFetchWithRetry } from "@/hooks/useDataFetchWithRetry";
import useDeviceType from "@/hooks/useDeviceType";
import { selectTheme } from "@/store/slices/themeSlice";
import VictronGraphSkeleton from "@/components/loadingSkeletons/VictronGraphSkeleton";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subHours,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { es } from "date-fns/locale";
import { BiDotsVerticalRounded } from "react-icons/bi";
import CustomTooltip from "../CustomTooltip";
import BatteryMetrics from "../BatteryMetrics";
import PowerMetrics from "../PowerMetrics";
import NoDataDisplay from "../NoDataDisplay";

const getColors = (theme) => ({
  consumption: theme === "dark" ? "#BDBFC080" : "#0B2738",
  solarProduction: theme === "dark" ? "#AD936A" : "#BDBFC0",
  export: theme === "dark" ? "#657880" : "#FFD57B",
  import: theme === "dark" ? "#9CA3AF" : "#BDBFC0",
  batteryAverage: theme === "dark" ? "#FFD57B" : "rgb(255, 213, 122)",
  batteryMin: theme === "dark" ? "#BDBFC0" : "#BDBFC070",
  batteryMax: theme === "dark" ? "#A48D67" : "#AD936A",
});

const VictronEnergyGraph = ({
  plantId,
  currentRange,
  setIsDateModalOpen,
  onExportClick,
  onDataChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const COLORS = getColors(theme);

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
        case "lastYear": {
          return {
            interval: "months",
            type: "live_feed",
            aggregated: true,
          };
        }

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
        case "thisYear": {
          return {
            start: Math.floor(startOfYear(now).getTime() / 1000),
            end: Math.floor(now.getTime() / 1000),
          };
        }

        case "lastYear": {
          // We need to get full previous year: January to December
          const lastYearStart = startOfYear(subYears(now, 1)); // This gets January 1st of last year
          const lastYearEnd = endOfYear(subYears(now, 1)); // This gets December 31st of last year
          return {
            start: Math.floor(lastYearStart.getTime() / 1000),
            end: Math.floor(lastYearEnd.getTime() / 1000),
          };
        }
        case "last12months":
          const start = Math.floor(subMonths(now, 12).getTime() / 1000); // Start of the range (12 months ago)
          const end = Math.floor(now.getTime() / 1000); // Current time (end of the range)
          console.log("Start Date (last 12 months):", new Date(start * 1000));
          console.log("End Date (last 12 months):", new Date(end * 1000));
          return { start, end };
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
      if (!rawData?.records) {
        console.warn("No valid records in response:", rawData);
        return []; // Return empty array if no records exist
      }

      const records = rawData.records;

      // Log rawData structure for debugging
      console.log("Raw Records:", records);

      // Use Array.isArray() to validate the data before using .map()
      const totalConsumption = Array.isArray(records.total_consumption)
        ? records.total_consumption
        : []; // Ensure we fall back to an empty array if it's not an array
      const totalSolarYield = Array.isArray(records.total_solar_yield)
        ? records.total_solar_yield
        : [];
      const Pdc = Array.isArray(records.Pdc) ? records.Pdc : [];
      const bs = Array.isArray(records.bs) ? records.bs : [];
      const bv = Array.isArray(records.bv) ? records.bv : [];

      // Ensure totalConsumption and other data arrays are never undefined or null
      if (
        totalConsumption.length === 0 &&
        totalSolarYield.length === 0 &&
        Pdc.length === 0 &&
        bs.length === 0 &&
        bv.length === 0
      ) {
        console.warn(
          "All data arrays are empty or invalid, returning empty data set."
        );
        return []; // If all data arrays are invalid, return an empty array
      }

      // Get all timestamps from all available data arrays
      const allTimestamps = new Set([
        ...totalConsumption.map((entry) => entry[0]),
        ...totalSolarYield.map((entry) => entry[0]),
        ...Pdc.map((entry) => entry[0]),
        ...bs.map((entry) => entry[0]),
        ...bv.map((entry) => entry[0]),
      ]);

      console.log("All timestamps:", Array.from(allTimestamps)); // Log the generated timestamps

      // Map over all timestamps and gather the data
      return Array.from(allTimestamps)
        .map((timestamp) => {
          const dataPoint = {
            timestamp,
            consumption:
              totalConsumption.find((entry) => entry[0] === timestamp)?.[1] ||
              0,
            solar:
              totalSolarYield.find((entry) => entry[0] === timestamp)?.[1] || 0,
          };

          // Handle battery state data (min/max)
          const bsEntry = bs.find((entry) => entry[0] === timestamp);
          if (bsEntry) {
            dataPoint.battery = bsEntry[1] || null; // Battery percentage
            dataPoint.batteryStateMin = bsEntry[2] || null; // Min battery percentage
            dataPoint.batteryStateMax = bsEntry[3] || null; // Max battery percentage
          }

          // Handle battery voltage data
          const bvEntry = bv.find((entry) => entry[0] === timestamp);
          if (bvEntry) {
            dataPoint.batteryVoltage = bvEntry[1] || 0; // Current voltage
            dataPoint.batteryMin = bvEntry[2] || 0; // Min voltage
            dataPoint.batteryMax = bvEntry[3] || 0; // Max voltage
          }

          return dataPoint;
        })
        .sort((a, b) => a.timestamp - b.timestamp); // Sort the data by timestamp
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

    // Calculate total consumption properly
    const totalConsumption =
      Array.isArray(records.total_consumption) &&
      records.total_consumption.length > 0
        ? records.total_consumption.reduce((sum, item) => {
            const value = Number(item[1]) || 0;
            return sum + value;
          }, 0)
        : 0;

    // Calculate total solar properly
    const totalSolar =
      Array.isArray(records.total_solar_yield) &&
      records.total_solar_yield.length > 0
        ? records.total_solar_yield.reduce((sum, item) => {
            const value = Number(item[1]) || 0;
            return sum + value;
          }, 0)
        : 0;

    // Get battery and genset data
    const genset = records.total_genset;
    const gridHistoryTo = Number(records.grid_history_to) || 0;
    const gridHistoryFrom = Number(records.grid_history_from) || 0;

    // Calculate battery usage if available
    const batteryUsage =
      Array.isArray(records.bs) && records.bs.length > 0
        ? records.bs.reduce((sum, item) => {
            const value = Number(item[1]) || 0;
            return sum + value;
          }, 0) / records.bs.length // Average battery percentage
        : 0;

    return {
      consumption: gridHistoryTo,
      solar: gridHistoryFrom,
      battery: genset || batteryUsage || "-",
      totalConsumption: Number(totalConsumption).toFixed(1),
      totalSolar: Number(totalSolar).toFixed(1),
      genset,
      grid_history_to: gridHistoryTo,
      grid_history_from: gridHistoryFrom,
    };
  }, [graphData]);

  useEffect(() => {
    setIsInitialLoad(true);
    const { start, end } = calculateDateRange(currentRange);
    const { interval, type } = getRangeParams(currentRange.type);

    // Add debug logs for lastYear
    if (currentRange.type === "lastYear") {
      console.log("LastYear Request Parameters:", {
        id: plantId,
        interval,
        type,
        start: new Date(start * 1000).toISOString(),
        end: new Date(end * 1000).toISOString(),
      });
    }

    const params = {
      id: plantId,
      interval,
      type,
      start,
      end,
    };

    fetchGraphData(params)
      .then((response) => {
        if (currentRange.type === "lastYear") {
          console.log("LastYear API Response:", response);
          // Log record timestamps to see what dates we actually get
          if (response?.records?.total_consumption) {
            const dates = response.records.total_consumption.map((item) =>
              new Date(item[0]).toISOString()
            );
            console.log("Available dates in response:", dates);
          }
        }
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

  useEffect(() => {
    if (onDataChange) {
      onDataChange(chartData);
    }
  }, [chartData, onDataChange]);

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

  const handleRetry = () => {
    const { start, end } = calculateDateRange(currentRange);
    const { interval, type } = getRangeParams(currentRange.type);
    fetchGraphData({
      id: plantId,
      interval,
      type,
      start,
      end,
    });
  };

  return (
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
        <div className="flex items-center gap-4">
          <button
            className="select-none px-4 py-2 bg-custom-light-blue dark:bg-custom-dark-blue rounded-xl shadow-lg hover:shadow-xl transition-all text-custom-dark-blue dark:text-custom-light-gray w-full sm:w-auto"
            onClick={() => setIsDateModalOpen(true)}
          >
            {t(currentRange.type)}
          </button>
          <button
            onClick={onExportClick}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <BiDotsVerticalRounded className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
          </button>
        </div>
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
                onClick={handleRetry}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t("Reintentar")}
              </button>
            </div>
          </div>
        )}

        {!isInitialLoad && !isLoading && !retryLoading && !error && (
          <>
            <div className="overflow-x-auto overflow-y-hidden">
              <div style={{ minWidth: "600px", height: "400px" }}>
                {hasNoData ? (
                  <NoDataDisplay
                    onSelectRange={() => setIsDateModalOpen(true)}
                  />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
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
                        />
                      )}

                      {hasConsumption && (
                        <Bar
                          dataKey="consumption"
                          fill={COLORS.consumption}
                          name={t("Consumo")}
                          barSize={15}
                          yAxisId="power"
                          unit="kWh"
                        />
                      )}
                      {hasSolar && (
                        <Bar
                          dataKey="solar"
                          fill={COLORS.solarProduction}
                          name={t("Solar")}
                          barSize={15}
                          yAxisId="power"
                          unit="kWh"
                        />
                      )}
                      {hasBatteryState && (
                        <>
                          <Line
                            type="monotone"
                            yAxisId="percentage"
                            dataKey="batteryStateMax"
                            stroke={COLORS.batteryMax}
                            fill={COLORS.batteryMax}
                            fillOpacity={0.2}
                            strokeWidth={2}
                            name={t("Batería Máx")}
                            dot={false}
                            unit="%"
                          />
                          <Line
                            type="monotone"
                            yAxisId="percentage"
                            dataKey="batteryStateMin"
                            stroke={COLORS.batteryMin}
                            strokeWidth={2}
                            name={t("Batería Mín")}
                            dot={false}
                            unit="%"
                          />
                          <Line
                            type="monotone"
                            dataKey="battery"
                            stroke={COLORS.batteryAverage}
                            yAxisId="percentage"
                            name={t("Batería")}
                            strokeWidth={3}
                            dot={false}
                            unit="%"
                          />
                        </>
                      )}

                      {showForecast && !isForecastLoading && (
                        <>
                          {chartData.some(
                            (data) => data.forecastSolar !== null
                          ) && (
                            <Line
                              type="monotone"
                              dataKey="forecastSolar"
                              stroke={COLORS.solarProduction}
                              strokeWidth={2}
                              dot={false}
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
                              stroke={COLORS.consumption}
                              strokeWidth={2}
                              dot={false}
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
                                  color: COLORS.solarProduction,
                                },
                              ]
                            : []),
                          ...(hasBatteryState
                            ? [
                                {
                                  value: t("Batería Min"),
                                  type: "line",
                                  color: COLORS.batteryMin,
                                },
                                {
                                  value: t("Batería Average"),
                                  type: "line",
                                  color: COLORS.batteryAverage,
                                },
                                {
                                  value: t("Batería Max"),
                                  type: "line",
                                  color: COLORS.batteryMax,
                                },
                              ]
                            : []),
                        ]}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="space-y-6">
              {hasBatteryVoltage && <BatteryMetrics chartData={chartData} />}
              <PowerMetrics graphData={graphData} totals={totals} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VictronEnergyGraph;
