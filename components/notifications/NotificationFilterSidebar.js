import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import { X, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import useDeviceType from "@/hooks/useDeviceType";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/store/slices/userSlice";
import useTouchDevice from "@/hooks/useTouchDevice";
import { IoFilter } from "react-icons/io5";

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
  const isTouchDevice = useTouchDevice();
  const sidebarRef = useRef(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const isAdmin = useSelector(selectIsAdmin);

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
      className={`
      min-w-80 xl:min-h-[calc(85vh-64px)] z-600 overflow-auto filter-sidebar-selector
      ${
        isTouchDevice
          ? "fixed top-0 left-0 h-screen" // Full height for mobile/tablet
          : "h-[calc(85vh-64px)]" // Subtract navbar height for desktop
      }
      transform transition-all duration-300 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      xl:static xl:block xl:translate-x-0 
      bg-white/50 dark:bg-custom-dark-blue/50  backdrop-blur-sm backdrop-filter
      rounded-r-lg xl:rounded-lg shadow-lg 
      max-w-xs w-full md:w-auto
    `}
    >
      {/* Fixed Header */}
      <div className="sticky top-0 rounded-t-xl p-4 pb-0">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow">
            {t("filter")}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handleResetFilters}
              className="p-2 text-custom-dark-blue dark:text-custom-yellow hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
              title={t("reset_filters")}
            >
              {isDesktop && <span>{t("reset")}</span>}
              <RotateCcw className="w-7 h-7" />
            </button>
            {isTouchDevice && !isDesktop && (
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="h-9 w-9 text-custom-dark-blue dark:text-custom-yellow" />
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
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-24 xl:pb-4">
        <div className="space-y-6 pt-4">
          {/* Severity Filters */}
          <div>
            <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
              {t("severity")}
            </h3>
            <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
              {SEVERITY_LEVELS.map((severity) => (
                <CustomCheckbox
                  key={severity.level}
                  label={t(severity.label)}
                  checked={filters.severity.includes(severity.level)}
                  onChange={() =>
                    handleCheckboxChange("severity", severity.level)
                  }
                />
              ))}
            </div>
          </div>

          {/* Organization Filters */}
          {isAdmin && (
            <div>
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
          )}
        </div>
      </div>

      {/* Mobile filter button */}
      {isTouchDevice && !isSidebarOpen && (
        <motion.button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="xl:hidden fixed bottom-20 left-5 z-40 bg-custom-yellow w-12 h-12 flex rounded-full justify-center items-center button-shadow"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IoFilter className="text-2xl text-custom-dark-blue" />
        </motion.button>
      )}
    </div>
  );
};

export default NotificationFilterSidebar;
