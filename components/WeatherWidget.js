"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import BatteryIndicator from "@/components/BatteryIndicator";
import useDeviceType from "@/hooks/useDeviceType";

const WeatherWidget = ({ weatherData, batterySOC, theme }) => {
  const { t } = useTranslation();
  const { isDesktop } = useDeviceType();
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date().toISOString());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm min-h-[400px] flex flex-col">
      <h2 className="text-xl mb-4 text-custom-dark-blue dark:text-custom-yellow">
        {t("weatherForecast")}
      </h2>
      <div className="flex justify-between">
        <div className="flex items-center mb-4">
          <img
            src={`https:${weatherData?.current.condition.icon}`}
            alt="Weather Icon"
            className="w-16 h-16"
          />
          <div className="ml-4">
            <h3 className="text-lg dark:text-white">
              <strong>{weatherData?.current.condition.text}</strong>
            </h3>
            <p className="text-md dark:text-custom-light-gray">
              <strong>{t("temperature")}:</strong>{" "}
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {weatherData?.current.temp_c}°C
              </span>
            </p>
            <p className="text-md dark:text-custom-light-gray">
              <strong>{t("humidity")}:</strong>{" "}
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {weatherData?.current.humidity} %
              </span>
            </p>
            <p className="text-md mb-1 dark:text-custom-light-gray">
              <strong>{t("wind")}:</strong>{" "}
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {weatherData?.current.wind_kph} kph
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
      <h2
        className={`text-lg my-2 mt-4 text-custom-dark-blue dark:text-custom-yellow`}
      >
        {isDesktop ? t("threeDayForecast") : t("twoDayForecast")}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {weatherData?.forecast.forecastday.map((day) => (
          <div
            key={day.date}
            className="p-2 bg-white dark:bg-custom-dark-blue rounded-lg text-center"
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
    </div>
  );
};

export default WeatherWidget;
