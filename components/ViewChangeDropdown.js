import React, { useState } from "react";
import { BsBuilding } from "react-icons/bs"; // Example icon, replace with your own

const ViewChangeDropdown = ({ onChange, view }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    {
      value: "providers",
      icon: <BsBuilding />,
      label: "Show Providers",
    },
    {
      value: "plants",
      icon: <BsBuilding />,
      label: "Show All Plants",
    },
  ];

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white dark:bg-custom-dark-blue text-custom-dark-blue dark:text-custom-yellow font-secondary px-4 py-2 border border-gray-300 dark:border-custom-light-gray rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-custom-yellow focus:ring-opacity-50 transition duration-300"
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
        <div className="absolute z-10 mt-1 bg-white dark:bg-custom-dark-blue border border-gray-300 dark:border-custom-light-gray rounded-lg shadow-lg min-w-[100%] whitespace-nowrap">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
                view === option.value ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
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
