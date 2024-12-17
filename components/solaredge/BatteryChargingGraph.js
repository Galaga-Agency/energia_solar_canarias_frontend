import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import BatteryChargingGraphSkeleton from "@/components/loadingSkeletons/BatteryChargingGraphSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";
import { useTranslation } from "react-i18next";
import {
  selectBatteryChargingState,
  selectBatteryChargingLoading,
  selectBatteryChargingError,
} from "@/store/slices/plantsSlice";

const BatteryChargingGraph = ({ data, isLoading, theme }) => {
  const { t } = useTranslation();

  const processedData = useMemo(() => {
    console.log("Processing battery data:", data);
    if (!data?.storageData?.batteries?.[0]?.telemetries) {
      console.log("No telemetry data found");
      return [];
    }

    // Group data by hours and calculate average
    const hourlyData = data.storageData.batteries[0].telemetries.reduce(
      (acc, reading) => {
        const hour = reading.timeStamp.slice(0, 13); // Group by hour
        if (!acc[hour]) {
          acc[hour] = {
            sum: reading.batteryPercentageState,
            count: 1,
            timestamp: reading.timeStamp,
          };
        } else {
          acc[hour].sum += reading.batteryPercentageState;
          acc[hour].count += 1;
        }
        return acc;
      },
      {}
    );

    const result = Object.entries(hourlyData).map(([hour, data]) => ({
      date: data.timestamp,
      batteryState: Number((data.sum / data.count).toFixed(1)),
    }));

    console.log("Processed data:", result);
    return result;
  }, [data]);

  return (
    <div className="bg-transparent">
      <h2 className="my-4 text-xl font-semibold text-custom-dark-blue dark:text-custom-yellow">
        {t("batteryChargingState")}
      </h2>

      {isLoading ? (
        <BatteryChargingGraphSkeleton theme={theme} />
      ) : (
        <div className="overflow-x-auto">
          <div style={{ minWidth: "600px" }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => date.slice(11, 16)}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  labelFormatter={(label) => `${label.slice(0, 16)}`}
                />
                <Line
                  type="monotone"
                  dataKey="batteryState"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatteryChargingGraph;
