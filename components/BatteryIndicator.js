import React from "react";
import BatteryGauge from "react-battery-gauge";

const BatteryIndicator = ({ soc }) => {
  return (
    <div className="flex justify-left items-center">
      <BatteryGauge
        value={soc}
        maxValue={100}
        animated={true}
        charging={false}
        size={130}
        customization={{
          batteryBody: {
            strokeWidth: 4,
            cornerRadius: 6,
            fill: "none",
            strokeColor: "rgb(201, 202, 202)",
          },
          batteryCap: {
            fill: "none",
            strokeWidth: 4,
            strokeColor: "rgb(201, 202, 202)",
            cornerRadius: 2,
            capToBodyRatio: 0.4,
          },
          batteryMeter: {
            fill: soc > 15 ? "rgb(34 197 94)" : "#f44336",
            lowBatteryValue: 15,
            lowBatteryFill: "#f44336",
            outerGap: 1,
            noOfCells: 5,
            interCellsGap: 1,
          },
          readingText: {
            lightContrastColor: "#111",
            darkContrastColor: "#fff",
            lowBatteryColor: "#f44336",
            fontFamily: "Corbert, sans-serif",
            fontSize: 14,
            showPercentage: true,
          },
        }}
      />
    </div>
  );
};

export default BatteryIndicator;
