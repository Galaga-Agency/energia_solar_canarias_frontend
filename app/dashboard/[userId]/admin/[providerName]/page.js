"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import LanguageSelector from "@/components/LanguageSelector";
import { selectUser } from "@/store/slices/userSlice";
import {
  clearPlantDetails,
  fetchPlantsByProvider,
  selectLoading,
  selectPlants,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import ThemeToggle from "@/components/ThemeToggle";
import SortMenu from "@/components/SortPlantsMenu";
import SolarEdgeSortMenu from "@/components/Solaredge/SolarEdgeSortMenu";
import GoodweSortMenu from "@/components/Goodwe/GoodweSortMenu";
import Pagination from "@/components/ui/Pagination";
import { FaMapMarkedAlt } from "react-icons/fa";
import { PiSolarPanelFill } from "react-icons/pi";
import Texture from "@/components/Texture";
import PlantStatuses from "@/components/PlantStatuses";
import PlantListSkeleton from "@/components/LoadingSkeletons/PlantListSkeleton";
import { useTranslation } from "next-i18next";
import InfoModal from "@/components/InfoModal";
import PlantsListTableItem from "@/components/PlantsListTableItem";
import { providers } from "@/data/providers";
import PlantsMapModal from "@/components/PlantsMapModal";
import { IoArrowBackCircle } from "react-icons/io5";
import SolarEdgeFilterSidebar from "@/components/Solaredge/SolarEdgeFilterSidebar";
import GoodweFilterSidebar from "@/components/Goodwe/GoodweFilterSidebar";
import VictronFilterSidebar from "@/components/Victronenergy/VictronFilterSidebar";
import VictronSortMenu from "@/components/Victronenergy/VictronSortMenu";

const ProviderPage = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const plants = useSelector(selectPlants);
  const theme = useSelector(selectTheme);
  const { t } = useTranslation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allPlants, setAllPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const plantsPerPage = 10;
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);
  const startIndex = (currentPage - 1) * plantsPerPage;
  const paginatedPlants = filteredPlants.slice(
    startIndex,
    startIndex + plantsPerPage
  );

  const router = useRouter();
  const params = useParams();
  const providerPassed = params?.providerName.toLowerCase();
  const provider = providers.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "") === providerPassed
  );

  useEffect(() => {
    if (isInitialLoad) {
      dispatch(
        fetchPlantsByProvider({
          userId: user.id,
          token: user.tokenIdentificador,
          provider: providerPassed,
        })
      );
      dispatch(clearPlantDetails());
      setIsInitialLoad(false);
    }
  }, [user, providerPassed, provider, isInitialLoad, dispatch]);

  useEffect(() => {
    if (!loading && plants.length > 0 && provider) {
      const providerPlants = plants.filter((plant) => {
        return plant.organization.toLowerCase() === providerPassed;
      });

      setAllPlants(providerPlants);
      setFilteredPlants(providerPlants);
      setIsInitialLoad(false);
    }
  }, [plants, loading, provider, providerPassed]);

  const handleFilterChange = useCallback((newFilteredPlants) => {
    console.log("New filtered plants:", newFilteredPlants);
    setFilteredPlants([...newFilteredPlants]);
    setCurrentPage(1);
  }, []);

  const handleSortChange = (criteria, order) => {
    const sorted = [...filteredPlants].sort((a, b) => {
      let valueA, valueB;

      switch (providerPassed) {
        case "solaredge": {
          // Remove 'details.' prefix since properties are at root level
          const property = criteria.replace("details.", "");

          // Handle nested location properties
          if (property.startsWith("location.")) {
            const locationProp = property.split(".")[1];
            valueA = a.location?.[locationProp];
            valueB = b.location?.[locationProp];
          } else {
            // For non-location properties
            valueA = a[property];
            valueB = b[property];
          }

          // Handle different data types for SolarEdge
          if (property === "installation_date") {
            return order === "asc"
              ? new Date(valueA) - new Date(valueB)
              : new Date(valueB) - new Date(valueA);
          }
          break;
        }

        case "goodwe":
          valueA = a[criteria];
          valueB = b[criteria];
          break;

        default:
          valueA = a[criteria];
          valueB = b[criteria];
      }

      // Common comparison logic for all providers
      if (typeof valueA === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return order === "asc"
        ? (valueA ?? 0) - (valueB ?? 0)
        : (valueB ?? 0) - (valueA ?? 0);
    });

    setFilteredPlants(sorted);
  };

  const renderSortMenu = () => {
    switch (providerPassed) {
      case "solaredge":
        return <SolarEdgeSortMenu onSortChange={handleSortChange} />;
      case "goodwe":
        return <GoodweSortMenu onSortChange={handleSortChange} />;
      case "victronenergy":
        return <VictronSortMenu onSortChange={handleSortChange} />;
      default:
        return <SortMenu onSortChange={handleSortChange} />;
    }
  };

  const renderFilterSidebar = () => {
    switch (providerPassed) {
      case "solaredge":
        return (
          <SolarEdgeFilterSidebar
            plants={allPlants}
            onFilterChange={handleFilterChange}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        );
      case "goodwe":
        return (
          <GoodweFilterSidebar
            plants={allPlants}
            onFilterChange={handleFilterChange}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        );
      case "victronenergy":
        return (
          <VictronFilterSidebar
            plants={allPlants}
            onFilterChange={handleFilterChange}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        );
      default:
        return null;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  console.log("plants: ", plants);

  return (
    <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto pb-16">
      <TransitionEffect />
      <div className="fixed top-4 right-4 flex flex-col md:flex-row items-center gap-2 z-[999]">
        <ThemeToggle />
        <LanguageSelector />
      </div>

      <Texture />
      <div className="relative h-auto z-10 p-6 md:p-8">
        <div className="flex items-center mb-10 md:mb-2 z-10">
          <button onClick={() => window.history.back()}>
            <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow mb-1 mr-4" />
          </button>
          <h2 className="z-10 text-4xl dark:text-custom-yellow text-custom-dark-blue max-w-[60vw]">
            {provider?.name}
          </h2>
        </div>

        <PlantsMapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          plants={plants}
        />

        <div className="flex mt-6">
          {/* Button to open sidebar */}
          <button
            className="xl:hidden fixed bottom-20 left-5 z-40 bg-custom-yellow p-3 rounded-full justify-center transition-colors duration-300 button-shadow flex items-center"
            onClick={toggleSidebar}
          >
            <span className="text-custom-dark-blue">{t("filter")}</span>
          </button>

          {/* Sidebar */}
          {renderFilterSidebar()}

          <div className="flex-grow lg:px-8">
            <div className="mb-4 text-lg text-custom-dark-blue dark:text-custom-yellow">
              <p>
                {t("plantsFound")}: {filteredPlants.length} {t("plants")}
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between z-30">
              <div className="flex gap-4 justify-start mb-6 md:mb-0 z-30">
                <div className="flex-grow">{renderSortMenu()}</div>
                <button
                  onClick={() => setIsMapOpen(true)}
                  className="z-30 bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded-lg flex items-center justify-center button-shadow"
                >
                  <FaMapMarkedAlt className="text-2xl" />
                </button>
              </div>
              {providerPassed !== "victronenergy" && <PlantStatuses />}
            </div>

            {loading || isModalOpen ? (
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
