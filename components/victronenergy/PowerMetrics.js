import React from "react";
import { useTranslation } from "next-i18next";
import MetricCard from "./MetricCard";
import { FaSolarPanel, FaBolt } from "react-icons/fa";
import { IoMdBatteryFull } from "react-icons/io";

const PowerMetrics = ({ totals }) => {
  const { t } = useTranslation();

  // Helper function to safely format numbers
  const formatValue = (value) => {
    if (value === undefined || value === null) return "-";
    const num = Number(value);
    return isNaN(num) ? "-" : num.toFixed(2);
  };

  // Using the totals passed from the parent
  const {
    totalConsumption,
    totalSolar,
    grid_history_to,
    grid_history_from,
    battery,
  } = totals || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {/* Consumption Card */}
      <MetricCard
        title={t("Consumo total")}
        value={formatValue(totalConsumption)}
        icon={
          <FaBolt
            className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow"
            size={10}
          />
        }
        unit="kWh"
      />

      {/* Solar Production Card */}
      <MetricCard
        title={t("Producción solar")}
        value={formatValue(totalSolar)}
        icon={
          <FaSolarPanel
            className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow"
            size={20}
          />
        }
        unit="kWh"
      />

      {/* Battery Usage Card - If you have battery data */}
      <MetricCard
        title={t("Uso de batería")}
        value={formatValue(battery)}
        icon={
          <IoMdBatteryFull
            className="w-10 h-10 p-2 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md text-custom-dark-blue dark:text-custom-yellow"
            size={20}
          />
        }
        unit="kWh"
      />
    </div>
  );
};

export default PowerMetrics;
