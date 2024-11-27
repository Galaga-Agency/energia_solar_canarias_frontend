// SolarEdgeGraphDisplay.js
import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import useDeviceType from "@/hooks/useDeviceType";
import GraphDisplaySkeleton from "./LoadingSkeletons/GraphDisplaySkeleton";
import { selectTheme } from "@/store/slices/themeSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SolarEdgeGraphDisplay = ({ plantId, title }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [range, setRange] = useState("day");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chartType, setChartType] = useState("production-consumption");
  const graphData = useSelector(selectGraphData);
  const isLoading = useSelector(selectGraphLoading);
  const graphError = useSelector(selectGraphError);
  const user = useSelector(selectUser);
  const { isMobile, isDesktop } = useDeviceType();
  const theme = useSelector(selectTheme);

  const handleFetchGraph = useCallback(() => {
    if (plantId && user?.tokenIdentificador) {
      dispatch(
        fetchSolarEdgeGraphData({
          plantId,
          date: startDate.toISOString().split("T")[0],
          range,
          chartType,
          token: user.tokenIdentificador,
        })
      );
    }
  }, [
    dispatch,
    plantId,
    startDate,
    range,
    chartType,
    user?.tokenIdentificador,
  ]);

  useEffect(() => {
    handleFetchGraph();
  }, [handleFetchGraph]);

  useEffect(() => {
    return () => {
      dispatch(clearGraphData());
    };
  }, [dispatch]);

  const transformedData = useMemo(() => {
    const validData = graphData?.data?.data;
    if (!validData?.lines?.length) return [];

    return validData.lines.map((line) => ({
      date: line.xy.map((point) => point.x),
      [line.name]: line.xy.map((point) => point.y),
    }));
  }, [graphData?.data?.data]);

  return (
    <>
      {isLoading ? (
        <GraphDisplaySkeleton theme={theme} />
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
                <option value="day">{t("day")}</option>
                <option value="week">{t("week")}</option>
                <option value="month">{t("month")}</option>
                <option value="year">{t("year")}</option>
              </select>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm w-auto"
                disabled={isLoading}
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm w-auto"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-custom-dark-blue dark:text-custom-yellow">
                {t("production")}
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                {transformedData.length > 0 ? (
                  <ComposedChart
                    data={transformedData.filter(
                      (d) => d.PVGeneration !== undefined
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <YAxis
                      yAxisId="left"
                      unit="kWh"
                      label={{
                        value: "kWh",
                        angle: -90,
                        position: "insideLeft",
                        offset: 20,
                        dy: -20,
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="PVGeneration"
                      fill="#03bbd6"
                      name={t("energy")}
                    />
                  </ComposedChart>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-gray-500 text-lg">
                      {t("noDataAvailable")}
                    </h2>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-custom-dark-blue dark:text-custom-yellow">
                {t("consumption")}
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                {transformedData.length > 0 ? (
                  <ComposedChart
                    data={transformedData.filter(
                      (d) => d.consumptionOfLoad !== undefined
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <YAxis
                      yAxisId="left"
                      unit="kWh"
                      label={{
                        value: "kWh",
                        angle: -90,
                        position: "insideLeft",
                        offset: 20,
                        dy: -20,
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="consumptionOfLoad"
                      fill="#8cc44d"
                      name={t("consumption")}
                    />
                  </ComposedChart>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-gray-500 text-lg">
                      {t("noDataAvailable")}
                    </h2>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SolarEdgeGraphDisplay;
