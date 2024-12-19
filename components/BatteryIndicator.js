import React, { useMemo } from "react";
import BatteryGauge from "react-battery-gauge";
import { useSelector } from "react-redux";
import useDeviceType from "@/hooks/useDeviceType";
import { selectTheme } from "@/store/slices/themeSlice";

const BatteryIndicator = ({ soc }) => {
  const theme = useSelector(selectTheme);
  const { isMobile } = useDeviceType();

  // Define the vertical gradient for the entire filling
  const gradientFill = useMemo(() => {
    const stops =
      theme === "dark"
        ? [
            { offset: "0%", color: "#FFD57BFF" }, // Darker at the top
            { offset: "100%", color: "#FFD57B33" }, // Lighter at the bottom
          ]
        : [
            { offset: "0%", color: "#0B2738FF" }, // Darker at the top
            { offset: "100%", color: "#0B273833" }, // Lighter at the bottom
          ];
    return stops;
  }, [theme]);

  const showPercentage = soc !== null && soc !== undefined;

  return (
    <div className="flex justify-center items-center">
      {/* Define the vertical gradient in an SVG */}
      <svg width="0" height="0">
        <defs>
          <linearGradient
            id="batteryGradientFull"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="0%"
          >
            {/* Apply gradient stops */}
            {gradientFill.map(({ offset, color }, index) => (
              <stop key={index} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
      </svg>

      <BatteryGauge
        value={soc ?? 0}
        maxValue={100}
        animated={true}
        charging={false}
        size={150}
        orientation={isMobile ? "horizontal" : "vertical"}
        customization={{
          batteryBody: {
            strokeWidth: 4,
            cornerRadius: 6,
            fill: "none",
            strokeColor:
              theme === "dark" ? "rgb(203 213 225)" : "rgb(71 85 105)",
          },
          batteryCap: {
            fill: "none",
            strokeWidth: 4,
            strokeColor:
              theme === "dark" ? "rgb(203 213 225)" : "rgb(71 85 105)",
            cornerRadius: 2,
            capToBodyRatio: 0.4,
          },
          batteryMeter: {
            fill: "url(#batteryGradientFull)", // Apply the full gradient
            lowBatteryValue: 15,
            lowBatteryFill: "#F44336",
            outerGap: 1,
            noOfCells: 1, // Single cell for continuous gradient
            interCellsGap: 0, // No gaps between cells
          },
          readingText: {
            lightContrastColor:
              theme === "dark" ? "rgb(203 213 225)" : "#FFFFFF",
            darkContrastColor:
              theme === "dark" ? "rgb(203 213 225)" : "#FFFFFF",
            lowBatteryColor: "#F44336",
            fontFamily: "Corbert, sans-serif",
            fontSize: 14,
            showPercentage: showPercentage,
            style: {
              textShadow:
                theme === "dark"
                  ? "0 2px 4px rgba(0,0,0,0.8)"
                  : "0 1px 3px rgba(0,0,0,0.4)",
              fontWeight: "800",
            },
          },
        }}
      />
    </div>
  );
};

export default BatteryIndicator;
