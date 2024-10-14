"use client";

import { useEffect, useState } from "react";
import { fetchPlantsMock } from "@/services/api";
import { BsLightningFill, BsBuilding, BsCashCoin } from "react-icons/bs";
import { RiPlantFill } from "react-icons/ri";
import FilterInput from "@/components/FilterInput";
import SortMenu from "@/components/SortMenu";
import Pagination from "@/components/Pagination";
import useFilter from "@/hooks/useFilter";
import useSort from "@/hooks/useSort";
import { useTranslation } from "next-i18next";

const PlantList = () => {
  const { t } = useTranslation();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 6; // Show a maximum of 6 plants per page

  const { filteredItems: filteredPlants, filterItems } = useFilter(
    plants,
    "name"
  );
  const { sortedItems: sortedPlants, sortItems } = useSort(filteredPlants);

  useEffect(() => {
    const fetchAndUpdatePlants = async () => {
      try {
        const data = await fetchPlantsMock();
        setPlants(data);
      } catch (error) {
        console.error("Error fetching plants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdatePlants();
  }, []);

  const totalPages = Math.ceil(sortedPlants.length / plantsPerPage);
  const startIndex = (currentPage - 1) * plantsPerPage;
  const paginatedPlants = sortedPlants.slice(
    startIndex,
    startIndex + plantsPerPage
  );

  if (loading) {
    return (
      <p className="text-center text-lg text-custom-yellow">
        {t("loadingPlants")}
      </p>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <FilterInput onFilterChange={filterItems} />
      <SortMenu onSortChange={sortItems} />
      {paginatedPlants.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPlants.map((plant) => (
            <div
              key={plant.id}
              className="bg-white dark:bg-custom-dark-blue p-6 rounded-lg shadow-lg transition duration-500 hover:shadow-hover-dark-shadow dark:hover:shadow-hover-white-shadow"
            >
              <h3 className="text-2xl font-primary font-bold text-custom-dark-blue dark:text-custom-yellow mb-4">
                <RiPlantFill className="inline mr-2 text-custom-yellow" />
                {plant.name}
              </h3>
              <div className="space-y-2">
                <p className="flex items-center text-lg text-gray-700 dark:text-custom-light-gray truncate max-w-lg">
                  <BsBuilding className="inline mr-2 text-custom-yellow" />
                  <span className="font-secondary truncate block w-full max-w-xs">
                    {t("location")}: {plant.location}
                  </span>
                </p>
                <p className="text-lg text-gray-700 dark:text-custom-light-gray">
                  <BsLightningFill className="inline mr-2 text-custom-yellow" />
                  <span className="font-secondary">
                    {t("powerOutput")}: {plant.currentPowerOutputKW} kW
                  </span>
                </p>
                <p className="text-lg text-gray-700 dark:text-custom-light-gray">
                  <BsLightningFill className="inline mr-2 text-custom-yellow" />
                  <span className="font-secondary">
                    {t("todaysGeneration")}: {plant.dailyGenerationKWh} kWh
                  </span>
                </p>
                <p className="text-lg text-gray-700 dark:text-custom-light-gray">
                  <BsCashCoin className="inline mr-2 text-custom-yellow" />
                  <span className="font-secondary">
                    {t("totalIncome")}: {plant.totalIncomeEUR} EUR
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-custom-dark-gray">
          {t("noPlantsFound")}
        </p>
      )}
      {sortedPlants.length > plantsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default PlantList;
