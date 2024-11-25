import React from "react";
import CustomSkeleton from "@/components/LoadingSkeletons/Skeleton";

const PerformanceMetricsSkeleton = ({ theme }) => {
  return (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-6 mb-6">
      <div className="w-40 h-6 mb-6">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg shadow-md text-center min-h-[160px]"
          >
            <CustomSkeleton width="40px" height="40px" theme={theme} />
            <div className="w-24 h-6 mt-4">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
            <div className="w-32 h-6 mt-4">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetricsSkeleton;
