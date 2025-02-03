import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  BsExclamationTriangle,
} from "react-icons/bs";
import { WiDayFog, WiNightAltThunderstorm } from "react-icons/wi";

import useDeviceType from "@/hooks/useDeviceType";
import WeatherSkeleton from "@/components/loadingSkeletons/WeatherSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";

const WEATHER_ICONS = {
  0: BsSun,
  1: BsSun,
  2: BsCloudSun,
  3: BsCloudSun,
  45: WiDayFog,
  48: WiDayFog,
  51: BsCloudDrizzle,
  53: BsCloudDrizzle,
  55: BsCloudDrizzle,
  56: BsCloudRain,
  57: BsCloudRain,
  61: BsCloudRain,
  63: BsCloudRainHeavy,
  65: BsCloudRainHeavy,
  66: BsCloudRain,
  67: BsCloudRainHeavy,
  71: BsSnow,
  73: BsCloudSnow,
  75: BsCloudSnow,
  77: BsSnow,
  80: BsCloudRain,
  81: BsCloudRainHeavy,
  82: BsCloudLightningRain,
  85: BsCloudSnow,
  86: BsCloudSnow,
  95: WiNightAltThunderstorm,
  96: WiNightAltThunderstorm,
  99: WiNightAltThunderstorm,
};

const MAX_RETRY_COUNT = 5;
const RETRY_DELAY = 2000;

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

  const hasRequiredData = useMemo(() => {
    if (!token) return false;

    // For VictronEnergy, prefer lat/lng but accept address as fallback
    if (provider?.toLowerCase() === "victronenergy") {
      return Boolean(lat && lng) || Boolean(address);
    }

    // For all other providers, accept ANY form of location data
    return Boolean(address) || Boolean(lat && lng);
  }, [provider, lat, lng, token, address]);

  const fetchWeatherData = useCallback(() => {
    // Debug logs
    // console.log("WeatherWidget Debug:", {
    //   address,
    //   provider,
    //   token,
    //   lat,
    //   lng,
    //   hasRequiredData,
    // });

    if (!hasRequiredData) {
      console.warn("Missing required data. Waiting for user data...");
      return;
    }

    // Normalize and log provider name
    const normalizedProvider = provider?.toLowerCase();
    // console.log("Normalized provider:", normalizedProvider);

    const isGoodweProvider =
      normalizedProvider === "goodwe" ||
      normalizedProvider === "energia y calor solar del atlantico sl";

    switch (true) {
      case isGoodweProvider:
        dispatch(fetchGoodweWeatherData({ name: address, token }));
        break;
      case normalizedProvider === "solaredge":
        dispatch(fetchSolarEdgeWeatherData({ name: address, token }));
        break;
      case normalizedProvider === "victronenergy":
        dispatch(fetchVictronEnergyWeatherData({ lat, lng, token }));
        break;
      default:
        console.warn(`Unsupported provider: ${provider}`);
    }
  }, [dispatch, address, token, provider, lat, lng, hasRequiredData]);

  useEffect(() => {
    if (retryCount === 0 && hasRequiredData) fetchWeatherData();
  }, [fetchWeatherData, retryCount, hasRequiredData]);

  useEffect(() => {
    let retryTimeout;
    if (weatherError && retryCount < MAX_RETRY_COUNT) {
      retryTimeout = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        fetchWeatherData();
      }, RETRY_DELAY);
    }
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [weatherError, retryCount, fetchWeatherData]);

  useEffect(() => {
    setRetryCount(0);
  }, [address, token, provider, lat, lng]);

  const getWeatherIcon = useCallback((code, isToday = false) => {
    const sizeClass = isToday
      ? "text-8xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]"
      : "text-4xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]";
    const commonClass = `${sizeClass} text-custom-dark-blue dark:text-custom-yellow`;

    const IconComponent = WEATHER_ICONS[code] || BsCloud;
    return <IconComponent className={commonClass} />;
  }, []);

  const renderErrorState = () => (
    <div className="flex items-start gap-3 p-4 mb-4 text-red-800 bg-red-100 dark:bg-red-900/50 dark:text-red-200 rounded-lg">
      <BsExclamationTriangle className="h-5 w-5 mt-0.5" />
      <div>
        <p>{t("failedToFetchWeather")}</p>
        {retryCount > 0 && retryCount < MAX_RETRY_COUNT && (
          <p className="mt-2 text-sm">
            {t("retryingIn", { count: Math.ceil(RETRY_DELAY / 1000) })}
          </p>
        )}
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <BsCloud className="text-4xl mb-4 text-custom-dark-blue dark:text-custom-yellow" />
      <p className="text-slate-600 dark:text-slate-300">
        {!hasRequiredData
          ? t("missingWeatherData")
          : t("noWeatherDataAvailable")}
      </p>
    </div>
  );

  if (weatherLoading) {
    return <WeatherSkeleton theme={theme} />;
  }

  return (
    <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm flex flex-col h-full flex-1 2xl:min-w-[40vw]">
      <h2 className="text-xl font-semibold text-custom-dark-blue dark:text-custom-yellow mb-4">
        {t("weatherForecast")}
      </h2>

      {weatherError && renderErrorState()}

      {!weatherError && !weatherData && renderEmptyState()}

      {!weatherError && weatherData && (
        <div className="flex flex-1 flex-col">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center shadow-md flex items-center justify-between flex-1 relative group overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden rounded-lg pointer-events-none">
              <div
                className="absolute w-full h-full blur-2xl transition-opacity duration-700"
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
                {getWeatherIcon(weatherData?.daily?.weather_code?.[0], true)}
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-4xl font-bold text-custom-dark-blue dark:text-custom-yellow">
                {Math.round(weatherData?.current?.temperature_2m || 0)}°C
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                {t("wind")}: {Math.round(weatherData?.current?.wind_speed_10m)}{" "}
                km/h
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("humidity")}:{" "}
                {Math.round(weatherData?.current?.relative_humidity_2m)}%
              </p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
            {weatherData?.daily?.time
              ?.slice(1, isDesktop ? 4 : 3)
              .map((date, index) => (
                <div
                  key={date}
                  className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center shadow-md flex-1"
                >
                  <div className="flex flex-col">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {new Date(date).toLocaleDateString("es-ES", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="text-md font-semibold text-custom-dark-blue dark:text-custom-yellow">
                      {Math.round(
                        weatherData?.daily?.temperature_2m_min?.[index + 1] || 0
                      )}
                      °/
                      {Math.round(
                        weatherData?.daily?.temperature_2m_max?.[index + 1] || 0
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
  );
};

export default WeatherWidget;
