import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CustomSkeleton = ({
  count = 1,
  width = "100%",
  height = "100%",
  borderRadius = "0.5rem",
  theme = "light",
}) => {
  const baseColor = theme === "dark" ? "rgba(255, 213, 122, 0.5)" : "#E0E0E0";
  const highlightColor =
    theme === "dark" ? "rgba(255, 213, 122, 0.1)" : "#F5F5F5";

  return (
    <Skeleton
      count={count}
      width={width}
      height={height}
      style={{ borderRadius }}
      baseColor={baseColor}
      highlightColor={highlightColor}
    />
  );
};

export default CustomSkeleton;
