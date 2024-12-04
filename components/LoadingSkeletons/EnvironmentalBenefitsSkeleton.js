import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";
import useDeviceType from "@/hooks/useDeviceType";

const EnvironmentalBenefitsSkeleton = ({ theme, batteryLevel }) => {
  const { isMobile } = useDeviceType();

  return (
    <section
      className={`flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 md:pb-8 mb-6 backdrop-blur-sm shadow-lg ${
        batteryLevel > 0 ? "xl:min-w-[40vw]" : "xl:min-w-[calc(50vw-36px)]"
      }`}
    >
      {/* Title */}
      <div className="w-48 h-8 mb-6">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>

      <div className="flex flex-col justify-around gap-8 sm:gap-12">
        {/* CO2 Emissions Section */}
        <div className="relative flex flex-col sm:flex-row items-center mx-4 sm:mx-6">
          {/* Icon */}
          <div className="absolute -left-4 md:left-4 xl:-left-6 2xl:left-8">
            <div className="w-[100px] h-[100px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] xl:w-[160px] xl:h-[160px]">
              <CustomSkeleton width="100%" height="100%" theme={theme} circle />
            </div>
          </div>

          {/* Content Card */}
          <div className="z-10 bg-slate-50/70 dark:bg-slate-700/50 p-4 sm:p-6 w-full rounded-lg shadow-md">
            <div className="flex flex-col items-end sm:items-center md:items-end gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                {!isMobile && (
                  <div className="w-4 h-4">
                    <CustomSkeleton
                      width="100%"
                      height="100%"
                      theme={theme}
                      circle
                    />
                  </div>
                )}
                <div className="w-36 xl:w-48 h-6">
                  <CustomSkeleton width="100%" height="100%" theme={theme} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isMobile && (
                  <div className="w-4 h-4">
                    <CustomSkeleton
                      width="100%"
                      height="100%"
                      theme={theme}
                      circle
                    />
                  </div>
                )}
                <div className="w-24 h-8">
                  <CustomSkeleton width="100%" height="100%" theme={theme} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trees Planted Section */}
        <div className="relative flex flex-col sm:flex-row items-center mx-4 sm:mx-6">
          {/* Content Card */}
          <div className="z-10 bg-slate-50/70 dark:bg-slate-700/50 p-4 sm:p-6 w-full rounded-lg shadow-md">
            <div className="flex flex-col items-start sm:items-center md:items-start gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-36 xl:w-48 h-6">
                  <CustomSkeleton width="100%" height="100%" theme={theme} />
                </div>
                {!isMobile && (
                  <div className="w-4 h-4">
                    <CustomSkeleton
                      width="100%"
                      height="100%"
                      theme={theme}
                      circle
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-8">
                  <CustomSkeleton width="100%" height="100%" theme={theme} />
                </div>
                {isMobile && (
                  <div className="w-4 h-4">
                    <CustomSkeleton
                      width="100%"
                      height="100%"
                      theme={theme}
                      circle
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Icon */}
          <div className="absolute -right-4 md:right-4 xl:-right-6 2xl:right-8">
            <div className="w-[100px] h-[100px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] xl:w-[160px] xl:h-[160px]">
              <CustomSkeleton width="100%" height="100%" theme={theme} circle />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnvironmentalBenefitsSkeleton;
