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
import { BiDotsVerticalRounded, BiRefresh } from "react-icons/bi";
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
import GoodweGraphDisplaySkeleton from "@/components/loadingSkeletons/GoodweGraphDisplaySkeleton";
import { selectTheme } from "@/store/slices/themeSlice";
import CustomSelect from "../ui/CustomSelect";
import ExportModal from "../ExportModal";
import DateSelector from "../DateSelector";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BsCalendar3 } from "react-icons/bs";

const GoodweGraphDisplay = ({ plantId, title, onValueUpdate }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [range, setRange] = useState("dia");
  const [chartIndexId, setChartIndexId] = useState("potencia");
  const [isInitialized, setIsInitialized] = useState(false);
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const graphError = useSelector(selectGraphError);
  const user = useSelector(selectUser);
  const currentDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const { isMobile, isDesktop } = useDeviceType();
  const theme = useSelector(selectTheme);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);

  const handleFetchGraph = useCallback(async () => {
    if (plantId && user?.tokenIdentificador && selectedDate) {
      try {
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
      }
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

  const transformedData = useMemo(() => {
    if (!graphData?.data?.data) return []; // Handle empty data gracefully

    if (chartIndexId === "potencia") {
      const lines = graphData?.data?.data?.lines || [];
      if (!lines.length) return []; // No data available

      // Current time
      const now = new Date();
      const currentHour = now.getHours();

      // Combine all the lines into a single array for the graph
      const combinedData = lines[0].xy.map((point, index) => {
        const dataPoint = { time: point.x }; // X-axis data
        lines.forEach((line) => {
          if (line.xy[index]) {
            dataPoint[line.key] = line.xy[index].y; // Y-axis data for each line
          }
        });
        return dataPoint;
      });

      // Get last timestamp from data (e.g., 00:00 - 23:00)
      const lastTimestamp = combinedData[combinedData.length - 1]?.time;

      // Extend to the current hour if data is missing
      const extendedData = [...combinedData];
      if (lastTimestamp) {
        const startTime = new Date(`${currentDate}T${lastTimestamp}:00`);
        for (let hour = startTime.getHours() + 1; hour <= currentHour; hour++) {
          const timeLabel = hour.toString().padStart(2, "0") + ":00";
          extendedData.push({
            time: timeLabel, // Add new time labels
            ...lines.reduce((acc, line) => {
              acc[line.key] = 0; // Fill missing data with 0
              return acc;
            }, {}),
          });
        }
      }

      return extendedData;
    }

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

    if (chartIndexId === "generacion de energia y ingresos") {
      const lines = graphData?.data?.data?.lines || [];
      if (!lines.length) return []; // No data available

      return lines[0].xy.map((point, index) => {
        const dataPoint = { date: point.x };
        lines.forEach((line) => {
          if (line.xy[index]) {
            dataPoint[line.name] = line.xy[index].y;
          }
        });
        return dataPoint;
      });
    }

    const validData = graphData?.data?.data?.lines || [];
    if (!validData.length) return []; // Handle no valid data gracefully

    return validData[0].xy.map((point, index) => {
      const dataPoint = { date: point.x };
      validData.forEach((line) => {
        if (line.xy[index]) {
          dataPoint[line.name] = line.xy[index].y;
        }
      });
      return dataPoint;
    });
  }, [graphData?.data?.data, chartIndexId, t]);

  // console.log("graphData: ", graphData);

  const getBarOrLineColor = (lineName) => {
    switch (chartIndexId) {
      case "generacion de energia y ingresos":
        if (lineName === "PVGeneration")
          return theme === "dark" ? "#AD936A" : "#9CA3AF";
        if (lineName === "Income")
          return theme === "dark" ? "#FFD57B" : "#0B2738";
        break;

      case "proporcion para uso personal":
        if (lineName === "SelfUse")
          return theme === "dark" ? "#FFD57B" : "#AD936A";
        if (lineName === "SelfUseRatio")
          return theme === "dark" ? "#BDBFC0" : "#0B2738";
        if (lineName === "PVGeneration")
          return theme === "dark" ? "#AD936A" : "#9CA3AF";
        if (lineName === "Sell")
          return theme === "dark" ? "#657880" : "#FFD57B";
        break;

      case "indice de contribucion":
        if (lineName === "Consumption")
          return theme === "dark" ? "#FFD57B" : "#9CA3AF";
        if (lineName === "Buy") return theme === "dark" ? "#BDBFC0" : "#FFD57B";
        if (lineName === "ContributionRatio")
          return theme === "dark" ? "#AD936A" : "#AD936A";
        if (lineName === "SelfUse")
          return theme === "dark" ? "#657880" : "#0B2738";
        break;

      default:
        return "#d3d3d3";
    }
  };

  const getPotenciaLineColor = (lineName, theme) => {
    if (!lineName || typeof lineName !== "string") {
      console.warn("Invalid lineName:", lineName);
      return "#d3d3d3"; // Default color for invalid line names
    }

    const sanitizedLineName = lineName.replace("PCurve_Power_", ""); // Remove prefix
    const colorMap = {
      PV: theme === "dark" ? "#FFD57B" : "#BDBFC0",
      Battery: theme === "dark" ? "#A48D67" : "#0B2738",
      Meter: theme === "dark" ? "#657880" : "#FFD57B",
      Load: theme === "dark" ? "#BDBFC0" : "#9CA3AF",
      SOC: theme === "dark" ? "#9CA3AF" : "#AD936A",
    };

    return colorMap[sanitizedLineName] || "#d3d3d3"; // Default color for unknown keys
  };

  const getPieChartColor = (dataKey) => {
    const trimmedKey = dataKey.trim(); // Trim leading/trailing spaces
    switch (trimmedKey) {
      case "Red":
        return theme === "dark" ? "#FFD57B" : "#FFD57B";
      case "Interno":
        return theme === "dark" ? "#657880" : "#0B2738";
      case "PV+BAT":
        return theme === "dark" ? "#657880" : "#0B2738";
      case "Alimentar":
        return theme === "dark" ? "#FFD57B" : "#FFD57B";
      default:
        console.warn(`Unknown dataKey: "${trimmedKey}"`);
        return "#d3d3d3";
    }
  };

  const handleExportCSV = () => {
    if (!transformedData || !transformedData.length) {
      console.warn("No data available for export.");
      return;
    }

    const exportData = transformedData.map((item) => ({
      ...item,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(exportData[0]).join(","), // Headers
        ...exportData.map((row) => Object.values(row).join(",")), // Rows
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${chartIndexId}-graph-data.csv`);
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);

    setIsModalOpen(false); // Close modal after export
  };

  return (
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
          {chartIndexId === "potencia" ? (
            <div className="relative">
              {/* Button to trigger DateSelector */}
              <button
                onClick={() => setIsDateSelectorOpen((prev) => !prev)}
                className="font-secondary dark:border dark:border-gray-200/50 text-md flex gap-4 items-center text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 hover:bg-custom-light-gray dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow h-full"
              >
                <span>
                  {selectedDate
                    ? format(selectedDate, "dd/MM/yyyy", { locale: es })
                    : t("dateAll")}
                </span>
                <BsCalendar3 />
              </button>

              {/* DateSelector Component */}
              {isDateSelectorOpen && (
                <DateSelector
                  isOpen={isDateSelectorOpen}
                  onClose={() => setIsDateSelectorOpen(false)}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsDateSelectorOpen(false);

                    // Update graph data based on selected date
                    handleFetchGraph();
                  }}
                  value={selectedDate}
                />
              )}
            </div>
          ) : (
            <CustomSelect
              value={range}
              onChange={(selectedValue) => setRange(selectedValue)}
              options={[
                { value: "dia", label: "day" },
                { value: "mes", label: "month" },
                { value: "año", label: "year" },
              ]}
            />
          )}

          <CustomSelect
            value={chartIndexId}
            onChange={(selectedValue) => setChartIndexId(selectedValue)}
            options={[
              {
                value: "potencia",
                label: "power",
              },
              {
                value: "generacion de energia y ingresos",
                label: "energyAndIncome",
              },
              {
                value: "proporcion para uso personal",
                label: "personalUse",
              },
              {
                value: "indice de contribucion",
                label: "contributionIndex",
              },
              {
                value: "estadisticas sobre energia",
                label: "energyStatistics",
              },
            ]}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <BiDotsVerticalRounded className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
          </button>
        </div>
      </div>
      {isLoading ? (
        <GoodweGraphDisplaySkeleton theme={theme} />
      ) : chartIndexId === "potencia" && transformedData ? (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
            <XAxis
              dataKey="time"
              tickFormatter={(value) => {
                const [hour] = value.split(":");
                return `${hour}:00`; // Ensures consistent hour formatting
              }}
            />
            <YAxis />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-white dark:bg-gray-800 border rounded shadow-md">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                        {label}
                      </p>
                      {payload.map((entry, index) => {
                        const sanitizedName = entry.name.replace(
                          "PCurve_Power_",
                          ""
                        );
                        const formattedName = sanitizedName
                          .replace("PV", "PV(W)")
                          .replace("Battery", "Batería(W)")
                          .replace("Meter", "Medidor(W)")
                          .replace("Load", "Carga(W)")
                          .replace("SOC", "SOC(%)");

                        const resolvedColor =
                          chartIndexId === "potencia"
                            ? getPotenciaLineColor(entry.name, theme)
                            : getBarOrLineColor(entry.name, theme);

                        return (
                          <div key={`tooltip-item-${index}`} className="mb-1">
                            <span
                              style={{
                                color: resolvedColor,
                                fontWeight: "bold",
                              }}
                            >
                              {formattedName}:
                            </span>{" "}
                            <span
                              style={{
                                color: theme === "dark" ? "#FFF" : "#000",
                              }}
                            >
                              {entry.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
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

                const resolvedColor =
                  chartIndexId === "potencia"
                    ? getPotenciaLineColor(value, theme)
                    : getBarOrLineColor(value, theme);

                return (
                  <span style={{ color: resolvedColor }}>{formattedValue}</span>
                );
              }}
            />

            {graphData?.data?.data?.lines?.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key} // Use the line's key
                stroke={
                  chartIndexId === "potencia"
                    ? getPotenciaLineColor(line.key, theme)
                    : getBarOrLineColor(line.name)
                }
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <>
          <ResponsiveContainer
            width="100%"
            height={
              chartIndexId === "estadisticas sobre energia" && isMobile
                ? "auto"
                : 400
            }
          >
            {chartIndexId === "estadisticas sobre energia" &&
            transformedData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(transformedData).map(([title, chartData]) => {
                  const totalValue = chartData.reduce(
                    (sum, entry) => sum + entry.value,
                    0
                  );

                  return (
                    <div
                      key={`piechart-${title}`}
                      className="flex flex-col items-center p-4"
                    >
                      <h2 className="text-lg font-semibold mb-4 text-custom-dark-blue dark:text-custom-yellow">
                        {t(title)}
                      </h2>
                      <div className="flex flex-col xl:flex-row items-center justify-center gap-8">
                        <ResponsiveContainer
                          width={300}
                          height={!isDesktop ? 250 : 350}
                        >
                          <PieChart>
                            <Pie
                              data={chartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={isMobile ? 110 : 120}
                              label={null}
                            >
                              {chartData.map((entry) => (
                                <Cell
                                  key={`cell-${entry.name}`}
                                  fill={getPieChartColor(entry.name)}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col gap-2">
                          {chartData.map((entry) => {
                            const percentage = totalValue
                              ? ((entry.value / totalValue) * 100).toFixed(1)
                              : 0;

                            return (
                              <div
                                key={`legend-${entry.name}`}
                                className="flex items-center gap-2 text-sm whitespace-nowrap"
                              >
                                <div
                                  style={{
                                    backgroundColor: getPieChartColor(
                                      entry.name
                                    ),
                                  }}
                                  className="w-4 h-4"
                                ></div>
                                <span className="text-custom-dark-blue dark:text-custom-yellow">
                                  {entry.name}: {entry.value.toFixed(2)}{" "}
                                  {entry.unit} ({percentage}%)
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
            ) : isLoading || !graphData?.data?.data ? (
              <Loading />
            ) : (
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
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                />
                {graphData?.data?.data?.axis?.map((ax) => (
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
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">
                            {label}
                          </p>
                          {payload.map((entry, index) => {
                            const sanitizedName = entry.name.replace(
                              "PCurve_Power_",
                              ""
                            );
                            const formattedName = sanitizedName
                              .replace("PV", "PV(W)")
                              .replace("Battery", "Batería(W)")
                              .replace("Meter", "Medidor(W)")
                              .replace("Load", "Carga(W)")
                              .replace("SOC", "SOC(%)");

                            const resolvedColor =
                              chartIndexId === "potencia"
                                ? getPotenciaLineColor(entry.name, theme)
                                : getBarOrLineColor(entry.name, theme);

                            return (
                              <div
                                key={`tooltip-item-${index}`}
                                className="flex items-center gap-2 mb-1"
                              >
                                <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-300">
                                  {formattedName}
                                </span>
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-200">
                                  {entry.value}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  formatter={(value, entry) => {
                    const resolvedColor =
                      entry.color ||
                      getPieChartColor(value) || // Customize for PieChart legends
                      getBarOrLineColor(value, 0); // Default for bars and lines

                    return (
                      <span
                        style={{
                          color: resolvedColor,
                        }}
                      >
                        {t(value)}
                      </span>
                    );
                  }}
                />

                {/* Render bars first */}
                {graphData?.data?.data?.lines?.map(
                  (line, index) =>
                    index % 2 === 0 && (
                      <Bar
                        key={line.name}
                        dataKey={line.name}
                        fill={getBarOrLineColor(line.name, index)}
                        yAxisId={line.axis}
                        name={line.label}
                        opacity={0.8}
                      />
                    )
                )}

                {/* Render lines on top */}
                {graphData?.data?.data?.lines?.map(
                  (line, index) =>
                    index % 2 !== 0 && (
                      <Line
                        key={line.name}
                        type="monotone"
                        dataKey={line.name}
                        stroke={getBarOrLineColor(line.name, index)}
                        strokeWidth={3}
                        name={line.label}
                        yAxisId={line.axis}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    )
                )}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </>
      )}
      {isModalOpen && (
        <ExportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onExport={handleExportCSV}
          t={t}
          isLoading={isLoading}
          hasData={transformedData?.length > 0}
        />
      )}
    </div>
  );
};

export default GoodweGraphDisplay;
