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
import SolarEdgeGraphDisplaySkeleton from "@/components/loadingSkeletons/SolarEdgeGraphDisplaySkeleton";
import { selectTheme } from "@/store/slices/themeSlice";
import useDeviceType from "@/hooks/useDeviceType";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Info } from "lucide-react";
import PercentageBar from "@/components/solaredge/PercentageBar";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useParams } from "next/navigation";
import ExportModal from "../ExportModal";
import useCSVExport from "@/hooks/useCSVExport";
import CustomSelect from "../ui/CustomSelect";

const SolarEdgeGraphDisplay = ({ title }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useDeviceType();
  const [range, setRange] = useState("DAY");
  const [customRange, setCustomRange] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [retryCount, setRetryCount] = useState(0);
  const [hasEmptyData, setHasEmptyData] = useState(false);
  const maxRetries = 3;
  const retryDelay = Math.floor(Math.random() * 500) + 500;
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const graphError = useSelector(selectGraphError);
  const user = useSelector(selectUser);
  const token = user?.tokenIdentificador;
  const theme = useSelector(selectTheme);
  const params = useParams();
  const plantId = params?.plantId;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { downloadCSV } = useCSVExport();
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  const VISIBLE_CURVES = [
    {
      dataKey: "selfConsumption",
      color: "#4CAF50",
      name: t("Autoconsumo"),
    },
    {
      dataKey: "consumption",
      color: "#F44336",
      name: t("Consumo"),
    },
    {
      dataKey: "solarProduction",
      color: "#FFEB3B",
      name: t("Producción Solar"),
    },
    {
      dataKey: "export",
      color: "#FF5722",
      name: t("Exportación"),
    },
    {
      dataKey: "import",
      color: "#2196F3",
      name: t("Importación"),
    },
  ];

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
        return new Date(now.getFullYear(), now.getMonth(), 1);
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

  useEffect(() => {
    if (graphData?.overview?.lastUpdateTime) {
      setLastUpdateTime(graphData.overview.lastUpdateTime);
    }
  }, [graphData]);

  const handleFetch = useCallback(
    async (params) => {
      try {
        await dispatch(
          fetchSolarEdgeGraphData({
            plantId: params.id,
            dia: params.dia,
            fechaInicio: params.fechaInicio,
            fechaFin: params.fechaFin,
            token: params.token,
          })
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasEmptyData(true);
      }
    },
    [dispatch]
  );

  // Update validateData function
  useEffect(() => {
    const validateData = (data) => {
      if (!data) return false;

      // Check if we have the required arrays with data
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

    const isDataValid = validateData(graphData);

    if (!isDataValid) {
      if (retryCount < maxRetries) {
        setHasEmptyData(true);
        const retryTimer = setTimeout(() => {
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
        return () => clearTimeout(retryTimer);
      }
    } else {
      setHasEmptyData(false);
      setRetryCount(0);
    }
  }, [
    graphData,
    retryCount,
    handleFetch,
    plantId,
    range,
    customRange,
    startDate,
    endDate,
    token,
    calculateStartDate,
  ]);

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
  ]);

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
          mergedData[date][key] = value;
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

  const handleButtonClick = () => {
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
      if (!payload) return null;

      return (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-custom-dark-blue dark:text-custom-light-gray">
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

  const isEmptyOrZeroData = useMemo(() => {
    if (!transformedData.length) return true;

    return transformedData.every((dataPoint) =>
      VISIBLE_CURVES.every(
        (curve) => !dataPoint[curve.dataKey] || dataPoint[curve.dataKey] === 0
      )
    );
  }, [transformedData, VISIBLE_CURVES]);

  // console.log("filteredData: ", filteredData);

  const handleExportCSV = () => {
    // Transform the data into the desired format
    const exportData = filteredData.map((item) => ({
      "Hora de medición": item.date,
      "Producción (W)": item.solarProduction || 0,
      "A la red (W)": item.export || 0,
      "Consumo (W)": item.consumption || 0,
      "De la red (W)": item.import || 0,
      "De Solar (W)": item.selfConsumption || 0,
    }));

    downloadCSV(exportData, "solar_edge_data.csv");
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Title and Controls Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
              {title}
            </h2>
            <button
              onClick={handleButtonClick}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <BiRefresh
                className={`text-2xl text-custom-dark-blue dark:text-custom-yellow ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
            </button>
            {lastUpdateTime && (
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t("lastUpdate")}:{" "}
                      {new Date(lastUpdateTime).toLocaleDateString()}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-sm">
                      {new Date(lastUpdateTime).toLocaleString()}
                    </p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center gap-4">
            <CustomSelect
              value={t(range.toLowerCase())} // Pass the translated current value
              onChange={(value) => {
                setRange(value);
                setCustomRange(value === "CUSTOM");
              }}
              label="" // Remove the label since we just want to show the value
              options={[
                { value: "DAY", label: "day" },
                { value: "WEEK", label: "week" },
                { value: "MONTH", label: "month" },
                { value: "YEAR", label: "year" },
                { value: "CICLO", label: "billingCycle" },
                { value: "CUSTOM", label: "custom" },
              ]}
              className="text-sm" // Match the text size with the rest of the UI
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <BiDotsVerticalRounded className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
            </button>
          </div>
        </div>

        {/* Date Picker Row */}
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

      {/* Content Section */}
      {isLoading ? (
        <SolarEdgeGraphDisplaySkeleton theme={theme} />
      ) : isEmptyOrZeroData ? (
        <div className="flex flex-col items-center justify-center p-8 gap-4">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {t("noDataAvailable")}
          </p>
          <PrimaryButton
            onClick={() => handleFetch({ id: plantId, dia: range, token })}
          >
            {t("tryAgain")}
          </PrimaryButton>
        </div>
      ) : (
        <>
          {/* Percentage Bars */}
          <div className="mb-6 flex flex-col gap-6">
            <PercentageBar
              title={t("Producción del Sistema")}
              value1={graphData?.totalSelfConsumption}
              value2={graphData?.totalExport}
              label1={t("Autoconsumo")}
              label2={t("Exportada")}
              color1="#4CAF50"
              color2="#FF5722"
            />
            <PercentageBar
              title={t("Consumo")}
              value1={graphData?.totalSelfConsumption}
              value2={graphData?.totalImport}
              label1={t("Autoconsumo")}
              label2={t("Importada")}
              color1="#4CAF50"
              color2="#2196F3"
            />
          </div>

          {/* Graph */}
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
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
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
              {VISIBLE_CURVES.map((curve) => (
                <Line
                  key={curve.dataKey}
                  type="monotone"
                  dataKey={curve.dataKey}
                  stroke={curve.color}
                  name={curve.name}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Export Modal */}
      {isModalOpen && (
        <ExportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onExport={handleExportCSV}
          t={t}
          isLoading={isLoading}
          hasData={filteredData?.length > 0}
        />
      )}
    </div>
  );
};

export default SolarEdgeGraphDisplay;
