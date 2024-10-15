import { useRouter } from "next/navigation";
import { BsLightningFill, BsCashCoin } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { PiSolarPanelFill } from "react-icons/pi";
import { useTranslation } from "next-i18next";

const PlantCard = ({ plant, userId, tab }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/${userId}/${tab}/${plant.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-custom-dark-blue p-6 rounded-lg shadow-lg transition duration-500 hover:shadow-hover-dark-shadow dark:hover:shadow-hover-white-shadow cursor-pointer"
    >
      <h3 className="text-2xl font-primary font-bold text-custom-dark-blue dark:text-custom-yellow mb-4">
        <PiSolarPanelFill className="inline mr-2 text-custom-yellow" />
        {plant.name}
      </h3>
      <div className="space-y-2">
        <p className="flex items-center text-lg text-gray-700 dark:text-custom-light-gray truncate max-w-full">
          <FaLocationDot className="inline mr-2 text-custom-yellow" />
          <span className="font-secondary truncate block w-full max-w-full">
            {t("location")}: {plant.location || "N/A"}
          </span>
        </p>
        <p className="text-lg text-gray-700 dark:text-custom-light-gray">
          <BsLightningFill className="inline mr-2 text-custom-yellow" />
          <span className="font-secondary">
            {t("powerOutput")}: {plant.currentPowerOutputKW || "N/A"} kW
          </span>
        </p>
        <p className="text-lg text-gray-700 dark:text-custom-light-gray">
          <BsLightningFill className="inline mr-2 text-custom-yellow" />
          <span className="font-secondary">
            {t("todaysGeneration")}: {plant.dailyGenerationKWh || "N/A"} kWh
          </span>
        </p>
        <p className="text-lg text-gray-700 dark:text-custom-light-gray">
          <BsCashCoin className="inline mr-2 text-custom-yellow" />
          <span className="font-secondary">
            {t("totalIncome")}: {plant.totalIncomeEUR || "N/A"} EUR
          </span>
        </p>
      </div>
    </div>
  );
};

export default PlantCard;
