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
import CustomCheckbox from "@/components/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { IoMdClose } from "react-icons/io";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

const FilterSidebar = forwardRef(
  ({ plants, onFilterChange, initialSearchTerm }, ref) => {
    const { t } = useTranslation();
    const { isDesktop } = useDeviceType();
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({
      status: [],
      type: [],
      organization: [],
      search: initialSearchTerm || "",
      capacity: { min: 0, max: 10000 },
    });

    const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

    const closeSidebar = useCallback(() => {
      setIsSidebarOpen(false);
    }, []);

    const filterPlants = useCallback(() => {
      let filtered = [...plants];

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(
          (plant) =>
            plant.name.toLowerCase().includes(searchTerm) ||
            plant.address.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.status.length > 0) {
        filtered = filtered.filter((plant) =>
          filters.status.includes(plant.status)
        );
      }

      if (filters.type.length > 0) {
        filtered = filtered.filter((plant) =>
          filters.type.includes(plant.type)
        );
      }

      if (filters.organization.length > 0) {
        filtered = filtered.filter((plant) =>
          filters.organization.some(
            (filterOrg) =>
              normalizeString(filterOrg) === normalizeString(plant.organization)
          )
        );
      }

      if (filters.capacity.min || filters.capacity.max) {
        filtered = filtered.filter(
          (plant) =>
            (filters.capacity.min
              ? plant.capacity >= filters.capacity.min
              : true) &&
            (filters.capacity.max
              ? plant.capacity <= filters.capacity.max
              : true)
        );
      }

      return filtered;
    }, [filters, plants]);

    useImperativeHandle(
      ref,
      () => ({
        updateSearch: (value) => {
          setFilters((prev) => ({
            ...prev,
            search: value,
          }));
        },
        clearFilters: () => {
          setFilters({
            status: [],
            type: [],
            organization: [],
            search: "",
            capacity: { min: 0, max: 10000 },
          });
        },
      }),
      []
    );

    useEffect(() => {
      if (initialSearchTerm !== filters.search) {
        setFilters((prev) => ({
          ...prev,
          search: initialSearchTerm,
        }));
      }
    }, [initialSearchTerm, filters.search]);

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

    const handleCheckboxChange = useCallback((filterType, value) => {
      const normalizedValue = normalizeString(value);
      setFilters((prev) => ({
        ...prev,
        [filterType]: prev[filterType].includes(normalizedValue)
          ? prev[filterType].filter((item) => item !== normalizedValue)
          : [...prev[filterType], normalizedValue],
      }));
    }, []);

    const handleSearchChange = useCallback((event) => {
      const searchTerm = event.target.value;
      setFilters((prev) => ({
        ...prev,
        search: searchTerm,
      }));
    }, []);

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

    const handleApplyFilters = useCallback(() => {
      onFilterChange(filterPlants());
      closeSidebar();
    }, [onFilterChange, filterPlants, closeSidebar]);

    const handleClearFilters = useCallback(() => {
      setFilters({
        status: [],
        type: [],
        organization: [],
        search: "",
        capacity: { min: 0, max: 10000 },
      });
      onFilterChange(plants);
      closeSidebar();
    }, [onFilterChange, plants, closeSidebar]);

    const toggleSidebar = useCallback(() => {
      setIsSidebarOpen((prev) => !prev);
    }, []);

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
              {[
                "Residential",
                "Commercial",
                "Ground Mounted",
                "Battery Storage",
                "Optimizers & Inverters",
              ].map((type) => (
                <CustomCheckbox
                  key={type}
                  label={t(`type_${type}`)}
                  checked={filters.type.includes(type)}
                  onChange={() => handleCheckboxChange("type", type)}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
              {t("organization")}
            </h3>
            <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
              {[
                "Goodwe",
                "SolarEdge",
                "Bluetti",
                "Sungrow",
                "Victron Energy",
                "Sigenergy",
                "SMA",
                "Solarweb",
              ].map((organization) => (
                <CustomCheckbox
                  key={organization}
                  label={organization}
                  checked={filters.organization.includes(
                    normalizeString(organization)
                  )}
                  onChange={() =>
                    handleCheckboxChange(
                      "organization",
                      normalizeString(organization)
                    )
                  }
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
