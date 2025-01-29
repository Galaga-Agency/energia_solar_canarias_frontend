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
import { FaSolarPanel } from "react-icons/fa";
import { BiBattery } from "react-icons/bi";
import { MdOutlineGrid4X4 } from "react-icons/md";
import { GiSolarPower } from "react-icons/gi";
import VictronGraphSkeleton from "@/components/loadingSkeletons/VictronGraphSkeleton";
import NoDataErrorState from "../NoDataErrorState";
import MetricCard from "../MetricCard";
import useCSVExport from "@/hooks/useCSVExport";
import {
  getDateRangeParams,
  calculateDateRange,
  formatAxisDate,
} from "@/utils/date-range-utils";
import SolarTooltip from "../tooltips/SolarTooltip";

const getColors = (theme) => ({
  toBattery: theme === "dark" ? "#FFD57B" : "#FFD57B",
  directUse: theme === "dark" ? "#AD936A" : "#BDBFC0",
  toGrid: theme === "dark" ? "#A48D67" : "#AD936A",
});

const SolarGraph = ({ plantId, currentRange, setIsDateModalOpen }) => {
  console.log("SolarGraph Render", { plantId, currentRange });

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

  console.log("Current Redux State:", { graphData, isLoading, error });

  const handleExportClick = (data) => {
    if (!data || !data.length) {
      console.warn("No data available for export");
      return;
    }

    const csvData = data.map(({ timestamp, toBattery, directUse, toGrid }) => ({
      timestamp: new Date(timestamp).toISOString(),
      "A la batería (kWh)": toBattery.toFixed(2),
      "Uso directo (kWh)": directUse.toFixed(2),
      "A la red (kWh)": toGrid.toFixed(2),
    }));

    const filename = `solar_${new Date().toISOString()}.csv`;
    downloadCSV(csvData, filename);
  };

  const fetchData = async () => {
    if (!plantId || !user?.tokenIdentificador) {
      console.log("Missing required data:", {
        hasPlantId: !!plantId,
        hasToken: !!user?.tokenIdentificador,
      });
      return;
    }

    try {
      setIsInitialLoad(true);
      console.log("Starting fetch...");

      const { interval } = getDateRangeParams(currentRange.type);
      const dateRange = calculateDateRange(currentRange);

      const now = new Date();
      console.log("Fetch parameters:", {
        plantId,
        interval,
        type: "solar_yield",
        start: new Date(dateRange.start * 1000).toISOString(),
        end: new Date(dateRange.end * 1000).toISOString(),
        currentTime: now.toISOString(),
      });

      const result = await dispatch(
        fetchVictronEnergyGraphData({
          id: plantId,
          interval,
          type: "solar_yield",
          start: dateRange.start,
          end: dateRange.end,
          token: user.tokenIdentificador,
        })
      ).unwrap();

      console.log("API Response:", result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    console.log("Effect triggered with:", { plantId, currentRange });

    let isMounted = true;

    // Force clear any existing data
    dispatch(clearGraphData());
    console.log("Previous data cleared");

    fetchData();

    return () => {
      isMounted = false;
      dispatch(clearGraphData());
    };
  }, [dispatch, plantId, currentRange, user?.tokenIdentificador]);

  const transformData = useCallback((data) => {
    console.log("Starting data transformation:", data);

    if (!data?.records) {
      console.log("No records found in data");
      return [];
    }

    const { records } = data;
    console.log("Records:", records);

    // Handle both array and object structures
    let recordsData = records;
    if (Array.isArray(records)) {
      console.log("Converting array records to object structure");
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

    // Process each data type
    const processDataPoints = (dataArray, key) => {
      console.log(`Processing ${key} data:`, dataArray);
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

    const result = Array.from(dataMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );

    console.log("Transformation result:", {
      points: result.length,
      first: result[0],
      last: result[result.length - 1],
    });

    return result;
  }, []);

  const chartData = useMemo(() => {
    console.log("Computing chart data from:", graphData);
    return transformData(graphData);
  }, [graphData, transformData]);

  console.log("Render state:", {
    isInitialLoad,
    isLoading,
    hasError: !!error,
    dataPoints: chartData.length,
  });

  if (isLoading || isInitialLoad) {
    return <VictronGraphSkeleton theme={theme} />;
  }

  // Handle error state
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

  // Handle no data state separately
  const hasValidData = chartData.length > 0;
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
              />
              <Bar
                dataKey="directUse"
                stackId="solar"
                fill={COLORS.directUse}
                name={t("Uso directo")}
              />
              <Bar
                dataKey="toGrid"
                stackId="solar"
                fill={COLORS.toGrid}
                name={t("A la red")}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics */}
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
              <MdOutlineGrid4X4 className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow" />
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
