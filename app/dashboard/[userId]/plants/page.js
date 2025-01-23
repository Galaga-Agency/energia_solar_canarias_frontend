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
  selectLoading,
  selectPlants,
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
  const plants = useSelector(selectPlants);
  const theme = useSelector(selectTheme);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const { sortedItems: sortedPlants, sortItems } = usePlantSort(filteredPlants);
  const { isMobile } = useDeviceType();
  const { t } = useTranslation();
  const sidebarRef = useRef(null);

  const GRID_ITEMS_PER_PAGE = isMobile ? 6 : 9;
  const LIST_ITEMS_PER_PAGE = isMobile ? 4 : 7;

  const itemsPerPage =
    viewMode === "grid" ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE;

  const totalPages = Math.ceil(sortedPlants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlants = sortedPlants.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = useCallback((filteredResults) => {
    setFilteredPlants(filteredResults);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    sidebarRef.current?.updateSearch(value);
  }, []);

  const fetchUserPlants = useCallback(() => {
    if (user?.id) {
      dispatch(
        fetchPlants({ userId: user.id, token: user.tokenIdentificador })
      );
      dispatch(clearPlantDetails());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!user?.id) {
      router.push("/");
    } else {
      setIsInitialLoad(false);
      fetchUserPlants();
    }
  }, [user, router, fetchUserPlants]);

  useEffect(() => {
    dispatch(clearPlantDetails());
    setFilteredPlants(plants);
  }, [plants, dispatch]);

  // Reset page when view mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  // console.log("filtered plants", filteredPlants);

  return (
    <div className="pb-12 min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar">
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
            {t("plants")}
          </h2>
        </div>

        <PlantsMapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          plants={sortedPlants}
        />

        <div className="flex gap-4">
          <FilterSidebar
            ref={sidebarRef}
            plants={plants}
            onFilterChange={handleFilterChange}
            initialSearchTerm={searchTerm}
          />

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between z-30 mb-4">
              <div className="flex gap-4 justify-start mb-6 md:mb-0 z-30">
                <div className="flex-grow">
                  <SortMenu onSortChange={sortItems} />
                </div>
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

            {loading ? (
              <PlantsListSkeleton theme={theme} rows={itemsPerPage} />
            ) : (
              <>
                {paginatedPlants.length > 0 ? (
                  viewMode === "list" ? (
                    <div>
                      {paginatedPlants.map((plant, index) => (
                        <motion.div
                          key={plant.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.05 }}
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
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-10 w-full">
                      {paginatedPlants.map((plant, index) => (
                        <motion.div
                          key={plant.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.05 }}
                        >
                          <PlantCard key={plant.id} plant={plant} />
                        </motion.div>
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
      </div>

      <BottomNavbar userId={user && user.id} userClass={user && user.classe} />
    </div>
  );
};

export default ClientDashboardPage;
