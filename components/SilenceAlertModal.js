import React, { useEffect, useState } from "react";
import { BsCalendar3 } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import DateSelector from "./DateSelector";
import SecondaryButton from "./ui/SecondaryButton";
import PrimaryButton from "./ui/PrimaryButton";

const SilenceAlertModal = ({ onClose, onSave }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    date: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (date) => {
    setFilters({ ...filters, date });
    setShowDatePicker(false); // Close the date picker when a date is selected
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setFilters({ ...filters, date: null });
    setShowDatePicker(false); // Close the date picker when canceled
    onClose();
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onSave(filters.date); // Pass the selected date to the parent component
    setShowDatePicker(false); // Close the date picker after saving
    onClose();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-auto max-h-[500px] overflow-y-auto custom-scrollbar">
      <h2 className="text-xl font-bold mb-4 text-red-500">
        {t("silenceAlert")}
      </h2>
      <p>{t("noShowSelectedAlerts")}</p>

      <div className="my-4">
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:text-white flex items-center justify-between"
        >
          <span>
            {filters.date ? filters.date.toLocaleDateString() : t("selectDate")}
          </span>
          <BsCalendar3 />
        </button>

        {showDatePicker && (
          <div className="absolute z-[999] top-24 bg-gray-800/50 dark:bg-gray-900/50 rounded-lg p-2 shadow-lg">
            <DateSelector
              isOpen={showDatePicker}
              onClose={() => setShowDatePicker(false)}
              onSelect={handleDateChange}
              value={filters.date}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4">
        <SecondaryButton
          onClick={handleClose}
          className="bg-gray-500 text-white p-2 rounded-lg"
        >
          {t("cancel")}
        </SecondaryButton>
        <PrimaryButton
          onClick={handleSave}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          {t("save")}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default SilenceAlertModal;
