"use client";

import React, { useEffect, useState } from "react";
import AddPlantForm from "./AddPlantForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import FilterPlantsInput from "@/components/FilterPlantsInput";
import SortMenu from "@/components/SortPlantsMenu";
import Pagination from "@/components/Pagination";
import usePlantSort from "@/hooks/usePlantSort";
import PlantCard from "@/components/PlantCard";
import PlantsMapModal from "@/components/PlantsMapModal";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import Loading from "./Loading";
import Image from "next/image";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Texture from "./Texture";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import PlantsListTableItem from "./PlantsListTableItem";
import { selectIsAdmin, selectUser } from "@/store/slices/userSlice";
import { PiSolarPanelFill } from "react-icons/pi";
import PlantStatuses from "./PlantStatuses";
import useDeviceType from "@/hooks/useDeviceType";
import usePlantFilter from "@/hooks/usePlantFilter";

const PlantsTab = () => {
  const { t } = useTranslation();
  const isAdmin = useSelector(selectIsAdmin);
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = !isAdmin ? 6 : 7;
  const { filteredItems, filterItems } = usePlantFilter(plants);
  const { sortedItems: sortedPlants, sortItems } = usePlantSort(filteredItems);

  const theme = useSelector(selectTheme);
  const user = useSelector(selectUser);
  const { isMobile } = useDeviceType();

  useEffect(() => {
    const fetchPlantsData = async () => {
      try {
        const response = await fetch("/plants.json");
        const data = await response.json();
        setPlants(data.plants);
      } catch (error) {
        console.error("Error fetching the plants data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlantsData();
  }, []);

  if (isLoading) {
    return <Loading theme={theme} />;
  }

  // Pagination logic
  const totalPages = Math.ceil(sortedPlants.length / plantsPerPage);
  const startIndex = (currentPage - 1) * plantsPerPage;
  const paginatedPlants = sortedPlants.slice(
    startIndex,
    startIndex + plantsPerPage
  );

  return (
    <>
      <Texture />
      <div className="relative h-auto z-10 p-8">
        <div className="flex items-center mb-10 md:mb-2 z-10">
          <Image
            src={companyIcon}
            alt="Company Icon"
            className="w-12 h-12 mr-2 z-10"
          />
          <h2 className="z-10 text-4xl dark:text-custom-yellow text-custom-dark-blue">
            {t("plants")}
          </h2>
        </div>

        {/* Add Plant Form */}
        <AddPlantForm
          onClose={() => setIsFormOpen(false)}
          isOpen={isFormOpen}
        />

        {/* Plants Map Modal */}
        <PlantsMapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          plants={sortedPlants}
        />

        {/* Filter and Sort */}
        <FilterPlantsInput onFilterChange={filterItems} />
        <div className="flex flex-col md:flex-row md:justify-between z-30">
          <div className="flex gap-4 justify-start mb-6 md:mb-0 z-30">
            <div className="flex-grow">
              <SortMenu onSortChange={sortItems} />
            </div>
            <button
              onClick={() => setIsMapOpen(true)}
              className="z-30 bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded-lg flex items-center justify-center button-shadow"
            >
              <FaMapMarkedAlt className="text-2xl" />
            </button>
          </div>

          <PlantStatuses />
        </div>

        {/* Render Plants */}
        {paginatedPlants.length > 0 ? (
          user.clase === "admin" ? (
            <div className="my-12">
              <table className="min-w-full border-collapse border border-gray-300 bg-white dark:bg-gray-800 shadow-md mb-12">
                <thead className="rounded-md">
                  <tr className="bg-gray-100 dark:bg-gray-700 flex">
                    <th className="flex w-[75%] md:w-[40%] py-3 md:px-6 border-b border-gray-300 justify-center items-center text-custom-dark-blue dark:text-custom-yellow">
                      {t("plantName")}
                    </th>
                    {!isMobile && (
                      <th className="flex md:w-[40%] py-3 border-b border-gray-300 justify-center xl:justify-left items-left text-custom-dark-blue dark:text-custom-yellow">
                        {t("location")}
                      </th>
                    )}
                    <th className="flex w-[25%] md:w-[20%] py-3 md:px-6 border-b border-gray-300 text-custom-dark-blue dark:text-custom-yellow justify-center items-center">
                      {t("state")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPlants.map((plant) => (
                    <PlantsListTableItem key={plant.id} plant={plant} />
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-10 w-full">
                {paginatedPlants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
              <>
                {sortedPlants.length > plantsPerPage && (
                  <div className="flex justify-center w-full">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            </>
          )
        ) : (
          <div className="h-auto w-full flex flex-col justify-center items-center">
            <PiSolarPanelFill className="mt-24 text-center text-9xl text-custom-dark-blue dark:text-custom-light-gray" />
            <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray">
              {t("noPlantsFound")}
            </p>
          </div>
        )}

        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-20 right-4 md:right-10 w-12 h-12 bg-custom-yellow text-custom-dark-blue rounded-full flex items-center justify-center transition-colors duration-300 button-shadow"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default PlantsTab;
