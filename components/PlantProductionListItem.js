import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";
import { FaLocationDot } from "react-icons/fa6";
import { PiSolarPanelFill } from "react-icons/pi";
import { Sun } from "lucide-react";
import { capitalizeEachWord } from "@/utils/textUtils";

const PlantProductionListItem = ({ plant, t }) => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const userId = user?.id;
  const provider = plant.organization?.toLowerCase();

  const handleClick = () => {
    router.push(`/dashboard/${userId}/plants/${provider}/${plant.id}`);
  };

  const currentKW = ((plant.current_power || 0) / 1000).toFixed(2);
  const dailyKWh = (plant.daily_energy || 0).toFixed(2);
  const monthlyKWh = (plant.monthly_energy || 0).toFixed(2);
  const totalMWh = ((plant.total_energy || 0) / 1000).toFixed(2);

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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
      return address;
    } catch {
      return address || "N/A";
    }
  };

  return (
    <div className="w-full mb-3 mx-auto">
      <div
        onClick={handleClick}
        className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
          {/* Left Side - Icon and Name */}
          <div className="flex items-center gap-3 w-full sm:w-1/3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-custom-yellow/10 rounded-full flex items-center justify-center">
                <PiSolarPanelFill className="text-xl text-custom-yellow drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-custom-dark-blue dark:text-custom-yellow truncate">
                {capitalizeWords(plant.name)}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <FaLocationDot className="text-custom-yellow flex-shrink-0" />
                <p className="truncate">{parseAddress(plant.address)}</p>
              </div>
            </div>
          </div>

          {/* Center - Current Production */}
          <div className="flex items-center w-full sm:w-1/3 sm:justify-center">
            <div className="flex mx-auto items-center gap-2">
              <Sun className="text-custom-yellow w-5 h-5" />
              <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {currentKW} kW
              </span>
            </div>
          </div>

          {/* Right Side - Production Stats */}
          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 w-full sm:w-1/3">
            <div className="flex flex-col text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {dailyKWh} kWh
              </span>
              <span className="text-xs sm:text-sm">{t("today")}</span>
            </div>

            <div className="flex flex-col text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {monthlyKWh} kWh
              </span>
              <span className="text-xs sm:text-sm">
                {capitalizeEachWord(t("this_month"))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantProductionListItem;
