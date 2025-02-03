import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  IoArrowBackCircle,
  IoLocationOutline,
  IoFlashOutline,
} from "react-icons/io5";
import { PiSolarPanelFill } from "react-icons/pi";
import { BiRefresh } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { Building2, Tag, Info } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Texture from "@/components/Texture";
import GoodweEnergyFlow from "@/components/goodwe/GoodweEnergyFlow";
import DetailRow from "@/components/DetailRow";
import {
  selectAlerts,
  selectDetailsError,
  selectLoadingBenefits,
  selectLoadingDetails,
  selectRealtimeLoading,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import useDeviceType from "@/hooks/useDeviceType";
import WeatherWidget from "@/components/WeatherWidget";
import { selectIsAdmin, selectUser } from "@/store/slices/userSlice";
import PlantDetailsSkeleton from "@/components/loadingSkeletons/PlantDetailsSkeleton";
import EnergyStatisticsSkeleton from "@/components/loadingSkeletons/EnergyStatisticsSkeleton";
import BatteryIndicator from "../BatteryIndicator";
import GoodweEnergyStatistics from "./GoodweEnergyStatistics";
import GoodwePerformanceMetrics from "./GoodwePerformanceMetrics";
import GoodweEquipmentDetails from "./GoodweEquipmentDetails";
import GoodweEnergyStatisticsSkeleton from "../loadingSkeletons/GoodweEnergyStatisticsSkeleton";
import GoodweAlerts from "@/components/goodwe/GoodweAlerts";
import AlertsModal from "../AlertsModal";
import AssociatedUsers from "../AssociatedUsers";
import GoodweAlertsModal from "./GoodweAlertsModal";
import GoodweGraphContainer from "./graphs/GoodweGraphContainer";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";

const GoodwePlantDetails = React.memo(({ plant, handleRefresh }) => {
  const theme = useSelector(selectTheme);
  const isLoading = useSelector(selectLoadingDetails);
  const error = useSelector(selectDetailsError);
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const { t } = useTranslation();
  const { isMobile, isTablet, isSmallDesktop } = useDeviceType();
  const [todayPVGeneration, setTodayPVGeneration] = useState(null);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const alerts = useSelector(selectAlerts);

  // Memoize the plant data with proper type checking
  const goodwePlant = useMemo(() => {
    const data = plant?.data?.data;
    if (!data) return {};
    return data;
  }, [plant?.data?.data]);

  const hasBattery = goodwePlant?.type?.powerstation_type === "Battery Storage";

  // Helper function to safely get battery power
  const getBatteryPower = (socData) => {
    if (!socData || !Array.isArray(socData) || socData.length === 0)
      return null;
    if (!socData[0] || typeof socData[0].power === "undefined") return null;
    return socData[0].power;
  };

  // Memoize the battery power to avoid recalculations
  const batteryPower = useMemo(
    () => getBatteryPower(goodwePlant?.soc),
    [goodwePlant?.soc]
  );

  const plantId = useMemo(() => {
    return goodwePlant?.info?.powerstation_id || null;
  }, [goodwePlant]);

  const token = useMemo(() => user?.tokenIdentificador, [user]);

  const formattedAddress = useMemo(() => {
    return goodwePlant?.info?.address || "";
  }, [goodwePlant?.info?.address]);

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

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatValueWithDecimals = (value, unit) => {
    if (!value || isNaN(parseFloat(value))) {
      return `N/A ${unit}`;
    }
    const formattedNumber = parseFloat(value).toFixed(2);
    return `${formattedNumber} ${unit}`;
  };

  const handleValueUpdate = (value) => {
    // console.log("Today's PV Generation from child:", value);
    setTodayPVGeneration(value);
  };

  const memoizedGraph = useMemo(() => {
    return (
      <GoodweGraphContainer
        plantId={goodwePlant?.info?.powerstation_id}
        title={t("plantAnalytics")}
        onValueUpdate={handleValueUpdate}
      />
    );
  }, [goodwePlant?.info?.powerstation_id, t, handleValueUpdate]);

  console.log("goodwePlant: ", goodwePlant);

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

        <header className="flex justify-between items-center mb-6">
          <IoArrowBackCircle
            className="text-4xl text-custom-dark-blue dark:text-custom-yellow cursor-pointer"
            onClick={() => window.history.back()}
          />
          <div className="flex items-center ml-auto">
            <h1 className="text-4xl text-custom-dark-blue dark:text-custom-yellow text-right max-w-[70vw] md:max-w-[80vw] pb-2 pl-6 overflow-hidden text-ellipsis whitespace-nowrap">
              {capitalizeWords(goodwePlant?.info?.stationname) || t("loading")}
            </h1>
            <div
              className={`w-6 h-6 rounded-full ml-2 ${
                statusColors[goodwePlant?.info?.status] || "bg-gray-500"
              }`}
            />
          </div>
        </header>

        {isAdmin && <AssociatedUsers plantId={plantId} isAdmin={isAdmin} />}

        <div className={`grid grid-cols-1 mb-6 gap-6 md:grid-cols-2`}>
          <WeatherWidget
            plant={goodwePlant}
            address={formattedAddress}
            provider={goodwePlant?.info?.org_name}
          />

          <div>
            {isLoading ? (
              <PlantDetailsSkeleton theme={theme} />
            ) : (
              <section className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 backdrop-blur-sm flex flex-col justify-between h-full">
                <h2 className="text-xl mb-4 text-custom-dark-blue dark:text-custom-yellow">
                  {t("plantDetails")}
                </h2>
                <div className="flex flex-1 flex-col gap-4">
                  <DetailRow
                    icon={
                      <HiOutlineStatusOnline className="text-3xl text-custom-dark-blue dark:text-custom-light-gray" />
                    }
                    label={t("currentStatus")}
                    value={
                      <Popover showArrow offset={20} placement="right">
                        <PopoverTrigger>
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
                        </PopoverTrigger>
                        <PopoverContent className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm max-w-xs">
                          <div className="px-1 py-2">
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
                          </div>
                        </PopoverContent>
                      </Popover>
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
                      <Building2 className="text-3xl text-custom-dark-blue dark:text-custom-light-gray" />
                    }
                    label={t("poweredBy")}
                    value={goodwePlant?.info?.org_name || t("loading")}
                    tooltip={t("poweredByTooltip")}
                  />
                  <DetailRow
                    icon={
                      <Tag className="text-3xl text-custom-dark-blue dark:text-custom-light-gray" />
                    }
                    label={t("typeOfPlant")}
                    value={
                      goodwePlant?.info?.powerstation_type
                        ? t(`${goodwePlant?.info?.powerstation_type}`)
                        : t("loading")
                    }
                    tooltip={t("typeTooltip")}
                  />
                </div>
              </section>
            )}
          </div>
        </div>

        <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6  backdrop-blur-sm shadow-lg mb-6 pb-8 ">
          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
            {t("Real-Time Energy Flow")}
          </h2>
          <GoodweEnergyFlow
            plantId={plantId}
            token={token}
            provider={goodwePlant?.info?.org_name}
          />
        </section>

        {isLoading ? (
          <GoodweEnergyStatisticsSkeleton theme={theme} />
        ) : (
          <GoodweEnergyStatistics
            goodwePlant={goodwePlant}
            t={t}
            theme={theme}
            formatValueWithDecimals={formatValueWithDecimals}
            batteryLevel={goodwePlant?.soc?.[0]?.power}
            todayPVGeneration={todayPVGeneration}
          />
        )}

        <div className="flex flex-col 2xl:flex-row gap-6">
          <GoodwePerformanceMetrics
            isLoading={isLoading}
            theme={theme}
            goodwePlant={goodwePlant}
            t={t}
            isMobile={isMobile}
            getYieldColor={getYieldColor}
            getYieldIcon={getYieldIcon}
          />
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <GoodweEquipmentDetails isLoading={isLoading} t={t} />
          <GoodweAlerts
            plantId={goodwePlant?.info?.powerstation_id}
            onViewAll={() => setIsAlertsModalOpen(true)}
          />
        </div>

        <section className="mb-6">{memoizedGraph}</section>

        <GoodweAlertsModal
          isOpen={isAlertsModalOpen}
          onClose={() => setIsAlertsModalOpen(false)}
        />
      </div>
    </PageTransition>
  );
});

GoodwePlantDetails.displayName = "GoodwePlantDetails";

export default GoodwePlantDetails;
