import React, { useState } from "react";
import { BarChart2 } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import StatsDetailModal from "@/components/StatsDetailModal";
import EmptyState from "@/components/EmptyState";
import PlantsListTableItem from "@/components/PlantsListTableItem";
import StatusOverview from "./StatusOverview";
import PeakPower from "./PeakPower";
import MiniPerformanceChart from "./graphs/MiniPerformanceChart";

// Mock data for performance metrics
const mockPerformanceData = {
  yesterday: [
    { time: "06:00", value: 0 },
    { time: "07:00", value: 2.5 },
    { time: "08:00", value: 5.3 },
    { time: "09:00", value: 8.8 },
    { time: "10:00", value: 11.9 },
    { time: "11:00", value: 14.2 },
    { time: "12:00", value: 15.5 },
    { time: "13:00", value: 15.8 },
    { time: "14:00", value: 14.9 },
    { time: "15:00", value: 12.4 },
    { time: "16:00", value: 9.2 },
    { time: "17:00", value: 5.8 },
    { time: "18:00", value: 2.4 },
  ],
  week: [
    { time: "Mon", value: 150.2 },
    { time: "Tue", value: 180.5 },
    { time: "Wed", value: 120.8 },
    { time: "Thu", value: 200.3 },
    { time: "Fri", value: 190.7 },
    { time: "Sat", value: 210.1 },
    { time: "Sun", value: 230.6 },
  ],
  month: [
    { time: "Week 1", value: 800.4 },
    { time: "Week 2", value: 950.2 },
    { time: "Week 3", value: 1020.6 },
    { time: "Week 4", value: 870.1 },
  ],
  year: [
    { time: "Jan", value: 3200.5 },
    { time: "Feb", value: 3800.2 },
    { time: "Mar", value: 4100.8 },
    { time: "Apr", value: 4400.3 },
    { time: "May", value: 4600.7 },
    { time: "Jun", value: 5000.1 },
    { time: "Jul", value: 5200.6 },
    { time: "Aug", value: 4900.4 },
    { time: "Sep", value: 4300.9 },
    { time: "Oct", value: 3700.2 },
    { time: "Nov", value: 3500.5 },
    { time: "Dec", value: 3400.8 },
  ],
};

const SolarEdgeStatsOverview = ({ plants, t }) => {
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("yesterday");

  const periodOptions = [
    { value: "yesterday", label: "yesterday" },
    { value: "week", label: "last_7_days" },
    { value: "month", label: "last_30_days" },
    { value: "year", label: "this_year" },
  ];

  const stats = {
    working: plants?.filter((p) => p.status === "working").length || 0,
    waiting: plants?.filter((p) => p.status === "waiting").length || 0,
    error: plants?.filter((p) => p.status === "error").length || 0,
    disconnected:
      plants?.filter((p) => p.status === "disconnected").length || 0,
    totalPower: plants?.reduce((acc, p) => acc + (p.capacity || 0), 0) || 0,
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setSelectedModal("status");
  };

  const getFilteredPlants = (status) => {
    if (!status) return plants;
    return plants.filter((plant) => plant.status === status);
  };

  const totalEnergyProduced = mockPerformanceData[selectedPeriod].reduce(
    (acc, data) => acc + data.value,
    0
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-[85vw] md:max-w-[92vw] mx-auto">
      <StatusOverview stats={stats} onStatusClick={handleStatusClick} t={t} />

      <PeakPower totalPower={stats.totalPower} t={t} />

      {/* Performance Display */}
      <div
        className="flex-1 group relative bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl 
                    hover:shadow-lg hover:rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 
                    p-4 h-[160px]"
      >
        <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 right-[50%] translate-x-1/2 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
          <BarChart2 className="w-8 h-8 text-custom-dark-blue dark:text-custom-yellow" />
        </div>

        <div className="flex flex-col h-full">
          <div className="text-sm mb-2 text-slate-600 dark:text-slate-300 font-medium">
            <CustomSelect
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={periodOptions}
              className="w-fit"
            />
          </div>

          <div className="flex h-full items-center">
            <div className="flex flex-col items-start">
              <span className="text-3xl font-bold text-slate-700 dark:text-slate-200">
                {totalEnergyProduced.toFixed(2)}{" "}
                <span className="text-lg text-slate-600 dark:text-slate-400">
                  kW
                </span>
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {t("energia_producida")}
              </span>
            </div>

            <MiniPerformanceChart data={mockPerformanceData[selectedPeriod]} />
          </div>
        </div>
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
        {getFilteredPlants(selectedStatus).length > 0 ? (
          getFilteredPlants(selectedStatus).map((plant) => (
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
    </div>
  );
};

export default SolarEdgeStatsOverview;
