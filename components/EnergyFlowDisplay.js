import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchPlantsMock } from "@/services/api";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import Loading from "./Loading";
import houseIllustration from "@/public/assets/img/house-illustration.png";
import solarPanelIllustration from "@/public/assets/img/solar-panel-illustration.png";
import gridIllustration from "@/public/assets/img/grid.png";
import useDeviceType from "@/hooks/useDeviceType";

const EnergyFlowDisplay = ({ plantId }) => {
  const theme = useSelector(selectTheme);
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile, isTablet, isDesktop } = useDeviceType();

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const plants = await fetchPlantsMock();
        const selectedPlant = plants.find((p) => p.id === parseInt(plantId));
        setPlant(selectedPlant);
      } catch (error) {
        console.error("Error fetching plant data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlantData();
  }, [plantId]);

  if (isLoading) {
    return <Loading />;
  }

  const energyConsumed = plant?.powerFlow.LOAD.currentPower;
  const energyProduced = plant?.powerFlow.PV.currentPower;
  const energyExported = plant?.powerFlow.GRID.currentPower;

  return (
    <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 mb-6 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-custom-dark-blue dark:text-custom-yellow mb-4">
        Real Time Energy Flow
      </h2>

      <div className="relative w-full h-[280px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isMobile && (
            <div className="relative flex flex-col items-center">
              <div className="absolute w-24 h-24 bg-polygon-gradient clip-polygon gradient-border top-36 -left-24 -mt-12"></div>
              <Image
                src={solarPanelIllustration}
                alt="Solar Panel"
                className="relative max-w-[35%] h-auto object-contain mb-2 p-2"
              />
              <div></div>
              <div className="flex justify-between w-full mt-2 items-center">
                <Image
                  src={houseIllustration}
                  alt="House"
                  className="max-w-[35%] h-auto object-contain p-2 pb-0"
                />
                <Image
                  src={gridIllustration}
                  alt="Grid"
                  className="max-w-[30%] h-auto object-contain mb-2 p-2"
                />
              </div>
            </div>
          )}

          {!isMobile && (
            <div className="flex justify-between mx-12">
              <Image
                src={houseIllustration}
                alt="House"
                className="max-w-[15%] h-auto object-contain mb-2 p-2"
              />
              <div className="flex my-auto h-1 bg-blue-500 w-full"></div>
              <Image
                src={solarPanelIllustration}
                alt="Solar Panel"
                className="max-w-[15%] h-auto object-contain mb-4 p-2 pr-4"
              />
              <div className="flex my-auto h-1 bg-blue-500 w-full"></div>
              <Image
                src={gridIllustration}
                alt="Grid"
                className="md:max-w-[14%] lg:max-w-[12%] h-auto object-contain md:mb-12 lg:mb-16 p-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Energy stats with responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
          <span className="block text-sm text-slate-600 dark:text-slate-300">
            Energy Consumed
          </span>
          <span className="block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
            {energyConsumed || 0} W
          </span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
          <span className="block text-sm text-slate-600 dark:text-slate-300">
            Energy Produced
          </span>
          <span className="block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
            {energyProduced || 0} W
          </span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
          <span className="block text-sm text-slate-600 dark:text-slate-300">
            Energy Exported
          </span>
          <span className="block text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
            {energyExported || 0} W
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlowDisplay;
