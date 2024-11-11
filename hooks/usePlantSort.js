import { useState, useEffect } from "react";

const usePlantSort = (items) => {
  // Ensure items is always an array, even if it's passed in as an object or undefined.
  const validItems = Array.isArray(items) ? items : items?.plants || [];

  const [sortedItems, setSortedItems] = useState(validItems);

  useEffect(() => {
    setSortedItems(validItems);
  }, [items]);

  const sortItems = (criteria) => {
    let sorted = [...validItems];
    switch (criteria) {
      case "alphabetical":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "creationDate":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "powerOutput":
        sorted.sort((a, b) => b.currentPowerOutputKW - a.currentPowerOutputKW);
        break;
      default:
        sorted = validItems;
    }
    setSortedItems(sorted);
  };

  return { sortedItems, sortItems };
};

export default usePlantSort;
