import React, { useState } from "react";
import { useTranslation } from "next-i18next";

const FilterSidebar = ({ plants, onFilterChange }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    organization: [],
    search: "",
    capacity: { min: 0, max: 10000 },
  });

  // Handle checkbox change for filters
  const handleCheckboxChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilter = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value];
      return { ...prevFilters, [filterType]: updatedFilter };
    });
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: event.target.value,
    }));
  };

  // Handle capacity range change
  const handleCapacityChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      capacity: { ...prevFilters.capacity, [type]: value },
    }));
  };

  // Filter logic (runs when filters change)
  const filterPlants = (filters) => {
    let filtered = [...plants];

    // Filter by search query
    if (filters.search) {
      filtered = filtered.filter(
        (plant) =>
          plant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          plant.address.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter((plant) =>
        filters.status.includes(plant.status)
      );
    }

    // Filter by type
    if (filters.type.length > 0) {
      filtered = filtered.filter((plant) => filters.type.includes(plant.type));
    }

    // Filter by organization
    if (filters.organization.length > 0) {
      filtered = filtered.filter((plant) =>
        filters.organization.includes(plant.organization)
      );
    }

    // Filter by capacity range (min, max)
    if (filters.capacity.min || filters.capacity.max) {
      filtered = filtered.filter(
        (plant) =>
          plant.capacity >= filters.capacity.min &&
          plant.capacity <= filters.capacity.max
      );
    }

    return filtered;
  };

  const filteredPlants = filterPlants(filters);

  // Trigger filter change (passing filtered data to parent)
  const handleApplyFilters = () => {
    onFilterChange(filteredPlants);
  };

  return (
    <div className="bg-white dark:bg-custom-dark-blue p-4 rounded-lg shadow-lg max-w-xs w-full">
      <div className="mb-4">
        <label className="block mb-2 text-lg text-gray-700 dark:text-gray-300">
          {t("search")}
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={t("searchPlaceholder")}
          className="w-full p-2 border rounded-md dark:bg-custom-dark-gray dark:text-gray-300"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          {t("status")}
        </h3>
        <div>
          {["working", "error", "waiting", "disconnected"].map((status) => (
            <label key={status} className="block">
              <input
                type="checkbox"
                checked={filters.status.includes(status)}
                onChange={() => handleCheckboxChange("status", status)}
                className="mr-2"
              />
              {t(`status_${status}`)}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          {t("type")}
        </h3>
        <div>
          {[
            "Residential",
            "Commercial",
            "Ground-mounted",
            "Battery-storage",
          ].map((type) => (
            <label key={type} className="block">
              <input
                type="checkbox"
                checked={filters.type.includes(type)}
                onChange={() => handleCheckboxChange("type", type)}
                className="mr-2"
              />
              {t(`type_${type}`)}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          {t("organization")}
        </h3>
        <div>
          {["Goodwe", "Sungrow", "Huawei"].map((organization) => (
            <label key={organization} className="block">
              <input
                type="checkbox"
                checked={filters.organization.includes(organization)}
                onChange={() =>
                  handleCheckboxChange("organization", organization)
                }
                className="mr-2"
              />
              {organization}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          {t("capacity")}
        </h3>
        <div className="flex gap-4">
          <input
            type="number"
            value={filters.capacity.min}
            onChange={(e) => handleCapacityChange("min", e.target.value)}
            className="w-1/2 p-2 border rounded-md dark:bg-custom-dark-gray dark:text-gray-300"
            placeholder={t("min")}
          />
          <input
            type="number"
            value={filters.capacity.max}
            onChange={(e) => handleCapacityChange("max", e.target.value)}
            className="w-1/2 p-2 border rounded-md dark:bg-custom-dark-gray dark:text-gray-300"
            placeholder={t("max")}
          />
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={handleApplyFilters}
          className="w-full bg-custom-yellow text-custom-dark-blue py-2 rounded-md"
        >
          {t("applyFilters")}
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          {t("filteredResults")} ({filteredPlants.length})
        </h3>
        <ul>
          {filteredPlants.map((plant) => (
            <li key={plant.id} className="text-gray-700 dark:text-gray-300">
              {plant.name} - {plant.address}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterSidebar;
