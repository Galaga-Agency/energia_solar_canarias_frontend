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
import { BiBattery } from "react-icons/bi";
import { GiSolarPower } from "react-icons/gi";
import VictronGraphSkeleton from "@/components/loadingSkeletons/VictronGraphSkeleton";
import MetricCard from "../MetricCard";
import NoDataDisplay from "../NoDataDisplay";
import useCSVExport from "@/hooks/useCSVExport";
import {
  getDateRangeParams,
  calculateDateRange,
  formatAxisDate,
} from "@/utils/date-range-utils";
import GeneratorTooltip from "../tooltips/GeneratorTooltip";
import NoDataErrorState from "@/components/NoDataErrorState";
import { roundToOneDecimal, roundToWhole } from "@/utils/numbers";

const getColors = (theme) => ({
  toBattery: theme === "dark" ? "#FFD57B" : "#FFD57B",
  directUse: theme === "dark" ? "#BDBFC0" : "#BDBFC0",
});

const GeneratorGraph = ({ plantId, currentRange, setIsDateModalOpen }) => {
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
      console.warn("No hay datos disponibles para exportar.");
      return;
    }

    const csvData = data.map(({ timestamp, toBattery, directUse }) => ({
      "Fecha y Hora": new Date(timestamp * 1000).toLocaleString("es-ES"),
      "Energía a la batería (kWh)": `${toBattery.toFixed(2)} kWh`,
      "Uso directo (kWh)": `${directUse.toFixed(2)} kWh`,
    }));

    const filename = `generador_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.csv`;
    downloadCSV(csvData, filename);
  };

  const fetchData = async () => {
    if (!plantId || !user?.tokenIdentificador) {
      return;
    }

    try {
      setIsInitialLoad(true);
      const { interval } = getDateRangeParams(currentRange.type);
      const dateRange = calculateDateRange(currentRange);

      await Promise.all([
        dispatch(
          fetchVictronEnergyGraphData({
            id: plantId,
            interval,
            type: "generator",
            start: dateRange.start,
            end: dateRange.end,
            token: user.tokenIdentificador,
          })
        ).unwrap(),
        dispatch(
          fetchVictronOverallStats({
            id: plantId,
            type: "generator",
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
    if (!data?.records) {
      return [];
    }

    const { records } = data;
    const { gb, gc } = records;

    const dataMap = new Map();

    // Process battery generation data
    if (Array.isArray(gb)) {
      gb.forEach(([timestamp, value]) => {
        dataMap.set(timestamp, {
          timestamp,
          toBattery: value || 0,
          directUse: dataMap.get(timestamp)?.directUse || 0,
        });
      });
    }

    // Process direct use generation data
    if (Array.isArray(gc)) {
      gc.forEach(([timestamp, value]) => {
        const existing = dataMap.get(timestamp) || { timestamp, toBattery: 0 };
        existing.directUse = value || 0;
        dataMap.set(timestamp, existing);
      });
    }

    return Array.from(dataMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }, []);

  const chartData = useMemo(() => {
    return transformData(graphData);
  }, [graphData, transformData]);

  const renderPieChart = (period, title) => {
    const data = statsData?.records?.[period];
    const hasData = !!data && (data.totals?.gb > 0 || data.totals?.gc > 0);

    const pieData = hasData
      ? [
          {
            name: t("A la batería"),
            value: data.totals.gb || 0,
            percentage: data.percentages.gb || 0,
            color: COLORS.toBattery,
          },
          {
            name: t("Uso directo"),
            value: data.totals.gc || 0,
            percentage: data.percentages.gc || 0,
            color: COLORS.directUse,
          },
        ]
      : [
          {
            name: t("A la batería"),
            value: 1,
            percentage: 0,
            color: theme === "dark" ? "#4B5563" : "#E5E7EB", // gray-600 : gray-200
          },
          {
            name: t("Uso directo"),
            value: 1,
            percentage: 0,
            color: theme === "dark" ? "#374151" : "#D1D5DB", // gray-700 : gray-300
          },
        ];

    const totalValue = hasData
      ? pieData.reduce((sum, item) => sum + item.value, 0)
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
                    {totalValue.toFixed(1)} kWh
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
                className="flex items-center justify-between gap-2 text-sm"
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
                  <span
                    className="font-medium text-right"
                    style={{ color: entry.color }}
                  >
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
                domain={[
                  (dataMin) => dataMin - 24 * 60 * 60 * 1000,
                  (dataMax) => dataMax + 24 * 60 * 60 * 1000,
                ]}
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
              <Tooltip content={<GeneratorTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="toBattery"
                stackId="generator"
                fill={COLORS.toBattery}
                name={t("A la batería")}
                barSize={60}
              />
              <Bar
                dataKey="directUse"
                stackId="generator"
                fill={COLORS.directUse}
                name={t("Uso directo")}
                barSize={60}
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
        {graphData?.totals?.gb > 0 && (
          <MetricCard
            title={t("A la batería")}
            value={(graphData.totals.gb || 0).toFixed(1)}
            icon={
              <BiBattery className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
        {graphData?.totals?.gc > 0 && (
          <MetricCard
            title={t("Uso directo")}
            value={(graphData.totals.gc || 0).toFixed(1)}
            icon={
              <GiSolarPower className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
        {(graphData?.totals?.gb > 0 || graphData?.totals?.gc > 0) && (
          <MetricCard
            title={t("Total")}
            value={(
              (graphData?.totals?.gb || 0) + (graphData?.totals?.gc || 0)
            ).toFixed(1)}
            icon={
              <GiSolarPower className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
      </div>
    </div>
  );
};

export default GeneratorGraph;
