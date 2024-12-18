import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { IoMdClose } from "react-icons/io";

const SolarEdgeFilterSidebar = ({
  plants,
  onFilterChange,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    search: "",
    capacity: { min: 0, max: 10000 },
  });
  const { isDesktop } = useDeviceType();
  const sidebarRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Translation keys for SolarEdge plant types
  const SOLAREDGE_TYPES = {
    RESIDENCIAL: "type_Residential",
    INDUSTRIAL: "type_Industrial",
  };

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
        if (currentFilters.search && currentFilters.search.trim()) {
          const searchTerm = currentFilters.search.toLowerCase().trim();
          const name = plant.name || "";
          const address = plant.address || "";

          if (
            !name.toLowerCase().includes(searchTerm) &&
            !address.toLowerCase().includes(searchTerm)
          ) {
            return false;
          }
        }

        // Status Filter
        if (currentFilters.status && currentFilters.status.length > 0) {
          const plantStatus = plant.status || "";
          if (!currentFilters.status.includes(plantStatus)) {
            return false;
          }
        }

        // Type Filter
        if (currentFilters.type && currentFilters.type.length > 0) {
          const plantType = (plant.type || "")
            .toLowerCase()
            .replace(/[&\s]/g, ""); // Normalize `type`
          const typeMatch = currentFilters.type.some(
            (filterType) =>
              filterType.toLowerCase().replace(/[&\s]/g, "") === plantType
          );
          if (!typeMatch) {
            return false;
          }
        }

        // Capacity Filter
        const peakPower = plant.capacity || 0;
        if (
          currentFilters.capacity.min &&
          peakPower < currentFilters.capacity.min
        ) {
          return false;
        }
        if (
          currentFilters.capacity.max &&
          peakPower > currentFilters.capacity.max
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
      console.log("Checkbox changed:", filterType, value);

      setFilters((prevFilters) => {
        // For type filters, normalize the comparison
        if (filterType === "type") {
          const normalizedValue = value.toLowerCase().replace(/\s+/g, "");
          const exists = prevFilters[filterType].some(
            (v) => v.toLowerCase().replace(/\s+/g, "") === normalizedValue
          );

          const newValues = exists
            ? prevFilters[filterType].filter(
                (v) => v.toLowerCase().replace(/\s+/g, "") !== normalizedValue
              )
            : [...prevFilters[filterType], value];

          const newFilters = {
            ...prevFilters,
            [filterType]: newValues,
          };

          const filteredResults = filterPlants(newFilters);
          onFilterChange(filteredResults);

          return newFilters;
        }

        // For other filters, keep the original logic
        const exists = prevFilters[filterType].includes(value);
        const newValues = exists
          ? prevFilters[filterType].filter((v) => v !== value)
          : [...prevFilters[filterType], value];

        const newFilters = {
          ...prevFilters,
          [filterType]: newValues,
        };

        const filteredResults = filterPlants(newFilters);
        onFilterChange(filteredResults);

        return newFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  // Fix the handleSearchChange as well
  const handleSearchChange = useCallback(
    (event) => {
      const searchTerm = event.target.value;
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          search: searchTerm,
        };

        // Apply filters immediately
        onFilterChange(filterPlants(updatedFilters));
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  // And fix handleCapacityChange
  const handleCapacityChange = useCallback(
    (type, value) => {
      if (value === "" || isNaN(value)) {
        value = type === "min" ? 0 : 10000;
      }

      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          capacity: {
            ...prevFilters.capacity,
            [type]: Number(value),
          },
        };

        // Apply filters immediately
        onFilterChange(filterPlants(updatedFilters));
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

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
      className={`overflow-auto pb-16 fixed z-50 top-0 left-0 h-screen xl:h-auto transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } xl:static xl:block xl:translate-x-0 bg-white/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 backdrop-blur-sm backdrop-filter p-4 rounded-lg shadow-lg max-w-xs w-full md:w-auto`}
    >
      <div className="flex justify-between mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("filter")}
        </h3>
        {!isDesktop && (
          <button
            onClick={closeSidebar}
            className="text-custom-dark-blue dark:text-custom-yellow text-xl"
          >
            <IoMdClose />
          </button>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={t("filterPlaceholder")}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("plantStatus")}
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

      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("type")}
        </h3>
        <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
          {Object.keys(SOLAREDGE_TYPES).map((type) => (
            <CustomCheckbox
              key={type}
              label={t(SOLAREDGE_TYPES[type])}
              checked={filters.type.includes(type)}
              onChange={() => handleCheckboxChange("type", type)}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("capacity")}
        </h3>
        <div className="flex gap-4">
          <input
            type="number"
            value={filters.capacity.min}
            onChange={(e) => handleCapacityChange("min", e.target.value)}
            className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
            placeholder={t("min")}
          />
          <input
            type="number"
            value={filters.capacity.max}
            onChange={(e) => handleCapacityChange("max", e.target.value)}
            className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
            placeholder={t("max")}
          />
        </div>
      </div>

      {/* <div className="xl:hidden flex justify-center mt-4">
        <button
          onClick={() => {
            onFilterChange(filterPlants(filters));
            closeSidebar();
          }}
          className="bg-custom-yellow text-custom-dark-blue py-2 px-6 rounded-lg"
        >
          {t("applyFilters")}
        </button>
      </div> */}
    </div>
  );
};

export default SolarEdgeFilterSidebar;
