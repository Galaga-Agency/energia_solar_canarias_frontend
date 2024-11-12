"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { useTranslation } from "next-i18next";
import WeatherWidget from "@/components/WeatherWidget";
import ImageCarousel from "@/components/ImageCarousel";
import PlantDetailsSkeleton from "@/components/LoadingSkeletons/PlantDetailsSkeleton";
import PageTransition from "@/components/PageTransition";
import Texture from "@/components/Texture";
import axios from "axios";
import BatteryIndicator from "@/components/BatteryIndicator";
import { MdOutlineCo2 } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEuroSign,
  faLocationDot,
  faSeedling,
  faTree,
} from "@fortawesome/free-solid-svg-icons";
import WeatherWidgetSkeleton from "@/components/LoadingSkeletons/WeatherWidgetSkeleton";
import ImageCarouselSkeleton from "@/components/LoadingSkeletons/ImageCarouselSkeleton";
import useDeviceType from "@/hooks/useDeviceType";
import EnergyFlowDisplay from "@/components/EnergyFlowDisplay";
import {
  fetchPlantDetails,
  selectPlantDetails,
  selectLoadingDetails,
  selectDetailsError,
} from "@/store/slices/plantsSlice";
import { IoArrowBackCircle } from "react-icons/io5";
import { FaSlash } from "react-icons/fa6";
import { selectUser } from "@/store/slices/userSlice";
import { FaSolarPanel, FaSun } from "react-icons/fa";
import { PiSolarPanelFill } from "react-icons/pi";
import useRefresh from "@/hooks/useRefresh";
import { BiRefresh } from "react-icons/bi";

