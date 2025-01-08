import React from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt } from "react-icons/fa";
import { PiSolarPanelFill } from "react-icons/pi";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";

import {
  BsBatteryCharging,
  BsBatteryFull,
  BsBatteryHalf,
} from "react-icons/bs";
import useDeviceType from "@/hooks/useDeviceType";

const PlantCard = ({ plant }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useSelector(selectUser);
  const userId = user?.id;
  const provider = plant?.organization?.toLowerCase();
  const { isMobile } = useDeviceType();

  const statusColors = {
    working: "bg-green-500",
    error: "bg-red-500",
    waiting: "bg-yellow-500",
    disconnected: "bg-gray-500",
  };

  const batteryStateIcons = {
    cargando: {
      icon: BsBatteryCharging,
      color: "text-green-500",
      size: "text-2xl",
    },
    descargando: {
      icon: BsBatteryHalf,
      color: "text-red-500",
      size: "text-2xl",
    },
    "en reposo": {
      icon: BsBatteryFull,
      color: "text-gray-400",
      size: "text-2xl",
    },
  };

  const parseAddress = (address) => {
    try {
      const parsed = JSON.parse(address);
      if (parsed?.center?.lat && parsed?.center?.lng) {
        return `Lat: ${parsed.center.lat.toFixed(
          2
        )}, Lng: ${parsed.center.lng.toFixed(2)}`;
      }
      if (parsed?.type === "circle" && parsed?.radius) {
        return `Radius: ${parsed.radius.toFixed(2)}m`;
      }
      return "N/A";
    } catch {
      return address || "N/A";
    }
  };

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getBatteryStateLabel = (state, t) => {
    switch (state?.toLowerCase()) {
      case "cargando":
        return t("status.Cargando");
      case "descargando":
        return t("status.Descargando");
      case "en reposo":
        return t("status.En reposo");
      default:
        return t("status.Unknown");
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "working":
        return t("status.working");
      case "error":
        return t("status.error");
      case "waiting":
        return t("status.waiting");
      case "disconnected":
        return t("status.disconnected");
      case "cargando":
        return t("Charging");
      case "descargando":
        return t("Discharging");
      case "en reposo":
        return t("Resting");
      default:
        return "";
    }
  };

  const statusTextColors = {
    working: "text-green-500",
    error: "text-red-500",
    waiting: "text-yellow-500",
    disconnected: "text-gray-500",
  };

  const handleCardClick = () => {
    router.push(`/dashboard/${userId}/plants/${provider}/${plant.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="p-6 relative bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* Status or Battery Icon */}
      {provider === "victronenergy" ? (
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <span
            className={`text-sm font-medium ${
              batteryStateIcons[plant.status?.toLowerCase()]?.color ||
              "text-gray-500"
            }`}
          >
            {!isMobile && getBatteryStateLabel(plant.status, t)}
          </span>
          {React.createElement(
            batteryStateIcons[plant.status?.toLowerCase()]?.icon ||
              BsBatteryFull,
            {
              className: `${
                batteryStateIcons[plant.status?.toLowerCase()]?.color ||
                "text-gray-500"
              } ${
                batteryStateIcons[plant.status?.toLowerCase()]?.size ||
                "text-2xl "
              }`,
            }
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {!isMobile && (
            <span
              className={`absolute top-4 right-10 text-sm font-medium ${
                statusTextColors[plant.status.toLowerCase()] || "text-gray-500"
              }`}
            >
              {getStatusText(plant.status)}
            </span>
          )}
          <div
            className={`absolute top-4 right-4 w-5 h-5 rounded-full ${
              statusColors[plant.status] || "bg-gray-400"
            } border-2 border-white dark:border-gray-800`}
            title={t(plant.status || "Unknown")}
          />
        </div>
      )}

      {/* Title Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-custom-yellow/20 flex items-center justify-center shadow-md">
          <PiSolarPanelFill className="text-3xl text-custom-yellow" />
        </div>
        <h3 className="text-xl font-bold text-custom-dark-blue dark:text-custom-yellow  max-w-[60%]">
          {capitalizeWords(plant.name)}
        </h3>
      </div>

      {/* Details Section */}
      <div className="space-y-4">
        <div className="flex items-center text-gray-700 dark:text-custom-light-gray text-sm">
          <FaMapMarkerAlt className="text-custom-yellow mr-2" />
          <span>{parseAddress(plant.address)}</span>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-10 flex justify-end">
        <button className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-custom-yellow text-custom-dark-blue font-medium text-sm shadow-md hover:shadow-lg hover:bg-yellow-500 transition">
          {t("viewDetails")}
        </button>
      </div>
    </div>
  );
};

export default PlantCard;
