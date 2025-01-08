import React from "react";
import { Battery, AlertTriangle, Zap } from "lucide-react";
import {
  BsBatteryCharging,
  BsBatteryFull,
  BsBatteryHalf,
} from "react-icons/bs";

const batteryStateIcons = {
  charging: {
    icon: BsBatteryCharging,
    color: "text-green-500",
    size: "text-3xl",
  },
  discharging: { icon: BsBatteryHalf, color: "text-red-500", size: "text-3xl" },
  resting: { icon: BsBatteryFull, color: "text-gray-400", size: "text-3xl" },
};

const VictronStatsOverview = ({ plants, t, alerts }) => {
  const installationTypes = React.useMemo(() => {
    if (!plants) return {};
    return plants.reduce((acc, plant) => {
      const type = plant.type;
      if (type && typeof type === "string") {
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {});
  }, [plants]);

  const stats = {
    charging:
      plants?.filter((p) => p.status?.toLowerCase() === "cargando").length || 0,
    discharging:
      plants?.filter((p) => p.status?.toLowerCase() === "descargando").length ||
      0,
    resting:
      plants?.filter((p) => p.status?.toLowerCase() === "en reposo").length ||
      0,
    offline: plants?.filter((p) => !p.status).length || 0,
    totalAlerts: alerts.length || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
      {/* Battery Status Overview */}
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
            <Battery className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h3 className="text-lg text-slate-700 dark:text-slate-200">
            {t("battery_overview")}
          </h3>
        </div>
        <div className="flex justify-around gap-4">
          {Object.entries(batteryStateIcons).map(
            ([status, { icon: Icon, color, size }]) => (
              <div key={status} className="flex items-center gap-2">
                <Icon className={`${color} ${size} mt-1`} />
                <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
                  {stats[status] || 0}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Installation Types */}
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-left gap-3 mb-4">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
            <Zap className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h3 className="text-lg text-slate-700 dark:text-slate-200">
            {t("installation_types")}
          </h3>
        </div>
        <div className="flex justify-center gap-8">
          {Object.entries(installationTypes).map(([type, count]) => (
            <div key={type} className="flex items-center gap-2">
              <span className="text-2xl font-medium text-slate-700 dark:text-slate-200">
                {count}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {t(`${type}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts Overview */}
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
            <AlertTriangle className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h3 className="text-lg text-slate-700 dark:text-slate-200">
            {t("alerts")}
          </h3>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-medium text-slate-700 dark:text-slate-200">
              {stats.totalAlerts}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t("total")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictronStatsOverview;
