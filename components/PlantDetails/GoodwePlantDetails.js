"use client";

import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { selectUser } from "@/store/slices/userSlice";
import {
  selectDetailsError,
  selectLoadingAny,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import PageTransition from "@/components/PageTransition";
import Texture from "@/components/Texture";
import EnergyFlowDisplay from "@/components/EnergyFlowDisplay";
import WeatherWidget from "@/components/WeatherWidget";
import BatteryIndicator from "@/components/BatteryIndicator";
import {
  IoArrowBackCircle,
  IoLocationOutline,
  IoFlashSharp,
  IoSpeedometerOutline,
} from "react-icons/io5";
import { PiSolarPanelFill } from "react-icons/pi";
import { BsCalendarMonth } from "react-icons/bs";
import { BiRefresh } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { BatteryCharging, Building2, Tag } from "lucide-react";
import useDeviceType from "@/hooks/useDeviceType";
import { RiBattery2ChargeLine } from "react-icons/ri";
import Loading from "../Loading";

const GoodwePlantDetails = ({ plant, handleRefresh }) => {
  const { isMobile, isDesktop } = useDeviceType();
  const theme = useSelector(selectTheme);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectLoadingAny);
  const error = useSelector(selectDetailsError);
  const { t } = useTranslation();

  const statusColors = {
    working: "bg-green-500",
    error: "bg-red-500",
    waiting: "bg-yellow-500",
    disconnected: "bg-gray-500",
  };

  console.log("Current Goodwe plant: ", plant);

  const goodwePlant = plant?.data.data;

  if (error) {
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
              disabled={isLoading}
            >
              <BiRefresh
                className={`text-2xl ${isLoading ? "animate-spin" : ""}`}
              />
              <span>{t("refresh")}</span>
            </button>
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

        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <IoArrowBackCircle
            className="text-4xl text-custom-dark-blue dark:text-custom-yellow cursor-pointer"
            onClick={() => window.history.back()}
          />
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${statusColors[plant.status]}`}
            />
            <h1 className="text-4xl text-custom-dark-blue dark:text-custom-yellow">
              {goodwePlant?.info?.stationname || ""}
            </h1>
          </div>
        </header>

        {/* Weather Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <WeatherWidget
            weatherData={weatherData}
            batterySOC={plant.batterySOC}
            theme={theme}
          />
        </div> */}

        {/* Energy Flow */}
        <EnergyFlowDisplay
          plant={plant}
          energyConsumed={goodwePlant?.info?.capacity}
          energyProduced={goodwePlant?.pac}
          energyExported={goodwePlant?.kpi?.pac}
        />

        {/* Plant Details */}
        <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
          <h2 className="text-xl mb-4 text-custom-dark-blue dark:text-custom-yellow">
            {t("plantDetails")}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <HiOutlineStatusOnline className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("currentStatus")}
                </strong>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    statusColors[goodwePlant?.status]
                  }`}
                />
                <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                  {t(`status.${goodwePlant?.info?.status}`)}
                </span>
              </div>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <IoLocationOutline className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("location")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {goodwePlant?.info?.address}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <LiaBirthdayCakeSolid className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("installationDate")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {goodwePlant?.installationDate || "N/A"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Building2 className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("poweredBy")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {goodwePlant?.info?.org_name}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <LiaBirthdayCakeSolid className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("installationDate")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {new Intl.DateTimeFormat("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(goodwePlant.info.create_time))}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Tag className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("typeOfPlant")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {t(`type_${goodwePlant?.info?.powerstation_type}`)}
              </span>
            </div>
          </div>
        </section>

        {/* Mobile Battery Status */}
        {/* {!isDesktop && (
          <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
            <h2 className="text-xl mb-4 text-custom-dark-blue dark:text-custom-yellow">
              {t("batteryStatus")}
            </h2>
            <BatteryIndicator batterySOC={plant.batterySOC} />
          </section>
        )} */}

        {/* Stats */}
        <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
          <h2 className="text-xl mb-4 flex items-center gap-2 text-custom-dark-blue dark:text-custom-yellow">
            {t("energyStatistics")}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <IoFlashSharp className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("currentPower")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {`${goodwePlant?.kpi?.pac || 0} kW`}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <PiSolarPanelFill className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("totalCapacity")} FV
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {`${goodwePlant?.info?.capacity} kW`}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 ">
                <RiBattery2ChargeLine className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("batteryCapacity")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {`${goodwePlant?.info?.battery_capacity} kW`}
              </span>
            </div>

            {/* <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <BsGraphUpArrow className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("peakPower")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {`${plant.highest_impact || "N/A"} kW`}
              </span>
            </div> */}

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <BsCalendarMonth className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("monthlyGeneration")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {`${goodwePlant?.kpi?.month_generation || 0} kW`}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <IoSpeedometerOutline className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
                <strong className="text-lg dark:text-custom-light-gray">
                  {t("totalGeneration")}
                </strong>
              </div>
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {`${goodwePlant?.kpi?.total_power || 0} kW`}
              </span>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        {/* <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-xl mb-4 text-custom-dark-blue dark:text-custom-yellow">
            {t("powerTimeSeries")}
          </h2>
          <div id="powerChart"></div>
        </section> */}
      </div>
    </PageTransition>
  );
};

export default GoodwePlantDetails;
