"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectPlants } from "@/store/slices/plantsSlice";
import { useTranslation } from "next-i18next";
import { Line } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdOutlineCo2 } from "react-icons/md";
import {
  faTree,
  faSeedling,
  faWind,
  faEuroSign,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { IoArrowBackCircle } from "react-icons/io5";
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
  const { userId, plantId } = params;

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
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      x: {
        duration: 3000,
        from: 0,
      },
      y: {
        duration: 3000,
        from: 500,
      },
    },
  };

  return (
    <div className="min-h-screen bg-custom-light-gray p-6 dark:bg-custom-dark-blue transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 gap-6">
        <button onClick={() => window.history.back()}>
          <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow" />
        </button>
        <h1 className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow">
          {plant.name}
        </h1>
      </div>

      <div className="bg-white dark:bg-custom-dark-gray shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 flex flex-col justify-between">
        <h2 className="text-xl font-primary mb-4">{t("plantDetails")}</h2>
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-custom-dark-blue dark:text-custom-yellow text-3xl mr-2"
            />
            <strong className="text-lg">{t("location")}</strong>
          </div>
          <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow text-right">
            {plant.location}
          </span>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faSeedling}
              className="text-green-500 text-3xl mr-2"
            />
            <strong className="text-lg">{t("currentPowerOutput")}: </strong>
          </div>
          <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow text-right">
            {plant.currentPowerOutputKW} kW
          </span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faEuroSign}
              className="text-custom-dark-blue text-3xl mr-2"
            />
            <strong className="text-lg">{t("totalIncome")}: </strong>
          </div>
          <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow text-right">
            {plant.totalIncomeEUR} EUR
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-custom-dark-gray shadow-lg rounded-lg p-6 transition-all duration-300 flex flex-col justify-between">
          <h2 className="text-xl font-primary mb-4">
            {t("environmentalImpact")}
          </h2>

          <div className="flex items-start justify-between mb-4">
            <MdOutlineCo2 className="text-custom-dark-blue dark:text-custom-yellow text-3xl mr-2" />
            <strong className="text-lg">{t("co2Reduction")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.environmentalImpact.co2ReductionTons} tons
            </span>
          </div>

          <div className="flex items-start justify-between mb-4">
            <FontAwesomeIcon
              icon={faTree}
              className="text-green-500 text-3xl mr-2"
            />
            <strong className="text-lg">{t("plantedTrees")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.environmentalImpact.plantedTrees}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <FontAwesomeIcon
              icon={faWind}
              className="text-custom-dark-blue dark:text-custom-yellow text-3xl mr-2"
            />
            <strong className="text-lg">{t("coalSavings")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.environmentalImpact.coalSavingsTons} tons
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-custom-dark-gray shadow-lg rounded-lg p-6 transition-all duration-300 flex flex-col justify-between">
          <h2 className="text-xl font-primary mb-4">{t("energyStatistics")}</h2>

          <div className="flex items-start justify-between mb-4">
            <strong className="text-lg">{t("capacity")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.capacityKW} kW
            </span>
          </div>

          <div className="flex items-start justify-between mb-4">
            <strong className="text-lg">{t("monthlyGeneration")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.monthlyGenerationKWh} kWh
            </span>
          </div>

          <div className="flex items-start justify-between">
            <strong className="text-lg">{t("totalGenerated")}: </strong>
            <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {plant.totalGeneratedMWh} MWh
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-custom-dark-gray shadow-lg rounded-lg p-6 mt-6 transition-all duration-300">
        <h2 className="text-xl font-primary mb-4">{t("powerTimeSeries")}</h2>
        <div id="powerChart">
          <Line data={powerData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PlantDetailsPage;
