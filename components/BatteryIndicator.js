import React from "react";
import BatteryGauge from "react-battery-gauge";
import { useSelector } from "react-redux";
import useDeviceType from "@/hooks/useDeviceType";
import { selectTheme } from "@/store/slices/themeSlice";

const BatteryIndicator = ({ soc }) => {
  const theme = useSelector(selectTheme);
  const { isDesktop, isSmallDesktop } = useDeviceType();

  const isVertical = isDesktop || isSmallDesktop;
  const showPercentage = soc !== null && soc !== undefined;

  // Define a unique parent ID for the SVG
  const parentId = React.useId();
  const gradientId = `${parentId}-gradient`;

  return (
    <div className="flex justify-center items-center" id={parentId}>
      <svg
        style={{ width: 0, height: 0, position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2={isVertical ? "0" : "1"}
            y2={isVertical ? "1" : "0"}
            gradientUnits="objectBoundingBox"
          >
            <stop
              offset="0%"
              stopColor={theme === "dark" ? "#FFD57BFF" : "#0B2738FF"}
            />
            <stop
              offset="100%"
              stopColor={theme === "dark" ? "#FFD57B33" : "#0B273833"}
            />
          </linearGradient>
        </defs>
      </svg>

      <BatteryGauge
        value={soc ?? 0}
        maxValue={100}
        animated={true}
        charging={false}
        size={150}
        orientation={isVertical ? "vertical" : "horizontal"}
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
            fill: `url(#${gradientId})`,
            lowBatteryValue: 15,
            lowBatteryFill: "#F44336",
            outerGap: 1,
            noOfCells: 1,
            interCellsGap: 0,
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
