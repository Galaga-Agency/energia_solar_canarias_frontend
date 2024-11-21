import React, { useEffect, useMemo } from "react";
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
} from "recharts";
import { BiRefresh } from "react-icons/bi";
import Loading from "./Loading";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { clearGraphData } from "@/store/slices/plantsSlice";

const GraphDisplay = ({
  data,
  title,
  range,
  setRange,
  chartIndexId,
  setChartIndexId,
  isLoading,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const updateRange = (newRange) => {
    if (range !== newRange) {
      setRange(newRange);
      onRefresh();
    }
  };

  const updateChartIndexId = (newChartIndex) => {
    if (chartIndexId !== newChartIndex) {
      setChartIndexId(newChartIndex);
      onRefresh();
    }
  };

  useEffect(() => {
    if (!data || data?.data?.data?.lines?.length === 0) {
      onRefresh();
    }
  }, [chartIndexId, range, onRefresh]);

  const generateEmptyData = () => {
    const metrics = getExpectedMetrics();
    return Array.from({ length: 31 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      ...metrics.reduce(
        (acc, metric) => ({
          ...acc,
          [metric.name]: 0,
        }),
        {}
      ),
    }));
  };

  const getExpectedMetrics = () => {
    switch (chartIndexId) {
      case "estadisticas sobre energia":
        return [
          {
            name: "PV+BAT",
            label: t("pvBat"),
            color: "#03bbd6",
            isBar: true,
          },
          {
            name: "Red",
            label: t("grid"),
            color: "#ffa726",
            isBar: true,
          },
          {
            name: "Interno",
            label: t("internal"),
            color: "#4CC7B3",
            isBar: true,
          },
          {
            name: "Alimentar",
            label: t("feed"),
            color: "#8cc44d",
            isBar: true,
          },
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
  };

  const expectedMetrics = useMemo(() => getExpectedMetrics(), [chartIndexId]);

  const transformedData = useMemo(() => {
    const validData = data?.data?.data;
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
  }, [data, chartIndexId]);

  const renderContent = () => {
    const validData = data?.data?.data;
    const hasValidLines = validData?.lines?.length > 0;

    if (isLoading || !data?.data?.data) {
      return <Loading />;
    }

    if (!isLoading && !hasValidLines) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-gray-500 text-lg">{t("noDataAvailable")}</h2>
        </div>
      );
    }

    return (
      <ComposedChart
        data={transformedData}
        margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        {validData.axis?.map((ax) => (
          <YAxis
            key={ax.axisId}
            yAxisId={ax.axisId}
            domain={[0, "auto"]}
            unit={ax.unit}
            orientation={ax.axisId === 0 ? "left" : "right"}
            label={{
              value: "",
              angle: -90,
              position: "insideLeft",
              offset: 10,
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
  };

  return (
    <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
            {title}
          </h2>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <BiRefresh
              className={`text-2xl text-custom-dark-blue dark:text-custom-yellow ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
        <div className="flex gap-4">
          <select
            value={range}
            onChange={(e) => updateRange(e.target.value)}
            className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm"
            disabled={isLoading}
          >
            <option value="dia">{t("day")}</option>
            <option value="mes">{t("month")}</option>
            <option value="año">{t("year")}</option>
          </select>
          <select
            value={chartIndexId}
            onChange={(e) => updateChartIndexId(e.target.value)}
            className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm"
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
      <ResponsiveContainer width="100%" height={400}>
        {renderContent()}
      </ResponsiveContainer>
    </div>
  );
};

export default GraphDisplay;
