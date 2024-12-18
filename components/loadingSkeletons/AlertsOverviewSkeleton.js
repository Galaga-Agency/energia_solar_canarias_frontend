import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const AlertsOverviewSkeleton = ({ theme }) => {
  return (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10">
          <CustomSkeleton width="100%" height="100%" theme={theme} circle />
        </div>
        <div className="w-48 h-6">
          <CustomSkeleton width="100%" height="100%" theme={theme} />
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md overflow-hidden">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-600/50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-3 w-3 h-3">
                <CustomSkeleton
                  width="100%"
                  height="100%"
                  theme={theme}
                  circle
                />
              </div>
              <div className="flex-1 h-4">
                <CustomSkeleton width="100%" height="100%" theme={theme} />
              </div>
            </div>
            <div className="w-32 h-4">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-4 flex justify-center">
        <div className="w-32 h-10">
          <CustomSkeleton width="100%" height="100%" theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default AlertsOverviewSkeleton;
