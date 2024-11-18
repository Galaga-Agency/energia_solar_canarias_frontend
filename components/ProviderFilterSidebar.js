"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { IoMdClose } from "react-icons/io";

const ProviderFilterSidebar = ({
  plants,
  onFilterChange,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    organization: [],
    search: "",
    capacity: { min: 0, max: 10000 },
  });
  const { isDesktop, isMobile } = useDeviceType();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (plants && plants.length > 0) {
      const filtered = filterPlants(filters);
      onFilterChange(filtered);
    }
  }, [plants]);

  const handleCheckboxChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilter = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value];

      const updatedFilters = {
        ...prevFilters,
        [filterType]: updatedFilter,
      };

      const filteredResults = filterPlants(updatedFilters);
      onFilterChange(filteredResults);

      return updatedFilters;
    });
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: searchTerm,
    }));
    onFilterChange(filterPlants({ ...filters, search: searchTerm }));
  };

  const handleCapacityChange = (type, value) => {
    if (!value || isNaN(value)) return;
    setFilters((prevFilters) => {
      const updatedCapacity = {
        ...prevFilters.capacity,
        [type]: Number(value),
      };
      const updatedFilters = {
        ...prevFilters,
        capacity: updatedCapacity,
      };
      const filteredResults = filterPlants(updatedFilters);
      onFilterChange(filteredResults);
      return updatedFilters;
    });
  };

  const filterPlants = (currentFilters) => {
    if (!plants) return [];

    let filtered = [...plants];

    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filtered = filtered.filter(
        (plant) =>
          plant.name.toLowerCase().includes(searchTerm) ||
          plant.address.toLowerCase().includes(searchTerm)
      );
    }

    if (currentFilters.status.length > 0) {
      filtered = filtered.filter((plant) =>
        currentFilters.status.includes(plant.status)
      );
    }

    if (currentFilters.type.length > 0) {
      filtered = filtered.filter((plant) =>
        currentFilters.type.includes(plant.type)
      );
    }

    if (currentFilters.organization.length > 0) {
      filtered = filtered.filter((plant) =>
        currentFilters.organization.includes(plant.organization)
      );
    }

    if (currentFilters.capacity.min || currentFilters.capacity.max) {
      filtered = filtered.filter(
        (plant) =>
          (currentFilters.capacity.min
            ? plant.capacity >= currentFilters.capacity.min
            : true) &&
          (currentFilters.capacity.max
            ? plant.capacity <= currentFilters.capacity.max
            : true)
      );
    }

    return filtered;
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

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={t("filterPlaceholder")}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
        />
      </div>

      {/* Filter Sections (status, type, organization, etc.) */}
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

      {/* Type Filters */}
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

      {/* Capacity Filters */}
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

      {/* Validate Filters Button (mobile only) */}
      <div className="xl:hidden flex justify-center mt-4">
        <button
          onClick={() => {
            onFilterChange(filterPlants(filters));
            closeSidebar();
          }}
          className="bg-custom-yellow text-custom-dark-blue py-2 px-6 rounded-lg"
        >
          {t("applyFilters")}
        </button>
      </div>
    </div>
  );
};

export default ProviderFilterSidebar;
