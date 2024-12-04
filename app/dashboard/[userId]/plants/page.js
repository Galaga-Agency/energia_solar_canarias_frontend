"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
import { FaMapMarkedAlt } from "react-icons/fa";
import { PiSolarPanelFill } from "react-icons/pi";
import AddPlantForm from "@/components/AddPlantForm";
import Image from "next/image";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Texture from "@/components/Texture";
import PlantStatuses from "@/components/PlantStatuses";
import FilterSidebar from "@/components/FilterSidebar";
import usePlantSort from "@/hooks/usePlantSort";
import useDeviceType from "@/hooks/useDeviceType";
import PlantListSkeleton from "@/components/loadingSkeletons/PlantListSkeleton";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "@heroicons/react/24/outline";

const ClientDashboardPage = ({ params }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector(selectLoading);
  const plants = useSelector(selectPlants);
  const theme = useSelector(selectTheme);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { sortedItems: sortedPlants, sortItems } = usePlantSort(filteredPlants);
  const { isMobile } = useDeviceType();
  const { t } = useTranslation();
  const sidebarRef = useRef(null);

  const plantsPerPage = 6;
  const totalPages = Math.ceil(sortedPlants.length / plantsPerPage);
  const startIndex = (currentPage - 1) * plantsPerPage;
  const paginatedPlants = sortedPlants.slice(
    startIndex,
    startIndex + plantsPerPage
  );

  // console.log("plant from list: ", paginatedPlants);

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

  return (
    <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto">
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

        <AddPlantForm
          onClose={() => setIsFormOpen(false)}
          isOpen={isFormOpen}
        />

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

            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t("search")}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow"
              />
            </div>

            {loading ? (
              <PlantListSkeleton theme={theme} rows={plantsPerPage} />
            ) : (
              <>
                {paginatedPlants.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-10 w-full">
                    {paginatedPlants.map((plant) => (
                      <PlantCard key={plant.id} plant={plant} />
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
          className="fixed bottom-20 right-4 md:right-10 w-12 h-12 bg-custom-yellow text-custom-dark-blue rounded-full flex items-center justify-center transition-colors duration-300 button-shadow"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      <BottomNavbar userId={user && user.id} userClass={user && user.classe} />
    </div>
  );
};

export default ClientDashboardPage;
