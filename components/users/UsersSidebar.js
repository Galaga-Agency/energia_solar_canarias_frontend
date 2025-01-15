import React, { useEffect, useRef, useCallback } from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { RotateCcw, X } from "lucide-react";
import { motion } from "framer-motion";

const INITIAL_FILTERS = {
  role: ["all"],
  activeStatus: ["all"],
  search: "",
};

const UsersSidebar = ({ filters, onFilterChange, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const sidebarRef = useRef(null);

  const handleResetFilters = useCallback(() => {
    onFilterChange(INITIAL_FILTERS);
  }, [onFilterChange]);

  const handleSearchChange = useCallback(
    (event) => {
      onFilterChange({
        ...filters,
        search: event.target.value,
      });
    },
    [filters, onFilterChange]
  );

  const handleRoleChange = useCallback(
    (role) => {
      let newRoles;
      if (role === "all") {
        newRoles = ["all"];
      } else {
        newRoles = filters.role.filter((r) => r !== "all");
        if (newRoles.includes(role)) {
          newRoles = newRoles.filter((r) => r !== role);
        } else {
          newRoles.push(role);
        }
        if (newRoles.length === 0) {
          newRoles = ["all"];
        }
      }
      onFilterChange({ ...filters, role: newRoles });
    },
    [filters, onFilterChange]
  );

  const handleActiveStatusChange = useCallback(
    (status) => {
      let newStatuses;
      if (status === "all") {
        newStatuses = ["all"];
      } else {
        newStatuses = filters.activeStatus.filter((s) => s !== "all");
        if (newStatuses.includes(status)) {
          newStatuses = newStatuses.filter((s) => s !== status);
        } else {
          newStatuses.push(status);
        }
        if (newStatuses.length === 0) {
          newStatuses = ["all"];
        }
      }
      onFilterChange({ ...filters, activeStatus: newStatuses });
    },
    [filters, onFilterChange]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    if (isOpen && (isMobile || isTablet)) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, isMobile, isTablet]);

  return (
    <div
      ref={sidebarRef}
      className={`h-auto overflow-auto filter-sidebar-selector ${
        isMobile || isTablet
          ? `fixed z-50 top-0 left-0 h-screen transform transition-all duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`
          : "w-80"
      } bg-white/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700  backdrop-blur-sm backdrop-filter p-4 rounded-lg shadow-lg`}
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
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="h-6 w-6 text-custom-dark-blue dark:text-custom-yellow" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="space-y-6">
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

        {/* Role Filter */}
        <div>
          <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
            {t("role")}
          </h3>
          <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
            {["all", "admin", "usuario"].map((role) => (
              <CustomCheckbox
                key={role}
                label={t(`roles.${role}`)}
                checked={filters.role.includes(role)}
                onChange={() => handleRoleChange(role)}
              />
            ))}
          </div>
        </div>

        {/* Active Status Filter */}
        <div>
          <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
            {t("active_status")}
          </h3>
          <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
            {["all", "active", "inactive"].map((status) => (
              <CustomCheckbox
                key={status}
                label={t(`${status}`)}
                checked={filters.activeStatus.includes(status)}
                onChange={() => handleActiveStatusChange(status)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersSidebar;
