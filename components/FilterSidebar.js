import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
} from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import { IoFilter } from "react-icons/io5";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/store/slices/userSlice";
import useTouchDevice from "@/hooks/useTouchDevice";

const STATUS_OPTIONS = [
  "working",
  "error",
  "waiting",
  "disconnected",
  "Cargando",
  "Descargando",
  "En reposo",
];

const ORGANIZATION_OPTIONS = [
  { name: "Goodwe", isAvailable: true },
  { name: "SolarEdge", isAvailable: true },
  { name: "Victron Energy", isAvailable: true },
  { name: "Bluetti", isAvailable: false },
  { name: "Sungrow", isAvailable: false },
  { name: "Sigenergy", isAvailable: false },
  { name: "SMA", isAvailable: false },
  { name: "Solar.web - Fronius", isAvailable: false },
];

const INITIAL_FILTER_STATE = {
  status: [],
  organization: [],
  search: "",
  capacity: { min: 0, max: 10000 },
};

const FilterSidebar = forwardRef(
  ({ plants, onFilterChange, initialSearchTerm, view }, ref) => {
    const { t } = useTranslation();
    const { isMobile, isTablet, isDesktop } = useDeviceType();
    const isTouchDevice = useTouchDevice();
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({
      ...INITIAL_FILTER_STATE,
      search: initialSearchTerm || "",
    });
    const isAdmin = useSelector(selectIsAdmin);

    const normalizeString = (str) => {
      if (!str) return "";
      return str.toLowerCase().replace(/\s+/g, "");
    };

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
            matchesOrganization &&
            matchesCapacity
          );
        });
      },
      [plants]
    );

    const handleCheckboxChange = useCallback(
      (filterType, value, isAvailable = true) => {
        if (!isAvailable) return;

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
      [onFilterChange, filterPlants]
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
      [onFilterChange, filterPlants]
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
      [onFilterChange, filterPlants]
    );

    const handleResetFilters = useCallback(() => {
      setFilters(INITIAL_FILTER_STATE);
      onFilterChange(plants);
    }, [plants, onFilterChange]);

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

    // Sidebar visibility
    useEffect(() => {
      if (isTouchDevice) {
        setIsSidebarOpen(false); // Mobile/tablet: close by default
      } else {
        setIsSidebarOpen(view === "plants"); // Ensure sidebar stays open only in "plants" view for desktop
      }
    }, [isTouchDevice, view]); // Trigger on device type or view change

    return (
      <div>
        <div
          ref={sidebarRef}
          className={`min-w-80 xl:min-h-[calc(85vh-64px)] h-[100dvh] xl:h-auto flex flex-col fixed z-600 top-0 left-0 transform transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } xl:static xl:block xl:translate-x-0 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm backdrop-filter rounded-r-lg xl:rounded-lg shadow-lg max-w-xs w-full md:w-auto`}
        >
          {/* Fixed Header */}
          <div className="sticky top-0 p-4 rounded-t-xl pb-0">
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
                {isTouchDevice && (
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
                placeholder={t("filterPlaceholder")}
                className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:text-custom-yellow transition duration-300"
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-24 xl:pb-4">
            <div className="space-y-6 pt-4">
              {/* Status Filters */}
              <div>
                <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
                  {t("plantStatus")}
                </h3>
                <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
                  {STATUS_OPTIONS.map((status) => (
                    <CustomCheckbox
                      key={status}
                      label={t(`status.${status}`)}
                      checked={filters.status.includes(normalizeString(status))}
                      onChange={() => handleCheckboxChange("status", status)}
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
                          checked={filters.organization.includes(
                            normalizeString(org.name)
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              "organization",
                              org.name,
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

              {/* Capacity Filters */}
              <div>
                <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
                  {t("capacity")} (kW)
                </h3>
                <div className="flex gap-4">
                  <div className="flex flex-col flex-1 min-w-0">
                    <label className="text-sm text-custom-dark-blue dark:text-custom-light-gray mb-1">
                      {t("min")}
                    </label>
                    <input
                      type="number"
                      value={filters.capacity.min}
                      onChange={(e) =>
                        handleCapacityChange("min", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleCapacityChange("max", e.target.value)
                      }
                      className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:text-custom-yellow transition duration-300"
                      placeholder={t("max")}
                    />
                  </div>
                </div>
              </div>
            </div>
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
  }
);

FilterSidebar.displayName = "FilterSidebar";

export default FilterSidebar;
