import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { BsSortAlphaDown, BsCalendar, BsLightningFill } from "react-icons/bs";
import { GiElectric, GiPowerButton } from "react-icons/gi";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

const SortPlantsMenu = ({ onSortChange, className = "" }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("alphabetical");
  const [sortOrder, setSortOrder] = useState("asc");
  const dropdownRef = useRef(null);

  const options = [
    {
      value: "alphabetical",
      icon: <BsSortAlphaDown />,
      label: t("sortByName"),
    },
    {
      value: "installationDate",
      icon: <BsCalendar />,
      label: t("sortByCreationDate"),
    },
    {
      value: "powerOutput",
      icon: <BsLightningFill />,
      label: t("sortByPowerOutput"),
    },
    { value: "capacity", icon: <GiElectric />, label: t("sortByCapacity") },
    { value: "status", icon: <GiPowerButton />, label: t("sortByStatus") },
  ];

  const handleSelect = (value) => {
    const newOrder =
      selectedOption === value && sortOrder === "asc" ? "desc" : "asc";
    setSelectedOption(value);
    setSortOrder(newOrder);
    onSortChange(value, newOrder);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOptionData =
    options.find((opt) => opt.value === selectedOption) || options[0];

  return (
    <div ref={dropdownRef} className={`inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border-1 border-gray-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-700/50 backdrop-blur-sm text-custom-dark-blue dark:text-custom-yellow font-secondary px-3 py-1.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:ring-opacity-50 transition-all duration-300 min-w-[180px] w-full"
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0">{selectedOptionData.icon}</span>
          <span className="truncate">{selectedOptionData.label}</span>
        </span>
        <svg
          className={`w-4 h-4 ml-2 flex-shrink-0 text-custom-dark-gray dark:text-custom-light-gray transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-10 bg-slate-50 dark:bg-slate-700/50 backdrop-blur-sm border border-gray-300 dark:border-custom-light-gray rounded-lg shadow-lg min-w-[180px] w-auto">
          <div className="max-h-64 overflow-y-auto py-1">
            {options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full flex items-center gap-2 px-3 py-1.5 text-left
                  transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700
                  ${
                    selectedOption === option.value
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                `}
              >
                <span className="flex-shrink-0 dark:text-custom-yellow">
                  {option.icon}
                </span>
                <span className="truncate dark:text-custom-yellow flex-1">
                  {option.label}
                </span>
                {selectedOption === option.value && (
                  <span className="ml-auto flex-shrink-0 flex items-center justify-center dark:text-custom-yellow">
                    {sortOrder === "asc" ? (
                      <TiArrowSortedUp className="text-lg" />
                    ) : (
                      <TiArrowSortedDown className="text-lg" />
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortPlantsMenu;
