"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { useTranslation } from "next-i18next";
import WeatherWidget from "@/components/WeatherWidget";
import ImageCarousel from "@/components/ImageCarousel";
import PlantDetailsSkeleton from "@/components/LoadingSkeletons/PlantDetailsSkeleton";
import PageTransition from "@/components/PageTransition";
import Texture from "@/components/Texture";
import { IoArrowBackCircle } from "react-icons/io5";
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

const PlantDetailsPage = ({ params }) => {
  const { userId, plantId } = params;
  const [plants, setPlants] = useState([]);
  const [plant, setPlant] = useState(null);
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_API_KEY;
  const theme = useSelector(selectTheme);
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile, isDesktop } = useDeviceType();

  useEffect(() => {
    const fetchPlantsData = async () => {
      try {
        const response = await fetch("/plants.json");
        const data = await response.json();
        console.log("Fetched plants data:", data.plants);
        setPlants(data.plants);
      } catch (error) {
        console.error("Error fetching the plants data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlantsData();
  }, []);

  useEffect(() => {
    if (plants.length > 0) {
      const selectedPlant = plants.find((p) => p.id === parseInt(plantId));
      setPlant(selectedPlant);
    }
  }, [plants, plantId]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (plant) {
        const cityName = plant.location.city;
        try {
          const response = await axios.get(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=3&aqi=no&alerts=no`
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

  if (!plant) {
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
              {t("noPlantData")}
            </h1>
          </div>
          <p>{t("plantNotFound")}</p>
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
        <div className="flex justify-between items-center mb-6 gap-6">
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
        <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 flex flex-col justify-between">
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
          <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 flex flex-col justify-between">
            <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow">
              {t("batteryStatus")}
            </h2>
            <BatteryIndicator batterySOC={plant.storageData.batteryCount} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 transition-all duration-300 flex flex-col justify-between">
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
          <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 transition-all duration-300 flex flex-col justify-between">
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
        <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 mt-6 transition-all duration-300">
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
