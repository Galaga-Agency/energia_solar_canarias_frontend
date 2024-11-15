"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { IoMdClose } from "react-icons/io";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

const FilterSidebar = ({ plants, onFilterChange }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    organization: [],
    search: "",
    capacity: { min: 0, max: 10000 },
  });
  const { isDesktop } = useDeviceType();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleCheckboxChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilter = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value];
      const updatedFilters = { ...prevFilters, [filterType]: updatedFilter };
      return updatedFilters;
    });
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: searchTerm,
    }));
  };

  const handleCapacityChange = (type, value) => {
    if (!value || isNaN(value)) return;
    setFilters((prevFilters) => {
      const updatedCapacity = {
        ...prevFilters.capacity,
        [type]: Number(value),
      };
      const updatedFilters = { ...prevFilters, capacity: updatedCapacity };
      return updatedFilters;
    });
  };

  const filterPlants = () => {
    let filtered = [...plants];

    if (filters.search) {
      filtered = filtered.filter(
        (plant) =>
          plant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          plant.address.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter((plant) =>
        filters.status.includes(plant.status)
      );
    }

    if (filters.type.length > 0) {
      filtered = filtered.filter((plant) => filters.type.includes(plant.type));
    }

    if (filters.organization.length > 0) {
      filtered = filtered.filter((plant) =>
        filters.organization.includes(plant.organization)
      );
    }

    if (filters.capacity.min || filters.capacity.max) {
      filtered = filtered.filter(
        (plant) =>
          (filters.capacity.min
            ? plant.capacity >= filters.capacity.min
            : true) &&
          (filters.capacity.max ? plant.capacity <= filters.capacity.max : true)
      );
    }

    return filtered;
  };

  const handleApplyFilters = () => {
    onFilterChange(filterPlants());
    closeSidebar();
  };

  const handleClearFilters = () => {
    setFilters({
      status: [],
      type: [],
      organization: [],
      search: "",
      capacity: { min: 0, max: 10000 },
    });
    onFilterChange([]); // Reset the filtered data
    closeSidebar();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
              "Ground-mounted",
              "Battery-storage",
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
                checked={filters.organization.includes(organization)}
                onChange={() =>
                  handleCheckboxChange("organization", organization)
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

        {/* Apply Filters and Clear Filters Buttons */}
        <div className=" flex justify-between mt-4 gap-4">
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
};

export default FilterSidebar;
