"use client";

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";

const STATUS_OPTIONS = [
  "working",
  "error",
  "waiting",
  "disconnected",
  "Cargando",
  "Descargando",
  "En reposo",
];
// const TYPE_OPTIONS = [
//   "Residential",
//   "Commercial",
//   "Ground Mounted",
//   "Battery Storage",
//   "Optimizers & Inverters",
// ];
const ORGANIZATION_OPTIONS = [
  "Goodwe",
  "SolarEdge",
  "Bluetti",
  "Sungrow",
  "Victron Energy",
  "Sigenergy",
  "SMA",
  "Solarweb",
];

const INITIAL_FILTER_STATE = {
  status: [],
  // type: [],
  organization: [],
  search: "",
  capacity: { min: 0, max: 10000 },
};

const FilterSidebar = forwardRef(
  ({ plants, onFilterChange, initialSearchTerm }, ref) => {
    const { t } = useTranslation();
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({
      ...INITIAL_FILTER_STATE,
      search: initialSearchTerm || "",
    });
    const { isMobile, isTablet, isDesktop } = useDeviceType();

    const normalizeString = (str) => {
      if (!str) return "";
      return str.toLowerCase().replace(/\s+/g, "");
    };

    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
    const toggleSidebar = useCallback(
      () => setIsSidebarOpen((prev) => !prev),
      []
    );

    const handleCheckboxChange = useCallback(
      (filterType, value) => {
        const normalizedValue = normalizeString(value);
        setFilters((prev) => {
          const updatedFilters = {
            ...prev,
            [filterType]: prev[filterType].includes(normalizedValue)
              ? prev[filterType].filter((item) => item !== normalizedValue)
              : [...prev[filterType], normalizedValue],
          };
          onFilterChange(filterPlants(updatedFilters));
          return updatedFilters;
        });
      },
      [onFilterChange]
    );

    const handleSearchChange = useCallback(
      (event) => {
        const newSearchValue = event.target.value;
        setFilters((prev) => {
          const updatedFilters = {
            ...prev,
            search: newSearchValue,
          };
          onFilterChange(filterPlants(updatedFilters));
          return updatedFilters;
        });
      },
      [onFilterChange]
    );

    const handleCapacityChange = useCallback(
      (type, value) => {
        if (!value || isNaN(value)) return;
        setFilters((prev) => {
          const updatedFilters = {
            ...prev,
            capacity: {
              ...prev.capacity,
              [type]: Number(value),
            },
          };
          onFilterChange(filterPlants(updatedFilters));
          return updatedFilters;
        });
      },
      [onFilterChange]
    );

    const filterPlants = useCallback(
      (currentFilters) => {
        return plants.filter((plant) => {
          const matchesSearch =
            !currentFilters.search ||
            (plant.name &&
              plant.name
                .toLowerCase()
                .includes(currentFilters.search.toLowerCase())) ||
            (plant.address &&
              plant.address
                .toLowerCase()
                .includes(currentFilters.search.toLowerCase()));

          const matchesStatus =
            currentFilters.status.length === 0 ||
            (plant.status &&
              currentFilters.status.includes(normalizeString(plant.status)));

          // const matchesType =
          //   currentFilters.type.length === 0 ||
          //   (plant.type && currentFilters.type.includes(normalizeString(plant.type)));

          const matchesOrganization =
            currentFilters.organization.length === 0 ||
            (plant.organization &&
              currentFilters.organization.includes(
                normalizeString(plant.organization)
              ));

          const matchesCapacity =
            (!currentFilters.capacity.min ||
              (plant.capacity != null &&
                plant.capacity >= currentFilters.capacity.min)) &&
            (!currentFilters.capacity.max ||
              (plant.capacity != null &&
                plant.capacity <= currentFilters.capacity.max));

          return (
            matchesSearch &&
            matchesStatus &&
            // matchesType &&
            matchesOrganization &&
            matchesCapacity
          );
        });
      },
      [plants]
    );

    useImperativeHandle(
      ref,
      () => ({
        updateSearch: (value) => {
          setFilters((prev) => ({ ...prev, search: value }));
        },
        clearFilters: () => {
          setFilters(INITIAL_FILTER_STATE);
        },
      }),
      []
    );

    useEffect(() => {
      if (initialSearchTerm !== filters.search) {
        setFilters((prev) => ({ ...prev, search: initialSearchTerm }));
        // Apply initial search filter
        if (initialSearchTerm) {
          const searchTerm = initialSearchTerm.toLowerCase();
          onFilterChange(
            plants.filter(
              (plant) =>
                (plant.name && plant.name.toLowerCase().includes(searchTerm)) ||
                (plant.address &&
                  plant.address.toLowerCase().includes(searchTerm))
            )
          );
        }
      }
    }, [initialSearchTerm, filters.search, plants, onFilterChange]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          closeSidebar();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [closeSidebar]);

    const handleResetFilters = useCallback(() => {
      setFilters(INITIAL_FILTER_STATE);
      onFilterChange(plants);
    }, [plants, onFilterChange]);

    const renderFilterSection = (title, options, filterType) => (
      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t(title)}
        </h3>
        <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
          {options.map((option) => (
            <CustomCheckbox
              key={option}
              label={filterType === "status" ? t(`status.${option}`) : option}
              checked={filters[filterType].includes(normalizeString(option))}
              onChange={() => handleCheckboxChange(filterType, option)}
            />
          ))}
        </div>
      </div>
    );

    return (
      <div>
        <div
          ref={sidebarRef}
          className={`fixed z-50 top-0 left-0 h-screen xl:h-auto transform transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } xl:static xl:block xl:translate-x-0 bg-white/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 backdrop-blur-sm backdrop-filter p-4 rounded-lg shadow-lg max-w-xs w-full md:w-auto`}
        >
          <div className="flex justify-between mb-4">
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

          <div className="mb-4">
            <input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder={t("filterPlaceholder")}
              className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:text-custom-yellow transition duration-300"
            />
          </div>

          {renderFilterSection("plantStatus", STATUS_OPTIONS, "status")}
          {/* {renderFilterSection("type", TYPE_OPTIONS, "type")} */}
          {renderFilterSection(
            "organization",
            ORGANIZATION_OPTIONS,
            "organization"
          )}

          <div className="mb-4">
            <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
              {t("capacity")}
            </h3>
            <div className="flex gap-4">
              <div className="flex flex-col flex-1 min-w-0">
                <label className="text-sm text-custom-dark-blue dark:text-custom-light-gray mb-1">
                  {t("min")}
                </label>
                <input
                  type="number"
                  value={filters.capacity.min}
                  onChange={(e) => handleCapacityChange("min", e.target.value)}
                  className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:text-custom-yellow transition duration-300"
                  placeholder={t("min")}
                />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <label className="text-sm text-custom-dark-blue dark:text-custom-light-gray mb-1">
                  {t("max")}
                </label>
                <input
                  type="number"
                  value={filters.capacity.max}
                  onChange={(e) => handleCapacityChange("max", e.target.value)}
                  className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:text-custom-yellow transition duration-300"
                  placeholder={t("max")}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          className="xl:hidden fixed bottom-20 left-5 z-40 bg-custom-yellow p-3 rounded-full justify-center transition-colors duration-300 button-shadow flex items-center"
          onClick={toggleSidebar}
        >
          <span className="text-custom-dark-blue">{t("filter")}</span>
        </button>
      </div>
    );
  }
);

FilterSidebar.displayName = "FilterSidebar";

export default FilterSidebar;
