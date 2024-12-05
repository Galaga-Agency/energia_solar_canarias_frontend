import React from "react";
import CustomSkeleton from "@/components/LoadingSkeletons/Skeleton";

const GoodweGraphDisplaySkeleton = ({ theme }) => {
  return (
    <div className="bg-transparent rounded-lg p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Title Skeleton */}
          <div className="w-40 h-6">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>
          {/* Refresh Button Skeleton */}
          <div className="w-8 h-8">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0 w-full md:w-auto">
          {/* Range Dropdown Skeleton */}
          <div className="w-24 h-8">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>
          {/* Chart Type Dropdown Skeleton */}
          <div className="w-40 h-8">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="w-full h-96">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>
    </div>
  );
};

export default GoodweGraphDisplaySkeleton;
