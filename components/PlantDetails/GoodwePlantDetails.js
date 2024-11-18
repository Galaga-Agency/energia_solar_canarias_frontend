"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
import { selectUser } from "@/store/slices/userSlice";
import {
  fetchPlantDetails,
  selectPlantDetails,
  selectLoadingDetails,
  selectDetailsError,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import PageTransition from "@/components/PageTransition";
import Texture from "@/components/Texture";
import EnergyFlowDisplay from "@/components/EnergyFlowDisplay";
import WeatherWidget from "@/components/WeatherWidget";
import ImageCarousel from "@/components/ImageCarousel";
import BatteryIndicator from "@/components/BatteryIndicator";
import {
  IoArrowBackCircle,
  IoLocationOutline,
  IoStatsChartSharp,
  IoFlashSharp,
  IoSpeedometerOutline,
} from "react-icons/io5";
import { PiSolarPanelFill } from "react-icons/pi";
import { BsCalendarMonth, BsLightningChargeFill } from "react-icons/bs";
import { BiRefresh } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { Building2, Tag } from "lucide-react";
import useDeviceType from "@/hooks/useDeviceType";

const GoodwePlantDetails = ({ plant }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectLoadingDetails);
  const error = useSelector(selectDetailsError);
  const { isMobile, isDesktop } = useDeviceType();
  const theme = useSelector(selectTheme);
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_API_KEY;

  useEffect(() => {
    if (user?.tokenIdentificador) {
      dispatch(
        fetchPlantDetails({
          userId: user.id,
          token: user.tokenIdentificador,
          plantId: plant.id,
          proveedor: plant.organization.toLowerCase(),
        })
      );
    }
  }, [dispatch, user.id, plant.id, user?.tokenIdentificador]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (plant && plant.location) {
        try {
          const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${
              plant.location
            }&days=${isDesktop ? 3 : 2}&aqi=no&alerts=no`
          );
          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    };
    fetchWeatherData();
  }, [plant, apiKey, isDesktop]);

  const statusColors = {
    working: "bg-green-500",
    error: "bg-red-500",
    waiting: "bg-yellow-500",
    disconnected: "bg-gray-500",
  };

  const renderInfoRow = (icon, label, value, statusColor) => (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center">
        <span className="text-custom-dark-blue dark:text-custom-yellow text-3xl mr-2">
          {icon}
        </span>
        <strong className="text-lg dark:text-custom-light-gray">{label}</strong>
      </div>
      <div className="flex items-center gap-2">
        {statusColor && (
          <div className={`w-3 h-3 rounded-full p-2 ${statusColor}`} />
        )}
        <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow text-right">
          {value}
        </span>
      </div>
    </div>
  );

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
            {/* Loading skeletons */}
          </div>
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
          <div className="absolute top-4 left-4">
            <button onClick={() => window.history.back()}>
              <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow" />
            </button>
          </div>
          <div className="flex flex-col items-center text-center mt-16">
            <PiSolarPanelFill className="text-6xl text-custom-dark-blue dark:text-custom-yellow mb-4" />
            <h1 className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow mb-2">
              {t("noPlantData")}
            </h1>
            <p className="text-lg font-secondary text-custom-dark-blue dark:text-custom-yellow mb-6">
              {t("plantNotFound")}
            </p>
            <button
              onClick={() =>
                dispatch(
                  fetchPlantDetails({
                    userid: user.id,
                    token: user.tokenIdentificador,
                    plantId: plant.id,
                    proveedor: plant.proveedor,
                  })
                )
              }
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

        {/* Header Section */}
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

        {/* Weather & Image Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <WeatherWidget
            weatherData={weatherData}
            batterySOC={plant.batterySOC}
            theme={theme}
          />
        </div>

        {/* Energy Flow Section */}
        <EnergyFlowDisplay plant={plant} />

        {/* Plant Details Section */}
        <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 mb-6 backdrop-blur-sm">
          <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow">
            {t("plantDetails")}
          </h2>

          <div className="flex flex-col gap-4">
            {renderInfoRow(
              <HiOutlineStatusOnline />,
              t("currentStatus"),
              t(`status.${plant.status}`),
              statusColors[plant.status]
            )}
            {renderInfoRow(
              <IoLocationOutline />,
              t("location"),
              plant.location
            )}
            {renderInfoRow(
              <LiaBirthdayCakeSolid />,
              t("installationDate"),
              new Intl.DateTimeFormat("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(plant.installationDate))
            )}
            {renderInfoRow(<Building2 />, t("poweredBy"), plant.organization)}
            {renderInfoRow(<Tag />, t("typeOfPlant"), t(`type_${plant.type}`))}
          </div>
        </div>

        {/* Battery Status for Mobile */}
        {!isDesktop && (
          <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 mb-6 backdrop-blur-sm flex flex-col justify-start">
            <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow">
              {t("batteryStatus")}
            </h2>
            <BatteryIndicator batterySOC={plant.batterySOC} />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Energy Statistics */}
          <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
            <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow flex items-center gap-2">
              <IoStatsChartSharp className="w-6 h-6" />
              {t("energyStatistics")}
            </h2>

            <div className="flex flex-col gap-4">
              {renderInfoRow(
                <IoFlashSharp />,
                t("currentPower"),
                `${plant.kpi?.power || 0} kW`
              )}
              {renderInfoRow(
                <PiSolarPanelFill />,
                t("totalCapacity"),
                `${plant.batteryCapacity / 10} kW`
              )}
              {renderInfoRow(
                <BsLightningChargeFill />,
                t("peakPower"),
                `${plant.peakPower || 0} kWp`
              )}
              {renderInfoRow(
                <BsCalendarMonth />,
                t("monthlyGeneration"),
                `${plant.kpi?.monthGeneration || 0} kWh`
              )}
              {renderInfoRow(
                <IoSpeedometerOutline />,
                t("totalGeneration"),
                `${plant.kpi?.totalPower || 0} kWh`
              )}
            </div>
          </div>
        </div>

        {/* Chart Section */}
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

export default GoodwePlantDetails;
