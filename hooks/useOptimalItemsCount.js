// app/hooks/useOptimalItemsCount.js
import { useState, useEffect } from "react";

export const useOptimalItemsCount = () => {
  const [itemsPerPage, setItemsPerPage] = useState(9);

  useEffect(() => {
    const calculateOptimalItems = () => {
      // Get the actual container height where the list is rendered
      const listContainer = document.querySelector(".py-8"); // Using your list container class
      if (!listContainer) return;

      // Get the actual available height
      const containerHeight = listContainer.clientHeight;
      const itemHeight = 64; // Height of each row

      // Calculate how many items will fit
      const optimal = Math.ceil(containerHeight / itemHeight);

      // Set a reasonable min/max
      const finalCount = Math.max(5, Math.min(30, optimal));

      console.log("Container height:", containerHeight);
      console.log("Will show items:", finalCount);

      setItemsPerPage(finalCount);
    };

    // Wait for DOM to be ready
    setTimeout(calculateOptimalItems, 100);

    window.addEventListener("resize", calculateOptimalItems);
    return () => window.removeEventListener("resize", calculateOptimalItems);
  }, []);

  return itemsPerPage;
};

export default useOptimalItemsCount;
