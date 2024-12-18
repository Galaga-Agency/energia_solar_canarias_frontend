import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BiDotsVerticalRounded, BiRefresh } from "react-icons/bi";
import BatteryChargingGraphSkeleton from "@/components/loadingSkeletons/BatteryChargingGraphSkeleton";
import { useTranslation } from "react-i18next";
import {
  clearGraphData,
  selectBatteryChargingState,
  selectBatteryChargingLoading,
  selectBatteryChargingError,
  fetchBatteryChargingState,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import useCSVExport from "@/hooks/useCSVExport";
import ExportModal from "@/components/ExportModal";
import { Info } from "lucide-react";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

const BatteryChargingGraph = ({ token, plantId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const batteryData = useSelector(selectBatteryChargingState);
  const isLoading = useSelector(selectBatteryChargingLoading);
  const batteryError = useSelector(selectBatteryChargingError);
  const theme = useSelector(selectTheme);
  const { downloadCSV } = useCSVExport();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  useEffect(() => {
    return () => {
      dispatch(clearGraphData());
    };
  }, [dispatch]);

  useEffect(() => {
    const formatDateForBatteryGraph = (date) => {
      return date ? date.toISOString().slice(0, 10) : undefined;
    };

    if (plantId && token) {
      const now = new Date();
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(now.getDate() - 2);

      const params = {
        plantId,
        startDate: formatDateForBatteryGraph(twoDaysAgo),
        endDate: formatDateForBatteryGraph(now),
        token,
      };

      dispatch(fetchBatteryChargingState(params)).then(() => {
        setLastUpdateTime(new Date().toLocaleString());
      });
    }
  }, [plantId, token, dispatch]);

  const processedData = useMemo(() => {
    const telemetries = batteryData?.storageData?.batteries?.[0]?.telemetries;

    console.log("Raw telemetries:", telemetries);

    if (!telemetries || !telemetries.length) return [];

    // Take every 30th reading instead of filtering by timestamp
    return telemetries
      .filter((_, index) => index % 5 === 0) // Take every 5th reading for a cleaner graph
      .map((reading) => ({
        date: new Date(reading.timeStamp).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        }),
        time: new Date(reading.timeStamp).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        batteryPercentageState: reading.batteryPercentageState,
      }));
  }, [batteryData]);

  const handleExportCSV = () => {
    const exportData = processedData.map((item) => ({
      "Hora de medición": item.date,
      "Estado de Carga (%)": item.batteryState,
    }));

    downloadCSV(exportData, "battery_charging_data.csv");
    setIsModalOpen(false);
  };

  const handleRefresh = () => {
    if (!plantId || !token) {
      console.error("Missing plantId or token!");
      return;
    }

    const now = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(now.getDate() - 2);

    const params = {
      plantId,
      startDate: twoDaysAgo.toISOString().slice(0, 10),
      endDate: now.toISOString().slice(0, 10),
      token,
    };

    dispatch(fetchBatteryChargingState(params)).then(() => {
      setLastUpdateTime(new Date().toLocaleString());
    });
  };

  return (
    <div className="w-full bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-custom-dark-blue dark:text-custom-yellow">
            {t("batteryChargingState")}
          </h2>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <BiRefresh
              className={`text-2xl text-custom-dark-blue dark:text-custom-yellow mb-1 ${
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
      {lastUpdateTime && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {t("lastUpdate")}: {lastUpdateTime}
        </span>
      )}

      {/* Content Section */}
      {isLoading ? (
        <BatteryChargingGraphSkeleton theme={theme} />
      ) : !processedData.length || batteryError ? (
        <div>
          <div className="flex flex-col items-center justify-center pb-4 px-8 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-500 dark:text-gray-400">
                {t("noDataAvailable")}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={[]}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#E0E0E0" : "rgb(161, 161, 170)"}
                  opacity={theme === "dark" ? 0.5 : 1}
                />
                <XAxis dataKey="date" tickFormatter={() => ""} />
                <YAxis domain={[0, 100]} />
                <Tooltip content={() => null} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={processedData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#E0E0E0" : "rgb(161, 161, 170)"}
                opacity={theme === "dark" ? 0.5 : 1}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                interval={0} // Display all unique ticks
                tickFormatter={(value, index) => {
                  // Only show the date for the first occurrence of each day
                  const previousDate = processedData[index - 1]?.date;
                  return previousDate === value ? "" : value;
                }}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;
                  const { date, time, batteryPercentageState } =
                    payload[0].payload;
                  return (
                    <div
                      className={`p-3 rounded-md shadow-md ${
                        theme === "dark"
                          ? "bg-gray-800 text-gray-200 border-gray-700"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                    >
                      <p className="font-semibold">
                        {t("date")}: {date}
                      </p>
                      <p>
                        {t("time")}: {time}
                      </p>
                      <p>
                        {t("batteryState")}: {batteryPercentageState}%
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="batteryPercentageState"
                stroke="#4CAF50"
                fill="#4CAF50"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Export Modal */}
      {isModalOpen && (
        <ExportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onExport={handleExportCSV}
          t={t}
          isLoading={isLoading}
          hasData={processedData?.length > 0}
        />
      )}
    </div>
  );
};

export default BatteryChargingGraph;
