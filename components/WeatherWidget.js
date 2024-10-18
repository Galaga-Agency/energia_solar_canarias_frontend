"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import BatteryIndicator from "@/components/BatteryIndicator";
import useDeviceType from "@/hooks/useDeviceType";
import { useSkeletonLoader } from "@/hooks/useSkeletonLoader";
import CustomSkeleton from "@/components/Skeleton";
import useLocalStorageState from "use-local-storage-state";

const WeatherWidget = ({ weatherData, batterySOC }) => {
  const { t } = useTranslation();
  const { isDesktop } = useDeviceType();
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString());
  const [isMounted, setIsMounted] = useState(false);
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1500); // Simulated delay to show skeleton for a bit

    return () => clearTimeout(timer);
  }, []);

  const widgetSkeleton = useSkeletonLoader(
    !isMounted,
    <div className="w-full h-full">
      <div className="w-full mb-4">
        <CustomSkeleton width="40%" height="30px" theme={theme} />
      </div>
      <div className="flex justify-between">
        <div className="flex items-center mb-4">
          <CustomSkeleton width="64px" height="64px" theme={theme} />
          <div className="ml-4 space-y-2">
            <CustomSkeleton width="180px" height="24px" theme={theme} />
            <CustomSkeleton width="120px" height="20px" theme={theme} />
            <CustomSkeleton width="120px" height="20px" theme={theme} />
            <CustomSkeleton width="120px" height="20px" theme={theme} />
            <CustomSkeleton width="120px" height="20px" theme={theme} />
          </div>
        </div>
        {isDesktop && (
          <div className="flex flex-col">
            <CustomSkeleton
              width="150px"
              height="30px"
              className="mb-4"
              theme={theme}
            />
            <CustomSkeleton width="100px" height="64px" theme={theme} />
          </div>
        )}
      </div>
      <div className="w-full my-2 mt-4">
        <CustomSkeleton width="30%" height="30px" theme={theme} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: isDesktop ? 3 : 2 }).map((_, index) => (
          <div
            key={index}
            className="p-2 bg-gray-200 dark:bg-custom-dark-blue rounded-lg text-center"
          >
            <CustomSkeleton
              width="80px"
              height="24px"
              theme={theme}
              className="mx-auto mb-2"
            />
            <CustomSkeleton
              width="40px"
              height="40px"
              className="mx-auto"
              theme={theme}
            />
            <div className="flex justify-center mt-2">
              <CustomSkeleton width="60px" height="20px" theme={theme} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date().toISOString());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 transition-all duration-300 w-full h-full min-h-[400px]">
      {!isMounted ? (
        widgetSkeleton
      ) : (
        <>
          <h2 className="text-xl mb-4 text-custom-dark-blue dark:text-custom-yellow">
            {t("weatherForecast")}
          </h2>
          <div className="flex justify-between">
            <div className="flex items-center mb-4">
              <img
                src={`https:${weatherData.current.condition.icon}`}
                alt="Weather Icon"
                className="w-16 h-16"
              />
              <div className="ml-4">
                <h3 className="text-lg dark:text-white">
                  <strong>{weatherData.current.condition.text}</strong>
                </h3>
                <p className="text-md dark:text-custom-light-gray">
                  <strong>{t("temperature")}:</strong>{" "}
                  <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                    {weatherData.current.temp_c}°C
                  </span>
                </p>
                <p className="text-md dark:text-custom-light-gray">
                  <strong>{t("humidity")}:</strong>{" "}
                  <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                    {weatherData.current.humidity} %
                  </span>
                </p>
                <p className="text-md mb-1 dark:text-custom-light-gray">
                  <strong>{t("wind")}:</strong>{" "}
                  <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                    {weatherData.current.wind_kph} kph
                  </span>
                </p>
                <p className="text-md dark:text-custom-light-gray">
                  <strong>{t("lastUpdate")}:</strong>{" "}
                  <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                    {new Date(lastUpdate).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
            {isDesktop && (
              <div>
                <h2 className="text-xl font-primary mb-4 text-custom-dark-blue dark:text-custom-yellow">
                  {t("batteryStatus")}
                </h2>
                <BatteryIndicator batterySOC={batterySOC} />
              </div>
            )}
          </div>
          {isDesktop ? (
            <h2 className="text-lg my-2 mt-4 text-custom-dark-blue dark:text-custom-yellow">
              {t("threeDayForecast")}
            </h2>
          ) : (
            <h2 className="text-lg my-2 mt-4 text-custom-dark-blue dark:text-custom-yellow">
              {t("twoDayForecast")}
            </h2>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {weatherData.forecast.forecastday.map((day) => (
              <div
                key={day.date}
                className="p-2 bg-gray-200 dark:bg-custom-dark-blue rounded-lg text-center"
              >
                <p className="font-semibold dark:text-custom-light-gray">
                  {day.date}
                </p>
                <img
                  src={`https:${day.day.condition.icon}`}
                  alt="Weather Icon"
                  className="w-10 h-10 mx-auto"
                />
                <div className="flex justify-center dark:text-custom-light-gray">
                  <p>{day.day.maxtemp_c}°C</p>
                  <p>&nbsp;/&nbsp;</p>
                  <p>{day.day.mintemp_c}°C</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;
