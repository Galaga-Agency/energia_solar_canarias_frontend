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

const COLORS = {
  consumption: "#FF5252",
  solar: "#FFEB3B",
  solarPredicted: "#FFB300",
  consumptionPredicted: "#FF5252",
  battery: "#2196F3",
};

const MetricCard = ({ title, value, predictedValue, icon }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-custom-dark-blue p-4 rounded-xl shadow-lg transition-all hover:shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-medium text-custom-dark-blue dark:text-custom-yellow">
          {title}
        </h3>
      </div>
      <p className="text-xl font-bold text-custom-dark-blue dark:text-custom-light-gray">
        {value} kWh
      </p>
      {predictedValue && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("Total previsto")}: {predictedValue} kWh
        </p>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-3 border rounded shadow-lg">
      <p className="text-gray-600">
        {format(new Date(label), "HH:mm, dd MMM yyyy")}
      </p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toFixed(2)} {entry.unit}
        </p>
      ))}
    </div>
  );
};

const VictronEnergyGraph = ({ plantId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // States
  const [showForecast, setShowForecast] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [currentRange, setCurrentRange] = useState({ type: "last3Hours" });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Selectors
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const error = useSelector(selectGraphError);
  const user = useSelector(selectUser);
  const { isMobile } = useDeviceType();

  const validateGraphData = useCallback((data) => {
    return data != null;
  }, []);

  const canShowForecast = useCallback((rangeType) => {
    return ["today", "thisWeek", "thisMonth", "thisYear"].includes(rangeType);
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
        case "thisWeek":
        case "thisMonth":
        case "thisYear":
          return {
            interval: rangeType === "today" ? "hours" : "days",
            type: showForecast ? "forecast" : "live_feed",
          };
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
      if (
        showForecast &&
        ["today", "thisWeek", "thisMonth", "thisYear"].includes(range.type)
      ) {
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
      console.log("Raw Data passed to transformData:", rawData);

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

      // Ensure we have Pdc data
      if (!records?.Pdc) {
        console.warn("Missing Pdc data:", records);
        return [];
      }

      // Create a map of solar yield entries for efficient lookup
      const solarYieldMap = new Map(
        (records.total_solar_yield || []).map((entry) => [entry[0], entry[1]])
      );

      // Process the data safely, using Pdc length as the primary reference
      const processedData = records.Pdc.map((pdcEntry, index) => {
        // Safely access data, using 0 as default if index is out of bounds
        const consumption = records?.total_consumption?.[index]?.[1] || 0;

        // Use the solar yield value for the specific timestamp, or 0 if not found
        const timestamp = pdcEntry[0];
        const solar = solarYieldMap.get(timestamp) || 0;

        const battery = records?.bs?.[index]?.[1] || 0;

        // Prepare forecast data if `showForecast` is true and forecast arrays are present
        const forecastConsumption =
          showForecast && records?.vrm_consumption_fc?.[index]?.[1]
            ? records?.vrm_consumption_fc[index][1]
            : null;

        const forecastSolar =
          showForecast && records?.solar_yield_forecast?.[index]?.[1]
            ? records?.solar_yield_forecast[index][1]
            : null;

        return {
          timestamp, // timestamp
          consumption, // Safe access for consumption
          solar, // Safe access for solar
          battery, // Safe access for battery
          solarYield: solar, // Using the same value as solar for solarYield
          // Optional forecast data
          forecastConsumption,
          forecastSolar,
        };
      });

      // Sort the entire processed data by timestamp to ensure chronological order
      return processedData.sort((a, b) => a.timestamp - b.timestamp);
    },
    [showForecast]
  );

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

  if (isInitialLoad || isLoading || retryLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-dark-blue dark:border-custom-light-gray mb-4"></div>
          <p className="text-custom-dark-blue dark:text-custom-light-gray">
            {t("Cargando datos...")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto">
          {canShowForecast(currentRange.type) && (
            <button
              className="px-4 py-2 bg-custom-light-blue dark:bg-custom-dark-blue rounded-xl shadow-lg hover:shadow-xl transition-all text-custom-dark-blue dark:text-custom-light-gray w-full sm:w-auto"
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
          className="px-4 py-2 bg-custom-light-blue dark:bg-custom-dark-blue rounded-xl shadow-lg hover:shadow-xl transition-all text-custom-dark-blue dark:text-custom-light-gray w-full sm:w-auto ml-auto"
          onClick={() => setIsDateModalOpen(true)}
        >
          {currentRange.type}
        </button>
      </div>

      <div className="bg-white dark:bg-custom-dark-blue p-6 rounded-xl shadow-lg">
        {(isInitialLoad || isLoading || retryLoading) && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-dark-blue dark:border-custom-light-gray mb-4"></div>
              <p className="text-custom-dark-blue dark:text-custom-light-gray">
                {t("Cargando datos...")}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-red-500">
              <p>{t("Error al cargar los datos")}</p>
              <p className="text-sm">{error.message}</p>
              <button
                onClick={() => {
                  const { start, end } = calculateDateRange(currentRange);
                  const { interval, type } = getRangeParams(currentRange.type);
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
                    value: "kW",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                  }}
                  className="text-custom-dark-blue dark:text-custom-light-gray"
                />
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
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  className="text-custom-dark-blue dark:text-custom-light-gray"
                />

                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke={COLORS.consumption}
                  yAxisId="power"
                  name={t("Consumo")}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="solar"
                  stroke={COLORS.solar}
                  yAxisId="power"
                  name={t("Solar")}
                  strokeWidth={2}
                  dot={false}
                />
                {showForecast && !isForecastLoading && (
                  <>
                    {chartData.some((data) => data.forecastSolar !== null) && (
                      <Line
                        type="monotone"
                        dataKey="forecastSolar"
                        stroke={COLORS.solarPredicted}
                        strokeWidth={2}
                        dot={false}
                        fillOpacity={0.5}
                        yAxisId="power"
                        name={t("Solar previsto")}
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
                        connectNulls={true}
                      />
                    )}
                  </>
                )}

                <Line
                  type="monotone"
                  dataKey="battery"
                  stroke={COLORS.battery}
                  yAxisId="percentage"
                  name={t("Batería")}
                  strokeWidth={2}
                  dot={false}
                />

                <ReferenceLine
                  x={new Date().getTime()}
                  stroke="#666"
                  label="Now"
                  strokeDasharray="3 3"
                  yAxisId="power"
                />
              </ComposedChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
              <MetricCard
                title={t("Hasta la entrada CA")}
                value={
                  graphData.grid_history_to
                    ? graphData.grid_history_to.toFixed(1)
                    : "-"
                }
                icon={null}
              />
              <MetricCard
                title={t("Entrada CA activa")}
                value={
                  graphData.grid_history_from
                    ? graphData.grid_history_from.toFixed(1)
                    : "-"
                }
                icon={null}
              />
              <MetricCard
                title={t("Generador")}
                value={totals.genset ? totals.genset.toFixed(1) : "-"}
                icon={null}
              />
              <MetricCard
                title={t("Consumo")}
                value={totals.totalConsumption}
                icon={null}
              />
              <MetricCard
                title={t("Solar")}
                value={totals.totalSolar}
                icon={null}
              />
            </div>
          </>
        )}
      </div>

      <DateRangeModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSelectRange={handleRangeSelect}
      />
    </div>
  );
};

export default VictronEnergyGraph;
