import React, { useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { BiChevronDown } from "react-icons/bi";
import SystemOverviewGraph from "./SystemOverviewGraph";
import ConsumptionGraph from "./ConsumptionGraph";
import SolarGraph from "./SolarGraph";
import GeneratorGraph from "./GeneratorGraph";
import GridGraph from "./GridGraph";

const VIEW_TYPES = {
  SYSTEM_OVERVIEW: "system_overview",
  CONSUMPTION: "consumption",
  SOLAR: "solar",
  GENERATOR: "generator",
  GRID: "grid",
};

const VIEW_COMPONENTS = {
  [VIEW_TYPES.SYSTEM_OVERVIEW]: SystemOverviewGraph,
  [VIEW_TYPES.CONSUMPTION]: ConsumptionGraph,
  [VIEW_TYPES.SOLAR]: SolarGraph,
  [VIEW_TYPES.GENERATOR]: GeneratorGraph,
  [VIEW_TYPES.GRID]: GridGraph,
};

const VictronEnergyGraphsContainer = ({
  plantId,
  currentRange,
  setIsDateModalOpen,
}) => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState(VIEW_TYPES.SYSTEM_OVERVIEW);

  const GraphComponent = useMemo(() => {
    const Component = VIEW_COMPONENTS[currentView];
    return (
      <Component
        plantId={plantId}
        currentRange={currentRange}
        setIsDateModalOpen={setIsDateModalOpen}
      />
    );
  }, [currentView, plantId, currentRange, setIsDateModalOpen]);

  return (
    <div className="relative space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
        <button
          className="font-secondary appearance-none w-full sm:w-auto bg-white hover:bg-white/50 transition-all duration-300 dark:bg-custom-dark-blue hover:dark:bg-custom-dark-blue/50 px-4 py-2 pr-10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-custom-dark-blue dark:text-custom-light-gray cursor-pointer focus:outline-none focus:ring-2 focus:ring-custom-yellow"
          onClick={() => setIsDateModalOpen(true)}
        >
          {t(currentRange.type)}
        </button>

        {/* Graph Type Selector */}
        <div className="relative w-full sm:w-auto h-auto">
          <select
            value={currentView}
            onChange={(e) => setCurrentView(e.target.value)}
            className="px-4 py-2 font-secondary appearance-none w-full sm:w-auto bg-white  transition-all duration-300 dark:bg-custom-dark-blue  pr-10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-custom-dark-blue dark:text-custom-light-gray cursor-pointer focus:outline-none focus:ring-2 focus:ring-custom-yellow"
          >
            <option
              className="px-4 py-2 font-secondary cursor-pointer text-gray-700 dark:text-gray-200 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              value={VIEW_TYPES.SYSTEM_OVERVIEW}
            >
              {t("Resumen del sistema")}
            </option>
            <option
              className="px-4 py-2 font-secondary cursor-pointer text-gray-700 dark:text-gray-200 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              value={VIEW_TYPES.CONSUMPTION}
            >
              {t("Consumo")}
            </option>
            <option
              className="px-4 py-2 font-secondary cursor-pointer text-gray-700 dark:text-gray-200 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              value={VIEW_TYPES.SOLAR}
            >
              {t("Solar")}
            </option>
            <option
              className="px-4 py-2 font-secondary cursor-pointer text-gray-700 dark:text-gray-200 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              value={VIEW_TYPES.GENERATOR}
            >
              {t("Generador")}
            </option>
            <option
              className="px-4 py-2 font-secondary cursor-pointer text-gray-700 dark:text-gray-200 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              value={VIEW_TYPES.GRID}
            >
              {t("Red")}
            </option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <BiChevronDown className="text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Render Graph */}
      {GraphComponent}
    </div>
  );
};

export default VictronEnergyGraphsContainer;
