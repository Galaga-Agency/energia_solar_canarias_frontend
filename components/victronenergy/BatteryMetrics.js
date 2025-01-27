import React from "react";
import { useTranslation } from "next-i18next";
import MetricCard from "./MetricCard";

const BatteryMetrics = ({ chartData }) => {
  const { t } = useTranslation();

  // Helper function to safely get min/max values
  const safeMinMax = (data, key) => {
    const validValues = data.filter(
      (d) => typeof d[key] === "number" && !isNaN(d[key])
    );
    if (validValues.length === 0) return null;
    return {
      min: Math.min(...validValues.map((d) => d[key])),
      max: Math.max(...validValues.map((d) => d[key])),
    };
  };

  // Helper function to safely calculate average
  const safeAverage = (data, key) => {
    const validValues = data.filter(
      (d) => typeof d[key] === "number" && !isNaN(d[key])
    );
    if (validValues.length === 0) return null;
    return validValues.reduce((sum, d) => sum + d[key], 0) / validValues.length;
  };

  // Get min/max values
  const voltageRange = safeMinMax(chartData, "battery");
  const absoluteMin = safeMinMax(chartData, "batteryMin");
  const absoluteMax = safeMinMax(chartData, "batteryMax");

  // Get average
  const average = safeAverage(chartData, "battery");

  // Get last reading
  const lastReading =
    chartData.length > 0 ? chartData[chartData.length - 1].battery : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
      <MetricCard
        title={t("Tensión mínima")}
        value={absoluteMin?.min ? absoluteMin.min.toFixed(2) : "-"}
        unit="V"
      />
      <MetricCard
        title={t("Tensión máxima")}
        value={absoluteMax?.max ? absoluteMax.max.toFixed(2) : "-"}
        unit="V"
      />
      <MetricCard
        title={t("Tensión promedio")}
        value={average ? average.toFixed(2) : "-"}
        unit="V"
      />
      <MetricCard
        title={t("Rango de tensión")}
        value={
          voltageRange?.min && voltageRange?.max
            ? `${voltageRange.min.toFixed(2)} - ${voltageRange.max.toFixed(2)}`
            : "-"
        }
        unit="V"
      />
      <MetricCard
        title={t("Última lectura")}
        value={lastReading ? lastReading.toFixed(2) : "-"}
        unit="V"
      />
    </div>
  );
};

export default BatteryMetrics;
