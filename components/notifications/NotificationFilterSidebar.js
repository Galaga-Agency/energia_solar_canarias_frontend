import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import { X, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import useDeviceType from "@/hooks/useDeviceType";

const INITIAL_FILTERS = {
  pw_type: [],
  recoveryStatus: "all", // 'all', 'recovered', 'pending'
  search: "",
  severity: [],
  organization: [],
};

const SEVERITY_LEVELS = [
  { value: "low", level: 1, label: "severity_level_1" },
  { value: "medium", level: 2, label: "severity_level_2" },
  { value: "high", level: 3, label: "severity_level_3" },
];

const ORGANIZATION_OPTIONS = [
  { name: "Goodwe", value: "goodwe", isAvailable: true },
  { name: "SolarEdge", value: "solaredge", isAvailable: true },
  { name: "Victron Energy", value: "victron", isAvailable: true },
  { name: "Bluetti", value: "bluetti", isAvailable: false },
  { name: "Sungrow", value: "sungrow", isAvailable: false },
  { name: "Sigenergy", value: "sigenergy", isAvailable: false },
  { name: "SMA", value: "sma", isAvailable: false },
  { name: "Solar.web - Fronius", value: "solarweb", isAvailable: false },
];

const NotificationFilterSidebar = ({
  activeNotifications,
  resolvedNotifications,
  showResolved,
  onFilterChange,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { t } = useTranslation();
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const sidebarRef = useRef(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const normalizeString = (str) => {
    if (!str) return "";
    return str.toLowerCase().replace(/\s+/g, "");
  };

  const filterNotifications = useCallback(
    (currentFilters) => {
      let filteredActive = [...activeNotifications];
      let filteredResolved = [...resolvedNotifications];

      // Search filter
      if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        const filterBySearch = (notification) => {
          const searchFields = [
            notification?.stationname,
            notification?.plantName,
            notification?.warningname,
            notification?.description,
            notification?.deviceName,
            notification?.device,
          ];

          return searchFields.some((field) =>
            field?.toLowerCase().includes(searchTerm)
          );
        };

        filteredActive = filteredActive.filter(filterBySearch);
        filteredResolved = filteredResolved.filter(filterBySearch);
      }

      // Severity filter
      if (currentFilters.severity.length > 0) {
        const filterBySeverity = (notification) => {
          // If no severity filters selected, show all
          if (currentFilters.severity.length === 0) return true;

          // For Goodwe
          if (notification.provider === "goodwe") {
            return currentFilters.severity.includes(
              Number(notification.warninglevel)
            );
          }
          // For Victron
          else if (notification.provider === "victron") {
            let severityLevel;
            const nameEnum = notification.nameEnum?.toLowerCase();

            // Map Victron severity levels to numeric values
            switch (nameEnum) {
              case "alarm":
                severityLevel = 3;
                break;
              case "warning":
                severityLevel = 2;
                break;
              case "notification":
              default:
                severityLevel = 1;
                break;
            }

            return currentFilters.severity.includes(severityLevel);
          }
          return false;
        };

        filteredActive = filteredActive.filter(filterBySeverity);
        filteredResolved = filteredResolved.filter(filterBySeverity);
      }

      // Organization filter
      if (currentFilters.organization.length > 0) {
        const filterByOrganization = (notification) =>
          currentFilters.organization.includes(notification.provider);

        filteredActive = filteredActive.filter(filterByOrganization);
        filteredResolved = filteredResolved.filter(filterByOrganization);
      }

      return {
        active: filteredActive,
        resolved: filteredResolved,
      };
    },
    [activeNotifications, resolvedNotifications]
  );

  const handleSearchChange = useCallback(
    (event) => {
      const searchTerm = event.target.value;
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          search: searchTerm,
        };

        const filtered = filterNotifications(updatedFilters);
        onFilterChange(filtered);

        return updatedFilters;
      });
    },
    [filterNotifications, onFilterChange]
  );

  const handleCheckboxChange = useCallback(
    (filterType, value, isAvailable) => {
      if (!isAvailable && filterType === "organization") return;

      setFilters((prevFilters) => {
        // Convert value to number for severity
        const actualValue = filterType === "severity" ? Number(value) : value;

        const updatedFilter = [...prevFilters[filterType]];
        const index = updatedFilter.indexOf(actualValue);

        console.log("Checkbox change:", {
          filterType,
          value: actualValue,
          currentFilters: updatedFilter,
          found: index > -1,
        });

        if (index > -1) {
          updatedFilter.splice(index, 1);
        } else {
          updatedFilter.push(actualValue);
        }

        const updatedFilters = {
          ...prevFilters,
          [filterType]: updatedFilter,
        };

        console.log("Updated filters:", updatedFilters);
        const filtered = filterNotifications(updatedFilters);
        onFilterChange(filtered);

        return updatedFilters;
      });
    },
    [filterNotifications, onFilterChange]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    onFilterChange({
      active: activeNotifications,
      resolved: resolvedNotifications,
    });
  }, [activeNotifications, resolvedNotifications, onFilterChange]);

  return (
    <div
      ref={sidebarRef}
      className={`min-w-72 overflow-auto filter-sidebar-selector fixed z-50 top-0 left-0 h-screen xl:h-full transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } xl:static xl:block xl:translate-x-0 bg-white/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 backdrop-blur-sm backdrop-filter p-4 rounded-r-lg xl:rounded-lg shadow-lg max-w-xs w-full md:w-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow">
          {t("filter")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="p-2 text-custom-dark-blue dark:text-custom-yellow hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
            title={t("reset_filters")}
          >
            {isDesktop && <span>{t("reset")}</span>}
            <RotateCcw className="w-5 h-5" />
          </button>
          {(isMobile || isTablet) && (
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="h-6 w-6 text-custom-dark-blue dark:text-custom-yellow" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={t("search_notifications")}
          className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:text-custom-yellow transition duration-300"
        />
      </div>

      {/* <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("recovery_status")}
        </h3>
        <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
          <CustomCheckbox
            label={t("show_recovered")}
            checked={filters.recoveryStatus === "recovered"}
            onChange={() => handleRecoveryStatusChange("recovered")}
          />
          <CustomCheckbox
            label={t("show_pending")}
            checked={filters.recoveryStatus === "pending"}
            onChange={() => handleRecoveryStatusChange("pending")}
          />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("pw_type")}
        </h3>
        <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
          {Object.entries(PW_TYPES).map(([key, label]) => (
            <CustomCheckbox
              key={key}
              label={t(label)}
              checked={filters.pw_type.includes(key)}
              onChange={() => handleCheckboxChange("pw_type", key)}
            />
          ))}
        </div>
      </div> */}

      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("severity")}
        </h3>
        <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
          {SEVERITY_LEVELS.map((severity) => (
            <CustomCheckbox
              key={severity.level}
              label={t(severity.label)}
              checked={filters.severity.includes(severity.level)}
              onChange={() => handleCheckboxChange("severity", severity.level)} // Pass the numeric level
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("organization")}
        </h3>
        <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
          {ORGANIZATION_OPTIONS.map((org) => (
            <div
              key={org.name}
              className={!org.isAvailable ? "opacity-50" : undefined}
            >
              <CustomCheckbox
                label={
                  <span className="flex items-center gap-2 text-nowrap">
                    {org.name}
                    {!org.isAvailable && (
                      <span className="text-xs italic text-custom-dark-blue dark:text-custom-light-gray">
                        ({t("comingSoon")})
                      </span>
                    )}
                  </span>
                }
                checked={filters.organization.includes(org.value)}
                onChange={() =>
                  handleCheckboxChange(
                    "organization",
                    org.value,
                    org.isAvailable
                  )
                }
                disabled={!org.isAvailable}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationFilterSidebar;
