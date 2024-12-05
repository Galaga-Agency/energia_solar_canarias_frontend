import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { IoMdClose } from "react-icons/io";

const VictronFilterSidebar = ({
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
    installationDate: { min: "", max: "" },
  });
  const { isDesktop } = useDeviceType();
  const sidebarRef = useRef(null); // This will reference the sidebar
  const [isInitialized, setIsInitialized] = useState(false);

  // Translation keys for Victron plant types
  const VICTRON_TYPES = {
    solar: "type_Solar",
    generator: "type_Generator",
    battery: "type_Battery",
    grid: "type_Grid",
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
        if (currentFilters.search.trim()) {
          const searchTerm = currentFilters.search.toLowerCase().trim();
          const name = plant.name || "";
          const address = plant.address || "";
          if (
            !name.toLowerCase().includes(searchTerm) &&
            !address?.toLowerCase().includes(searchTerm)
          ) {
            return false;
          }
        }

        // Type Filter
        if (currentFilters.type.length > 0) {
          if (!currentFilters.type.includes(plant.type)) {
            return false;
          }
        }

        // Installation Date Filter
        if (
          currentFilters.installationDate.min &&
          new Date(plant.installation_date) <
            new Date(currentFilters.installationDate.min)
        ) {
          return false;
        }

        if (
          currentFilters.installationDate.max &&
          new Date(plant.installation_date) >
            new Date(currentFilters.installationDate.max)
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
        const newFilters = {
          ...prevFilters,
          [filterType]: prevFilters[filterType].includes(value)
            ? prevFilters[filterType].filter((item) => item !== value)
            : [...prevFilters[filterType], value],
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
        const updatedFilters = { ...prevFilters, search: searchTerm };
        onFilterChange(filterPlants(updatedFilters));
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  const handleDateChange = useCallback(
    (type, value) => {
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          installationDate: { ...prevFilters.installationDate, [type]: value },
        };
        onFilterChange(filterPlants(updatedFilters));
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, [setIsSidebarOpen]);

  // This is the key change: Listen for clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar(); // Close the sidebar if the click is outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSidebar]);

  return (
    <div
      ref={sidebarRef}
      className={`overflow-auto pb-16 fixed z-[9999] top-0 left-0 transform transition-all h-screen xl:h-auto duration-300 ease-in-out  ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } xl:static xl:block xl:translate-x-0 bg-white/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 backdrop-blur-sm backdrop-filter p-6 rounded-lg shadow-lg max-w-xs w-full md:min-w-[30vw] xl:min-w-[16vw]`}
    >
      <div className="flex justify-between mb-6">
        <h3 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-2">
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

      <div className="mb-6">
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={t("filterPlaceholder")}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("type")}
        </h3>
        <div className="flex flex-col gap-3 text-custom-dark-blue dark:text-custom-light-gray">
          {Object.keys(VICTRON_TYPES).map((type) => (
            <CustomCheckbox
              key={type}
              label={t(VICTRON_TYPES[type])}
              checked={filters.type.includes(type)}
              onChange={() => handleCheckboxChange("type", type)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("installationDate")}
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-2">
            <span className="text-custom-dark-blue dark:text-custom-light-gray">
              {t("from")}
            </span>
            <input
              type="date"
              value={filters.installationDate.min}
              onChange={(e) => handleDateChange("min", e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
              placeholder={t("installationDateMin")}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="text-custom-dark-blue dark:text-custom-light-gray">
              {t("to")}
            </span>
            <input
              type="date"
              value={filters.installationDate.max}
              onChange={(e) => handleDateChange("max", e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
              placeholder={t("installationDateMax")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictronFilterSidebar;
