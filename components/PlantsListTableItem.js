import { useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { PiSolarPanelFill } from "react-icons/pi";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";
import useDeviceType from "@/hooks/useDeviceType";
import { TbCalendarCheck } from "react-icons/tb";

const statusColors = {
  working: "bg-green-500",
  error: "bg-red-500",
  waiting: "bg-yellow-500",
  disconnected: "bg-gray-500",
};

const PlantsListTableItem = ({ plant }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useSelector(selectUser);
  const userId = user?.id;
  const { isMobile } = useDeviceType();
  const plantId = plant.id.toString();
  const provider = plant.organization?.toLowerCase();

  const handleRowClick = () => {
    router.push(`/dashboard/${userId}/plants/${provider}/${plantId}`);
  };

  const idPassed = plant.id.toString();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <tbody>
          <tr
            onClick={handleRowClick}
            className="flex-1 flex cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300"
          >
            <td
              className={`${
                isMobile ? "w-[80%]" : "w-[40%]"
              } flex flex-1 py-4 pl-2 border-b border-gray-300 text-custom-dark-blue dark:text-custom-yellow justify-left md:justify-left items-center`}
            >
              <PiSolarPanelFill className="inline mr-2 text-custom-yellow text-2xl w-[15%] drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]" />
              <p className="w-[85%] text-custom-dark-blue dark:text-custom-light-gray">
                {plant.name}
              </p>
            </td>
            {!isMobile && (
              <td className="flex w-[40%] py-4 border-b border-gray-300 text-custom-dark-blue dark:text-custom-yellow justify-left items-center">
                {provider === "victronenergy" ? (
                  <>
                    <TbCalendarCheck className="inline text-xl mr-2 text-custom-yellow w-[15%] drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]" />
                    <span className="text-custom-dark-blue dark:text-custom-light-gray">
                      {formatDate(plant.installation_date)}
                    </span>
                  </>
                ) : (
                  <>
                    <FaLocationDot className="inline mr-2 text-custom-yellow w-[15%] drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]" />
                    <p
                      className="w-[85%] overflow-hidden text-ellipsis whitespace-nowrap text-custom-dark-blue dark:text-custom-light-gray"
                      title={plant.address || "N/A"}
                    >
                      {plant.address || "N/A"}
                    </p>
                  </>
                )}
              </td>
            )}
            {provider !== "victronenergy" && (
              <td className="flex w-[20%] md:w-[20%] py-4 border-b border-gray-300 text-custom-dark-blue dark:text-custom-yellow justify-center items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    statusColors[plant.status] || "bg-gray-500" // Default to gray if status is null
                  } drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]`}
                />
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PlantsListTableItem;
