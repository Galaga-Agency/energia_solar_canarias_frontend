import { useState, useEffect } from "react";

const usePlantFilter = (items) => {
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const filterItems = (searchTerm) => {
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filtered = items.filter((item) => {
      return (
        item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        (item.location?.address &&
          item.location.address.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (item.location?.city &&
          item.location.city.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (item.location?.state &&
          item.location.state.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (item.location?.country &&
          item.location.country.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (item.status && item.status.toLowerCase().includes(lowerCaseSearchTerm))
      );
    });

    setFilteredItems(filtered);
  };

  return { filteredItems, filterItems };
};

export default usePlantFilter;
