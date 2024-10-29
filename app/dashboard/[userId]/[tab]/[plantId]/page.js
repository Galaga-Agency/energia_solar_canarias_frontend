"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectPlants } from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import { useTranslation } from "next-i18next";
import { Line } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdOutlineCo2 } from "react-icons/md";
import {
  faTree,
  faSeedling,
  faWind,
  faEuroSign,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { IoArrowBackCircle } from "react-icons/io5";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import WeatherWidget from "@/components/WeatherWidget";
import ImageCarousel from "@/components/ImageCarousel";
import BatteryIndicator from "@/components/BatteryIndicator";
import useDeviceType from "@/hooks/useDeviceType";
import PageTransition from "@/components/PageTransition";
import Loading from "@/components/Loading";
import "react-loading-skeleton/dist/skeleton.css";
import CustomSkeleton from "@/components/Skeleton";
import { motion } from "framer-motion";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Image from "next/image";
import Texture from "@/components/Texture";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PlantDetailsPage = ({ params }) => {
  const { userId, plantId } = params;
  const [plants, setPlants] = useState([]);
  const [plant, setPlant] = useState(null);
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_API_KEY;
  const { isMobile, isDesktop } = useDeviceType();
  const theme = useSelector(selectTheme);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlantsData = async () => {
      try {
        const response = await fetch("/plants.json");
        const data = await response.json();
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
    const selectedPlant = plants.find((p) => p.id === parseInt(plantId));
    setPlant(selectedPlant);
  }, [plantId, plants]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (plant) {
        const cityName = plant.location;
        try {
          let response;

          if (!isDesktop) {
            response = await axios.get(
              `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=2&aqi=no&alerts=no`
            );
          } else {
            response = await axios.get(
              `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=3&aqi=no&alerts=no`
            );
          }

          setWeatherData(response.data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    };
    fetchWeatherData();
  }, [plant, apiKey, isMobile, isDesktop]);

  const powerData = plant?.timeSeriesPowerData
    ? {
        labels: plant.timeSeriesPowerData.map((data) => data.time),
        datasets: [
          {
            label: t("powerKW"),
            data: plant.timeSeriesPowerData.map((data) => data.powerKW),
            borderColor: "rgb(255, 213, 122)",
            backgroundColor: "rgba(255, 213, 122, 0.5)",
            borderWidth: 2,
            fill: true,
            pointRadius: 0,
          },
        ],
      }
    : null;

  const options = {
    responsive: true,
    animation: {
      x: {
        duration: 3000,
        from: 0,
      },
      y: {
        duration: 3000,
        from: 500,
      },
    },
  };

  const statusColors = {
    working: "bg-green-500",
    error: "bg-red-500",
    waiting: "bg-yellow-500",
    disconnected: "bg-gray-500",
  };

  if (!isMounted) {
    return (
      <PageTransition>
        <div
          className={`min-h-screen w-auto flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto p-6`}
        >
          <Texture />
          <div className="flex justify-between items-center mb-6 gap-6">
            <button onClick={() => window.history.back()}>
              <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow" />
            </button>
            <h1 className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow text-right">
              {plant ? plant.name : ""}
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
            {weatherData && (
              <WeatherWidget
                weatherData={weatherData}
                batterySOC={plant.batterySOC}
              />
            )}
            {plant && plant.images.length > 0 ? (
              <ImageCarousel images={plant.images} />
            ) : (
              <p>No images available</p>
            )}
          </div>
          {/* Skeleton for plant details */}
          <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 flex flex-col justify-between min-h-[235px]">
            <CustomSkeleton
              width="60%"
              height="30px"
              className="mb-4"
              theme={theme}
            />
            <div className="flex items-start justify-between gap-2 mb-4">
              <CustomSkeleton
                width="30px"
                height="30px"
                className="mr-2"
                theme={theme}
              />
              <CustomSkeleton width="120px" height="24px" theme={theme} />
              <CustomSkeleton width="80px" height="24px" theme={theme} />
            </div>
          </div>

          {/* Skeleton for environmental impact */}
          {!isDesktop && (
            <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 flex flex-col justify-between">
              <CustomSkeleton
                width="150px"
                height="30px"
                className="mb-4"
                theme={theme}
              />
              <CustomSkeleton width="100px" height="64px" theme={theme} />
            </div>
          )}

          {/* Skeleton for environmental impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 transition-all duration-300 flex flex-col justify-between">
              <CustomSkeleton
                width="60%"
                height="30px"
                className="mb-4"
                theme={theme}
              />
              <CustomSkeleton
                width="80%"
                height="24px"
                className="mb-4"
                theme={theme}
              />
              <CustomSkeleton
                width="80%"
                height="24px"
                className="mb-4"
                theme={theme}
              />
              <CustomSkeleton width="80%" height="24px" theme={theme} />
            </div>

            {/* Skeleton for energy statistics */}
            <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 transition-all duration-300 flex flex-col justify-between">
              <CustomSkeleton
                width="60%"
                height="30px"
                className="mb-4"
                theme={theme}
              />
              <CustomSkeleton
                width="80%"
                height="24px"
                className="mb-4"
                theme={theme}
              />
              <CustomSkeleton
                width="80%"
                height="24px"
                className="mb-4"
                theme={theme}
              />
              <CustomSkeleton width="80%" height="24px" theme={theme} />
            </div>
          </div>

          {/* Skeleton for power time series */}
          <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 mt-6 transition-all duration-300">
            <CustomSkeleton
              width="60%"
              height="30px"
              className="mb-4"
              theme={theme}
            />
            <CustomSkeleton width="100%" height="300px" theme={theme} />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <>
      {plant ? (
        <PageTransition>
          <div
            className={`min-h-screen w-auto flex flex-col ${
              theme === "dark"
                ? "dark:bg-gray-900"
                : "light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray"
            } relative overflow-y-auto p-6`}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
              {weatherData && (
                <WeatherWidget
                  weatherData={weatherData}
                  batterySOC={plant.batterySOC}
                />
              )}
              {plant?.images.length > 0 ? (
                <ImageCarousel images={plant.images} />
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
                  {plant.location}
                </span>
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-left">
                  <FontAwesomeIcon
                    icon={faSeedling}
                    className="text-green-500 text-3xl mr-2"
                  />
                  <strong className="text-lg dark:text-custom-light-gray">
                    {t("currentPowerOutput")}{" "}
                  </strong>
                </div>
                <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow text-right">
                  {plant.currentPowerOutputKW} kW
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
                  {plant.totalIncomeEUR} EUR
                </span>
              </div>
            </div>
            {!isDesktop && (
              <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 flex flex-col justify-between">
                <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow">
                  {t("batteryStatus")}
                </h2>
                <BatteryIndicator batterySOC={plant.batterySOC} />
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
                    {plant.environmentalImpact.co2ReductionTons} tons
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
                    {plant.environmentalImpact.plantedTrees}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-left">
                    <FontAwesomeIcon
                      icon={faWind}
                      className="text-custom-dark-blue dark:text-custom-yellow text-3xl mr-2"
                    />
                    <strong className="text-lg dark:text-custom-light-gray">
                      {t("coalSavings")}
                    </strong>
                  </div>
                  <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                    {plant.environmentalImpact.coalSavingsTons} tons
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
                    {plant.capacityKW} kW
                  </span>
                </div>

                <div className="flex items-start justify-between mb-4">
                  <strong className="text-lg dark:text-custom-light-gray">
                    {t("monthlyGeneration")}
                  </strong>
                  <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                    {plant.monthlyGenerationKWh} kWh
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <strong className="text-lg dark:text-custom-light-gray">
                    {t("totalGenerated")}
                  </strong>
                  <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                    {plant.totalGeneratedMWh} MWh
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 mt-6 transition-all duration-300">
              <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow">
                {t("powerTimeSeries")}
              </h2>
              <div id="powerChart">
                <Line data={powerData} options={options} />
              </div>
            </div>
          </div>
        </PageTransition>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen text-center p-8">
          {isLoading ? (
            <Loading theme={theme} />
          ) : (
            <>
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={companyIcon}
                  alt="Company Icon"
                  className="w-36 h-36 mr-2"
                />
                <h2 className="text-2xl font-bold text-custom-dark-blue dark:text-custom-light-gray my-2">
                  {t("noDataFound")}
                </h2>
                <p className="text-md text-custom-dark-gray dark:text-custom-light-gray">
                  {t("tryAgainLater")}
                </p>
              </motion.div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default PlantDetailsPage;
