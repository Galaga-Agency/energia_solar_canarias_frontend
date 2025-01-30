import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const DEFAULT_CHART_DATA = {
  "Salida de CA": [
    { name: "Interno", value: 0, unit: "kWh" },
    { name: "Alimentar", value: 0, unit: "kWh" },
  ],
  "Consumo de carga": [
    { name: "PV+BAT", value: 0, unit: "kWh" },
    { name: "Red", value: 0, unit: "kWh" },
  ],
};

const EnergyStatisticsGraph = ({ data, theme }) => {
  const transformedData = React.useMemo(() => {
    if (!data?.modelData) return DEFAULT_CHART_DATA;

    const result = {
      "Salida de CA": [
        {
          name: "Interno",
          value: data.modelData["in_House"] || 0,
          unit: "kWh",
        },
        {
          name: "Alimentar",
          value: data.modelData["sell"] || 0,
          unit: "kWh",
        },
      ],
      "Consumo de carga": [
        {
          name: "PV+BAT",
          value: data.modelData["selfUseOfPv"] || 0,
          unit: "kWh",
        },
        {
          name: "Red",
          value: data.modelData["buy"] || 0,
          unit: "kWh",
        },
      ],
    };

    // If all values are 0, return the default data structure
    const allZero = Object.values(result).every((chartData) =>
      chartData.every((item) => !item.value)
    );

    return allZero ? DEFAULT_CHART_DATA : result;
  }, [data]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(transformedData).map(([title, chartData]) => {
          const hasData = chartData.some((item) => item.value > 0);
          const totalValue = chartData.reduce(
            (sum, entry) => sum + entry.value,
            0
          );

          // Even with no data, we still want to show the pie sections
          // We'll create a special empty data structure that shows equal sections
          const emptyPieData = chartData.map((item) => ({
            ...item,
            value: 1, // Equal sections for visual display only
          }));

          return (
            <div
              key={`piechart-${title}`}
              className="flex flex-col items-center p-4"
            >
              <h2 className="text-lg font-semibold mb-4 text-custom-dark-blue dark:text-custom-yellow">
                {title}
              </h2>
              <div className="flex flex-col xl:flex-row items-center justify-center gap-8">
                <ResponsiveContainer width={300} height={300}>
                  <PieChart>
                    <Pie
                      data={hasData ? chartData : emptyPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={null}
                    >
                      {(hasData ? chartData : emptyPieData).map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={
                            hasData
                              ? theme === "dark"
                                ? entry.name === "Interno" ||
                                  entry.name === "PV+BAT"
                                  ? "#657880"
                                  : "#FFD57B"
                                : entry.name === "Interno" ||
                                  entry.name === "PV+BAT"
                                ? "#0B2738"
                                : "#FFD57B"
                              : "#E5E7EB" // Light grey for empty state
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2">
                  {chartData.map((entry) => {
                    const percentage = totalValue
                      ? ((entry.value / totalValue) * 100).toFixed(1)
                      : "0.0";

                    return (
                      <div
                        key={`legend-${entry.name}`}
                        className="flex items-center gap-2 text-sm whitespace-nowrap"
                      >
                        <div
                          className="w-4 h-4"
                          style={{
                            backgroundColor: hasData
                              ? theme === "dark"
                                ? entry.name === "Interno" ||
                                  entry.name === "PV+BAT"
                                  ? "#657880"
                                  : "#FFD57B"
                                : entry.name === "Interno" ||
                                  entry.name === "PV+BAT"
                                ? "#0B2738"
                                : "#FFD57B"
                              : "#E5E7EB",
                          }}
                        />
                        <span
                          className={`text-custom-dark-blue dark:text-custom-yellow ${
                            !hasData ? "opacity-50" : ""
                          }`}
                        >
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
        })}
      </div>
    </div>
  );
};

export default EnergyStatisticsGraph;
