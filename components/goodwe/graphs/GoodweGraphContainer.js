import React, { useState, useCallback, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  fetchGoodweGraphData,
  selectGraphData,
  selectGraphLoading,
  selectGraphError,
  clearGraphData,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import { BiDotsVerticalRounded, BiRefresh } from "react-icons/bi";
import { BsCalendar3 } from "react-icons/bs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import GoodweGraphDisplaySkeleton from "@/components/loadingSkeletons/GoodweGraphDisplaySkeleton";
import NoDataErrorState from "@/components/NoDataErrorState";
import GoodweDateSelector from "@/components/goodwe/GoodweDateSelector";
import CustomSelect from "@/components/ui/CustomSelect";
import ExportModal from "@/components/ExportModal";
import PowerGraph from "@/components/goodwe/graphs/PowerGraph";
import EnergyStatisticsGraph from "@/components/goodwe/graphs/EnergyStatisticsGraph";
import useDeviceType from "@/hooks/useDeviceType";
import useCSVExport from "@/hooks/useCSVExport";
import ProporcionUsoGraph from "@/components/goodwe/graphs/ProporcionUsoGraph";
import GeneracionEnergiaGraph from "@/components/goodwe/graphs/GeneracionEnergiaGraph";
import IndiceContribucionGraph from "@/components/goodwe/graphs/IndiceContribucionGraph";
import { CiExport } from "react-icons/ci";

const CHART_TYPE_OPTIONS = [
  { value: "potencia", label: "power" },
  { value: "generacion de energia y ingresos", label: "energyAndIncome" },
  { value: "proporcion para uso personal", label: "personalUse" },
  { value: "indice de contribucion", label: "contributionIndex" },
  { value: "estadisticas sobre energia", label: "energyStatistics" },
];

const RANGE_OPTIONS = [
  { value: "dia", label: "day" },
  { value: "mes", label: "month" },
  { value: "año", label: "year" },
];

const GoodweGraphContainer = ({ plantId, title, onValueUpdate }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useDeviceType();
  const theme = useSelector(selectTheme);
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const error = useSelector(selectGraphError);
  const user = useSelector(selectUser);
  const { downloadCSV } = useCSVExport();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [chartIndexId, setChartIndexId] = useState("potencia");
  const [range, setRange] = useState("dia");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dateButtonRef = React.useRef(null);

  // Set range to "dia" whenever chartIndexId is "potencia"
  useEffect(() => {
    if (chartIndexId === "potencia" && range !== "dia") {
      setRange("dia");
    }
  }, [chartIndexId]);

  const handleFetchGraph = useCallback(async () => {
    if (!plantId || !user?.tokenIdentificador || !selectedDate) return;

    try {
      dispatch(clearGraphData());
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const requestBody = {
        id: plantId,
        date: formattedDate,
        chartIndexId,
        token: user.tokenIdentificador,
      };

      if (chartIndexId !== "potencia") {
        requestBody.range = range;
      }

      const response = await dispatch(
        fetchGoodweGraphData(requestBody)
      ).unwrap();
      const lines = response?.data?.data?.lines || [];
      const todayPV = lines.length > 0 ? lines[0].xy.slice(-1)[0]?.y : null;

      if (onValueUpdate && todayPV !== null) {
        onValueUpdate(todayPV);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    } finally {
      setIsInitialLoad(false);
    }
  }, [
    dispatch,
    plantId,
    selectedDate,
    range,
    chartIndexId,
    user?.tokenIdentificador,
    onValueUpdate,
  ]);

  useEffect(() => {
    if (!isInitialLoad && plantId && user?.tokenIdentificador) {
      handleFetchGraph();
    } else if (plantId && user?.tokenIdentificador) {
      setIsInitialLoad(false);
      handleFetchGraph();
    }
  }, [isInitialLoad, plantId, user?.tokenIdentificador, handleFetchGraph]);

  useEffect(() => {
    return () => dispatch(clearGraphData());
  }, [dispatch]);

  const handleExportCSV = useCallback(() => {
    if (!graphData?.data?.data) {
      console.warn("No data available for export");
      return;
    }

    let transformedData = [];

    // If graph data contains 'lines', process it normally
    if (graphData.data.data.lines && graphData.data.data.lines.length > 0) {
      transformedData =
        chartIndexId === "potencia"
          ? graphData.data.data.lines[0]?.xy.map((point, index) => {
              const row = { "Fecha y Hora": point.x };
              graphData.data.data.lines.forEach((line) => {
                const unit = line.unit ? `(${line.unit})` : "";
                row[`${line.key} ${unit}`] = line.xy[index]?.y || 0;
              });
              return row;
            })
          : graphData.data.data.lines[0]?.xy.map((point, index) => {
              const row = { Fecha: point.x };
              graphData.data.data.lines.forEach((line) => {
                const unit = line.unit ? `(${line.unit})` : "";
                row[`${line.name} ${unit}`] = line.xy[index]?.y || 0;
              });
              return row;
            });
    }
    // If 'lines' are empty, check 'modelData' (for Estadísticas sobre Energía)
    else if (graphData.data.data.modelData) {
      const modelData = graphData.data.data.modelData;

      // **Define correct units for 'modelData'**
      const unitMapping = {
        buy: "kWh",
        buyPercent: "%",
        charge: "kWh",
        consumptionOfLoad: "kWh",
        contributionRatio: "%",
        disCharge: "kWh",
        etotal: "kWh",
        gensetGen: "kWh",
        in_House: "kWh",
        outPut: "kWh",
        selfUseOfPv: "kWh",
        selfUseRatio: "%",
        sell: "kWh",
        sellPercent: "%",
        sum: "kWh",
        yesterdayEtotal: "kWh",
      };

      transformedData = Object.keys(modelData).map((key) => ({
        Métrica: `${key} (${unitMapping[key] || ""})`.trim(), // Add unit dynamically
        Valor: modelData[key],
      }));
    }

    if (transformedData.length > 0) {
      const filename = `goodwe-${chartIndexId}-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.csv`;
      downloadCSV(transformedData, filename);
    } else {
      console.warn("No valid data for export.");
    }

    setIsModalOpen(false);
  }, [chartIndexId, downloadCSV, graphData]);

  const renderGraphContent = () => {
    if (isLoading || isInitialLoad) {
      return <GoodweGraphDisplaySkeleton theme={theme} />;
    }

    const hasValidData =
      graphData?.data?.data?.lines?.length > 0 ||
      (chartIndexId === "estadisticas sobre energia" &&
        graphData?.data?.data?.modelData);

    if (!hasValidData || error) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <NoDataErrorState
            isError={!!error}
            onRetry={handleFetchGraph}
            onSelectRange={() => setIsDateSelectorOpen(true)}
          />
        </div>
      );
    }

    switch (chartIndexId) {
      case "potencia":
        return (
          <PowerGraph
            data={graphData?.data?.data}
            theme={theme}
            isMobile={isMobile}
            onRetry={handleFetchGraph}
            onSelectRange={() => setIsDateSelectorOpen(true)}
            isError={error}
          />
        );
      case "estadisticas sobre energia":
        return (
          <EnergyStatisticsGraph
            data={graphData?.data?.data}
            theme={theme}
            isMobile={isMobile}
            onRetry={handleFetchGraph}
            onSelectRange={() => setIsDateSelectorOpen(true)}
            isError={error}
          />
        );
      case "generacion de energia y ingresos":
        return (
          <GeneracionEnergiaGraph
            data={graphData?.data?.data}
            theme={theme}
            isMobile={isMobile}
            onRetry={handleFetchGraph}
            onSelectRange={() => setIsDateSelectorOpen(true)}
            isError={error}
          />
        );
      case "proporcion para uso personal":
        return (
          <ProporcionUsoGraph
            data={graphData?.data?.data}
            theme={theme}
            isMobile={isMobile}
            onRetry={handleFetchGraph}
            onSelectRange={() => setIsDateSelectorOpen(true)}
            isError={error}
          />
        );
      case "indice de contribucion":
        return (
          <IndiceContribucionGraph
            data={graphData?.data?.data}
            theme={theme}
            isMobile={isMobile}
            onRetry={handleFetchGraph}
            onSelectRange={() => setIsDateSelectorOpen(true)}
            isError={error}
          />
        );
      default:
        return null;
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDateSelectorOpen(false);
    handleFetchGraph();
  };

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    handleFetchGraph();
  };

  return (
    <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 relative">
      <div className="flex flex-col mb-6">
        <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow text-left max-w-[70%] mb-2 md:mb-4">
          {title}
        </h2>
        <button
          onClick={handleFetchGraph}
          disabled={isLoading}
          className="absolute top-4 right-16 w-10 h-10 p-2 bg-white hover:bg-white/50 transition-all duration-300 dark:bg-custom-dark-blue hover:dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow"
        >
          <BiRefresh
            className={`text-3xl text-custom-dark-blue dark:text-custom-yellow  ${
              isLoading ? "animate-spin" : ""
            }`}
          />
        </button>
        <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          {/* Range Selector - Only show if not potencia */}
          <div className="flex items-center gap-4">
            {chartIndexId !== "potencia" && (
              <CustomSelect
                value={range}
                onChange={handleRangeChange}
                options={RANGE_OPTIONS}
              />
            )}
            {/* Date Selector */}
            <div className="relative">
              <div ref={dateButtonRef}>
                <button
                  onClick={() => setIsDateSelectorOpen((prev) => !prev)}
                  className="font-secondary dark:border dark:border-gray-200/50 text-md flex gap-4 items-center text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 hover:bg-custom-light-gray dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow h-full"
                >
                  <span>
                    {selectedDate
                      ? format(
                          selectedDate,
                          range === "dia"
                            ? "dd/MM/yyyy"
                            : range === "mes"
                            ? "MMM yyyy"
                            : "yyyy",
                          { locale: es }
                        )
                      : t("dateAll")}
                  </span>
                  <BsCalendar3 />
                </button>
              </div>
              {isDateSelectorOpen && (
                <GoodweDateSelector
                  isOpen={isDateSelectorOpen}
                  onClose={() => setIsDateSelectorOpen(false)}
                  onSelect={handleDateChange}
                  selectedDate={selectedDate}
                  parentRef={dateButtonRef}
                  range={range}
                  className="right-0"
                />
              )}
            </div>
          </div>
          <CustomSelect
            value={chartIndexId}
            onChange={(newChartId) => {
              setChartIndexId(newChartId);
              handleFetchGraph();
            }}
            options={CHART_TYPE_OPTIONS}
            className="w-fit"
          />
          <button
            onClick={handleExportCSV}
            className="absolute right-4 top-4 w-10 h-10 p-2 bg-white hover:bg-white/50 transition-all duration-300 dark:bg-custom-dark-blue hover:dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow"
          >
            <CiExport className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
          </button>
        </div>
      </div>
      <div className="relative">{renderGraphContent()}</div>
    </div>
  );
};

export default memo(GoodweGraphContainer);
