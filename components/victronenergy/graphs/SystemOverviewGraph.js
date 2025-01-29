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
} from "recharts";
import {
  fetchVictronEnergyGraphData,
  selectGraphData,
  selectGraphLoading,
  selectGraphError,
  clearGraphData,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import useDeviceType from "@/hooks/useDeviceType";
import { selectTheme } from "@/store/slices/themeSlice";
import VictronGraphSkeleton from "@/components/loadingSkeletons/VictronGraphSkeleton";
import {
  getDateRangeParams,
  calculateDateRange,
  formatAxisDate,
} from "@/utils/date-range-utils";
import { CiExport } from "react-icons/ci";
import BatteryMetrics from "../BatteryMetrics";
import PowerMetrics from "../PowerMetrics";
import NoDataErrorState from "../NoDataErrorState";
import SystemOverviewTooltip from "../tooltips/SystemOverviewTooltip";
import useCSVExport from "@/hooks/useCSVExport";

const getColors = (theme) => ({
  consumption: theme === "dark" ? "#BDBFC080" : "#0B2738",
  solarProduction: theme === "dark" ? "#FFD57B" : "rgb(255, 213, 122)",
  export: theme === "dark" ? "#657880" : "#FFD57B",
  import: theme === "dark" ? "#9CA3AF" : "#BDBFC0",
  batteryAverage: theme === "dark" ? "#BDBFC0" : "#BDBFC070",
  batteryMin: theme === "dark" ? "#AD936A" : "#BDBFC0",
  batteryMax: theme === "dark" ? "#A48D67" : "#AD936A",
});

const SystemOverviewGraph = ({ plantId, currentRange, setIsDateModalOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const COLORS = getColors(theme);
  const { downloadCSV } = useCSVExport();

  const [showForecast, setShowForecast] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const error = useSelector(selectGraphError);
  const user = useSelector(selectUser);
  const { isMobile } = useDeviceType();

  const handleExportClick = () => {
    if (!chartData.length) {
      console.warn("No data available for export.");
      return;
    }

    const exportData = chartData.map((entry) => ({
      timestamp: new Date(entry.timestamp * 1000).toISOString(),
      consumption: entry.consumption || 0,
      solar: entry.solar || 0,
      battery: entry.battery || null,
      batteryStateMin: entry.batteryStateMin || null,
      batteryStateMax: entry.batteryStateMax || null,
      batteryVoltage: entry.batteryVoltage || null,
    }));

    const filename = `system_overview_${
      currentRange.type
    }_${new Date().toISOString()}.csv`;
    downloadCSV(exportData, filename);
  };

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

  const fetchForecastData = async () => {
    setIsForecastLoading(true);
    try {
      const { start, end } = calculateDateRange(currentRange, showForecast);
      const { interval, type } = getDateRangeParams(currentRange.type, {
        isMobile,
        showForecast,
      });

      const forecastParams = {
        id: plantId,
        interval,
        type: "forecast",
        start,
        end,
      };

      const response = await dispatch(
        fetchVictronEnergyGraphData(forecastParams)
      ).unwrap();
      setForecastData(response);
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

  const transformData = useCallback(
    (data, forecastData) => {
      if (!data?.records) {
        console.warn("No valid records in response:", data);
        return [];
      }

      const records = data.records;

      const totalConsumption = Array.isArray(records.total_consumption)
        ? records.total_consumption
        : [];
      const totalSolarYield = Array.isArray(records.total_solar_yield)
        ? records.total_solar_yield
        : [];
      const Pdc = Array.isArray(records.Pdc) ? records.Pdc : [];
      const bs = Array.isArray(records.bs) ? records.bs : [];
      const bv = Array.isArray(records.bv) ? records.bv : [];

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
        return [];
      }

      const allTimestamps = new Set([
        ...totalConsumption.map((entry) => entry[0]),
        ...totalSolarYield.map((entry) => entry[0]),
        ...Pdc.map((entry) => entry[0]),
        ...bs.map((entry) => entry[0]),
        ...bv.map((entry) => entry[0]),
      ]);

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

          const bsEntry = bs.find((entry) => entry[0] === timestamp);
          if (bsEntry) {
            dataPoint.battery = bsEntry[1] || null;
            dataPoint.batteryStateMin = bsEntry[2] || null;
            dataPoint.batteryStateMax = bsEntry[3] || null;
          }

          const bvEntry = bv.find((entry) => entry[0] === timestamp);
          if (bvEntry) {
            dataPoint.batteryVoltage = bvEntry[1] || 0;
            dataPoint.batteryMin = bvEntry[2] || 0;
            dataPoint.batteryMax = bvEntry[3] || 0;
          }

          return dataPoint;
        })
        .sort((a, b) => a.timestamp - b.timestamp);
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

    const totalConsumption =
      Array.isArray(records.total_consumption) &&
      records.total_consumption.length > 0
        ? records.total_consumption.reduce((sum, item) => {
            const value = Number(item[1]) || 0;
            return sum + value;
          }, 0)
        : 0;

    const totalSolar =
      Array.isArray(records.total_solar_yield) &&
      records.total_solar_yield.length > 0
        ? records.total_solar_yield.reduce((sum, item) => {
            const value = Number(item[1]) || 0;
            return sum + value;
          }, 0)
        : 0;

    const genset = records.total_genset;
    const gridHistoryTo = Number(records.grid_history_to) || 0;
    const gridHistoryFrom = Number(records.grid_history_from) || 0;

    const batteryUsage =
      Array.isArray(records.bs) && records.bs.length > 0
        ? records.bs.reduce((sum, item) => {
            const value = Number(item[1]) || 0;
            return sum + value;
          }, 0) / records.bs.length
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

    const fetchData = async () => {
      try {
        const { start, end } = calculateDateRange(currentRange, showForecast);
        const { interval, type } = getDateRangeParams(currentRange.type, {
          isMobile,
          showForecast,
        });

        await dispatch(
          fetchVictronEnergyGraphData({
            id: plantId,
            interval,
            type,
            start,
            end,
            token: user?.tokenIdentificador,
          })
        ).unwrap();
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    if (user?.tokenIdentificador) {
      fetchData();
    }

    return () => {
      dispatch(clearGraphData());
    };
  }, [
    plantId,
    currentRange,
    dispatch,
    showForecast,
    isMobile,
    user?.tokenIdentificador,
  ]);

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

  const handleRetry = async () => {
    const { start, end } = calculateDateRange(currentRange, showForecast);
    const { interval, type } = getDateRangeParams(currentRange.type, {
      isMobile,
      showForecast,
    });

    try {
      if (!user?.tokenIdentificador) {
        throw new Error("No authentication token available");
      }

      await dispatch(
        fetchVictronEnergyGraphData({
          id: plantId,
          interval,
          type,
          start,
          end,
          token: user.tokenIdentificador,
        })
      ).unwrap();
    } catch (error) {
      console.error("Retry error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto">
          {canShowForecast(currentRange.type) && (
            <button
              className="font-secondary appearance-none w-full sm:w-auto bg-white hover:bg-white/50 transition-all duration-300 dark:bg-custom-dark-blue hover:dark:bg-custom-dark-blue/50 px-4 py-2 pr-10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-custom-dark-blue dark:text-custom-light-gray cursor-pointer focus:outline-none focus:ring-2 focus:ring-custom-yellow"
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
          onClick={handleExportClick}
          className="absolute right-0 top-0 w-10 h-10 p-2 bg-white hover:bg-white/50 transition-all duration-300 dark:bg-custom-dark-blue hover:dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow"
        >
          <CiExport className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
        </button>
      </div>

      <div className="bg-white dark:bg-custom-dark-blue p-6 rounded-xl shadow-lg">
        {(isInitialLoad || isLoading) && <VictronGraphSkeleton theme={theme} />}

        {!isLoading && !isInitialLoad && error && (
          <NoDataErrorState
            isError={true}
            onRetry={handleRetry}
            onSelectRange={() => setIsDateModalOpen(true)}
          />
        )}

        {!isLoading && !isInitialLoad && !error && hasNoData && (
          <NoDataErrorState
            isError={false}
            onRetry={handleRetry}
            onSelectRange={() => setIsDateModalOpen(true)}
          />
        )}

        {!isLoading && !isInitialLoad && !error && !hasNoData && (
          <>
            <div className="overflow-x-auto overflow-y-hidden">
              <div style={{ minWidth: "600px", height: "400px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(timestamp) =>
                        formatAxisDate(timestamp, currentRange.type)
                      }
                      type="number"
                      domain={["dataMin", "dataMax"]}
                      scale="time"
                      interval="preserveStartEnd"
                      padding={{ left: 60, right: 60 }}
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
                    {hasConsumption && (
                      <Bar
                        dataKey="consumption"
                        fill={COLORS.consumption}
                        name={t("Consumo")}
                        barSize={60}
                        yAxisId="power"
                        unit="kWh"
                      />
                    )}
                    {hasSolar && (
                      <Bar
                        dataKey="solar"
                        fill={COLORS.solarProduction}
                        name={t("Solar")}
                        barSize={60}
                        yAxisId="power"
                        unit="kWh"
                      />
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
                    <Tooltip content={<SystemOverviewTooltip />} />
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
              </div>
            </div>

            <div className="space-y-6">
              {hasBatteryVoltage && <BatteryMetrics chartData={chartData} />}

              {totals &&
                (Number(totals.totalConsumption) > 0 ||
                  Number(totals.totalSolar) > 0 ||
                  (typeof totals.battery === "number" && totals.battery > 0) ||
                  totals.grid_history_from > 0 ||
                  totals.grid_history_to > 0) && (
                  <PowerMetrics graphData={graphData} totals={totals} />
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SystemOverviewGraph;
