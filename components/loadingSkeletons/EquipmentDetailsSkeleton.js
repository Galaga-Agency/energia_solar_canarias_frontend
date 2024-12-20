import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const EquipmentDetailsSkeleton = ({ theme, rows, provider }) => {
  return provider === "goodwe" ? (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg backdrop-blur-sm shadow-lg p-6 mb-6">
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
  ) : (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg mb-6">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10">
          <CustomSkeleton width="100%" height="100%" theme={theme} circle />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-48 h-6">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>
          <div className="w-4 h-4">
            <CustomSkeleton width="100%" height="100%" theme={theme} circle />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Specifications Section */}
        <div className="flex-1 relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md">
          {/* Section Title */}
          <div className="w-32 h-6 mx-auto mb-4">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>

          {/* Specification Items */}
          {[...Array(3)].map((_, index) => (
            <div
              key={`spec-${index}`}
              className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-600 last:border-0"
            >
              <div className="w-24 h-4">
                <CustomSkeleton width="100%" height="100%" theme={theme} />
              </div>
              <div className="w-20 h-4">
                <CustomSkeleton width="100%" height="100%" theme={theme} />
              </div>
            </div>
          ))}
        </div>

        {/* Status Section */}
        <div className="flex-1 relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md">
          {/* Section Title */}
          <div className="w-32 h-6 mx-auto mb-4">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>

          {/* Status Items */}
          {[...Array(3)].map((_, index) => (
            <div
              key={`status-${index}`}
              className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-600 last:border-0"
            >
              <div className="w-24 h-4">
                <CustomSkeleton width="100%" height="100%" theme={theme} />
              </div>
              <div className="w-20 h-4">
                <CustomSkeleton width="100%" height="100%" theme={theme} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show More Button */}
      <div className="mt-4 flex justify-center">
        <div className="w-32 h-8">
          <CustomSkeleton width="100%" height="100%" theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailsSkeleton;
