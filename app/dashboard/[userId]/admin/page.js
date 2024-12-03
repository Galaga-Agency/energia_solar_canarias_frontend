"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import LanguageSelector from "@/components/LanguageSelector";
import { selectUser } from "@/store/slices/userSlice";
import {
  fetchPlants,
  fetchPlantsByProvider,
  selectLoading,
  selectPlants,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import ThemeToggle from "@/components/ThemeToggle";
import SortMenu from "@/components/SortPlantsMenu";
import Pagination from "@/components/Pagination";
import ProviderCard from "@/components/ProviderCard";
import PlantsMapModal from "@/components/PlantsMapModal";
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
import ViewChangeDropdown from "@/components/ViewChangeDropdown";
import FilterSidebar from "@/components/FilterSidebar";
import usePlantSort from "@/hooks/usePlantSort";
import { providers } from "@/data/providers";

const AdminDashboard = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector(selectLoading);
  const plants = useSelector(selectPlants);
  const theme = useSelector(selectTheme);
  const { t } = useTranslation();
  const sidebarRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("providers");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const { isMobile } = useDeviceType();
  const plantsPerPage = 12;
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);
  const startIndex = (currentPage - 1) * plantsPerPage;
  const paginatedPlants = filteredPlants.slice(
    startIndex,
    startIndex + plantsPerPage
  );
  const { sortedItems, sortItems } = usePlantSort(plants);

  useEffect(() => {
    if (view === "plants") {
      setFilteredPlants(plants);
    }
  }, [view, plants]);

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

  useEffect(() => {
    if (!loading && plants.length > 0) {
      setFilteredPlants(plants);
    }
  }, [plants, loading]);

  const handleFilterChange = (newFilteredPlants) => {
    setFilteredPlants(newFilteredPlants);
    setCurrentPage(1);
  };

  const handleViewChange = (value) => {
    if (value === "plants") {
      setIsModalOpen(true);
    }
    setView(value);
  };

  const handleProviderClick = (provider) => {
    const normalizedProviderName =
      decodeURIComponent(provider.name?.toLowerCase().replace(/\s+/g, "")) ||
      "";
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

  console.log("plant from list: ", plants);

  const closeModal = () => {
    setIsModalOpen(false);
    if (selectedProvider) {
      dispatch(
        fetchPlantsByProvider({
          userId: user.id,
          token: user.tokenIdentificador,
          provider: selectedProvider,
        })
      );
    }
  };

  const handleSortChange = (criteria, order) => {
    sortItems(criteria, order);
    setFilteredPlants(sortedItems);
  };

  useEffect(() => {
    if (view === "plants") {
      setFilteredPlants(plants);
      sidebarRef.current?.clearFilters();
    }
  }, [view, plants]);

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
            {view === "providers" ? t("selectProvider") : t("selectPlant")}
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

                <div className="flex flex-col md:flex-row md:justify-between z-30">
                  <div className="flex gap-4 justify-start mb-6 md:mb-0 z-30">
                    <SortMenu onSortChange={handleSortChange} />
                    <button
                      onClick={() => setIsMapOpen(true)}
                      className="z-30 bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded-lg flex items-center justify-center button-shadow"
                    >
                      <FaMapMarkedAlt className="text-2xl" />
                    </button>
                  </div>
                  <PlantStatuses />
                </div>

                {loading || isModalOpen ? (
                  <div className="py-8">
                    <PlantListSkeleton theme={theme} rows={plantsPerPage} />
                  </div>
                ) : paginatedPlants.length > 0 ? (
                  <div className="py-8">
                    {paginatedPlants.map((plant) => (
                      <PlantsListTableItem
                        key={plant.id}
                        plant={{
                          ...plant,
                          id: plant.id?.toString(),
                        }}
                      />
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

        <button
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
        </button>
      </div>

      <BottomNavbar userId={user?.id} userClass={user?.clase} />

      <InfoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={closeModal}
        title={t("loadingPlants")}
        message={t("loadingPlantsMessage")}
      />
    </div>
  );
};

export default AdminDashboard;
