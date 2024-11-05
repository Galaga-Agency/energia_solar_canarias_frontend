"use client";

import { useTranslation } from "next-i18next";

const FilterInput = ({ onFilterChange }) => {
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    onFilterChange(e.target.value);
  };

  return (
    <div className="flex justify-center my-8 z-10">
      <input
        type="text"
        placeholder={t("plantsfilterPlaceholder")}
        className="z-10 px-4 py-2 w-full max-w-md text-lg font-secondary text-custom-dark-blue dark:text-custom-light-gray bg-white dark:bg-custom-dark-blue border-2 border-custom-yellow rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-custom-yellow transition duration-300"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default FilterInput;
