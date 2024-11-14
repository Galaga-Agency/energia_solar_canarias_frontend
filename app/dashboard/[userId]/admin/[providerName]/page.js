"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import LanguageSelector from "@/components/LanguageSelector";
import { selectUser } from "@/store/slices/userSlice";
import {
  fetchPlants,
  selectLoading,
  selectPlants,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import ThemeToggle from "@/components/ThemeToggle";
import SortMenu from "@/components/SortPlantsMenu";
import Pagination from "@/components/Pagination";
import { FaMapMarkedAlt } from "react-icons/fa";
import { PiSolarPanelFill } from "react-icons/pi";
import AddPlantForm from "@/components/AddPlantForm";
import Image from "next/image";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Texture from "@/components/Texture";
import PlantStatuses from "@/components/PlantStatuses";
import PlantListSkeleton from "@/components/LoadingSkeletons/PlantListSkeleton";
import { useTranslation } from "next-i18next";
import { PlusIcon } from "@heroicons/react/24/outline";
import InfoModal from "@/components/InfoModal";
import PlantsListTableItem from "@/components/PlantsListTableItem";
import useDeviceType from "@/hooks/useDeviceType";
import FilterSidebar from "@/components/FilterSidebar";
import usePlantSort from "@/hooks/usePlantSort";
import PlantsMapModal from "@/components/PlantsMapModal";

const ProviderPage = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector(selectLoading);
  const plants = useSelector(selectPlants);
  const theme = useSelector(selectTheme);
  const { t } = useTranslation();

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Declare the state for the modal
  const isLoading = useSelector(selectLoading);
  const plantsPerPage = 10;
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);
  const { isMobile } = useDeviceType();
  const startIndex = (currentPage - 1) * plantsPerPage;
  const paginatedPlants = filteredPlants.slice(
    startIndex,
    startIndex + plantsPerPage
  );
  const { sortedItems, sortItems } = usePlantSort(plants);

  // We will check for the providerName in router.query but do so safely
  const { providerName } = router.query || {}; // Safely destructure providerName

  // UseEffect that only runs when `providerName` is available
  useEffect(() => {
    if (!user?.id) {
      router.push("/");
    } else if (providerName) {
      setIsInitialLoad(true);
      dispatch(
        fetchPlants({
          userId: user.id,
          token: user.tokenIdentificador,
          provider: providerName, // Fetch plants for the selected provider
        })
      );
    }
  }, [user, router, dispatch, providerName]);

  useEffect(() => {
    if (!loading && plants.length > 0) {
      setFilteredPlants(plants);
      setIsInitialLoad(false);
    }
  }, [plants, loading]);

  const handleFilterChange = (newFilteredPlants) => {
    setFilteredPlants(newFilteredPlants);
    setCurrentPage(1);
  };

  const handleSortChange = (criteria, order) => {
    sortItems(criteria, order);
    setFilteredPlants(sortedItems);
  };

  return (
    <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto pb-16">
      <TransitionEffect />
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        <ThemeToggle />
        <LanguageSelector />
      </div>
      <Texture />
      <div className="relative h-auto z-10 p-8">
        <div className="flex items-center mb-10 md:mb-2 z-10">
          <Image
            src={companyIcon}
            alt="Company Icon"
            className="w-12 h-12 mr-2 z-10"
          />
          <h2 className="z-10 text-4xl dark:text-custom-yellow text-custom-dark-blue">
            {t("findPlants")} - {providerName}
          </h2>
        </div>

        <AddPlantForm
          onClose={() => setIsFormOpen(false)}
          isOpen={isFormOpen}
        />
        <PlantsMapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          plants={plants}
        />

        <div className="flex">
          <FilterSidebar plants={plants} onFilterChange={handleFilterChange} />

          {/* Plant list */}
          <div className="flex-grow lg:px-8">
            <div className="mb-4 text-lg text-custom-dark-blue dark:text-custom-yellow">
              <p>
                {t("plantsFound")}: {filteredPlants.length} {t("plants")}
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between z-30">
              <div className="flex gap-4 justify-start mb-6 md:mb-0 z-30">
                <div className="flex-grow">
                  <SortMenu onSortChange={handleSortChange} />
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

            {isLoading || isModalOpen ? (
              <div className="py-8">
                <PlantListSkeleton theme={theme} rows={plantsPerPage} />
              </div>
            ) : paginatedPlants.length > 0 ? (
              <div className="py-8">
                {paginatedPlants.map((plant) => (
                  <PlantsListTableItem key={plant.id} plant={plant} />
                ))}
              </div>
            ) : (
              <div className="h-auto w-full flex flex-col justify-center items-center">
                <PiSolarPanelFill className="mt-24 text-center text-9xl text-custom-dark-blue dark:text-custom-light-gray" />
                <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray">
                  {t("noPlantsFound")}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      <BottomNavbar userId={user && user.id} userClass={user && user.clase} />

      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
        title={t("loadingPlants")}
        message={t("loadingPlantsMessage")}
      />
    </div>
  );
};

export default ProviderPage;
