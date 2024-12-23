import React from "react";
import { BarChart2, CircleDollarSign, Sun } from "lucide-react";
import { MdOutlineEnergySavingsLeaf } from "react-icons/md";

const GoodweStatsOverview = ({ plants, t }) => {
  const stats = {
    working: plants?.filter((p) => p.status === "working").length || 0,
    disconnected:
      plants?.filter((p) => p.status === "disconnected").length || 0,
    error: plants?.filter((p) => p.status === "error").length || 0,
    waiting: plants?.filter((p) => p.status === "waiting").length || 0,
    currentProduction:
      plants?.reduce((acc, p) => acc + (p.current_power || 0), 0) || 0,
    dailyEnergy:
      plants?.reduce((acc, p) => acc + (p.daily_energy || 0), 0) || 0,
    totalProduction:
      plants?.reduce((acc, p) => acc + (p.total_energy || 0), 0) || 0,
  };

  // Convert kWh to MWh for total production
  const totalMWh = (stats.totalProduction / 1000).toFixed(2);
  // Convert W to kW for current production
  const currentKW = (stats.currentProduction / 1000).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
      {/* Status Overview */}
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
            <BarChart2 className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h3 className="text-lg text-slate-700 dark:text-slate-200">
            {t("status_overview")}
          </h3>
        </div>
        <div className="flex justify-around gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {stats.working}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {stats.disconnected}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {stats.waiting}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {stats.error}
            </span>
          </div>
        </div>
      </div>

      {/* Current Production */}
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
            <Sun className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h3 className="text-lg text-slate-700 dark:text-slate-200">
            {t("current_production")}
          </h3>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-medium text-slate-700 dark:text-slate-200">
            {currentKW}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">kW</span>
        </div>
      </div>

      {/* Total Production */}
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
            <MdOutlineEnergySavingsLeaf className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h3 className="text-lg text-slate-700 dark:text-slate-200">
            {t("total_production")}
          </h3>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-medium text-slate-700 dark:text-slate-200">
            {totalMWh}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            MWh
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoodweStatsOverview;
