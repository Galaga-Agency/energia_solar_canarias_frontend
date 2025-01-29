import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const VictronEnergyGraphSkeleton = ({ theme }) => {
  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex justify-center gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-4 h-4">
              <CustomSkeleton width="100%" height="100%" theme={theme} circle />
            </div>
            <div className="w-20 h-4">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-custom-dark-blue p-6 rounded-xl shadow-lg">
        {/* Graph Area */}
        <div className="overflow-x-auto overflow-y-hidden">
          <div style={{ minWidth: "600px" }}>
            <div className="h-[350px] w-full relative">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
              {/* Y-axis Labels */}
              <div className="absolute left-0 top-0 h-full w-12">
                <div className="h-6 w-full mb-2">
                  <CustomSkeleton width="100%" height="100%" theme={theme} />
                </div>
                <div className="h-6 w-full mb-2">
                  <CustomSkeleton width="100%" height="100%" theme={theme} />
                </div>
                <div className="h-6 w-full">
                  <CustomSkeleton width="100%" height="100%" theme={theme} />
                </div>
              </div>
              {/* X-axis Labels */}
              <div className="absolute bottom-0 left-12 right-0 h-6 flex justify-between">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="w-16 h-full">
                    <CustomSkeleton width="100%" height="100%" theme={theme} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4">
                    <CustomSkeleton
                      width="100%"
                      height="100%"
                      theme={theme}
                      circle
                    />
                  </div>
                  <div className="w-24 h-4">
                    <CustomSkeleton width="100%" height="100%" theme={theme} />
                  </div>
                </div>
                <div className="w-full h-6">
                  <CustomSkeleton width="100%" height="100%" theme={theme} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictronEnergyGraphSkeleton;
