import { useState, useEffect } from "react";

const useFilter = (items, filterKey) => {
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const filterItems = (searchTerm) => {
    if (!searchTerm) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item[filterKey].toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  return { filteredItems, filterItems };
};

export default useFilter;
