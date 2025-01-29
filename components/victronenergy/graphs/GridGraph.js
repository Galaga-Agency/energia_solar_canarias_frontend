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
  PieChart,
  Pie,
  Cell,
  Line,
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
import { selectTheme } from "@/store/slices/themeSlice";
import VictronGraphSkeleton from "@/components/loadingSkeletons/VictronGraphSkeleton";
import { format } from "date-fns";
import { BiDotsVerticalRounded } from "react-icons/bi";
import CustomTooltip from "../CustomTooltip";
import NoDataDisplay from "../NoDataDisplay";

const getColors = (theme) => ({
  import: theme === "dark" ? "#4B5563" : "#6B7280",
  export: theme === "dark" ? "#FFD57B" : "#FFD57B",
  balance: theme === "dark" ? "#AD936A" : "#BDBFC0",
});

const GridGraph = ({
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
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const error = useSelector(selectGraphError);
  const user = useSelector(selectUser);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    handleFetch: fetchGraphData,
    isLoading: retryLoading,
    hasEmptyData,
  } = useDataFetchWithRetry({
    fetchAction: fetchVictronEnergyGraphData,
    clearAction: clearGraphData,
    data: graphData,
    validateData: (data) => Boolean(data?.records),
    maxRetries: 3,
    retryDelay: 1000,
    token: user?.tokenIdentificador,
  });

  const transformData = useCallback((data) => {
    if (!data?.records) return [];
    const records = data.records;

    const processRecord = (timestamp, gridFrom = 0, gridTo = 0) => ({
      timestamp,
      import: gridTo,
      export: gridFrom,
      balance: gridFrom - gridTo,
    });

    // If grid history is available, use it
    if (records.grid_history_from || records.grid_history_to) {
      const gridEntries = new Set([
        ...(records.grid_history_from || []).map((entry) => entry[0]),
        ...(records.grid_history_to || []).map((entry) => entry[0]),
      ]);

      return Array.from(gridEntries)
        .map((timestamp) => {
          const fromEntry = (records.grid_history_from || []).find(
            (entry) => entry[0] === timestamp
          );
          const toEntry = (records.grid_history_to || []).find(
            (entry) => entry[0] === timestamp
          );
          return processRecord(
            timestamp,
            fromEntry ? fromEntry[1] : 0,
            toEntry ? toEntry[1] : 0
          );
        })
        .sort((a, b) => a.timestamp - b.timestamp);
    }

    // If no grid history, calculate from consumption and generation
    const consumption = records.total_consumption || [];
    const solarYield = records.total_solar_yield || [];
    const genset = records.total_genset || [];

    const allTimestamps = new Set([
      ...consumption.map((entry) => entry[0]),
      ...solarYield.map((entry) => entry[0]),
      ...genset.map((entry) => entry[0]),
    ]);

    return Array.from(allTimestamps)
      .map((timestamp) => {
        const consumptionValue =
          consumption.find((entry) => entry[0] === timestamp)?.[1] || 0;
        const solarValue =
          solarYield.find((entry) => entry[0] === timestamp)?.[1] || 0;
        const gensetValue =
          genset.find((entry) => entry[0] === timestamp)?.[1] || 0;

        // Calculate grid interaction based on energy balance
        const totalGeneration = solarValue + gensetValue;
        const gridInteraction = consumptionValue - totalGeneration;

        return processRecord(
          timestamp,
          Math.max(0, -gridInteraction), // Export (when generation exceeds consumption)
          Math.max(0, gridInteraction) // Import (when consumption exceeds generation)
        );
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  }, []);

  const chartData = useMemo(() => {
    if (!graphData?.records) return [];
    return transformData(graphData);
  }, [graphData, transformData]);

  const metrics = useMemo(() => {
    if (!chartData.length)
      return {
        totalImport: 0,
        totalExport: 0,
        netBalance: 0,
        peakImport: 0,
        peakExport: 0,
        periods: {
          day: { import: 0, export: 0 },
          week: { import: 0, export: 0 },
          month: { import: 0, export: 0 },
          year: { import: 0, export: 0 },
        },
      };

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const calculatePeriodMetrics = (data) => ({
      import: data.reduce((sum, item) => sum + item.import, 0),
      export: data.reduce((sum, item) => sum + item.export, 0),
    });

    const totalImport = chartData.reduce((sum, item) => sum + item.import, 0);
    const totalExport = chartData.reduce((sum, item) => sum + item.export, 0);
    const peakImport = Math.max(...chartData.map((item) => item.import));
    const peakExport = Math.max(...chartData.map((item) => item.export));

    return {
      totalImport,
      totalExport,
      netBalance: totalExport - totalImport,
      peakImport,
      peakExport,
      periods: {
        day: calculatePeriodMetrics(
          chartData.filter((item) => now - item.timestamp < day)
        ),
        week: calculatePeriodMetrics(
          chartData.filter((item) => now - item.timestamp < 7 * day)
        ),
        month: calculatePeriodMetrics(
          chartData.filter((item) => now - item.timestamp < 30 * day)
        ),
        year: calculatePeriodMetrics(
          chartData.filter((item) => now - item.timestamp < 365 * day)
        ),
      },
    };
  }, [chartData]);

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
        setIsInitialLoad(false);
      });

    return () => dispatch(clearGraphData());
  }, [plantId, currentRange, fetchGraphData, dispatch]);

  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "MMM dd");
  };

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

  const renderMetricCard = (title, value, unit = "kWh") => (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h4 className="text-sm text-gray-500 dark:text-gray-400">{title}</h4>
      <p className="text-2xl font-semibold text-custom-dark-blue dark:text-custom-light-gray">
        {value.toFixed(1)} {unit}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-4">
        <button
          className="select-none px-4 py-2 bg-custom-light-blue dark:bg-custom-dark-blue rounded-xl shadow-lg hover:shadow-xl transition-all text-custom-dark-blue dark:text-custom-light-gray"
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
            <div className="h-96 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    scale="time"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={formatXAxis}
                  />
                  <YAxis
                    label={{
                      value: "kWh",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="import"
                    fill={COLORS.import}
                    name={t("Importación de red")}
                    barSize={20}
                  />
                  <Bar
                    dataKey="export"
                    fill={COLORS.export}
                    name={t("Exportación a red")}
                    barSize={20}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke={COLORS.balance}
                    name={t("Balance neto")}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {renderMetricCard(
                t("Últimas 24h - Import"),
                metrics.periods.day.import
              )}
              {renderMetricCard(
                t("Últimas 24h - Export"),
                metrics.periods.day.export
              )}
              {renderMetricCard(
                t("Últimos 7 días - Import"),
                metrics.periods.week.import
              )}
              {renderMetricCard(
                t("Últimos 7 días - Export"),
                metrics.periods.week.export
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {renderMetricCard(t("Importación total"), metrics.totalImport)}
              {renderMetricCard(t("Exportación total"), metrics.totalExport)}
              {renderMetricCard(
                t("Balance neto"),
                Math.abs(metrics.netBalance),
                metrics.netBalance >= 0 ? "kWh Export" : "kWh Import"
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GridGraph;
