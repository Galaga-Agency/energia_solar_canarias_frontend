"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchPlants,
  fetchPlantsByProvider,
  selectLoading,
  selectPlants,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import SortMenu from "@/components/SortPlantsMenu";
import Pagination from "@/components/ui/Pagination";
import ProviderCard from "@/components/ProviderCard";
import PlantsMapModal from "@/components/PlantsMapModal";
import AddPlantForm from "@/components/AddPlantForm";
import PlantsListSkeleton from "@/components/loadingSkeletons/PlantsListSkeleton.js";
import PlantsListTableItem from "@/components/PlantsListTableItem";
import Texture from "@/components/Texture";
import InfoModal from "@/components/InfoModal";
import FilterSidebar from "@/components/FilterSidebar";
import ViewChangeDropdown from "@/components/ViewChangeDropdown";
import { providers } from "@/data/providers";
import { useTranslation } from "next-i18next";
import { FaMapMarkedAlt } from "react-icons/fa";
import { PiSolarPanelFill } from "react-icons/pi";
import Image from "next/image";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import { PlusIcon } from "@heroicons/react/24/outline";
import useDeviceType from "@/hooks/useDeviceType";
import usePlantSort from "@/hooks/usePlantSort";
import { HiViewGrid, HiViewList } from "react-icons/hi";
import PlantCard from "@/components/PlantCard";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const plants = useSelector(selectPlants);
  const theme = useSelector(selectTheme);
  const { isMobile } = useDeviceType();
  const sidebarRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("providers");
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const plantsPerPage = 12;
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);
  const startIndex = (currentPage - 1) * plantsPerPage;
  const paginatedPlants = filteredPlants.slice(
    startIndex,
    startIndex + plantsPerPage
  );

  const { sortedItems, sortItems } = usePlantSort(plants);

  // Initial data fetch
  useEffect(() => {
    if (user?.id && user?.tokenIdentificador && isInitialLoad) {
      dispatch(
        fetchPlants({
          userId: user.id,
          token: user.tokenIdentificador,
          page: currentPage,
          pageSize: plantsPerPage,
        })
      );
      setIsInitialLoad(false);
    }
  }, [user, dispatch, currentPage, isInitialLoad, plantsPerPage]);

  // Set filtered plants when view changes
  useEffect(() => {
    if (view === "plants") {
      setFilteredPlants(plants);
      sidebarRef.current?.clearFilters();
    }
  }, [view, plants]);

  // Update filtered plants on filter change
  const handleFilterChange = (newFilteredPlants) => {
    setFilteredPlants(newFilteredPlants);
    setCurrentPage(1);
  };

  // Handle provider click
  const handleProviderClick = (provider) => {
    const normalizedProviderName = provider.name
      ?.toLowerCase()
      .replace(/\s+/g, "");

    setSelectedProvider(normalizedProviderName);
    dispatch(
      fetchPlantsByProvider({
        userId: user.id,
        token: user.tokenIdentificador,
        provider: normalizedProviderName,
      })
    );
    router.push(`/dashboard/${user.id}/admin/${normalizedProviderName}`);
  };

  // Close modal
  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   if (selectedProvider) {
  //     dispatch(
  //       fetchPlantsByProvider({
  //         userId: user.id,
  //         token: user.tokenIdentificador,
  //         provider: selectedProvider,
  //       })
  //     );
  //   }
  // };

  // Handle view change (card/list)
  const handleViewChange = (value) => {
    if (value === "plants") {
      setIsModalOpen(true);
    }
    setView(value);
  };

  // Sort plants
  const handleSortChange = (criteria, order) => {
    sortItems(criteria, order);
    setFilteredPlants(sortedItems);
  };

  return (
    <div
      className={`min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar pb-16`}
    >
      <TransitionEffect />
      <div className="fixed top-4 right-4 flex flex-col md:flex-row items-center gap-2 z-[999]">
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
            {view === "providers" ? t("selectProvider") : t("selectPlant")}
          </h2>
        </div>

        {/* <AddPlantForm
          onClose={() => setIsFormOpen(false)}
          isOpen={isFormOpen}
        /> */}
        <PlantsMapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          plants={plants}
        />

        <div className="flex justify-start my-8">
          <ViewChangeDropdown onChange={handleViewChange} view={view} />
        </div>

        <div className="flex">
          {view === "plants" && (
            <FilterSidebar
              ref={sidebarRef}
              plants={plants}
              onFilterChange={handleFilterChange}
            />
          )}

          <div className={`flex-grow ${view === "plants" && "lg:px-8"}`}>
            {view === "providers" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {providers.map((provider, index) => (
                  <ProviderCard
                    key={index}
                    provider={provider}
                    onClick={() => handleProviderClick(provider)}
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="mb-4 text-lg text-custom-dark-blue dark:text-custom-yellow">
                  <p>
                    {t("plantsFound")}: {filteredPlants.length} {t("plants")}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <SortMenu onSortChange={handleSortChange} />
                  <div className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-1 flex">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue"
                          : "text-custom-dark-blue dark:text-custom-yellow hover:bg-white/10 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <HiViewList className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue"
                          : "text-custom-dark-blue dark:text-custom-yellow hover:bg-white/10 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <HiViewGrid className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="py-8">
                    <PlantsListSkeleton theme={theme} rows={plantsPerPage} />
                  </div>
                ) : filteredPlants.length > 0 ? (
                  viewMode === "list" ? (
                    paginatedPlants.map((plant) => (
                      <PlantsListTableItem
                        key={plant.id}
                        plant={{
                          ...plant,
                          id: plant.id?.toString(),
                        }}
                      />
                    ))
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
                      {paginatedPlants.map((plant) => (
                        <PlantCard key={plant.id} plant={plant} />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="h-auto w-full flex flex-col justify-center items-center">
                    <PiSolarPanelFill className="mt-24 text-center text-9xl text-custom-dark-blue dark:text-custom-light-gray" />
                    <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray">
                      {t("noPlantsFound")}
                    </p>
                  </div>
                )}

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-20 right-4 md:right-10 px-4 py-3 bg-custom-yellow text-custom-dark-blue rounded-full justify-center transition-colors duration-300 button-shadow flex items-center z-40"
        >
          {!isMobile ? (
            <>
              <PlusIcon className="w-5 h-5 mt-1 mr-2" />
              <span className="font-semibold">{t("addPlant")}</span>
            </>
          ) : (
            <PlusIcon className="w-4 h-6" />
          )}
        </button> */}
      </div>

      <BottomNavbar userId={user?.id} userClass={user?.clase} />

      {/* <InfoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={closeModal}
        title={t("loadingPlants")}
        message={t("loadingPlantsMessage")}
      /> */}
    </div>
  );
};

export default AdminDashboard;
