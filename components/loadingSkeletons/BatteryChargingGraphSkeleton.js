import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const BatteryChargingGraphSkeleton = ({ theme }) => {
  return (
    <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 backdrop-blur-sm flex flex-col gap-6">
      {/* Title Skeleton */}
      <div className="w-48 h-8 mb-4">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>

      {/* Graph Skeleton */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: "600px" }}>
          <div className="w-full h-[400px] bg-gray-200/50 dark:bg-gray-700/50 rounded-md">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>
        </div>
      </div>

      {/* Legend and Details */}
      <div className="flex flex-wrap gap-4 justify-between">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* Icon Placeholder */}
            <div className="w-6 h-6">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
            {/* Label */}
            <div className="w-20 h-4">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BatteryChargingGraphSkeleton;
