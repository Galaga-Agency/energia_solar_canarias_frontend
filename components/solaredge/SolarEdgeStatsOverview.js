import React, { useState } from "react";
import { BarChart2, Zap } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import CustomSelect from "@/components/ui/CustomSelect";
import EmptyState from "../EmptyState";
import PlantsListTableItem from "../PlantsListTableItem";
import StatsDetailModal from "../StatsDetailModal";

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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {`${payload[0].payload.time}: ${payload[0].value.toFixed(2)} kWh`}
        </p>
      </div>
    );
  }
  return null;
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
      {/* Status Overview */}
      <div
        className="flex-1 group relative text-center bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl 
                    hover:shadow-lg hover:rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 
                    cursor-pointer p-4 flex flex-col items-center hover:scale-105 transition-transform duration-700 h-[160px]"
        onClick={() => setSelectedModal("status")}
      >
        <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
          <BarChart2 className="w-8 h-8 text-custom-dark-blue dark:text-custom-yellow" />
        </div>

        <h3 className="text-sm mt-8 mb-4 text-slate-600 dark:text-slate-300 font-medium">
          {t("status_overview")}
        </h3>

        <div className="flex justify-around gap-4 w-full">
          {[
            { status: "working", color: "bg-green-500" },
            { status: "waiting", color: "bg-amber-500" },
            { status: "error", color: "bg-red-500" },
            { status: "disconnected", color: "bg-slate-400" },
          ].map(({ status, color }) => (
            <div
              key={status}
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusClick(status);
              }}
            >
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
                {stats[status]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Power */}
      <div
        className="flex-1 group relative text-center bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl 
                    hover:shadow-lg hover:rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 
                    p-4 flex flex-col items-center h-[160px]"
      >
        <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
          <Zap className="w-8 h-8 text-custom-dark-blue dark:text-custom-yellow" />
        </div>

        <h3 className="text-sm mt-8 mb-4 text-slate-600 dark:text-slate-300 font-medium">
          {t("peak_power")}
        </h3>

        <div className="flex items-baseline justify-center gap-2">
          <span className="text-3xl font-bold text-slate-700 dark:text-slate-200">
            {stats.totalPower.toFixed(2)}
          </span>
          <span className="text-lg text-slate-600 dark:text-slate-400">kW</span>
        </div>
      </div>

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

            <div className="flex-1 h-24 ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockPerformanceData[selectedPeriod]}
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--custom-dark-blue)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--custom-yellow)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "#888888" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#888888" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value} kWh`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--custom-dark-blue)"
                    fill="url(#colorValue)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "var(--custom-dark-blue)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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
