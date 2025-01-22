import { Building2, Sun } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ViewChangeDropdown = ({ onChange, view }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const options = [
    {
      value: "providers",
      icon: <Building2 size={18} />,
      label: t("showProviders"),
    },
    {
      value: "plants",
      icon: <Sun size={18} />,
      label: t("showAllPlants"),
    },
  ];

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/50 backdrop-blur-sm dark:bg-custom-dark-blue text-custom-dark-blue dark:text-custom-yellow font-secondary px-4 py-2 border border-gray-300 dark:border-custom-light-gray rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-custom-yellow focus:ring-opacity-50 transition duration-300"
      >
        <span className="flex items-center gap-2">
          <span className="flex-shrink-0">
            {options.find((opt) => opt.value === view)?.icon}
          </span>
          <span className="whitespace-nowrap">
            {options.find((opt) => opt.value === view)?.label}
          </span>
        </span>
        <svg
          className={`w-4 h-4 ml-3 flex-shrink-0 text-custom-dark-gray dark:text-custom-light-gray transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
        <div className="absolute z-50 mt-1 bg-white/50 backdrop-blur-sm dark:bg-custom-dark-blue border border-gray-300 dark:border-custom-light-gray rounded-lg shadow-lg min-w-[100%] whitespace-nowrap">
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
                view === option.value ? "bg-gray-100 dark:bg-gray-700" : ""
              } 
              ${
                index === 0 ? "rounded-t-lg" : ""
              }  // Add rounded top to first item
              ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
            >
              <span className="flex-shrink-0 text-custom-dark-blue dark:text-custom-yellow">
                {option.icon}
              </span>
              <span className="whitespace-nowrap text-custom-dark-blue dark:text-custom-yellow flex-1">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewChangeDropdown;
