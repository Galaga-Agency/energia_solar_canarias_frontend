import { useState } from "react";

const FilterPlantsInput = ({ onSearch, providers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  console.log("provider in input: ", providers);

  const handleSearch = () => {
    if (searchTerm && selectedProvider) {
      onSearch(searchTerm, selectedProvider);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <input
        type="text"
        placeholder="Search plants"
        className="px-4 py-2 w-60 text-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="px-4 py-2 ml-2"
        value={selectedProvider}
        onChange={(e) => setSelectedProvider(e.target.value)}
      >
        <option value="">Select Provider</option>
        {providers.map((provider) => (
          <option key={provider.name} value={provider.name}>
            <img
              src={provider.img}
              alt={provider.name}
              className="inline-block w-6 h-6 mr-2"
            />
            {provider.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleSearch}
        className="ml-2 px-4 py-2 bg-blue-500 text-white"
        disabled={!searchTerm || !selectedVendor}
      >
        Search
      </button>
    </div>
  );
};

export default FilterPlantsInput;
