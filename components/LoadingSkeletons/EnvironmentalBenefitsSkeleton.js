import React from "react";
import CustomSkeleton from "@/components/LoadingSkeletons/Skeleton";

const EnvironmentalBenefitsSkeleton = ({ theme }) => {
  return (
    <section className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 md:pb-8 mb-6 backdrop-blur-sm shadow-lg">
      <div className="w-40 h-8 mb-6">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>
      <div className="flex flex-col justify-around gap-8 sm:gap-12">
        {/* CO2 Emissions Skeleton */}
        <div className="flex flex-col sm:flex-row items-center mx-4 sm:mx-6">
          <div className="w-[100px] h-[100px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] xl:w-[160px] xl:h-[160px] mb-4 sm:mb-0">
            <CustomSkeleton width="100%" height="100%" theme={theme} circle />
          </div>
          <div className="w-full ml-4">
            <div className="h-16 sm:h-24 rounded-lg">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        </div>

        {/* Trees Planted Skeleton */}
        <div className="flex flex-col sm:flex-row items-center mx-4 sm:mx-6">
          <div className="w-full mr-4">
            <div className="h-16 sm:h-24 rounded-lg">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
          <div className="w-[100px] h-[100px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] xl:w-[160px] xl:h-[160px] mt-4 sm:mt-0">
            <CustomSkeleton width="100%" height="100%" theme={theme} circle />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnvironmentalBenefitsSkeleton;
