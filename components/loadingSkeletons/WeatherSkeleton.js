import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";
import useDeviceType from "@/hooks/useDeviceType";

const WeatherSkeleton = ({ theme }) => {
  const { isDesktop } = useDeviceType();

  return (
    <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm flex flex-col h-full">
      {/* Title */}
      <div className="w-40 h-6 mb-4">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>

      {/* Today's Weather Section */}
      <div className="flex flex-1 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center shadow-md items-center justify-between">
        {/* Icon */}
        <div className="flex flex-col items-center">
          <CustomSkeleton width="64px" height="64px" theme={theme} />
          <div className="w-20 h-4 mt-2">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>
        </div>
        {/* Weather Details */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-8">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>
          <div className="w-32 h-4 mt-2">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>
          <div className="w-32 h-4 mt-1">
            <CustomSkeleton width="100%" height="100%" theme={theme} />
          </div>
        </div>
      </div>

      {/* Forecast Section */}
      <div className="flex-1 grid grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {Array.from({ length: isDesktop ? 3 : 2 }).map((_, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center shadow-md"
          >
            {/* Date Placeholder */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-4">
                <CustomSkeleton width="100%" height="100%" theme={theme} />
              </div>
              {/* Temperatures */}
              <div className="w-24 h-6 mt-2">
                <CustomSkeleton width="100%" height="100%" theme={theme} />
              </div>
            </div>
            {/* Icon Placeholder */}
            <div className="flex justify-center">
              <CustomSkeleton width="40px" height="40px" theme={theme} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherSkeleton;
