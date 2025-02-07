import React from "react";

const MiniGraphCustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {`${payload[0].payload.time}: ${payload[0].value.toFixed(2)} kWh`}
        </p>
      </div>
    );
  }
  return null;
};

export default MiniGraphCustomTooltip;
