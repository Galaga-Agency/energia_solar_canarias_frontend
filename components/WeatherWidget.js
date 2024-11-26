"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  fetchGoodweWeatherData,
  selectWeatherData,
  selectWeatherLoading,
  selectWeatherError,
  fetchSolarEdgeWeatherData,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { BsCloudSun, BsSnow } from "react-icons/bs";
import { FiWind } from "react-icons/fi";
import useDeviceType from "@/hooks/useDeviceType";
import WeatherWidgetSkeleton from "./LoadingSkeletons/WeatherWidgetSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";

const WeatherWidget = ({ plant, address, provider }) => {
  const dispatch = useDispatch();
  const weatherData = useSelector(selectWeatherData);
  const weatherLoading = useSelector(selectWeatherLoading);
  const weatherError = useSelector(selectWeatherError);
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const { isDesktop } = useDeviceType();
  const theme = useSelector(selectTheme);

  console.log("address passed in weather widget: ", address);

  useEffect(() => {
    if (address && user?.tokenIdentificador && provider) {
      switch (provider.toLowerCase()) {
        case "goodwe":
          dispatch(
            fetchGoodweWeatherData({
              name: address,
              token: user.tokenIdentificador,
            })
          );
          break;
        case "solaredge":
          dispatch(
            fetchSolarEdgeWeatherData({
              name: address,
              token: user.tokenIdentificador,
            })
          );
          break;
        default:
          console.warn(`Unsupported provider: ${provider}`);
      }
    }
  }, [dispatch, address, user?.tokenIdentificador, provider]);

  const getWeatherIcon = (code, isToday = false) => {
    const sizeClass = isToday ? "text-8xl" : "text-4xl";
    const commonClass = `${sizeClass} text-custom-dark-blue dark:text-custom-yellow`;

    const icons = {
      0: <BsCloudSun className={`${commonClass}`} />, // Clear sky
      1: <BsCloudSun className={`${commonClass}`} />, // Mainly clear
      2: <BsCloudSun className={`${commonClass}`} />, // Partly cloudy
      3: <BsCloudSun className={`${commonClass}`} />, // Overcast
      45: <FiWind className={`${commonClass}`} />, // Fog
      48: <FiWind className={`${commonClass}`} />, // Depositing rime fog
      51: <BsCloudSun className={`${commonClass}`} />, // Light drizzle
      53: <BsCloudSun className={`${commonClass}`} />, // Moderate drizzle
      55: <BsCloudSun className={`${commonClass}`} />, // Dense drizzle
      56: <FiWind className={`${commonClass} text-blue-300`} />, // Light freezing drizzle
      57: <FiWind className={`${commonClass} text-blue-300`} />, // Dense freezing drizzle
      61: <BsCloudSun className={`${commonClass}`} />, // Slight rain
      63: <BsCloudSun className={`${commonClass}`} />, // Moderate rain
      65: <BsCloudSun className={`${commonClass}`} />, // Heavy rain
      66: <FiWind className={`${commonClass} text-blue-300`} />, // Light freezing rain
      67: <FiWind className={`${commonClass} text-blue-300`} />, // Heavy freezing rain
      71: <BsSnow className={`${commonClass}`} />, // Slight snowfall
      73: <BsSnow className={`${commonClass}`} />, // Moderate snowfall
      75: <BsSnow className={`${commonClass}`} />, // Heavy snowfall
      77: <BsSnow className={`${commonClass}`} />, // Snow grains
      80: <BsCloudSun className={`${commonClass}`} />, // Slight rain showers
      81: <BsCloudSun className={`${commonClass}`} />, // Moderate rain showers
      82: <BsCloudSun className={`${commonClass}`} />, // Violent rain showers
      85: <BsSnow className={`${commonClass}`} />, // Slight snow showers
      86: <BsSnow className={`${commonClass}`} />, // Heavy snow showers
      95: <FiWind className={`${commonClass} text-red-500`} />, // Thunderstorm
      96: <FiWind className={`${commonClass} text-red-500`} />, // Thunderstorm with light hail
      99: <FiWind className={`${commonClass} text-red-500`} />, // Thunderstorm with heavy hail
    };

    return icons[code] || <BsCloudSun className={`${commonClass}`} />;
  };

  return (
    <>
      {weatherLoading ? (
        <WeatherWidgetSkeleton theme={theme} />
      ) : (
        <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm flex flex-col h-full">
          <h2 className="text-xl font-semibold text-custom-dark-blue dark:text-custom-yellow mb-4">
            {t("weatherForecast")}
          </h2>

          {weatherLoading && (
            <p className="text-center text-custom-dark-blue dark:text-custom-yellow">
              {t("loading")}
            </p>
          )}

          {weatherError && (
            <p className="text-center text-red-500">
              {t("failedToFetchWeather")}
            </p>
          )}

          {!weatherLoading && !weatherError && weatherData && (
            <div className="flex flex-1 flex-col">
              {/* Today's Weather */}
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center shadow-md flex items-center justify-between flex-1">
                <div className="flex">
                  <p className="text-xl text-left text-slate-600 dark:text-slate-300">
                    {t("today")}
                  </p>
                  <div className="flex justify-center mt-2">
                    {getWeatherIcon(
                      weatherData?.daily?.weather_code?.[0],
                      true
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-4xl font-bold text-custom-dark-blue dark:text-custom-yellow">
                    {Math.round(weatherData?.current?.temperature_2m || 0)}°C
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    {t("wind")}:{" "}
                    {Math.round(weatherData?.current?.wind_speed_10m)} km/h
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {t("humidity")}:{" "}
                    {Math.round(weatherData?.current?.relative_humidity_2m)}%
                  </p>
                </div>
              </div>

              {/* Forecast */}
              <div className="flex-1 grid grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                {weatherData?.daily?.time
                  ?.slice(1, !isDesktop ? 3 : 4)
                  .map((date, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center shadow-md"
                    >
                      <div className="flex flex-col">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {new Date(date).toLocaleDateString("es-ES", {
                            weekday: "short",
                          })}
                        </p>
                        <p className="text-md font-semibold text-custom-dark-blue dark:text-custom-yellow">
                          {Math.round(
                            weatherData?.daily?.temperature_2m_min?.[
                              index + 1
                            ] || 0
                          )}
                          °/
                          {Math.round(
                            weatherData?.daily?.temperature_2m_max?.[
                              index + 1
                            ] || 0
                          )}
                          °C
                        </p>
                      </div>
                      <div className="flex justify-center mt-2">
                        {getWeatherIcon(
                          weatherData?.daily?.weather_code?.[index + 1]
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default WeatherWidget;
