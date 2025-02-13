import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AlertTriangle, BarChart2, Sun, Activity } from "lucide-react";
import {
  selectActiveNotifications,
  fetchActiveNotifications,
} from "@/store/slices/notificationsSlice";
import { selectUser } from "@/store/slices/userSlice";
import StatsDetailModal from "../StatsDetailModal";
import PlantsListTableItem from "../PlantsListTableItem";
import EmptyState from "../EmptyState";
import PlantProductionListItem from "../PlantProductionListItem";
import NotificationListItem from "../alerts/AlertsListItem";

const StatusBlock = ({ stats, onStatusClick }) => (
  <div className="flex gap-2">
    {[
      { status: "working", color: "green" },
      { status: "disconnected", color: "gray" },
      { status: "waiting", color: "yellow" },
      { status: "error", color: "red" },
    ].map(({ status, color }) => (
      <div
        key={status}
        className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => onStatusClick(status)}
      >
        <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
        <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {stats[status]}
        </span>
      </div>
    ))}
  </div>
);

const StatCard = ({ Icon, title, children, onClick, t }) => (
  <div
    className={`flex-1 group relative text-center bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl 
              hover:shadow-lg hover:rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 
              ${
                onClick ? "cursor-pointer" : ""
              } p-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-700`}
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
    {children}
  </div>
);

const GoodweStatsOverview = ({ plants, t }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const activeNotifications = useSelector(selectActiveNotifications);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    if (user?.tokenIdentificador && activeNotifications.length === 0) {
      dispatch(fetchActiveNotifications({ pageIndex: 1, pageSize: 100 }));
    }
  }, [dispatch, user, activeNotifications]);

  const stats = {
    working: plants?.filter((p) => p.status === "working").length || 0,
    disconnected:
      plants?.filter((p) => p.status === "disconnected").length || 0,
    error: plants?.filter((p) => p.status === "error").length || 0,
    waiting: plants?.filter((p) => p.status === "waiting").length || 0,
    currentProduction:
      plants?.reduce((acc, p) => acc + (p.current_power || 0), 0) || 0,
    totalProduction:
      plants?.reduce((acc, p) => acc + (p.total_energy || 0), 0) || 0,
    plantsInProduction: plants?.filter((p) => p.current_power > 0) || [],
  };

  const currentKW = (stats.currentProduction / 1000).toFixed(2);
  const totalMWh = (stats.totalProduction / 1000000).toFixed(2);
  const goodweActiveAlertsCount = activeNotifications.filter(
    (notification) => notification.provider === "goodwe"
  ).length;

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setSelectedModal("status");
  };

  const metrics = [
    {
      Icon: BarChart2,
      title: "status_overview",
      content: <StatusBlock stats={stats} onStatusClick={handleStatusClick} />,
    },
    {
      Icon: Sun,
      title: "current_production",
      onClick: () => setSelectedModal("production"),
      content: (
        <div className="text-center">
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {currentKW}
          </span>
          <span className="ml-1 text-lg text-gray-500 dark:text-gray-400">
            kW
          </span>
        </div>
      ),
    },
    {
      Icon: AlertTriangle,
      title: "alerts",
      onClick: () => setSelectedModal("alerts"),
      content: (
        <div className="text-center">
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {goodweActiveAlertsCount}
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
      <div className="flex flex-col md:flex-row gap-6 max-w-[85vw] md:max-w-[92vw] mx-auto z-0">
        {metrics.map(({ Icon, title, content, onClick }) => (
          <StatCard
            key={title}
            Icon={Icon}
            title={title}
            onClick={onClick}
            t={t}
          >
            {content}
          </StatCard>
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
        icon={BarChart2}
      >
        {plants?.filter(
          (plant) => !selectedStatus || plant.status === selectedStatus
        ).length > 0 ? (
          plants
            .filter(
              (plant) => !selectedStatus || plant.status === selectedStatus
            )
            .map((plant) => (
              <PlantsListTableItem key={plant.id} plant={plant} />
            ))
        ) : (
          <EmptyState
            icon={BarChart2}
            title={t("no_plants_found")}
            description={t("no_plants_status_description", {
              status: t(`status_${selectedStatus}`),
            })}
          />
        )}
      </StatsDetailModal>

      {/* Production Modal */}
      <StatsDetailModal
        isOpen={selectedModal === "production"}
        onClose={() => setSelectedModal(null)}
        title={t("current_production")}
        icon={Sun}
      >
        {stats.plantsInProduction.length > 0 ? (
          stats.plantsInProduction.map((plant) => (
            <PlantProductionListItem key={plant.id} plant={plant} t={t} />
          ))
        ) : (
          <EmptyState
            icon={Sun}
            title={t("no_production_data")}
            description={t("no_active_production_plants")}
          />
        )}
      </StatsDetailModal>

      {/* Alerts Modal */}
      <StatsDetailModal
        isOpen={selectedModal === "alerts"}
        onClose={() => setSelectedModal(null)}
        title={t("alerts")}
        icon={AlertTriangle}
      >
        {activeNotifications.filter(
          (notification) => notification.provider === "goodwe"
        ).length > 0 ? (
          activeNotifications
            .filter((notification) => notification.provider === "goodwe")
            .map((notification) => (
              <NotificationListItem
                key={notification.warningid}
                notification={notification}
              />
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

export default GoodweStatsOverview;
