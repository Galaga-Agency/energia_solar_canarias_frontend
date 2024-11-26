"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
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
import {
  Building2,
  Tag,
  Wallet,
  PiggyBank,
  BarChart2,
  Info,
} from "lucide-react";
import { RiBattery2ChargeLine } from "react-icons/ri";
import PageTransition from "@/components/PageTransition";
import Texture from "@/components/Texture";
import EnergyFlowDisplay from "@/components/EnergyFlowDisplay";
import DetailRow from "@/components/DetailRow";
import {
  selectDetailsError,
  selectRealtimeLoading,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import useDeviceType from "@/hooks/useDeviceType";
import WeatherWidget from "../WeatherWidget";
import { selectUser } from "@/store/slices/userSlice";
import PlantDetailsSkeleton from "../LoadingSkeletons/PlantDetailsSkeleton";
import EnergyFlowSkeleton from "../LoadingSkeletons/EnergyFlowSkeleton";
import { useParams } from "next/navigation";
import SolarEdgeGraphDisplay from "../SolarEdgeGraphDisplay";
import Loading from "../Loading";

const SolarEdgePlantDetails = React.memo(
  ({ plant, handleRefresh }) => {
    const theme = useSelector(selectTheme);
    const error = useSelector(selectDetailsError);
    const isLoading = useSelector(selectRealtimeLoading);
    const user = useSelector(selectUser);
    const token = useMemo(() => user?.tokenIdentificador, [user]);
    const { t } = useTranslation();

    const solaredgePlant = useMemo(() => {
      if (!plant?.data?.details) return null;
      return plant.data.details;
    }, [plant]);

    console.log("solaredgePlant in component details: ", solaredgePlant);

    const formattedAddress = useMemo(() => {
      if (!solaredgePlant?.location) return "";
      return `${solaredgePlant.location.city}, ${solaredgePlant.location.country}`;
    }, []);

    const tStatus = useMemo(
      () => t(`status.${solaredgePlant?.status}` || "status.unknown"),
      [t, solaredgePlant?.status]
    );

    const statusColors = useMemo(
      () => ({
        working: "bg-green-500",
        error: "bg-red-500",
        waiting: "bg-yellow-500",
        disconnected: "bg-gray-500",
      }),
      []
    );

    const getYieldColor = useCallback((yieldRate) => {
      if (!yieldRate) return "text-gray-500";
      const percentage = yieldRate * 100;
      if (percentage >= 80) return "text-green-500";
      if (percentage >= 70) return "text-emerald-400";
      if (percentage >= 60) return "text-yellow-500";
      if (percentage >= 50) return "text-orange-500";
      return "text-red-500";
    }, []);

    const getYieldIcon = useCallback((yieldRate) => {
      const percentage = yieldRate * 100;
      if (percentage >= 70) return "🌟";
      if (percentage >= 50) return "⚡";
      return "⚠️";
    }, []);

    const formatValueWithDecimals = useCallback((value, unit) => {
      if (!value || isNaN(parseFloat(value))) {
        return `N/A ${unit}`;
      }
      const formattedNumber = parseFloat(value).toFixed(2);
      return `${formattedNumber} ${unit}`;
    }, []);

    const capitalizeFirstLetter = useCallback((str) => {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
    }, []);

    if (!solaredgePlant) {
      return (
        <div className="h-screen w-screen">
          <Loading />
        </div>
      );
    }

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
              className="text-5xl lg:text-4xl text-custom-dark-blue dark:text-custom-yellow cursor-pointer"
              onClick={() => window.history.back()}
            />
            <div className="flex items-center ml-auto">
              <h1 className="text-4xl text-custom-dark-blue dark:text-custom-yellow text-right max-w-[70vw] md:max-w-[80vw] pb-2 pl-6 overflow-hidden text-ellipsis whitespace-nowrap">
                {solaredgePlant?.name || t("loading")}
              </h1>
              <div
                className={`w-6 h-6 rounded-full ml-2 ${
                  statusColors[solaredgePlant?.status] || "bg-gray-500"
                }`}
              />
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {solaredgePlant && (
              <WeatherWidget
                plant={solaredgePlant}
                address={formattedAddress}
                provider={solaredgePlant?.organization}
              />
            )}

            {/* Plant Details */}
            {isLoading ? (
              <PlantDetailsSkeleton theme={theme} />
            ) : (
              <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 backdrop-blur-sm flex flex-col justify-between">
                <h2 className="text-xl mb-4 text-custom-dark-blue dark:text-custom-yellow">
                  {t("plantDetails")}
                </h2>
                <div className="flex flex-1 flex-col gap-4">
                  <DetailRow
                    icon={
                      <HiOutlineStatusOnline className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                    }
                    label={t("currentStatus")}
                    value={
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1">
                              <Info
                                className={`h-4 w-4 ${statusColors[
                                  solaredgePlant?.status
                                ]?.replace("bg-", "text-")} cursor-help mt-1`}
                              />
                              <span
                                className={`${statusColors[
                                  solaredgePlant?.status
                                ]?.replace("bg-", "text-")} cursor-help`}
                              >
                                {solaredgePlant?.status
                                  ? tStatus
                                  : t("loading")}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm max-w-xs"
                          >
                            <p className="font-medium">
                              {solaredgePlant?.status === "working" &&
                                t("statusDescriptions.working")}
                              {solaredgePlant?.status === "waiting" &&
                                t("statusDescriptions.waiting")}
                              {solaredgePlant?.status === "disconnected" &&
                                t("statusDescriptions.disconnected")}
                              {solaredgePlant?.status === "error" &&
                                t("loading")}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    }
                  />
                  <DetailRow
                    icon={IoLocationOutline}
                    label={t("location")}
                    value={
                      `${solaredgePlant?.location?.address}, ${solaredgePlant?.location?.city}, ${solaredgePlant?.location?.country}` ||
                      t("loading")
                    }
                  />
                  <DetailRow
                    icon={LiaBirthdayCakeSolid}
                    label={t("installationDate")}
                    value={
                      solaredgePlant?.installationDate
                        ? new Intl.DateTimeFormat("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(new Date(solaredgePlant?.installationDate))
                        : t("loading")
                    }
                  />
                  <DetailRow
                    icon={
                      <Building2 className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                    }
                    label={t("poweredBy")}
                    value={capitalizeFirstLetter(
                      solaredgePlant?.organization || t("loading")
                    )}
                    tooltip={t("poweredByTooltip")}
                  />
                  <DetailRow
                    icon={
                      <Tag className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                    }
                    label={t("typeOfPlant")}
                    value={
                      solaredgePlant?.type
                        ? t(`type_${solaredgePlant?.type}`)
                        : t("loading")
                    }
                    tooltip={t("typeTooltip")}
                  />
                </div>
              </section>
            )}
          </div>

          {/* Energy Flow */}
          {/* <EnergyFlowDisplay provider={solaredgePlant?.organization} /> */}
        </div>
      </PageTransition>
    );
  },
  (prevProps, nextProps) => {
    if (!prevProps.plant && !nextProps.plant) return true;
    if (!prevProps.plant || !nextProps.plant) return false;
    return (
      prevProps.plant?.data?.details?.id === nextProps.plant?.data?.details?.id
    );
  }
);

SolarEdgePlantDetails.displayName = "SolarEdgePlantDetails";

export default SolarEdgePlantDetails;
