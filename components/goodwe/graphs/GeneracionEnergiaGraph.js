import React from "react";
import { useTranslation } from "next-i18next";
import {
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  ResponsiveContainer,
} from "recharts";
import CustomTooltipGraph from "../CustomTooltipGraph";
import NoDataErrorState from "@/components/NoDataErrorState";

const getColors = (theme) => ({
  PVGeneration: theme === "dark" ? "#AD936A" : "#9CA3AF",
  Income: theme === "dark" ? "#FFD57B" : "#0B2738",
});

const GeneracionEnergiaGraph = ({
  data,
  theme,
  isMobile,
  isError,
  onRetry,
  onSelectRange,
}) => {
  const { t } = useTranslation();

  const transformedData = React.useMemo(() => {
    if (!data?.lines?.length) return null;

    const formattedData = data.lines[0].xy.map((point, index) => {
      const dataPoint = { date: point.x };
      data.lines.forEach((line) => {
        if (line.xy[index]) {
          dataPoint[line.name] = line.xy[index].y;
        }
      });
      return dataPoint;
    });

    // Check if all data values are 0 or missing
    const allZero = formattedData.every((entry) =>
      Object.values(entry).every((value) => value === 0 || value === null)
    );

    return allZero ? null : formattedData;
  }, [data]);

  if (isError) {
    return (
      <NoDataErrorState
        isError={true}
        onRetry={onRetry}
        onSelectRange={onSelectRange}
      />
    );
  }

  if (!transformedData || transformedData == []) {
    return (
      <NoDataErrorState
        isError={isError}
        onRetry={onRetry}
        onSelectRange={onSelectRange}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: "600px" }}>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={transformedData}
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
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            {data?.axis?.map((ax) => (
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
            <Tooltip
              content={
                <CustomTooltipGraph chartType="generacion" theme={theme} />
              }
            />
            <Legend
              formatter={(value) => {
                const formattedValue = value
                  .replace("PVGeneration", "PV(W)")
                  .replace("Income", "Ingreso(€)");

                return (
                  <span style={{ color: getColors(theme)[value] }}>
                    {t(formattedValue)}
                  </span>
                );
              }}
            />

            <Bar
              dataKey="PVGeneration"
              fill={getColors(theme).PVGeneration}
              yAxisId={0}
              name={t("PVGeneration")}
              opacity={0.8}
            />
            <Line
              type="monotone"
              dataKey="Income"
              stroke={getColors(theme).Income}
              yAxisId={1}
              name={t("Income")}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GeneracionEnergiaGraph;
