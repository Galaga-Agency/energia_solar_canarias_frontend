"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectPlants } from "@/store/slices/plantsSlice";
import { useTranslation } from "next-i18next";

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

  return (
    <div>
      <h1>{plant.name}</h1>
      <p>
        {t("location")}: {plant.location}
      </p>
      <p>
        {t("powerOutput")}: {plant.currentPowerOutputKW} kW
      </p>
      <p>
        {t("todayGeneration")}: {plant.dailyGenerationKWh} kWh
      </p>
      <p>
        {t("totalIncome")}: {plant.totalIncomeEUR} EUR
      </p>
    </div>
  );
};

export default PlantDetailsPage;
