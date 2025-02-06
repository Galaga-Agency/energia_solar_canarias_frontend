import React, { useState } from "react";
import { AlertTriangle, Zap } from "lucide-react";
import {
  BsBatteryCharging,
  BsBatteryFull,
  BsBatteryHalf,
} from "react-icons/bs";
import EmptyState from "../EmptyState";
import NotificationListItem from "../notifications/NotificationListItem";
import InstallationTypesModal from "./InstallationTypesModal";
import PlantsListTableItem from "../PlantsListTableItem";
import StatsDetailModal from "../StatsDetailModal";

const batteryStateIcons = {
  charging: {
    icon: BsBatteryCharging,
    color: "text-green-500",
    bgColor: "bg-green-500",
    size: "text-2xl",
  },
  discharging: {
    icon: BsBatteryHalf,
    color: "text-red-500",
    bgColor: "bg-red-500",
    size: "text-2xl",
  },
  resting: {
    icon: BsBatteryFull,
    color: "text-gray-500",
    bgColor: "bg-gray-500",
    size: "text-2xl",
  },
  offline: {
    icon: BsBatteryHalf,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500",
    size: "text-2xl",
  },
};

const VictronStatsOverview = ({ plants, t, alerts }) => {
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

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
    totalAlerts: alerts?.length || 0,
    installations: plants?.reduce((acc, plant) => {
      const type = plant.type;
      if (type && typeof type === "string") {
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {}),
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setSelectedModal("status");
  };

  const getFilteredPlants = (status) => {
    if (!status) return plants;

    const statusMap = {
      charging: "cargando",
      discharging: "descargando",
      resting: "en reposo",
      offline: null,
    };

    const targetStatus = statusMap[status];

    return plants.filter((plant) => {
      const plantStatus = plant.status?.toLowerCase();
      return status === "offline" ? !plantStatus : plantStatus === targetStatus;
    });
  };

  const metrics = [
    {
      icon: BsBatteryFull,
      title: "battery_overview",
      onClick: () => setSelectedModal("status"),
      value: (
        <div className="flex gap-2">
          {Object.entries(batteryStateIcons).map(
            ([status, { icon: Icon, bgColor }]) => (
              <div
                key={status}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusClick(status);
                }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${bgColor}`} />
                  <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {stats[status]}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      ),
    },
    {
      icon: Zap,
      title: "installation_types",
      onClick: () => setSelectedModal("installations"),
      value: (
        <div className="flex gap-4 justify-center">
          {Object.entries(stats.installations).map(([type, count]) => (
            <div key={type} className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {count}
              </span>
              <span className="text-lg text-gray-500 dark:text-gray-400">
                {t(type)}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: AlertTriangle,
      title: "alerts",
      onClick: () => setSelectedModal("alerts"),
      value: (
        <div className="text-center">
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {stats.totalAlerts}
          </span>
          <span className="ml-1 text-lg text-gray-500 dark:text-gray-400">
            {t("total")}
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 max-w-[85vw] md:max-w-[92vw] mx-auto">
        {metrics.map(({ icon: Icon, title, onClick, value }) => (
          <div
            key={title}
            className="flex-1 group relative text-center bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl 
                     hover:shadow-lg hover:rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 
                     cursor-pointer p-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-700"
            onClick={onClick}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
                <Icon className="w-8 h-8 text-custom-dark-blue dark:text-custom-yellow" />
              </div>
              <h3 className="text-sm mt-8 text-slate-600 dark:text-slate-300 font-medium">
                {t(title)}
              </h3>
            </div>
            {value}
          </div>
        ))}
      </div>

      {/* Status Modal */}
      <StatsDetailModal
        isOpen={selectedModal === "status"}
        onClose={() => {
          setSelectedModal(null);
          setSelectedStatus(null);
        }}
        title={t(`status_${selectedStatus || "overview"}`)}
        icon={
          selectedStatus
            ? batteryStateIcons[selectedStatus]?.icon
            : BsBatteryFull
        }
      >
        {getFilteredPlants(selectedStatus).length > 0 ? (
          getFilteredPlants(selectedStatus).map((plant) => (
            <PlantsListTableItem key={plant.id} plant={plant} />
          ))
        ) : (
          <EmptyState
            icon={batteryStateIcons[selectedStatus]?.icon}
            title={t("no_plants_found")}
            description={t("no_plants_status_description", {
              status: t(`status_${selectedStatus}`),
            })}
          />
        )}
      </StatsDetailModal>

      {/* Installation Types Modal */}
      <InstallationTypesModal
        isOpen={selectedModal === "installations"}
        onClose={() => setSelectedModal(null)}
        title={t("installation_types")}
        installations={stats.installations}
        plants={plants}
        t={t}
      />

      {/* Alerts Modal */}
      <StatsDetailModal
        isOpen={selectedModal === "alerts"}
        onClose={() => setSelectedModal(null)}
        title={t("alerts")}
        icon={AlertTriangle}
      >
        {alerts?.length > 0 ? (
          alerts.map((alert) => (
            <NotificationListItem key={alert.id} notification={alert} />
          ))
        ) : (
          <EmptyState
            icon={AlertTriangle}
            title={t("no_alerts")}
            description={t("no_active_alerts_description")}
          />
        )}
      </StatsDetailModal>
    </>
  );
};

export default VictronStatsOverview;
