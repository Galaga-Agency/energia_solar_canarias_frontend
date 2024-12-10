import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPlantDetails,
  selectLoadingDetails,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { IoArrowBackCircle } from "react-icons/io5";
import PageTransition from "@/components/PageTransition";
import Loading from "@/components/ui/Loading";
import VictronEnergyFlow from "@/components/victronenergy/VictronEnergyFlow";
import { useTranslation } from "next-i18next";
import Texture from "@/components/Texture";
import { selectTheme } from "@/store/slices/themeSlice";
import useDeviceType from "@/hooks/useDeviceType";
import WeatherWidget from "@/components/WeatherWidget";
import { PiSolarPanelFill } from "react-icons/pi";
import { useParams } from "next/navigation";
import TankData from "./TankData";

const VictronEnergyPlantDetails = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const plant = useSelector(selectPlantDetails);
  const isLoadingDetails = useSelector(selectLoadingDetails);
  const theme = useSelector(selectTheme);
  const { isMobile } = useDeviceType();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [hasCoordinates, setHasCoordinates] = useState(false);
  const params = useParams();
  const plantId = params.plantId;
  const [loadTime] = useState(
    new Date().toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  );

  useEffect(() => {
    if (latitude && longitude) {
      setHasCoordinates(true);
    }
  }, [latitude, longitude]);

  // Extract latitude and longitude from plant data
  useEffect(() => {
    if (plant) {
      const extended = plant?.data?.records?.[0]?.extended || [];
      setLatitude(extended.find((attr) => attr.code === "lt")?.rawValue);
      setLongitude(extended.find((attr) => attr.code === "lg")?.rawValue);
    }
  }, [plant]);

  const tankData = {
    tc: plant?.data?.records?.[0]?.extended?.find((item) => item.code === "tc"),
    tf: plant?.data?.records?.[0]?.extended?.find((item) => item.code === "tf"),
    tl: plant?.data?.records?.[0]?.extended?.find((item) => item.code === "tl"),
    tr: plant?.data?.records?.[0]?.extended?.find((item) => item.code === "tr"),
    tst: plant?.data?.records?.[0]?.extended?.find(
      (item) => item.code === "tst"
    ),
  };

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
          </div>
        </div>
      </PageTransition>
    );
  }

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
          </div>
        </header>
        <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:space-x-6">
          {hasCoordinates && (
            <WeatherWidget
              lat={latitude}
              lng={longitude}
              token={user?.tokenIdentificador}
              provider="victronenergy"
            />
          )}
          {tankData &&
            !["tc", "tf", "tl", "tr", "tst"].every(
              (key) => tankData[key] === undefined
            ) && (
              <section className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg ">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
                    {t("Fuel Tank Status")}
                  </h2>
                </div>

                <TankData tankData={tankData} />
              </section>
            )}
        </div>

        <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mb-6 backdrop-blur-sm shadow-lg my-6">
          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
            {t("Real-Time Energy Flow")}
          </h2>
          <VictronEnergyFlow
            plantId={plantId}
            token={user?.tokenIdentificador}
          />
        </section>
      </div>
    </PageTransition>
  );
};

export default VictronEnergyPlantDetails;
