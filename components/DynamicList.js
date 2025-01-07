import React, { useState, useEffect, useRef } from "react";

const DynamicList = ({
  items,
  renderItem,
  className = "",
  itemHeight = 100, // Estimated height of each item
  bottomOffset = 100, // Space for pagination etc.
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const containerRef = useRef(null);

  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!containerRef.current) return;

      // Get the viewport height
      const viewportHeight = window.innerHeight;
      // Get the container's top position
      const containerTop = containerRef.current.getBoundingClientRect().top;
      // Calculate available space
      const availableHeight = viewportHeight - containerTop - bottomOffset;
      // Calculate how many items can fit
      const possibleItems = Math.floor(availableHeight / itemHeight);
      // Set a minimum of 3 items and maximum of 20
      const newItemsPerPage = Math.max(3, Math.min(20, possibleItems));

      setItemsPerPage(newItemsPerPage);
    };

    // Calculate initially
    calculateVisibleItems();

    // Recalculate on resize
    window.addEventListener("resize", calculateVisibleItems);

    return () => {
      window.removeEventListener("resize", calculateVisibleItems);
    };
  }, [itemHeight, bottomOffset]);

  // Calculate visible items
  const visibleItems = items.slice(0, itemsPerPage);

  return (
    <div ref={containerRef} className={`flex flex-col ${className}`}>
      {visibleItems.map((item, index) => (
        <div key={item.id || index} style={{ height: itemHeight }}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

export default DynamicList;
