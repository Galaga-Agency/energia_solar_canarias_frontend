import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const SolarEdgeGraphDisplaySkeleton = ({ theme }) => {
  const PercentageBarSkeleton = () => (
    <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 backdrop-blur-sm shadow-lg">
      {/* Title Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <CustomSkeleton
          width="200px"
          height="24px"
          theme={theme}
          className="rounded-md"
        />
      </div>

      {/* Progress Bar Skeleton */}
      <CustomSkeleton
        width="100%"
        height="24px"
        theme={theme}
        className="rounded-lg"
      />

      {/* Stats Skeleton */}
      <div className="flex justify-between mt-3">
        <CustomSkeleton
          width="150px"
          height="20px"
          theme={theme}
          className="rounded-md"
        />
        <CustomSkeleton
          width="150px"
          height="20px"
          theme={theme}
          className="rounded-md"
        />
      </div>
    </div>
  );

  return (
    <div>
      {/* Two Percentage Bars Skeletons */}
      <div className="mb-6 flex flex-col gap-6">
        <PercentageBarSkeleton />
        <PercentageBarSkeleton />
      </div>

      {/* Chart Skeleton */}
      <div className="w-full h-96">
        <CustomSkeleton
          width="100%"
          height="100%"
          theme={theme}
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default SolarEdgeGraphDisplaySkeleton;
