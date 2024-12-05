"use client";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
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
import GoodweEnergyFlowDisplay from "@/components/goodwe/GoodweEnergyFlowDisplay";
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
} from "@/components/ui/Tooltip";
import GoodweGraphDisplay from "@/components/goodwe/GoodweGraphDisplay";
import useDeviceType from "@/hooks/useDeviceType";
import WeatherWidget from "@/components/WeatherWidget";
import { selectUser } from "@/store/slices/userSlice";
import PerformanceMetricsSkeleton from "@/components/loadingSkeletons/PerformanceMetricsSkeleton";
import PlantDetailsSkeleton from "@/components/loadingSkeletons/PlantDetailsSkeleton";
import EnergyStatisticsSkeleton from "@/components/loadingSkeletons/EnergyStatisticsSkeleton";
import Loading from "@/components/ui/Loading";

const GoodwePlantDetails = React.memo(
  ({ plant, handleRefresh }) => {
    const theme = useSelector(selectTheme);
    const isLoading = useSelector(selectRealtimeLoading);
    const error = useSelector(selectDetailsError);
    const user = useSelector(selectUser);
    const token = useMemo(() => user?.tokenIdentificador, [user]);
    const { t } = useTranslation();
    const { isMobile } = useDeviceType();

    const goodwePlant = useMemo(
      () => plant?.data?.data || {},
      [plant?.data?.data]
    );

    const plantId = useMemo(
      () => goodwePlant?.info?.powerstation_id,
      [goodwePlant]
    );

    // check this function here when we get goodwe back, pretty sure its false

    const formattedAddress = useMemo(() => {
      if (!goodwePlant?.location) return "";
      return `${goodwePlant.location.city}, ${goodwePlant.location.country}`;
    }, [goodwePlant?.location]);

    const statusColors = {
      working: "bg-green-500",
      error: "bg-red-500",
      waiting: "bg-yellow-500",
      disconnected: "bg-gray-500",
    };

    const getYieldColor = (yieldRate) => {
      if (!yieldRate) return "text-gray-500";
      const percentage = yieldRate * 100;
      if (percentage >= 80) return "text-green-500";
      if (percentage >= 70) return "text-emerald-400";
      if (percentage >= 60) return "text-yellow-500";
      if (percentage >= 50) return "text-orange-500";
      return "text-red-500";
    };

    const getYieldIcon = (yieldRate) => {
      const percentage = yieldRate * 100;
      if (percentage >= 70) return "🌟";
      if (percentage >= 50) return "⚡";
      return "⚠️";
    };

    const formatValueWithDecimals = (value, unit) => {
      if (!value || isNaN(parseFloat(value))) {
        return `N/A ${unit}`;
      }
      const formattedNumber = parseFloat(value).toFixed(2);
      return `${formattedNumber} ${unit}`;
    };

    if (!goodwePlant) {
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
                {goodwePlant?.info?.stationname || t("loading")}
              </h1>
              <div
                className={`w-6 h-6 rounded-full ml-2 ${
                  statusColors[goodwePlant?.info?.status] || "bg-gray-500"
                }`}
              />
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
            <WeatherWidget
              plant={goodwePlant}
              address={formattedAddress}
              provider={goodwePlant?.info?.org_name}
            />

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
                                  goodwePlant?.info?.status
                                ]?.replace("bg-", "text-")} cursor-help mt-1`}
                              />
                              <span
                                className={`${statusColors[
                                  goodwePlant?.info?.status
                                ]?.replace("bg-", "text-")} cursor-help`}
                              >
                                {goodwePlant?.info?.status
                                  ? t(`status.${goodwePlant?.info?.status}`)
                                  : t("loading")}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm max-w-xs"
                          >
                            <p className="font-medium">
                              {goodwePlant?.info?.status === "working" &&
                                t("statusDescriptions.working")}
                              {goodwePlant?.info?.status === "waiting" &&
                                t("statusDescriptions.waiting")}
                              {goodwePlant?.info?.status === "disconnected" &&
                                t("statusDescriptions.disconnected")}
                              {goodwePlant?.info?.status === "error" &&
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
                    value={goodwePlant?.info?.address || t("loading")}
                  />
                  <DetailRow
                    icon={LiaBirthdayCakeSolid}
                    label={t("installationDate")}
                    value={
                      goodwePlant?.info?.create_time
                        ? new Intl.DateTimeFormat("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(new Date(goodwePlant.info.create_time))
                        : t("loading")
                    }
                  />
                  <DetailRow
                    icon={
                      <Building2 className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                    }
                    label={t("poweredBy")}
                    value={goodwePlant?.info?.org_name || t("loading")}
                    tooltip={t("poweredByTooltip")}
                  />
                  <DetailRow
                    icon={
                      <Tag className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                    }
                    label={t("typeOfPlant")}
                    value={
                      goodwePlant?.info?.powerstation_type
                        ? t(`type_${goodwePlant?.info?.powerstation_type}`)
                        : t("loading")
                    }
                    tooltip={t("typeTooltip")}
                  />
                </div>
              </section>
            )}
          </div>

          {/* Energy Flow */}
          <GoodweEnergyFlowDisplay
            plantId={plantId}
            token={token}
            provider={goodwePlant?.info?.org_name}
          />

          <div className="flex flex-col md:flex-row md:gap-4 w-full">
            {/* Energetic Statistics */}
            {isLoading ? (
              <EnergyStatisticsSkeleton theme={theme} />
            ) : (
              <section className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
                <h2 className="text-xl mb-4 flex items-center gap-2 text-custom-dark-blue dark:text-custom-yellow">
                  {t("energyStatistics")}
                </h2>
                <div className="space-y-4">
                  <DetailRow
                    icon={IoFlashSharp}
                    label={t("currentPower")}
                    value={formatValueWithDecimals(
                      goodwePlant?.kpi?.pac || 0,
                      "kW"
                    )}
                    tooltip={t("currentPowerTooltip")}
                  />
                  <DetailRow
                    icon={PiSolarPanelFill}
                    label={t("totalCapacity")}
                    value={formatValueWithDecimals(
                      goodwePlant?.info?.capacity || 0,
                      "kW"
                    )}
                    tooltip={t("totalCapacityTooltip")}
                  />
                  <DetailRow
                    icon={RiBattery2ChargeLine}
                    label={t("batteryCapacity")}
                    value={formatValueWithDecimals(
                      goodwePlant?.info?.battery_capacity || 0,
                      "kW"
                    )}
                    tooltip={t("batteryCapacityTooltip")}
                  />
                  <DetailRow
                    icon={
                      <BsCalendarMonth className="text-xl text-custom-dark-blue dark:text-custom-yellow" />
                    }
                    label={t("monthlyGeneration")}
                    value={formatValueWithDecimals(
                      goodwePlant?.kpi?.month_generation || 0,
                      "kW"
                    )}
                    tooltip={t("monthlyGenerationTooltip")}
                  />
                  <DetailRow
                    icon={IoSpeedometerOutline}
                    label={t("totalGeneration")}
                    value={formatValueWithDecimals(
                      goodwePlant?.kpi?.total_power || 0,
                      "kW"
                    )}
                    tooltip={t("totalGenerationTooltip")}
                  />
                </div>
              </section>
            )}

            {/* Performance Metrics */}
            {isLoading ? (
              <PerformanceMetricsSkeleton theme={theme} />
            ) : (
              <section className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm mb-6">
                <h2 className="text-xl mb-6 text-custom-dark-blue dark:text-custom-yellow">
                  {t("performanceMetrics")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Day Income Card */}
                  <div className="relative flex flex-col justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg shadow-md text-center min-h-[160px]">
                    <div className="flex flex-col items-center gap-2">
                      <Wallet className="w-10 h-10 text-custom-dark-blue dark:text-custom-yellow" />
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                        {t("dayIncome")}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="absolute top-4 right-4 cursor-help">
                                <Info className="w-4 h-4 text-custom-dark-blue dark:text-custom-yellow" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm max-w-xs"
                            >
                              <p className="text-sm font-medium">
                                {t("dayIncomeTooltip")}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                      {`${goodwePlant?.kpi?.day_income?.toFixed(2) || "0.00"} ${
                        goodwePlant?.kpi?.currency || "EUR"
                      }`}
                    </p>
                  </div>

                  {/* Total Income Card */}
                  <div className="relative flex flex-col justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg shadow-md text-center min-h-[160px]">
                    <div className="flex flex-col items-center gap-2">
                      <PiggyBank className="w-10 h-10 text-custom-dark-blue dark:text-custom-yellow" />
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                        {t("totalIncome")}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="absolute top-4 right-4 cursor-help">
                                <Info className="w-4 h-4 text-custom-dark-blue dark:text-custom-yellow" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm max-w-xs"
                            >
                              <p className="text-sm font-medium">
                                {t("totalIncomeTooltip")}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                      {`${
                        goodwePlant?.kpi?.total_income?.toFixed(2) || "0.00"
                      } ${goodwePlant?.kpi?.currency || "EUR"}`}
                    </p>
                  </div>

                  {/* Performance Ratio Card */}
                  <div className="relative flex flex-col justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg shadow-md text-center min-h-[160px]">
                    <div className="flex flex-col items-center gap-2">
                      <BarChart2 className="w-10 h-10 text-custom-dark-blue dark:text-custom-yellow" />
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                        {t("performanceRatio")}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="absolute top-4 right-4 cursor-help">
                                <Info className="w-4 h-4 text-custom-dark-blue dark:text-custom-yellow" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm max-w-xs"
                            >
                              <p className="text-sm font-medium">
                                {t("performanceRatioTooltip")}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <span
                        className={getYieldColor(goodwePlant?.kpi?.yield_rate)}
                      >
                        {`${((goodwePlant?.kpi?.yield_rate || 0) * 100).toFixed(
                          0
                        )}%`}
                      </span>
                      {!isMobile && (
                        <span>
                          {getYieldIcon(goodwePlant?.kpi?.yield_rate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          <section className="mb-6">
            <GoodweGraphDisplay
              plantId={goodwePlant?.info?.powerstation_id}
              title={t("plantAnalytics")}
            />
          </section>
        </div>
      </PageTransition>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for React.memo
    return JSON.stringify(prevProps.plant) === JSON.stringify(nextProps.plant);
  }
);

GoodwePlantDetails.displayName = "GoodwePlantDetails";

export default GoodwePlantDetails;
