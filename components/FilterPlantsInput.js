import { useState } from "react";
import { useTranslation } from "react-i18next";

const FilterPlantsInput = ({ onSearch, providers }) => {
  // All hooks must be called at the top level
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const { t } = useTranslation(); // Hook moved to top level with other hooks

  const handleSearch = () => {
    if (searchTerm && selectedProvider) {
      onSearch(searchTerm, selectedProvider);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <input
        type="text"
        placeholder={t("Search plants")}
        className="px-4 py-2 w-60 text-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="px-4 py-2 ml-2"
        value={selectedProvider}
        onChange={(e) => setSelectedProvider(e.target.value)}
      >
        <option value="">{t("Select Provider")}</option>
        {providers &&
          providers.map((provider) => (
            <option key={provider.name} value={provider.name}>
              {provider.name}
            </option>
          ))}
      </select>
      <button
        onClick={handleSearch}
        className="ml-2 px-4 py-2 bg-blue-500 text-white"
        disabled={!searchTerm || !selectedProvider}
      >
        {t("Search")}
      </button>
    </div>
  );
};

export default FilterPlantsInput;
