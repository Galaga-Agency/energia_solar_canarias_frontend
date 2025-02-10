import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarChart2 } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import StatsDetailModal from "@/components/StatsDetailModal";
import EmptyState from "@/components/EmptyState";
import PlantsListTableItem from "@/components/PlantsListTableItem";
import StatusOverview from "./StatusOverview";
import PeakPower from "./PeakPower";
import MiniPerformanceChart from "./graphs/MiniPerformanceChart";
import {
  fetchSolarEdgeEnergyData,
  selectEnergyData,
  selectEnergyDataError,
  selectEnergyDataLoading,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";

const SolarEdgeStatsOverview = ({ plants, t }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = user.tokenIdentificador;
  const energyData = useSelector(selectEnergyData);
  const loading = useSelector(selectEnergyDataLoading);
  const error = useSelector(selectEnergyDataError);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("yesterday");

  const periodOptions = [
    { value: "yesterday", label: "yesterday" },
    { value: "week", label: "last_7_days" },
    { value: "month", label: "last_30_days" },
    { value: "year", label: "this_year" },
  ];

  const getTimeRange = (period) => {
    const now = new Date();
    const end = new Date(now);
    let start = new Date(now);
    let timeUnit = "QUARTER_OF_AN_HOUR";

    switch (period) {
      case "yesterday": {
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        timeUnit = "QUARTER_OF_AN_HOUR";
        break;
      }

      case "week": {
        start.setDate(start.getDate() - 7);
        end.setHours(23, 59, 59, 999);
        timeUnit = "DAY";
        break;
      }
      case "month": {
        start.setMonth(start.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        timeUnit = "DAY";
        break;
      }
      case "year": {
        start = new Date(now.getFullYear(), 0, 1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        timeUnit = "MONTH";
        break;
      }
      default: {
        timeUnit = "DAY";
      }
    }

    const result = {
      timeUnit,
      startTime: start.toISOString().split("T")[0],
      endTime: end.toISOString().split("T")[0],
    };

    return result;
  };

  useEffect(() => {
    if (plants?.length && token) {
      const plantIds = plants.map((p) => p.id);
      const { timeUnit, startTime, endTime } = getTimeRange(selectedPeriod);

      dispatch(
        fetchSolarEdgeEnergyData({
          plantIds,
          timeUnit,
          startTime,
          endTime,
          token,
        })
      );
    }
  }, [plants, selectedPeriod, token, dispatch]);

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

  const formatEnergyData = (data) => {
    if (!data) return [];
    return data.map((item) => ({
      time: item.date,
      value: item.energy,
    }));
  };

  // console.log("energy data", energyData);

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-[85vw] md:max-w-[92vw] mx-auto">
      <StatusOverview stats={stats} onStatusClick={handleStatusClick} t={t} />
      <PeakPower totalPower={stats.totalPower} t={t} />

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
                {loading
                  ? "..."
                  : (() => {
                      const totalEnergy = Object.values(
                        energyData?.chartEnergy || {}
                      ).reduce((sum, value) => sum + value, 0);
                      const isMWh = totalEnergy >= 1000;
                      return (
                        <>
                          {isMWh
                            ? (totalEnergy / 1000).toFixed(2)
                            : totalEnergy.toFixed(2)}
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {" "}
                            {isMWh ? "MWh" : "kW"}
                          </span>
                        </>
                      );
                    })()}
              </span>

              <span className="text-sm text-slate-500 dark:text-slate-400">
                {t("energia_producida")}
              </span>
            </div>

            <MiniPerformanceChart
              data={energyData}
              isLoading={loading}
              error={error}
              selectedRange="yesterday"
            />
          </div>
        </div>
      </div>

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
