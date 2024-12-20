import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const PlantDetailsSkeleton = ({ theme }) => {
  return (
    <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 backdrop-blur-sm flex flex-col justify-between h-full">
      {/* Title */}
      <div className="w-40 h-8 mb-4">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-4">
        {/* Status Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8">
              <CustomSkeleton width="100%" height="100%" theme={theme} circle />
            </div>
            <div className="w-24 h-6">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4">
              <CustomSkeleton width="100%" height="100%" theme={theme} circle />
            </div>
            <div className="w-20 h-6">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        </div>

        {/* Other Rows */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8">
                <CustomSkeleton
                  width="100%"
                  height="100%"
                  theme={theme}
                  circle
                />
              </div>
              <div className="w-24 h-6">
                <CustomSkeleton width="100%" height="100%" theme={theme} />
              </div>
            </div>
            <div className="flex-1 max-w-[200px] h-6 ml-4">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlantDetailsSkeleton;