const PlantDetailsPage = ({ params }) => {
  const { plantId, userId } = params;
  const dispatch = useDispatch();
  const plant = useSelector(selectPlantDetails);
  const isLoading = useSelector(selectLoadingDetails);
  const error = useSelector(selectDetailsError);
  const theme = useSelector(selectTheme);
  const { isMobile, isDesktop } = useDeviceType();
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_API_KEY;
  const user = useSelector(selectUser);
  const { refreshPage } = useRefresh();

  useEffect(() => {
    dispatch(
      fetchPlantDetails({ userId, token: user.tokenIdentificador, plantId })
    );
  }, [dispatch, userId, plantId]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (plant) {
        const cityName = plant.location.city;
        try {
          const response = await axios.get(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=${
              isDesktop ? 3 : 2
            }&aqi=no&alerts=no`
          );
          setWeatherData(response.data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    };
    fetchWeatherData();
  }, [plant, apiKey]);

  const statusColors = {
    working: "bg-green-500",
    error: "bg-red-500",
    waiting: "bg-yellow-500",
    disconnected: "bg-gray-500",
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div
          className={`min-h-screen flex flex-col p-6 ${
            theme === "dark"
              ? "dark:bg-gray-900"
              : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
          }`}
        >
          <Texture />
          <div className="flex justify-between items-center mb-6 gap-6">
            <button onClick={() => window.history.back()}>
              <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow" />
            </button>
            <h1 className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow text-right">
              {t("loading")}
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 min-h-[400px]">
            <WeatherWidgetSkeleton theme={theme} />
            <div>
              <ImageCarouselSkeleton theme={theme} />
            </div>
          </div>
          <PlantDetailsSkeleton theme={theme} />
        </div>
      </PageTransition>
    );
  }

  if (error || !plant) {
    return (
      <PageTransition>
        <div
          className={`min-h-screen flex flex-col items-center justify-center p-6 ${
            theme === "dark"
              ? "dark:bg-gray-900"
              : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
          }`}
        >
          <Texture />

          {/* Back button in top-left corner */}
          <div className="absolute top-4 left-4">
            <button onClick={() => window.history.back()}>
              <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow" />
            </button>
          </div>

          {/* Centered content for error or no data */}
          <div className="flex flex-col items-center text-center mt-16">
            {error ? (
              <>
                <div className="relative">
                  <FaSolarPanel className="text-8xl text-red-500 mb-4" />
                  <FaSlash className="absolute text-red-500 text-9xl -top-4 -right-2" />
                </div>
                <h1 className="text-4xl font-primary text-red-500 mb-2">
                  {t("errorLoadingData")}
                </h1>
                <p className="text-lg font-secondary text-custom-dark-blue dark:text-custom-yellow mb-6">
                  {t("errorMessage") || t("errorLoadingData")}
                </p>
              </>
            ) : (
              <>
                <PiSolarPanelFill className="text-6xl text-custom-dark-blue dark:text-custom-yellow mb-4" />
                <h1 className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow mb-2">
                  {t("noPlantData")}
                </h1>
                <p className="text-lg font-secondary text-custom-dark-blue dark:text-custom-yellow mb-6">
                  {t("plantNotFound")}
                </p>
              </>
            )}
            <button
              onClick={refreshPage}
              className="flex items-center gap-2 mt-4 text-lg font-primary text-custom-dark-blue dark:text-custom-yellow hover:scale-105 transition-transform"
            >
              <BiRefresh className="text-2xl" />
              {t("refresh")}
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div
        className={`min-h-screen flex flex-col p-6 ${
          theme === "dark"
            ? "dark:bg-gray-900"
            : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
        }`}
      >
        <Texture />
        <div className="flex justify-between items-start mb-6 gap-6">
          <button onClick={() => window.history.back()}>
            <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow" />
          </button>
          <div className="flex items-center">
            {!isMobile && (
              <div
                className={`w-5 h-5 rounded-full p-2 mt-1 mr-4 ${
                  statusColors[plant.status]
                }`}
              />
            )}
            <h1 className="text-4xl text-custom-dark-blue dark:text-custom-yellow text-right">
              {plant?.name || ""}
            </h1>
            {isMobile && (
              <div
                className={`w-5 h-5 rounded-full p-2 mt-1 ml-3 ${
                  statusColors[plant.status]
                }`}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <WeatherWidget
            weatherData={weatherData}
            batterySOC={plant.storageData.batteryCount}
            theme={theme}
          />
          {plant.image.uri ? (
            <ImageCarousel images={[plant.image.uri]} />
          ) : (
            <p>No images available</p>
          )}
        </div>
        <EnergyFlowDisplay plantId={plant.id} />
        <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 mb-6 backdrop-blur-sm">
          <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow">
            {t("plantDetails")}
          </h2>
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex items-left">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-custom-dark-blue dark:text-custom-yellow text-3xl mr-2"
              />
              <strong className="text-lg dark:text-custom-light-gray">
                {t("location")}
              </strong>
            </div>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow text-right">
              {plant.location.address}, {plant.location.city},{" "}
              {plant.location.country}
            </span>
          </div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-left">
              <FontAwesomeIcon
                icon={faSeedling}
                className="text-green-500 text-3xl mr-2"
              />
              <strong className="text-lg dark:text-custom-light-gray">
                {t("currentPowerOutput")}
              </strong>
            </div>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow text-right">
              {plant.powerFlow.PV.currentPower} kW
            </span>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex items-left">
              <FontAwesomeIcon
                icon={faEuroSign}
                className="text-custom-dark-blue dark:text-custom-yellow text-3xl mr-2"
              />
              <strong className="text-lg dark:text-custom-light-gray">
                {t("totalIncome")}
              </strong>
            </div>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow text-right">
              {plant.environmentalBenefits.gasEmissionSaved.co2} EUR
            </span>
          </div>
        </div>
        {!isDesktop && (
          <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 mb-6 backdrop-blur-sm flex flex-col justify-start">
            <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow">
              {t("batteryStatus")}
            </h2>
            <BatteryIndicator batterySOC={plant.storageData.batteryCount} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
            <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow">
              {t("environmentalImpact")}
            </h2>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-left">
                <MdOutlineCo2 className="text-custom-dark-blue dark:text-custom-yellow text-3xl mr-2" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("co2Reduction")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {plant.environmentalBenefits.gasEmissionSaved.co2} Kg
              </span>
            </div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-left">
                <FontAwesomeIcon
                  icon={faTree}
                  className="text-green-500 text-3xl mr-2"
                />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("plantedTrees")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {plant.environmentalBenefits.treesPlanted}
              </span>
            </div>
          </div>
          <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
            <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow">
              {t("energyStatistics")}
            </h2>
            <div className="flex items-start justify-between mb-4">
              <strong className="text-lg dark:text-custom-light-gray">
                {t("capacity")}
              </strong>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {plant.peakPower} kW
              </span>
            </div>
            <div className="flex items-start justify-between mb-4">
              <strong className="text-lg dark:text-custom-light-gray">
                {t("monthlyGeneration")}
              </strong>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {/* Add monthly generation logic if available */}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <strong className="text-lg dark:text-custom-light-gray">
                {t("totalGenerated")}
              </strong>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {/* Add total generated logic if available */}
              </span>
            </div>
          </div>
        </div>
        <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm mt-6">
          <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow">
            {t("powerTimeSeries")}
          </h2>
          <div id="powerChart"></div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PlantDetailsPage;
