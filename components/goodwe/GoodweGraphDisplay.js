import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BiRefresh } from "react-icons/bi";
import Loading from "@/components/ui/Loading";
import { useTranslation } from "react-i18next";
import {
  fetchGoodweGraphData,
  selectGraphData,
  selectGraphLoading,
  selectGraphError,
  clearGraphData,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import useDeviceType from "@/hooks/useDeviceType";
import GoodweGraphDisplaySkeleton from "@/components/LoadingSkeletons/GoodweGraphDisplaySkeleton";
import { selectTheme } from "@/store/slices/themeSlice";

const COLORS = ["#03bbd6", "#ffa726", "#4CC7B3", "#8cc44d", "#ff6384"];

const GoodweGraphDisplay = ({ plantId, title }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [range, setRange] = useState("dia");
  const [chartIndexId, setChartIndexId] = useState(
    "generacion de energia y ingresos"
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const graphError = useSelector(selectGraphError);
  const user = useSelector(selectUser);
  const currentDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const { isMobile, isDesktop } = useDeviceType();
  const theme = useSelector(selectTheme);

  const handleFetchGraph = useCallback(() => {
    if (plantId && user?.tokenIdentificador) {
      dispatch(
        fetchGoodweGraphData({
          id: plantId,
          date: currentDate,
          range,
          chartIndexId,
          token: user.tokenIdentificador,
        })
      );
    }
  }, [
    dispatch,
    plantId,
    currentDate,
    range,
    chartIndexId,
    user?.tokenIdentificador,
  ]);

  useEffect(() => {
    const shouldFetchData =
      !isInitialized && plantId && user?.tokenIdentificador;
    if (shouldFetchData) {
      setIsInitialized(true);
      handleFetchGraph();
    }
  }, [isInitialized, plantId, user?.tokenIdentificador, handleFetchGraph]);

  useEffect(() => {
    if (isInitialized) {
      handleFetchGraph();
    }
  }, [isInitialized, handleFetchGraph]);

  useEffect(() => {
    return () => {
      dispatch(clearGraphData());
    };
  }, [dispatch]);

  const getExpectedMetrics = useCallback(() => {
    switch (chartIndexId) {
      case "estadisticas sobre energia":
        return [
          { name: t("PV+BAT"), valueKey: "selfUseOfPv", color: COLORS[0] },
          { name: t("Red"), valueKey: "consumptionOfLoad", color: COLORS[1] },
          { name: t("Interno"), valueKey: "in_House", color: COLORS[2] },
          { name: t("Alimentar"), valueKey: "buy", color: COLORS[3] },
        ];
      case "generacion de energia y ingresos":
        return [
          {
            name: "PVGeneration",
            label: t("energy") + " (kWh)",
            color: "#03bbd6",
            isBar: true,
          },
          {
            name: "Income",
            label: t("income") + " (EUR)",
            color: "#8cc44d",
            isBar: false,
          },
        ];
      case "proporcion para uso personal":
        return [
          {
            name: "SelfUse",
            label: t("selfUse") + " (kWh)",
            color: "#8cc44d",
            isBar: true,
          },
          {
            name: "SelfUseRatio",
            label: t("selfUseRatio") + " (%)",
            color: "#4CC7B3",
            isBar: false,
          },
        ];
      default:
        return [
          {
            name: "ContributionIndex",
            label: t("contributionIndex"),
            color: "#03bbd6",
            isBar: true,
          },
        ];
    }
  }, [t, chartIndexId]);

  const expectedMetrics = useMemo(
    () => getExpectedMetrics(),
    [getExpectedMetrics]
  );

  const transformedData = useMemo(() => {
    if (chartIndexId === "estadisticas sobre energia") {
      const modelData = graphData?.data?.data?.modelData || {};
      return {
        "Salida de CA": [
          {
            name: t("Interno"),
            value: modelData["in_House"] || 0,
            unit: "kWh",
          },
          { name: t("Alimentar"), value: modelData["buy"] || 0, unit: "kWh" },
        ],
        "Consumo de carga": [
          {
            name: t("PV+BAT"),
            value: modelData["selfUseOfPv"] || 0,
            unit: "kWh",
          },
          {
            name: t("Red"),
            value: modelData["consumptionOfLoad"] || 0,
            unit: "kWh",
          },
        ],
      };
    }

    const validData = graphData?.data?.data;
    if (!validData?.lines?.length) return [];

    return validData.lines[0].xy.map((point, index) => {
      const dataPoint = { date: point.x };
      validData.lines.forEach((line) => {
        if (line.xy[index]) {
          dataPoint[line.name] = line.xy[index].y;
        }
      });
      return dataPoint;
    });
  }, [graphData?.data?.data, chartIndexId, t]);

  const renderPieChart = useCallback(
    (chartData, title) => {
      const isEmpty = chartData.every(
        (entry) => entry.value === 0 || entry.value === null
      );

      const placeholderData = [
        { name: t("NoData"), value: 1, color: "#d3d3d3" },
      ];
      const totalValue = chartData.reduce((sum, entry) => sum + entry.value, 0);

      return (
        <div
          key={`piechart-${title}`}
          className="flex flex-col items-center p-4"
        >
          <h2 className="text-lg font-semibold mb-4 text-custom-dark-blue dark:text-custom-yellow">
            {title}
          </h2>
          <div className="flex flex-col xl:flex-row items-center justify-center gap-8">
            <ResponsiveContainer width={300} height={!isDesktop ? 250 : 350}>
              <PieChart>
                <Pie
                  data={isEmpty ? placeholderData : chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 110 : 120}
                  label={null}
                >
                  {(isEmpty ? placeholderData : chartData).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${title}-${index}`}
                        fill={entry.color || COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {(isEmpty ? placeholderData : chartData).map((entry, index) => {
                const percentage = totalValue
                  ? ((entry.value / totalValue) * 100).toFixed(1)
                  : 0;
                return (
                  <div
                    key={`legend-${title}-${index}`}
                    className="flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    <div
                      style={{
                        backgroundColor: isEmpty
                          ? "#d3d3d3"
                          : COLORS[index % COLORS.length],
                      }}
                      className="w-4 h-4"
                    ></div>
                    <span className="text-custom-dark-blue dark:text-custom-yellow">
                      {entry.name}: {entry.value.toFixed(2)} {entry.unit} (
                      {percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    },
    [isDesktop, isMobile, t]
  );

  const renderContent = useCallback(() => {
    const validData = graphData?.data?.data;
    const hasValidLines = validData?.lines?.length > 0;

    if (isLoading || !graphData?.data?.data) {
      return <Loading />;
    }

    if (chartIndexId === "estadisticas sobre energia" && transformedData) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(transformedData).map(([title, chartData]) =>
            renderPieChart(chartData, t(title))
          )}
        </div>
      );
    }

    if (!hasValidLines) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-gray-500 text-lg">{t("noDataAvailable")}</h2>
        </div>
      );
    }

    return (
      <ComposedChart
        key={`${range}-${chartIndexId}`}
        data={transformedData}
        margin={{
          left: isMobile ? -15 : 15,
          right: isMobile ? -25 : 15,
          top: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        {validData.axis?.map((ax) => (
          <YAxis
            key={`y-axis-${ax.axisId}`}
            yAxisId={ax.axisId}
            domain={[0, "auto"]}
            unit={isMobile ? "" : ax.unit}
            orientation={ax.axisId === 0 ? "left" : "right"}
            label={{
              value: isMobile ? ax.unit : "",
              angle: -90,
              position: "insideLeft",
              offset: 20,
              dy: -20,
            }}
          />
        ))}
        <Tooltip />
        <Legend />
        {chartIndexId === "estadisticas sobre energia"
          ? expectedMetrics.map((metric) => (
              <Bar
                key={metric.name}
                dataKey={metric.name}
                fill={metric.color}
                name={metric.label}
                stackId="stack"
              />
            ))
          : validData.lines.map((line, index) =>
              index % 2 === 0 ? (
                <Bar
                  key={line.name}
                  dataKey={line.name}
                  fill={line.frontColor}
                  yAxisId={line.axis}
                  name={line.label}
                  opacity={0.8}
                />
              ) : (
                <Line
                  key={line.name}
                  type="monotone"
                  dataKey={line.name}
                  stroke={line.frontColor}
                  strokeWidth={2}
                  name={line.label}
                  yAxisId={line.axis}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )
            )}
      </ComposedChart>
    );
  }, [
    graphData?.data?.data,
    isLoading,
    chartIndexId,
    transformedData,
    range,
    expectedMetrics,
    isMobile,
    t,
    renderPieChart,
  ]);

  return (
    <>
      {isLoading ? (
        <GoodweGraphDisplaySkeleton theme={theme} />
      ) : (
        <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow text-left">
                {title}
              </h2>
              <button
                onClick={handleFetchGraph}
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
            <div className="flex gap-4 mt-4 md:mt-0 w-full md:w-auto">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm w-auto"
                disabled={isLoading}
              >
                <option value="dia">{t("day")}</option>
                <option value="mes">{t("month")}</option>
                <option value="año">{t("year")}</option>
              </select>
              <select
                value={chartIndexId}
                onChange={(e) => setChartIndexId(e.target.value)}
                className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm w-auto"
                disabled={isLoading}
              >
                <option value="generacion de energia y ingresos">
                  {t("energyAndIncome")}
                </option>
                <option value="proporcion para uso personal">
                  {t("personalUse")}
                </option>
                <option value="indice de contribucion">
                  {t("contributionIndex")}
                </option>
                <option value="estadisticas sobre energia">
                  {t("energyStatistics")}
                </option>
              </select>
            </div>
          </div>
          <ResponsiveContainer
            width="100%"
            height={
              chartIndexId === "estadisticas sobre energia" && isMobile
                ? "auto"
                : 400
            }
          >
            {renderContent()}
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default GoodweGraphDisplay;
