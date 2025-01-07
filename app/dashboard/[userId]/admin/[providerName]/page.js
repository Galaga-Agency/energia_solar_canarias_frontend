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
  selectAlerts,
  selectLoading,
  selectPlants,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import ThemeToggle from "@/components/ThemeToggle";
import SortMenu from "@/components/SortPlantsMenu";
import SolarEdgeSortMenu from "@/components/solaredge/SolarEdgeSortMenu";
import GoodweSortMenu from "@/components/goodwe/GoodweSortMenu";
import Pagination from "@/components/ui/Pagination";
import { FaMapMarkedAlt } from "react-icons/fa";
import { PiSolarPanelFill } from "react-icons/pi";
import Texture from "@/components/Texture";
import PlantStatuses from "@/components/PlantStatuses";
import PlantsListSkeleton from "@/components/loadingSkeletons/PlantsListSkeleton.js";
import { useTranslation } from "next-i18next";
import InfoModal from "@/components/InfoModal";
import PlantsListTableItem from "@/components/PlantsListTableItem";
import { providers } from "@/data/providers";
import PlantsMapModal from "@/components/PlantsMapModal";
import { IoArrowBackCircle } from "react-icons/io5";
import SolarEdgeFilterSidebar from "@/components/solaredge/SolarEdgeFilterSidebar";
import GoodweFilterSidebar from "@/components/goodwe/GoodweFilterSidebar";
import VictronFilterSidebar from "@/components/victronenergy/VictronFilterSidebar";
import VictronSortMenu from "@/components/victronenergy/VictronSortMenu";
import GoodweStatsOverview from "@/components/goodwe/GoodweStatsOverview";
import SolarEdgeStatsOverview from "@/components/solaredge/SolarEdgeStatsOverview";
import BatteryStatuses from "@/components/BatteryStatuses";
import VictronStatsOverview from "@/components/victronenergy/VictronStatsOverview";
import { useOptimalItemsCount } from "@/hooks/useOptimalItemsCount";

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
  const plantsPerPage = useOptimalItemsCount();
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
    console.log("Before sorting:", {
      criteria,
      order,
      plantsCount: filteredPlants.length,
    });

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

        case "goodwe": {
          switch (criteria) {
            case "alphabetical":
              valueA = (a.name || "").toLowerCase();
              valueB = (b.name || "").toLowerCase();
              break;
            case "installationDate":
              valueA = new Date(a.installation_date || 0);
              valueB = new Date(b.installation_date || 0);
              return order === "asc" ? valueA - valueB : valueB - valueA;
            case "powerOutput":
              valueA = parseFloat(a.power_output || 0);
              valueB = parseFloat(b.power_output || 0);
              break;
            case "capacity":
              valueA = parseFloat(a.capacity || 0);
              valueB = parseFloat(b.capacity || 0);
              break;
            case "status":
              valueA = (a.status || "").toLowerCase();
              valueB = (b.status || "").toLowerCase();
              break;
            default:
              valueA = a[criteria];
              valueB = b[criteria];
          }

          // Handle string comparison for name and status
          if (typeof valueA === "string") {
            return order === "asc"
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          }

          // Handle numeric comparison for other fields
          return order === "asc"
            ? (valueA ?? 0) - (valueB ?? 0)
            : (valueB ?? 0) - (valueA ?? 0);
        }

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

    console.log("After sorting:", { plantsCount: sorted.length });

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
            alerts={alerts?.goodwe?.data?.list || []}
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

  // console.log("plants: ", plants);

  const alerts = useSelector(selectAlerts);
  let alertsCount = 0;

  switch (providerPassed) {
    case "goodwe":
      alertsCount =
        alerts?.goodwe?.data?.list?.filter((alert) => alert.status === 0)
          ?.length || 0;
      console.log("alertsCount: ", alertsCount);
      break;
    case "victronenergy":
      alertsCount = alerts?.victronenergy || 0;
      break;
    case "solaredge":
      alertsCount = alerts?.solaredge || 0;
      break;
    default:
      alertsCount = 0;
  }

  return (
    <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar pb-16">
      <TransitionEffect />
      <div className="fixed top-4 right-4 flex flex-col md:flex-row items-center gap-2 z-[999]">
        <ThemeToggle />
        <LanguageSelector />
      </div>

      <Texture />
      <div className="relative h-auto z-10 p-6 md:p-8">
        <div className="flex items-center mb-10 md:mb-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/dashboard/${user.id}/admin`;
            }}
          >
            <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow mb-1 mr-4" />
          </button>
          <h2 className="z-10 text-4xl dark:text-custom-yellow text-custom-dark-blue max-w-[60vw]">
            {provider?.name}
          </h2>
        </div>

        <div className="flex-grow lg:px-8">
          {(() => {
            switch (providerPassed) {
              case "goodwe":
                return (
                  <GoodweStatsOverview
                    plants={filteredPlants}
                    t={t}
                    alerts={alerts}
                  />
                );
              case "solaredge":
                return <SolarEdgeStatsOverview plants={filteredPlants} t={t} />;
              case "victronenergy":
                return <VictronStatsOverview plants={filteredPlants} t={t} />;
              default:
                return null;
            }
          })()}
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
              {providerPassed === "victronenergy" ? (
                <BatteryStatuses />
              ) : (
                <PlantStatuses />
              )}
            </div>

            {loading || isModalOpen ? (
              <div className="py-8">
                <PlantsListSkeleton theme={theme} rows={plantsPerPage} />
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
