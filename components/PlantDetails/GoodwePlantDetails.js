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
import EnergyFlowDisplay from "@/components/EnergyFlowDisplay";
import DetailRow from "@/components/DetailRow";
import {
  selectDetailsError,
  selectLoadingAny,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import GraphDisplay from "@/components/GraphDisplay";

const GoodwePlantDetails = ({ plant, handleRefresh }) => {
  const theme = useSelector(selectTheme);
  const isLoading = useSelector(selectLoadingAny);
  const error = useSelector(selectDetailsError);
  const { t } = useTranslation();

  const goodwePlant = useMemo(
    () => plant?.data?.data || {},
    [plant?.data?.data]
  );

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
              className={`w-5 h-5 rounded-full mt-1 ${
                statusColors[goodwePlant?.info?.status] || "bg-gray-500"
              }`}
            />
            <h1 className="text-4xl text-custom-dark-blue dark:text-custom-yellow">
              {goodwePlant?.info?.stationname || t("unknownPlant")}
            </h1>
          </div>
        </header>

        {/* Energy Flow */}
        <EnergyFlowDisplay
          plant={plant}
          energyConsumed={goodwePlant?.info?.capacity || 0}
          energyProduced={goodwePlant?.pac || 0}
          energyExported={goodwePlant.kpi?.pac || 0}
        />

        {/* Plant Details */}
        <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
          <h2 className="text-xl mb-4 text-custom-dark-blue dark:text-custom-yellow">
            {t("plantDetails")}
          </h2>
          <div className="space-y-4">
            <DetailRow
              icon={
                <HiOutlineStatusOnline className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
              }
              label={t("currentStatus")}
              value={
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
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
                          {t(
                            `status.${goodwePlant?.info?.status || "unknown"}`
                          )}
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
                          t("statusDescriptions.error")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              }
            />
            <DetailRow
              icon={IoLocationOutline}
              label={t("location")}
              value={goodwePlant?.info?.address || t("unknownLocation")}
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
                  : t("unknownDate")
              }
            />
            <DetailRow
              icon={
                <Building2 className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
              }
              label={t("poweredBy")}
              value={goodwePlant?.info?.org_name || t("unknownProvider")}
              tooltip={t("poweredByTooltip")}
            />
            <DetailRow
              icon={
                <Tag className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
              }
              label={t("typeOfPlant")}
              value={t(
                `type_${goodwePlant?.info?.powerstation_type || "unknown"}`
              )}
              tooltip={t("typeTooltip")}
            />
          </div>
        </section>

        {/* Energetic Statistics */}
        <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
          <h2 className="text-xl mb-4 flex items-center gap-2 text-custom-dark-blue dark:text-custom-yellow">
            {t("energyStatistics")}
          </h2>
          <div className="space-y-4">
            <DetailRow
              icon={IoFlashSharp}
              label={t("currentPower")}
              value={`${goodwePlant?.kpi?.pac || 0} kW`}
              tooltip={t("currentPowerTooltip")}
            />
            <DetailRow
              icon={PiSolarPanelFill}
              label={t("totalCapacity")}
              value={`${goodwePlant?.info?.capacity || 0} kW`}
              tooltip={t("totalCapacityTooltip")}
            />
            <DetailRow
              icon={RiBattery2ChargeLine}
              label={t("batteryCapacity")}
              value={`${goodwePlant?.info?.battery_capacity || 0} kW`}
              tooltip={t("batteryCapacityTooltip")}
            />
            <DetailRow
              icon={
                <BsCalendarMonth className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
              }
              label={t("monthlyGeneration")}
              value={`${goodwePlant?.kpi?.month_generation || 0} kW`}
              tooltip={t("monthlyGenerationTooltip")}
            />
            <DetailRow
              icon={IoSpeedometerOutline}
              label={t("totalGeneration")}
              value={`${goodwePlant?.kpi?.total_power || 0} kW`}
              tooltip={t("totalGenerationTooltip")}
            />
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
          <h2 className="text-xl mb-4 text-custom-dark-blue dark:text-custom-yellow">
            {t("performanceMetrics")}
          </h2>
          <div className="space-y-4">
            <DetailRow
              icon={
                <Wallet className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
              }
              label={t("monthlyIncome")}
              value={`${goodwePlant?.kpi?.day_income || 0} ${
                goodwePlant?.kpi?.currency || "EUR"
              }`}
              tooltip={t("monthlyIncomeTooltip")}
            />

            <DetailRow
              icon={
                <PiggyBank className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
              }
              label={t("totalIncome")}
              value={`${goodwePlant?.kpi?.total_income || 0} ${
                goodwePlant?.kpi?.currency || "EUR"
              }`}
              tooltip={t("totalIncomeTooltip")}
            />

            <DetailRow
              icon={
                <BarChart2 className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
              }
              label={t("performanceRatio")}
              value={
                <div className="flex items-center gap-1">
                  <span
                    className={`text-lg font-semibold ${getYieldColor(
                      goodwePlant?.kpi?.yield_rate
                    )}`}
                  >
                    {`${((goodwePlant?.kpi?.yield_rate || 0) * 100).toFixed(
                      1
                    )}%`}
                  </span>
                  <span>{getYieldIcon(goodwePlant?.kpi?.yield_rate)}</span>
                </div>
              }
              tooltip={t("performanceRatioTooltip")}
            />
          </div>
        </section>

        <section className="mb-6">
          <GraphDisplay
            plantId={goodwePlant?.info?.powerstation_id}
            title={t("plantAnalytics")}
          />
        </section>
      </div>
    </PageTransition>
  );
};

export default GoodwePlantDetails;
