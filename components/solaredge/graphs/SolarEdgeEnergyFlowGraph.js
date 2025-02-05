"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
} from "recharts";
import { BiDotsVerticalRounded, BiRefresh } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import {
  fetchSolarEdgeGraphData,
  selectGraphData,
  selectGraphLoading,
  selectGraphError,
  clearGraphData,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SolarEdgeEnergyFlowGraphSkeleton from "@/components/loadingSkeletons/SolarEdgeEnergyFlowGraphSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";
import useDeviceType from "@/hooks/useDeviceType";
import PercentageBar from "@/components/solaredge/PercentageBar";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import useCSVExport from "@/hooks/useCSVExport";
import CustomSelect from "../../ui/CustomSelect";
import CustomTooltipEnergyFlowGraph from "../tooltips/CustomTooltipEnergyFlowGraph.js";
import NoDataErrorState from "../../NoDataErrorState";
import { CiExport } from "react-icons/ci";
import DateSelector from "@/components/DateSelector";

// Constants
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 500;
const MAX_RETRY_DELAY = 1000;

const RANGE_OPTIONS = [
  { value: "DAY", label: "day" },
  { value: "WEEK", label: "week" },
  { value: "MONTH", label: "month" },
  { value: "YEAR", label: "year" },
  { value: "CICLO", label: "billingCycle" },
  { value: "CUSTOM", label: "custom" },
];

const getVisibleCurves = (theme, t) => [
  {
    dataKey: "selfConsumption",
    color: theme === "dark" ? "#FFD57B" : "#BDBFC0",
    name: t("Autoconsumo"),
  },
  {
    dataKey: "consumption",
    color: theme === "dark" ? "#BDBFC0" : "#0B2738",
    name: t("Consumo"),
  },
  {
    dataKey: "solarProduction",
    color: theme === "dark" ? "#657880" : "#FFD57B",
    name: t("Producción Solar"),
  },
  {
    dataKey: "export",
    color: theme === "dark" ? "#A48D67" : "#9CA3AF",
    name: t("Exportación"),
  },
  {
    dataKey: "import",
    color: theme === "dark" ? "#9CA3AF" : "#AD936A",
    name: t("Importación"),
  },
];

const validateData = (data) => {
  if (!data) return false;
  const requiredArrays = [
    "consumption",
    "export",
    "import",
    "selfConsumption",
    "solarProduction",
  ];
  return requiredArrays.every(
    (key) => Array.isArray(data[key]) && data[key].length > 0
  );
};

const SolarEdgeEnergyFlowGraph = ({ title, token }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useDeviceType();
  const { plantId } = useParams();
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const graphError = useSelector(selectGraphError);
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);
  const [range, setRange] = useState("DAY");
  const [customRange, setCustomRange] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [retryCount, setRetryCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [isStartDateOpen, setStartDateOpen] = useState(false);
  const [isEndDateOpen, setEndDateOpen] = useState(false);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // Hooks
  const { downloadCSV } = useCSVExport();

  // Memoized values
  const visibleCurves = useMemo(() => getVisibleCurves(theme, t), [theme, t]);

  const retryDelay = useMemo(
    () =>
      Math.floor(Math.random() * (MAX_RETRY_DELAY - BASE_RETRY_DELAY)) +
      BASE_RETRY_DELAY,
    []
  );

  const formatDate = useCallback(
    (date) =>
      date ? date.toISOString().replace("T", " ").slice(0, 19) : undefined,
    []
  );

  const calculateStartDate = useCallback(() => {
    const now = new Date();

    switch (range) {
      case "DAY":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "WEEK": {
        const start = new Date(now);
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        return start;
      }
      case "MONTH": {
        const monthStart = new Date(now);
        monthStart.setDate(now.getDate() - 30);
        monthStart.setHours(0, 0, 0, 0);
        return monthStart;
      }
      case "YEAR": {
        const yearStart = new Date(now);
        yearStart.setFullYear(now.getFullYear() - 1);
        yearStart.setMonth(now.getMonth());
        yearStart.setDate(now.getDate());
        return yearStart;
      }
      case "CICLO":
        return new Date(now.getFullYear(), now.getMonth(), 1);
      default:
        return now;
    }
  }, [range]);

  const handleFetch = useCallback(
    async (params) => {
      try {
        // console.log("params", params);
        await dispatch(fetchSolarEdgeGraphData(params));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [dispatch]
  );

  // Date range effect
  useEffect(() => {
    if (!customRange) {
      setStartDate(calculateStartDate());
      setEndDate(new Date());
    }
  }, [range, customRange, calculateStartDate]);

  // Last update time effect
  useEffect(() => {
    if (graphData?.overview?.lastUpdateTime) {
      setLastUpdateTime(graphData.overview.lastUpdateTime);
    }
  }, [graphData]);

  // Data validation and retry effect
  useEffect(() => {
    let retryTimer;
    const isDataValid = validateData(graphData);

    if (!isDataValid && retryCount < MAX_RETRIES) {
      retryTimer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        handleFetch({
          id: plantId,
          dia:
            range === "DAY"
              ? "QUARTER_OF_AN_HOUR"
              : range === "YEAR"
              ? "MONTH"
              : "DAY",
          fechaInicio: formatDate(
            customRange ? startDate : calculateStartDate()
          ),
          fechaFin: formatDate(customRange ? endDate : new Date()),
          token,
        });
      }, retryDelay);
    }

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [
    graphData,
    retryCount,
    retryDelay,
    handleFetch,
    plantId,
    range,
    customRange,
    startDate,
    endDate,
    token,
    calculateStartDate,
    formatDate,
  ]);

  // Initial fetch effect
  useEffect(() => {
    handleFetch({
      id: plantId,
      dia:
        range === "DAY"
          ? "QUARTER_OF_AN_HOUR"
          : range === "YEAR"
          ? "MONTH"
          : "DAY",
      fechaInicio: formatDate(customRange ? startDate : calculateStartDate()),
      fechaFin: formatDate(customRange ? endDate : new Date()),
      token,
    });
  }, [
    handleFetch,
    plantId,
    range,
    customRange,
    startDate,
    endDate,
    calculateStartDate,
    token,
    formatDate,
  ]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      dispatch(clearGraphData());
    };
  }, [dispatch]);

  const transformedData = useMemo(() => {
    if (!graphData || isLoading) return [];

    const mergedData = {};
    const dataKeys = [
      "consumption",
      "export",
      "import",
      "selfConsumption",
      "solarProduction",
    ];

    dataKeys.forEach((key) => {
      if (Array.isArray(graphData[key])) {
        graphData[key].forEach(({ date, value }) => {
          if (!mergedData[date]) mergedData[date] = { date };
          // Convert from W to kW by dividing by 1000
          mergedData[date][key] = value / 1000;
        });
      }
    });

    return Object.values(mergedData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [graphData, isLoading]);

  const filteredData = useMemo(() => {
    if (!transformedData.length) return [];

    const now = new Date();

    switch (range) {
      case "DAY": {
        const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return transformedData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= past24h && itemDate <= now;
        });
      }
      case "WEEK": {
        const past7Days = new Date(now);
        past7Days.setDate(now.getDate() - 6);
        past7Days.setHours(0, 0, 0, 0);
        return transformedData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= past7Days && itemDate <= now;
        });
      }
      case "MONTH": {
        const past31Days = new Date(now);
        past31Days.setDate(now.getDate() - 30);
        past31Days.setHours(0, 0, 0, 0);
        return transformedData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= past31Days && itemDate <= now;
        });
      }
      case "YEAR": {
        const pastYear = new Date(now);
        pastYear.setFullYear(now.getFullYear() - 1);
        pastYear.setMonth(now.getMonth());
        pastYear.setDate(now.getDate());
        return transformedData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= pastYear && itemDate <= now;
        });
      }
      case "CICLO": {
        const cicloStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return transformedData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= cicloStart && itemDate <= now;
        });
      }
      default:
        return transformedData;
    }
  }, [transformedData, range]);

  const formatXAxis = useCallback(
    (dateStr) => {
      try {
        const date = new Date(dateStr);

        switch (range) {
          case "DAY":
            return date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          case "WEEK":
            return date.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
          case "MONTH":
            return date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });
          case "YEAR":
            return date.toLocaleDateString(undefined, {
              month: "short",
              year: "2-digit",
            });
          case "CICLO":
            return date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });
          default:
            return date.toLocaleDateString();
        }
      } catch {
        return dateStr;
      }
    },
    [range]
  );

  const handleButtonClick = useCallback(() => {
    if (!token) {
      console.error("Token is missing! Cannot fetch data.");
      return;
    }

    handleFetch({
      id: plantId,
      dia:
        range === "DAY"
          ? "QUARTER_OF_AN_HOUR"
          : range === "YEAR"
          ? "MONTH"
          : "DAY",
      fechaInicio: formatDate(customRange ? startDate : calculateStartDate()),
      fechaFin: formatDate(customRange ? endDate : new Date()),
      token,
    });
  }, [
    token,
    handleFetch,
    plantId,
    range,
    customRange,
    startDate,
    endDate,
    calculateStartDate,
    formatDate,
  ]);

  const isEmptyOrZeroData = useMemo(() => {
    if (!transformedData.length) return true;

    return transformedData.every((dataPoint) =>
      visibleCurves.every(
        (curve) => !dataPoint[curve.dataKey] || dataPoint[curve.dataKey] === 0
      )
    );
  }, [transformedData, visibleCurves]);

  const handleExportCSV = useCallback(() => {
    const exportData = filteredData.map((item) => ({
      "Hora de medición": item.date,
      "Producción (kW)": item.solarProduction || 0,
      "A la red (kW)": item.export || 0,
      "Consumo (kW)": item.consumption || 0,
      "De la red (kW)": item.import || 0,
      "De Solar (kW)": item.selfConsumption || 0,
    }));

    downloadCSV(exportData, "solaredge_data.csv");
  }, [filteredData, downloadCSV]);

  return (
    <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col md:gap-2 w-full">
            <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4 md:mb-0 max-w-[70%]">
              {title}
            </h2>
            {lastUpdateTime && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t("lastUpdate")}:{" "}
                {new Date(lastUpdateTime).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <CustomSelect
              value={t(
                RANGE_OPTIONS.find((option) => option.value === range)?.label
              )}
              onChange={(value) => {
                setRange(value);
                setCustomRange(value === "CUSTOM");
              }}
              options={RANGE_OPTIONS.map((option) => ({
                value: option.value,
                label: t(option.label),
              }))}
            />
            <button
              onClick={handleExportCSV}
              className="w-10 h-10 p-2 bg-white hover:bg-white/50 transition-all duration-300 dark:bg-custom-dark-blue hover:dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow"
            >
              <CiExport className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
            </button>
          </div>
        </div>

        {customRange && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                ref={startDateRef}
                value={startDate ? format(startDate, "dd/MM/yyyy") : ""}
                onClick={() => setStartDateOpen(true)}
                readOnly
                placeholder={t("startDate")}
                className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white w-full cursor-pointer"
              />
              <DateSelector
                isOpen={isStartDateOpen}
                onClose={() => setStartDateOpen(false)}
                onSelect={(date) => {
                  setStartDate(date);
                  setStartDateOpen(false);
                }}
                value={startDate}
                parentRef={startDateRef}
              />
            </div>
            <div className="relative">
              <input
                type="text"
                ref={endDateRef}
                value={endDate ? format(endDate, "dd/MM/yyyy") : ""}
                onClick={() => setEndDateOpen(true)}
                readOnly
                placeholder={t("endDate")}
                className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white w-full cursor-pointer"
              />
              <DateSelector
                isOpen={isEndDateOpen}
                onClose={() => setEndDateOpen(false)}
                onSelect={(date) => {
                  setEndDate(date);
                  setEndDateOpen(false);
                }}
                value={endDate}
                parentRef={endDateRef}
              />
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <SolarEdgeEnergyFlowGraphSkeleton theme={theme} />
      ) : graphError ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <NoDataErrorState
            isError={true}
            onRetry={handleButtonClick}
            onSelectRange={() => {
              // Reset to default range if needed
              setRange("DAY");
              setCustomRange(false);
            }}
          />
        </div>
      ) : isEmptyOrZeroData ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <NoDataErrorState
            isError={false}
            onRetry={handleButtonClick}
            onSelectRange={() => {
              // Reset to default range if needed
              setRange("DAY");
              setCustomRange(false);
            }}
          />
        </div>
      ) : (
        <div>
          <div className="mb-6 flex flex-col gap-6">
            <PercentageBar
              title={t("Producción del Sistema")}
              value1={graphData?.totalSelfConsumption}
              value2={graphData?.totalExport}
              label1={t("Autoconsumo")}
              label2={t("Exportada")}
              color1={theme === "dark" ? "#BDBFC0" : "#0B2738"}
              color2={theme === "dark" ? "#657880" : "#758B95"}
            />
            <PercentageBar
              title={t("Consumo")}
              value1={graphData?.totalSelfConsumption}
              value2={graphData?.totalImport}
              label1={t("Autoconsumo")}
              label2={t("Importada")}
              color1={theme === "dark" ? "#FFD57B" : "#FFD57B"}
              color2={theme === "dark" ? " #A48D67" : "#F4E3C0"}
            />
          </div>

          <div className="overflow-x-auto">
            <div style={{ minWidth: "600px" }}>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={filteredData}
                  margin={{
                    left: 5,
                    right: isMobile ? -25 : 15,
                    top: 10,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === "dark" ? "#E0E0E0" : "rgb(161, 161, 170)"}
                    opacity={theme === "dark" ? 0.5 : 1}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    label={{
                      value: "kW",
                      angle: -90,
                      position: "insideLeft",
                      offset: 5,
                    }}
                  />
                  <Tooltip content={<CustomTooltipEnergyFlowGraph />} />
                  <Legend />
                  {visibleCurves.map((curve) => (
                    <Line
                      key={curve.dataKey}
                      type="monotone"
                      dataKey={curve.dataKey}
                      stroke={curve.color}
                      name={curve.name}
                      dot={false}
                      strokeWidth={3}
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarEdgeEnergyFlowGraph;
