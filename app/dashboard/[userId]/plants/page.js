"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import LanguageSelector from "@/components/LanguageSelector";
import { selectUser } from "@/store/slices/userSlice";
import {
  clearPlantDetails,
  fetchPlants,
  fetchUserAssociatedPlants,
  selectAssociatedPlants,
  selectIsDataFetched,
  selectLoading,
  selectPlants,
  selectLoadingAssociatedPlants,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import ThemeToggle from "@/components/ThemeToggle";
import SortMenu from "@/components/SortPlantsMenu";
import Pagination from "@/components/ui/Pagination";
import PlantCard from "@/components/PlantCard";
import PlantsMapModal from "@/components/PlantsMapModal";
import { PiSolarPanelFill } from "react-icons/pi";
import Image from "next/image";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Texture from "@/components/Texture";
import FilterSidebar from "@/components/FilterSidebar";
import usePlantSort from "@/hooks/usePlantSort";
import useDeviceType from "@/hooks/useDeviceType";
import PlantsListSkeleton from "@/components/loadingSkeletons/PlantsListSkeleton";
import { useTranslation } from "react-i18next";
import { HiViewGrid, HiViewList } from "react-icons/hi";
import PlantsListTableItem from "@/components/PlantsListTableItem";
import { motion } from "framer-motion";

const ClientDashboardPage = ({ params }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector(selectLoading);
  const plants = useSelector(selectAssociatedPlants);
  const theme = useSelector(selectTheme);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const isDataFetched = useSelector(selectIsDataFetched);
  const { sortedItems: sortedPlants, sortItems } = usePlantSort(filteredPlants);
  const { isMobile } = useDeviceType();
  const { t } = useTranslation();
  const sidebarRef = useRef(null);
  const loadingAssociatedPlants = useSelector(selectLoadingAssociatedPlants);

  const ITEMS_PER_PAGE = 6;
  const PAGINATION_THRESHOLD = 6;

  const totalPages = Math.ceil(sortedPlants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPlants = sortedPlants.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleFilterChange = useCallback((filteredResults) => {
    setFilteredPlants(filteredResults);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    sidebarRef.current?.updateSearch(value);
  }, []);

  const fetchPlantsIfNeeded = useCallback(() => {
    if (user?.id && !plants.length) {
      dispatch(
        fetchUserAssociatedPlants({
          userId: user.id,
          token: user.tokenIdentificador,
        })
      );
      dispatch(clearPlantDetails());
    }
  }, [dispatch, user, plants.length]);

  useEffect(() => {
    if (!user?.id) {
      router.push("/");
    } else {
      setIsInitialLoad(false);
      fetchPlantsIfNeeded();
    }
  }, [user, router, fetchPlantsIfNeeded]);

  useEffect(() => {
    dispatch(clearPlantDetails());
    setFilteredPlants(plants);
  }, [plants, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  return (
    <div className="pb-16 min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-x-hidden">
      <TransitionEffect />

      <motion.div
        className="absolute top-4 right-4 flex items-center gap-2 z-10 lg:z-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <ThemeToggle />
        <LanguageSelector />
      </motion.div>

      <Texture />

      <div className="relative h-auto p-4 md:p-8">
        <motion.div
          className="flex items-center my-6 xl:mt-0 px-2 z-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Image
            src={companyIcon}
            alt="Company Icon"
            className="w-10 h-10 md:w-12 md:h-12 mr-2 transition-transform duration-300 hover:scale-110"
          />
          <h2 className="z-10 text-3xl md:text-4xl dark:text-custom-yellow text-custom-dark-blue">
            {t("plants")}
          </h2>
        </motion.div>

        <PlantsMapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          plants={sortedPlants}
        />

        <div className="flex flex-col md:flex-row xl:gap-6">
          <FilterSidebar
            ref={sidebarRef}
            plants={plants}
            onFilterChange={handleFilterChange}
            initialSearchTerm={searchTerm}
          />

          <div className="flex-1 w-full max-w-[90vw] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 z-30">
              <div className="flex justify-between items-center w-full">
                <div className="flex-grow md:flex-grow-0">
                  <SortMenu onSortChange={sortItems} />
                </div>

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
              </div>
            </div>

            {loading || loadingAssociatedPlants ? (
              <PlantsListSkeleton theme={theme} rows={ITEMS_PER_PAGE} />
            ) : (
              <div className="w-full">
                {paginatedPlants.length > 0 ? (
                  viewMode === "list" ? (
                    <div className="space-y-4 w-full overflow-x-auto overflow-y-hidden">
                      {paginatedPlants.map((plant, index) => (
                        <motion.div
                          key={plant.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.05 }}
                          className="w-full"
                        >
                          <PlantsListTableItem
                            plant={{
                              ...plant,
                              id: plant.id?.toString(),
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
                      {paginatedPlants.map((plant, index) => (
                        <motion.div
                          key={plant.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.05 }}
                          className="w-full"
                        >
                          <PlantCard plant={plant} />
                        </motion.div>
                      ))}
                    </div>
                  )
                ) : (
                  <motion.div
                    className="h-[50vh] w-full flex flex-col justify-center items-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <PiSolarPanelFill className="text-7xl md:text-9xl text-custom-dark-blue dark:text-custom-light-gray" />
                    <p className="text-center text-base md:text-lg text-custom-dark-blue dark:text-custom-light-gray mt-4">
                      {t("noPlantsFound")}
                    </p>
                  </motion.div>
                )}

                {sortedPlants.length > PAGINATION_THRESHOLD && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavbar userId={user?.id} userClass={user?.classe} />
    </div>
  );
};

export default ClientDashboardPage;
