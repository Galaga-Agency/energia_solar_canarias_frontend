import useDeviceType from "@/hooks/useDeviceType";
import { selectTheme } from "@/store/slices/themeSlice";
import React, { useMemo } from "react";
import BatteryGauge from "react-battery-gauge";
import { useSelector } from "react-redux";

const BatteryIndicator = ({ soc }) => {
  const { isMobile, isTablet } = useDeviceType();
  const theme = useSelector(selectTheme);

  const getBatteryColor = useMemo(() => {
    if (soc === null || soc === undefined) return "none"; // No fill color for invalid data
    if (soc <= 10) return "#ef4444"; // Red - Critical
    if (soc <= 20) return "#f97316"; // Orange - Low
    if (soc <= 40) return "#eab308"; // Yellow - Medium-Low
    if (soc <= 60) return "#84cc16"; // Light Green - Medium
    if (soc <= 80) return "#22c55e"; // Green - Good
    return "#22c55e"; // Default Green
  }, [soc]);

  const showPercentage = soc !== null && soc !== undefined;

  return (
    <div className="flex justify-left items-center">
      <BatteryGauge
        value={soc ?? 0}
        maxValue={100}
        animated={true}
        charging={false}
        size={130}
        orientation={isMobile ? "horizontal" : "vertical"}
        customization={{
          batteryBody: {
            strokeWidth: 4,
            cornerRadius: 6,
            fill: "none",
            strokeColor:
              theme === "dark" ? " rgb(203 213 225)" : "rgb(71 85 105)",
          },
          batteryCap: {
            fill: "none",
            strokeWidth: 4,
            strokeColor:
              theme === "dark" ? " rgb(203 213 225)" : "rgb(71 85 105)",
            cornerRadius: 2,
            capToBodyRatio: 0.4,
          },
          batteryMeter: {
            fill: getBatteryColor,
            lowBatteryValue: 20,
            lowBatteryFill: "#f97316",
            outerGap: 1,
            noOfCells: 10,
            interCellsGap: 1,
          },
          readingText: {
            lightContrastColor:
              theme === "dark" ? "rgb(255, 213, 122)" : "rgb(161, 161, 170)",
            darkContrastColor:
              theme === "dark" ? "rgb(255, 213, 122)" : "rgb(161, 161, 170)",
            lowBatteryColor: "#ef4444",
            fontFamily: "Corbert, sans-serif",
            fontSize: 14,
            showPercentage: showPercentage,
          },
        }}
      />
    </div>
  );
};

export default BatteryIndicator;
