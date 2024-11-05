import { useState, useEffect } from "react";

const usePlantSort = (items) => {
  const [sortedItems, setSortedItems] = useState(items);

  useEffect(() => {
    setSortedItems(items);
  }, [items]);

  const sortItems = (criteria) => {
    let sorted = [...items];
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
        sorted = items;
    }
    setSortedItems(sorted);
  };

  return { sortedItems, sortItems };
};

export default usePlantSort;
