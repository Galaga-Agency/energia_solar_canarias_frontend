import { useState, useEffect } from "react";

const usePlantSort = (items) => {
  const validItems = Array.isArray(items) ? items : items?.plants || [];

  const [sortedItems, setSortedItems] = useState(validItems);

  useEffect(() => {
    setSortedItems(validItems);
  }, [items]);

  const sortItems = (criteria, order = "asc") => {
    let sorted = [...validItems];
    const sortOrder = order === "asc" ? 1 : -1;

    switch (criteria) {
      case "alphabetical":
        sorted.sort((a, b) => a.name.localeCompare(b.name) * sortOrder);
        break;
      case "installationDate":
        sorted.sort(
          (a, b) =>
            (new Date(a.installation_date) - new Date(b.installation_date)) *
            sortOrder
        );
        break;
      case "powerOutput":
        sorted.sort((a, b) => (a.current_power - b.current_power) * sortOrder);
        break;
      case "capacity":
        sorted.sort((a, b) => (a.capacity - b.capacity) * sortOrder);
        break;
      case "status":
        sorted.sort((a, b) => a.status.localeCompare(b.status) * sortOrder);
        break;
      default:
        sorted = validItems;
    }
    setSortedItems(sorted);
  };

  return { sortedItems, sortItems };
};

export default usePlantSort;
