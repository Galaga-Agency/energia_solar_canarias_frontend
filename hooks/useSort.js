import { useState, useEffect } from "react";

const useSort = (items) => {
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
      case "powerOutput":
        sorted.sort((a, b) => b.currentPowerOutputKW - a.currentPowerOutputKW);
        break;
      case "income":
        sorted.sort((a, b) => b.totalIncomeEUR - a.totalIncomeEUR);
        break;
      default:
        sorted = items;
    }
    setSortedItems(sorted);
  };

  return { sortedItems, sortItems };
};

export default useSort;
