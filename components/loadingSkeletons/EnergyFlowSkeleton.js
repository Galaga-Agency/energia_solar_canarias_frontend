import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const EnergyFlowSkeleton = ({ theme }) => {
  return (
    <div className="py-6">
      {/* Header Section */}
      <div className="absolute top-20 left-4 md:left-auto md:top-6 md:right-6">
        <div className="w-24 h-4">
          <CustomSkeleton width="100%" height="100%" theme={theme} />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="relative w-full h-[650px] p-4 mt-8">
        {/* Center Logo */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-custom-dark-blue rounded-full w-48 h-48 md:w-64 md:h-64">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full">
              <CustomSkeleton
                width="100%"
                height="100%"
                theme={theme}
                rounded
              />
            </div>
          </div>
        </div>

        {/* Grid Block */}
        <div className="absolute top-0 left-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg p-6 [border-bottom-right-radius:250px] [border-top-left-radius:250px]">
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="absolute -top-6 left-0 md:left-[calc(50%-4rem)] lg:-top-10 w-24 h-24 lg:w-32 lg:h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center">
              <div className="w-16 h-16">
                <CustomSkeleton
                  width="100%"
                  height="100%"
                  theme={theme}
                  rounded
                />
              </div>
            </div>
            <div className="w-24 h-5 mt-16">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
            <div className="w-16 h-6">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        </div>

        {/* Solar Block */}
        <div className="absolute top-0 right-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg p-6 [border-bottom-left-radius:250px] [border-top-right-radius:250px]">
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="absolute -top-6 right-0 md:right-[calc(50%-4rem)] lg:-top-10 w-24 h-24 lg:w-32 lg:h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center">
              <div className="w-16 h-16">
                <CustomSkeleton
                  width="100%"
                  height="100%"
                  theme={theme}
                  rounded
                />
              </div>
            </div>
            <div className="w-24 h-5 mt-16">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
            <div className="w-16 h-6">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        </div>

        {/* Battery Block */}
        <div className="absolute bottom-0 left-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg p-6 [border-top-right-radius:250px] [border-bottom-left-radius:250px]">
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="absolute -bottom-8 left-0 md:left-[calc(50%-4rem)] md:-top-10 w-24 h-24 lg:w-32 lg:h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center">
              <div className="w-16 h-16">
                <CustomSkeleton
                  width="100%"
                  height="100%"
                  theme={theme}
                  rounded
                />
              </div>
            </div>
            <div className="w-24 h-5 mt-16">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
            <div className="w-16 h-6">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        </div>

        {/* Loads Block */}
        <div className="absolute bottom-0 right-0 w-[calc(50%-16px)] h-[calc(50%-16px)] bg-white dark:bg-custom-dark-blue rounded-lg p-6 [border-top-left-radius:250px] [border-bottom-right-radius:250px]">
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="absolute -bottom-8 right-0 md:right-[calc(50%-4rem)] md:-top-10 w-24 h-24 lg:w-32 lg:h-32 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center">
              <div className="w-16 h-16">
                <CustomSkeleton
                  width="100%"
                  height="100%"
                  theme={theme}
                  rounded
                />
              </div>
            </div>
            <div className="w-24 h-5 mt-16">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
            <div className="w-16 h-6">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlowSkeleton;
