import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const GoodweEnergyStatisticsSkeleton = ({ theme, batteryLevel }) => {
  return (
    <section
      className={`bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 md:pb-8 mb-6 backdrop-blur-sm shadow-lg ${
        batteryLevel ? "xl:min-w-[40vw]" : "xl:min-w-[calc(50%-36px)]"
      }`}
    >
      {/* Title */}
      <div className="w-48 h-8 mb-6">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md flex flex-col items-center gap-3"
          >
            {/* Floating Icon */}
            <div className="absolute -top-6 w-14 h-14">
              <CustomSkeleton
                width="100%"
                height="100%"
                theme={theme}
                circle
                className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]"
              />
            </div>

            {/* Title */}
            <div className="w-24 h-5 mt-6">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>

            {/* Value */}
            <div className="w-20 h-7">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>

            {/* Info Icon */}
            <div className="absolute top-2 right-2 w-4 h-4">
              <CustomSkeleton width="100%" height="100%" theme={theme} circle />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GoodweEnergyStatisticsSkeleton;
