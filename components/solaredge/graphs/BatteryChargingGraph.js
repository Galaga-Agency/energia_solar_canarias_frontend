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
import CustomTooltipBattery from "@/components/solaredge/tooltips/CustomTooltipBattery";
import NoDataErrorState from "@/components/NoDataErrorState";
import { CiExport } from "react-icons/ci";

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

    // console.log("Raw telemetries:", telemetries);

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
    <div className="w-full bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm relative">
      {/* Header Section */}
      <div className="flex flex-col mb-6">
        <div className="flex flex-col md:gap-2 w-full">
          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4 md:mb-0 max-w-[70%]">
            {t("batteryChargingState")}
          </h2>
          {lastUpdateTime && (
            <span className="text-sm text-gray-500 dark:text-gray-400 max-w-[70%]">
              {t("lastUpdate")}: {lastUpdateTime}
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="absolute top-4 right-16 w-10 h-10 p-2 bg-white hover:bg-white/50 transition-all duration-300 dark:bg-custom-dark-blue hover:dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow"
        >
          <BiRefresh
            className={`text-3xl text-custom-dark-blue dark:text-custom-yellow ${
              isLoading ? "animate-spin" : ""
            }`}
          />
        </button>
        <button
          onClick={handleExportCSV}
          className="absolute right-4 top-4 w-10 h-10 p-2 bg-white hover:bg-white/50 transition-all duration-300 dark:bg-custom-dark-blue hover:dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow"
        >
          <CiExport className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
        </button>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <BatteryChargingGraphSkeleton theme={theme} />
      ) : batteryError || !processedData.length ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <NoDataErrorState
            isError={!!batteryError}
            onRetry={handleRefresh}
            onSelectRange={() => {
              handleRefresh();
            }}
          />
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
              <Tooltip content={<CustomTooltipBattery />} />

              <Area
                type="monotone"
                dataKey="batteryPercentageState"
                stroke={theme === "dark" ? " #BDBFC0" : "#0B2738"}
                fill={theme === "dark" ? "#657880" : "#758B95"}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default BatteryChargingGraph;
