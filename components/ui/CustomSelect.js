import React, { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const CustomSelect = ({ value, onChange, options, label, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false); // Close dropdown on selection
  };

  const toTitleCase = (str) => {
    return str
      .toLowerCase() // Ensure the string is lowercase first
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        onClick={handleToggle}
        className="h-full w-full md:w-max font-secondary text-md flex items-center text-sm dark:border dark:border-gray-200/50 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-2 hover:bg-custom-light-gray dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow"
      >
        <span className="mr-2">{toTitleCase(t(label))}</span>
        <span className="ml-auto">{toTitleCase(t(value))}</span>
        <BsChevronDown className="ml-2 mt-1 " />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-max bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg z-10 mt-2">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-4 py-2 font-secondary cursor-pointer text-gray-700 dark:text-gray-200 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {/* Translate the option label */}
              {t(option.label)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
