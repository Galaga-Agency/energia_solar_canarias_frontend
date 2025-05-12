"use client";

import React, { useEffect } from "react";
import { IoEarthOutline, IoLeaf } from "react-icons/io5";
import { PiTree } from "react-icons/pi";
import { BsCircleFill } from "react-icons/bs";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import useDeviceType from "@/hooks/useDeviceType";
import {
  fetchEnvironmentalBenefits,
  selectEnvironmentalBenefits,
  selectErrorBenefits,
  selectLoadingBenefits,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import EnvironmentalBenefitsSkeleton from "@/components/loadingSkeletons/EnvironmentalBenefitsSkeleton";
import { formatLargeNumber } from "@/utils/numbers";
import { PiLightbulbFilament  } from "react-icons/pi";

const EnvironmentalBenefits = ({ t, plantId, provider, batteryLevel }) => {
  const theme = useSelector(selectTheme);
  const { isMobile } = useDeviceType();
  const dispatch = useDispatch();
  const benefits = useSelector(selectEnvironmentalBenefits);
  const loading = useSelector(selectLoadingBenefits);
  const user = useSelector(selectUser);
  const token = user?.tokenIdentificador;

  useEffect(() => {
    if (plantId && provider) {
      dispatch(fetchEnvironmentalBenefits({ plantId, provider, token }));
    }
  }, [dispatch, plantId, provider, token]);

  if (loading) {
    return <EnvironmentalBenefitsSkeleton theme={theme} />;
  }

  console.log("benefits", benefits);

  return (
    <section
      className={`flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 md:pb-8 mb-6 backdrop-blur-sm shadow-lg ${
        batteryLevel > 0 ? "xl:w-[40vw]" : "xl:w-[calc(50%-36px)]"
      } `}
    >
      <h2 className="text-xl mb-6 text-left text-custom-dark-blue dark:text-custom-yellow flex items-center gap-2">
        {t("environmentalBenefits")}
        <Popover showArrow offset={20} placement="bottom">
          <PopoverTrigger>
            <Info
              className="mb-1 h-5 w-5 text-custom-dark-blue dark:text-custom-yellow cursor-pointer hover:text-opacity-80 transition"
              aria-label={t("moreInfo")}
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">
                {t("environmentalBenefitsCalculation", {
                  defaultValue:
                    "El impacto positivo de la planta en el medio ambiente se calcula multiplicando la producción de energía del sistema con CO2 y millas calculadas por el promedio de factores de cálculo de vehículos de pasajeros de gasolina suministrado por la EPA estadounidense y los estándares locales.",
                })}
              </div>

              <a
                href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references#miles"
                target="_blank"
                rel="noopener noreferrer"
                className="text-custom-yellow hover:text-custom-yellow/80 text-sm underline"
              >
                {t("seeCompleteCalculation")}
              </a>
            </div>
          </PopoverContent>
        </Popover>
      </h2>
      <div className="flex flex-col justify-around gap-8 sm:gap-12">
        {/* CO2 Emissions Saved */}
        <div className="relative flex flex-col sm:flex-row items-center hover:scale-105 transition-transform duration-300 mx-4 sm:mx-6 group">
          <div className="absolute inset-0 z-0 overflow-hidden rounded-lg pointer-events-none">
            <div className="absolute w-full h-full bg-gradient-to-br from-green-400 via-blue-400 to-transparent blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={`bubble-${i}`}
                className={`absolute ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                } opacity-0 group-hover:opacity-10 animate-bubble`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${Math.random() * 1.5 + 0.5}rem`,
                }}
              >
                <BsCircleFill />
              </div>
            ))}
          </div>
          <IoEarthOutline className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute text-[100px] md:text-[180px] lg:text-[220px] xl:text-[160px] z-20 top-1/2 -translate-y-1/2 -left-4 md:left-4 xl:-left-6 2xl:left-8 text-custom-dark-blue dark:text-custom-yellow" />
          <div className="z-10 bg-slate-50/70 dark:bg-slate-700/50 p-4 sm:p-6 w-full rounded-lg shadow-md flex flex-col items-end sm:items-center md:items-end gap-2 sm:gap-4">
            <div className="flex items-center">
              {!isMobile && (
                <Popover showArrow offset={20} placement="bottom">
                  <PopoverTrigger>
                    <Info
                      className="font-secondary h-4 w-4 mr-2 mt-1 text-custom-dark-blue dark:text-custom-yellow text-xl cursor-pointer hover:text-opacity-80 transition"
                      aria-label={t("moreInfo")}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small">
                        {t("gasEmissionSavedTooltip", {
                          defaultValue:
                            "Quantity of CO2 emissions that would have been generated by an equivalent fossil fuel system.",
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <p className="text-sm md:text-lg font-medium text-slate-600 dark:text-slate-300 max-w-36 xl:max-w-full text-right">
                {t("co2EmissionsSaved")}
              </p>
            </div>
            <div className="flex items-center">
              {isMobile && (
                <Popover showArrow offset={20} placement="bottom">
                  <PopoverTrigger>
                    <Info
                      className="h-4 w-4 mr-2 mt-1 text-custom-dark-blue dark:text-custom-yellow text-xl cursor-pointer hover:text-opacity-80 transition"
                      aria-label={t("moreInfo")}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small">
                        {t("gasEmissionSavedTooltip", {
                          defaultValue:
                            "Quantity of CO2 emissions that would have been generated by an equivalent fossil fuel system.",
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-custom-dark-blue dark:text-custom-yellow text-center">
                {benefits?.gasEmissionSaved?.co2.toFixed(2) || 0} {t("kg")}
              </p>
            </div>
          </div>
        </div>

        {/* Equivalent Trees Planted */}
        <div className="relative flex flex-col sm:flex-row items-center hover:scale-105 transition-transform duration-300 mx-4 sm:mx-6 group">
          <div className="absolute inset-0 z-0 overflow-hidden rounded-lg pointer-events-none">
            <div className="absolute w-full h-full bg-gradient-to-br from-yellow-300 via-green-400 to-transparent blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={`leaf-${i}`}
                className={`absolute ${
                  theme === "dark" ? "text-green-500" : "text-green-600"
                } opacity-0 group-hover:opacity-20 animate-leaf-fall`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${Math.random() * 2 + 1.3}rem`,
                }}
              >
                <IoLeaf />
              </div>
            ))}
          </div>
          <div className="z-10 bg-slate-50/70 dark:bg-slate-700/50 p-4 sm:p-6 w-full rounded-lg shadow-md flex flex-col items-start sm:items-center md:items-start gap-2 sm:gap-4">
            <div className="flex items-center">
              <p className="text-sm sm:text-lg font-medium text-slate-600 dark:text-slate-300 max-w-36 xl:max-w-full">
                {t("equivalentTreesPlanted")}
              </p>
              {!isMobile && (
                <Popover showArrow offset={20} placement="bottom">
                  <PopoverTrigger>
                    <Info
                      className="h-4 w-4 ml-2 mt-1 text-custom-dark-blue dark:text-custom-yellow text-xl cursor-pointer hover:text-opacity-80 transition"
                      aria-label={t("moreInfo")}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small">
                        {t("treesPlantedTooltip", {
                          defaultValue:
                            "Equivalent planting of new trees for reducing CO2 levels.",
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="flex items-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-custom-dark-blue dark:text-custom-yellow text-center">
                {(typeof benefits?.treesPlanted === "number" &&
                  benefits?.treesPlanted.toFixed(0)) ||
                  0}
              </p>
              {isMobile && (
                <Popover showArrow offset={20} placement="bottom">
                  <PopoverTrigger>
                    <Info
                      className="h-4 w-4 ml-2 mt-1 text-custom-dark-blue dark:text-custom-yellow text-xl cursor-pointer hover:text-opacity-80 transition"
                      aria-label={t("moreInfo")}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small">
                        {t("treesPlantedTooltip", {
                          defaultValue:
                            "Equivalent planting of new trees for reducing CO2 levels.",
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
          <PiTree className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute text-[100px] md:text-[180px] lg:text-[220px] xl:text-[160px] z-20 top-1/2 -translate-y-1/2 -right-4 md:right-4 xl:-right-6 2xl:right-8 text-custom-dark-blue dark:text-custom-yellow" />
        </div>
        {/* Light Bulbs Card */}
        <div className="relative flex flex-col sm:flex-row items-center hover:scale-105 transition-transform duration-300 mx-4 sm:mx-6 group">
          <div className="absolute inset-0 z-0 overflow-hidden rounded-lg pointer-events-none">
            <div className="absolute w-full h-full bg-gradient-to-br from-yellow-400 via-orange-300 to-transparent blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={`bulb-${i}`}
                className={`absolute ${
                  theme === "dark" ? "text-yellow-400" : "text-yellow-500"
                } opacity-0 group-hover:opacity-10 animate-bubble`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${Math.random() * 1.5 + 0.5}rem`,
                }}
              >
                <BsCircleFill />
              </div>
            ))}
          </div>
          <PiLightbulbFilament  className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute text-[100px] md:text-[180px] lg:text-[220px] xl:text-[160px] z-20 top-1/2 -translate-y-1/2 -left-4 md:left-4 xl:-left-6 2xl:left-8 text-custom-dark-blue dark:text-custom-yellow" />
          <div className="z-10 bg-slate-50/70 dark:bg-slate-700/50 p-4 sm:p-6 w-full rounded-lg shadow-md flex flex-col items-end sm:items-center md:items-end gap-2 sm:gap-4">
            <div className="flex items-center">
              {!isMobile && (
                <Popover showArrow offset={20} placement="bottom">
                  <PopoverTrigger>
                    <Info
                      className="font-secondary h-4 w-4 mr-2 mt-1 text-custom-dark-blue dark:text-custom-yellow text-xl cursor-pointer hover:text-opacity-80 transition"
                      aria-label={t("moreInfo")}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small">
                        {t("equivalentLightBulbsTooltip", {
                          defaultValue:
                            "Number of light bulbs that could be powered with the energy generated by your solar system.",
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <p className="text-sm md:text-lg font-medium text-slate-600 dark:text-slate-300 max-w-36 xl:max-w-full text-right">
                {t("equivalentLightBulbs")}
              </p>
            </div>
            <div className="flex items-center">
              {isMobile && (
                <Popover showArrow offset={20} placement="bottom">
                  <PopoverTrigger>
                    <Info
                      className="h-4 w-4 mr-2 mt-1 text-custom-dark-blue dark:text-custom-yellow text-xl cursor-pointer hover:text-opacity-80 transition"
                      aria-label={t("moreInfo")}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small">
                        {t("equivalentLightBulbsTooltip", {
                          defaultValue:
                            "Number of light bulbs that could be powered with the energy generated by your solar system.",
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-custom-dark-blue dark:text-custom-yellow text-center">
                {Math.floor(benefits?.lightBulbs || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnvironmentalBenefits;
