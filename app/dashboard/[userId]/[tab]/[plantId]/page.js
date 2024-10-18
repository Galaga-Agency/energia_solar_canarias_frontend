"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectPlants } from "@/store/slices/plantsSlice";
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
import useLocalStorageState from "use-local-storage-state";
import Loading from "@/components/Loading";
import "react-loading-skeleton/dist/skeleton.css";
import CustomSkeleton from "@/components/Skeleton";

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
  const plants = useSelector(selectPlants);
  const [plant, setPlant] = useState(null);
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_API_KEY;
  const { isMobile, isDesktop } = useDeviceType();
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const selectedPlant = plants.find((p) => p.id === parseInt(plantId));
    setPlant(selectedPlant);
  }, [plantId, plants]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1000);

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

  if (!plant) {
    return <Loading />;
  }

  const powerData = {
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
  };

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

  if (!plant || !isMounted) {
    return (
      <PageTransition>
        <div
          className={`min-h-screen w-auto flex flex-col ${
            theme === "dark"
              ? "bg-gray-900"
              : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
          } relative overflow-y-auto p-6`}
        >
          <div className="flex justify-between items-center mb-6 gap-6">
            <button onClick={() => window.history.back()}>
              <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow" />
            </button>
            <h1 className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow text-right">
              {plant.name}
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
            {weatherData && (
              <WeatherWidget
                weatherData={weatherData}
                batterySOC={plant.batterySOC}
              />
            )}
            {plant.images.length > 0 ? (
              <ImageCarousel images={plant.images} />
            ) : (
              <p>No images available</p>
            )}
          </div>
          {/* Skeleton for plant details */}
          <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 flex flex-col justify-between">
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
    <PageTransition>
      <div
        className={`min-h-screen w-auto flex flex-col ${
          theme === "dark"
            ? "bg-gray-900"
            : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
        } relative overflow-y-auto p-6`}
      >
        <div className="flex justify-between items-center mb-6 gap-6">
          <button onClick={() => window.history.back()}>
            <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow" />
          </button>
          <h1 className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow text-right">
            {plant.name}
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
          {weatherData && (
            <WeatherWidget
              weatherData={weatherData}
              batterySOC={plant.batterySOC}
            />
          )}
          {plant.images.length > 0 ? (
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
  );
};

export default PlantDetailsPage;
