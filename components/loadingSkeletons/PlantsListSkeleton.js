import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const PlantsListSkeleton = ({ theme, rows }) => {
  return (
    <div className="grid grid-cols-1 gap-6 w-full">
      {[...Array(rows)].map((_, index) => (
        <div
          key={index}
          className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-md hover:shadow-lg transition duration-300"
        >
          <div className="flex items-start sm:items-center justify-between gap-3">
            {/* Left Side - Icon and Name */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-custom-yellow/10 rounded-full flex items-center justify-center">
                <CustomSkeleton
                  width="30px"
                  height="30px"
                  className="rounded-full"
                  theme={theme}
                />
              </div>
              <div className="min-w-0 flex-1">
                <CustomSkeleton
                  width="70%"
                  height="18px"
                  className="mb-2"
                  theme={theme}
                />
                <CustomSkeleton width="60%" height="14px" theme={theme} />
              </div>
            </div>

            {/* Right Side - Status */}
            <div className="flex items-center gap-2">
              <CustomSkeleton
                width="40px"
                height="20px"
                className="rounded-full"
                theme={theme}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantsListSkeleton;
