import React from "react";
import CustomSkeleton from "@/components/tempfolder/Skeleton";

const EnergyStatisticsSkeleton = ({ theme }) => {
  return (
    <section className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mb-6 backdrop-blur-sm shadow-lg">
      <div className="w-48 h-8 mb-6">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="relative text-center p-5">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14">
              <CustomSkeleton width="100%" height="100%" theme={theme} circle />
            </div>
            <div className="h-32 mt-4">
              <CustomSkeleton width="100%" height="100%" theme={theme} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EnergyStatisticsSkeleton;
