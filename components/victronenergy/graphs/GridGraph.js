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
  fetchVictronOverallStats,
  selectGraphData,
  selectStatsData,
  selectGraphLoading,
  selectGraphError,
  clearGraphData,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import { CiExport } from "react-icons/ci";
import { BiDotsVerticalRounded } from "react-icons/bi";
import VictronGraphSkeleton from "@/components/loadingSkeletons/VictronGraphSkeleton";
import NoDataErrorState from "../../NoDataErrorState";
import MetricCard from "../MetricCard";
import useCSVExport from "@/hooks/useCSVExport";
import {
  getDateRangeParams,
  calculateDateRange,
  formatAxisDate,
} from "@/utils/date-range-utils";
import GridTooltip from "../tooltips/GridTooltip";
import { roundToOneDecimal, roundToWhole } from "@/utils/roundNumbers";

const getColors = (theme) => ({
  import: theme === "dark" ? "#FFD57B" : "#FFD57B",
  export: theme === "dark" ? "#BDBFC0" : "#BDBFC0",
  balance:
    theme === "dark" ? "rgba(173, 147, 106, 1)" : "rgba(101, 120, 128, 0.9)",
});

const GridGraph = ({
  plantId,
  currentRange,
  setIsDateModalOpen,
  onExportClick,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const COLORS = getColors(theme);
  const { downloadCSV } = useCSVExport();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const graphData = useSelector(selectGraphData);
  const statsData = useSelector(selectStatsData);
  const isLoading = useSelector(selectGraphLoading);
  const error = useSelector(selectGraphError);
  const user = useSelector(selectUser);

  const handleExportClick = (data) => {
    if (!data || !data.length) {
      console.warn("No data available for export");
      return;
    }

    const csvData = data.map(
      ({ timestamp, import: importValue, export: exportValue, balance }) => ({
        "Fecha y Hora": new Date(timestamp * 1000).toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        "Importación (kWh)": importValue?.toFixed(2) || "0.00",
        "Exportación (kWh)": exportValue?.toFixed(2) || "0.00",
        "Balance Neto (kWh)": balance?.toFixed(2) || "0.00",
        "Flujo Dominante":
          balance > 0 ? "Exportación" : balance < 0 ? "Importación" : "Neutral",
      })
    );

    const filename = `red_electrica_${currentRange.type}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    downloadCSV(csvData, filename);
  };

  const fetchData = async () => {
    if (!plantId || !user?.tokenIdentificador) return;

    try {
      setIsInitialLoad(true);
      const { interval } = getDateRangeParams(currentRange.type);
      const dateRange = calculateDateRange(currentRange);

      await Promise.all([
        dispatch(
          fetchVictronEnergyGraphData({
            id: plantId,
            interval,
            type: "grid",
            start: dateRange.start,
            end: dateRange.end,
            token: user.tokenIdentificador,
          })
        ).unwrap(),
        dispatch(
          fetchVictronOverallStats({
            id: plantId,
            type: "grid",
            token: user.tokenIdentificador,
          })
        ).unwrap(),
      ]);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    dispatch(clearGraphData());
    fetchData();

    return () => {
      dispatch(clearGraphData());
    };
  }, [dispatch, plantId, currentRange, user?.tokenIdentificador]);

  const transformData = useCallback((data) => {
    if (!data?.records) return [];
    const records = data.records;

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
          const exportValue = fromEntry ? fromEntry[1] : 0;
          const importValue = toEntry ? toEntry[1] : 0;

          return {
            timestamp,
            import: importValue,
            export: exportValue,
            balance: exportValue - importValue,
          };
        })
        .sort((a, b) => a.timestamp - b.timestamp);
    }

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

        const totalGeneration = solarValue + gensetValue;
        const gridInteraction = consumptionValue - totalGeneration;

        return {
          timestamp,
          import: Math.max(0, gridInteraction),
          export: Math.max(0, -gridInteraction),
          balance: -gridInteraction,
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  }, []);

  const chartData = useMemo(() => {
    return transformData(graphData);
  }, [graphData, transformData]);

  const renderPieChart = (period, title) => {
    const data = statsData?.records?.[period];
    const hasData =
      data && (data.totals?.import > 0 || data.totals?.export > 0);

    const pieData = hasData
      ? [
          {
            name: t("Importación de red"),
            value: data.totals.import || 0,
            percentage: data.percentages.import || 0,
            color: COLORS.import,
          },
          {
            name: t("Exportación a red"),
            value: data.totals.export || 0,
            percentage: data.percentages.export || 0,
            color: COLORS.export,
          },
        ]
      : [
          {
            name: t("Importación de red"),
            value: 1,
            percentage: 0,
            color: theme === "dark" ? "#4B5563" : "#E5E7EB",
          },
          {
            name: t("Exportación a red"),
            value: 1,
            percentage: 0,
            color: theme === "dark" ? "#374151" : "#D1D5DB",
          },
        ];

    const totalValue = hasData
      ? (data.totals.import || 0) + (data.totals.export || 0)
      : 0;

    return (
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl shadow-lg hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors duration-300">
        <h3 className="text-center font-secondary font-medium text-gray-700 dark:text-gray-200 mb-2">
          {title}
        </h3>
        <div className="flex flex-col h-full">
          <div className="relative flex-1" style={{ minHeight: "200px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {hasData ? (
                <>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {roundToOneDecimal(totalValue)} kWh
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  {t("Sin datos")}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span
                    className={`truncate max-w-[150px] md:max-w-[150px] lg:max-w-[200px] whitespace-nowrap overflow-hidden ${
                      hasData
                        ? "text-gray-600 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                    title={entry.name}
                  >
                    {entry.name}
                  </span>
                </div>
                {hasData ? (
                  <span className="font-medium" style={{ color: entry.color }}>
                    {roundToOneDecimal(entry.value)} kWh (
                    {roundToWhole(entry.percentage)}
                    %)
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">
                    0 kWh (0%)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading || isInitialLoad) {
    return <VictronGraphSkeleton theme={theme} />;
  }

  if (error) {
    return (
      <NoDataErrorState
        isError={true}
        onRetry={() => {
          dispatch(clearGraphData());
          fetchData();
        }}
        onSelectRange={() => setIsDateModalOpen(true)}
      />
    );
  }

  const hasValidData = graphData && statsData && chartData.length > 0;
  if (!hasValidData) {
    return (
      <NoDataErrorState
        isError={false}
        onRetry={() => {
          dispatch(clearGraphData());
          fetchData();
        }}
        onSelectRange={() => setIsDateModalOpen(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => handleExportClick(chartData)}
          className="absolute right-0 top-0 w-10 h-10 p-2 bg-white hover:bg-white/50 transition-all duration-300 dark:bg-custom-dark-blue hover:dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow"
        >
          <CiExport className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-hidden">
        <div style={{ minWidth: "800px", height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatAxisDate}
                type="number"
                domain={["dataMin", "dataMax"]}
                scale="time"
                interval="preserveStartEnd"
                padding={{ left: 60, right: 60 }}
              />
              <YAxis
                label={{
                  value: "kWh",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<GridTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="import"
                stackId="grid"
                fill={COLORS.import}
                name={t("Importación de red")}
                barSize={60}
              />
              <Bar
                dataKey="export"
                stackId="grid"
                fill={COLORS.export}
                name={t("Exportación a red")}
                barSize={60}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
        {renderPieChart("today", t("Últimas 24 h"))}
        {renderPieChart("week", t("Últimos 7 días"))}
        {renderPieChart("month", t("Últimos 30 días"))}
        {renderPieChart("year", t("Últimos 365 días"))}
      </div>

      <div className="flex w-full flex-wrap gap-4">
        {graphData?.totals?.grid_history_from > 0 && (
          <MetricCard
            title={t("Exportación a red")}
            value={(graphData.totals.grid_history_from || 0).toFixed(1)}
            icon={
              <BiDotsVerticalRounded className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
        {graphData?.totals?.grid_history_to > 0 && (
          <MetricCard
            title={t("Importación de red")}
            value={(graphData.totals.grid_history_to || 0).toFixed(1)}
            icon={
              <BiDotsVerticalRounded className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
        {(graphData?.totals?.grid_history_from > 0 ||
          graphData?.totals?.grid_history_to > 0) && (
          <MetricCard
            title={t("Balance neto")}
            value={Math.abs(
              (graphData?.totals?.grid_history_from || 0) -
                (graphData?.totals?.grid_history_to || 0)
            ).toFixed(1)}
            unit={
              (graphData?.totals?.grid_history_from || 0) >=
              (graphData?.totals?.grid_history_to || 0)
                ? "kWh Export"
                : "kWh Import"
            }
            icon={
              <BiDotsVerticalRounded className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
      </div>
    </div>
  );
};

export default GridGraph;
