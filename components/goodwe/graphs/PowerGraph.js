import React from "react";
import { useTranslation } from "next-i18next";
import {
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";
import CustomTooltipGraph from "../CustomTooltipGraph";

const getColors = (theme) => ({
  PV: theme === "dark" ? "#FFD57B" : "#BDBFC0",
  Battery: theme === "dark" ? "#BDBFC0" : "#0B2738",
  Meter: theme === "dark" ? "#657880" : "#FFD57B",
  Load: theme === "dark" ? "#A48D67" : "#9CA3AF",
  SOC: theme === "dark" ? "#9CA3AF" : "#AD936A",
});

const PowerGraph = ({ data, theme, isMobile }) => {
  const { t } = useTranslation();

  const getPotenciaLineColor = (lineName) => {
    if (!lineName || typeof lineName !== "string") return "#d3d3d3";
    const sanitizedLineName = lineName.replace("PCurve_Power_", "");
    return getColors(theme)[sanitizedLineName] || "#d3d3d3";
  };

  const transformedData = React.useMemo(() => {
    if (!data?.lines?.[0]?.xy) return [];

    const now = new Date();
    const currentHour = now.getHours();
    const currentDate = now.toISOString().split("T")[0];

    const combinedData = data.lines[0].xy.map((point, index) => {
      const dataPoint = { time: point.x };
      data.lines.forEach((line) => {
        if (line.xy[index]) {
          dataPoint[line.key] = line.xy[index].y;
        }
      });
      return dataPoint;
    });

    const lastTimestamp = combinedData[combinedData.length - 1]?.time;
    if (!lastTimestamp) return combinedData;

    const startTime = new Date(`${currentDate}T${lastTimestamp}:00`);
    const extendedData = [...combinedData];

    for (let hour = startTime.getHours() + 1; hour <= currentHour; hour++) {
      const timeLabel = hour.toString().padStart(2, "0") + ":00";
      extendedData.push({
        time: timeLabel,
        ...data.lines.reduce((acc, line) => {
          acc[line.key] = 0;
          return acc;
        }, {}),
      });
    }

    return extendedData;
  }, [data]);

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
              dataKey="time"
              tickFormatter={(value) => {
                const [hour] = value.split(":");
                return `${hour}:00`;
              }}
            />
            <YAxis />
            <Tooltip
              content={
                <CustomTooltipGraph
                  chartType="potencia"
                  theme={theme}
                  getPotenciaLineColor={getPotenciaLineColor}
                />
              }
            />
            <Legend
              formatter={(value) => {
                const sanitizedValue = value.replace("PCurve_Power_", "");
                const formattedValue = sanitizedValue
                  .replace("PV", "PV(W)")
                  .replace("Battery", "Batería(W)")
                  .replace("Meter", "Medidor(W)")
                  .replace("Load", "Carga(W)")
                  .replace("SOC", "SOC(%)");

                return (
                  <span style={{ color: getPotenciaLineColor(value) }}>
                    {t(formattedValue)}
                  </span>
                );
              }}
            />
            {data?.lines?.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={getPotenciaLineColor(line.key)}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PowerGraph;
