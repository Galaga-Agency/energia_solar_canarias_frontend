"use client";

import React, { useState, useEffect } from "react";
import AddPlantForm from "./AddPlantForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import FilterInput from "@/components/FilterInput";
import SortMenu from "@/components/SortMenu";
import Pagination from "@/components/Pagination";
import useFilter from "@/hooks/useFilter";
import useSort from "@/hooks/useSort";
import { useSelector } from "react-redux";
import {
  selectPlants,
  selectError,
  selectLoading,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import PlantCard from "@/components/PlantCard";
import PlantsMapModal from "@/components/PlantsMapModal";
import { FaMapMarkedAlt } from "react-icons/fa";
import GoogleMapsLoader from "./GoogleMapsLoader";
import { useTranslation } from "next-i18next";

const PlantsTab = () => {
  const { t } = useTranslation();
  const plants = useSelector(selectPlants);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectLoading);
  const userId = useSelector(selectUser)?.id;
  const [isDataReady, setIsDataReady] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && plants.length > 0) {
      setIsDataReady(true);
    }
  }, [isLoading, plants]);

  if (!isDataReady && (isLoading || plants.length === 0)) {
    return (
      <div className="p-8 md:p-10 h-full flex items-center justify-center">
        <div className="text-lg text-custom-dark-gray">Loading...</div>
      </div>
    );
  }

  const handleAddPlantClick = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const openMap = () => {
    setIsMapOpen(true);
  };

  const closeMap = () => {
    setIsMapOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 6;

  const { filteredItems: filteredPlants, filterItems } = useFilter(
    plants,
    "name"
  );
  const { sortedItems: sortedPlants, sortItems } = useSort(filteredPlants);

  const totalPages = Math.ceil(sortedPlants.length / plantsPerPage);
  const startIndex = (currentPage - 1) * plantsPerPage;
  const paginatedPlants = sortedPlants.slice(
    startIndex,
    startIndex + plantsPerPage
  );

  if (isLoading) {
    return (
      <div className="p-8 md:p-10 h-full flex items-center justify-center">
        <div className="text-lg text-custom-dark-gray">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 h-full pb-24">
      <h2 className="text-4xl dark:text-custom-yellow text-custom-dark-blue mb-10 md:mb-2">
        Plants
      </h2>

      <AddPlantForm onClose={closeForm} isOpen={isFormOpen} />
      <PlantsMapModal
        isOpen={isMapOpen}
        onClose={closeMap}
        plants={sortedPlants}
      />

      <FilterInput onFilterChange={filterItems} />
      <div className="flex gap-4 justify-start">
        <SortMenu onSortChange={sortItems} />
        <button
          onClick={openMap}
          className="bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded-lg flex-shrink-0 button-shadow"
        >
          <FaMapMarkedAlt className="text-2xl" />
        </button>
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {paginatedPlants.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-10">
            {paginatedPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} userId={userId} />
            ))}
          </div>

          {sortedPlants.length > plantsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <p className="text-center text-lg text-custom-dark-gray">
          {t("noPlantsFound")}
        </p>
      )}

      <button
        onClick={handleAddPlantClick}
        className="absolute bottom-20 right-4 md:right-10 w-12 h-12 bg-custom-yellow text-custom-dark-blue rounded-full flex items-center justify-center transition-colors duration-300 button-shadow"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PlantsTab;
