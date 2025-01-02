import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { IoMdClose } from "react-icons/io";
import { RotateCcw } from "lucide-react";

const SolarEdgeFilterSidebar = ({
  plants,
  onFilterChange,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { t } = useTranslation();
  const initialFilters = {
    status: [],
    search: "",
    peakPower: { min: 0, max: 39.15 },
    highestAlert: { min: 0, max: 9 },
  };

  const [filters, setFilters] = useState(initialFilters);
  const { isMobile, isTablet } = useDeviceType();
  const sidebarRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (plants?.length > 0 && !isInitialized) {
      setIsInitialized(true);
      setTimeout(() => {
        onFilterChange(plants);
      }, 0);
    }
  }, [plants, isInitialized, onFilterChange]);

  const filterPlants = useCallback(
    (currentFilters) => {
      if (!plants) return [];

      return plants.filter((plant) => {
        // Search Filter
        if (currentFilters.search?.trim()) {
          const searchTerm = currentFilters.search.toLowerCase().trim();
          const name = (plant.name || "").toLowerCase();
          const address = (plant.address || "").toLowerCase();

          if (!name.includes(searchTerm) && !address.includes(searchTerm)) {
            return false;
          }
        }

        // Status Filter
        if (currentFilters.status?.length > 0) {
          if (!currentFilters.status.includes(plant.status)) {
            return false;
          }
        }

        // Peak Power Filter
        const power = plant.capacity || 0;
        if (
          power < currentFilters.peakPower.min ||
          power > currentFilters.peakPower.max
        ) {
          return false;
        }

        // Highest Alert Filter
        const alertLevel = plant.highest_impact || 0;
        if (
          alertLevel < currentFilters.highestAlert.min ||
          alertLevel > currentFilters.highestAlert.max
        ) {
          return false;
        }

        return true;
      });
    },
    [plants]
  );

  const handleCheckboxChange = useCallback(
    (filterType, value) => {
      setFilters((prevFilters) => {
        const exists = prevFilters[filterType].includes(value);
        const newValues = exists
          ? prevFilters[filterType].filter((v) => v !== value)
          : [...prevFilters[filterType], value];

        const newFilters = {
          ...prevFilters,
          [filterType]: newValues,
        };

        onFilterChange(filterPlants(newFilters));
        return newFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  const handleSearchChange = useCallback(
    (event) => {
      const searchTerm = event.target.value;
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          search: searchTerm,
        };
        onFilterChange(filterPlants(updatedFilters));
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  const handlePeakPowerChange = useCallback(
    (type, value) => {
      if (value === "" || isNaN(value)) {
        value = type === "min" ? 0 : 39.15;
      }

      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          peakPower: {
            ...prevFilters.peakPower,
            [type]: Number(value),
          },
        };
        onFilterChange(filterPlants(updatedFilters));
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
    onFilterChange(filterPlants(initialFilters));
  }, [filterPlants, onFilterChange, initialFilters]);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, [setIsSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSidebar]);

  return (
    <div
      ref={sidebarRef}
      className={`overflow-auto pb-16 fixed z-40 top-0 left-0 h-screen xl:h-full transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } xl:static xl:block xl:translate-x-0 bg-white/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 backdrop-blur-sm backdrop-filter p-4 rounded-lg shadow-lg max-w-xs w-full md:w-auto`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow">
          {t("filter_fleet")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="p-2 text-custom-dark-blue dark:text-custom-yellow hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
            title={t("reset_filters")}
          >
            <span>{t("reset")}</span> <RotateCcw className="w-5 h-5" />
          </button>
          {isMobile ||
            (isTablet && (
              <button
                onClick={closeSidebar}
                className="text-custom-dark-blue dark:text-custom-yellow text-xl"
              >
                <IoMdClose />
              </button>
            ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={t("search_plant")}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
        />
      </div>

      {/* Status */}
      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("activation_state")}
        </h3>
        <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
          {["working", "error", "waiting", "disconnected"].map((status) => (
            <CustomCheckbox
              key={status}
              label={t(`status.${status}`)}
              checked={filters.status.includes(status)}
              onChange={() => handleCheckboxChange("status", status)}
            />
          ))}
        </div>
      </div>

      {/* Peak Power */}
      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("peak_power")} (kWp)
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.peakPower.min}
            onChange={(e) => handlePeakPowerChange("min", e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
          />
          <span className="text-custom-dark-blue dark:text-custom-yellow">
            -
          </span>
          <input
            type="number"
            value={filters.peakPower.max}
            onChange={(e) => handlePeakPowerChange("max", e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default SolarEdgeFilterSidebar;
