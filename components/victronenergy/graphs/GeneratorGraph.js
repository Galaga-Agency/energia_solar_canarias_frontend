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
} from "recharts";
import {
  fetchVictronEnergyGraphData,
  selectGraphData,
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

const getColors = (theme) => ({
  toBattery: theme === "dark" ? "#FFD57B" : "#FFD57B",
  directUse: theme === "dark" ? "#AD936A" : "#BDBFC0",
});

const GeneratorGraph = ({ plantId, currentRange, setIsDateModalOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const COLORS = getColors(theme);
  const { downloadCSV } = useCSVExport();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const error = useSelector(selectGraphError);
  const user = useSelector(selectUser);

  const handleExportClick = (data) => {
    if (!data || !data.length) {
      console.warn("No data available for export");
      return;
    }

    const csvData = data.map(({ timestamp, toBattery, directUse }) => ({
      timestamp: new Date(timestamp).toISOString(),
      "A la batería (kWh)": toBattery.toFixed(2),
      "Uso directo (kWh)": directUse.toFixed(2),
    }));

    const filename = `generator_${new Date().toISOString()}.csv`;
    downloadCSV(csvData, filename);
  };

  useEffect(() => {
    let isMounted = true;
    dispatch(clearGraphData());

    const fetchData = async () => {
      if (!plantId || !user?.tokenIdentificador) {
        return;
      }

      try {
        setIsInitialLoad(true);
        const { interval } = getDateRangeParams(currentRange.type);
        const dateRange = calculateDateRange(currentRange);

        await dispatch(
          fetchVictronEnergyGraphData({
            id: plantId,
            interval,
            type: "generator",
            start: dateRange.start,
            end: dateRange.end,
            token: user.tokenIdentificador,
          })
        ).unwrap();
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        if (isMounted) {
          setIsInitialLoad(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
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

  if (isInitialLoad || isLoading) {
    return <VictronGraphSkeleton theme={theme} />;
  }

  const hasValidData = chartData.length > 0;

  if (!hasValidData || error) {
    return <NoDataDisplay onSelectRange={() => setIsDateModalOpen(true)} />;
  }

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={() => handleExportClick(chartData)}
          className="absolute right-0 top-0 w-10 h-10 p-2 bg-white hover:bg-white/50 transition-all duration-300 dark:bg-custom-dark-blue hover:dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow"
        >
          <CiExport className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
        </button>
      </div>

      {/* Main Chart */}
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
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="toBattery"
                stackId="generator"
                fill={COLORS.toBattery}
                name={t("A la batería")}
              />
              <Bar
                dataKey="directUse"
                stackId="generator"
                fill={COLORS.directUse}
                name={t("Uso directo")}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics */}
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
