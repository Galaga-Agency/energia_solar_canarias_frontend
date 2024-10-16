"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectPlants } from "@/store/slices/plantsSlice";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTree,
  faSeedling,
  faWind,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PlantDetailsPage = ({ params }) => {
  const { userId, tab, plantId } = params;

  const plants = useSelector(selectPlants);
  const [plant, setPlant] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const selectedPlant = plants.find((p) => p.id === parseInt(plantId));
    setPlant(selectedPlant);
  }, [plantId, plants]);

  if (!plant) {
    return <p>{t("loadingPlantDetails")}</p>;
  }

  const powerData = {
    labels: plant.timeSeriesPowerData.map((data) => data.time),
    datasets: [
      {
        label: t("powerKW"),
        data: plant.timeSeriesPowerData.map((data) => data.powerKW),
        borderColor: "rgb(255, 213, 122)",
        backgroundColor: "rgba(255, 213, 122, 0.5)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-custom-light-gray p-6 dark:bg-custom-dark-blue transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="bg-custom-dark-blue text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-custom-yellow"
        >
          {t("goBack")}
        </button>
        <h1 className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow">
          {plant.name}
        </h1>
      </div>

      <div className="bg-white dark:bg-custom-dark-gray shadow-lg rounded-lg p-6 mb-6 transition-all duration-300">
        <h2 className="text-xl font-primary mb-2">{t("plantDetails")}</h2>
        <p className="mb-2">
          <strong>{t("location")}: </strong>
          <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
            {plant.location}
          </span>
        </p>
        <p className="mb-2 flex items-center">
          <FontAwesomeIcon
            icon={faSeedling}
            className="text-green-500 text-3xl mr-2"
          />
          <strong>{t("currentPowerOutput")}: </strong>
          <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
            {plant.currentPowerOutputKW} kW
          </span>
        </p>
        <p className="mb-2 flex items-center">
          <FontAwesomeIcon
            icon={faDollarSign}
            className="text-yellow-500 text-3xl mr-2"
          />
          <strong>{t("totalIncome")}: </strong>
          <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
            {plant.totalIncomeEUR} EUR
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-custom-dark-gray shadow-lg rounded-lg p-4 transition-all duration-300">
          <h2 className="text-xl font-primary mb-4">
            {t("environmentalImpact")}
          </h2>
          <p className="flex items-center">
            <FontAwesomeIcon
              icon={faTree}
              className="text-green-500 text-3xl mr-2"
            />
            <strong>{t("co2Reduction")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.environmentalImpact.co2ReductionTons} tons
            </span>
          </p>
          <p className="flex items-center">
            <FontAwesomeIcon
              icon={faTree}
              className="text-green-500 text-3xl mr-2"
            />
            <strong>{t("plantedTrees")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.environmentalImpact.plantedTrees}
            </span>
          </p>
          <p className="flex items-center">
            <FontAwesomeIcon
              icon={faWind}
              className="text-green-500 text-3xl mr-2"
            />
            <strong>{t("coalSavings")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.environmentalImpact.coalSavingsTons} tons
            </span>
          </p>
        </div>

        <div className="bg-white dark:bg-custom-dark-gray shadow-lg rounded-lg p-4 transition-all duration-300">
          <h2 className="text-xl font-primary mb-4">{t("energyStatistics")}</h2>
          <p>
            <strong>{t("capacity")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.capacityKW} kW
            </span>
          </p>
          <p>
            <strong>{t("monthlyGeneration")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.monthlyGenerationKWh} kWh
            </span>
          </p>
          <p>
            <strong>{t("totalGenerated")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.totalGeneratedMWh} MWh
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-custom-dark-gray shadow-lg rounded-lg p-6 mt-6 transition-all duration-300">
        <h2 className="text-xl font-primary mb-4">{t("powerTimeSeries")}</h2>
        <Line data={powerData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default PlantDetailsPage;
