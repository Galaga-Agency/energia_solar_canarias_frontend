import { useState, useEffect } from "react";

const usePlantFilter = (plants) => {
  const [filteredPlants, setFilteredPlants] = useState(plants);

  // Update filteredPlants when the plants array changes
  useEffect(() => {
    setFilteredPlants(plants);
  }, [plants]);

  const filterItems = (searchTerm, selectedVendor) => {
    const lowerCaseSearchTerm = searchTerm ? searchTerm.toLowerCase() : "";
    const filtered = plants.filter((plant) => {
      const matchesSearchTerm = plant.name
        .toLowerCase()
        .includes(lowerCaseSearchTerm);
      const matchesVendor = selectedVendor
        ? plant.organization === selectedVendor
        : true;

      return matchesSearchTerm && matchesVendor;
    });

    setFilteredPlants(filtered);
  };

  return { filteredPlants, filterItems };
};

export default usePlantFilter;
