import React from "react";
import CustomSkeleton from "@/components/LoadingSkeletons/Skeleton";

const EnergyFlowSkeleton = ({ theme }) => {
  const renderMobileLayout = () => (
    <div className="flex flex-col items-center">
      {/* Solar Panel Skeleton */}
      <div className="w-[180px] flex flex-col items-center mb-32">
        <div className="w-[72px] h-[72px] mb-2">
          <CustomSkeleton width="100%" height="100%" theme={theme} />
        </div>
        <div className="w-full">
          <CustomSkeleton width="100%" height="80px" theme={theme} />
        </div>
      </div>

      {/* Bottom Row Container */}
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center items-end gap-4 md:gap-24">
          {/* House Skeleton */}
          <div className="w-[180px]">
            <div className="flex flex-col items-center">
              <div className="w-[80px] h-[80px] mb-2">
                <CustomSkeleton width="100%" height="100%" theme={theme} />
              </div>
              <div className="w-full">
                <CustomSkeleton width="100%" height="80px" theme={theme} />
              </div>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="w-[180px]">
            <div className="flex flex-col items-center">
              <div className="w-[80px] h-[80px] mb-2">
                <CustomSkeleton width="100%" height="100%" theme={theme} />
              </div>
              <div className="w-full">
                <CustomSkeleton width="100%" height="80px" theme={theme} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesktopLayout = () => (
    <div className="flex flex-row justify-between items-end gap-8">
      {/* House Skeleton */}
      <div className="w-1/3 flex flex-col items-center">
        <div className="w-[150px] h-[150px] mb-4">
          <CustomSkeleton width="100%" height="100%" theme={theme} />
        </div>
        <div className="w-full">
          <CustomSkeleton width="100%" height="100px" theme={theme} />
        </div>
      </div>

      {/* Solar Panel Skeleton */}
      <div className="w-1/3 flex flex-col items-center">
        <div className="w-[150px] h-[150px] mb-4">
          <CustomSkeleton width="100%" height="100%" theme={theme} />
        </div>
        <div className="w-full">
          <CustomSkeleton width="100%" height="100px" theme={theme} />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="w-1/3 flex flex-col items-center">
        <div className="w-[150px] h-[150px] mb-4">
          <CustomSkeleton width="100%" height="100%" theme={theme} />
        </div>
        <div className="w-full">
          <CustomSkeleton width="100%" height="100px" theme={theme} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 mb-6 backdrop-blur-sm">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="w-48 h-8 mb-4">
          <CustomSkeleton width="100%" height="100%" theme={theme} />
        </div>
        <div className="flex items-center justify-between">
          <div className="w-40 h-5">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>
          <div className="w-8 h-8">
            <CustomSkeleton width="100%" height="100%" theme={theme} rounded />
          </div>
        </div>
      </div>

      {/* Responsive Layout Switch */}
      <div className="md:hidden">{renderMobileLayout()}</div>
      <div className="hidden md:block">{renderDesktopLayout()}</div>
    </div>
  );
};

export default EnergyFlowSkeleton;
