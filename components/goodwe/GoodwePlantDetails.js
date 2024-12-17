import React, { useMemo } from "react";
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
import { selectIsAdmin, selectUser } from "@/store/slices/userSlice";
import PlantDetailsSkeleton from "@/components/loadingSkeletons/PlantDetailsSkeleton";
import EnergyStatisticsSkeleton from "@/components/loadingSkeletons/EnergyStatisticsSkeleton";
import BatteryIndicator from "../BatteryIndicator";
import GoodweEnergyStatistics from "./GoodweEnergyStatistics";
import GoodwePerformanceMetrics from "./GoodwePerformanceMetrics";

const GoodwePlantDetails = React.memo(({ plant, handleRefresh }) => {
  const theme = useSelector(selectTheme);
  const isLoading = useSelector(selectRealtimeLoading);
  const error = useSelector(selectDetailsError);
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const { t } = useTranslation();
  const { isMobile, isTablet, isSmallDesktop } = useDeviceType();

  const token = useMemo(() => user?.tokenIdentificador, [user]);
  const goodwePlant = useMemo(
    () => plant?.data?.data || {},
    [plant?.data?.data]
  );
  const plantId = useMemo(
    () => goodwePlant?.info?.powerstation_id,
    [goodwePlant]
  );
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
            className="text-5xl lg:text-4xl text-custom-dark-blue dark:text-custom-yellow cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = isAdmin
                ? `/dashboard/${user?.id}/admin/goodwe`
                : `/dashboard/${user?.id}/plants`;
            }}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <WeatherWidget
            plant={goodwePlant}
            address={formattedAddress}
            provider={goodwePlant?.info?.org_name}
          />

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

        <GoodweEnergyFlowDisplay
          plantId={plantId}
          token={token}
          provider={goodwePlant?.info?.org_name}
        />

        <div className="flex flex-col 2xl:flex-row 2xl:gap-6">
          {isLoading ? (
            <EnergyStatisticsSkeleton theme={theme} />
          ) : (
            <GoodweEnergyStatistics
              goodwePlant={goodwePlant}
              t={t}
              theme={theme}
              formatValueWithDecimals={formatValueWithDecimals}
              batteryLevel={goodwePlant?.soc?.[0]?.power}
            />
          )}

          {isTablet || isSmallDesktop ? (
            <div className="flex gap-6">
              <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mb-6 backdrop-blur-sm shadow-lg flex flex-col items-center gap-4">
                <div className="flex 2xl:flex-col items-center justify-center flex-1 gap-4">
                  <div className="flex items-center justify-center bg-gradient-to-br from-yellow-400 to-green-500 text-white rounded-full p-2 shadow-lg">
                    <IoFlashOutline className="text-3xl md:text-4xl" />
                  </div>
                  <BatteryIndicator soc={goodwePlant?.soc[0].power} />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-2 text-custom-dark-blue dark:text-custom-yellow">
                        <Info className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <p>{t("batteryTooltipContent")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

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
          ) : (
            <>
              <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mb-6 backdrop-blur-sm shadow-lg flex flex-col items-center gap-4">
                <div className="flex md:flex-col items-center justify-center flex-1 gap-4">
                  <div className="flex items-center justify-center bg-gradient-to-br from-yellow-400 to-green-500 text-white rounded-full p-2 shadow-lg">
                    <IoFlashOutline className="text-3xl md:text-4xl" />
                  </div>
                  <BatteryIndicator soc={goodwePlant?.soc[0].power} />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-2 text-custom-dark-blue dark:text-custom-yellow">
                        <Info className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <p>{t("batteryTooltipContent")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <GoodwePerformanceMetrics
                isLoading={isLoading}
                theme={theme}
                goodwePlant={goodwePlant}
                t={t}
                isMobile={isMobile}
                getYieldColor={getYieldColor}
                getYieldIcon={getYieldIcon}
              />
            </>
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
});

GoodwePlantDetails.displayName = "GoodwePlantDetails";

export default GoodwePlantDetails;
