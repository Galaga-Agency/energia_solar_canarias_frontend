"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchPlants,
  fetchPlantsByProvider,
  selectIsDataFetched,
  selectLoading,
  selectPlants,
  resetFetchState,
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
import PlantsListSkeleton from "@/components/loadingSkeletons/PlantsListSkeleton.js";
import PlantsListTableItem from "@/components/PlantsListTableItem";
import Texture from "@/components/Texture";
import FilterSidebar from "@/components/FilterSidebar";
import ViewChangeDropdown from "@/components/ViewChangeDropdown";
import { providers } from "@/data/providers";
import { useTranslation } from "next-i18next";
import { PiSolarPanelFill } from "react-icons/pi";
import Image from "next/image";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import { motion } from "framer-motion";
import useDeviceType from "@/hooks/useDeviceType";
import usePlantSort from "@/hooks/usePlantSort";
import { HiViewGrid, HiViewList } from "react-icons/hi";
import PlantCard from "@/components/PlantCard";
import {
  selectDashboardView,
  setDashboardView,
} from "@/store/slices/dashboardViewSlice";
import { IoFilter } from "react-icons/io5";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const plants = useSelector(selectPlants);
  const theme = useSelector(selectTheme);
  const isDataFetched = useSelector(selectIsDataFetched);
  const { isMobile, isTablet } = useDeviceType();
  const sidebarRef = useRef(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const view = useSelector(selectDashboardView);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const GRID_ITEMS_PER_PAGE = isTablet ? 10 : 9;
  const LIST_ITEMS_PER_PAGE = 7;

  const itemsPerPage =
    viewMode === "grid" ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE;

  const { sortedItems, sortItems } = usePlantSort(plants);

  // Calculate pagination
  const getCurrentPageItems = (items, page, perPage) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return items.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
  const paginatedPlants = getCurrentPageItems(
    filteredPlants,
    currentPage,
    itemsPerPage
  );

  // Reset page when view mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPlants]);

  // Validate current page
  useEffect(() => {
    const maxPage = Math.ceil(filteredPlants.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    }
  }, [filteredPlants, currentPage, itemsPerPage]);

  // Initial data fetch
  useEffect(() => {
    if (user?.id && user?.tokenIdentificador && !isDataFetched) {
      dispatch(
        fetchPlants({
          userId: user.id,
          token: user.tokenIdentificador,
          page: currentPage,
          pageSize: itemsPerPage,
        })
      );
    }
  }, [user, dispatch, currentPage, itemsPerPage, isDataFetched]);

  // Set filtered plants when view changes
  useEffect(() => {
    if (view === "plants") {
      setFilteredPlants(plants);
      sidebarRef.current?.clearFilters();
    }
  }, [view, plants]);

  const handleFilterChange = (newFilteredPlants) => {
    setFilteredPlants(newFilteredPlants);
    setCurrentPage(1);
  };

  const handleProviderClick = (provider) => {
    const normalizedProviderName = provider.name
      ?.toLowerCase()
      .replace(/\s+/g, "");

    setSelectedProvider(normalizedProviderName);
    dispatch(resetFetchState());
    dispatch(
      fetchPlantsByProvider({
        userId: user.id,
        token: user.tokenIdentificador,
        provider: normalizedProviderName,
      })
    );
    router.push(`/dashboard/${user.id}/admin/${normalizedProviderName}`);
  };

  const handleViewChange = (value) => {
    dispatch(setDashboardView(value));
    setCurrentPage(1);
  };

  const handleSortChange = (criteria, order) => {
    sortItems(criteria, order);
    setFilteredPlants(sortedItems);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar pb-16">
      <TransitionEffect />
      <Texture />

      <div className="relative z-20">
        <motion.div
          className="fixed top-4 right-4 flex items-center gap-2 z-30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <ThemeToggle />
          <LanguageSelector />
        </motion.div>

        <div className="relative h-auto p-4 md:p-8">
          <motion.div
            className="flex items-center my-6 xl:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Image
              src={companyIcon}
              alt="Company Icon"
              className="w-12 h-12 mr-2"
            />
            <h2 className="text-4xl dark:text-custom-yellow text-custom-dark-blue">
              {view === "providers" ? t("selectProvider") : t("selectPlant")}
            </h2>
          </motion.div>

          <PlantsMapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            plants={plants}
          />

          <motion.div
            className="flex justify-start my-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <ViewChangeDropdown onChange={handleViewChange} view={view} />
          </motion.div>

          <motion.div
            className="flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {view === "plants" && (
              <>
                {(isMobile || isTablet) && (
                  <>
                    <motion.button
                      className="xl:hidden fixed bottom-20 left-5 z-40 bg-custom-yellow w-12 h-12 flex rounded-full justify-center items-center button-shadow"
                      onClick={() => setIsSidebarOpen(true)}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IoFilter className="text-2xl text-custom-dark-blue" />
                    </motion.button>

                    <FilterSidebar
                      ref={sidebarRef}
                      plants={plants}
                      onFilterChange={handleFilterChange}
                    />
                  </>
                )}
                {!isMobile && !isTablet && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                  >
                    <FilterSidebar
                      ref={sidebarRef}
                      plants={plants}
                      onFilterChange={handleFilterChange}
                    />
                  </motion.div>
                )}
              </>
            )}

            <motion.div
              className={`flex-grow ${view === "plants" && "lg:px-8"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {view === "providers" ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  {providers.map((provider, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ProviderCard
                        provider={provider}
                        onClick={() => handleProviderClick(provider)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <>
                  <motion.p
                    className="mb-4 text-lg text-custom-dark-blue dark:text-custom-yellow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                  >
                    {t("plantsFound")}: {filteredPlants.length} {t("plants")}
                  </motion.p>

                  <motion.div
                    className="flex items-center justify-between mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1, duration: 0.5 }}
                    >
                      <SortMenu onSortChange={handleSortChange} />
                    </motion.div>
                    <motion.div
                      className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-1 flex"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1, duration: 0.5 }}
                    >
                      <motion.button
                        onClick={() => setViewMode("list")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "list"
                            ? "bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue"
                            : "text-custom-dark-blue dark:text-custom-yellow hover:bg-white/10 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        <HiViewList className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => setViewMode("grid")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "grid"
                            ? "bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue"
                            : "text-custom-dark-blue dark:text-custom-yellow hover:bg-white/10 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        <HiViewGrid className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    {loading ? (
                      <div className="lg:pl-8">
                        <PlantsListSkeleton theme={theme} rows={itemsPerPage} />
                      </div>
                    ) : filteredPlants.length > 0 ? (
                      viewMode === "list" ? (
                        <div>
                          {paginatedPlants.map((plant, index) => (
                            <motion.div
                              key={plant.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 + index * 0.05 }}
                            >
                              <PlantsListTableItem plant={plant} />
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
                          {paginatedPlants.map((plant, index) => (
                            <motion.div
                              key={plant.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.2 + index * 0.05 }}
                            >
                              <PlantCard plant={plant} />
                            </motion.div>
                          ))}
                        </div>
                      )
                    ) : (
                      <motion.div
                        className="h-auto w-full flex flex-col justify-center items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                      >
                        <PiSolarPanelFill className="mt-24 text-center text-9xl text-custom-dark-blue dark:text-custom-light-gray" />
                        <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray">
                          {t("noPlantsFound")}
                        </p>
                      </motion.div>
                    )}

                    {totalPages > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                      >
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <BottomNavbar userId={user?.id} userClass={user?.clase} />
    </div>
  );
};

export default AdminDashboard;
