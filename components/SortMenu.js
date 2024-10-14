import React from "react";
import { useTranslation } from "next-i18next";
import { BsSortAlphaDown, BsCalendar, BsLightningFill } from "react-icons/bs";

const SortMenu = ({ onSortChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end mb-6">
      <div className="relative inline-block">
        <select
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-white dark:bg-custom-dark-blue text-custom-dark-blue dark:text-custom-yellow font-secondary px-4 py-2 pr-8 border border-gray-300 dark:border-custom-light-gray rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-custom-yellow focus:ring-opacity-50 transition duration-300"
        >
          <option value="name">
            <BsSortAlphaDown className="inline mr-2" />
            {t("sortByName")}
          </option>
          <option value="creationDate">
            <BsCalendar className="inline mr-2" />
            {t("sortByCreationDate")}
          </option>
          <option value="powerOutput">
            <BsLightningFill className="inline mr-2" />
            {t("sortByPowerOutput")}
          </option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-custom-dark-gray dark:text-custom-light-gray"
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
        </div>
      </div>
    </div>
  );
};

export default SortMenu;
