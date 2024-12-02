import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { BiRefresh } from "react-icons/bi";
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
import SolarEdgeGraphDisplaySkeleton from "./LoadingSkeletons/SolarEdgeGraphDisplaySkeleton";
import { selectTheme } from "@/store/slices/themeSlice";
import useDeviceType from "@/hooks/useDeviceType";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { Info } from "lucide-react";
import PercentageBar from "@/components/PercentageBar";
import PrimaryButton from "./PrimaryButton";

const SolarEdgeGraphDisplay = ({ plantId, title }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useDeviceType();

  const [range, setRange] = useState("DAY");
  const [customRange, setCustomRange] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [retryCount, setRetryCount] = useState(0);
  const [hasEmptyCurves, setHasEmptyCurves] = useState(false);
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const graphError = useSelector(selectGraphError);
  const user = useSelector(selectUser);
  const token = user?.tokenIdentificador;
  const theme = useSelector(selectTheme);

  const formatDate = (date) =>
    date ? date.toISOString().replace("T", " ").slice(0, 19) : undefined;

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
      case "CICLO": {
        const cicloStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return cicloStart;
      }
      default:
        return now;
    }
  }, [range]);

  useEffect(() => {
    if (!customRange) {
      setStartDate(calculateStartDate());
      setEndDate(new Date());
    }
  }, [range, customRange, calculateStartDate]);

  const handleFetchGraph = useCallback(async () => {
    try {
      if (plantId && token) {
        await dispatch(
          fetchSolarEdgeGraphData({
            plantId,
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
          })
        );
      }
    } catch (error) {
      console.error("Error fetching graph data:", error.message);
    }
  }, [
    dispatch,
    plantId,
    range,
    customRange,
    startDate,
    endDate,
    calculateStartDate,
    token,
  ]);

  useEffect(() => {
    handleFetchGraph();
    return () => {
      dispatch(clearGraphData());
    };
  }, [handleFetchGraph, dispatch]);

  // Add effect to handle retries
  useEffect(() => {
    if (hasEmptyCurves && retryCount < 5) {
      const retryTimer = setTimeout(() => {
        console.log(`Retrying fetch (attempt ${retryCount + 1}/5)...`);
        setRetryCount((prev) => prev + 1);
        handleFetchGraph();
      }, 100); // Wait 0.1 seconds between retries

      return () => clearTimeout(retryTimer);
    }
  }, [hasEmptyCurves, retryCount, handleFetchGraph]);

  // Reset retry count when range changes
  useEffect(() => {
    setRetryCount(0);
    setHasEmptyCurves(false);
  }, [range, startDate, endDate]);

  const transformedData = useMemo(() => {
    if (!graphData || isLoading) return [];

    // First, check if all curves have data
    const hasEmptyArray = Object.keys(graphData).some(
      (key) => Array.isArray(graphData[key]) && graphData[key].length === 0
    );

    // If any curve is empty and we haven't retried 3 times yet, trigger retry
    if (hasEmptyArray && retryCount < 3) {
      setHasEmptyCurves(true);
      // Will trigger retry effect
      return [];
    }

    // If all curves have data or we've retried 3 times, proceed with transform
    const mergedData = {};
    Object.keys(graphData).forEach((key) => {
      if (Array.isArray(graphData[key])) {
        graphData[key].forEach(({ date, value }) => {
          if (!mergedData[date]) mergedData[date] = { date };
          mergedData[date][key] = value;
        });
      }
    });

    // All good, no need for more retries
    setHasEmptyCurves(false);
    return Object.values(mergedData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [graphData, isLoading, retryCount]);

  const filteredData = useMemo(() => {
    if (!transformedData.length) return [];

    const now = new Date();
    switch (range) {
      case "DAY": {
        const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Keep only one data point per hour
        return transformedData
          .filter((item) => {
            const itemDate = new Date(item.date);
            return itemDate >= past24h && itemDate <= now;
          })
          .filter((item, index, array) => {
            const currentHour = new Date(item.date).getHours();
            const previousHour =
              index > 0 ? new Date(array[index - 1].date).getHours() : -1;
            return currentHour !== previousHour;
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

  const formatXAxis = (dateStr) => {
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
  };

  const renderTooltip = useCallback(
    (name) => {
      return (
        <TooltipProvider>
          <TooltipUI>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-custom-dark-blue dark:text-custom-yellow cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-sm">{t(`tooltips.${name}`)}</p>
            </TooltipContent>
          </TooltipUI>
        </TooltipProvider>
      );
    },
    [t]
  );

  const customLegendRenderer = useCallback(
    (props) => {
      const { payload } = props;
      return (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm dark:text-custom-light-gray">
                {entry.value}
              </span>
              {renderTooltip(entry.value.toLowerCase())}
            </div>
          ))}
        </div>
      );
    },
    [renderTooltip]
  );

  return (
    <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
            {title}
          </h2>
          <button
            onClick={handleFetchGraph}
            disabled={isLoading || (hasEmptyCurves && retryCount < 3)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 mb-1"
          >
            <BiRefresh
              className={`text-2xl text-custom-dark-blue dark:text-custom-yellow ${
                isLoading || (hasEmptyCurves && retryCount < 3)
                  ? "animate-spin"
                  : ""
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={range}
            onChange={(e) => {
              setRange(e.target.value);
              setCustomRange(e.target.value === "CUSTOM");
            }}
            className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm w-auto"
          >
            <option value="DAY">{t("day")}</option>
            <option value="WEEK">{t("week")}</option>
            <option value="MONTH">{t("month")}</option>
            <option value="YEAR">{t("year")}</option>
            <option value="CICLO">{t("billingCycle")}</option>
            <option value="CUSTOM">{t("custom")}</option>
          </select>

          {customRange && (
            <div className="flex flex-col md:flex-row gap-4">
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white w-full"
                placeholderText={t("startDate")}
                dateFormat="dd/MM/yyyy"
                dropdownMode="select"
                openToDate={new Date()}
              />
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white w-full"
                placeholderText={t("endDate")}
                dateFormat="dd/MM/yyyy"
                dropdownMode="select"
              />
            </div>
          )}
        </div>
      </div>

      {isLoading || (hasEmptyCurves && retryCount < 3) ? (
        <>
          <SolarEdgeGraphDisplaySkeleton theme={theme} />
        </>
      ) : filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 gap-4">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {t("noDataAvailable")}
          </p>
          <PrimaryButton onClick={handleFetchGraph}>
            {t("tryAgain")}
          </PrimaryButton>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={filteredData}
            margin={{
              left: isMobile ? -15 : 15,
              right: isMobile ? -25 : 15,
              top: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
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
            <Tooltip
              labelFormatter={formatXAxis}
              formatter={(value, name) => [
                `${Number(value).toFixed(2)} kW`,
                t(name),
              ]}
            />
            <Legend content={customLegendRenderer} />
            {Object.keys(graphData || {})
              .filter((key) => key !== "storagePower")
              .map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={
                    [
                      "#F44336",
                      "#2196F3",
                      "#4CAF50",
                      "#FFEB3B",
                      "#9C27B0",
                      "#FF5722",
                    ][index % 6]
                  }
                  name={t(key)}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SolarEdgeGraphDisplay;
