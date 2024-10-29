"use client";

import { useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { PiSolarPanelFill } from "react-icons/pi";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";
import useDeviceType from "@/hooks/useDeviceType";

const statusColors = {
  working: "bg-green-500",
  error: "bg-red-500",
  waiting: "bg-yellow-500",
  disconnected: "bg-gray-500",
};

const PlantsListTableItem = ({ plant }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const userId = useSelector(selectUser).id;
  const { isMobile } = useDeviceType();

  const handleRowClick = () => {
    router.push(`/dashboard/${userId}/plants/${plant.id}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      className="flex-1 flex cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 "
    >
      <td
        className={`${
          isMobile ? "w-[80%]" : "w-[40%]"
        } flex flex-1 py-4 pl-2 border-b border-gray-300 text-custom-dark-blue dark:text-custom-yellow justify-left md:justify-left items-center`}
      >
        <PiSolarPanelFill className="inline mr-2 text-custom-yellow text-2xl w-[15%]" />
        <p className="w-[85%]">{plant.name}</p>
      </td>
      {!isMobile && (
        <td className="flex w-[40%] py-4 px-6 border-b border-gray-300 text-custom-dark-blue dark:text-custom-yellow justify-left items-center">
          <FaLocationDot className="inline mr-2 text-custom-yellow w-[15%]" />
          <p className="w-[85%]">{plant.location || "N/A"}</p>
        </td>
      )}
      <td className="flex w-[20%] md:w-[20%] py-4  border-b border-gray-300 text-custom-dark-blue dark:text-custom-yellow justify-center items-center">
        <div className={`w-3 h-3 rounded-full ${statusColors[plant.status]}`} />
      </td>
    </tr>
  );
};

export default PlantsListTableItem;
