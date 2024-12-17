import React, { useEffect, useMemo, useState } from "react";
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
import { BiRefresh } from "react-icons/bi";
import BatteryChargingGraphSkeleton from "@/components/loadingSkeletons/BatteryChargingGraphSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";
import { useTranslation } from "react-i18next";

const BatteryChargingGraph = ({ plantId, token, data }) => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const theme = useSelector(selectTheme);
  const { t } = useTranslation();

  const handleFetch = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
    }, 1000); // Simulate fetch delay
  };

  useEffect(() => {
    handleFetch();
  }, [plantId, token]);

  return (
    <div className="bg-transparent">
      <h2 className="my-4 text-xl font-semibold text-custom-dark-blue dark:text-custom-yellow">
        {t("batteryChargingState")}
      </h2>

      {isUpdating ? (
        <BatteryChargingGraphSkeleton theme={theme} />
      ) : (
        <div className="overflow-x-auto">
          <div style={{ minWidth: "600px" }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => date.slice(11)}
                  interval="preserveStartEnd"
                />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  labelFormatter={(label) => label}
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
