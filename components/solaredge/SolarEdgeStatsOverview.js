import React from "react";
import { BarChart2, AlertTriangle, Zap } from "lucide-react";

const SolarEdgeStatsOverview = ({ plants, t }) => {
  const stats = {
    working: plants?.filter((p) => p.status === "working").length || 0,
    waiting: plants?.filter((p) => p.status === "waiting").length || 0,
    error: plants?.filter((p) => p.status === "error").length || 0,
    disconnected:
      plants?.filter((p) => p.status === "disconnected").length || 0,
    totalPower: plants?.reduce((acc, p) => acc + (p.capacity || 0), 0) || 0,
    totalAlerts:
      plants?.reduce((acc, p) => acc + (p.alert_quantity || 0), 0) || 0,
    highImpactAlerts: plants?.filter((p) => p.highest_impact >= 3).length || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
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
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {stats.disconnected}
            </span>
          </div>
        </div>
      </div>

      {/* Potencia Pico */}
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
            <Zap className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h3 className="text-lg text-slate-700 dark:text-slate-200">
            {t("peak_power")}
          </h3>
        </div>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-2xl font-medium text-slate-700 dark:text-slate-200">
            {stats.totalPower.toFixed(2)}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">kW</span>
        </div>
      </div>

      {/* Alerts Overview */}
      {/* <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
            <AlertTriangle className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h3 className="text-lg text-slate-700 dark:text-slate-200">
            {t("alerts")}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {stats.highImpactAlerts}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t("high_impact")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {stats.totalAlerts}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t("total")}
            </span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SolarEdgeStatsOverview;
