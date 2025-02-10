import React from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt } from "react-icons/fa";
import { PiSolarPanelFill } from "react-icons/pi";
import {
  BsBatteryCharging,
  BsBatteryFull,
  BsBatteryHalf,
} from "react-icons/bs";
import { useTranslation } from "react-i18next";

const PlantCard = ({ plant, user, isMobile }) => {
  const router = useRouter();
  const userId = user?.id;
  const provider = plant?.organization?.toLowerCase();
  const { t } = useTranslation();

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
      label: "status.Cargando",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    descargando: {
      icon: BsBatteryHalf,
      color: "text-red-500",
      label: "status.Descargando",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    "en reposo": {
      icon: BsBatteryFull,
      color: "text-blue-500",
      label: "status.En reposo",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
  };

  const statusConfig = {
    working: {
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      dotColor: "bg-green-500",
    },
    error: {
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      dotColor: "bg-red-500",
    },
    waiting: {
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      dotColor: "bg-yellow-500",
    },
    disconnected: {
      color: "text-gray-500",
      bgColor: "bg-gray-100 dark:bg-gray-900/30",
      dotColor: "bg-gray-500",
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

  const getBatteryStateLabel = (state) => {
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
      default:
        return "";
    }
  };

  const handleCardClick = () => {
    console.log("redirection...");
    router.push(`/dashboard/${userId}/plants/${provider}/${plant.id}`);
  };

  const currentStatus = plant.status?.toLowerCase();
  const statusStyle = statusConfig[currentStatus] || statusConfig.disconnected;
  const batteryState = batteryStateIcons[currentStatus];

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-custom-yellow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 flex flex-col h-full">
        {/* Top Section with Icon and Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-custom-yellow/20 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <PiSolarPanelFill className="text-3xl text-custom-yellow" />
            </div>
          </div>

          {/* Status Badge */}
          {provider === "victronenergy" ? (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                batteryState?.bgColor || "bg-gray-100 dark:bg-gray-900/30"
              }`}
            >
              {!isMobile && (
                <span
                  className={`text-sm font-medium ${
                    batteryState?.color || "text-gray-500"
                  }`}
                >
                  {t(batteryState?.label || "status.Unknown")}
                </span>
              )}
              {React.createElement(batteryState?.icon || BsBatteryFull, {
                className: `${batteryState?.color || "text-gray-500"} text-xl`,
              })}
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusStyle.bgColor}`}
            >
              <div className={`w-2 h-2 rounded-full ${statusStyle.dotColor}`} />
              <span className={`text-sm font-medium ${statusStyle.color}`}>
                {getStatusText(currentStatus)}
              </span>
            </div>
          )}
        </div>

        {/* Plant Name */}
        <h3 className="text-xl font-bold text-custom-dark-blue dark:text-custom-yellow mb-4">
          {plant.name}
        </h3>

        {/* Location Info */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-6">
          <FaMapMarkerAlt className="text-custom-yellow" />
          <span className="text-sm">{parseAddress(plant.address)}</span>
        </div>

        {/* View Details Button */}
        <div className="mt-auto">
          <button className="w-full px-4 py-2.5 rounded-lg bg-custom-yellow text-custom-dark-blue font-medium text-sm shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 opacity-90 group-hover:opacity-100">
            {t("viewDetails")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
