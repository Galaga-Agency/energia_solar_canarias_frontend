import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { BiBattery } from "react-icons/bi";
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
import MetricCard from "../MetricCard";
import NoDataErrorState from "../../NoDataErrorState";
import useCSVExport from "@/hooks/useCSVExport";
import {
  getDateRangeParams,
  calculateDateRange,
  formatAxisDate,
} from "@/utils/date-range-utils";
import ConsumptionTooltip from "../tooltips/ConsumptionTooltip";
import VictronEnergyGraphSkeleton from "@/components/loadingSkeletons/VictronGraphSkeleton";
import { FaSolarPanel } from "react-icons/fa";
import { MdOutlineGrid4X4 } from "react-icons/md";
import { GiPieChart, GiPowerGenerator } from "react-icons/gi";

const getColors = (theme) => ({
  batteria: theme === "dark" ? "#BDBFC0" : "#BDBFC0",
  sistemaFV: theme === "dark" ? "#FFD57B" : "rgb(255, 213, 122)",
  red: theme === "dark" ? "#A48D67" : "#AD936A",
  genset: theme === "dark" ? "#BDBFC080" : "#0B2738",
});

const ConsumptionGraph = ({ plantId, currentRange, setIsDateModalOpen }) => {
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

  const handleExportClick = () => {
    if (!chartData.length) {
      console.warn("No data available for export.");
      return;
    }

    const csvData = chartData.map(
      ({ timestamp, fromBattery, fromPV, fromGrid, fromGenset }) => ({
        timestamp: new Date(timestamp * 1000).toISOString(),
        "Desde la batería (kWh)": fromBattery.toFixed(2),
        "Desde el sistema FV (kWh)": fromPV.toFixed(2),
        "Desde la red (kWh)": fromGrid.toFixed(2),
        "Desde el grupo electrógeno (kWh)": fromGenset.toFixed(2),
      })
    );

    const filename = `consumption_${new Date().toISOString()}.csv`;
    downloadCSV(csvData, filename);
  };

  const fetchDataForRange = async () => {
    try {
      const { interval } = getDateRangeParams(currentRange.type);
      const dateRange = calculateDateRange(currentRange);

      await dispatch(
        fetchVictronEnergyGraphData({
          id: plantId,
          interval,
          type: "consumption",
          start: dateRange.start,
          end: dateRange.end,
          token: user?.tokenIdentificador,
        })
      ).unwrap();

      await dispatch(
        fetchVictronOverallStats({
          id: plantId,
          type: "consumption",
          token: user?.tokenIdentificador,
        })
      ).unwrap();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      setIsInitialLoad(true);
      await fetchDataForRange();
      setIsInitialLoad(false);
    };

    if (plantId && user?.tokenIdentificador) {
      initFetch();
    }

    return () => dispatch(clearGraphData());
  }, [dispatch, plantId, currentRange, user?.tokenIdentificador]);

  const transformData = useCallback((data) => {
    if (!data?.records) return [];

    const { Bc = [], Pc = [], Gc = [], gc = [] } = data.records;
    const dataMap = new Map();

    const processDataPoint = (dataArray, key) => {
      if (Array.isArray(dataArray)) {
        dataArray.forEach(([timestamp, value]) => {
          const existing = dataMap.get(timestamp) || {
            timestamp,
            fromBattery: 0,
            fromPV: 0,
            fromGrid: 0,
            fromGenset: 0,
          };
          existing[key] = value || 0;
          dataMap.set(timestamp, existing);
        });
      }
    };

    processDataPoint(Bc, "fromBattery");
    processDataPoint(Pc, "fromPV");
    processDataPoint(Gc, "fromGrid");
    processDataPoint(gc, "fromGenset");

    return Array.from(dataMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }, []);

  const chartData = useMemo(() => {
    return transformData(graphData);
  }, [graphData, transformData]);

  const renderPieChart = (period, title) => {
    if (!statsData?.records?.[period]) return null;

    const data = statsData.records[period];
    const { totals, percentages } = data;

    const pieData = [
      {
        name: t("Desde la batería"),
        value: totals.Bc || 0,
        percentage: percentages.Bc || 0,
        color: COLORS.batteria,
      },
      {
        name: t("Desde el sistema FV"),
        value: totals.Pc || 0,
        percentage: percentages.Pc || 0,
        color: COLORS.sistemaFV,
      },
      {
        name: t("Desde la red"),
        value: totals.Gc || 0,
        percentage: percentages.Gc || 0,
        color: COLORS.red,
      },
      {
        name: t("Desde el grupo electrógeno"),
        value: totals.gc || 0,
        percentage: percentages.gc || 0,
        color: COLORS.genset,
      },
    ];

    // Calculate the total sum of all sources
    const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);

    // Only render if there is meaningful data (totalValue > 0)
    if (totalValue <= 0) return null;

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
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total
              </span>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {totalValue.toFixed(1)} kWh
              </span>
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
                    className="text-gray-600 dark:text-gray-300 truncate max-w-[150px] md:max-w-[150px] lg:max-w-[200px] whitespace-nowrap overflow-hidden"
                    title={entry.name} // Show full text on hover
                  >
                    {entry.name}
                  </span>
                </div>

                <span className="font-medium" style={{ color: entry.color }}>
                  {entry.value.toFixed(1)} kWh ({entry.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading || isInitialLoad) {
    return <VictronEnergyGraphSkeleton theme={theme} />;
  }

  if (error) {
    return (
      <NoDataErrorState
        isError={true}
        onRetry={() => {
          dispatch(clearGraphData());
          fetchDataForRange();
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
          fetchDataForRange();
        }}
        onSelectRange={() => setIsDateModalOpen(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleExportClick}
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
              <Tooltip content={<ConsumptionTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="fromBattery"
                stackId="consumption"
                fill={COLORS.batteria}
                name={t("Desde la batería")}
                barSize={60}
              />
              <Bar
                dataKey="fromPV"
                stackId="consumption"
                fill={COLORS.sistemaFV}
                name={t("Desde el sistema FV")}
                barSize={60}
              />
              <Bar
                dataKey="fromGrid"
                stackId="consumption"
                fill={COLORS.red}
                name={t("Desde la red")}
                barSize={60}
              />
              <Bar
                dataKey="fromGenset"
                stackId="consumption"
                fill={COLORS.genset}
                name={t("Desde el grupo electrógeno")}
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

      <div className="flex flex-col md:flex-row w-full flex-wrap gap-4">
        {graphData?.totals?.Bc && (
          <MetricCard
            title={t("Desde la batería")}
            value={(graphData?.totals?.Bc || 0).toFixed(1)}
            icon={
              <BiBattery className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
        {graphData?.totals?.Pc && (
          <MetricCard
            title={t("Desde el sistema FV")}
            value={(graphData?.totals?.Pc || 0).toFixed(1)}
            icon={
              <FaSolarPanel className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
        {graphData?.totals?.Gc && (
          <MetricCard
            title={t("Desde la red")}
            value={(graphData?.totals?.Gc || 0).toFixed(1)}
            icon={
              <MdOutlineGrid4X4 className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
        {graphData?.totals?.gc && (
          <MetricCard
            title={t("Desde el grupo electrógeno")}
            value={(graphData?.totals?.gc || 0).toFixed(1)}
            icon={
              <GiPowerGenerator className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
        <MetricCard
          title={t("Consumo total")}
          value={(
            (graphData?.totals?.Bc || 0) +
            (graphData?.totals?.Pc || 0) +
            (graphData?.totals?.Gc || 0) +
            (graphData?.totals?.gc || 0)
          ).toFixed(1)}
          icon={
            <GiPieChart className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
          }
        />
      </div>
    </div>
  );
};

export default ConsumptionGraph;
