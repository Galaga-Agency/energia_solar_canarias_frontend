import React, { useState } from "react";
import { BsCalendar3 } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import SecondaryButton from "./ui/SecondaryButton";
import PrimaryButton from "./ui/PrimaryButton";
import DateSelector from "./DateSelector";

const EditSilencedAlertModal = ({ onClose, onSave, silencedAlerts }) => {
  const { t } = useTranslation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filters, setFilters] = useState({
    alertType: "",
    component: "",
    date: null,
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setFilters({
      alertType: "",
      component: "",
      date: null,
    });
    setShowDatePicker(false);
    onClose();
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onSave(filters);
    onClose();
  };

  const handleDateSelect = (date) => {
    setFilters((prev) => ({ ...prev, date }));
    setShowDatePicker(false);
  };

  const renderAlertTypeSelect = () => (
    <div>
      <label
        htmlFor="alertType"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {t("alertType")}
      </label>
      <select
        id="alertType"
        name="alertType"
        value={filters.alertType}
        onChange={handleChange}
        className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-custom-yellow"
      >
        <option value="">{t("selectAlertType")}</option>
      </select>
    </div>
  );

  const renderComponentSelect = () => (
    <div>
      <label
        htmlFor="component"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {t("component")}
      </label>
      <select
        id="component"
        name="component"
        value={filters.component}
        onChange={handleChange}
        className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-custom-yellow"
      >
        <option value="">{t("selectComponent")}</option>
      </select>
    </div>
  );

  const renderDateSelector = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {t("silencedUntil")}
      </label>
      <div className="relative">
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white flex items-center justify-between focus:ring-2 focus:ring-custom-yellow"
        >
          <span>
            {filters.date ? filters.date.toLocaleDateString() : t("selectDate")}
          </span>
          <BsCalendar3 />
        </button>

        {showDatePicker && (
          <div className="absolute z-[999]">
            <DateSelector
              isOpen={showDatePicker}
              onClose={() => setShowDatePicker(false)}
              onSelect={handleDateSelect}
              value={filters.date}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-auto">
      <h2 className="text-xl font-bold mb-4 text-orange-500">
        {t("editSilencedAlerts")}
      </h2>

      <div className="space-y-4">
        {renderAlertTypeSelect()}
        {renderComponentSelect()}
        {renderDateSelector()}
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <SecondaryButton onClick={handleClose}>{t("cancel")}</SecondaryButton>
        <PrimaryButton onClick={handleSave}>{t("done")}</PrimaryButton>
      </div>
    </div>
  );
};

export default EditSilencedAlertModal;
