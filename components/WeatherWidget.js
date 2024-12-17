"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  fetchGoodweWeatherData,
  selectWeatherData,
  selectWeatherLoading,
  selectWeatherError,
  fetchSolarEdgeWeatherData,
  fetchVictronEnergyWeatherData,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import {
  BsSun,
  BsCloudSun,
  BsCloud,
  BsCloudRain,
  BsCloudRainHeavy,
  BsCloudDrizzle,
  BsCloudSnow,
  BsSnow,
  BsCloudLightningRain,
  BsCloudFog,
} from "react-icons/bs";
import { WiDayFog, WiNightAltThunderstorm } from "react-icons/wi";
import useDeviceType from "@/hooks/useDeviceType";
import WeatherSkeleton from "@/components/loadingSkeletons/WeatherSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";

const WeatherWidget = ({ plant, address, provider, lat, lng }) => {
  const dispatch = useDispatch();
  const weatherData = useSelector(selectWeatherData);
  const weatherLoading = useSelector(selectWeatherLoading);
  const weatherError = useSelector(selectWeatherError);
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const token = useMemo(() => user?.tokenIdentificador, [user]);
  const theme = useSelector(selectTheme);
  const { isDesktop } = useDeviceType();
  const [retryCount, setRetryCount] = useState(0);

  const fetchWeatherData = () => {
    // Log the data to verify
    // console.log("Data being passed:", { lat, lng, token, provider });

    // Ensure required data is present for VictronEnergy (lat, lng, token) or Goodwe/SolarEdge (address, provider, token)
    if (
      (provider === "victronenergy" && (!lat || !lng || !token)) ||
      (provider !== "victronenergy" && (!address || !provider || !token))
    ) {
      console.warn("Missing required data. Waiting for user data...");
      return;
    }

    // Switch on the provider to handle the different API requirements
    switch (provider.toLowerCase()) {
      case "goodwe" || "ENERGIA Y CALOR SOLAR DEL ATLANTICO SL":
        // For Goodwe, pass address, provider, and token
        dispatch(fetchGoodweWeatherData({ name: address, token }));
        break;
      case "solaredge":
        // For SolarEdge, pass address, provider, and token
        dispatch(fetchSolarEdgeWeatherData({ name: address, token }));
        break;
      case "victronenergy":
        // For Victron Energy, pass lat, lng, and token
        dispatch(fetchVictronEnergyWeatherData({ lat, lng, token }));
        break;
      default:
        console.warn(`Unsupported provider: ${provider}`);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (retryCount === 0) fetchWeatherData();
  }, [address, token, provider, retryCount]);

  // Retry logic
  useEffect(() => {
    if (weatherError && retryCount < 5) {
      const retryTimeout = setTimeout(() => {
        console.log(`Retrying fetch (attempt ${retryCount + 1}/5)...`);
        setRetryCount((prev) => prev + 1);
        fetchWeatherData();
      }, 2000); // Retry after 2 seconds

      return () => clearTimeout(retryTimeout);
    }
  }, [weatherError, retryCount]);

  // Reset retry count when dependencies change
  useEffect(() => {
    setRetryCount(0);
  }, [address, token, provider]);

  const getWeatherIcon = (code, isToday = false) => {
    const sizeClass = isToday
      ? "text-8xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]"
      : "text-4xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]";
    const commonClass = `${sizeClass} text-custom-dark-blue dark:text-custom-yellow`;

    const icons = {
      0: <BsSun className={`${commonClass}`} />, // Clear sky
      1: <BsSun className={`${commonClass}`} />, // Mainly clear
      2: <BsCloudSun className={`${commonClass}`} />, // Partly cloudy
      3: <BsCloudSun className={`${commonClass}`} />, // Overcast
      45: <WiDayFog className={`${commonClass}`} />, // Fog
      48: <WiDayFog className={`${commonClass}`} />, // Depositing rime fog
      51: <BsCloudDrizzle className={`${commonClass}`} />, // Light drizzle
      53: <BsCloudDrizzle className={`${commonClass}`} />, // Moderate drizzle
      55: <BsCloudDrizzle className={`${commonClass}`} />, // Dense drizzle
      56: <BsCloudRain className={`${commonClass} text-blue-300`} />, // Light freezing drizzle
      57: <BsCloudRain className={`${commonClass} text-blue-300`} />, // Dense freezing drizzle
      61: <BsCloudRain className={`${commonClass}`} />, // Slight rain
      63: <BsCloudRainHeavy className={`${commonClass}`} />, // Moderate rain
      65: <BsCloudRainHeavy className={`${commonClass}`} />, // Heavy rain
      66: <BsCloudRain className={`${commonClass} text-blue-300`} />, // Light freezing rain
      67: <BsCloudRainHeavy className={`${commonClass} text-blue-300`} />, // Heavy freezing rain
      71: <BsSnow className={`${commonClass}`} />, // Slight snowfall
      73: <BsCloudSnow className={`${commonClass}`} />, // Moderate snowfall
      75: <BsCloudSnow className={`${commonClass}`} />, // Heavy snowfall
      77: <BsSnow className={`${commonClass}`} />, // Snow grains
      80: <BsCloudRain className={`${commonClass}`} />, // Slight rain showers
      81: <BsCloudRainHeavy className={`${commonClass}`} />, // Moderate rain showers
      82: <BsCloudLightningRain className={`${commonClass}`} />, // Violent rain showers
      85: <BsCloudSnow className={`${commonClass}`} />, // Slight snow showers
      86: <BsCloudSnow className={`${commonClass}`} />, // Heavy snow showers
      95: <WiNightAltThunderstorm className={`${commonClass} text-red-500`} />, // Thunderstorm
      96: <WiNightAltThunderstorm className={`${commonClass} text-red-500`} />, // Thunderstorm with light hail
      99: <WiNightAltThunderstorm className={`${commonClass} text-red-500`} />, // Thunderstorm with heavy hail
    };

    return icons[code] || <BsCloud className={`${commonClass}`} />; // Default icon for unknown codes
  };

  return (
    <>
      {weatherLoading ? (
        <WeatherSkeleton theme={theme} />
      ) : (
        <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm flex flex-col h-full flex-1">
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
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center shadow-md flex items-center justify-between flex-1 relative group overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden rounded-lg pointer-events-none">
                  {/* Gradient background */}
                  <div
                    className="absolute w-full h-full blur-2xl  transition-opacity duration-700"
                    style={{
                      background:
                        theme === "dark"
                          ? "linear-gradient(45deg, rgba(255, 213, 122, 0.2), rgba(0, 44, 63, 0.1))"
                          : "linear-gradient(45deg, rgba(0, 44, 63, 0.1), rgba(255, 213, 122, 0.2))",
                    }}
                  />
                </div>

                <div className="flex relative z-10">
                  <p className="text-xl text-left text-slate-600 dark:text-slate-300">
                    {t("today")}
                  </p>
                  <div className="flex justify-center h-full items-center">
                    {getWeatherIcon(
                      weatherData?.daily?.weather_code?.[0],
                      true
                    )}
                  </div>
                </div>

                <div className="relative z-10">
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
