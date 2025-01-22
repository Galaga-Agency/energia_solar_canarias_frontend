import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { RotateCcw, X } from "lucide-react";
import { motion } from "framer-motion";
import { parseISO, isValid, isAfter, isBefore, startOfDay } from "date-fns";
import DateSelector from "@/components/DateSelector";
import { BsCalendar3 } from "react-icons/bs";

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
    hasAlerts: false,
    installationDate: { min: "", max: "" },
  };

  const [filters, setFilters] = useState(initialFilters);
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const sidebarRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMinDateSelectorOpen, setIsMinDateSelectorOpen] = useState(false);
  const [isMaxDateSelectorOpen, setIsMaxDateSelectorOpen] = useState(false);
  const minDateInputRef = useRef(null);
  const maxDateInputRef = useRef(null);

  const isDateValid = (dateString) => {
    if (!dateString) return false;
    const date = parseISO(dateString);
    return isValid(date);
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
        // Alert Filter
        if (currentFilters.hasAlerts && plant.alert_quantity === 0) {
          return false;
        }

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

        // Installation Date Filter
        const installationDate = parseISO(plant.installation_date);

        if (isDateValid(currentFilters.installationDate.min)) {
          const minDate = parseISO(currentFilters.installationDate.min);
          if (isBefore(installationDate, startOfDay(minDate))) {
            return false;
          }
        }

        if (isDateValid(currentFilters.installationDate.max)) {
          const maxDate = parseISO(currentFilters.installationDate.max);
          if (isAfter(installationDate, startOfDay(maxDate))) {
            return false;
          }
        }

        return true;
      });
    },
    [plants]
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

  const handleCheckboxChange = useCallback(
    (filterType, value) => {
      setFilters((prevFilters) => {
        let newFilters;
        if (filterType === "hasAlerts") {
          newFilters = {
            ...prevFilters,
            hasAlerts: value,
          };
        } else {
          const exists = prevFilters[filterType].includes(value);
          const newValues = exists
            ? prevFilters[filterType].filter((v) => v !== value)
            : [...prevFilters[filterType], value];

          newFilters = {
            ...prevFilters,
            [filterType]: newValues,
          };
        }

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
    setIsMinDateSelectorOpen(false);
    setIsMaxDateSelectorOpen(false);
  }, [filterPlants, onFilterChange]);

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
      className={`min-w-80 overflow-auto filter-sidebar-selector fixed z-50 top-0 left-0 h-screen xl:h-full transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } xl:static xl:block xl:translate-x-0 bg-white/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 backdrop-blur-sm backdrop-filter p-4 rounded-r-lg xl:rounded-lg shadow-lg max-w-xs w-full md:w-auto`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow">
          {t("filter")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="p-2 text-custom-dark-blue dark:text-custom-yellow hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
            title={t("reset_filters")}
          >
            {isDesktop && <span>{t("reset")}</span>}{" "}
            <RotateCcw className="w-5 h-5" />
          </button>
          {(isMobile || isTablet) && (
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeSidebar}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="h-6 w-6 text-custom-dark-blue dark:text-custom-yellow " />
            </motion.button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={t("filterPlaceholder")}
          className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:text-custom-yellow transition duration-300"
        />
      </div>

      {/* Alert Filter */}
      {/* <div className="mb-4">
        <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
          <CustomCheckbox
            label={t("show_only_plants_with_alerts")}
            checked={filters.hasAlerts}
            onChange={(checked) => handleCheckboxChange("hasAlerts", checked)}
          />
        </div>
      </div> */}

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
        <div className="flex gap-4">
          <div className="flex flex-col w-1/2">
            <label className="text-sm text-custom-dark-blue dark:text-custom-light-gray mb-1">
              {t("min")}
            </label>
            <input
              type="number"
              value={filters.peakPower.min}
              onChange={(e) => handlePeakPowerChange("min", e.target.value)}
              className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:text-custom-yellow transition duration-300"
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="text-sm text-custom-dark-blue dark:text-custom-light-gray mb-1">
              {t("max")}
            </label>
            <input
              type="number"
              value={filters.peakPower.max}
              onChange={(e) => handlePeakPowerChange("max", e.target.value)}
              className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue dark:text-custom-yellow transition duration-300"
            />
          </div>
        </div>
      </div>

      {/* Installation Date Pickers */}
      <div className="mb-6 relative">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("installationDate")}
        </h3>
        <div className="flex space-x-2">
          {/* From Date Picker */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-custom-dark-blue dark:text-custom-light-gray mb-1">
              {t("from")}
            </label>
            <div className="relative" ref={minDateInputRef}>
              <button
                onClick={() => {
                  setIsMaxDateSelectorOpen(false);
                  setIsMinDateSelectorOpen(!isMinDateSelectorOpen);
                }}
                className="w-full p-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue dark:text-white flex items-center justify-between focus:ring-2 focus:ring-custom-yellow"
                type="button"
              >
                <span className="text-custom-dark-blue dark:text-custom-light-gray">
                  {filters.installationDate.min
                    ? new Date(
                        filters.installationDate.min
                      ).toLocaleDateString()
                    : t("selectDate")}
                </span>
                <BsCalendar3 className="text-custom-dark-blue dark:text-custom-light-gray" />
              </button>
              {isMinDateSelectorOpen && (
                <DateSelector
                  isOpen={isMinDateSelectorOpen}
                  onClose={() => setIsMinDateSelectorOpen(false)}
                  onSelect={(date) => handleDateChange("min", date)}
                  value={filters.installationDate.min}
                  parentRef={minDateInputRef}
                />
              )}
            </div>
          </div>

          {/* To Date Picker */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("to")}
            </label>
            <div className="relative" ref={maxDateInputRef}>
              <button
                onClick={() => {
                  setIsMinDateSelectorOpen(false);
                  setIsMaxDateSelectorOpen(!isMaxDateSelectorOpen);
                }}
                className="w-full p-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue text-custom-dark-blue dark:text-custom-light-gray flex items-center justify-between focus:ring-2 focus:ring-custom-yellow"
                type="button"
              >
                <span className="text-custom-dark-blue dark:text-custom-light-gray">
                  {filters.installationDate.max
                    ? new Date(
                        filters.installationDate.max
                      ).toLocaleDateString()
                    : t("selectDate")}
                </span>
                <BsCalendar3 />
              </button>
              {isMaxDateSelectorOpen && (
                <DateSelector
                  isOpen={isMaxDateSelectorOpen}
                  onClose={() => setIsMaxDateSelectorOpen(false)}
                  onSelect={(date) => handleDateChange("max", date)}
                  value={filters.installationDate.max}
                  parentRef={maxDateInputRef}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarEdgeFilterSidebar;
