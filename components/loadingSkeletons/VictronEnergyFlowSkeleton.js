import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const EnergyBlockSkeleton = ({ theme }) => (
  <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 backdrop-blur-sm shadow-lg flex flex-col h-[200px] md:h-[300px]">
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20">
      <CustomSkeleton width="100%" height="100%" theme={theme} rounded />
    </div>
    <div className="flex-1 flex flex-col items-center justify-center mt-12 space-y-4">
      <div className="w-32 h-6">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>
      <div className="w-24 h-8">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>
    </div>
  </div>
);

const VictronEnergyFlowSkeleton = ({ theme }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
      {/* Left Column */}
      <div className="flex flex-col gap-8">
        <EnergyBlockSkeleton theme={theme} />
        <EnergyBlockSkeleton theme={theme} />
      </div>

      {/* Center Column */}
      <div className="flex flex-col gap-8">
        <EnergyBlockSkeleton theme={theme} />
        <EnergyBlockSkeleton theme={theme} />
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-8">
        <EnergyBlockSkeleton theme={theme} />
        <EnergyBlockSkeleton theme={theme} />
      </div>
    </div>
  );
};

export default VictronEnergyFlowSkeleton;
