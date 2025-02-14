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
import { FaSolarPanel } from "react-icons/fa";
import { BiBattery } from "react-icons/bi";
import { MdOutlineGrid4X4 } from "react-icons/md";
import { GiSolarPower } from "react-icons/gi";
import VictronGraphSkeleton from "@/components/loadingSkeletons/VictronGraphSkeleton";
import NoDataErrorState from "../../NoDataErrorState";
import MetricCard from "../MetricCard";
import useCSVExport from "@/hooks/useCSVExport";
import {
  getDateRangeParams,
  calculateDateRange,
  formatAxisDate,
} from "@/utils/date-range-utils";
import SolarTooltip from "../tooltips/SolarTooltip";
import { roundToOneDecimal, roundToWhole } from "@/utils/roundNumbers";
import { UtilityPole } from "lucide-react";

const getColors = (theme) => ({
  toBattery: theme === "dark" ? "#FFD57B" : "#FFD57B",
  directUse: theme === "dark" ? "#BDBFC0" : "#BDBFC0",
  toGrid: theme === "dark" ? "#A48D67" : "#AD936A",
});

const SolarGraph = ({ plantId, currentRange, setIsDateModalOpen }) => {
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

    const csvData = data.map(({ timestamp, toBattery, directUse, toGrid }) => ({
      "Fecha y Hora": new Date(timestamp * 1000).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      "Energía a Batería (kWh)": toBattery?.toFixed(2) || "0.00",
      "Uso Directo (kWh)": directUse?.toFixed(2) || "0.00",
      "Energía a Red (kWh)": toGrid?.toFixed(2) || "0.00",
      "Total (kWh)": (
        (toBattery || 0) +
        (directUse || 0) +
        (toGrid || 0)
      ).toFixed(2),
    }));

    const filename = `produccion_solar_${currentRange.type}_${
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
            type: "solar_yield",
            start: dateRange.start,
            end: dateRange.end,
            token: user.tokenIdentificador,
          })
        ).unwrap(),
        dispatch(
          fetchVictronOverallStats({
            id: plantId,
            type: "solar_yield",
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

    const { records } = data;
    let recordsData = records;

    if (Array.isArray(records)) {
      recordsData = {
        Pb:
          records
            .filter((r) => r.type === "Pb")
            ?.map((r) => [r.timestamp, r.value]) || [],
        Pc:
          records
            .filter((r) => r.type === "Pc")
            ?.map((r) => [r.timestamp, r.value]) || [],
        Pg:
          records
            .filter((r) => r.type === "Pg")
            ?.map((r) => [r.timestamp, r.value]) || [],
      };
    }

    const dataMap = new Map();

    const processDataPoints = (dataArray, key) => {
      if (Array.isArray(dataArray)) {
        dataArray.forEach(([timestamp, value]) => {
          const existing = dataMap.get(timestamp) || {
            timestamp,
            toBattery: 0,
            directUse: 0,
            toGrid: 0,
          };
          existing[key] = value || 0;
          dataMap.set(timestamp, existing);
        });
      }
    };

    processDataPoints(recordsData.Pb, "toBattery");
    processDataPoints(recordsData.Pc, "directUse");
    processDataPoints(recordsData.Pg, "toGrid");

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
        name: t("A la batería"),
        value: totals.Pb || 0,
        percentage: percentages.Pb || 0,
        color: COLORS.toBattery,
      },
      {
        name: t("Uso directo"),
        value: totals.Pc || 0,
        percentage: percentages.Pc || 0,
        color: COLORS.directUse,
      },
      {
        name: t("A la red"),
        value: totals.Pg || 0,
        percentage: percentages.Pg || 0,
        color: COLORS.toGrid,
      },
    ];

    const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);

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
                className="flex items-center justify-between gap-2 text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span
                    className="text-gray-600 dark:text-gray-300 truncate max-w-[150px] md:max-w-[150px] lg:max-w-[200px] whitespace-nowrap overflow-hidden"
                    title={entry.name}
                  >
                    {entry.name}
                  </span>
                </div>
                <span
                  className="font-medium text-right"
                  style={{ color: entry.color }}
                >
                  {roundToOneDecimal(entry.value)} kWh (
                  {roundToWhole(entry.percentage)}
                  %)
                </span>
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
              <Tooltip content={<SolarTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="toBattery"
                stackId="solar"
                fill={COLORS.toBattery}
                name={t("A la batería")}
                barSize={60}
              />
              <Bar
                dataKey="directUse"
                stackId="solar"
                fill={COLORS.directUse}
                name={t("Uso directo")}
                barSize={60}
              />
              <Bar
                dataKey="toGrid"
                stackId="solar"
                fill={COLORS.toGrid}
                name={t("A la red")}
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
        {graphData?.totals?.Pb > 0 && (
          <MetricCard
            title={t("A la batería")}
            value={(graphData.totals.Pb || 0).toFixed(1)}
            icon={
              <BiBattery className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
        {graphData?.totals?.Pc > 0 && (
          <MetricCard
            title={t("Uso directo")}
            value={(graphData.totals.Pc || 0).toFixed(1)}
            icon={
              <GiSolarPower className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
        {graphData?.totals?.Pg > 0 && (
          <MetricCard
            title={t("A la red")}
            value={(graphData.totals.Pg || 0).toFixed(1)}
            icon={
              <UtilityPole className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
        {(graphData?.totals?.Pb > 0 ||
          graphData?.totals?.Pc > 0 ||
          graphData?.totals?.Pg > 0) && (
          <MetricCard
            title={t("Solar total")}
            value={(
              (graphData?.totals?.Pb || 0) +
              (graphData?.totals?.Pc || 0) +
              (graphData?.totals?.Pg || 0)
            ).toFixed(1)}
            icon={
              <FaSolarPanel className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
            }
          />
        )}
      </div>
    </div>
  );
};

export default SolarGraph;
