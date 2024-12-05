"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlantDetails,
  selectPlantDetails,
  selectLoadingDetails,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { IoArrowBackCircle } from "react-icons/io5";
import PageTransition from "@/components/PageTransition";
import Loading from "@/components/ui/Loading";
import VictronEnergyFlow from "@/components/Victronenergy/VictronEnergyFlow";
import { useTranslation } from "next-i18next";
import Texture from "@/components/Texture";
import { selectTheme } from "@/store/slices/themeSlice";
import useDeviceType from "@/hooks/useDeviceType";
import EnergyLoadingClock from "@/components/EnergyLoadingClock";
import WeatherWidget from "@/components/WeatherWidget";
import { PiSolarPanelFill } from "react-icons/pi";
import { BiRefresh } from "react-icons/bi";

const VictronEnergyPlantDetails = ({ plantId, userId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const plant = useSelector(selectPlantDetails);
  const isLoadingDetails = useSelector(selectLoadingDetails);
  const theme = useSelector(selectTheme);
  const { isMobile } = useDeviceType();
  const hasCoordinates = false;

  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );
  const [isFetching, setIsFetching] = useState(false);

  const capitalizeFirstLetter = useCallback((str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }, []);

  const fetchRealtimeData = useCallback(async () => {
    if (!plantId || !userId || !user?.tokenIdentificador) return;

    try {
      setIsFetching(true);
      await dispatch(
        fetchPlantDetails({
          plantId,
          userId,
          provider: "victronenergy",
          token: user.tokenIdentificador,
        })
      ).unwrap();
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching plant details:", err);
    } finally {
      setIsFetching(false);
    }
  }, [dispatch, plantId, userId, user?.tokenIdentificador]);

  useEffect(() => {
    fetchRealtimeData();
    const intervalId = setInterval(fetchRealtimeData, 15000);
    return () => clearInterval(intervalId);
  }, [fetchRealtimeData]);

  const energyData = useMemo(() => {
    if (!plant) return {};
    const extended = plant?.data?.records?.[0]?.extended || [];
    const findAttribute = (code) =>
      extended.find((attr) => attr.code === code)?.formattedValue || "N/A";

    return {
      acInput: findAttribute("ac_input"),
      generator: findAttribute("generator"),
      soc: findAttribute("bs"),
      batteryVoltage: findAttribute("bv"),
      batteryCurrent: findAttribute("bc"),
      temperature: findAttribute("temperature"),
      solarYield: findAttribute("solar_yield"),
      load: findAttribute("consumption"),
      inverterStatus: findAttribute("inverter_status"),
    };
  }, [plant]);

  if (isLoadingDetails && !plant) {
    return (
      <PageTransition>
        <div className="h-screen flex items-center justify-center">
          <Loading />
        </div>
      </PageTransition>
    );
  }

  if (!plant) {
    return (
      <PageTransition>
        <div
          className={`min-h-screen p-6 ${
            theme === "dark"
              ? "dark:bg-gray-900"
              : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
          }`}
        >
          <Texture />
          <button onClick={() => window.history.back()}>
            <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow mb-1 mr-4" />
          </button>
          <div className="h-auto w-full flex flex-col justify-center items-center">
            <PiSolarPanelFill className="mt-24 text-center text-9xl text-custom-dark-blue dark:text-custom-light-gray" />
            <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray mb-4">
              {t("plantDataNotFound")}
            </p>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-custom-dark-blue dark:text-custom-yellow hover:scale-105 transition-transform mt-4"
              disabled={isLoadingDetails}
            >
              <BiRefresh
                className={`text-2xl ${isLoadingDetails ? "animate-spin" : ""}`}
              />
              <span>{t("refresh")}</span>
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  // const statusColors = useMemo(
  //   () => ({
  //     working: "bg-green-500",
  //     disconnected: "bg-gray-500",
  //   }),
  //   []
  // );

  return (
    <PageTransition>
      <div
        className={`min-h-screen p-6 ${
          theme === "dark"
            ? "dark:bg-gray-900"
            : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
        }`}
      >
        <Texture />

        <header className="flex justify-between items-center mb-6">
          <IoArrowBackCircle
            className="text-5xl lg:text-4xl text-custom-dark-blue dark:text-custom-yellow cursor-pointer drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]"
            onClick={() => window.history.back()}
          />
          <div className="flex items-center ml-auto">
            <h1 className="text-4xl text-custom-dark-blue dark:text-custom-yellow text-right max-w-[70vw] md:max-w-[80vw] pb-2 pl-6 overflow-hidden text-ellipsis whitespace-nowrap">
              {plant?.data?.records?.[0]?.name || t("loading")}
            </h1>
            {/* <div
              className={`w-8 h-8 rounded-full ml-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] ${
                statusColors[solaredgePlant?.status] || "bg-gray-500"
              }`}
            /> */}
          </div>
        </header>

        <section className="mb-6">
          <WeatherWidget />
        </section>

        <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mb-6 backdrop-blur-sm shadow-lg">
          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
            {t("Real-Time Energy Flow")}
          </h2>
          {isMobile ? (
            <div className="flex items-center gap-2 justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("lastUpdated")}: {"blablabla"}
              </span>
              <EnergyLoadingClock
                duration={15}
                onComplete={fetchRealtimeData}
                isPaused={isFetching}
              />
            </div>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col items-end">
              <EnergyLoadingClock
                duration={15}
                onComplete={fetchRealtimeData}
                isPaused={isFetching}
              />
              <span className="absolute top-4 right-16 max-w-36">
                {t("lastUpdated")}: {"blablabla"}
              </span>
            </div>
          )}
          <VictronEnergyFlow
            energyData={energyData}
            fetchRealtimeData={fetchRealtimeData}
            isFetching={isFetching}
          />
        </section>
      </div>
    </PageTransition>
  );
};

export default VictronEnergyPlantDetails;
