import React from "react";

const GridDetailsPopover = ({ gridMetrics }) => {
  if (!gridMetrics) return null;

  return (
    <div className="p-4 w-64 text-gray-700 dark:text-gray-200 bg-white dark:bg-custom-dark-blue rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Grid Details</h3>
      <div className="space-y-2">
        {["L1", "L2", "L3"].map((phase) => (
          <div key={phase} className="border-b pb-2">
            <h4 className="font-medium text-sm text-gray-600 dark:text-gray-300">
              {phase}
            </h4>
            <p className="text-sm">
              <strong>Power:</strong> {gridMetrics[phase]?.power ?? "N/A"} W
            </p>
            <p className="text-sm">
              <strong>Voltage:</strong> {gridMetrics[phase]?.voltage ?? "N/A"} V
            </p>
            <p className="text-sm">
              <strong>Current:</strong> {gridMetrics[phase]?.current ?? "N/A"} A
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridDetailsPopover;
