import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const PlantDetailsSkeleton = ({ theme }) => {
  return (
    <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 backdrop-blur-sm flex flex-col justify-between">
      {/* Title */}
      <div className="w-40 h-6 mb-4">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-8 h-8">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
            {/* Label */}
            <div className="w-32 h-6">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
            {/* Value */}
            <div className="flex-1 h-6">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlantDetailsSkeleton;
