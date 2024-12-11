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
  isValid,
} from "date-fns";
import { es } from "date-fns/locale";
import { useDataFetchWithRetry } from "@/hooks/useDataFetchWithRetry";

const GRAPH_TYPES = {
  LIVE_FEED: "live_feed",
  VENUS: "venus",
};

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

const VictronEnergyGraph = ({ plantId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showForecast, setShowForecast] = useState(true);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [currentRange, setCurrentRange] = useState({ type: "last3Hours" });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [authError, setAuthError] = useState(false);

  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const error = useSelector(selectGraphError);
  const user = useSelector(selectUser);

  const validateGraphData = useCallback((data) => {
    if (!data?.data?.records) return false;
    return Array.isArray(data.data.records);
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
    shouldRetry: (error) =>
      error?.message !== "El token no se puede authentificar con exito",
  });

  const getRangeDisplayText = (range) => {
    switch (range.type) {
      case "lastHour":
        return t("Última hora");
      case "last3Hours":
        return t("Últimas 3 horas");
      case "last6Hours":
        return t("Últimas 6 horas");
      case "last12Hours":
        return t("Últimas 12 horas");
      case "last24Hours":
        return t("Últimas 24 horas");
      case "today":
        return t("Hoy");
      case "yesterday":
        return t("Ayer");
      case "twoDaysAgo":
        return t("Anteayer");
      case "thisWeek":
        return t("Esta semana");
      case "lastWeek":
        return t("Semana pasada");
      case "thisMonth":
        return t("Este mes");
      case "lastMonth":
        return t("Mes pasado");
      case "last2days":
        return t("Últimos 2 días");
      case "last7days":
        return t("Últimos 7 días");
      case "last30days":
        return t("Últimos 30 días");
      case "last90days":
        return t("Últimos 90 días");
      case "last6months":
        return t("Últimos 6 meses");
      case "custom":
        return `${format(range.start, "dd/MM/yyyy")} - ${format(
          range.end,
          "dd/MM/yyyy"
        )}`;
      default:
        return t("Últimas 3 horas");
    }
  };

  const getDataInterval = (rangeType) => {
    switch (rangeType) {
      case "lastHour":
      case "last3Hours":
      case "last6Hours":
      case "last12Hours":
        return "15mins";
      case "last24Hours":
      case "today":
      case "yesterday":
      case "twoDaysAgo":
      case "last2days":
        return "hours";
      case "thisWeek":
      case "lastWeek":
      case "last7days":
        return "days";
      case "thisMonth":
      case "lastMonth":
      case "last30days":
        return "weeks";
      case "last90days":
      case "last6months":
        return "months";
      default:
        return "15mins";
    }
  };

  const calculateDateRange = (range) => {
    const now = new Date();
    const today = startOfDay(now);

    switch (range.type) {
      case "lastHour":
        return {
          start: subHours(now, 1),
          end: now,
        };
      case "last3Hours":
        return {
          start: subHours(now, 3),
          end: now,
        };
      case "last6Hours":
        return {
          start: subHours(now, 6),
          end: now,
        };
      case "last12Hours":
        return {
          start: subHours(now, 12),
          end: now,
        };
      case "last24Hours":
        return {
          start: subHours(now, 24),
          end: now,
        };
      case "today":
        return {
          start: today,
          end: now,
        };
      case "yesterday": {
        const yesterdayStart = subDays(today, 1);
        return {
          start: yesterdayStart,
          end: endOfDay(yesterdayStart),
        };
      }
      case "twoDaysAgo": {
        const twoDaysAgoStart = subDays(today, 2);
        return {
          start: twoDaysAgoStart,
          end: endOfDay(twoDaysAgoStart),
        };
      }
      case "thisWeek":
        return {
          start: startOfWeek(now, { locale: es }),
          end: now,
        };
      case "lastWeek": {
        const lastWeekStart = subDays(startOfWeek(now, { locale: es }), 7);
        return {
          start: lastWeekStart,
          end: endOfWeek(lastWeekStart, { locale: es }),
        };
      }
      case "thisMonth":
        return {
          start: startOfMonth(now),
          end: now,
        };
      case "lastMonth": {
        const lastMonth = subMonths(now, 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
        };
      }
      case "last2days":
        return {
          start: subDays(today, 2),
          end: now,
        };
      case "last7days":
        return {
          start: subDays(today, 7),
          end: now,
        };
      case "last30days":
        return {
          start: subDays(today, 30),
          end: now,
        };
      case "last90days":
        return {
          start: subDays(today, 90),
          end: now,
        };
      case "last6months":
        return {
          start: subMonths(today, 6),
          end: now,
        };
      case "custom":
        return {
          start: range.start,
          end: range.end,
        };
      default:
        return {
          start: subHours(now, 3),
          end: now,
        };
    }
  };

  const transformData = useCallback((rawData, rangeType) => {
    if (!rawData?.data?.records) {
      console.warn("No valid data in response:", rawData);
      return [];
    }

    const records = rawData.data.records;

    if (!Array.isArray(records)) {
      console.warn("Records is not an array:", records);
      return [];
    }

    // Process the records array
    const processedData = records
      .map((record) => {
        // Convert timestamps to numbers and ensure data type consistency
        const timestamp = new Date(record.timestamp || 0).getTime();

        return {
          timestamp,
          battery: typeof record.battery === "number" ? record.battery : null,
          solar: typeof record.solar === "number" ? record.solar : null,
          consumption:
            typeof record.consumption === "number" ? record.consumption : null,
        };
      })
      .filter((record) => record.timestamp > 0);

    // Sort by timestamp
    return processedData.sort((a, b) => a.timestamp - b.timestamp);
  }, []);

  const formatXAxis = (timestamp) => {
    if (!timestamp) {
      return "";
    }

    const numericTimestamp = Number(timestamp);
    if (isNaN(numericTimestamp)) {
      console.warn("Invalid timestamp:", timestamp);
      return "";
    }

    const date = new Date(numericTimestamp);
    if (!isValid(date)) {
      console.warn("Invalid date from timestamp:", timestamp);
      return "";
    }

    try {
      switch (currentRange.type) {
        case "lastHour":
        case "last3Hours":
        case "last6Hours":
        case "last12Hours":
          return format(date, "HH:mm");
        case "last24Hours":
        case "today":
        case "yesterday":
          return format(date, "HH:mm");
        case "twoDaysAgo":
        case "last2days":
          return format(date, "dd/MM HH:mm");
        case "thisWeek":
        case "lastWeek":
        case "last7days":
          return format(date, "EEE dd/MM", { locale: es });
        case "thisMonth":
        case "lastMonth":
        case "last30days":
          return format(date, "dd/MM");
        case "last90days":
          return format(date, "dd/MM");
        case "last6months":
          return format(date, "MMM yyyy", { locale: es });
        case "custom": {
          const diffDays =
            (currentRange.end - currentRange.start) / (1000 * 60 * 60 * 24);
          if (diffDays <= 1) return format(date, "HH:mm");
          if (diffDays <= 7) return format(date, "EEE HH:mm", { locale: es });
          if (diffDays <= 30) return format(date, "dd/MM");
          return format(date, "dd MMM", { locale: es });
        }
        default:
          return format(date, "HH:mm");
      }
    } catch (error) {
      console.error("Error formatting date:", error, timestamp);
      return "";
    }
  };

  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white dark:bg-custom-dark-blue p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-custom-dark-blue dark:text-custom-light-gray mb-2">
          {formatXAxis(label)}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-custom-dark-blue dark:text-custom-light-gray">
              {entry.name}: {Number(entry.value).toFixed(2)}
              {entry.dataKey === "battery" ? "%" : " kW"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const fetchData = useCallback(async () => {
    // Check if required data is available
    if (!plantId || !user?.tokenIdentificador) {
      console.warn("Missing required data");
      return; // Prevent the request if data is missing
    }

    try {
      setIsInitialLoad(true);
      const { start, end } = calculateDateRange(currentRange);

      // Ensure interval and other fields are set correctly
      const params = {
        plantId,
        interval: getDataInterval(currentRange.type),
        type: GRAPH_TYPES.LIVE_FEED, // Ensure type is defined
        fechaInicio: format(start, "yyyy-MM-dd"),
        fechaFin: format(end, "yyyy-MM-dd"),
        token: user.tokenIdentificador,
      };

      if (!params.interval || !params.fechaInicio || !params.fechaFin) {
        console.warn("Missing required parameters for API request:", params);
        return; // Prevent sending incomplete data
      }

      console.log("Fetching with params:", params);
      await fetchGraphData(params); // Send the request with validated params
    } catch (error) {
      if (error?.message === "El token no se puede authentificar con exito") {
        setAuthError(true);
      }
      console.error("Failed to fetch data:", error);
    } finally {
      setIsInitialLoad(false);
    }
  }, [plantId, currentRange, user?.tokenIdentificador, fetchGraphData]);

  useEffect(() => {
    if (user?.tokenIdentificador) {
      fetchData();
    }
    return () => dispatch(clearGraphData());
  }, [fetchData, dispatch, user?.tokenIdentificador]);

  const chartData = useMemo(() => {
    if (!graphData?.data?.records) return [];
    return transformData(graphData, currentRange.type);
  }, [graphData, transformData, currentRange.type]);

  const totals = useMemo(() => {
    if (!chartData.length) return { consumption: 0, solar: 0, battery: 0 };

    return chartData.reduce(
      (acc, curr) => ({
        consumption: acc.consumption + (curr.consumption || 0),
        solar: acc.solar + (curr.solar || 0),
        battery: acc.battery + (curr.battery || 0),
      }),
      { consumption: 0, solar: 0, battery: 0 }
    );
  }, [chartData]);

  const handleRangeSelect = (range) => {
    setCurrentRange(range);
    setIsDateModalOpen(false);
  };

  if (authError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-500">
          <p>{t("Error de autenticación")}</p>
          <p className="text-sm">{t("Por favor, inicie sesión nuevamente")}</p>
        </div>
      </div>
    );
  }

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-500">
          <p>{t("Error al cargar los datos")}</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          className="px-4 py-2 bg-custom-light-blue dark:bg-custom-dark-blue rounded-xl shadow-lg hover:shadow-xl transition-all text-custom-dark-blue dark:text-custom-light-gray w-full sm:w-auto"
          onClick={() => setShowForecast(!showForecast)}
        >
          {showForecast ? t("Ocultar pronóstico") : t("Mostrar pronóstico")}
        </button>
        <button
          className="px-4 py-2 bg-custom-light-blue dark:bg-custom-dark-blue rounded-xl shadow-lg hover:shadow-xl transition-all text-custom-dark-blue dark:text-custom-light-gray w-full sm:w-auto"
          onClick={() => setIsDateModalOpen(true)}
        >
          {getRangeDisplayText(currentRange)}
        </button>
      </div>

      <div className="bg-white dark:bg-custom-dark-blue p-6 rounded-xl shadow-lg">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
              type="number"
              domain={["dataMin", "dataMax"]}
              scale="time"
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
            <Tooltip content={renderTooltip} />
            <Legend
              verticalAlign="top"
              height={36}
              className="text-custom-dark-blue dark:text-custom-light-gray"
            />
            <Bar
              dataKey="consumption"
              fill={COLORS.consumption}
              yAxisId="power"
              name={t("Consumo")}
              barSize={20}
            />
            <Bar
              dataKey="solar"
              fill={COLORS.solar}
              yAxisId="power"
              name={t("Solar")}
              barSize={20}
            />
            {showForecast && (
              <>
                <Bar
                  dataKey="solarPredicted"
                  fill={COLORS.solarPredicted}
                  fillOpacity={0.5}
                  yAxisId="power"
                  name={t("Solar previsto")}
                  barSize={20}
                  pattern={[{ id: "pattern1", type: "line" }]}
                />
                <Bar
                  dataKey="consumptionPredicted"
                  fill={COLORS.consumptionPredicted}
                  fillOpacity={0.5}
                  yAxisId="power"
                  name={t("Consumo previsto")}
                  barSize={20}
                  pattern={[{ id: "pattern2", type: "line" }]}
                />
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
            value={totals.consumption.toFixed(1)}
            icon={null}
          />
          <MetricCard
            title={t("Entrada CA activa")}
            value={totals.solar.toFixed(1)}
            icon={null}
          />
          <MetricCard
            title={t("Generador")}
            value={totals.battery.toFixed(1)}
            icon={null}
          />
          <MetricCard
            title={t("Consumo")}
            value={totals.consumption.toFixed(1)}
            predictedValue={(totals.consumption * 1.1).toFixed(1)}
            icon={null}
          />
          <MetricCard
            title={t("Solar")}
            value={totals.solar.toFixed(1)}
            predictedValue={(totals.solar * 1.2).toFixed(1)}
            icon={null}
          />
        </div>
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
