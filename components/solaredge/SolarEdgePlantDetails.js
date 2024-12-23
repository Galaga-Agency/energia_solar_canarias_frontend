"use client";

import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { IoArrowBackCircle, IoLocationOutline } from "react-icons/io5";
import { PiSolarPanelFill } from "react-icons/pi";
import { BiRefresh } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { Building2, Tag, Info } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Texture from "@/components/Texture";
import SolarEdgeEnergyFlowDisplay from "@/components/solaredge/SolarEdgeEnergyFlowDisplay";
import DetailRow from "@/components/DetailRow";
import {
  selectDetailsError,
  selectLoadingDetails,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import WeatherWidget from "@/components/WeatherWidget";
import { selectIsAdmin, selectUser } from "@/store/slices/userSlice";
import PlantDetailsSkeleton from "@/components/loadingSkeletons/PlantDetailsSkeleton";
import SolarEdgeEnergyFlowGraph from "@/components/solaredge/SolarEdgeEnergyFlowGraph";
import EnergyStatisticsSkeleton from "@/components/loadingSkeletons/EnergyStatisticsSkeleton";
import EnvironmentalBenefits from "@/components/solaredge/EnvironmentalBenefits";
import BatteryIndicator from "@/components/BatteryIndicator";
import EnergyStatistics from "@/components/solaredge/EnergyStatistics";
import { IoFlashOutline } from "react-icons/io5";
import SolarEdgeEquipmentDetails from "./SolarEdgeEquipmentDetails";
import AlertsOverview from "./AlertsOverview";
import EnergyComparisonChart from "./EnergyComparisonChart";
import useDeviceType from "@/hooks/useDeviceType";
import BatteryChargingGraph from "./BatteryChargingGraph";

const mockAlerts = [
  {
    id: 1,
    severity: 5,
    message: "Problema recurrente con la tensión de la red",
    type: "networkVoltage",
    component: "Inverter 2",
    date: "2024-12-10T10:20:00",
    status: "Abiertas",
    category: "Configuración instalación",
    serialNumber: "7E043030-E2",
  },
  {
    id: 2,
    severity: 4,
    message: "Interrupción en la tensión de la red",
    type: "networkInterruption",
    component: "Inverter 1",
    date: "2024-11-28T14:40:00",
    status: "Abierta (silenciada)",
    category: "Configuración instalación",
    serialNumber: "7E043EDB-9B",
  },
  {
    id: 3,
    severity: 4,
    message: "Interrupción en la tensión de la red",
    type: "networkInterruption",
    component: "Inverter 1",
    date: "2024-11-22T11:40:00",
    status: "Cerrada",
    category: "Configuración instalación",
    serialNumber: "7B052213-B5",
  },
  {
    id: 4,
    severity: 3,
    message: "Fluctuación en la generación de energía",
    type: "generationFluctuation",
    component: "Inverter 3",
    date: "2024-12-08T09:30:00",
    status: "Abiertas",
    category: "Monitoreo de rendimiento",
    serialNumber: "8D014111-B4",
  },
  {
    id: 5,
    severity: 2,
    message: "Advertencia de desconexión de comunicación",
    type: "communicationIssue",
    component: "Inverter 4",
    date: "2024-12-01T16:00:00",
    status: "Cerrada",
    category: "Mantenimiento",
    serialNumber: "3C023111-D3",
  },
  {
    id: 6,
    severity: 3,
    message: "Baja eficiencia de los paneles solares",
    type: "panelEfficiency",
    component: "Inverter 5",
    date: "2024-12-05T12:50:00",
    status: "Abierta",
    category: "Monitoreo de rendimiento",
    serialNumber: "7D043322-F1",
  },
  {
    id: 7,
    severity: 5,
    message: "Fallo crítico en el inversor principal",
    type: "criticalFailure",
    component: "Inverter 1",
    date: "2024-12-12T13:20:00",
    status: "Abierta",
    category: "Mantenimiento",
    serialNumber: "5B032221-C4",
  },
  {
    id: 8,
    severity: 2,
    message: "Baja radiación solar detectada",
    type: "solarRadiation",
    component: "Inverter 2",
    date: "2024-12-13T07:10:00",
    status: "Cerrada",
    category: "Monitoreo ambiental",
    serialNumber: "9F041112-F5",
  },
];

const SolarEdgePlantDetails = React.memo(
  ({ plant, handleRefresh }) => {
    const theme = useSelector(selectTheme);
    const error = useSelector(selectDetailsError);
    const isLoading = useSelector(selectLoadingDetails);
    const user = useSelector(selectUser);
    const token = useMemo(() => user?.tokenIdentificador, [user]);
    const { t } = useTranslation();
    const isAdmin = useSelector(selectIsAdmin);
    const { isTablet } = useDeviceType();

    const solaredgePlant = useMemo(() => {
      if (!plant?.data?.details) return null;
      return plant.data.details;
    }, [plant]);

    console.log("Solaredge plant details: ", solaredgePlant);

    const batteryLevel =
      solaredgePlant?.siteCurrentPowerFlow?.STORAGE?.chargeLevel;

    const capitalizeFirstLetter = useCallback((str) => {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
    }, []);

    const formatAddress = useCallback(
      (location) => {
        if (!location) return t("addressNotAvailable");

        const parts = [];
        if (location.address) parts.push(location.address);
        if (location.city) parts.push(location.city);
        if (location.country) parts.push(location.country);

        return parts.length > 0
          ? Array.from(new Set(parts)).join(", ")
          : t("addressNotAvailable");
      },
      [t]
    );

    const formatInstallationDate = useCallback(
      (date) => {
        if (!date) return t("dateNotAvailable");

        try {
          return new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(new Date(date));
        } catch (error) {
          console.error("Error formatting date:", error);
          return t("dateNotAvailable");
        }
      },
      [t]
    );

    const formatType = useCallback(
      (type) => {
        if (!type) return t("typeNotAvailable");
        return t(`type_${type}`);
      },
      [t]
    );

    const formatOrganization = useCallback(
      (org) => {
        if (!org) return t("organizationNotAvailable");
        return capitalizeFirstLetter(org);
      },
      [capitalizeFirstLetter, t]
    );

    const formattedAddress = useMemo(() => {
      if (!solaredgePlant?.location) return "";
      const { city = "", country = "" } = solaredgePlant.location;
      return `${city}, ${country}`;
    }, [solaredgePlant?.location]);

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
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = isAdmin
                  ? `/dashboard/${user?.id}/admin/solaredge`
                  : `/dashboard/${user?.id}/plants`;
              }}
            >
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
              className="text-5xl lg:text-4xl text-custom-dark-blue dark:text-custom-yellow cursor-pointer "
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = isAdmin
                  ? `/dashboard/${user.id}/admin/solaredge`
                  : `/dashboard/${user.id}/plants`;
              }}
            />
            <div className="flex items-center ml-auto">
              <h1 className="text-4xl text-custom-dark-blue dark:text-custom-yellow text-right max-w-[70vw] md:max-w-[80vw] pb-2 pl-6 overflow-hidden text-ellipsis whitespace-nowrap">
                {solaredgePlant?.name || t("loading")}
              </h1>
              <div
                className={`w-8 h-8 rounded-full ml-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] ${
                  statusColors[solaredgePlant?.status] || "bg-gray-500"
                }`}
              />
            </div>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <WeatherWidget
              plant={solaredgePlant}
              address={formattedAddress}
              provider={solaredgePlant?.organization}
            />

            {/* Plant Details */}
            {isLoading ? (
              <PlantDetailsSkeleton theme={theme} />
            ) : (
              <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm flex flex-col justify-between">
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
                                className={`h-4 w-4 ${
                                  statusColors[solaredgePlant?.status]?.replace(
                                    "bg-",
                                    "text-"
                                  ) || "text-gray-500"
                                } cursor-help mt-1`}
                              />
                              <span
                                className={`${
                                  statusColors[solaredgePlant?.status]?.replace(
                                    "bg-",
                                    "text-"
                                  ) || "text-gray-500"
                                } cursor-help`}
                              >
                                {tStatus}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm max-w-xs"
                          >
                            <p className="font-medium">
                              {t(
                                `statusDescriptions.${solaredgePlant?.status}`
                              ) || "unknown"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    }
                  />
                  <DetailRow
                    icon={IoLocationOutline}
                    label={t("location")}
                    value={formatAddress(solaredgePlant?.location)}
                  />
                  <DetailRow
                    icon={LiaBirthdayCakeSolid}
                    label={t("installationDate")}
                    value={formatInstallationDate(
                      solaredgePlant?.installationDate
                    )}
                  />
                  <DetailRow
                    icon={
                      <Building2 className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                    }
                    label={t("poweredBy")}
                    value={formatOrganization(solaredgePlant?.organization)}
                    tooltip={t("poweredByTooltip")}
                  />
                  <DetailRow
                    icon={
                      <Tag className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />
                    }
                    label={t("typeOfPlant")}
                    value={formatType(solaredgePlant?.type)}
                    tooltip={t("typeTooltip")}
                  />
                </div>
              </section>
            )}
          </div>

          {/* Energy Flow */}
          <SolarEdgeEnergyFlowDisplay provider={solaredgePlant?.organization} />

          <section className="flex flex-col mb-6 md:flex-row gap-6 w-full">
            <SolarEdgeEquipmentDetails
              plantId={solaredgePlant?.id}
              token={token}
              t={t}
            />
            <AlertsOverview alerts={mockAlerts} />
          </section>

          <div className="flex flex-col xl:flex-row xl:gap-6">
            {/* Energetic Statistics */}
            <EnergyStatistics
              plant={solaredgePlant}
              t={t}
              theme={theme}
              formatValueWithDecimals={formatValueWithDecimals}
              token={token}
              batteryLevel={batteryLevel}
            />

            {/* Environmental Benefits */}
            {isLoading ? (
              <EnergyStatisticsSkeleton theme={theme} />
            ) : (
              <EnvironmentalBenefits
                t={t}
                plantId={solaredgePlant?.id}
                provider={solaredgePlant?.organization}
                batteryLevel={batteryLevel}
              />
            )}
          </div>

          <SolarEdgeEnergyFlowGraph
            plantId={solaredgePlant?.id}
            title={t("potenciaPlanta")}
            token={token}
          />

          <section className="flex flex-col md:flex-row gap-6 mt-6 w-full">
            <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg flex flex-col items-center gap-4">
              <div className="flex md:flex-col items-center justify-center flex-1 gap-4">
                {/* Battery Gauge */}
                <BatteryIndicator soc={batteryLevel} />

                {/* Tooltip */}
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

            {/* Battery Graph */}
            <div className="flex-1 min-w-[300px]">
              <BatteryChargingGraph
                plantId={solaredgePlant?.id}
                token={token}
              />
            </div>
          </section>

          <EnergyComparisonChart
            plantId={solaredgePlant?.id}
            installationDate={solaredgePlant?.installationDate}
            token={token}
          />
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
