import React from "react";
import CustomSkeleton from "@/components/LoadingSkeletons/Skeleton";

const SolarEdgeGraphDisplaySkeleton = ({ theme }) => {
  return (
    <div className="bg-transparent rounded-lg">
      {/* Chart Skeleton */}
      <div className="w-full h-96">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>
    </div>
  );
};

export default SolarEdgeGraphDisplaySkeleton;
