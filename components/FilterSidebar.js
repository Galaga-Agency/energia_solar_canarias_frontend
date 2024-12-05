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
import { IoMdClose } from "react-icons/io";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

const STATUS_OPTIONS = ["working", "error", "waiting", "disconnected"];
const TYPE_OPTIONS = [
  "Residential",
  "Commercial",
  "Ground Mounted",
  "Battery Storage",
  "Optimizers & Inverters",
];
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
  type: [],
  organization: [],
  search: "",
  capacity: { min: 0, max: 10000 },
};

const FilterSidebar = forwardRef(
  ({ plants, onFilterChange, initialSearchTerm }, ref) => {
    const { t } = useTranslation();
    const { isDesktop } = useDeviceType();
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({
      ...INITIAL_FILTER_STATE,
      search: initialSearchTerm || "",
    });

    const normalizeString = (str) => {
      if (!str) return "";
      return str.toLowerCase().replace(/\s+/g, "");
    };

    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
    const toggleSidebar = useCallback(
      () => setIsSidebarOpen((prev) => !prev),
      []
    );

    const handleCheckboxChange = useCallback((filterType, value) => {
      const normalizedValue = normalizeString(value);
      setFilters((prev) => ({
        ...prev,
        [filterType]: prev[filterType].includes(normalizedValue)
          ? prev[filterType].filter((item) => item !== normalizedValue)
          : [...prev[filterType], normalizedValue],
      }));
    }, []);

    const handleSearchChange = useCallback(
      (event) => {
        const newSearchValue = event.target.value;
        setFilters((prev) => ({
          ...prev,
          search: newSearchValue,
        }));
        // Apply filters immediately when search changes
        onFilterChange(
          plants.filter((plant) => {
            if (!newSearchValue) return true;

            const searchTerm = newSearchValue.toLowerCase();
            return (
              (plant.name && plant.name.toLowerCase().includes(searchTerm)) ||
              (plant.address &&
                plant.address.toLowerCase().includes(searchTerm))
            );
          })
        );
      },
      [plants, onFilterChange]
    );

    const handleCapacityChange = useCallback((type, value) => {
      if (!value || isNaN(value)) return;
      setFilters((prev) => ({
        ...prev,
        capacity: {
          ...prev.capacity,
          [type]: Number(value),
        },
      }));
    }, []);

    const filterPlants = useCallback(() => {
      return plants.filter((plant) => {
        const matchesSearch =
          !filters.search ||
          (plant.name &&
            plant.name.toLowerCase().includes(filters.search.toLowerCase())) ||
          (plant.address &&
            plant.address.toLowerCase().includes(filters.search.toLowerCase()));

        const matchesStatus =
          filters.status.length === 0 ||
          (plant.status &&
            filters.status.includes(normalizeString(plant.status)));

        const matchesType =
          filters.type.length === 0 ||
          (plant.type && filters.type.includes(normalizeString(plant.type)));

        const matchesOrganization =
          filters.organization.length === 0 ||
          (plant.organization &&
            filters.organization.includes(normalizeString(plant.organization)));

        const matchesCapacity =
          (!filters.capacity.min ||
            (plant.capacity != null &&
              plant.capacity >= filters.capacity.min)) &&
          (!filters.capacity.max ||
            (plant.capacity != null && plant.capacity <= filters.capacity.max));

        return (
          matchesSearch &&
          matchesStatus &&
          matchesType &&
          matchesOrganization &&
          matchesCapacity
        );
      });
    }, [filters, plants]);

    const handleApplyFilters = useCallback(() => {
      onFilterChange(filterPlants());
      closeSidebar();
    }, [onFilterChange, filterPlants, closeSidebar]);

    const handleClearFilters = useCallback(() => {
      setFilters(INITIAL_FILTER_STATE);
      onFilterChange(plants);
      closeSidebar();
    }, [onFilterChange, plants, closeSidebar]);

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

    const renderFilterSection = (title, options, filterType) => (
      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t(title)}
        </h3>
        <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
          {options.map((option) => (
            <CustomCheckbox
              key={option}
              label={
                filterType === "status"
                  ? t(`status.${option}`)
                  : filterType === "type"
                  ? t(`type_${option}`)
                  : option
              }
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

          {renderFilterSection("plantStatus", STATUS_OPTIONS, "status")}
          {renderFilterSection("type", TYPE_OPTIONS, "type")}
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

          <div className="flex justify-between mt-4 gap-4">
            <PrimaryButton onClick={handleApplyFilters}>
              {t("applyFilters")}
            </PrimaryButton>
            <SecondaryButton onClick={handleClearFilters}>
              {t("clearFilters")}
            </SecondaryButton>
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
