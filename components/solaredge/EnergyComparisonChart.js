import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { BiDotsVerticalRounded, BiRefresh } from "react-icons/bi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import {
  fetchSolarEdgeComparisonGraph,
  selectComparisonData,
  selectComparisonError,
  selectComparisonLoading,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import useDeviceType from "@/hooks/useDeviceType";
import EnergyComparisonChartSkeleton from "@/components/loadingSkeletons/EnergyComparisonChartSkeleton";
import useCSVExport from "@/hooks/useCSVExport";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import ExportModal from "../ExportModal";
import { Info } from "lucide-react";
import CustomTooltipEnergyComparison from "./CustomTooltipEnergyComparison";

const EnergyComparisonChart = ({ plantId, installationDate, token }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile } = useDeviceType();
  const comparisonData = useSelector(selectComparisonData);
  const isLoading = useSelector(selectComparisonLoading);
  const theme = useSelector(selectTheme);
  const [timeUnit, setTimeUnit] = useState("MONTH");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { downloadCSV } = useCSVExport();
  const comparisonError = useSelector(selectComparisonError);

  const COLORS = useMemo(() => {
    return theme === "dark"
      ? ["#A48D67", "#657880", "#BDBFC0", "#FFD57B", "#695A42"]
      : ["#0B2738", "#AD936A", "#FFD57B", "#0B2738", "#728EA1"];
  }, [theme]);

  const monthNames = useMemo(
    () => [
      t("monthsUnits.jan"),
      t("monthsUnits.feb"),
      t("monthsUnits.mar"),
      t("monthsUnits.apr"),
      t("monthsUnits.may"),
      t("monthsUnits.jun"),
      t("monthsUnits.jul"),
      t("monthsUnits.aug"),
      t("monthsUnits.sep"),
      t("monthsUnits.oct"),
      t("monthsUnits.nov"),
      t("monthsUnits.dec"),
    ],
    [t]
  );

  useEffect(() => {
    if (plantId && installationDate && token) {
      const formattedDate = new Date(installationDate).getFullYear();
      dispatch(
        fetchSolarEdgeComparisonGraph({
          plantId,
          timeUnit,
          date: `${formattedDate}-01-01`,
          token,
        })
      );
    }
  }, [dispatch, plantId, installationDate, token, timeUnit]);

  const handleRefresh = () => {
    if (plantId && installationDate && token) {
      const formattedDate = new Date(installationDate).getFullYear();
      dispatch(
        fetchSolarEdgeComparisonGraph({
          plantId,
          timeUnit,
          date: `${formattedDate}-01-01`,
          token,
        })
      );
    }
  };

  const transformedData = useMemo(() => {
    if (!comparisonData || !Array.isArray(comparisonData)) return [];
    if (timeUnit === "MONTH") {
      return monthNames.map((month, index) => {
        const monthData = { name: month };
        comparisonData.forEach((item) => {
          const year = new Date(item.date).getFullYear();
          if (new Date(item.date).getMonth() === index) {
            monthData[year] = item.value || 0;
          }
        });
        return monthData;
      });
    } else if (timeUnit === "YEAR") {
      const years = {};
      comparisonData.forEach((item) => {
        const year = new Date(item.date).getFullYear();
        if (!years[year]) years[year] = { name: year, total: 0 };
        years[year].total += item.value || 0;
      });
      return Object.values(years).map((yearData) => ({
        ...yearData,
        name: `${yearData.name}`,
      }));
    }
    return [];
  }, [comparisonData, timeUnit, monthNames]);

  const getMinWidth = () => {
    if (!transformedData[0]) return 600;
    const numberOfBars = Object.keys(transformedData[0]).length - 1; // subtract 1 for 'name' key
    return Math.max(600, numberOfBars * 100); // Adjust 100 to your preferred bar spacing
  };

  const getBarSize = () => {
    if (timeUnit === "YEAR") return isMobile ? 30 : 50;
    return isMobile ? 10 : 15;
  };

  const handleExportCSV = () => {
    downloadCSV(comparisonData, "energy_comparison_data.csv");
    setIsModalOpen(false);
  };

  const customLegendRenderer = useCallback((props) => {
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
          </div>
        ))}
      </div>
    );
  }, []);

  return (
    <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mt-6">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
            {t("energyComparison")}
          </h2>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 mb-1"
          >
            <BiRefresh
              className={`text-2xl text-custom-dark-blue dark:text-custom-yellow ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <BiDotsVerticalRounded className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
        </button>
      </div>

      <div className="flex mb-6 justify-center md:justify-start">
        <button
          onClick={() => setTimeUnit("MONTH")}
          className={`py-2 px-4 w-24 rounded-l-lg text-sm font-secondary font-semibold transition-all ${
            timeUnit === "MONTH"
              ? "bg-custom-dark-blue dark:bg-custom-yellow text-custom-yellow dark:text-custom-dark-blue shadow-md"
              : "bg-slate-50 dark:bg-slate-700/50 dark:text-custom-yellow text-custom-dark-blue"
          }`}
        >
          {t("months")}
        </button>

        <button
          onClick={() => setTimeUnit("YEAR")}
          className={`py-2 px-4 w-24 rounded-r-lg text-sm font-secondary font-semibold transition-all ${
            timeUnit === "YEAR"
              ? "bg-custom-dark-blue dark:bg-custom-yellow text-custom-yellow dark:text-custom-dark-blue shadow-md"
              : "bg-slate-50 dark:bg-slate-700/50 dark:text-custom-yellow text-custom-dark-blue"
          }`}
        >
          {t("years")}
        </button>
      </div>

      {isLoading ? (
        <EnergyComparisonChartSkeleton theme={theme} />
      ) : !transformedData.length || comparisonError ? (
        <div>
          {/* No Data Available Message with Tooltip */}
          <div className="flex flex-col items-center justify-center pb-4 px-8 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-500 dark:text-gray-400">
                {t("noDataAvailable")}
              </span>

              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <div className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-700 cursor-pointer">
                      <Info className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      {t("noDataTooltip", {
                        range: timeUnit === "MONTH" ? t("months") : t("years"),
                      })}
                    </p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            </div>
          </div>

          {/* Empty Graph */}
          <div className="overflow-x-auto">
            <div style={{ minWidth: `${getMinWidth()}px` }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={[{ name: "", value: 0 }]} // Mock empty data
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === "dark" ? "#E0E0E0" : "rgb(161, 161, 170)"}
                    opacity={theme === "dark" ? 0.5 : 1}
                  />

                  <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                  <YAxis
                    dataKey="value" // Ensure a static dataKey exists
                    tick={{ fill: "#ccc" }}
                    domain={[0, 100]} // Keep a static domain for empty graphs
                    label={{
                      value: t("units.kwh"), // Always show the unit for the empty graph
                      angle: -90,
                      position: "insideLeft",
                      offset: 5,
                    }}
                  />

                  <Tooltip content={() => null} />
                  {COLORS.map((color, index) => (
                    <Bar
                      key={index}
                      dataKey={`value${index}`}
                      fill={color}
                      barSize={getBarSize()}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${getMinWidth()}px` }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={transformedData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 30,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#E0E0E0" : "rgb(161, 161, 170)"}
                  opacity={theme === "dark" ? 0.5 : 1}
                />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => {
                    if (value >= 1000000)
                      return `${(value / 1000000).toFixed(0)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value;
                  }}
                  tick={{ fontSize: 12 }}
                  label={{
                    value:
                      timeUnit === "MONTH" ? t("units.kwh") : t("units.mwh"),
                    angle: -90,
                    position: "insideLeft",
                    offset: 5,
                  }}
                />

                <Tooltip
                  content={
                    <CustomTooltipEnergyComparison timeUnit={timeUnit} />
                  }
                />

                {timeUnit === "MONTH" && (
                  <Legend content={customLegendRenderer} />
                )}
                {Object.keys(transformedData[0] || {}).map((key, index) =>
                  key !== "name" ? (
                    <Bar
                      key={key}
                      dataKey={key}
                      radius={[10, 10, 0, 0]}
                      fill={
                        timeUnit === "YEAR"
                          ? theme === "dark"
                            ? "#FFD57B" // Yellow for dark mode
                            : "#0B2738" // Dark blue for light mode
                          : COLORS[index % COLORS.length]
                      }
                      barSize={getBarSize()}
                    />
                  ) : null
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {isModalOpen && (
        <ExportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onExport={handleExportCSV}
          t={t}
          isLoading={isLoading}
          hasData={comparisonData?.length > 0}
        />
      )}
    </div>
  );
};

export default EnergyComparisonChart;
