import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const EquipmentDetailsSkeleton = ({ theme, rows }) => {
  return (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg backdrop-blur-sm shadow-lg p-6">
      <CustomSkeleton
        width="30%"
        height="24px"
        theme={theme}
        className="mb-6"
      />
      <div className="space-y-6">
        {[...Array(rows)].map((_, index) => (
          <div
            key={index}
            className="space-y-4 border-b border-gray-300 dark:border-gray-700 pb-4 last:border-none"
          >
            {/* Section Header */}
            <div className="flex items-center gap-4">
              <CustomSkeleton
                width="24px"
                height="24px"
                theme={theme}
                className="rounded-full"
              />
              <CustomSkeleton width="40%" height="20px" theme={theme} />
              <CustomSkeleton width="15%" height="18px" theme={theme} />
            </div>

            {/* Items Placeholder */}
            <div className="space-y-2 pl-8">
              {[...Array(3)].map((_, idx) => (
                <CustomSkeleton
                  key={idx}
                  width={`${80 - idx * 10}%`}
                  height="18px"
                  theme={theme}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentDetailsSkeleton;
