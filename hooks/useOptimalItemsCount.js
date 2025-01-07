import { useState, useEffect } from "react";
import useDeviceType from "./useDeviceType";

export const useOptimalItemsCount = (
  listContainerSelector,
  sidebarSelector,
  itemHeight = 64,
  maxMobileItems = 10
) => {
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const { isMobile, isTablet } = useDeviceType();

  useEffect(() => {
    const calculateOptimalItems = () => {
      const listContainer = document.querySelector(listContainerSelector);
      const sidebar = document.querySelector(sidebarSelector);
      const header = document.querySelector(".header"); // Add this if you have a header
      const footer = document.querySelector(".footer"); // Add this if you have a footer

      if (!listContainer) return;

      // Viewport height
      const viewportHeight = window.innerHeight;

      // Subtract header, footer, and sidebar heights (if present)
      const headerHeight = header?.offsetHeight || 0;
      const footerHeight = footer?.offsetHeight || 0;
      const sidebarHeight = sidebar?.offsetHeight || 0;

      let availableHeight;

      if (isMobile) {
        // On mobile: Use viewport height minus header/footer, cap items at maxMobileItems
        availableHeight = viewportHeight - headerHeight - footerHeight;
        const calculatedItems = Math.floor(availableHeight / itemHeight);
        setItemsPerPage(Math.min(calculatedItems, maxMobileItems));
      } else if (isTablet) {
        // On tablets: Use full list container height
        availableHeight = listContainer.clientHeight;
        const calculatedItems = Math.floor(availableHeight / itemHeight);
        setItemsPerPage(Math.max(3, calculatedItems)); // Ensure at least 3 items
      } else {
        // On desktops: Subtract sidebar height
        availableHeight = listContainer.clientHeight - sidebarHeight - 20; // Add 20px padding
        const calculatedItems = Math.floor(availableHeight / itemHeight);
        setItemsPerPage(Math.max(8, calculatedItems));
      }
    };

    // Run calculation on mount and on resize
    calculateOptimalItems();
    window.addEventListener("resize", calculateOptimalItems);

    return () => window.removeEventListener("resize", calculateOptimalItems);
  }, [
    listContainerSelector,
    sidebarSelector,
    itemHeight,
    maxMobileItems,
    isMobile,
    isTablet,
  ]);

  return itemsPerPage;
};

export default useOptimalItemsCount;
