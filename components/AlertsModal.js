import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { IoFilterOutline } from "react-icons/io5";
import { BsCalendar3 } from "react-icons/bs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Texture from "@/components/Texture";
import DateSelector from "@/components/DateSelector";
import { useTranslation } from "react-i18next";
import AlertRow from "./AlertRow";
import ActionDropdown from "./ActionDropdown";
import CustomCheckbox from "./ui/CustomCheckbox";
import CustomSelect from "./ui/CustomSelect";

const AlertsModal = ({ isOpen, onClose, alerts: initialAlerts = [] }) => {
  const { t } = useTranslation();

  // Translation keys for filter values
  const FILTER_KEYS = {
    STATUS: {
      ALL: "status.all",
      OPEN: "status.open",
      OPEN_MUTED: "status.openMuted",
      CLOSED: "status.closed",
      CLOSED_MUTED: "status.closedMuted",
    },
    CATEGORY: {
      ALL: "category.all",
      COMMUNICATION: "category.communication",
      EQUIPMENT: "category.equipment",
      CONFIG: "category.config",
      STORAGE: "category.storage",
      ENVIRONMENTAL: "category.environmental",
      ENERGY: "category.energy",
    },
  };

  const [filters, setFilters] = useState({
    severity: [],
    status: FILTER_KEYS.STATUS.OPEN,
    category: FILTER_KEYS.CATEGORY.ALL,
    date: null,
  });

  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredAlerts, setFilteredAlerts] = useState(initialAlerts);
  const [selectAll, setSelectAll] = useState(false);

  const categories = useMemo(
    () => [
      { value: FILTER_KEYS.CATEGORY.ALL, label: t("categoryAll") },
      { value: FILTER_KEYS.CATEGORY.COMMUNICATION, label: t("communication") },
      { value: FILTER_KEYS.CATEGORY.EQUIPMENT, label: t("equipment") },
      { value: FILTER_KEYS.CATEGORY.CONFIG, label: t("installationConfig") },
      { value: FILTER_KEYS.CATEGORY.STORAGE, label: t("storage") },
      { value: FILTER_KEYS.CATEGORY.ENVIRONMENTAL, label: t("environmental") },
      { value: FILTER_KEYS.CATEGORY.ENERGY, label: t("energyManagement") },
    ],
    [t]
  );

  const statusOptions = useMemo(
    () => [
      { value: FILTER_KEYS.STATUS.ALL, label: t("allTypes") },
      { value: FILTER_KEYS.STATUS.OPEN, label: t("open") },
      { value: FILTER_KEYS.STATUS.OPEN_MUTED, label: t("openMuted") },
      { value: FILTER_KEYS.STATUS.CLOSED, label: t("closed") },
      { value: FILTER_KEYS.STATUS.CLOSED_MUTED, label: t("closedMuted") },
    ],
    [t]
  );

  useEffect(() => {
    let result = [...initialAlerts];

    if (filters.severity.length > 0) {
      result = result.filter((alert) =>
        filters.severity.includes(alert.severity)
      );
    }

    if (filters.status !== FILTER_KEYS.STATUS.ALL) {
      const statusMatches = {
        [FILTER_KEYS.STATUS.OPEN]: ["Abiertas", "Abierta"],
        [FILTER_KEYS.STATUS.OPEN_MUTED]: ["Abierta (silenciada)"],
        [FILTER_KEYS.STATUS.CLOSED]: ["Cerrada", "Cerradas"],
        [FILTER_KEYS.STATUS.CLOSED_MUTED]: ["Cerrada (silenciada)"],
      };

      // console.log("Filtering by status:", {
      //   currentFilter: filters.status,
      //   matchingStatuses: statusMatches[filters.status],
      //   currentAlertStatuses: result.map((a) => a.status),
      // });

      result = result.filter((alert) =>
        statusMatches[filters.status]?.includes(alert.status)
      );
    }

    if (filters.category !== FILTER_KEYS.CATEGORY.ALL) {
      result = result.filter((alert) => alert.category === t(filters.category));
    }

    if (filters.date) {
      result = result.filter(
        (alert) =>
          new Date(alert.date).toDateString() === filters.date.toDateString()
      );
    }

    setFilteredAlerts(result);
  }, [filters, initialAlerts, t]);

  const handleAlertSelect = (alertId) => {
    setSelectedAlerts((prev) => {
      if (prev.includes(alertId)) {
        return prev.filter((id) => id !== alertId);
      }
      return [...prev, alertId];
    });
  };

  const handleSelectAll = () => {
    setSelectAll((prev) => !prev);
  };

  const clearFilters = () => {
    setFilters({
      severity: [],
      status: FILTER_KEYS.STATUS.ALL,
      category: FILTER_KEYS.CATEGORY.ALL,
      date: null,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] grid place-items-center overflow-y-auto custom-scrollbar p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-gray-900 backdrop-blur-lg text-gray-900 dark:text-white rounded-lg shadow-xl w-[90vw] max-w-6xl relative z-10 overflow-visible"
          >
            <Texture />
            {/* Header */}
            <div className="bg-gray-800 text-white p-5 flex items-center justify-between shadow-lg rounded-t-lg">
              <div className="flex items-center gap-2 text-custom-yellow">
                <FiAlertCircle className="text-3xl" />
                <h2 className="text-xl font-bold">{t("alerts")}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition duration-200 text-custom-yellow hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Filters Section */}
            <div className="p-6 space-y-6">
              {/* Severity Buttons */}
              <div className="overflow-x-auto">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-md shadow-sm min-w-max">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center bg-green-500 text-white">
                    ✓
                  </div>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                    <button
                      key={level}
                      className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                        filters.severity.includes(level)
                          ? "ring-2 ring-yellow-400"
                          : "opacity-50 hover:opacity-100"
                      } ${
                        level <= 3
                          ? "bg-yellow-500"
                          : level <= 6
                          ? "bg-orange-500"
                          : "bg-red-500"
                      } text-white`}
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          severity: prev.severity.includes(level)
                            ? prev.severity.filter((s) => s !== level)
                            : [...prev.severity, level],
                        }));
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <ActionDropdown selectedCount={selectedAlerts.length} />

                <CustomSelect
                  label={t("categoryAlert")}
                  value={
                    categories.find((cat) => cat.value === filters.category)
                      ?.label
                  }
                  onChange={(selectedValue) => {
                    setFilters((prev) => ({
                      ...prev,
                      category: selectedValue,
                    }));
                  }}
                  options={categories}
                />

                <div className="relative">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="font-secondary dark:border dark:border-gray-200/50 text-md flex gap-4 items-center text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 hover:bg-custom-light-gray dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow h-full"
                  >
                    <span>
                      {filters.date
                        ? format(filters.date, "dd/MM/yyyy", { locale: es })
                        : t("dateAll")}
                    </span>
                    <BsCalendar3 />
                  </button>
                  <DateSelector
                    isOpen={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                    onSelect={(date) => {
                      setFilters((prev) => ({ ...prev, date }));
                      setShowDatePicker(false);
                    }}
                    value={filters.date}
                  />
                </div>

                <CustomSelect
                  label={t("statusAlert")}
                  value={
                    statusOptions.find((opt) => opt.value === filters.status)
                      ?.label
                  }
                  onChange={(selectedValue) => {
                    setFilters((prev) => ({
                      ...prev,
                      status: selectedValue,
                    }));
                  }}
                  options={statusOptions}
                />
                <button
                  className="font-secondary text-md p-2 text-lg text-custom-yellow"
                  onClick={clearFilters}
                >
                  {t("clearFilters")}
                </button>
              </div>
            </div>

            {/* Alerts Table */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar px-6 py-6 overflow-x-auto">
              {filteredAlerts.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-300 py-12 font-secondary">
                  {t("noAlerts")}
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-900 sticky -top-8 z-0">
                    <tr>
                      <th className="w-8 p-3">
                        <CustomCheckbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </th>
                      <th className="font-secondary text-md p-3 text-left">
                        {t("level")}
                      </th>
                      <th className="font-secondary text-md p-3 text-left">
                        {t("alertType")}
                      </th>
                      <th className="font-secondary text-md p-3 text-left">
                        {t("component")}
                      </th>
                      <th className="font-secondary text-md p-3 text-left">
                        {t("opened")}
                      </th>
                      <th className="font-secondary text-md p-3 text-left">
                        {t("statusAlert")}
                      </th>
                      <th className="font-secondary text-md p-3 text-left">
                        {t("category")}
                      </th>
                      <th className="font-secondary text-md p-3 text-left">
                        {t("serialNumber")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlerts.map((alert) => (
                      <AlertRow
                        key={alert.id}
                        alert={alert}
                        checked={selectedAlerts.includes(alert.id)}
                        onCheck={handleAlertSelect}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertsModal;
